import { useEffect } from "react";
import { useSiteLanguage } from "../siteLanguage";
import "./golden-tabla-club.css";

/**
 * Golden Tabla Club — preview build.
 *
 * Nothing here is wired to a backend yet: there is no Supabase project, so the
 * form deliberately does not accept input and the notification check does not
 * run. Every interactive control is rendered in its final design but disabled
 * and labelled "coming soon", so the layout can be reviewed and approved now
 * and switched on later without a redesign.
 *
 * Nothing is collected, stored or sent from this page, which is why it adds no
 * new consent or privacy obligations in this state.
 */

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

    joinTitle: "Kulübe katıl",
    joinNote: "Kayıtlar çok yakında açılıyor.",
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
    joinButton: "Üye ol",

    searchTitle: "Ara ve filtrele",
    searchPlaceholder: "İşletme veya kategori ara…",
    filterCountry: "Ülke",
    filterCity: "Şehir",
    filterCategory: "Kategori",
    searchNote: "Arama, ilk partnerler eklendiğinde açılacak.",

    sectionsTitle: "Kulüpte neler var?",
    sections: [
      {
        no: "01",
        name: "İndirimler",
        text: "Şu an geçerli olan fırsatlar. Bedri Usta’nın kendi indirimleri her zaman en üstte."
      },
      {
        no: "02",
        name: "Partnerler",
        text: "Avrupa’daki iş ortaklarımızın dizini. Ülkeye ve şehre göre listelenir."
      },
      {
        no: "03",
        name: "Online Partnerler",
        text: "Kargoyla her yere gönderen iş ortakları. Konum fark etmez."
      },
      {
        no: "04",
        name: "Franchise ve İş Ortaklığı",
        text: "Tablayı kendi şehrine taşımak isteyenler için."
      }
    ],

    permissionsTitle: "İletişim tercihleri",
    permissionsText:
      "Hangi kanaldan haber almak istediğine tek tek karar verirsin. Hiçbiri önceden işaretli değildir ve her birini istediğin zaman kapatabilirsin.",
    permissions: ["E-posta ile kampanya", "WhatsApp ile kampanya", "Push bildirimi", "Partner fırsatları"],

    deviceTitle: "Cihaz ve bildirim durumu",
    deviceText:
      "Uygulamanın ana ekrana eklenip eklenmediğini, bildirim izninin durumunu ve cihaz kaydını buradan görebileceksin.",
    deviceButton: "Bildirim durumunu kontrol et"
  },

  DE: {
    metaTitle: "Golden Tabla Club | Bedri Usta",
    metaDescription:
      "Das europäische Handwerker- und Händlernetzwerk nach den Werten von Bedri Usta. Angebote, Partnerrabatte und Online-Aktionen an einem Ort.",
    kicker: "GOLDEN TABLA CLUB",
    soon: "Demnächst",
    storyTitle: "Eine Tabla, ein Netzwerk.",
    storyLead:
      "Ein 14-jähriger Junge verkaufte in den Straßen Adanas Kebab von einem dreirädrigen Wagen, einer Tabla. Den Wagen bekam er vom einen, die Kohle vom anderen, das Fleisch vom nächsten, das Gemüse von wieder einem anderen. Diese Tabla war nicht nur ein Stand — sie war ein Netzwerk von Händlern.",
    storyHighlight: "Heute bauen wir dasselbe Netzwerk in Europa auf.",
    storyInvite:
      "Möchten Sie über Angebote, Partner, Rabatte und Online-Aktionen informiert werden? Werden Sie Teil des Clubs — mit den Werten von Bedri Usta.",

    joinTitle: "Dem Club beitreten",
    joinNote: "Die Anmeldung öffnet in Kürze.",
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
    joinButton: "Mitglied werden",

    searchTitle: "Suchen und filtern",
    searchPlaceholder: "Betrieb oder Kategorie suchen…",
    filterCountry: "Land",
    filterCity: "Stadt",
    filterCategory: "Kategorie",
    searchNote: "Die Suche wird aktiviert, sobald die ersten Partner eingetragen sind.",

    sectionsTitle: "Was bietet der Club?",
    sections: [
      {
        no: "01",
        name: "Rabatte",
        text: "Aktuell gültige Angebote. Die Angebote von Bedri Usta stehen immer ganz oben."
      },
      {
        no: "02",
        name: "Partner",
        text: "Das Verzeichnis unserer Partner in Europa, nach Land und Stadt sortiert."
      },
      {
        no: "03",
        name: "Online-Partner",
        text: "Partner, die europaweit versenden. Der Standort spielt keine Rolle."
      },
      {
        no: "04",
        name: "Franchise und Partnerschaft",
        text: "Für alle, die die Tabla in ihre eigene Stadt bringen möchten."
      }
    ],

    permissionsTitle: "Kommunikationseinstellungen",
    permissionsText:
      "Sie entscheiden für jeden Kanal einzeln. Nichts ist vorausgewählt, und Sie können jede Einwilligung jederzeit widerrufen.",
    permissions: [
      "Aktionen per E-Mail",
      "Aktionen per WhatsApp",
      "Push-Benachrichtigungen",
      "Partnerangebote"
    ],

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

    joinTitle: "Join the club",
    joinNote: "Registration opens very soon.",
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
    joinButton: "Become a member",

    searchTitle: "Search and filter",
    searchPlaceholder: "Search a business or category…",
    filterCountry: "Country",
    filterCity: "City",
    filterCategory: "Category",
    searchNote: "Search will open once the first partners are listed.",

    sectionsTitle: "What is in the club?",
    sections: [
      {
        no: "01",
        name: "Discounts",
        text: "Offers valid right now. Bedri Usta's own offers are always at the top."
      },
      {
        no: "02",
        name: "Partners",
        text: "The directory of our partners across Europe, listed by country and city."
      },
      {
        no: "03",
        name: "Online Partners",
        text: "Partners who ship anywhere. Location does not matter."
      },
      {
        no: "04",
        name: "Franchise and Partnership",
        text: "For those who want to bring the tabla to their own city."
      }
    ],

    permissionsTitle: "Communication preferences",
    permissionsText:
      "You decide channel by channel. Nothing is pre-selected, and you can withdraw any consent at any time.",
    permissions: ["Campaigns by email", "Campaigns by WhatsApp", "Push notifications", "Partner offers"],

    deviceTitle: "Device and notification status",
    deviceText:
      "Here you will see whether the app has been added to your home screen, the notification permission status and whether your device is registered.",
    deviceButton: "Check notification status"
  }
} as const;

function SoonBadge({ label }: { label: string }) {
  return <span className="club-soon">{label}</span>;
}

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

  return (
    <main className="club-page">
      {/* Story first: nobody fills in a form before knowing what they are joining. */}
      <section className="club-hero">
        <div className="club-shell">
          <p className="club-kicker">{text.kicker}</p>
          <h1>{text.storyTitle}</h1>
          <p className="club-hero__lead">{text.storyLead}</p>
          <p className="club-hero__highlight">{text.storyHighlight}</p>
          <p className="club-hero__invite">{text.storyInvite}</p>
        </div>
      </section>

      <section className="club-join" aria-labelledby="club-join-title">
        <div className="club-shell">
          <div className="club-panel">
            <div className="club-panel__head">
              <h2 id="club-join-title">{text.joinTitle}</h2>
              <SoonBadge label={text.soon} />
            </div>
            <p className="club-panel__note">{text.joinNote}</p>

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

            <button type="button" className="club-submit" disabled>
              {text.joinButton} · {text.soon}
            </button>
          </div>
        </div>
      </section>

      <section className="club-search" aria-labelledby="club-search-title">
        <div className="club-shell">
          <div className="club-panel">
            <div className="club-panel__head">
              <h2 id="club-search-title">{text.searchTitle}</h2>
              <SoonBadge label={text.soon} />
            </div>
            <div className="club-searchbar" aria-disabled="true">
              <input type="text" disabled placeholder={text.searchPlaceholder} tabIndex={-1} />
              <div className="club-searchbar__filters">
                <button type="button" disabled>{text.filterCountry}</button>
                <button type="button" disabled>{text.filterCity}</button>
                <button type="button" disabled>{text.filterCategory}</button>
              </div>
            </div>
            <p className="club-panel__note">{text.searchNote}</p>
          </div>
        </div>
      </section>

      <section className="club-sections" aria-labelledby="club-sections-title">
        <div className="club-shell">
          <h2 id="club-sections-title" className="club-sections__title">{text.sectionsTitle}</h2>
          <div className="club-cards">
            {text.sections.map((section) => (
              <article className="club-card" key={section.no}>
                <span className="club-card__no">{section.no}</span>
                <div className="club-card__body">
                  <h3>{section.name}</h3>
                  <p>{section.text}</p>
                </div>
                <SoonBadge label={text.soon} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="club-permissions" aria-labelledby="club-permissions-title">
        <div className="club-shell">
          <div className="club-panel">
            <div className="club-panel__head">
              <h2 id="club-permissions-title">{text.permissionsTitle}</h2>
              <SoonBadge label={text.soon} />
            </div>
            <p className="club-panel__note">{text.permissionsText}</p>
            <ul className="club-permission-list">
              {text.permissions.map((permission) => (
                <li key={permission}>
                  <span className="club-permission__box" aria-hidden="true" />
                  <span>{permission}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kept as a disabled control rather than removed: this is the device
              and notification check that gets switched on with the backend. */}
          <div className="club-panel club-panel--device">
            <div className="club-panel__head">
              <h2>{text.deviceTitle}</h2>
              <SoonBadge label={text.soon} />
            </div>
            <p className="club-panel__note">{text.deviceText}</p>
            <button type="button" className="club-device-button" disabled>
              {text.deviceButton}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
