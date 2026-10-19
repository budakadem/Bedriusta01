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
    groups: { food: "Yemekler", drinks: "İçecekler", desserts: "Tatlılar", cafe: "Café" },
    itemCount: "ürün",
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
    favoriteRemove: "Favorilerden çıkar"
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
    groups: { food: "Speisen", drinks: "Getränke", desserts: "Desserts", cafe: "Café" },
    itemCount: "Artikel",
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
    favoriteRemove: "Aus Favoriten entfernen"
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
    groups: { food: "Food", drinks: "Drinks", desserts: "Desserts", cafe: "Café" },
    itemCount: "items",
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
    favoriteRemove: "Remove from favourites"
  }
} as const;

const groupOrder: MenuGroup[] = ["food", "drinks", "desserts", "cafe"];

function getGroup(item: MenuItem): MenuGroup {
  return sectionToGroup[item.locales.TR.section] ?? "food";
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
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

  const move = (direction: -1 | 1) => trackRef.current?.scrollBy({ left: direction * Math.max(220, trackRef.current.clientWidth * .72), behavior: "smooth" });
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
          {locale.codes && <a href="#menu-allergens" className="menu-product__codes">{locale.codes}</a>}
        </div>
        {item.image && <small className="menu-product__image-note">{text.imageDisclaimer}</small>}
      </div>
    </article>
  );
}

export function MenuExperiencePage({ tableToken, productSlug }: { tableToken?: string; productSlug?: string }) {
  const language = useSiteLanguage();
  const text = copy[language];
  const [diet, setDiet] = useState<DietFilter>("all");
  const [activeGroup, setActiveGroup] = useState<MenuGroup>("food");
  const [favorites, setFavorites] = useState<string[]>(readFavorites);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [groupMenuOpen, setGroupMenuOpen] = useState(false);
  const [favoriteBurst, setFavoriteBurst] = useState(0);
  const [copiedValue, setCopiedValue] = useState("");
  const tableNumber = tableToken ? tableMap[tableToken] : undefined;
  const tableMode = Boolean(tableNumber);
  const invalidTable = Boolean(tableToken && !tableNumber);
  const selectedProduct = productSlug ? catalog.items.find((item) => item.slug === productSlug) : undefined;
  const dialogReturnFocus = useRef<HTMLElement | null>(null);
  const groupMenuRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(
    () => catalog.items.filter((item) => diet === "all" || (diet === "vegan" ? item.vegan : item.vegetarian || item.vegan)),
    [diet]
  );
  const grouped = useMemo(() => groupOrder.map((group) => ({
    group,
    categories: Array.from(new Set(visibleItems.filter((item) => getGroup(item) === group).map((item) => item.locales[language].category)))
  })), [language, visibleItems]);
  const favoriteItems = useMemo(() => catalog.items.filter((item) => favorites.includes(item.id)), [favorites]);
  const activeCategories = grouped.find(({ group }) => group === activeGroup)?.categories ?? [];

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
    let frame = 0;
    const updateActiveGroup = () => {
      frame = 0;
      const guideLine = window.innerWidth <= 900 ? 320 : 360;
      const sections = groupOrder.map((group) => ({ group, bounds: document.getElementById(`menu-group-${group}`)?.getBoundingClientRect() }));
      const current = sections.find(({ bounds }) => bounds && bounds.top <= guideLine && bounds.bottom > guideLine)?.group;
      const nearest = [...sections].reverse().find(({ bounds }) => bounds && bounds.top <= guideLine)?.group;
      setActiveGroup(current ?? nearest ?? groupOrder[0]);
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
  }, []);

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
    const firstCategoryName = catalog.items.find((item) => getGroup(item) === group)?.locales[language].category;
    const targetId = firstCategory && firstCategoryName
      ? `menu-category-${group}-${slugify(firstCategoryName)}`
      : `menu-group-${group}`;

    setDiet("all");
    setActiveGroup(group);
    setGroupMenuOpen(false);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => scrollTo(targetId)));
  };
  const copyValue = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedValue(value);
    window.setTimeout(() => setCopiedValue(""), 1800);
  };

  return (
    <main className="menu-experience">
      {tableMode && (
        <div className="menu-header-actions menu-header-actions--table">
          <div className="menu-table-badge" aria-label={`${text.table} ${tableNumber}`}><small>{text.table}</small><strong>{tableNumber}</strong></div>
        </div>
      )}

      <section className="menu-hero" aria-labelledby="menu-title">
        <h1 id="menu-title" className="menu-visually-hidden">{text.title}</h1>
        {invalidTable && <p className="menu-hero__notice" role="status">{text.invalidTable}</p>}
        <p className="menu-hero__statement">{text.hint}</p>
        <div className="menu-reference-navigation" aria-label={text.allergenGuide}>
          <button type="button" onClick={() => scrollTo("menu-allergens")}>{text.allergenButton}</button>
          <button type="button" onClick={() => scrollTo("menu-allergens")}>{text.codeButton}</button>
        </div>
      </section>

      {tableMode && (
        <section className="menu-wifi" aria-labelledby="menu-wifi-title">
          <div><small>{text.wifi}</small><h2 id="menu-wifi-title">Bedri Usta Gast</h2></div>
          <dl>
            <div><dt>{text.network}</dt><dd>Bedri Usta Gast</dd><button type="button" onClick={() => copyValue("Bedri Usta Gast")}>{copiedValue === "Bedri Usta Gast" ? text.copied : text.copy}</button></div>
            <div><dt>{text.password}</dt><dd>Bedri2026</dd><button type="button" onClick={() => copyValue("Bedri2026")}>{copiedValue === "Bedri2026" ? text.copied : text.copy}</button></div>
          </dl>
        </section>
      )}

      <nav className="menu-controls" aria-label={text.title}>
        <div className="menu-controls__inner">
          <div className="menu-primary-controls">
            <div className="menu-group-select" ref={groupMenuRef}>
              <button
                type="button"
                className={`menu-diet-filter menu-diet-filter--all${diet === "all" ? " is-active" : ""}`}
                onClick={() => { setDiet("all"); setGroupMenuOpen((open) => !open); }}
                aria-pressed={diet === "all"}
                aria-expanded={groupMenuOpen}
                aria-haspopup="menu"
              >
                <span>{text.all}</span><span className="menu-group-select__chevron" aria-hidden="true">⌄</span>
              </button>
              {groupMenuOpen && (
                <div className="menu-group-dropdown" role="menu">
                  {groupOrder.map((group) => (
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
              <button type="button" key={filter} className={`menu-diet-filter menu-diet-filter--${filter}${diet === filter ? " is-active" : ""}`} onClick={() => { setDiet(filter); setGroupMenuOpen(false); }} aria-pressed={diet === filter}>
                {filter === "vegetarian" ? text.vegetarian : text.vegan}
              </button>
            ))}
            <button type="button" className="menu-controls-favorite" onClick={() => { setGroupMenuOpen(false); setFavoritesOpen(true); }} aria-label={`${text.favorites}: ${favorites.length}`}>
              <span aria-hidden="true">♥</span><span className="menu-controls-favorite__label">{text.favorites}</span><b>{favorites.length}</b>
              {favoriteBurst > 0 && <span className="header-menu-favorite__confetti" key={favoriteBurst} aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</span>}
            </button>
          </div>
          <ScrollRail className="menu-active-categories" ariaLabel={`${text.groups[activeGroup]} kategorileri`}>
            {activeCategories.map((category) => <button type="button" key={`${activeGroup}-${category}`} onClick={() => scrollTo(`menu-category-${activeGroup}-${slugify(category)}`)}>{category}</button>)}
            {activeGroup === "food" && groupOrder.slice(1).map((group) => (
              <button
                type="button"
                className="menu-active-categories__group-jump"
                key={`group-jump-${group}`}
                onClick={() => jumpToGroup(group, group === "cafe")}
              >
                {text.groups[group]}
              </button>
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
            {categories.map((category) => {
              const items = visibleItems.filter((item) => getGroup(item) === group && item.locales[language].category === category);
              return (
                <section className="menu-category" id={`menu-category-${group}-${slugify(category)}`} key={category}>
                  <div className="menu-category__heading"><h3>{category}</h3><span>{items.length} {text.itemCount}</span></div>
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
            {favoriteItems.length === 0 ? <p className="menu-favorites-panel__empty">{text.favoritesEmpty}</p> : favoriteItems.map((item) => <ProductCard key={item.id} item={item} language={language} active onToggle={() => toggleFavorite(item.id)} onOpen={() => { setFavoritesOpen(false); openProduct(item); }} eager={false} />)}
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
              <p className="menu-detail__allergens">{selectedProduct.locales[language].allergens}</p>
              <p className="menu-detail__codes">{selectedProduct.locales[language].codes}</p>
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
