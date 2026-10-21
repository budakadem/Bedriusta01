import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { CustomerReviewSection } from "../CustomerReviewSection";
import { openCookiePreferences } from "../CookieNotice";
import { getIntlLocale, useSiteLanguage, type SiteLanguage } from "../../siteLanguage";
import catalogSource from "../../menu/generated/menu-catalog.json";
import tableTokens from "../../menu/generated/table-tokens.json";
import "./menu-experience.css";

type LocaleContent = {
  section: string;
  category: string;
  originalName: string;
  name: string;
  description: string;
  allergens: string;
  codes: string;
};

type MenuImage = {
  "320": string;
  "640": string;
  "1200": string;
  alt: Record<SiteLanguage, string>;
};

type MenuItem = {
  id: string;
  slug: string;
  price: number;
  availability: MenuAvailability;
  vegan: boolean;
  vegetarian: boolean;
  image: MenuImage | null;
  locales: Record<SiteLanguage, LocaleContent>;
};

type MenuCatalog = {
  version: number;
  count: number;
  legends: Record<SiteLanguage, Array<{ code: string; label: string }>>;
  items: MenuItem[];
};

type MenuGroup = "food" | "drinks" | "desserts" | "cafe";
type MenuMode = "restaurant" | "cafe";
type MenuAvailability = MenuMode | "both";
type DietFilter = "all" | "vegetarian" | "vegan";

const catalog = catalogSource as MenuCatalog;
const tableMap = tableTokens as Record<string, number>;
const FAVORITES_KEY = "bedriusta-menu-favorites-v1";

const sectionToGroup: Record<string, MenuGroup> = {
  YEMEKLER: "food",
  "İÇECEKLER": "drinks",
  TATLILAR: "desserts",
  "CAFÉ": "cafe"
};

const copy = {
  TR: {
    title: "MENÜ · MANNHEIM",
    table: "MASA",
    lead: "Mezeden kebaba, taş fırından tatlıya; ürünler ve açık alerjen bilgileriyle tüm menü tek sayfada.",
    hint: "Beğendiğiniz ürünleri favorilerinize ekleyin; masada ürün numaralarını ekibimize kolayca iletin.",
    invalidTable: "Masa bağlantısı doğrulanamadı. Menünün tamamını yine de inceleyebilirsiniz.",
    favorites: "Favoriler",
    favoritesEmpty: "Henüz favori eklemediniz.",
    favoritesHelp: "Kalbe dokunduğunuz ürünler bu cihazda saklanır.",
    close: "Kapat",
    all: "Tümü",
    vegetarian: "Vejetaryen",
    vegan: "Vegan",
    groups: { food: "Yemekler", drinks: "İçecekler", desserts: "Tatlılar", cafe: "Nargile" },
    cafeDrinks: "Café İçecekler",
    cafeAllDrinksHint: "Genel ve Café içecekleri numara sırasıyla burada da listelenir; favorileriniz her iki bölümde aynıdır.",
    drinkCategories: "İçecek kategorileri",
    itemCount: "ürün",
    totalProducts: (count: number) => `TOPLAM ${count} ÜRÜN`,
    halalLogo: "Helal işletme",
    alcoholFreeLogo: "Alkolsüz işletme",
    allergenDetails: "Alerjenler ve katkı maddeleri",
    imageDisclaimer: "Görsel temsilidir; sunum ve içerik farklılık gösterebilir.",
    noImage: "Görsel hazırlanıyor",
    originalName: "Orijinal adı",
    allergenGuide: "Alerjen ve kod rehberi",
    allergenButton: "ALERJENLER",
    codeButton: "KOD REHBERİ",
    allergenNotice: "Lütfen sipariş vermeden önce alerjilerinizi ve intoleranslarınızı servis personelimize bildiriniz. Tarifler ve içerikler değişebilir; özenli hazırlığa rağmen alerjen izleri tamamen önlenemeyebilir.",
    wifi: "MİSAFİR WI-FI",
    network: "Ağ adı",
    password: "Şifre",
    copy: "Kopyala",
    copied: "Kopyalandı",
    tableServices: "Masanızdan hızlı erişim",
    socials: "Bizi takip edin",
    comingSoon: "Yakında",
    detail: "Ürün ayrıntısı",
    backToMenu: "Menüye dön",
    favoriteAdd: "Favorilere ekle",
    favoriteRemove: "Favorilerden çıkar",
    restaurant: "Restaurant",
    cafeMode: "Café",
    venueMenu: "Menü bölümü",
    cafeOnlyFavorites: "Yalnızca Café’den sipariş verilebilir",
    restaurantOnlyFavorites: "Yalnızca Restaurant’tan sipariş verilebilir",
    wifiOpen: "WLAN bilgileri",
    wifiClose: "WLAN bilgilerini kapat",
    copyPassword: "Şifreyi kopyala",
    wifiNotice: "Şifre yalnızca QR veya NFC masa menüsünden giriş yapan misafirlerimize gösterilir.",
    cafeAgeNotice: "Nargile servisi yalnızca 18 yaş ve üzeri misafirler içindir. Yaş doğrulaması istenebilir."
  },
  DE: {
    title: "SPEISEKARTE · MANNHEIM",
    table: "TISCH",
    lead: "Von Meze und Kebab bis Steinofen und Dessert: die gesamte Karte mit transparenten Allergenangaben.",
    hint: "Speichern Sie Ihre Favoriten und nennen Sie unserem Team am Tisch einfach die Artikelnummern.",
    invalidTable: "Der Tisch-Link konnte nicht bestätigt werden. Die vollständige Karte bleibt verfügbar.",
    favorites: "Favoriten",
    favoritesEmpty: "Noch keine Favoriten gespeichert.",
    favoritesHelp: "Artikel mit Herz werden auf diesem Gerät gespeichert.",
    close: "Schließen",
    all: "Alle",
    vegetarian: "Vegetarisch",
    vegan: "Vegan",
    groups: { food: "Speisen", drinks: "Getränke", desserts: "Desserts", cafe: "Shisha" },
    cafeDrinks: "Café-Getränke",
    cafeAllDrinksHint: "Allgemeine und Café-Getränke sind hier nach Artikelnummer sortiert; Ihre Favoriten bleiben in beiden Bereichen identisch.",
    drinkCategories: "Getränkekategorien",
    itemCount: "Artikel",
    totalProducts: (count: number) => `${count} PRODUKTE INSGESAMT`,
    halalLogo: "Halal-Betrieb",
    alcoholFreeLogo: "Alkoholfreier Betrieb",
    allergenDetails: "Allergene und Zusatzstoffe",
    imageDisclaimer: "Abbildung beispielhaft; Anrichtung und Inhalt können abweichen.",
    noImage: "Abbildung folgt",
    originalName: "Originalname",
    allergenGuide: "Allergene und Kennzeichnungen",
    allergenButton: "ALLERGENE",
    codeButton: "CODE-LEGENDE",
    allergenNotice: "Bitte informieren Sie unser Servicepersonal vor der Bestellung über Ihre Allergien und Unverträglichkeiten. Rezepturen und Zutaten können sich ändern. Trotz sorgfältiger Zubereitung können Spuren von Allergenen nicht ausgeschlossen werden.",
    wifi: "GÄSTE-WLAN",
    network: "Netzwerk",
    password: "Passwort",
    copy: "Kopieren",
    copied: "Kopiert",
    tableServices: "Direkt am Tisch",
    socials: "Folgen Sie uns",
    comingSoon: "Demnächst",
    detail: "Produktdetails",
    backToMenu: "Zurück zur Karte",
    favoriteAdd: "Zu Favoriten",
    favoriteRemove: "Aus Favoriten entfernen",
    restaurant: "Restaurant",
    cafeMode: "Café",
    venueMenu: "Menübereich",
    cafeOnlyFavorites: "Nur im Café bestellbar",
    restaurantOnlyFavorites: "Nur im Restaurant bestellbar",
    wifiOpen: "WLAN-Daten",
    wifiClose: "WLAN-Daten schließen",
    copyPassword: "Passwort kopieren",
    wifiNotice: "Das Passwort wird nur Gästen angezeigt, die das Tischmenü per QR-Code oder NFC geöffnet haben.",
    cafeAgeNotice: "Shisha-Service nur für Gäste ab 18 Jahren. Ein Altersnachweis kann verlangt werden."
  },
  ENG: {
    title: "MENU · MANNHEIM",
    table: "TABLE",
    lead: "From meze and kebabs to stone-oven dishes and desserts: the complete menu with clear allergen information.",
    hint: "Save your favourites and simply tell our team the item numbers at your table.",
    invalidTable: "This table link could not be verified. You can still browse the full menu.",
    favorites: "Favourites",
    favoritesEmpty: "No favourites saved yet.",
    favoritesHelp: "Hearted items are saved on this device.",
    close: "Close",
    all: "All",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    groups: { food: "Food", drinks: "Drinks", desserts: "Desserts", cafe: "Hookah" },
    cafeDrinks: "Café Drinks",
    cafeAllDrinksHint: "General and Café drinks are listed here by item number; your favourites stay the same in both sections.",
    drinkCategories: "Drink categories",
    itemCount: "items",
    totalProducts: (count: number) => `${count} PRODUCTS IN TOTAL`,
    halalLogo: "Halal restaurant",
    alcoholFreeLogo: "Alcohol-free restaurant",
    allergenDetails: "Allergens and additives",
    imageDisclaimer: "Image for reference; presentation and contents may vary.",
    noImage: "Image coming soon",
    originalName: "Original name",
    allergenGuide: "Allergens and code guide",
    allergenButton: "ALLERGENS",
    codeButton: "CODE GUIDE",
    allergenNotice: "Please inform our service team about allergies or intolerances before ordering. Recipes and ingredients may change, and traces of allergens cannot be completely excluded despite careful preparation.",
    wifi: "GUEST WI-FI",
    network: "Network",
    password: "Password",
    copy: "Copy",
    copied: "Copied",
    tableServices: "Quick access at your table",
    socials: "Follow us",
    comingSoon: "Coming soon",
    detail: "Product details",
    backToMenu: "Back to menu",
    favoriteAdd: "Add to favourites",
    favoriteRemove: "Remove from favourites",
    restaurant: "Restaurant",
    cafeMode: "Café",
    venueMenu: "Menu area",
    cafeOnlyFavorites: "Available to order only in the Café",
    restaurantOnlyFavorites: "Available to order only in the Restaurant",
    wifiOpen: "Wi-Fi details",
    wifiClose: "Close Wi-Fi details",
    copyPassword: "Copy password",
    wifiNotice: "The password is shown only to guests who open the table menu via QR code or NFC.",
    cafeAgeNotice: "Hookah service is available only to guests aged 18 and over. Proof of age may be requested."
  }
} as const;

const restaurantGroupOrder: MenuGroup[] = ["food", "drinks", "desserts"];
const cafeGroupOrder: MenuGroup[] = ["drinks", "desserts", "cafe", "food"];

function getGroup(item: MenuItem): MenuGroup {
  return sectionToGroup[item.locales.TR.section] ?? "food";
}

function isAvailableInMode(item: MenuItem, mode: MenuMode) {
  return item.availability === "both" || item.availability === mode;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function getProductAllergenLabels(item: MenuItem, language: SiteLanguage) {
  const text = copy[language];
  const dietLabels = new Set([text.vegan, text.vegetarian].map((label) => label.toLocaleLowerCase(getIntlLocale(language))));
  return item.locales[language].allergens
    .split(",")
    .map((label) => label.trim())
    .filter((label) => label && !dietLabels.has(label.toLocaleLowerCase(getIntlLocale(language))));
}

function readFavorites() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

function ScrollRail({ children, className = "", ariaLabel }: { children: ReactNode; className?: string; ariaLabel: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setCanScrollLeft(track.scrollLeft > 3);
      setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 3);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => { track.removeEventListener("scroll", update); observer.disconnect(); };
  }, [children]);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const buttons = Array.from(track.querySelectorAll<HTMLElement>(":scope > button"));
    if (!buttons.length) return;
    const leadingPadding = Number.parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    const leadingEdge = track.scrollLeft + leadingPadding + 2;
    const firstVisibleIndex = Math.max(0, buttons.findIndex((button) => button.offsetLeft + button.offsetWidth > leadingEdge));
    const targetIndex = Math.min(buttons.length - 1, Math.max(0, firstVisibleIndex + direction));
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    const targetLeft = Math.min(maxScrollLeft, Math.max(0, buttons[targetIndex].offsetLeft - leadingPadding));
    track.scrollTo({ left: targetLeft, behavior: "smooth" });
  };
  const hasOverflow = canScrollLeft || canScrollRight;
  return (
    <div className={`menu-scroll-rail ${className}${hasOverflow ? " has-overflow" : ""}`}>
      {hasOverflow && <button type="button" className="menu-scroll-rail__arrow menu-scroll-rail__arrow--left" onClick={() => move(-1)} disabled={!canScrollLeft} aria-label={`${ariaLabel} sola kaydır`}>‹</button>}
      <div ref={trackRef} className="menu-scroll-rail__track" aria-label={ariaLabel}>{children}</div>
      {hasOverflow && <button type="button" className="menu-scroll-rail__arrow menu-scroll-rail__arrow--right" onClick={() => move(1)} disabled={!canScrollRight} aria-label={`${ariaLabel} sağa kaydır`}>›</button>}
    </div>
  );
}

function ProductImage({ item, language, eager = false, full = false }: { item: MenuItem; language: SiteLanguage; eager?: boolean; full?: boolean }) {
  if (!item.image) {
    return <div className="menu-product__placeholder"><span>BU</span><small>{copy[language].noImage}</small></div>;
  }
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${item.image["320"]} 320w, ${item.image["640"]} 640w, ${item.image["1200"]} 1200w`}
        sizes={full ? "(max-width: 680px) calc(100vw - 60px), 480px" : "(max-width: 560px) 96px, 152px"}
      />
      <img
        src={full ? item.image["1200"] : item.image["640"]}
        alt={item.image.alt[language]}
        width="640"
        height="426"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}

function FavoriteButton({ item, active, onToggle, language }: { item: MenuItem; active: boolean; onToggle: () => void; language: SiteLanguage }) {
  return (
    <button
      type="button"
      className={`menu-favorite-button${active ? " is-active" : ""}`}
      onClick={(event) => { event.stopPropagation(); onToggle(); }}
      aria-pressed={active}
      aria-label={`${active ? copy[language].favoriteRemove : copy[language].favoriteAdd}: ${item.locales[language].name}`}
    >
      <span className="menu-favorite-button__icon" aria-hidden="true">{active ? "♥" : "♡"}</span>
    </button>
  );
}

function ProductCard({ item, language, active, onToggle, onOpen, eager }: {
  item: MenuItem;
  language: SiteLanguage;
  active: boolean;
  onToggle: () => void;
  onOpen: () => void;
  eager: boolean;
}) {
  const text = copy[language];
  const locale = item.locales[language];
  const allergenLabels = getProductAllergenLabels(item, language);
  const price = new Intl.NumberFormat(getIntlLocale(language), { style: "currency", currency: "EUR" }).format(item.price);
  return (
    <article className="menu-product">
      <button type="button" className="menu-product__open-hitbox" onClick={onOpen} aria-label={`${text.detail}: ${locale.name}`} />
      <div className="menu-product__media" aria-hidden="true">
        <ProductImage item={item} language={language} eager={eager} />
      </div>
      <div className="menu-product__body">
        <div className="menu-product__topline">
          <span className="menu-product__number">{item.id}</span>
          <h4 className="menu-product__title">{locale.originalName}</h4>
          <strong className="menu-product__price">{price}</strong>
          <FavoriteButton item={item} language={language} active={active} onToggle={onToggle} />
        </div>
        {locale.originalName !== locale.name && <p className="menu-product__original">{locale.name}</p>}
        <p className="menu-product__description">{locale.description}</p>
        <div className="menu-product__meta">
          {item.vegan && <span className="menu-diet menu-diet--vegan">◆ {text.vegan}</span>}
          {!item.vegan && item.vegetarian && <span className="menu-diet">● {text.vegetarian}</span>}
          {allergenLabels.length > 0 && (
            <a href="#menu-allergens" className="menu-product__allergen-labels" aria-label={`${text.allergenDetails}: ${allergenLabels.join(", ")}`}>
              {allergenLabels.join(" · ")}
            </a>
          )}
        </div>
        {item.image && <small className="menu-product__image-note">{text.imageDisclaimer}</small>}
      </div>
    </article>
  );
}

export function MenuExperiencePage({ tableToken, productSlug }: { tableToken?: string; productSlug?: string }) {
  const language = useSiteLanguage();
  const text = copy[language];
  const tableNumber = tableToken ? tableMap[tableToken] : undefined;
  const tableMode = Boolean(tableNumber);
  const invalidTable = Boolean(tableToken && !tableNumber);
  const initialMenuMode: MenuMode = tableNumber && tableNumber >= 300 && tableNumber <= 399 ? "cafe" : "restaurant";
  const [menuMode, setMenuMode] = useState<MenuMode>(initialMenuMode);
  const [diet, setDiet] = useState<DietFilter>("all");
  const [activeGroup, setActiveGroup] = useState<MenuGroup>(initialMenuMode === "cafe" ? "drinks" : "food");
  const [favorites, setFavorites] = useState<string[]>(readFavorites);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [groupMenuOpen, setGroupMenuOpen] = useState(false);
  const [wifiOpen, setWifiOpen] = useState(false);
  const [favoriteBurst, setFavoriteBurst] = useState(0);
  const [copiedValue, setCopiedValue] = useState("");
  const selectedProduct = productSlug ? catalog.items.find((item) => item.slug === productSlug) : undefined;
  const dialogReturnFocus = useRef<HTMLElement | null>(null);
  const groupMenuRef = useRef<HTMLDivElement>(null);
  const wifiRef = useRef<HTMLDivElement>(null);
  const viewGroupOrder = menuMode === "cafe" ? cafeGroupOrder : restaurantGroupOrder;

  const visibleItems = useMemo(
    () => catalog.items.filter((item) => isAvailableInMode(item, menuMode) && (diet === "all" || (diet === "vegan" ? item.vegan : item.vegetarian || item.vegan))),
    [diet, menuMode]
  );
  const grouped = useMemo(() => viewGroupOrder.map((group) => ({
    group,
    categories: Array.from(new Set(visibleItems
      .filter((item) => getGroup(item) === group)
      .map((item) => item.locales[language].category)))
  })).filter(({ categories }) => categories.length > 0), [language, viewGroupOrder, visibleItems]);
  const foodNavigationCategories = useMemo(
    () => Array.from(new Set(visibleItems.filter((item) => getGroup(item) === "food").map((item) => item.locales[language].category))),
    [language, visibleItems]
  );
  const navigationGroups = useMemo(() => {
    const order: MenuGroup[] = menuMode === "cafe" ? ["drinks", "desserts", "cafe"] : ["drinks", "desserts"];
    return order.filter((group) => visibleItems.some((item) => getGroup(item) === group));
  }, [menuMode, visibleItems]);
  const favoriteItems = useMemo(() => catalog.items.filter((item) => favorites.includes(item.id)), [favorites]);
  const sharedFavoriteItems = useMemo(() => favoriteItems.filter((item) => item.availability === "both"), [favoriteItems]);
  const cafeFavoriteItems = useMemo(() => favoriteItems.filter((item) => item.availability === "cafe"), [favoriteItems]);
  const restaurantFavoriteItems = useMemo(() => favoriteItems.filter((item) => item.availability === "restaurant"), [favoriteItems]);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!groupMenuOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!groupMenuRef.current?.contains(event.target as Node)) setGroupMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGroupMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [groupMenuOpen]);

  useEffect(() => {
    if (!wifiOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!wifiRef.current?.contains(event.target as Node)) setWifiOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWifiOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [wifiOpen]);

  useEffect(() => {
    let frame = 0;
    const updateActiveGroup = () => {
      frame = 0;
      const guideLine = window.innerWidth <= 900 ? 320 : 360;
      const sections = viewGroupOrder.map((group) => ({ group, bounds: document.getElementById(`menu-group-${group}`)?.getBoundingClientRect() }));
      const current = sections.find(({ bounds }) => bounds && bounds.top <= guideLine && bounds.bottom > guideLine)?.group;
      const nearest = [...sections].reverse().find(({ bounds }) => bounds && bounds.top <= guideLine)?.group;
      setActiveGroup(current ?? nearest ?? viewGroupOrder[0]);
    };
    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveGroup);
    };
    updateActiveGroup();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [menuMode]);

  useEffect(() => {
    if (!selectedProduct && !favoritesOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [favoritesOpen, selectedProduct]);

  useEffect(() => {
    if (productSlug && !selectedProduct) navigateToBase();
  }, [productSlug, selectedProduct]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const adding = !current.includes(id);
      const next = adding ? [...current, id] : current.filter((value) => value !== id);
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      if (adding) setFavoriteBurst(Date.now());
      return next;
    });
  };

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const basePath = tableToken ? `/menu/t/${tableToken}` : "/menu";
  const navigateToBase = () => navigate(basePath);
  const openProduct = (item: MenuItem) => {
    dialogReturnFocus.current = document.activeElement as HTMLElement;
    navigate(`${basePath}/${item.slug}`);
  };
  const closeProduct = () => {
    navigateToBase();
    window.setTimeout(() => dialogReturnFocus.current?.focus(), 0);
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const jumpToGroup = (group: MenuGroup, firstCategory = false) => {
    const firstCategoryName = visibleItems.find((item) => getGroup(item) === group)?.locales[language].category;
    const targetId = firstCategory && firstCategoryName
      ? `menu-category-${group}-${slugify(firstCategoryName)}`
      : `menu-group-${group}`;

    setDiet("all");
    setActiveGroup(group);
    setGroupMenuOpen(false);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => scrollTo(targetId)));
  };
  const jumpToCategory = (group: MenuGroup, category: string) => {
    setDiet("all");
    setActiveGroup(group);
    setGroupMenuOpen(false);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => scrollTo(`menu-category-${group}-${slugify(category)}`)));
  };
  const changeMenuMode = (nextMode: MenuMode) => {
    const firstGroup: MenuGroup = nextMode === "cafe" ? "drinks" : "food";
    setMenuMode(nextMode);
    setActiveGroup(firstGroup);
    setGroupMenuOpen(false);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => scrollTo(`menu-group-${firstGroup}`)));
  };
  const copyValue = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedValue(value);
    window.setTimeout(() => setCopiedValue(""), 1800);
  };

  return (
    <main className="menu-experience">
      <div className="menu-header-context menu-header-context--table">
        <div className="menu-table-badge" aria-label={tableNumber ? `${text.table} ${tableNumber}` : text.table}>
          <small>{text.table}</small><strong>{tableNumber ?? "…"}</strong>
        </div>
      </div>

      <section className="menu-hero" aria-labelledby="menu-title">
        <h1 id="menu-title" className="menu-visually-hidden">{text.title}</h1>
        <p className="menu-hero__page-label" aria-hidden="true">Bedri Usta Menü</p>
        {tableMode && (
          <div className="menu-hero__wifi" ref={wifiRef}>
            <button
              type="button"
              className={`menu-wifi-trigger${wifiOpen ? " is-open" : ""}`}
              onClick={() => setWifiOpen((open) => !open)}
              aria-label={wifiOpen ? text.wifiClose : text.wifiOpen}
              aria-expanded={wifiOpen}
            >
              <span aria-hidden="true">⌁</span><small>WLAN</small>
            </button>
            {wifiOpen && (
              <div className="menu-wifi-popover" role="dialog" aria-label={text.wifiOpen}>
                <small>{text.wifi}</small>
                <div className="menu-wifi-popover__network"><span>{text.network}</span><strong>Bedri Usta Gast</strong></div>
                <p className="menu-wifi-popover__notice">{text.wifiNotice}</p>
                <div><span>{text.password}</span><b>•••••••••</b></div>
                <div className="menu-wifi-popover__actions">
                  <button type="button" onClick={() => copyValue("Bedri2026")}>{copiedValue === "Bedri2026" ? text.copied : text.copyPassword}</button>
                </div>
              </div>
            )}
          </div>
        )}
        {invalidTable && <p className="menu-hero__notice" role="status">{text.invalidTable}</p>}
        <p className="menu-hero__statement">{text.hint}</p>
        <div className="menu-reference-navigation" aria-label={text.allergenGuide}>
          <img src="/images/menu/halal.webp" alt={text.halalLogo} width="512" height="512" />
          <button type="button" onClick={() => scrollTo("menu-allergens")}>{text.allergenGuide}</button>
          <img src="/images/menu/alcohol-free.webp" alt={text.alcoholFreeLogo} width="512" height="512" />
        </div>
        <p className="menu-total-products" aria-live="polite">{text.totalProducts(catalog.items.length)}</p>
      </section>

      <nav className="menu-controls" aria-label={text.title}>
        <div className="menu-controls__inner">
          <div className="menu-primary-controls">
            <div className="menu-mode-select" ref={groupMenuRef} aria-label={text.venueMenu}>
              <div className="menu-mode-switch">
                {(["restaurant", "cafe"] as MenuMode[]).map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    className={menuMode === mode ? "is-active" : ""}
                    onClick={() => changeMenuMode(mode)}
                    aria-pressed={menuMode === mode}
                  >
                    {mode === "restaurant" ? text.restaurant : text.cafeMode}
                  </button>
                ))}
                <button
                  type="button"
                  className="menu-mode-switch__menu"
                  onClick={() => setGroupMenuOpen((open) => !open)}
                  aria-expanded={groupMenuOpen}
                  aria-haspopup="menu"
                  aria-label={text.venueMenu}
                >
                  <span aria-hidden="true">⌄</span>
                </button>
              </div>
              {groupMenuOpen && (
                <div className="menu-group-dropdown" role="menu">
                  {(["drinks", "desserts"] as MenuGroup[]).map((group) => (
                    <button
                      type="button"
                      role="menuitem"
                      className={activeGroup === group ? "is-active" : ""}
                      key={group}
                      onClick={() => jumpToGroup(group, group === "cafe")}
                    >
                      {text.groups[group]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {(["vegetarian", "vegan"] as DietFilter[]).map((filter) => (
              <button type="button" key={filter} className={`menu-diet-filter menu-diet-filter--${filter}${diet === filter ? " is-active" : ""}`} onClick={() => { setDiet((current) => current === filter ? "all" : filter); setGroupMenuOpen(false); }} aria-pressed={diet === filter}>
                {filter === "vegetarian" ? text.vegetarian : text.vegan}
              </button>
            ))}
            <button type="button" className="menu-controls-favorite" onClick={() => { setGroupMenuOpen(false); setFavoritesOpen(true); }} aria-label={`${text.favorites}: ${favorites.length}`}>
              <span aria-hidden="true">♥</span><span className="menu-controls-favorite__label">{text.favorites}</span><b>{favorites.length}</b>
              {favoriteBurst > 0 && <span className="header-menu-favorite__confetti" key={favoriteBurst} aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</span>}
            </button>
          </div>
          <ScrollRail className="menu-active-categories" ariaLabel={text.title}>
            {navigationGroups.map((group) => (
              <button type="button" className="menu-active-categories__group-jump" key={`group-jump-${group}`} onClick={() => jumpToGroup(group)}>{text.groups[group]}</button>
            ))}
            {foodNavigationCategories.map((category) => (
              <button type="button" key={`food-navigation-${category}`} onClick={() => jumpToCategory("food", category)}>{category}</button>
            ))}
          </ScrollRail>
        </div>
      </nav>

      <div className="menu-catalog">
        {grouped.map(({ group, categories }, groupIndex) => (
          <section className="menu-group" id={`menu-group-${group}`} key={group}>
            <header className="menu-group__header">
              <p>0{groupIndex + 1}</p>
              <h2>{text.groups[group]}</h2>
              <span>{visibleItems.filter((item) => getGroup(item) === group).length} {text.itemCount}</span>
            </header>
            {group === "cafe" && (
              <p className="menu-cafe-age-notice"><strong>18+</strong><span>{text.cafeAgeNotice}</span></p>
            )}
            {group === "drinks" && categories.length > 0 && (
              <nav className="menu-drink-shortcuts" aria-label={text.drinkCategories}>
                {categories.map((category) => (
                  <button type="button" key={`drink-shortcut-${category}`} onClick={() => jumpToCategory("drinks", category)}>
                    {category}
                  </button>
                ))}
              </nav>
            )}
            {categories.map((category) => {
              const items = visibleItems.filter((item) => getGroup(item) === group && item.locales[language].category === category);
              return (
                <section className="menu-category" id={`menu-category-${group}-${slugify(category)}`} key={category}>
                  <div className="menu-category__heading">
                    <div><h3>{category}</h3></div>
                    <span>{items.length} {text.itemCount}</span>
                  </div>
                  <div className="menu-product-list">
                    {items.map((item, index) => (
                      <ProductCard key={item.id} item={item} language={language} active={favorites.includes(item.id)} onToggle={() => toggleFavorite(item.id)} onOpen={() => openProduct(item)} eager={groupIndex === 0 && index < 2} />
                    ))}
                  </div>
                </section>
              );
            })}
          </section>
        ))}
      </div>

      <section className="menu-allergens" id="menu-allergens" aria-labelledby="menu-allergens-title">
        <p className="menu-section-kicker">{text.allergenButton}</p>
        <h2 id="menu-allergens-title">{text.allergenGuide}</h2>
        <p className="menu-allergens__notice">{text.allergenNotice}</p>
        <dl>
          {catalog.legends[language].map((entry) => <div key={`${entry.code}-${entry.label}`}><dt>{entry.code}</dt><dd>{entry.label}</dd></div>)}
        </dl>
      </section>

      {tableMode && (
        <div className="menu-table-extras">
          <CustomerReviewSection />
          <section className="menu-socials" aria-labelledby="menu-socials-title">
            <p className="menu-section-kicker">{text.tableServices}</p>
            <h2 id="menu-socials-title">{text.socials}</h2>
            <div>
              <a href="https://www.instagram.com/mannheim_bedriusta" target="_blank" rel="noreferrer"><img src="/icons/ui/instagram-outline.svg" alt="" />Instagram</a>
              <span aria-disabled="true"><img src="/icons/ui/tiktok-outline.svg" alt="" />TikTok <small>{text.comingSoon}</small></span>
              <a href="https://www.youtube.com/c/BedriUsta" target="_blank" rel="noreferrer"><img src="/icons/ui/youtube-outline.svg" alt="" />YouTube</a>
              <span aria-disabled="true"><img src="/icons/ui/facebook-outline.svg" alt="" />Facebook <small>{text.comingSoon}</small></span>
            </div>
          </section>
          <nav className="menu-legal" aria-label="Legal">
            <a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a><button type="button" onClick={openCookiePreferences}>Cookie-Einstellungen</button><a href="/agb">AGB</a>
          </nav>
        </div>
      )}

      {favoritesOpen && (
        <div className="menu-overlay" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setFavoritesOpen(false); }}>
          <aside className="menu-favorites-panel" role="dialog" aria-modal="true" aria-labelledby="menu-favorites-title">
            <header><div><p>{favorites.length} {text.itemCount}</p><h2 id="menu-favorites-title">{text.favorites}</h2></div><button type="button" onClick={() => setFavoritesOpen(false)} aria-label={text.close}>×</button></header>
            <button type="button" className="menu-favorites-panel__back" onClick={() => setFavoritesOpen(false)}>← {text.backToMenu}</button>
            <p className="menu-favorites-panel__help">{text.favoritesHelp}</p>
            {favoriteItems.length === 0 ? <p className="menu-favorites-panel__empty">{text.favoritesEmpty}</p> : (
              <div className="menu-favorites-panel__groups">
                {sharedFavoriteItems.map((item) => <ProductCard key={item.id} item={item} language={language} active onToggle={() => toggleFavorite(item.id)} onOpen={() => { setFavoritesOpen(false); openProduct(item); }} eager={false} />)}
                {cafeFavoriteItems.length > 0 && (
                  <section className="menu-favorites-panel__exclusive">
                    <h3>{text.cafeOnlyFavorites}</h3>
                    {cafeFavoriteItems.map((item) => <ProductCard key={item.id} item={item} language={language} active onToggle={() => toggleFavorite(item.id)} onOpen={() => { setFavoritesOpen(false); openProduct(item); }} eager={false} />)}
                  </section>
                )}
                {restaurantFavoriteItems.length > 0 && (
                  <section className="menu-favorites-panel__exclusive">
                    <h3>{text.restaurantOnlyFavorites}</h3>
                    {restaurantFavoriteItems.map((item) => <ProductCard key={item.id} item={item} language={language} active onToggle={() => toggleFavorite(item.id)} onOpen={() => { setFavoritesOpen(false); openProduct(item); }} eager={false} />)}
                  </section>
                )}
              </div>
            )}
          </aside>
        </div>
      )}

      {selectedProduct && (
        <div className="menu-overlay menu-overlay--detail" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) closeProduct(); }}>
          <section className="menu-detail" role="dialog" aria-modal="true" aria-labelledby="menu-detail-title">
            <button type="button" className="menu-detail__close" onClick={closeProduct} aria-label={text.close}>×</button>
            <div className="menu-detail__media"><ProductImage item={selectedProduct} language={language} eager full /></div>
            <div className="menu-detail__copy">
              <p>{text.detail} · {selectedProduct.id}</p>
              <h2 id="menu-detail-title">{selectedProduct.locales[language].originalName}</h2>
              {selectedProduct.locales[language].originalName !== selectedProduct.locales[language].name && <p className="menu-detail__localized-name">{selectedProduct.locales[language].name}</p>}
              <strong>{new Intl.NumberFormat(getIntlLocale(language), { style: "currency", currency: "EUR" }).format(selectedProduct.price)}</strong>
              <p>{selectedProduct.locales[language].description}</p>
              {(selectedProduct.vegan || selectedProduct.vegetarian) && (
                <p className={`menu-detail__diet${selectedProduct.vegan ? " menu-detail__diet--vegan" : ""}`}>
                  {selectedProduct.vegan ? `◆ ${text.vegan}` : `● ${text.vegetarian}`}
                </p>
              )}
              {getProductAllergenLabels(selectedProduct, language).length > 0 && (
                <p className="menu-detail__allergens">
                  <strong>{text.allergenDetails}</strong>
                  <span>{getProductAllergenLabels(selectedProduct, language).join(" · ")}</span>
                </p>
              )}
              <button type="button" className={`menu-detail__favorite${favorites.includes(selectedProduct.id) ? " is-active" : ""}`} onClick={() => toggleFavorite(selectedProduct.id)}>
                <span aria-hidden="true">{favorites.includes(selectedProduct.id) ? "♥" : "♡"}</span>
                {favorites.includes(selectedProduct.id) ? text.favoriteRemove : text.favoriteAdd}
              </button>
              <small>{text.imageDisclaimer}</small>
              <button type="button" className="menu-detail__back" onClick={closeProduct}><span aria-hidden="true">←</span> {text.backToMenu}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
