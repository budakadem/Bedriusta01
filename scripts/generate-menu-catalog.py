"""Build the web menu catalog and responsive product images from source files.

The website never reads the Excel/CSV files at runtime. Run this script when the
menu workbook or the top-level generated photos change. Source PNG files remain
untouched; the script only writes optimized derivatives below public/menu.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import shutil
import unicodedata
from pathlib import Path

from openpyxl import load_workbook
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_WORKBOOK = Path(r"C:\Users\ademb\Desktop\menü resim eklenmis\v6 135\webmenü version 135.xlsx")
DEFAULT_IMAGES = Path(r"C:\Users\ademb\Desktop\menü foto üretilen")
DEFAULT_TABLES = Path(r"C:\Users\ademb\Desktop\bedri_usta_tablesv2.csv")

# Preserve established Turkish product names across every locale while keeping
# the translated qualifier that helps guests understand the variation.
PRODUCT_NAME_OVERRIDES = {
    "202": {"DE": "Elinazik mit Lammfleisch", "ENG": "Elinazik with Lamb"},
    "203": {"DE": "Elinazik mit Lammhack", "ENG": "Elinazik with Minced Lamb"},
}

PRODUCT_ORIGINAL_NAME_OVERRIDES = {
    "467": "Ayran, 0,3 l",
    "468": "Şalgam, 0,3 l",
}

def clean(value):
    if value is None:
        return ""
    return str(value).strip()


def normalized_id(value):
    text = clean(value)
    if not re.fullmatch(r"\d{1,3}", text):
        return ""
    return text.zfill(3)


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()
    return value or "urun"


def rows_by_id(sheet, language: str):
    result = {}
    for row in sheet.iter_rows(min_row=4, values_only=True):
        item_id = normalized_id(row[0])
        price_index = 4 if language == "TR" else 5
        if not item_id or not isinstance(row[price_index], (int, float)):
            continue
        if language == "TR":
            result[item_id] = {
                "section": clean(row[1]),
                "category": clean(row[2]),
                "originalName": clean(row[3]),
                "name": clean(row[3]),
                "price": float(row[4]),
                "description": clean(row[5]),
                "vegan": clean(row[6]).lower() == "evet",
                "vegetarian": clean(row[7]).lower() == "evet",
                "allergens": clean(row[8]),
                "codes": clean(row[9]),
            }
        else:
            result[item_id] = {
                "section": clean(row[1]),
                "category": clean(row[2]),
                "originalName": clean(row[3]),
                "name": clean(row[4]) or clean(row[3]),
                "price": float(row[5]),
                "description": clean(row[6]),
                "vegan": clean(row[7]).lower() in {"ja", "yes"},
                "vegetarian": clean(row[8]).lower() in {"ja", "yes"},
                "allergens": clean(row[9]),
                "codes": clean(row[10]),
            }
    return result


def build_catalog(workbook_path: Path, images_dir: Path):
    workbook = load_workbook(workbook_path, data_only=True, read_only=True)
    sheets = {"TR": workbook[workbook.sheetnames[0]], "DE": workbook["Deutsch"], "ENG": workbook["English"]}
    localized = {language: rows_by_id(sheet, language) for language, sheet in sheets.items()}

    image_sources = {}
    if images_dir.exists():
        for path in images_dir.iterdir():
            if not path.is_file() or path.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
                continue
            match = re.match(r"^(\d{1,3})(?:\D|$)", path.name)
            if match:
                image_sources[match.group(1).zfill(3)] = path

    image_output = ROOT / "public" / "menu" / "products"
    image_output.mkdir(parents=True, exist_ok=True)
    keep = set()
    items = []

    for item_id, tr in localized["TR"].items():
        de = localized["DE"].get(item_id, tr)
        eng = localized["ENG"].get(item_id, tr)
        for language, entry in (("DE", de), ("ENG", eng)):
            override = PRODUCT_NAME_OVERRIDES.get(item_id, {}).get(language)
            if override:
                entry["name"] = override
        slug = slugify(tr["originalName"])
        original_name_override = PRODUCT_ORIGINAL_NAME_OVERRIDES.get(item_id)
        if original_name_override:
            for entry in (tr, de, eng):
                entry["originalName"] = original_name_override
            tr["name"] = original_name_override
        image = None
        source = image_sources.get(item_id)
        if source:
            image = {"alt": {"TR": tr["name"], "DE": de["name"], "ENG": eng["name"]}}
            with Image.open(source) as opened:
                rgb = opened.convert("RGB")
                for width, quality in ((320, 76), (640, 80), (1200, 84)):
                    target_width = min(width, rgb.width)
                    target_height = round(rgb.height * target_width / rgb.width)
                    target_name = f"{item_id}-{slug}-{width}.webp"
                    target = image_output / target_name
                    keep.add(target_name)
                    if not target.exists() or target.stat().st_mtime < source.stat().st_mtime:
                        resized = rgb.resize((target_width, target_height), Image.Resampling.LANCZOS)
                        resized.save(target, "WEBP", quality=quality, method=6)
                    image[str(width)] = f"/menu/products/{target_name}"

        items.append({
            "id": item_id,
            "slug": f"{item_id}-{slug}",
            "price": tr["price"],
            "vegan": tr["vegan"],
            "vegetarian": tr["vegetarian"],
            "image": image,
            "locales": {
                language: {
                    "section": entry["section"],
                    "category": entry["category"],
                    "originalName": entry["originalName"],
                    "name": entry["name"],
                    "description": entry["description"],
                    "allergens": entry["allergens"],
                    "codes": entry["codes"],
                }
                for language, entry in (("TR", tr), ("DE", de), ("ENG", eng))
            },
        })

    for old_image in image_output.glob("*.webp"):
        if old_image.name not in keep:
            old_image.unlink()

    legends = {}
    for language, sheet in sheets.items():
        entries = []
        reading = False
        for row in sheet.iter_rows(values_only=True):
            first = clean(row[0])
            second = clean(row[1]) if len(row) > 1 else ""
            if first in {"Kod", "Kennzeichnung", "Code"}:
                reading = True
                continue
            if reading and first and second:
                entries.append({"code": first, "label": second})
        legends[language] = entries

    version_match = re.search(r"version\s*(\d+)", workbook_path.stem, flags=re.IGNORECASE)
    version = int(version_match.group(1)) if version_match else 1
    return {"version": version, "count": len(items), "legends": legends, "items": items}


def build_tables(csv_path: Path):
    tables = {}
    with csv_path.open("r", encoding="utf-8-sig", errors="replace", newline="") as source:
        for row in csv.reader(source, delimiter=";"):
            if not row or not clean(row[0]).isdigit() or len(row) < 3:
                continue
            tables[clean(row[2])] = int(clean(row[0]))
    return tables


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--workbook", type=Path, default=DEFAULT_WORKBOOK)
    parser.add_argument("--images", type=Path, default=DEFAULT_IMAGES)
    parser.add_argument("--tables", type=Path, default=DEFAULT_TABLES)
    args = parser.parse_args()

    generated = ROOT / "src" / "menu" / "generated"
    generated.mkdir(parents=True, exist_ok=True)
    catalog = build_catalog(args.workbook, args.images)
    tables = build_tables(args.tables)
    (generated / "menu-catalog.json").write_text(json.dumps(catalog, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (generated / "table-tokens.json").write_text(json.dumps(tables, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    logo_source = Path(r"C:\Users\ademb\Desktop\Logo bordo Mannheim.png")
    logo_target = ROOT / "public" / "menu" / "bedri-usta-mannheim-logo.png"
    logo_target.parent.mkdir(parents=True, exist_ok=True)
    if logo_source.exists():
        shutil.copy2(logo_source, logo_target)

    print(f"Generated {catalog['count']} products, {sum(1 for item in catalog['items'] if item['image'])} image sets and {len(tables)} table tokens.")


if __name__ == "__main__":
    main()
