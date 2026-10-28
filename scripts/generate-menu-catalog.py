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
DEFAULT_WORKBOOK = ROOT / "deliverables" / "bedri-usta-webmenu-version-138-tr-de-en.xlsx"
DEFAULT_IMAGES = Path(r"C:\Users\ademb\Desktop\menü foto üretilen")
DEFAULT_TABLES = Path(r"C:\Users\ademb\Desktop\bedri_usta_tablesv2.csv")

# Preserve established Turkish product names across every locale while keeping
# the translated qualifier that helps guests understand the variation.
PRODUCT_NAME_OVERRIDES = {
    "200": {"TR": "Adana", "DE": "Adana", "ENG": "Adana"},
    "202": {"DE": "Elinazik mit Lammfleisch", "ENG": "Elinazik with Lamb"},
    "203": {"DE": "Elinazik mit Lammhack", "ENG": "Elinazik with Minced Lamb"},
    "456": {"DE": "Fanta, 0,33 l", "ENG": "Fanta, 0,33 l"},
    "457": {"DE": "Sprite, 0,33 l", "ENG": "Sprite, 0,33 l"},
    "460": {"DE": "Gazoz, 0,25 l", "ENG": "Gazoz, 0,25 l"},
    "370": {"TR": "Lahmacun", "DE": "Lahmacun", "ENG": "Lahmacun"},
    "950": {"DE": "Hamburger mit Country Potatoes", "ENG": "Hamburger with Country Potatoes"},
    "951": {"DE": "Cheeseburger mit Country Potatoes", "ENG": "Cheeseburger with Country Potatoes"},
    "952": {"DE": "Crispy Chicken Burger mit Country Potatoes", "ENG": "Crispy Chicken Burger with Country Potatoes"},
}

PRODUCT_ORIGINAL_NAME_OVERRIDES = {
    "200": "Adana",
    "370": "Lahmacun",
    "467": "Ayran, 0,3 l",
    "468": "Şalgam, 0,3 l",
    "950": "Hamburger, Country Potatoes ile",
    "951": "Cheeseburger, Country Potatoes ile",
    "952": "Crispy Burger, Country Potatoes ile",
}

PRODUCT_DESCRIPTION_OVERRIDES = {
    "082": {
        "TR": "Günün mutfak seçimi; güncel çorba için lütfen servis personeline sorunuz",
        "DE": "Tagesauswahl der Küche; bitte fragen Sie unser Servicepersonal nach der aktuellen Suppe",
        "ENG": "The kitchen's daily choice; please ask our service team about today's soup",
    },
    "108": {
        "TR": "Peynirli yufka sarımı, dört adet; marul, kırmızı lahana, yoğurt, domates ve salatalık ile",
        "DE": "Vier Yufka-Röllchen mit Käsefüllung; mit Salat, Rotkohl, Joghurt, Tomaten und Gurken",
        "ENG": "Four cheese-filled yufka rolls; with lettuce, red cabbage, yoghurt, tomatoes and cucumber",
    },
    "221": {
        "TR": "Dana etiyle hazırlanan ızgara köfte, domates ve biber",
        "DE": "Gegrillte Köfte aus Rindfleisch, Tomate und Paprika",
        "ENG": "Grilled beef köfte, tomato and pepper",
    },
    "242": {
        "TR": "350 g dana bonfile, Kräuter tereyağı, sivri biber, domates",
        "DE": "350 g Rinderfilet, Kräuterbutter, Peperoni und Tomate",
        "ENG": "350 g beef tenderloin, herb butter, long green pepper and tomato",
    },
    "207": {
        "TR": "Adana, kuzu şiş, tavuk şiş, pirzola",
        "DE": "Adana, Lammspieß, Hähnchenspieß, Lammkotelett",
        "ENG": "Adana, lamb skewer, chicken skewer, lamb chop",
    },
    "320": {
        "TR": "Kuzu eti, domates, soğan, sarımsak, sivri biber",
        "DE": "Lammfleisch, Tomaten, Zwiebeln, Knoblauch, Peperoni",
        "ENG": "Lamb, tomato, onions, garlic, long green pepper",
    },
    "345": {
        "TR": "Tavuk eti, sivri biber ve domates",
        "DE": "Hähnchenfleisch, Peperoni und Tomate",
        "ENG": "Chicken, long green pepper and tomato",
    },
    "532": {
        "TR": "Süt, çikolata, krema, kakao tozu",
        "DE": "Milch, Schokolade, Sahne, Kakaopulver",
        "ENG": "Milk, chocolate, cream, cocoa powder",
    },
}

SERVICE_CHOICE_CATEGORIES = {"KOMBİ"}
SERVICE_CHOICE_REMOVAL_CATEGORIES = {"KEBAPLAR", "ETLER"}
SERVICE_CHOICE_TEXT = {
    "TR": "patates kızartması veya pilav ile",
    "DE": "mit Pommes frites oder Reis",
    "ENG": "with French fries or rice",
}

SERVICE_CHOICE_MARKERS = {
    "TR": ("patates kızartması", "pilav"),
    "DE": ("pommes", "reis"),
    "ENG": ("fries", "rice"),
}

# Availability is an independent menu dimension. Products keep their real
# section/category and are filtered for Restaurant or Café at runtime.
CAFE_ONLY_DRINK_PRODUCT_IDS = {
    "492", "493", "494", "495", "496", "497", "498",
    "550", "551",
    "570", "571", "572",
    "590", "591", "592", "593", "594",
    "610", "611", "612", "613", "614", "615", "616",
    "640", "641", "642",
    "660", "661", "662",
    "680", "681", "682", "683", "684", "685",
    "700", "701", "702", "703",
}

CAFE_ONLY_PRODUCT_IDS = CAFE_ONLY_DRINK_PRODUCT_IDS | {
    "770", "771", "772",
    "790", "791", "792", "793", "794", "795", "796", "797", "798", "799", "800", "801", "802",
    "820", "821", "822", "823", "824", "825", "826", "827", "828",
    "850", "851",
}

VALID_AVAILABILITY = {"restaurant", "cafe", "both"}

# Visibility is intentionally separate from the workbook's Show/availability
# value. This keeps every product in the catalog and preserves favourite IDs,
# while allowing each venue view to be changed without deleting menu data.
RESTAURANT_HIDDEN_PRODUCT_IDS = {
    "002", "008", "009", "011", "017", "019", "021", "024", "026", "029", "030", "034",
    "082", "104", "180", "183", "184", "201", "202", "205", "208", "214", "220", "240",
    "243", "244", "340", "341", "371", "373", "375", "377", "379", "380", "381", "382",
    "383", "384", "386", "414", "435", "453", "521", "522", "527", "528", "529", "530",
    "531", "532", "210", "242", "321", "345",
}
RESTAURANT_HIDDEN_CATEGORIES = {"STEAKLER", "KOMBİ", "MAKARNALAR", "HAMBURGER"}
CAFE_VISIBLE_SECTIONS = {"İÇECEKLER", "TATLILAR", "CAFÉ"}
HIDDEN_EVERYWHERE_PRODUCT_IDS = {"453"}

PRODUCT_ALLERGEN_OVERRIDES = {
    "082": {
        "TR": "Alerjen bilgisi için lütfen servis personeline sorunuz",
        "DE": "Bitte fragen Sie unser Servicepersonal nach den Allergenen",
        "ENG": "Please ask our service team for allergen information",
    },
}

PRODUCT_CODE_OVERRIDES = {"082": {"TR": "", "DE": "", "ENG": ""}}

# Remove only the explicitly corrected allergen/additive codes. The matching
# localized labels are removed in lockstep below, so codes and visible copy can
# never drift apart between Turkish, German and English.
PRODUCT_CODE_REMOVALS = {
    "019": {"H3", "H7"},
    "024": {"H7"},
    "080": {"G"},
    "081": {"O"},
    "083": {"C", "G", "L", "O"},
    "101": {"G"},
    "102": {"G"},
    "130": {"G"},
    "160": {"G"},
    "162": {"L"},
    "180": {"H"},
    "182": {"C", "L"},
    "183": {"C", "O"},
    "202": {"C"},
    "203": {"C"},
    "221": {"G"},
    "320": {"G"},
    "321": {"G"},
    "340": {"G"},
    "342": {"G"},
    "343": {"G"},
    "344": {"G"},
    "345": {"G"},
    "372": {"C"},
    "373": {"C"},
    "374": {"C"},
    "375": {"C"},
    "376": {"C"},
    "377": {"C", "4"},
    "378": {"C"},
    "379": {"C"},
    "380": {"C"},
    "382": {"C"},
    "383": {"C"},
    "384": {"C"},
    "387": {"C", "8"},
    "410": {"C"},
    "411": {"C"},
    "412": {"C"},
    "413": {"C"},
    "415": {"C"},
    "430": {"C", "8"},
    "431": {"C", "8"},
    "432": {"C", "8"},
    "433": {"C", "8"},
    "434": {"C", "8"},
    "435": {"C", "8"},
    "532": {"F"},
}

ADDITIONAL_PRODUCTS = {
    "083": {
        "TR": {
            "section": "YEMEKLER",
            "category": "ÇORBALAR",
            "originalName": "Kelle Paça",
            "name": "Kelle Paça",
            "price": 8.9,
            "description": "Kelle ve paça eti, baharatlı çorba, pul biberli yağ",
            "vegan": False,
            "vegetarian": False,
            "allergens": "Gluten içeren tahıllar (Buğday), Kükürt dioksit ve sülfitler",
            "codes": "A1, O",
        },
        "DE": {
            "section": "Speisen",
            "category": "Suppen",
            "originalName": "Kelle Paça",
            "name": "Lammkopf- und Fußsuppe",
            "price": 8.9,
            "description": "Lammkopf- und Lammfußfleisch, kräftige Gewürzsuppe, Chiliöl",
            "vegan": False,
            "vegetarian": False,
            "allergens": "Glutenhaltiges Getreide (Weizen), Schwefeldioxid und Sulfite",
            "codes": "A1, O",
        },
        "ENG": {
            "section": "Food",
            "category": "Soups",
            "originalName": "Kelle Paça",
            "name": "Lamb Head and Trotter Soup",
            "price": 8.9,
            "description": "Lamb head and trotter meat, richly spiced soup, chilli oil",
            "vegan": False,
            "vegetarian": False,
            "allergens": "Cereals containing gluten (wheat), Sulphur dioxide and sulphites",
            "codes": "A1, O",
        },
    },
    "950": {
        "TR": {
            "section": "YEMEKLER",
            "category": "HAMBURGER",
            "originalName": "Hamburger, patates kızartması ile",
            "name": "Hamburger, Country Potatoes ile",
            "price": 14.9,
            "description": "200 g dana köftesi, domates, kornişon turşu, marul, hamburger sosu",
            "vegan": False,
            "vegetarian": False,
            "allergens": "Gluten içeren tahıllar (Buğday)",
            "codes": "A1",
        },
        "DE": {
            "section": "Speisen",
            "category": "Burger",
            "originalName": "Hamburger, patates kızartması ile",
            "name": "Hamburger mit Country Potatoes",
            "price": 14.9,
            "description": "200-g-Rindfleisch-Patty, Tomaten, Gewürzgurken, Salatblatt, Hamburgersoße",
            "vegan": False,
            "vegetarian": False,
            "allergens": "Glutenhaltiges Getreide (Weizen)",
            "codes": "A1",
        },
        "ENG": {
            "section": "Food",
            "category": "Burgers",
            "originalName": "Hamburger, patates kızartması ile",
            "name": "Hamburger with Country Potatoes",
            "price": 14.9,
            "description": "200 g beef patty, tomatoes, pickles, lettuce, burger sauce",
            "vegan": False,
            "vegetarian": False,
            "allergens": "Cereals containing gluten (wheat)",
            "codes": "A1",
        },
    },
    "951": {
        "TR": {
            "section": "YEMEKLER",
            "category": "HAMBURGER",
            "originalName": "Cheeseburger, patates kızartması ile",
            "name": "Cheeseburger, Country Potatoes ile",
            "price": 15.9,
            "description": "200 g dana köftesi, cheddar, domates, karamelize soğan, kornişon turşu, marul, hamburger sosu",
            "vegan": False,
            "vegetarian": False,
            "allergens": "Gluten içeren tahıllar (Buğday), Süt (laktoz dahil)",
            "codes": "A1, G",
        },
        "DE": {
            "section": "Speisen",
            "category": "Burger",
            "originalName": "Cheeseburger, patates kızartması ile",
            "name": "Cheeseburger mit Country Potatoes",
            "price": 15.9,
            "description": "200-g-Rindfleisch-Patty, Cheddar, Tomaten, karamellisierte Zwiebeln, Gewürzgurken, Salatblatt, Hamburgersoße",
            "vegan": False,
            "vegetarian": False,
            "allergens": "Glutenhaltiges Getreide (Weizen), Milch (inkl. Laktose)",
            "codes": "A1, G",
        },
        "ENG": {
            "section": "Food",
            "category": "Burgers",
            "originalName": "Cheeseburger, patates kızartması ile",
            "name": "Cheeseburger with Country Potatoes",
            "price": 15.9,
            "description": "200 g beef patty, cheddar, tomatoes, caramelised onions, pickles, lettuce, burger sauce",
            "vegan": False,
            "vegetarian": False,
            "allergens": "Cereals containing gluten (wheat), Milk (including lactose)",
            "codes": "A1, G",
        },
    },
    "952": {
        "TR": {
            "section": "YEMEKLER",
            "category": "HAMBURGER",
            "originalName": "Crispy Burger, patates kızartması ile",
            "name": "Crispy Burger, Country Potatoes ile",
            "price": 13.9,
            "description": "200 g çıtır tavuk göğsü, marul, hamburger sosu",
            "vegan": False,
            "vegetarian": False,
            "allergens": "Gluten içeren tahıllar (Buğday)",
            "codes": "A1",
        },
        "DE": {
            "section": "Speisen",
            "category": "Burger",
            "originalName": "Crispy Burger, patates kızartması ile",
            "name": "Crispy Chicken Burger mit Country Potatoes",
            "price": 13.9,
            "description": "200 g knusprige Hähnchenbrust, Salatblatt, Hamburgersoße",
            "vegan": False,
            "vegetarian": False,
            "allergens": "Glutenhaltiges Getreide (Weizen)",
            "codes": "A1",
        },
        "ENG": {
            "section": "Food",
            "category": "Burgers",
            "originalName": "Crispy Burger, patates kızartması ile",
            "name": "Crispy Chicken Burger with Country Potatoes",
            "price": 13.9,
            "description": "200 g crispy chicken breast, lettuce, burger sauce",
            "vegan": False,
            "vegetarian": False,
            "allergens": "Cereals containing gluten (wheat)",
            "codes": "A1",
        },
    },
}

ADDITIONAL_PRODUCT_INSERTIONS = {"082": ("083",), "435": ("950", "951", "952")}

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


def remove_product_codes(entry, codes_to_remove):
    """Remove codes and their parallel localized labels without rewriting copy."""
    if not codes_to_remove:
        return

    codes = [part.strip() for part in entry["codes"].split(",") if part.strip()]
    allergens = [part.strip() for part in entry["allergens"].split(",") if part.strip()]
    if len(codes) != len(allergens):
        raise ValueError(f"Allergen/code mismatch: {entry['name']} ({entry['codes']})")

    kept = [(code, allergen) for code, allergen in zip(codes, allergens) if code not in codes_to_remove]
    entry["codes"] = ", ".join(code for code, _ in kept)
    entry["allergens"] = ", ".join(allergen for _, allergen in kept)


def remove_service_choice(description: str, language: str) -> str:
    patterns = {
        "TR": r"\s*[,;]?\s*patates kızartması veya (?:pirinç )?pilav(?:ı)? ile\s*$",
        "DE": r"\s*[,;]?\s*mit pommes(?: frites)? oder reis\s*$",
        "ENG": r"\s*[,;]?\s*with (?:french )?fries or rice\s*$",
    }
    return re.sub(patterns[language], "", description, flags=re.IGNORECASE).rstrip(" ,;")


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
                "availability": clean(row[10]).lower() if len(row) > 10 else "",
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
                "availability": clean(row[11]).lower() if len(row) > 11 else "",
            }
    return result


def build_catalog(workbook_path: Path, images_dir: Path):
    workbook = load_workbook(workbook_path, data_only=True, read_only=True)
    sheets = {"TR": workbook[workbook.sheetnames[0]], "DE": workbook["Deutsch"], "ENG": workbook["English"]}
    localized = {language: rows_by_id(sheet, language) for language, sheet in sheets.items()}
    for language, entries in localized.items():
        merged = {}
        for item_id, entry in entries.items():
            merged[item_id] = entry
            for additional_id in ADDITIONAL_PRODUCT_INSERTIONS.get(item_id, ()):
                merged[additional_id] = ADDITIONAL_PRODUCTS[additional_id][language].copy()
        localized[language] = merged

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
        declared_availability = {
            entry["availability"]
            for entry in (tr, de, eng)
            if entry.get("availability")
        }
        invalid_availability = declared_availability - VALID_AVAILABILITY
        if invalid_availability:
            raise ValueError(f"Invalid Show value for {item_id}: {sorted(invalid_availability)}")
        if len(declared_availability) > 1:
            raise ValueError(f"Show mismatch between language sheets for {item_id}: {sorted(declared_availability)}")
        availability = next(iter(declared_availability), "cafe" if item_id in CAFE_ONLY_PRODUCT_IDS else "both")
        for language, entry in (("TR", tr), ("DE", de), ("ENG", eng)):
            override = PRODUCT_NAME_OVERRIDES.get(item_id, {}).get(language)
            if override:
                entry["name"] = override
        for language, entry in (("TR", tr), ("DE", de), ("ENG", eng)):
            description_override = PRODUCT_DESCRIPTION_OVERRIDES.get(item_id, {}).get(language)
            if description_override:
                entry["description"] = description_override
            allergen_override = PRODUCT_ALLERGEN_OVERRIDES.get(item_id, {}).get(language)
            if allergen_override:
                entry["allergens"] = allergen_override
            code_override = PRODUCT_CODE_OVERRIDES.get(item_id, {}).get(language)
            if code_override is not None:
                entry["codes"] = code_override
            remove_product_codes(entry, PRODUCT_CODE_REMOVALS.get(item_id))
            if tr["category"] in SERVICE_CHOICE_REMOVAL_CATEGORIES:
                entry["description"] = remove_service_choice(entry["description"], language)
            service_choice = SERVICE_CHOICE_TEXT[language]
            description_lower = entry["description"].lower()
            already_has_service_choice = all(marker in description_lower for marker in SERVICE_CHOICE_MARKERS[language])
            if tr["category"] in SERVICE_CHOICE_CATEGORIES and not already_has_service_choice:
                entry["description"] = f"{entry['description'].rstrip(' ,;')}, {service_choice}"
        slug = slugify(tr["originalName"])
        original_name_override = PRODUCT_ORIGINAL_NAME_OVERRIDES.get(item_id)
        if original_name_override:
            for entry in (tr, de, eng):
                entry["originalName"] = original_name_override
            tr["name"] = original_name_override
        restaurant_visible = (
            availability in {"restaurant", "both"}
            and item_id not in RESTAURANT_HIDDEN_PRODUCT_IDS
            and tr["category"] not in RESTAURANT_HIDDEN_CATEGORIES
            and item_id not in HIDDEN_EVERYWHERE_PRODUCT_IDS
        )
        cafe_visible = (
            tr["section"] in CAFE_VISIBLE_SECTIONS
            and item_id not in HIDDEN_EVERYWHERE_PRODUCT_IDS
        )
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
            "availability": availability,
            "visibility": {
                "restaurant": restaurant_visible,
                "cafe": cafe_visible,
            },
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

    version_match = re.search(r"version[\s_-]*(\d+)", workbook_path.stem, flags=re.IGNORECASE)
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
