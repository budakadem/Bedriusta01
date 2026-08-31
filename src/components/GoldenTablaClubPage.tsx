import { useEffect, useState } from "react";
import { useSiteLanguage } from "../siteLanguage";
import "./golden-tabla-club.css";

/**
 * Golden Tabla Club — preview build.
 *
 * No backend exists yet, so every control is rendered in its final design but
 * disabled. Nothing is collected, stored or sent from this page, which is why
 * it carries no consent or privacy obligation in this state.
 *
 * Two deliberate structural choices:
 * - the sign-up form is behind a button rather than shown to every visitor,
 *   because a long dead form is the worst thing to put in front of someone who
 *   has not yet decided to join;
 * - the four areas are tabs, so the page stays short and the visitor picks
 *   what they want to see instead of scrolling past three sections they don't.
 */

type TabId = "discounts" | "partners" | "online" | "franchise";

const TAB_ORDER: TabId[] = ["discounts", "partners", "online", "franchise"];

const copy = {
  TR: {
    metaTitle: "Golden Tabla Club | Bedri Usta",
    metaDescription:
      "Bedri Usta’nın değerleriyle kurulan Avrupa esnaf ağı. Fırsatlar, partner indirimleri ve online kampanyalar tek çatı altında.",
    kicker: "GOLDEN TABLA CLUB",
    soon: "Yakında",
    storyTitle: "Bir tabla, bir ağ.",
    storyLead:
      "14 yaşında bir çocuk, Adana sokaklarında üç tekerlekli bir tablayla kebap satıyordu. Tablayı birinden, kömürü birinden, eti birinden, sebzeyi birinden aldı. O tabla tek başına bir tezgâh değildi — bir esnaf ağıydı.",
    storyHighlight: "Bugün aynı ağı Avrupa’da kuruyoruz.",
    storyInvite:
      "Fırsatlardan, partnerlerden, indirimlerden ve online kampanyalardan haberdar olmak ister misin? Bedri Usta’nın değerleriyle kulübe katıl.",

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
      optional: "isteğe bağlı"
    },
    permissionsTitle: "Hangi kanaldan haber almak istersin?",
    permissionsNote: "Hiçbiri önceden işaretli değildir; her birini istediğin zaman kapatabilirsin.",
    permissions: ["E-posta ile kampanya", "WhatsApp ile kampanya", "Push bildirimi", "Partner fırsatları"],
    submit: "Üyeliği tamamla",

    tabsTitle: "Kulüpte neler var?",
    searchPlaceholder: "İşletme veya kategori ara…",
    filterCountry: "Ülke",
    filterCity: "Şehir",
    filterCategory: "Kategori",
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
      franchise: {
        name: "Franchise",
        text: "Tablayı kendi şehrine taşımak isteyenler için iş ortaklığı.",
        empty: "Başvuru koşulları çok yakında yayınlanacak."
      }
    },

    deviceTitle: "Cihaz ve bildirim durumu",
    deviceText:
      "Uygulamanın ana ekrana eklenip eklenmediğini, bildirim izninin durumunu ve cihaz kaydını buradan görebileceksin.",
    deviceButton: "Bildirim durumunu kontrol et"
  },

  DE: {
    metaTitle: "Golden Tabla Club | Bedri Usta",
    metaDescription:
      "Das europäische Händlernetzwerk nach den Werten von Bedri Usta. Angebote, Partnerrabatte und Online-Aktionen an einem Ort.",
    kicker: "GOLDEN TABLA CLUB",
    soon: "Demnächst",
    storyTitle: "Eine Tabla, ein Netzwerk.",
    storyLead:
      "Ein 14-jähriger Junge verkaufte in den Straßen Adanas Kebab von einem dreirädrigen Wagen, einer Tabla. Den Wagen bekam er vom einen, die Kohle vom anderen, das Fleisch vom nächsten, das Gemüse von wieder einem anderen. Diese Tabla war nicht nur ein Stand — sie war ein Netzwerk von Händlern.",
    storyHighlight: "Heute bauen wir dasselbe Netzwerk in Europa auf.",
    storyInvite:
      "Möchten Sie über Angebote, Partner, Rabatte und Online-Aktionen informiert werden? Werden Sie Teil des Clubs — mit den Werten von Bedri Usta.",

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
      optional: "optional"
    },
    permissionsTitle: "Worüber möchten Sie informiert werden?",
    permissionsNote: "Nichts ist vorausgewählt; Sie können jede Einwilligung jederzeit widerrufen.",
    permissions: [
      "Aktionen per E-Mail",
      "Aktionen per WhatsApp",
      "Push-Benachrichtigungen",
      "Partnerangebote"
    ],
    submit: "Mitgliedschaft abschließen",

    tabsTitle: "Was bietet der Club?",
    searchPlaceholder: "Betrieb oder Kategorie suchen…",
    filterCountry: "Land",
    filterCity: "Stadt",
    filterCategory: "Kategorie",
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
      franchise: {
        name: "Franchise",
        text: "Partnerschaft für alle, die die Tabla in ihre eigene Stadt bringen möchten.",
        empty: "Die Bedingungen werden in Kürze veröffentlicht."
      }
    },

    deviceTitle: "Geräte- und Benachrichtigungsstatus",
    deviceText:
      "Hier sehen Sie, ob die App zum Startbildschirm hinzugefügt wurde, wie der Benachrichtigungsstatus ist und ob Ihr Gerät registriert ist.",
    deviceButton: "Benachrichtigungsstatus prüfen"
  },

  ENG: {
    metaTitle: "Golden Tabla Club | Bedri Usta",
    metaDescription:
      "The European network of traders built on Bedri Usta's values. Offers, partner discounts and online campaigns in one place.",
    kicker: "GOLDEN TABLA CLUB",
    soon: "Coming soon",
    storyTitle: "One tabla, one network.",
    storyLead:
      "A 14-year-old boy sold kebab from a three-wheeled cart — a tabla — in the streets of Adana. He got the cart from one person, the coal from another, the meat from another, the vegetables from another. That tabla was not just a stall — it was a network of traders.",
    storyHighlight: "Today we are building that same network across Europe.",
    storyInvite:
      "Would you like to hear about offers, partners, discounts and online campaigns? Join the club, built on Bedri Usta's values.",

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
      optional: "optional"
    },
    permissionsTitle: "What would you like to hear about?",
    permissionsNote: "Nothing is pre-selected; you can withdraw any consent at any time.",
    permissions: ["Campaigns by email", "Campaigns by WhatsApp", "Push notifications", "Partner offers"],
    submit: "Complete membership",

    tabsTitle: "What is in the club?",
    searchPlaceholder: "Search a business or category…",
    filterCountry: "Country",
    filterCity: "City",
    filterCategory: "Category",
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
      franchise: {
        name: "Franchise",
        text: "Partnership for those who want to bring the tabla to their own city.",
        empty: "The conditions will be published very soon."
      }
    },

    deviceTitle: "Device and notification status",
    deviceText:
      "Here you will see whether the app has been added to your home screen, the notification permission status and whether your device is registered.",
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

export function GoldenTablaClubPage() {
  const language = useSiteLanguage();
  const text = copy[language];
  const [formOpen, setFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("discounts");

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

  const activeCopy = text.tabs[activeTab];

  return (
    <main className="club-page">
      {/* Story first: nobody joins something they have not understood yet. */}
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
              onClick={() => setFormOpen((open) => !open)}
              aria-expanded={formOpen}
              aria-controls="club-form-panel"
            >
              {text.joinCta}
              <span className="club-cta__chevron" aria-hidden="true">{formOpen ? "↑" : "↓"}</span>
            </button>
            <span className="club-cta__note">{text.joinCtaNote}</span>
          </div>
        </div>
      </section>

      {/* Revealed only on request, not pushed at every visitor. */}
      {formOpen && (
        <section className="club-form-section" id="club-form-panel">
          <div className="club-shell">
            <div className="club-card club-card--form">
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
                <PreviewField label={text.fields.birthDate} optionalLabel={text.fields.optional} />
                <PreviewField label={text.fields.phone} optionalLabel={text.fields.optional} />
              </div>

              <div className="club-consents">
                <h3>{text.permissionsTitle}</h3>
                <p>{text.permissionsNote}</p>
                <ul>
                  {text.permissions.map((permission) => (
                    <li key={permission}>
                      {/* Empty boxes on purpose: nothing may look pre-selected. */}
                      <span className="club-consents__box" aria-hidden="true" />
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
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

      {/* Four areas as tabs: the page stays short and the visitor chooses. */}
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
              <span className="club-soon">{text.soon}</span>
            </div>
            <p className="club-panel__text">{activeCopy.text}</p>

            {/* Franchise is a single enquiry, not a directory: no search there. */}
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
          </div>
        </div>
      </section>

      {/* Kept as a disabled control rather than removed: this is the device and
          notification check that gets switched on with the backend. */}
      <section className="club-device-section">
        <div className="club-shell">
          <div className="club-card club-card--device">
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
