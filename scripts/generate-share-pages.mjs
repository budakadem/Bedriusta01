import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const distRoot = path.join(projectRoot, "dist");
const sourceHtml = await readFile(path.join(distRoot, "index.html"), "utf8");
const jobsSource = await readFile(path.join(projectRoot, "src", "components", "JobsPage.tsx"), "utf8");
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || "bedriusta-mannheim.vercel.app";
const productionOrigin = `https://${productionHost}`;
const shareImage = `${productionOrigin}/images/mannheim-editorial-hero-v2.webp`;

const pages = [
  {
    route: "/menu",
    title: "Menü | Bedri Usta Mannheim",
    description: "Bedri Usta Mannheim menüsünü, kebapları, taş fırın lezzetlerini, mezeleri ve tatlıları keşfet."
  },
  {
    route: "/hakkimizda",
    title: "Hakkımızda | Bedri Usta Mannheim",
    description: "Bedri Usta’nın ustalık yolculuğunu ve Mannheim’daki Türk misafirperverliği anlayışını keşfet."
  },
  {
    route: "/iletisim",
    title: "İletişim | Bedri Usta Mannheim",
    description: "Bedri Usta Mannheim ile iletişime geç; adres, çalışma saatleri, telefon, e-posta ve sosyal medya kanallarını tek sayfada bul."
  },
  {
    route: "/politikalarimiz",
    title: "Politikalarımız | Bedri Usta Mannheim",
    description: "Bedri Usta Mannheim kalite, hijyen, gıda güvenliği ve veri koruma politikalarını incele."
  },
  {
    route: "/datenschutz",
    title: "Datenschutz | Bedri Usta Mannheim",
    description: "Bedri Usta Mannheim web sitesi, PWA, bildirimler, iletişim ve iş başvuruları için veri koruma bilgilendirmesi."
  },
  {
    route: "/datenschutz/bewerbung",
    title: "Datenschutz | Bedri Usta Mannheim",
    description: "Bedri Usta Mannheim web sitesi, PWA, bildirimler, iletişim ve iş başvuruları için veri koruma bilgilendirmesi."
  },
  {
    route: "/golden-tabla-club",
    title: "Golden Tabla Club | Bedri Usta",
    description: "Bedri Usta’nın Avrupa esnaf ağı. Üyelere özel indirimler, partner fırsatları ve online kampanyalar tek yerde."
  },
  {
    route: "/rezervasyon",
    title: "Rezervasyon | Bedri Usta Mannheim",
    description: "Bedri Usta Mannheim için kişi sayını, tarihini ve saatini seç; rezervasyonunu veya grup talebini güvenli biçimde hazırla."
  },
  {
    route: "/jobs",
    title: "Ekibimize Katıl | Bedri Usta Mannheim",
    description: "Bedri Usta Mannheim açık pozisyonlarını keşfet ve hızlıca başvur."
  },
  {
    route: "/impressum",
    title: "Impressum | Bedri Usta Mannheim",
    description: "Bedri Usta Mannheim için § 5 DDG ve § 18 Abs. 2 MStV kapsamındaki yasal işletme bilgilendirmesi."
  },
  {
    route: "/agb",
    title: "AGB | Bedri Usta Mannheim",
    description: "Bedri Usta Mannheim rezervasyon ve restoran ziyareti için geçerli genel işlem şartları."
  }
];

const jobPattern = /slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?summary:\s*"([^"]+)"/g;
for (const match of jobsSource.matchAll(jobPattern)) {
  const [, slug, title, summary] = match;
  const metadata = {
    title: `${title} | Bedri Usta Mannheim`,
    description: `${summary} Pozisyonu incele ve Bedri Usta Mannheim ekibine başvur.`
  };
  pages.push({ route: `/jobs/${slug}`, ...metadata });
  pages.push({ route: `/jobs/${slug}/bewerbung`, ...metadata });
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceMeta(html, selector, value) {
  const escaped = escapeHtml(value);
  return html.replace(selector, (tag) => tag.replace(/content="[^"]*"/, `content="${escaped}"`));
}

for (const page of pages) {
  const canonicalUrl = `${productionOrigin}${page.route}`;
  let html = sourceHtml.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  html = replaceMeta(html, /<meta\s+name="description"[^>]*>/, page.description);
  html = replaceMeta(html, /<meta\s+property="og:title"[^>]*>/, page.title);
  html = replaceMeta(html, /<meta\s+property="og:description"[^>]*>/, page.description);
  html = replaceMeta(html, /<meta\s+property="og:image"[^>]*>/, shareImage);
  html = replaceMeta(html, /<meta\s+property="og:url"[^>]*>/, canonicalUrl);
  html = replaceMeta(html, /<meta\s+name="twitter:title"[^>]*>/, page.title);
  html = replaceMeta(html, /<meta\s+name="twitter:description"[^>]*>/, page.description);
  html = replaceMeta(html, /<meta\s+name="twitter:image"[^>]*>/, shareImage);
  html = html.replace(/<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`);

  const outputDirectory = path.join(distRoot, ...page.route.split("/").filter(Boolean));
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, "index.html"), html, "utf8");
}

console.log(`Generated ${pages.length} route-specific share pages.`);
