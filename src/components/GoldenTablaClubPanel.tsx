import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSiteLanguage } from "../siteLanguage";
import "./golden-tabla-club.css";

/**
 * Golden Tabla Club — opens from the member icon in the header as an overlay
 * panel, the same way the notification centre does. It is deliberately NOT a
 * route: nothing about the page layout, the bottom dock or the navigation
 * changes when it opens.
 *
 * No backend exists yet, so every data control is disabled. Nothing is
 * collected, stored or sent.
 *
 * Consent: the club's whole service is sending offers, so ONE consent is
 * mandatory — membership plus offers by email, which is also the address that
 * gets verified. WhatsApp and push are genuinely extra channels and stay
 * optional. Push is handled here and nowhere else.
 */

type TabId = "discounts" | "partners" | "online" | "jobs" | "franchise";

const TAB_ORDER: TabId[] = ["discounts", "partners", "online", "jobs", "franchise"];

const CONFETTI_PIECES = 70;
const CONFETTI_MS = 2600;

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const copy = {
  TR: {
    close: "Kapat",
    kicker: "GOLDEN TABLA CLUB",
    soon: "Yakında",
    required: "Zorunlu",
    optional: "İsteğe bağlı",

    title: "Bedri Usta’nın ağına katıl.",
    story:
      "14 yaşında bir çocuk, Adana sokaklarında üç tekerlekli bir tablayla kebap satıyordu. Tablayı birinden, kömürü birinden, eti birinden, sebzeyi birinden aldı. O tabla tek başına bir tezgâh değildi — bir esnaf ağıydı.",
    highlight: "Bugün aynı ağı Avrupa’da kuruyoruz.",
    invite:
      "Üyelere özel indirimler, Avrupa genelinde partner fırsatları ve online kampanyalar — hepsi tek yerde. Üyelik ücretsiz.",

    joinCta: "Üye ol",
    joinNote: "Kayıtlar çok yakında açılıyor.",
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
        name: "Online",
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
      "Bildirimler yalnızca buradan yönetilir. Ana ekrana eklenme, bildirim izni ve cihaz kaydı durumunu buradan göreceksin.",
    deviceButton: "Bildirim durumunu kontrol et"
  },

  DE: {
    close: "Schließen",
    kicker: "GOLDEN TABLA CLUB",
    soon: "Demnächst",
    required: "Erforderlich",
    optional: "Optional",

    title: "Werden Sie Teil des Netzwerks von Bedri Usta.",
    story:
      "Ein 14-jähriger Junge verkaufte in den Straßen Adanas Kebab von einem dreirädrigen Wagen, einer Tabla. Den Wagen bekam er vom einen, die Kohle vom anderen, das Fleisch vom nächsten, das Gemüse von wieder einem anderen. Diese Tabla war nicht nur ein Stand — sie war ein Netzwerk von Händlern.",
    highlight: "Heute bauen wir dasselbe Netzwerk in Europa auf.",
    invite:
      "Rabatte nur für Mitglieder, Partnerangebote in ganz Europa und Online-Aktionen — alles an einem Ort. Die Mitgliedschaft ist kostenlos.",

    joinCta: "Mitglied werden",
    joinNote: "Die Anmeldung öffnet in Kürze.",
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
        name: "Online",
        text: "Partner, die europaweit versenden. Der Standort spielt keine Rolle.",
        empty: "Online-Partner erscheinen hier in Kürze."
      },
      jobs: {
        name: "Stellen",
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
      "Benachrichtigungen werden ausschließlich hier verwaltet. Sie sehen Startbildschirm-Status, Berechtigung und Geräteregistrierung.",
    deviceButton: "Benachrichtigungsstatus prüfen"
  },

  ENG: {
    close: "Close",
    kicker: "GOLDEN TABLA CLUB",
    soon: "Coming soon",
    required: "Required",
    optional: "Optional",

    title: "Join Bedri Usta's network.",
    story:
      "A 14-year-old boy sold kebab from a three-wheeled cart — a tabla — in the streets of Adana. He got the cart from one person, the coal from another, the meat from another, the vegetables from another. That tabla was not just a stall — it was a network of traders.",
    highlight: "Today we are building that same network across Europe.",
    invite:
      "Member-only discounts, partner offers across Europe and online campaigns — all in one place. Membership is free.",

    joinCta: "Become a member",
    joinNote: "Registration opens very soon.",
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
        name: "Online",
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
    <label className="gtc-field">
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
    <li className={`gtc-consent gtc-consent--${tone}`}>
      {/* Empty box on purpose: nothing may look pre-selected. */}
      <span className="gtc-consent__box" aria-hidden="true" />
      <span className="gtc-consent__text">{text}</span>
      <span className={`gtc-tag gtc-tag--${tone}`}>{tag}</span>
    </li>
  );
}

export function GoldenTablaClubPanel({ onClose, visible }: { onClose: () => void; visible: boolean }) {
  const language = useSiteLanguage();
  const text = copy[language];
  const [formOpen, setFormOpen] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("discounts");
  const formRef = useRef<HTMLDivElement>(null);
  const confettiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    // Stop the page behind from scrolling while the panel is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, visible]);

  useEffect(
    () => () => {
      if (confettiTimer.current) clearTimeout(confettiTimer.current);
    },
    []
  );

  // Scroll after React has committed the form, not from the click handler.
  useEffect(() => {
    if (!formOpen) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    formRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [formOpen]);

  if (!visible) return null;

  const openForm = () => {
    setFormOpen(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setConfetti(true);
    if (confettiTimer.current) clearTimeout(confettiTimer.current);
    confettiTimer.current = setTimeout(() => setConfetti(false), CONFETTI_MS);
  };

  const activeCopy = text.tabs[activeTab];

  // Portalled to body: mounted inside the header it would sit in the header's
  // stacking context, where the centred logo plate (z-index 106) paints over
  // it no matter how high this overlay's own z-index is.
  return createPortal(
    <div className="gtc-overlay" role="dialog" aria-modal="true" aria-label={text.kicker}>
      <button className="gtc-backdrop" type="button" onClick={onClose} aria-label={text.close} />

      {/* Full-viewport celebration, not a few dots on the button. */}
      {confetti && (
        <div className="gtc-confetti" aria-hidden="true">
          {Array.from({ length: CONFETTI_PIECES }, (_, index) => (
            <span
              key={index}
              className={`gtc-confetti__piece gtc-confetti__piece--${index % 5}`}
              style={{
                left: `${(index * 37) % 100}%`,
                animationDelay: `${(index % 12) * 90}ms`,
                animationDuration: `${2000 + ((index * 137) % 900)}ms`
              }}
            />
          ))}
        </div>
      )}

      <div className="gtc-sheet">
        <div className="gtc-sheet__accent" />

        <div className="gtc-sheet__scroll">
          <div className="gtc-top">
            <span className="gtc-mark" aria-hidden="true">B</span>
            <button className="gtc-close" type="button" onClick={onClose} aria-label={text.close}>
              ×
            </button>
          </div>

          <div className="gtc-intro">
            <p className="gtc-kicker">{text.kicker}</p>
            <h2 className="gtc-title">{text.title}</h2>
            <p className="gtc-story">{text.story}</p>
            <p className="gtc-highlight">{text.highlight}</p>
            <p className="gtc-invite">{text.invite}</p>

            <button
              type="button"
              className="gtc-join"
              onClick={() => (formOpen ? setFormOpen(false) : openForm())}
              aria-expanded={formOpen}
            >
              {text.joinCta}
            </button>
            <p className="gtc-join__note">{text.joinNote}</p>
          </div>

          {formOpen && (
            <div className="gtc-form-block" ref={formRef}>
              <div className="gtc-block__head">
                <h3>{text.formTitle}</h3>
                <span className="gtc-soon">{text.soon}</span>
              </div>

              <div className="gtc-form" aria-disabled="true">
                <PreviewField label={text.fields.salutation} placeholder={text.fields.salutationPlaceholder} />
                <PreviewField label={text.fields.fullName} />
                <PreviewField label={text.fields.email} />
                <PreviewField label={text.fields.country} placeholder={text.fields.countryPlaceholder} />
                <PreviewField label={text.fields.city} />
                <PreviewField label={text.fields.postalCode} />
                <PreviewField label={text.fields.birthDate} optionalLabel={text.fields.optionalTag} />
                <PreviewField label={text.fields.phone} optionalLabel={text.fields.optionalTag} />
              </div>

              <div className="gtc-consents">
                <h4>{text.consentTitle}</h4>
                <ul>
                  <ConsentRow text={text.consentRequired} tag={text.required} tone="required" />
                  <ConsentRow text={text.consentWhatsapp} tag={text.optional} tone="optional" />
                  <ConsentRow text={text.consentPush} tag={text.optional} tone="optional" />
                </ul>
                <p className="gtc-note">{text.doubleOptIn}</p>
                <p className="gtc-note">{text.withdraw}</p>
              </div>

              <div className="gtc-actions">
                <button type="button" className="gtc-button gtc-button--primary" disabled>
                  {text.submit}
                </button>
                <button type="button" className="gtc-button gtc-button--ghost" onClick={() => setFormOpen(false)}>
                  {text.formClose}
                </button>
              </div>
            </div>
          )}

          <div className="gtc-tabs-block">
            <h3 className="gtc-block__title">{text.tabsTitle}</h3>

            <div className="gtc-tabs" role="tablist" aria-label={text.tabsTitle}>
              {TAB_ORDER.map((tabId) => (
                <button
                  key={tabId}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tabId}
                  className={`gtc-tab${activeTab === tabId ? " is-active" : ""}`}
                  onClick={() => setActiveTab(tabId)}
                >
                  {text.tabs[tabId].name}
                </button>
              ))}
            </div>

            <div className="gtc-tabpanel" role="tabpanel">
              <div className="gtc-block__head">
                <h4>{activeCopy.name}</h4>
                {/* Jobs already exists, so it is the one area not marked soon. */}
                {activeTab !== "jobs" && <span className="gtc-soon">{text.soon}</span>}
              </div>
              <p className="gtc-tabpanel__text">{activeCopy.text}</p>

              {activeTab === "jobs" ? (
                <button
                  type="button"
                  className="gtc-button gtc-button--primary"
                  onClick={() => {
                    onClose();
                    navigateTo("/jobs");
                  }}
                >
                  {text.jobsButton}
                </button>
              ) : (
                <>
                  {/* Franchise is a single enquiry, not a directory: no search. */}
                  {activeTab !== "franchise" && (
                    <div className="gtc-search" aria-disabled="true">
                      <input type="text" disabled placeholder={text.searchPlaceholder} tabIndex={-1} />
                      <div className="gtc-search__filters">
                        {activeTab !== "online" && <button type="button" disabled>{text.filterCountry}</button>}
                        {activeTab !== "online" && <button type="button" disabled>{text.filterCity}</button>}
                        <button type="button" disabled>{text.filterCategory}</button>
                      </div>
                    </div>
                  )}
                  <p className="gtc-empty">{activeCopy.empty}</p>
                </>
              )}
            </div>
          </div>

          <div className="gtc-device-block">
            <div className="gtc-block__head">
              <h3>{text.deviceTitle}</h3>
              <span className="gtc-soon">{text.soon}</span>
            </div>
            <p className="gtc-tabpanel__text">{text.deviceText}</p>
            <button type="button" className="gtc-button gtc-button--primary" disabled>
              {text.deviceButton}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
