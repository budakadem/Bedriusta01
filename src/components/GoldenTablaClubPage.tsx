import { useEffect, useRef, useState } from "react";
import { useSiteLanguage } from "../siteLanguage";
import "./golden-tabla-club.css";

/**
 * Golden Tabla Club.
 *
 * An ordinary page: the shared Header, Footer, back-to-top and bottom action
 * dock all come from the route in App.tsx, exactly like every other page. It is
 * reached only from the member icon in the header — no nav menu entry.
 *
 * No backend exists yet, so every data control is disabled and nothing is
 * collected, stored or sent.
 *
 * Consent: seeing the offers here is the service itself, so joining asks for no
 * consent at all. The single box only covers pushing messages out, and covers
 * the three channels together — BGH III ZR 196/17 allows that where they serve
 * the same purpose.
 */

type TabId = "coupons" | "discounts" | "partners" | "online" | "jobs" | "franchise";

const TAB_ORDER: TabId[] = ["coupons", "discounts", "partners", "online", "jobs", "franchise"];

/**
 * The sponsor rail advertises the slots themselves, not sponsors.
 *
 * Nothing is signed yet, so a tile carries a sector, a city and "this slot is
 * free" — never an invented company name or logo. Showing made-up brands under
 * a sponsor heading would be misleading advertising (UWG § 5), and an invented
 * name that happens to resemble a real business is a trademark problem on top.
 * Advertising the empty slots is honest and does the recruiting.
 *
 * One sponsor per sector per city — hence the city on every tile.
 */
type SponsorSlotId =
  | "jeweller"
  | "diamond"
  | "nuts"
  | "organic"
  | "market"
  | "travel"
  | "bridal"
  | "events"
  | "photo"
  | "barber";

const SPONSOR_SLOTS: { id: SponsorSlotId; city: string; online: boolean }[] = [
  { id: "jeweller", city: "Mannheim", online: true },
  { id: "diamond", city: "Mannheim", online: true },
  { id: "nuts", city: "Mannheim", online: true },
  { id: "organic", city: "Viernheim", online: true },
  { id: "market", city: "Mannheim", online: true },
  { id: "travel", city: "Mannheim", online: true },
  { id: "bridal", city: "Mannheim", online: true },
  { id: "events", city: "Mannheim", online: false },
  { id: "photo", city: "Mannheim", online: true },
  { id: "barber", city: "Mannheim", online: false }
];

/** Stand-in marks: drawn here, so no real brand's logo is ever shown. */
const SECTOR_PATHS: Record<SponsorSlotId, string> = {
  jeweller: "M12 8.5 9.5 5h5L12 8.5Zm0 0a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z",
  diamond: "M5 9h14M9 4 5 9l7 11 7-11-4-5H9Zm0 0 3 5 3-5M5 9l7 11L19 9",
  nuts: "M4 12h16a8 8 0 0 1-16 0Zm3.5-3.2a2.4 2.4 0 1 1 4 0m1-3a2.4 2.4 0 1 1 4 0M3 20h18",
  organic: "M20 4c0 8-4.5 12-11 12M20 4C10 4 5 8 5 13c0 1.6.6 2.6 1.4 3.4M4 20c0-2 1-4 2.4-3.6",
  market: "M4 8h16l-1.4 10.5a1.5 1.5 0 0 1-1.5 1.3H6.9a1.5 1.5 0 0 1-1.5-1.3L4 8Zm4.5 0V6a3.5 3.5 0 0 1 7 0v2",
  travel: "M2.5 15.5 21 9.2a1.8 1.8 0 0 0-1.2-3.4L15.4 7 9.6 3.8 7.2 4.6l3.4 3.6-3.7 1.3-2.6-1.6-1.7.6 1.6 3-1.7 2.4 1.7 1.6ZM4 20h16",
  bridal: "M12 3.5 9.5 7l2.5 3 2.5-3-2.5-3.5ZM12 10l-5 8.5a1 1 0 0 0 .9 1.5h8.2a1 1 0 0 0 .9-1.5L12 10Z",
  events: "M8 21V9.5a4 4 0 0 1 8 0V21M4 21h16M9 5.5 12 3l3 2.5M6 21v-6M18 21v-6",
  photo: "M4 8h3.2l1.4-2h6.8l1.4 2H20a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm8 3.2a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6Z",
  barber: "M7 4.5 17 17M17 4.5 7 17M6.5 20.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Zm11 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
};

function SectorMark({ id }: { id: SponsorSlotId }) {
  return (
    <svg className="club-slot__mark" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={SECTOR_PATHS[id]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const CONFETTI_PIECES = 70;
const CONFETTI_MS = 2600;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** The three-wheeled street cart Bedri Usta started with. */
function TablaMark() {
  return (
    <img
      className="club-tabla"
      src="/images/golden-tabla-club-mark.webp"
      srcSet={[
        "/images/golden-tabla-club-mark-420.webp 420w",
        "/images/golden-tabla-club-mark-640.webp 640w",
        "/images/golden-tabla-club-mark-900.webp 900w"
      ].join(", ")}
      sizes="(max-width: 619px) min(80vw, 320px), 420px"
      width={1370}
      height={680}
      alt=""
      aria-hidden="true"
      decoding="async"
    />
  );
}

const copy = {
  TR: {
    metaTitle: "Golden Tabla Club | Bedri Usta",
    metaDescription:
      "Avrupa’nın ticari fırsatlar ağı: üyelere özel kuponlar, indirimler, partner fırsatları, iş ilanları ve franchise duyuruları tek yerde.",
    kicker: "GOLDEN TABLA CLUB",
    soon: "Yakında",
    optional: "İsteğe bağlı",

    title: "Ticari fırsatlar ağına katıl.",
    story:
      "14 yaşında bir çocuk, Adana sokaklarında üç tekerlekli bir tablayla kebap satıyordu. Tablayı birinden, kömürü birinden, eti birinden, sebzeyi birinden aldı. O tabla tek başına bir tezgâh değildi — bir esnaf ağıydı.",
    highlight: "Bugün aynı ağı Avrupa’da kuruyoruz.",
    invite:
      "Üyelere özel kuponlar, indirimler, Avrupa genelinde partner fırsatları, iş ilanları ve franchise duyuruları — hepsi tek yerde. Üyelik ücretsiz.",

    joinCta: "Üye ol",
    joinNote: "Kayıtlar çok yakında açılıyor.",
    sponsorsTitle: "Ana Sponsorlar",
    sponsorsNote:
      "Henüz sponsorumuz yok. Aşağıdaki alanların hepsi boş. Her sektörde ve her şehirde tek bir sponsor yer alacak.",
    sponsorsFree: "Bu alan boş",
    sponsorsOnline: "Online",
    sponsorsCta: "Ana sponsor olmak istiyorum",
    sectors: {
      jeweller: "Kuyumcu & Altın",
      diamond: "Pırlanta & Mücevher",
      nuts: "Kuruyemiş",
      organic: "Doğal gıda & kuruyemiş",
      market: "Türk marketi",
      travel: "Seyahat acentesi",
      bridal: "Gelinlik & abiye",
      events: "Düğün salonu & organizasyon",
      photo: "Fotoğraf & video",
      barber: "Kuaför & berber"
    },
    formTitle: "Kulübe katıl",
    formClose: "Formu kapat",
    fields: {
      salutation: "Hitap",
      salutationPlaceholder: "Herr / Frau / Divers",
      fullName: "Ad ve soyad",
      email: "E-posta",
      country: "Ülke",
      countryPlaceholder: "Deutschland, Türkiye, Österreich…",
      city: "Şehir",
      postalCode: "Posta kodu",
      birthDate: "Doğum tarihi",
      phone: "Telefon",
      optionalTag: "isteğe bağlı"
    },
    consentTitle: "Kampanya bildirimleri",
    consentText:
      "Fırsat, indirim ve partner kampanyalarını bana e-posta, WhatsApp ve push bildirimi ile gönderin.",
    doubleOptIn:
      "İşaretlersen e-posta adresine bir doğrulama bağlantısı gönderilir; ancak ona tıkladığında mesaj göndermeye başlarız. Onayını istediğin zaman geri alabilirsin.",
    submit: "Üyeliği tamamla",
    previewTitle: "Bu bir önizleme",
    previewText: "Kayıtlar çok yakında açılacak. Şimdilik hiçbir bilgi kaydedilmiyor.",

    tabsTitle: "Kulüpte neler var?",
    searchPlaceholder: "İşletme veya kategori ara…",
    filterCountry: "Ülke",
    filterCity: "Şehir",
    filterCategory: "Kategori",
    jobsButton: "İlanlara git",
    jobsEntryTitle: "Bedri Usta Mannheim",
    jobsEntryMeta: "Mannheim · Açık pozisyonlar",
    jobsOthers: "Diğer firmaların ilanları çok yakında burada.",
    tabs: {
      coupons: {
        name: "Kuponlar",
        text: "Üyelere özel kupon kodları. Bedri Usta’nın kendi kuponları her zaman en üstte.",
        empty: "İlk kuponlar çok yakında burada."
      },
      discounts: {
        name: "İndirimler",
        text: "Şu an geçerli olan fırsatlar. Bedri Usta’nın kendi indirimleri her zaman en üstte.",
        empty: "İlk fırsatlar çok yakında burada."
      },
      partners: {
        name: "Partnerler",
        text: "Avrupa’daki iş ortaklarımızın dizini. Ülkeye ve şehre göre listelenir.",
        empty: "Partner dizini çok yakında açılıyor."
      },
      online: {
        name: "Online",
        text: "Kargoyla her yere gönderen iş ortakları. Konum fark etmez.",
        empty: "Online partnerler çok yakında burada."
      },
      jobs: {
        name: "İş İlanları",
        text: "Ağdaki firmaların açık pozisyonları. Bedri Usta Mannheim’ın ilanları şimdiden yayında.",
        empty: ""
      },
      franchise: {
        name: "Franchise",
        text: "Avrupa genelindeki franchise fırsatları — gastronomi, market, hizmet, her sektörden. Bedri Usta’nın kendi franchise duyuruları da burada yer alır.",
        empty: "İlk franchise ilanları çok yakında burada."
      }
    },

    deviceTitle: "Cihaz ve bildirim durumu",
    deviceText:
      "Bildirimler yalnızca buradan yönetilir. Ana ekrana eklenme, bildirim izni ve cihaz kaydı durumunu buradan göreceksin.",
    deviceButton: "Bildirim durumunu kontrol et"
  },

  DE: {
    metaTitle: "Golden Tabla Club | Bedri Usta",
    metaDescription:
      "Das europäische Netzwerk für Geschäftschancen: Gutscheine, Rabatte, Partnerangebote, Stellenanzeigen und Franchise-Angebote an einem Ort.",
    kicker: "GOLDEN TABLA CLUB",
    soon: "Demnächst",
    optional: "Optional",

    title: "Werden Sie Teil des Netzwerks für Geschäftschancen.",
    story:
      "Ein 14-jähriger Junge verkaufte in den Straßen Adanas Kebab von einem dreirädrigen Wagen, einer Tabla. Den Wagen bekam er vom einen, die Kohle vom anderen, das Fleisch vom nächsten, das Gemüse von wieder einem anderen. Diese Tabla war nicht nur ein Stand — sie war ein Netzwerk von Händlern.",
    highlight: "Heute bauen wir dasselbe Netzwerk in Europa auf.",
    invite:
      "Gutscheine nur für Mitglieder, Rabatte, Partnerangebote in ganz Europa, Stellenanzeigen und Franchise-Angebote — alles an einem Ort. Die Mitgliedschaft ist kostenlos.",

    joinCta: "Mitglied werden",
    joinNote: "Die Anmeldung öffnet in Kürze.",
    sponsorsTitle: "Hauptsponsoren",
    sponsorsNote:
      "Wir haben noch keine Sponsoren. Alle Plätze unten sind frei. Pro Branche und Stadt wird es genau einen Sponsor geben.",
    sponsorsFree: "Platz frei",
    sponsorsOnline: "Online",
    sponsorsCta: "Ich möchte Hauptsponsor werden",
    sectors: {
      jeweller: "Juwelier & Gold",
      diamond: "Diamanten & Schmuck",
      nuts: "Nüsse & Trockenfrüchte",
      organic: "Naturkost & Nüsse",
      market: "Türkischer Supermarkt",
      travel: "Reisebüro",
      bridal: "Braut- & Abendmode",
      events: "Festsaal & Eventplanung",
      photo: "Foto & Video",
      barber: "Friseur & Barbier"
    },
    formTitle: "Dem Club beitreten",
    formClose: "Formular schließen",
    fields: {
      salutation: "Anrede",
      salutationPlaceholder: "Herr / Frau / Divers",
      fullName: "Vor- und Nachname",
      email: "E-Mail",
      country: "Land",
      countryPlaceholder: "Deutschland, Türkei, Österreich…",
      city: "Stadt",
      postalCode: "PLZ",
      birthDate: "Geburtsdatum",
      phone: "Telefon",
      optionalTag: "optional"
    },
    consentTitle: "Aktionsbenachrichtigungen",
    consentText:
      "Senden Sie mir Angebote, Rabatte und Partneraktionen per E-Mail, WhatsApp und Push-Benachrichtigung.",
    doubleOptIn:
      "Mit Häkchen senden wir einen Bestätigungslink an Ihre E-Mail-Adresse; erst nach dem Klick beginnen wir zu senden. Sie können Ihre Einwilligung jederzeit widerrufen.",
    submit: "Mitgliedschaft abschließen",
    previewTitle: "Dies ist eine Vorschau",
    previewText: "Die Anmeldung öffnet in Kürze. Derzeit werden keine Daten gespeichert.",

    tabsTitle: "Was bietet der Club?",
    searchPlaceholder: "Betrieb oder Kategorie suchen…",
    filterCountry: "Land",
    filterCity: "Stadt",
    filterCategory: "Kategorie",
    jobsButton: "Zu den Anzeigen",
    jobsEntryTitle: "Bedri Usta Mannheim",
    jobsEntryMeta: "Mannheim · Offene Stellen",
    jobsOthers: "Anzeigen weiterer Betriebe erscheinen hier in Kürze.",
    tabs: {
      coupons: {
        name: "Gutscheine",
        text: "Gutscheincodes nur für Mitglieder. Die Gutscheine von Bedri Usta stehen immer ganz oben.",
        empty: "Die ersten Gutscheine erscheinen hier in Kürze."
      },
      discounts: {
        name: "Rabatte",
        text: "Aktuell gültige Angebote. Die Angebote von Bedri Usta stehen immer ganz oben.",
        empty: "Die ersten Angebote erscheinen hier in Kürze."
      },
      partners: {
        name: "Partner",
        text: "Das Verzeichnis unserer Partner in Europa, nach Land und Stadt sortiert.",
        empty: "Das Partnerverzeichnis öffnet in Kürze."
      },
      online: {
        name: "Online",
        text: "Partner, die europaweit versenden. Der Standort spielt keine Rolle.",
        empty: "Online-Partner erscheinen hier in Kürze."
      },
      jobs: {
        name: "Stellen",
        text: "Offene Stellen der Betriebe im Netzwerk. Die Anzeigen von Bedri Usta Mannheim sind bereits online.",
        empty: ""
      },
      franchise: {
        name: "Franchise",
        text: "Franchise-Angebote aus ganz Europa — Gastronomie, Handel, Dienstleistung, jede Branche. Auch die Angebote von Bedri Usta stehen hier.",
        empty: "Die ersten Franchise-Angebote erscheinen hier in Kürze."
      }
    },

    deviceTitle: "Geräte- und Benachrichtigungsstatus",
    deviceText:
      "Benachrichtigungen werden ausschließlich hier verwaltet. Sie sehen Startbildschirm-Status, Berechtigung und Geräteregistrierung.",
    deviceButton: "Benachrichtigungsstatus prüfen"
  },

  ENG: {
    metaTitle: "Golden Tabla Club | Bedri Usta",
    metaDescription:
      "Europe's network of business opportunities: member coupons, discounts, partner offers, job listings and franchise opportunities in one place.",
    kicker: "GOLDEN TABLA CLUB",
    soon: "Coming soon",
    optional: "Optional",

    title: "Join the network of business opportunities.",
    story:
      "A 14-year-old boy sold kebab from a three-wheeled cart — a tabla — in the streets of Adana. He got the cart from one person, the coal from another, the meat from another, the vegetables from another. That tabla was not just a stall — it was a network of traders.",
    highlight: "Today we are building that same network across Europe.",
    invite:
      "Member-only coupons, discounts, partner offers across Europe, job listings and franchise opportunities — all in one place. Membership is free.",

    joinCta: "Become a member",
    joinNote: "Registration opens very soon.",
    sponsorsTitle: "Main sponsors",
    sponsorsNote:
      "We have no sponsors yet. Every slot below is free. There will be exactly one sponsor per sector and city.",
    sponsorsFree: "Slot free",
    sponsorsOnline: "Online",
    sponsorsCta: "I want to be a main sponsor",
    sectors: {
      jeweller: "Jeweller & gold",
      diamond: "Diamonds & jewellery",
      nuts: "Nuts & dried fruit",
      organic: "Organic food & nuts",
      market: "Turkish supermarket",
      travel: "Travel agency",
      bridal: "Bridal & evening wear",
      events: "Event hall & planning",
      photo: "Photo & video",
      barber: "Hair & barber"
    },
    formTitle: "Join the club",
    formClose: "Close form",
    fields: {
      salutation: "Salutation",
      salutationPlaceholder: "Herr / Frau / Divers",
      fullName: "Full name",
      email: "Email",
      country: "Country",
      countryPlaceholder: "Germany, Türkiye, Austria…",
      city: "City",
      postalCode: "Postcode",
      birthDate: "Date of birth",
      phone: "Phone",
      optionalTag: "optional"
    },
    consentTitle: "Campaign notifications",
    consentText:
      "Send me offers, discounts and partner campaigns by email, WhatsApp and push notification.",
    doubleOptIn:
      "If you tick it we send a confirmation link to your email address; we only start sending once you click it. You can withdraw your consent at any time.",
    submit: "Complete membership",
    previewTitle: "This is a preview",
    previewText: "Registration opens very soon. Nothing is stored for now.",

    tabsTitle: "What is in the club?",
    searchPlaceholder: "Search a business or category…",
    filterCountry: "Country",
    filterCity: "City",
    filterCategory: "Category",
    jobsButton: "Go to the listings",
    jobsEntryTitle: "Bedri Usta Mannheim",
    jobsEntryMeta: "Mannheim · Open positions",
    jobsOthers: "Listings from other businesses will appear here very soon.",
    tabs: {
      coupons: {
        name: "Coupons",
        text: "Coupon codes for members only. Bedri Usta's own coupons are always at the top.",
        empty: "The first coupons will appear here very soon."
      },
      discounts: {
        name: "Discounts",
        text: "Offers valid right now. Bedri Usta's own offers are always at the top.",
        empty: "The first offers will appear here very soon."
      },
      partners: {
        name: "Partners",
        text: "The directory of our partners across Europe, listed by country and city.",
        empty: "The partner directory opens very soon."
      },
      online: {
        name: "Online",
        text: "Partners who ship anywhere. Location does not matter.",
        empty: "Online partners will appear here very soon."
      },
      jobs: {
        name: "Jobs",
        text: "Open positions at the businesses in the network. Bedri Usta Mannheim's listings are already live.",
        empty: ""
      },
      franchise: {
        name: "Franchise",
        text: "Franchise opportunities across Europe — hospitality, retail, services, every sector. Bedri Usta's own listings appear here too.",
        empty: "The first franchise listings will appear here very soon."
      }
    },

    deviceTitle: "Device and notification status",
    deviceText:
      "Notifications are managed here and nowhere else. You will see home-screen status, permission and device registration.",
    deviceButton: "Check notification status"
  }
} as const;

function PreviewField({
  label,
  placeholder,
  optionalLabel
}: {
  label: string;
  placeholder?: string;
  optionalLabel?: string;
}) {
  return (
    <label className="club-field">
      <span>
        {label}
        {optionalLabel && <small> · {optionalLabel}</small>}
      </span>
      <input type="text" disabled placeholder={placeholder ?? ""} tabIndex={-1} />
    </label>
  );
}

export function GoldenTablaClubPage() {
  const language = useSiteLanguage();
  const text = copy[language];
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Each burst gets its own number; using it as the React key remounts the
  // pieces, which is what restarts the CSS animation on a repeat burst.
  const [burst, setBurst] = useState(() => (prefersReducedMotion() ? 0 : 1));
  const [activeTab, setActiveTab] = useState<TabId>("coupons");
  const formRef = useRef<HTMLDivElement>(null);
  const confettiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionTag?.getAttribute("content") ?? "";

    document.title = text.metaTitle;
    descriptionTag?.setAttribute("content", text.metaDescription);

    return () => {
      document.title = previousTitle;
      descriptionTag?.setAttribute("content", previousDescription);
    };
  }, [text.metaTitle, text.metaDescription]);

  // The arrival burst is on from the initial state, so it paints with the
  // first frame.
  useEffect(() => {
    if (burst > 0) confettiTimer.current = setTimeout(() => setBurst(0), CONFETTI_MS);
    return () => {
      if (confettiTimer.current) clearTimeout(confettiTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fireConfetti = () => {
    if (prefersReducedMotion()) return;
    setBurst((previous) => previous + 1);
    if (confettiTimer.current) clearTimeout(confettiTimer.current);
    confettiTimer.current = setTimeout(() => setBurst(0), CONFETTI_MS);
  };

  useEffect(() => {
    if (!formOpen) return;
    formRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }, [formOpen]);

  const activeCopy = text.tabs[activeTab];

  return (
    <main className="club-page">
      {burst > 0 && (
        <div className="club-confetti" key={burst} aria-hidden="true">
          {Array.from({ length: CONFETTI_PIECES }, (_, index) => (
            <span
              key={index}
              className={`club-confetti__piece club-confetti__piece--${index % 5}`}
              style={{
                left: `${(index * 37) % 100}%`,
                animationDelay: `${(index % 12) * 90}ms`,
                animationDuration: `${2000 + ((index * 137) % 900)}ms`
              }}
            />
          ))}
        </div>
      )}

      <section className="club-hero">
        <div className="club-shell">
          <TablaMark />
          <p className="club-kicker">{text.kicker}</p>
          <h1>{text.title}</h1>
          <p className="club-lead">{text.story}</p>
          <p className="club-highlight">{text.highlight}</p>
          <p className="club-invite">{text.invite}</p>

          <div className="club-cta">
            <button
              type="button"
              className="club-join"
              onClick={() => setFormOpen((open) => !open)}
              aria-expanded={formOpen}
            >
              {text.joinCta}
            </button>
            <span className="club-cta__note">{text.joinNote}</span>
          </div>
        </div>
      </section>

      <section className="club-sponsors-section">
        <div className="club-shell">
          <div className="club-panel__head">
            <h2 className="club-section-title club-section-title--tight">{text.sponsorsTitle}</h2>
            <span className="club-soon">{text.soon}</span>
          </div>
          <p className="club-panel__text">{text.sponsorsNote}</p>

          <div className="club-sponsors" aria-label={text.sponsorsTitle}>
            <div className="club-sponsors__track">
              {[0, 1].map((pass) => (
                <ul className="club-sponsors__set" key={pass} aria-hidden={pass === 1 ? "true" : undefined}>
                  {SPONSOR_SLOTS.map((slot) => (
                    <li className="club-slot" key={slot.id}>
                      <SectorMark id={slot.id} />
                      <strong className="club-slot__sector">{text.sectors[slot.id]}</strong>
                      <span className="club-slot__where">
                        {slot.city}
                        {slot.online && <em className="club-slot__online">{text.sponsorsOnline}</em>}
                      </span>
                      <span className="club-slot__free">{text.sponsorsFree}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="club-button club-button--ghost club-sponsors__cta"
            onClick={() => navigateTo("/iletisim")}
          >
            {text.sponsorsCta}
          </button>
        </div>
      </section>

      {formOpen && (
        <section className="club-form-section" ref={formRef}>
          <div className="club-shell">
            <div className="club-panel">
              <div className="club-panel__head">
                <h2>{text.formTitle}</h2>
                <span className="club-soon">{text.soon}</span>
              </div>

              <div className="club-form" aria-disabled="true">
                <PreviewField label={text.fields.salutation} placeholder={text.fields.salutationPlaceholder} />
                <PreviewField label={text.fields.fullName} />
                <PreviewField label={text.fields.email} />
                <PreviewField label={text.fields.country} placeholder={text.fields.countryPlaceholder} />
                <PreviewField label={text.fields.city} />
                <PreviewField label={text.fields.postalCode} />
                <PreviewField label={text.fields.birthDate} optionalLabel={text.fields.optionalTag} />
                <PreviewField label={text.fields.phone} optionalLabel={text.fields.optionalTag} />
              </div>

              {/* One box, tagged optional. The tag alone says it; a second
                  sentence repeating that it is optional only made people ask
                  whether it was required after all. */}
              <div className="club-consent">
                <h3>{text.consentTitle}</h3>
                <label className="club-consent__row">
                  <span className="club-consent__box" aria-hidden="true" />
                  <span className="club-consent__text">{text.consentText}</span>
                  <span className="club-consent__tag">{text.optional}</span>
                </label>
                <p className="club-consent__note">{text.doubleOptIn}</p>
              </div>

              <div className="club-actions">
                <button
                  type="button"
                  className="club-button club-button--primary"
                  onClick={() => {
                    setSubmitted(true);
                    fireConfetti();
                  }}
                >
                  {text.submit}
                </button>
                <button type="button" className="club-button club-button--ghost" onClick={() => setFormOpen(false)}>
                  {text.formClose}
                </button>
              </div>

              {submitted && (
                <div className="club-preview" role="status">
                  <strong>{text.previewTitle}</strong>
                  <p>{text.previewText}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="club-tabs-section">
        <div className="club-shell">
          <h2 className="club-section-title">{text.tabsTitle}</h2>

          <div className="club-tabs" role="tablist" aria-label={text.tabsTitle}>
            {TAB_ORDER.map((tabId) => (
              <button
                key={tabId}
                type="button"
                role="tab"
                aria-selected={activeTab === tabId}
                className={`club-tab${activeTab === tabId ? " is-active" : ""}`}
                onClick={() => setActiveTab(tabId)}
              >
                {text.tabs[tabId].name}
              </button>
            ))}
          </div>

          <div className="club-panel club-panel--tab" role="tabpanel">
            <div className="club-panel__head">
              <h3>{activeCopy.name}</h3>
              {/* Jobs already exists, so it is the one area not marked soon. */}
              {activeTab !== "jobs" && <span className="club-soon">{text.soon}</span>}
            </div>
            <p className="club-panel__text">{activeCopy.text}</p>

            {activeTab === "jobs" ? (
              /* Jobs is a directory like the others; it just already holds one
                 entry, ours, which links straight to the jobs page. */
              <>
                <div className="club-listing">
                  <div className="club-listing__copy">
                    <strong>{text.jobsEntryTitle}</strong>
                    <span>{text.jobsEntryMeta}</span>
                  </div>
                  <button
                    type="button"
                    className="club-button club-button--primary"
                    onClick={() => navigateTo("/jobs")}
                  >
                    {text.jobsButton}
                  </button>
                </div>
                <p className="club-empty">{text.jobsOthers}</p>
              </>
            ) : (
              <>
                <div className="club-search" aria-disabled="true">
                  <input type="text" disabled placeholder={text.searchPlaceholder} tabIndex={-1} />
                  <div className="club-search__filters">
                    {activeTab !== "online" && <button type="button" disabled>{text.filterCountry}</button>}
                    {activeTab !== "online" && <button type="button" disabled>{text.filterCity}</button>}
                    <button type="button" disabled>{text.filterCategory}</button>
                  </div>
                </div>
                <p className="club-empty">{activeCopy.empty}</p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="club-device-section">
        <div className="club-shell">
          <div className="club-panel">
            <div className="club-panel__head">
              <h2>{text.deviceTitle}</h2>
              <span className="club-soon">{text.soon}</span>
            </div>
            <p className="club-panel__text">{text.deviceText}</p>
            <button type="button" className="club-button club-button--primary" disabled>
              {text.deviceButton}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
