import { useEffect, useRef, useState } from "react";
import { useSiteLanguage } from "../siteLanguage";
import "./golden-tabla-club.css";

/**
 * Golden Tabla Club — preview build.
 *
 * No backend exists yet, so every data control is disabled. Nothing is
 * collected, stored or sent from this page.
 *
 * Consent design (the part that has to be right before anything else):
 * the club's whole service is sending offers, so ONE consent is mandatory —
 * membership plus offers by email — and it doubles as the address we verify.
 * WhatsApp and push are genuinely extra channels and stay optional. Bundling
 * all four into one tick would be the thing German regulators actually object
 * to; asking for four separate ticks with none of them required would be
 * clumsy for no benefit. One required, two optional is both.
 *
 * Push notifications are handled here and nowhere else, so a visitor is never
 * asked the same question in two places.
 */

type TabId = "discounts" | "partners" | "online" | "jobs" | "franchise";

const TAB_ORDER: TabId[] = ["discounts", "partners", "online", "jobs", "franchise"];

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const copy = {
  TR: {
    metaTitle: "Golden Tabla Club | Bedri Usta",
    metaDescription:
      "Bedri Usta’nın Avrupa esnaf ağı. Üyelere özel indirimler, partner fırsatları ve online kampanyalar tek yerde.",
    kicker: "GOLDEN TABLA CLUB",
    soon: "Yakında",
    required: "Zorunlu",
    optional: "İsteğe bağlı",

    storyTitle: "Bedri Usta’nın ağına katıl.",
    storyLead:
      "14 yaşında bir çocuk, Adana sokaklarında üç tekerlekli bir tablayla kebap satıyordu. Tablayı birinden, kömürü birinden, eti birinden, sebzeyi birinden aldı. O tabla tek başına bir tezgâh değildi — bir esnaf ağıydı.",
    storyHighlight: "Bugün aynı ağı Avrupa’da kuruyoruz.",
    storyInvite:
      "Üyelere özel indirimler, Avrupa genelinde partner fırsatları ve online kampanyalar — hepsi tek yerde. Üyelik ücretsiz.",

    joinCta: "Üye ol",
    joinCtaNote: "Kayıtlar çok yakında açılıyor.",
    formTitle: "Kulübe katıl",
    formClose: "Kapat",
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

    consentTitle: "Onaylar",
    consentRequired:
      "Golden Tabla Club üyeliğini ve e-posta ile fırsat, indirim ve partner kampanyalarını almayı kabul ediyorum.",
    consentWhatsapp: "WhatsApp ile de kampanya almak istiyorum.",
    consentPush: "Bu cihaza push bildirimi göndermenizi istiyorum.",
    doubleOptIn:
      "Kayıttan sonra e-posta adresine bir doğrulama bağlantısı gönderilir. Üyeliğin ancak bu bağlantıya tıkladığında başlar; tıklamazsan hiçbir mesaj gönderilmez.",
    withdraw: "Onayını istediğin zaman geri alabilirsin.",
    submit: "Üyeliği tamamla",

    tabsTitle: "Kulüpte neler var?",
    searchPlaceholder: "İşletme veya kategori ara…",
    filterCountry: "Ülke",
    filterCity: "Şehir",
    filterCategory: "Kategori",
    jobsButton: "Açık pozisyonlara git",
    tabs: {
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
        name: "Online Partnerler",
        text: "Kargoyla her yere gönderen iş ortakları. Konum fark etmez.",
        empty: "Online partnerler çok yakında burada."
      },
      jobs: {
        name: "İş İlanları",
        text: "Bedri Usta Mannheim’daki açık pozisyonlar. Bu bölüm şimdiden aktif.",
        empty: ""
      },
      franchise: {
        name: "Franchise",
        text: "Tablayı kendi şehrine taşımak isteyenler için iş ortaklığı.",
        empty: "Başvuru koşulları çok yakında yayınlanacak."
      }
    },

    deviceTitle: "Cihaz ve bildirim durumu",
    deviceText:
      "Bildirimler yalnızca buradan yönetilir. Uygulamanın ana ekrana eklenip eklenmediğini, bildirim izninin durumunu ve cihaz kaydını buradan göreceksin.",
    deviceButton: "Bildirim durumunu kontrol et"
  },

  DE: {
    metaTitle: "Golden Tabla Club | Bedri Usta",
    metaDescription:
      "Das europäische Händlernetzwerk von Bedri Usta. Rabatte für Mitglieder, Partnerangebote und Online-Aktionen an einem Ort.",
    kicker: "GOLDEN TABLA CLUB",
    soon: "Demnächst",
    required: "Erforderlich",
    optional: "Optional",

    storyTitle: "Werden Sie Teil des Netzwerks von Bedri Usta.",
    storyLead:
      "Ein 14-jähriger Junge verkaufte in den Straßen Adanas Kebab von einem dreirädrigen Wagen, einer Tabla. Den Wagen bekam er vom einen, die Kohle vom anderen, das Fleisch vom nächsten, das Gemüse von wieder einem anderen. Diese Tabla war nicht nur ein Stand — sie war ein Netzwerk von Händlern.",
    storyHighlight: "Heute bauen wir dasselbe Netzwerk in Europa auf.",
    storyInvite:
      "Rabatte nur für Mitglieder, Partnerangebote in ganz Europa und Online-Aktionen — alles an einem Ort. Die Mitgliedschaft ist kostenlos.",

    joinCta: "Mitglied werden",
    joinCtaNote: "Die Anmeldung öffnet in Kürze.",
    formTitle: "Dem Club beitreten",
    formClose: "Schließen",
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

    consentTitle: "Einwilligungen",
    consentRequired:
      "Ich möchte Mitglied im Golden Tabla Club werden und Angebote, Rabatte und Partneraktionen per E-Mail erhalten.",
    consentWhatsapp: "Ich möchte Aktionen zusätzlich per WhatsApp erhalten.",
    consentPush: "Ich möchte Push-Benachrichtigungen auf diesem Gerät erhalten.",
    doubleOptIn:
      "Nach der Anmeldung senden wir einen Bestätigungslink an Ihre E-Mail-Adresse. Die Mitgliedschaft beginnt erst mit dem Klick auf diesen Link; ohne Bestätigung senden wir Ihnen nichts.",
    withdraw: "Sie können Ihre Einwilligung jederzeit widerrufen.",
    submit: "Mitgliedschaft abschließen",

    tabsTitle: "Was bietet der Club?",
    searchPlaceholder: "Betrieb oder Kategorie suchen…",
    filterCountry: "Land",
    filterCity: "Stadt",
    filterCategory: "Kategorie",
    jobsButton: "Zu den offenen Stellen",
    tabs: {
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
        name: "Online-Partner",
        text: "Partner, die europaweit versenden. Der Standort spielt keine Rolle.",
        empty: "Online-Partner erscheinen hier in Kürze."
      },
      jobs: {
        name: "Stellenangebote",
        text: "Offene Stellen bei Bedri Usta Mannheim. Dieser Bereich ist bereits aktiv.",
        empty: ""
      },
      franchise: {
        name: "Franchise",
        text: "Partnerschaft für alle, die die Tabla in ihre eigene Stadt bringen möchten.",
        empty: "Die Bedingungen werden in Kürze veröffentlicht."
      }
    },

    deviceTitle: "Geräte- und Benachrichtigungsstatus",
    deviceText:
      "Benachrichtigungen werden ausschließlich hier verwaltet. Sie sehen, ob die App zum Startbildschirm hinzugefügt wurde, wie der Berechtigungsstatus ist und ob Ihr Gerät registriert ist.",
    deviceButton: "Benachrichtigungsstatus prüfen"
  },

  ENG: {
    metaTitle: "Golden Tabla Club | Bedri Usta",
    metaDescription:
      "Bedri Usta's European network of traders. Member discounts, partner offers and online campaigns in one place.",
    kicker: "GOLDEN TABLA CLUB",
    soon: "Coming soon",
    required: "Required",
    optional: "Optional",

    storyTitle: "Join Bedri Usta's network.",
    storyLead:
      "A 14-year-old boy sold kebab from a three-wheeled cart — a tabla — in the streets of Adana. He got the cart from one person, the coal from another, the meat from another, the vegetables from another. That tabla was not just a stall — it was a network of traders.",
    storyHighlight: "Today we are building that same network across Europe.",
    storyInvite:
      "Member-only discounts, partner offers across Europe and online campaigns — all in one place. Membership is free.",

    joinCta: "Become a member",
    joinCtaNote: "Registration opens very soon.",
    formTitle: "Join the club",
    formClose: "Close",
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

    consentTitle: "Consents",
    consentRequired:
      "I want to join the Golden Tabla Club and receive offers, discounts and partner campaigns by email.",
    consentWhatsapp: "I would also like to receive campaigns via WhatsApp.",
    consentPush: "I would like to receive push notifications on this device.",
    doubleOptIn:
      "After signing up we send a confirmation link to your email address. Membership begins only when you click that link; without it we send you nothing.",
    withdraw: "You can withdraw your consent at any time.",
    submit: "Complete membership",

    tabsTitle: "What is in the club?",
    searchPlaceholder: "Search a business or category…",
    filterCountry: "Country",
    filterCity: "City",
    filterCategory: "Category",
    jobsButton: "Go to open positions",
    tabs: {
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
        name: "Online Partners",
        text: "Partners who ship anywhere. Location does not matter.",
        empty: "Online partners will appear here very soon."
      },
      jobs: {
        name: "Jobs",
        text: "Open positions at Bedri Usta Mannheim. This section is already live.",
        empty: ""
      },
      franchise: {
        name: "Franchise",
        text: "Partnership for those who want to bring the tabla to their own city.",
        empty: "The conditions will be published very soon."
      }
    },

    deviceTitle: "Device and notification status",
    deviceText:
      "Notifications are managed here and nowhere else. You will see whether the app was added to your home screen, the permission status and whether your device is registered.",
    deviceButton: "Check notification status"
  }
} as const;

/** Disabled on purpose: no backend yet, so nothing may be typed or submitted. */
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

function ConsentRow({ text, tag, tone }: { text: string; tag: string; tone: "required" | "optional" }) {
  return (
    <li className={`club-consent club-consent--${tone}`}>
      {/* Empty box on purpose: nothing may look pre-selected. */}
      <span className="club-consent__box" aria-hidden="true" />
      <span className="club-consent__text">{text}</span>
      <span className={`club-tag club-tag--${tone}`}>{tag}</span>
    </li>
  );
}

const CONFETTI_PIECES = 26;
const CONFETTI_MS = 1400;

export function GoldenTablaClubPage() {
  const language = useSiteLanguage();
  const text = copy[language];
  const [formOpen, setFormOpen] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("discounts");
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

  useEffect(
    () => () => {
      if (confettiTimer.current) clearTimeout(confettiTimer.current);
    },
    []
  );

  // Scrolling has to happen after React has committed the panel, so it runs
  // from an effect rather than a rAF chain inside the click handler — the
  // panel does not exist yet at click time.
  useEffect(() => {
    if (!formOpen) return;

    const panel = formRef.current;
    if (!panel) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // scrollIntoView rather than setting scrollTop: this page's scroll
    // container is not documentElement, and letting the browser find it is
    // more reliable than guessing. The header offset comes from
    // scroll-margin-top on the section itself.
    panel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [formOpen]);

  const openForm = () => {
    setFormOpen(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setConfetti(true);
    if (confettiTimer.current) clearTimeout(confettiTimer.current);
    confettiTimer.current = setTimeout(() => setConfetti(false), CONFETTI_MS);
  };

  const activeCopy = text.tabs[activeTab];

  return (
    <main className="club-page">
      <section className="club-hero">
        <div className="club-shell">
          <p className="club-kicker">{text.kicker}</p>
          <h1>{text.storyTitle}</h1>
          <p className="club-hero__lead">{text.storyLead}</p>
          <p className="club-hero__highlight">{text.storyHighlight}</p>
          <p className="club-hero__invite">{text.storyInvite}</p>

          <div className="club-cta">
            <button
              type="button"
              className="club-cta__button"
              onClick={() => (formOpen ? setFormOpen(false) : openForm())}
              aria-expanded={formOpen}
              aria-controls="club-form-panel"
            >
              {text.joinCta}
              <span className="club-cta__chevron" aria-hidden="true">{formOpen ? "↑" : "↓"}</span>

              {confetti && (
                <span className="club-confetti" aria-hidden="true">
                  {Array.from({ length: CONFETTI_PIECES }, (_, index) => (
                    <span
                      key={index}
                      className={`club-confetti__piece club-confetti__piece--${index % 4}`}
                      style={{
                        // Spread the burst across the button and stagger it a
                        // little so the pieces do not move as one block.
                        left: `${(index / CONFETTI_PIECES) * 100}%`,
                        animationDelay: `${(index % 6) * 40}ms`
                      }}
                    />
                  ))}
                </span>
              )}
            </button>
            <span className="club-cta__note">{text.joinCtaNote}</span>
          </div>
        </div>
      </section>

      {/* Revealed only on request, not pushed at every visitor. */}
      {formOpen && (
        <section className="club-form-section" id="club-form-panel" ref={formRef}>
          <div className="club-shell">
            <div className="club-card">
              <div className="club-card__head">
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

              <div className="club-consents">
                <h3>{text.consentTitle}</h3>
                <ul>
                  <ConsentRow text={text.consentRequired} tag={text.required} tone="required" />
                  <ConsentRow text={text.consentWhatsapp} tag={text.optional} tone="optional" />
                  <ConsentRow text={text.consentPush} tag={text.optional} tone="optional" />
                </ul>
                <p className="club-consents__note">{text.doubleOptIn}</p>
                <p className="club-consents__note">{text.withdraw}</p>
              </div>

              <div className="club-card__actions">
                <button type="button" className="club-button club-button--primary" disabled>
                  {text.submit}
                </button>
                <button type="button" className="club-button club-button--ghost" onClick={() => setFormOpen(false)}>
                  {text.formClose}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="club-tabs-section" aria-labelledby="club-tabs-title">
        <div className="club-shell">
          <h2 id="club-tabs-title" className="club-section-title">{text.tabsTitle}</h2>

          <div className="club-tabs" role="tablist" aria-label={text.tabsTitle}>
            {TAB_ORDER.map((tabId, index) => (
              <button
                key={tabId}
                type="button"
                role="tab"
                id={`club-tab-${tabId}`}
                aria-selected={activeTab === tabId}
                aria-controls={`club-panel-${tabId}`}
                className={`club-tab${activeTab === tabId ? " is-active" : ""}`}
                onClick={() => setActiveTab(tabId)}
              >
                <span className="club-tab__no">{String(index + 1).padStart(2, "0")}</span>
                <span className="club-tab__name">{text.tabs[tabId].name}</span>
              </button>
            ))}
          </div>

          <div
            className="club-panel"
            role="tabpanel"
            id={`club-panel-${activeTab}`}
            aria-labelledby={`club-tab-${activeTab}`}
          >
            <div className="club-panel__head">
              <h3>{activeCopy.name}</h3>
              {/* Jobs already exists, so it is the one area not marked soon. */}
              {activeTab !== "jobs" && <span className="club-soon">{text.soon}</span>}
            </div>
            <p className="club-panel__text">{activeCopy.text}</p>

            {activeTab === "jobs" ? (
              <button
                type="button"
                className="club-button club-button--primary club-button--inline"
                onClick={() => navigateTo("/jobs")}
              >
                {text.jobsButton}
              </button>
            ) : (
              <>
                {/* Franchise is a single enquiry, not a directory: no search. */}
                {activeTab !== "franchise" && (
                  <div className="club-searchbar" aria-disabled="true">
                    <input type="text" disabled placeholder={text.searchPlaceholder} tabIndex={-1} />
                    <div className="club-searchbar__filters">
                      {activeTab !== "online" && <button type="button" disabled>{text.filterCountry}</button>}
                      {activeTab !== "online" && <button type="button" disabled>{text.filterCity}</button>}
                      <button type="button" disabled>{text.filterCategory}</button>
                    </div>
                  </div>
                )}
                <p className="club-panel__empty">{activeCopy.empty}</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Notifications live here and nowhere else, so the visitor is never
          asked the same question in two places. Disabled until the backend. */}
      <section className="club-device-section">
        <div className="club-shell">
          <div className="club-card">
            <div className="club-card__head">
              <h2>{text.deviceTitle}</h2>
              <span className="club-soon">{text.soon}</span>
            </div>
            <p className="club-card__text">{text.deviceText}</p>
            <button type="button" className="club-button club-button--primary" disabled>
              {text.deviceButton}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
