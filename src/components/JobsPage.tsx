import { type FormEvent, useEffect, useState } from "react";
import { getIntlLocale, type SiteLanguage, useSiteLanguage } from "../siteLanguage";
import { translateSiteText } from "../siteTranslations";
import "./jobs-page.css";

type Job = {
  slug: string;
  number: string;
  eyebrow: string;
  title: string;
  schedule: string;
  summary: string;
  responsibilities: string[];
  profile: string[];
};

export type PageMetadata = {
  title: string;
  description: string;
};

type ApplicationForm = {
  salutation: string;
  fullName: string;
  email: string;
  phoneCountry: string;
  phone: string;
  educationLevel: string;
  educationField: string;
  startDate: string;
  experience: string;
  german: string;
  turkish: string;
  english: string;
  otherLanguage: string;
  otherLanguageLevel: string;
  about: string;
  linkedIn: string;
  workAuthorization: "" | "yes" | "no";
};

const recruitmentApiUrl = import.meta.env.VITE_RECRUITMENT_API_URL as string | undefined;
const employmentModels = "Vollzeit | Teilzeit | Minijob";
const talentPoolConsentVersion = "2026-08-13";

const jobs: Job[] = [
  {
    slug: "servicekraft",
    number: "01",
    eyebrow: "SERVİS · MİSAFİRPERVERLİK",
    title: "Servis Personeli / Garson / Kellner (m/w/d)",
    schedule: employmentModels,
    summary:
      "Misafirlerimizi içtenlikle karşılar, masalarını dikkatle yönetir ve iyi bir yemeği eksiksiz bir deneyime dönüştürürsün.",
    responsibilities: [
      "Misafirleri profesyonel biçimde karşılamak, yerleştirmek ve uğurlamak",
      "Siparişleri doğru almak; yemek ve içecek servisini özenle yürütmek",
      "Menü hakkında bilgi vermek ve misafire uygun öneriler sunmak",
      "Kasa ve ödeme işlemlerini dikkatli, doğru ve şeffaf biçimde gerçekleştirmek",
      "Masa ve servis alanlarının düzenini korumak",
      "Mutfak ve bar ekibiyle koordineli çalışmak",
      "Hijyen, gıda güvenliği ve servis standartlarını eksiksiz uygulamak"
    ],
    profile: [
      "Gastronomi servisinde deneyim tercih sebebidir",
      "Güler yüzlü, kendine güvenen ve misafir odaklısındır",
      "Almanca ve Türkçe iletişim kurabilirsin",
      "Yoğun saatlerde dikkatini korur ve ekip çalışmasına uyum sağlarsın"
    ]
  },
  {
    slug: "host-hostess",
    number: "02",
    eyebrow: "KARŞILAMA · İLK İZLENİM",
    title: "Karşılama Personeli / Host / Hostess (m/w/d)",
    schedule: employmentModels,
    summary: "Misafirlerimizi sıcak bir karşılama ile ağırlarken rezervasyon ve masa akışını sakin, düzenli ve profesyonel biçimde yönetirsin.",
    responsibilities: [
      "Misafirleri karşılamak, masaya yerleştirmek ve uğurlamak",
      "Telefonla ve yüz yüze rezervasyon almak",
      "Masa doluluk planını ve bekleme sürecini yönetmek",
      "Gerektiğinde servis ekibine destek olmak",
      "Karşılama alanının düzenini ve güçlü ilk izlenimi korumak"
    ],
    profile: [
      "Temsil gücün yüksek, güler yüzlü ve misafir odaklısındır",
      "Karşılama veya servis deneyimi avantajdır",
      "Almanca iletişimin çok iyi, Türkçe iletişimin iyidir",
      "Yoğunlukta sakin kalır, planlı ve çözüm odaklı çalışırsın"
    ]
  },
  {
    slug: "kebap-izgara-ustasi",
    number: "03",
    eyebrow: "MUTFAK · AÇIK IZGARA",
    title: "Kebap ve Izgara Ustası / Grillkoch (m/w/d)",
    schedule: employmentModels,
    summary: "Geleneksel Türk ızgara tekniklerini kalite, ateş ve zamanlama disipliniyle birleştirerek her porsiyonda aynı standardı korursun.",
    responsibilities: [
      "Kebap ve ızgara etlerini reçeteye uygun hazırlamak ve pişirmek",
      "Et ürünlerinin tazelik ve kalite kontrolünü yapmak",
      "Pişirme sıcaklıklarını ve servis zamanlamasını yönetmek",
      "Yardımcı personele istasyon düzeni konusunda rehberlik etmek",
      "Mutfak ekibiyle yakın koordinasyon kurmak"
    ],
    profile: [
      "Kebap veya ızgara ustası olarak birkaç yıllık deneyimin vardır",
      "Geleneksel Türk ızgara tekniklerine hâkimsindir",
      "Fiziksel olarak dayanıklı, güvenilir ve kalite odaklısındır",
      "Almanca ve Türkçe ile mutfak ekibinde iletişim kurabilirsin"
    ]
  },
  {
    slug: "doener-ustasi",
    number: "04",
    eyebrow: "MUTFAK · ŞİŞ BAŞINDA USTALIK",
    title: "Döner Ustası / Döner-Meister (m/w/d)",
    schedule: employmentModels,
    summary: "Kesim, ısı ve zamanlamaya hâkim olarak döner ve dürüm üretiminde Bedri Usta kalitesini her porsiyonda korursun.",
    responsibilities: [
      "Döner etini hazırlamak ve şişe usulüne uygun dizmek",
      "Döner ve dürüm çeşitlerini doğru kalınlıkta kesmek ve porsiyonlamak",
      "Isı, pişme, tazelik ve servis hızını kontrol etmek",
      "Et stoklarını takip etmek ve ön hazırlığı planlamak",
      "Tehlike Analizi ve Kritik Kontrol Noktaları (HACCP), hijyen ve iş güvenliği kurallarını uygulamak"
    ],
    profile: [
      "Döner ustalığında sağlam deneyimin vardır",
      "Klasik ve modern döner ile dürüm hazırlama tekniklerini bilirsin",
      "Titiz, hijyenik ve yoğun tempoya dayanıklı çalışırsın",
      "Almanca ve Türkçe ile ekip içinde iletişim kurabilirsin"
    ]
  },
  {
    slug: "pide-firin-ustasi",
    number: "05",
    eyebrow: "MUTFAK · TAŞ FIRIN",
    title: "Pide, Lahmacun ve Taş Fırın Ustası (m/w/d)",
    schedule: employmentModels,
    summary: "Hamuru ve taş fırının zamanlamasını iyi bilir; pide, lahmacun ve lavaşı dengeli, temiz ve tam kıvamında hazırlarsın.",
    responsibilities: [
      "Pide, lahmacun ve lavaş hamurunu hazırlamak ve porsiyonlamak",
      "Ürünleri reçeteye uygun biçimde açmak, hazırlamak ve pişirmek",
      "Taş fırının ısısını ve üretim sırasını yönetmek",
      "Hamur kalitesini ve porsiyon standartlarını kontrol etmek",
      "Fırın istasyonunu düzenli ve hijyenik tutmak"
    ],
    profile: [
      "Pide, lahmacun veya taş fırın üretiminde deneyimlisin",
      "Geleneksel hamur tekniklerine hâkimsindir",
      "Sıcak ortamda ve ayakta çalışmaya uygunsundur",
      "Titiz, güvenilir ve ekip çalışmasına yatkınsındır"
    ]
  },
  {
    slug: "et-hazirlik-kasap",
    number: "06",
    eyebrow: "MUTFAK · ET HAZIRLIK",
    title: "Et Hazırlık Ustası / Kasap (m/w/d)",
    schedule: employmentModels,
    summary: "Kalitenin hazırlıkta başladığını bilir; etleri doğru teknik, hijyen ve soğuk zincir disipliniyle servise hazırlarsın.",
    responsibilities: [
      "Etleri parçalamak, ayıklamak, porsiyonlamak ve hazırlamak",
      "Kebap, ızgara, döner ve dürüm üretimi için et hazırlamak",
      "Soğuk zincir, sıcaklık kontrolü ve hijyen kurallarını uygulamak",
      "Stok takibi yapmak ve depo düzenini korumak",
      "Mutfak ekibinin günlük hazırlık planına destek olmak"
    ],
    profile: [
      "Et işleme veya kasaplık deneyimin vardır",
      "Gıda güvenliği ve çapraz bulaşma riskleri konusunda bilinçlisin",
      "Fiziksel olarak dayanıklı, dikkatli ve güvenilirsindir",
      "Yoğun mutfak temposunda ekip düzenine uyum sağlarsın"
    ]
  },
  {
    slug: "meze-salata-ustasi",
    number: "07",
    eyebrow: "MUTFAK · SOĞUK İSTASYON",
    title: "Meze ve Salata Ustası (m/w/d)",
    schedule: employmentModels,
    summary: "Türk meze kültürünü taze ürün, doğru reçete ve özenli sunumla buluşturarak soğuk istasyonun kalitesini yönetirsin.",
    responsibilities: [
      "Çeşitli mezeleri ve salataları günlük olarak hazırlamak",
      "Ürünlerin tazeliğini, lezzetini ve sunumunu kontrol etmek",
      "Reçete ve porsiyon standartlarını uygulamak",
      "Büfe ve alakart servis akışını desteklemek",
      "Soğuk istasyonun hijyenini ve düzenini korumak"
    ],
    profile: [
      "Soğuk mutfak veya meze hazırlama deneyimin vardır",
      "Türk meze kültürüne ve temel reçetelere hâkimsindir",
      "Titiz, yaratıcı ve sunum konusunda özenlisindir",
      "Yoğun tempoda ekip çalışmasına uyum sağlarsın"
    ]
  },
  {
    slug: "mutfak-yardimcisi",
    number: "08",
    eyebrow: "MUTFAK · EKİP DESTEĞİ",
    title: "Mutfak Yardımcısı / Küchenhilfe (m/w/d)",
    schedule: employmentModels,
    summary: "Hazırlık, düzen ve temizlik süreçlerinde mutfak ekibinin güçlü desteği olur; öğrenme isteğinle günlük akışa katkı sağlarsın.",
    responsibilities: [
      "Sebze, garnitür ve temel malzemeleri hazırlamak",
      "Ustalara ve aşçılara günlük üretimde destek olmak",
      "Mutfak alanlarının temizlik ve düzenini sağlamak",
      "Malzeme kabulü ve doğru depolama süreçlerine yardımcı olmak",
      "Hijyen ve iş güvenliği kurallarına uymak"
    ],
    profile: [
      "Gastronomi deneyimi avantajdır ancak zorunlu değildir",
      "Öğrenmeye istekli, güvenilir ve dikkatlisindir",
      "Fiziksel olarak dayanıklı ve çalışmaya isteklisindir",
      "Ekip çalışmasına ve yoğun tempoya uyum sağlarsın"
    ]
  },
  {
    slug: "bulasik-personeli",
    number: "09",
    eyebrow: "MUTFAK · TEMİZLİK",
    title: "Bulaşık Personeli / Spülkraft (m/w/d)",
    schedule: employmentModels,
    summary: "Temizliğin iyi bir mutfağın temeli olduğunu bilir; bulaşık ve ekipman akışını hızlı, dikkatli ve hijyenik biçimde yönetirsin.",
    responsibilities: [
      "Tabak, çatal-bıçak ve mutfak ekipmanlarını yıkamak",
      "Endüstriyel bulaşık makinesini doğru ve güvenli kullanmak",
      "Gerektiğinde ekipmanları elde yıkamak",
      "Bulaşık alanının hijyenini ve düzenini sağlamak",
      "Genel mutfak düzenine destek olmak"
    ],
    profile: [
      "Güvenilir, titiz ve düzenlisindir",
      "Fiziksel olarak dayanıklı ve yoğun tempoya uygunsundur",
      "Temel Almanca veya Türkçe ile ekip içinde iletişim kurabilirsin",
      "Bulaşık deneyimi avantajdır ancak öğrenme isteği de değerlidir"
    ]
  },
  {
    slug: "barista-icecek-nargile",
    number: "10",
    eyebrow: "İÇECEK · KAHVE · NARGİLE",
    title: "Barista / İçecek ve Nargile Servisi (m/w/d)",
    schedule: employmentModels,
    summary: "Türk çayı ve kahvesinden modern içeceklere kadar bar akışını yönetir, nargile servisinde misafirlere özenli bir deneyim sunarsın.",
    responsibilities: [
      "Türk çayı, Türk kahvesi, espresso ve sıcak içecekleri hazırlamak",
      "Ayran, meyve suyu, buzlu çay, milkshake ve kokteylleri hazırlamak",
      "Nargile hazırlığı, sunumu ve servis takibini yapmak",
      "Servis ekibine destek olmak ve tezgâh akışını yönetmek",
      "İçecek barı ile nargile alanının düzenini ve stoklarını takip etmek"
    ],
    profile: [
      "Barista, içecek veya nargile servisi deneyimi avantajdır",
      "Türk çay-kahve kültürüne ve modern kahve makinelerine ilgi duyarsın",
      "Güler yüzlü, hizmet odaklı ve iletişimi güçlüsündür",
      "Almanca ve Türkçe iletişim kurabilir, yoğun tempoya uyum sağlarsın"
    ]
  }
];

export function getJobsPageMetadata(pathname: string, language: SiteLanguage = "TR"): PageMetadata {
  const pathParts = pathname.replace(/\/+$/, "").split("/");
  const job = jobs.find((item) => item.slug === pathParts[2]);

  if (job) {
    return {
      title: `${translateSiteText(job.title, language)} | Bedri Usta Mannheim`,
      description: `${translateSiteText(job.summary, language)} ${language === "DE" ? "Stelle ansehen und beim Team von Bedri Usta Mannheim bewerben." : language === "ENG" ? "View the role and apply to join the Bedri Usta Mannheim team." : "Pozisyonu incele ve Bedri Usta Mannheim ekibine başvur."}`
    };
  }

  return {
    title: translateSiteText("Ekibimize Katıl | Bedri Usta Mannheim", language),
    description: translateSiteText("Bedri Usta Mannheim açık pozisyonlarını keşfet ve hızlıca başvur.", language)
  };
}

const initialForm: ApplicationForm = {
  salutation: "",
  fullName: "",
  email: "",
  phoneCountry: "+49",
  phone: "",
  educationLevel: "",
  educationField: "",
  startDate: "",
  experience: "",
  german: "",
  turkish: "",
  english: "",
  otherLanguage: "",
  otherLanguageLevel: "",
  about: "",
  linkedIn: "",
  workAuthorization: ""
};

function navigateTo(path: string, state: Record<string, unknown> = {}) {
  window.history.pushState(state, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function ApplicationProgress({ activeStep }: { activeStep: 1 | 2 }) {
  return (
    <div className="application-progress" aria-label={`Başvuru adımı ${activeStep} / 2`}>
      <div className={`application-progress__step ${activeStep === 1 ? "is-active" : "is-complete"}`}>
        <span aria-hidden="true" />
        <small>1 · Bilgilerin</small>
      </div>
      <div className={`application-progress__step ${activeStep === 2 ? "is-active" : ""}`}>
        <span aria-hidden="true" />
        <small>2 · Kontrol ve görüşme</small>
      </div>
    </div>
  );
}

const calendarWeekdays = {
  TR: ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"],
  DE: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  ENG: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
} as const;
const unavailableInterviewWeekdays = new Set([0, 1, 6]);
function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function AppointmentCalendar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const language = useSiteLanguage();
  const locale = getIntlLocale(language);
  const calendarMonthFormatter = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
  const calendarDateFormatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", weekday: "long" });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const firstDayOffset = (visibleMonth.getDay() + 6) % 7;
  const calendarStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1 - firstDayOffset);
  const currentMonthKey = today.getFullYear() * 12 + today.getMonth();
  const visibleMonthKey = visibleMonth.getFullYear() * 12 + visibleMonth.getMonth();
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    return date;
  });

  return (
    <div className="appointment-calendar" aria-label="Görüşme tarihi seç">
      <div className="appointment-calendar__header">
        <button type="button" aria-label="Önceki ay" disabled={visibleMonthKey <= currentMonthKey} onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}>←</button>
        <strong>{calendarMonthFormatter.format(visibleMonth)}</strong>
        <button type="button" aria-label="Sonraki ay" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}>→</button>
      </div>
      <div className="appointment-calendar__weekdays" aria-hidden="true">
        {calendarWeekdays[language].map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="appointment-calendar__days">
        {days.map((date) => {
          const key = toDateKey(date);
          const isUnavailableDay = unavailableInterviewWeekdays.has(date.getDay());
          const isPast = date < today;
          const isOutside = date.getMonth() !== visibleMonth.getMonth();
          const isDisabled = isUnavailableDay || isPast || isOutside;
          return (
            <button
              key={key}
              type="button"
              className={`${isUnavailableDay ? "is-unavailable-day" : ""} ${isOutside ? "is-outside" : ""} ${value === key ? "is-selected" : ""}`}
              disabled={isDisabled}
              aria-label={`${calendarDateFormatter.format(date)}${isUnavailableDay ? ", iş görüşmesi randevusu yok" : ""}`}
              aria-pressed={value === key}
              onClick={() => onChange(key)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <div className="appointment-calendar__legend"><span aria-hidden="true" /> Hafta sonu iş görüşmesi randevusu yok</div>
    </div>
  );
}

function useJobsMetadata(job?: Job) {
  useEffect(() => {
    const oldTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const oldDescription = description?.getAttribute("content") ?? "";
    const metadata = getJobsPageMetadata(job ? `/jobs/${job.slug}` : "/jobs");

    document.title = metadata.title;
    description?.setAttribute("content", metadata.description);

    return () => {
      document.title = oldTitle;
      description?.setAttribute("content", oldDescription);
    };
  }, [job]);
}

function JobsOverview() {
  useJobsMetadata();

  return (
    <main className="jobs-page jobs-overview">
      <section className="jobs-overview__team-hero" aria-label="Bedri Usta Mannheim ekibi">
        <img
          src="/images/bedri-usta-mannheim-careers-team-v2.jpg"
          alt="Bedri Usta Mannheim restoran ekibi birlikte"
          width="1673"
          height="940"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </section>
      <section className="jobs-overview__hero" aria-labelledby="jobs-title">
        <div className="jobs-shell">
          <p className="jobs-kicker">KARİYER · BEDRİ USTA MANNHEIM</p>
          <h1 id="jobs-title">Ekibimize katıl.</h1>
          <p className="jobs-overview__lead">
            Açık pozisyonlarımızda ortak anlayışımız aynı: içten misafirperverlik, gerçek ustalık ve ekip içinde saygı.
          </p>
          <div className="jobs-overview__facts" aria-label="Başvuru hakkında kısa bilgiler">
            <span>Mannheim · K1</span>
            <span>Kolay başvuru</span>
            <span>Hızlı başvuru</span>
          </div>
        </div>
      </section>

      <section className="jobs-overview__list" aria-labelledby="open-jobs-title">
        <div className="jobs-shell">
          <div className="jobs-section-title">
            <p className="jobs-kicker">AÇIK POZİSYONLAR</p>
            <h2 id="open-jobs-title">Yerini seç.</h2>
          </div>

          <div className="jobs-cards">
            {jobs.map((job) => (
              <a
                className="jobs-card"
                href={`/jobs/${job.slug}`}
                key={job.slug}
                onClick={(event) => {
                  event.preventDefault();
                  navigateTo(`/jobs/${job.slug}`);
                }}
              >
                <span className="jobs-card__number">{job.number}</span>
                <div className="jobs-card__body">
                  <p>{job.eyebrow}</p>
                  <h3>{job.title}</h3>
                  <div>
                    <span>Mannheim</span>
                    <span>{job.schedule}</span>
                  </div>
                </div>
                <span className="jobs-card__arrow" aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function JobDetail({ job }: { job: Job }) {
  const savedDraft = (window.history.state?.applicationDraft as ApplicationForm | undefined);
  const [form, setForm] = useState<ApplicationForm>({ ...initialForm, ...savedDraft });
  const [formAttempted, setFormAttempted] = useState(false);
  const [workAuthorizationError, setWorkAuthorizationError] = useState("");
  useJobsMetadata(job);

  const updateField = <K extends keyof ApplicationForm>(field: K, value: ApplicationForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormAttempted(true);
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.querySelector<HTMLElement>(":invalid")?.focus();
      return;
    }
    if (form.workAuthorization !== "yes") {
      setWorkAuthorizationError("Bu pozisyona başvurabilmek için Almanya’da yasal çalışma hakkına sahip olman gerekiyor.");
      return;
    }
    setWorkAuthorizationError("");
    window.history.replaceState({ applicationDraft: form }, "", window.location.href);
    navigateTo(`/jobs/${job.slug}/bewerbung`, { applicationDraft: form });
  };

  return (
    <main className="jobs-page job-page">
      <section className="job-page__header">
        <div className="jobs-shell">
          <button className="job-page__back" type="button" onClick={() => navigateTo("/jobs")}>
            <span aria-hidden="true">←</span> Tüm ilanlar
          </button>
          <p className="jobs-kicker">{job.eyebrow}</p>
          <h1>{job.title}</h1>
          <div className="job-page__meta">
            <span>Mannheim · K1 1–4</span>
            <span>{job.schedule}</span>
          </div>
          <p className="job-page__summary">{job.summary}</p>
          <a className="job-page__primary" href="#bewerbung">Başvuru yap <span>↓</span></a>
        </div>
      </section>

      <section className="job-page__description" aria-label="İş ilanı açıklaması">
        <div className="jobs-shell job-page__columns">
          <article>
            <p className="jobs-kicker jobs-kicker--dark">GÖREVLERİN</p>
            <ul>{job.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <p className="jobs-kicker jobs-kicker--dark">SENDEN BEKLEDİKLERİMİZ</p>
            <ul>{job.profile.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
        <div className="jobs-shell job-page__documents">
          <strong>İş görüşmesine gelirken</strong>
          <p>
            CV’ni, varsa diploma ve mesleki yeterlilik belgelerini; ayrıca çalışma belgelerini ve
            çalışma yetkini gösteren geçerli belgenin aslını yanında getir. Online formda kimlik veya belge kopyası yüklenmez.
          </p>
        </div>
      </section>

      <section className="job-application" id="bewerbung" aria-labelledby="application-title">
        <div className="jobs-shell job-application__layout">
          <header>
            <ApplicationProgress activeStep={1} />
            <p className="jobs-kicker">HIZLI BAŞVURU</p>
            <h2 id="application-title">Kısa ve kolay başvur.</h2>
            <p>Formu kısa sürede doldur, başvurunu kolayca tamamla.</p>
            <dl>
              <div><dt>Pozisyon</dt><dd>{job.title}</dd></div>
              <div><dt>Şube</dt><dd>Mannheim · K1 1–4</dd></div>
            </dl>
          </header>

          <form className={`job-form ${formAttempted ? "was-validated" : ""}`} noValidate onSubmit={handleSubmit}>
            <div className="job-form__grid">
              <label className="job-form__field">
                <span>Hitap *</span>
                <select
                  required
                  autoComplete="honorific-prefix"
                  value={form.salutation}
                  onChange={(event) => updateField("salutation", event.target.value)}
                >
                  <option value="">Seçiniz</option>
                  <option value="Herr">Herr</option>
                  <option value="Frau">Frau</option>
                  <option value="Divers">Divers</option>
                  <option value="Belirtmek istemiyorum">Belirtmek istemiyorum</option>
                </select>
              </label>
              <label className="job-form__field">
                <span>Ad ve soyad *</span>
                <input
                  required
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                />
              </label>
              <label className="job-form__field">
                <span>E-posta *</span>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
              </label>
              <label className="job-form__field">
                <span>Telefon *</span>
                <div className="job-form__phone">
                  <select
                    aria-label="Ülke kodu"
                    value={form.phoneCountry}
                    onChange={(event) => updateField("phoneCountry", event.target.value)}
                  >
                    <option value="+49">DE +49</option>
                    <option value="+90">TR +90</option>
                    <option value="+43">AT +43</option>
                    <option value="+41">CH +41</option>
                    <option value="+33">FR +33</option>
                  </select>
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="151 23456789"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                  />
                </div>
              </label>
              <label className="job-form__field job-form__field--paired">
                <span>En son mezun olunan okul / eğitim seviyesi *</span>
                <select
                  required
                  autoComplete="education-level"
                  value={form.educationLevel}
                  onChange={(event) => updateField("educationLevel", event.target.value)}
                >
                  <option value="">Seçiniz</option>
                  <option>Mezuniyet yok</option>
                  <option>Hauptschule</option>
                  <option>Realschule</option>
                  <option>Fachabitur</option>
                  <option>Abitur</option>
                  <option>Mesleki eğitim / Ausbildung</option>
                  <option>Ustalık / Meister</option>
                  <option>Ön lisans</option>
                  <option>Lisans</option>
                  <option>Yüksek lisans</option>
                  <option>Doktora</option>
                  <option>Diğer</option>
                </select>
              </label>
              <label className="job-form__field job-form__field--paired">
                <span>Bölüm / meslek alanı *</span>
                <input
                  required
                  autoComplete="organization-title"
                  placeholder="Örn. Gastronomi, aşçılık, işletme"
                  value={form.educationField}
                  onChange={(event) => updateField("educationField", event.target.value)}
                />
              </label>
              <label className="job-form__field">
                <span>En erken başlangıç tarihi *</span>
                <input
                  required
                  type="date"
                  value={form.startDate}
                  onChange={(event) => updateField("startDate", event.target.value)}
                />
              </label>
              <label className="job-form__field">
                <span>Bu pozisyondaki deneyimin *</span>
                <select
                  required
                  value={form.experience}
                  onChange={(event) => updateField("experience", event.target.value)}
                >
                  <option value="">Seçiniz</option>
                  <option value="Deneyim yok">Deneyim yok</option>
                  <option value="1 yıldan az">1 yıldan az</option>
                  <option value="1–3 yıl">1–3 yıl</option>
                  <option value="3 yıldan fazla">3 yıldan fazla</option>
                </select>
              </label>
              <fieldset className="job-form__languages job-form__field--wide">
                <legend>Bildiğin diller ve seviyeleri</legend>
                <p>Yalnızca konuşabildiğin dilleri seç.</p>
                <div className="job-form__language-grid">
                  <label><span>Almanca</span><select value={form.german} onChange={(event) => updateField("german", event.target.value)}><option value="">–</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option><option>Ana dil</option></select></label>
                  <label><span>Türkçe</span><select value={form.turkish} onChange={(event) => updateField("turkish", event.target.value)}><option value="">–</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option><option>Ana dil</option></select></label>
                  <label><span>İngilizce</span><select value={form.english} onChange={(event) => updateField("english", event.target.value)}><option value="">–</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option><option>Ana dil</option></select></label>
                  <label className="job-form__other-language"><span>Diğer dil</span><input value={form.otherLanguage} placeholder="Örn. Arapça" onChange={(event) => updateField("otherLanguage", event.target.value)} /></label>
                  <label><span>Seviye</span><select aria-label="Diğer dil seviyesi" disabled={!form.otherLanguage.trim()} value={form.otherLanguageLevel} onChange={(event) => updateField("otherLanguageLevel", event.target.value)}><option value="">–</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option><option>Ana dil</option></select></label>
                </div>
              </fieldset>
              <label className="job-form__field job-form__field--wide">
                <span>LinkedIn profili <small>isteğe bağlı</small></span>
                <input
                  type="url"
                  inputMode="url"
                  placeholder="https://linkedin.com/in/..."
                  value={form.linkedIn}
                  onChange={(event) => updateField("linkedIn", event.target.value)}
                />
              </label>
              <label className="job-form__field job-form__field--wide">
                <span>Kendinden ve deneyiminden kısaca bahset</span>
                <textarea
                  rows={4}
                  maxLength={800}
                  value={form.about}
                  onChange={(event) => updateField("about", event.target.value)}
                />
              </label>
            </div>

            <label className={`job-form__field job-form__field--authorization ${workAuthorizationError ? "has-error" : ""}`}>
              <span>Almanya’da yasal olarak çalışma hakkın var mı? *</span>
              <select
                required
                value={form.workAuthorization}
                aria-describedby={workAuthorizationError ? "work-authorization-error" : undefined}
                aria-invalid={Boolean(workAuthorizationError)}
                onChange={(event) => {
                  const value = event.target.value as ApplicationForm["workAuthorization"];
                  updateField("workAuthorization", value);
                  if (value === "yes") setWorkAuthorizationError("");
                }}
              >
                <option value="">Seçiniz</option>
                <option value="yes">Evet</option>
                <option value="no">Hayır</option>
              </select>
            </label>
            {workAuthorizationError && <p className="job-form__field-error" id="work-authorization-error" role="alert">{workAuthorizationError}</p>}

            <div className="job-form__privacy">
              <strong>Adaylar için veri koruma bilgilendirmesi</strong>
              <p>
                Başvurunu değerlendirmek ve işe alım sürecini yürütmek için verdiğin kişisel verileri işleriz.
                Verilerine yalnızca yetkili kişiler erişebilir. Site genelindeki veri işlemleri için
                <a href="/datenschutz"> Datenschutzerklärung’ı</a>; işe alım sürecine özel işleme amaçları,
                saklama süreleri ve hakların için
                <a href="/datenschutz#basvuru"> Adaylar İçin Veri Koruma Bilgilendirmesi’ni</a> inceleyebilirsin.
              </p>
            </div>

            <button className="job-form__submit" type="submit">
              Başvuruyu kontrol et <span aria-hidden="true">→</span>
            </button>
            {formAttempted && <p className="job-form__validation-hint" role="status">Kırmızı işaretli zorunlu alanları eksiksiz doldur.</p>}
            <p className="job-form__hint">
              Sonraki adımda bilgilerini kontrol edebilir, geri dönüp düzeltebilir ve tercih ettiğin
              görüşme zamanını seçebilirsin. Henüz hiçbir bilgi gönderilmez.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

function ApplicationReview({ job, form }: { job: Job; form: ApplicationForm }) {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "sending" | "sent" | "verifying" | "verified" | "error">("idle");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [documentsConfirmed, setDocumentsConfirmed] = useState(false);
  const [talentPoolConsent, setTalentPoolConsent] = useState(false);
  const [confirmationAttempted, setConfirmationAttempted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  useJobsMetadata(job);

  const languages = [
    form.german && `Almanca: ${form.german}`,
    form.turkish && `Türkçe: ${form.turkish}`,
    form.english && `İngilizce: ${form.english}`,
    form.otherLanguage && `${form.otherLanguage}: ${form.otherLanguageLevel || "seviye belirtilmedi"}`
  ].filter(Boolean).join(", ") || "Belirtilmedi";

  const goBack = () => {
    window.history.back();
  };

  const apiEndpoint = (path: string) => `${recruitmentApiUrl?.replace(/\/$/, "")}${path}`;

  const requestVerificationCode = async () => {
    setVerificationStatus("sending");
    setVerificationMessage("");

    try {
      if (!recruitmentApiUrl) throw new Error("unavailable");
      const response = await fetch(apiEndpoint("/email-verification/request"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, jobSlug: job.slug })
      });
      if (!response.ok) throw new Error("request-failed");
      setVerificationStatus("sent");
      setVerificationMessage(`Kod ${form.email} adresine gönderildi.`);
    } catch {
      setVerificationStatus("error");
      setVerificationMessage("Doğrulama kodu şu anda gönderilemedi. Lütfen kısa süre sonra tekrar dene.");
    }
  };

  const verifyEmailCode = async () => {
    if (!/^\d{6}$/.test(verificationCode)) {
      setVerificationStatus("error");
      setVerificationMessage("Lütfen e-postana gelen 6 haneli kodu gir.");
      return;
    }

    setVerificationStatus("verifying");
    setVerificationMessage("");
    try {
      if (!recruitmentApiUrl) throw new Error("unavailable");
      const response = await fetch(apiEndpoint("/email-verification/confirm"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: verificationCode })
      });
      if (!response.ok) throw new Error("verification-failed");
      const result = await response.json() as { token?: string };
      setVerificationToken(result.token ?? "verified");
      setVerificationStatus("verified");
      setVerificationMessage("E-posta adresin doğrulandı.");
    } catch {
      setVerificationStatus("error");
      setVerificationMessage("Kod doğrulanamadı. Kodu kontrol edip tekrar dene.");
    }
  };

  const submitApplication = async () => {
    setConfirmationAttempted(true);
    setSubmitMessage("");
    if (!appointmentDate || !appointmentTime || verificationStatus !== "verified" || !documentsConfirmed) {
      setSubmitStatus("error");
      setSubmitMessage("Devam etmek için tarih, saat, e-posta doğrulaması ve görüşme belgeleri onayını tamamla.");
      return;
    }

    setSubmitStatus("sending");
    try {
      if (!recruitmentApiUrl) throw new Error("unavailable");
      const response = await fetch(apiEndpoint("/applications"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobSlug: job.slug,
          form,
          appointmentDate,
          appointmentTime,
          verificationToken,
          talentPoolConsent: {
            granted: talentPoolConsent,
            durationMonths: talentPoolConsent ? 12 : null,
            noticeVersion: talentPoolConsentVersion
          }
        })
      });
      if (!response.ok) throw new Error("submit-failed");
      setSubmitStatus("success");
      setSubmitMessage("Başvurun ve görüşme randevun alındı. Onay e-postanı kısa süre içinde göndereceğiz.");
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Başvurun şu anda gönderilemedi. Lütfen kısa süre sonra tekrar dene.");
    }
  };

  return (
    <main className="jobs-page application-review">
      <section className="application-review__header">
        <div className="jobs-shell">
          <button className="job-page__back" type="button" onClick={goBack}><span>←</span> Bilgileri düzenle</button>
          <ApplicationProgress activeStep={2} />
          <p className="jobs-kicker">BAŞVURUYU KONTROL ET · ADIM 2</p>
          <h1>Neredeyse tamam.</h1>
          <p>Bilgilerini kontrol et ve yüz yüze görüşme için tercih ettiğin zamanı seç.</p>
        </div>
      </section>

      <section className="application-review__content">
        <div className="jobs-shell application-review__grid">
          <article className="application-summary">
            <div className="application-summary__title"><div><span>POZİSYON</span><h2>{job.title}</h2></div><button type="button" onClick={goBack}>Düzenle</button></div>
            <dl>
              <div><dt>Hitap</dt><dd>{form.salutation}</dd></div>
              <div><dt>Ad soyad</dt><dd>{form.fullName}</dd></div>
              <div><dt>E-posta</dt><dd>{form.email}</dd></div>
              <div><dt>Telefon</dt><dd>{form.phoneCountry} {form.phone}</dd></div>
              <div><dt>Okul / eğitim seviyesi</dt><dd>{form.educationLevel}</dd></div>
              <div><dt>Bölüm / meslek alanı</dt><dd>{form.educationField}</dd></div>
              <div><dt>Bu pozisyondaki deneyim</dt><dd>{form.experience}</dd></div>
              <div><dt>Diller</dt><dd>{languages}</dd></div>
              <div><dt>En erken başlangıç</dt><dd>{form.startDate}</dd></div>
              <div><dt>Almanya’da çalışma hakkı</dt><dd>{form.workAuthorization === "yes" ? "Evet" : "Hayır"}</dd></div>
              <div><dt>LinkedIn</dt><dd>{form.linkedIn || "Belirtilmedi"}</dd></div>
              <div className="application-summary__about"><dt>Kısa açıklama</dt><dd>{form.about || "Belirtilmedi"}</dd></div>
            </dl>
          </article>

          <aside className="appointment-card">
            <p className="jobs-kicker jobs-kicker--dark">GÖRÜŞME TERCİHİ</p>
            <h2>Ne zaman uygunsun?</h2>
            <p>Hafta içi görüşme tarihini ve uygun saatini seç.</p>
            <span className="appointment-card__field-label">Tarih *</span>
            <div className={`appointment-card__required-block ${confirmationAttempted && !appointmentDate ? "has-error" : ""}`}>
              <AppointmentCalendar value={appointmentDate} onChange={(value) => { setAppointmentDate(value); setAppointmentTime(""); }} />
            </div>
            {confirmationAttempted && !appointmentDate && <em className="appointment-card__error" role="alert">Bir görüşme tarihi seç.</em>}
            <label className={confirmationAttempted && !appointmentTime ? "has-error" : ""}><span>Saat aralığı *</span><select required aria-invalid={confirmationAttempted && !appointmentTime} value={appointmentTime} onChange={(event) => setAppointmentTime(event.target.value)}><option value="">Seçiniz</option><option>14:00–14:30</option><option>14:30–15:00</option><option>15:00–15:30</option><option>15:30–16:00</option><option>16:00–16:30</option><option>16:30–17:00</option></select></label>
            {confirmationAttempted && !appointmentTime && <em className="appointment-card__error" role="alert">Bir görüşme saati seç.</em>}
            <div className={`application-verification ${confirmationAttempted && verificationStatus !== "verified" ? "has-error" : ""}`}>
              <strong>E-posta adresini doğrula</strong>
              <p>6 haneli doğrulama kodunu başvuruda yazdığın <b>{form.email}</b> adresine göndeririz.</p>
              {verificationStatus !== "verified" && (
                <>
                  <button className="application-verification__send" type="button" disabled={verificationStatus === "sending"} onClick={requestVerificationCode}>
                    {verificationStatus === "sending" ? "Gönderiliyor…" : verificationStatus === "sent" || verificationStatus === "error" ? "Kodu yeniden gönder" : "Doğrulama kodu gönder"}
                  </button>
                  {(verificationStatus === "sent" || verificationStatus === "verifying" || verificationCode) && (
                    <div className="application-verification__code">
                      <label><span>6 haneli kod</span><input inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6))} /></label>
                      <button type="button" disabled={verificationStatus === "verifying"} onClick={verifyEmailCode}>{verificationStatus === "verifying" ? "Kontrol ediliyor…" : "Kodu doğrula"}</button>
                    </div>
                  )}
                </>
              )}
              {verificationMessage && <em className={verificationStatus === "verified" || verificationStatus === "sent" ? "is-success" : "is-error"} role="status">{verificationMessage}</em>}
              {confirmationAttempted && verificationStatus !== "verified" && !verificationMessage && <em className="is-error" role="alert">E-posta doğrulamasını tamamla.</em>}
            </div>
            <label className={`appointment-card__documents ${confirmationAttempted && !documentsConfirmed ? "has-error" : ""}`}>
              <input type="checkbox" checked={documentsConfirmed} onChange={(event) => setDocumentsConfirmed(event.target.checked)} />
              <span><strong>Görüşmeye getireceğim</strong><small>CV’mi, varsa diploma, mesleki yeterlilik ve çalışma belgelerimi getireceğim. Ayrıca Almanya’da çalışma yetkimi gösteren geçerli belgenin aslını görüşmede göstereceğim.</small></span>
            </label>
            {confirmationAttempted && !documentsConfirmed && <em className="appointment-card__error" role="alert">Devam etmek için bu kutuyu işaretle.</em>}
            <div className="appointment-card__privacy">
              <strong>Adaylar için veri koruma</strong>
              <p>
                Başvuru verilerini yalnızca işe alım sürecini yürütmek için işleriz. Genel bilgi için
                <a href="/datenschutz"> Datenschutzerklärung’ı</a>; işe alıma özel ayrıntılar, saklama süreleri
                ve hakların için <a href="/datenschutz#basvuru">Adaylar İçin Veri Koruma Bilgilendirmesi’ni</a> inceleyebilirsin.
              </p>
            </div>
            <label className="appointment-card__talent-pool">
              <input type="checkbox" checked={talentPoolConsent} onChange={(event) => setTalentPoolConsent(event.target.checked)} />
              <span>
                <strong>Aday havuzuna katılmak istiyorum <small>isteğe bağlı</small></strong>
                <small>
                  Başvurum sonuçlandıktan sonra profilimin Bedri Usta Mannheim’daki uygun gelecekteki pozisyonlar
                  için 12 ay saklanmasını kabul ediyorum. Bu seçim mevcut başvurumu etkilemez ve her zaman geri alınabilir.
                </small>
              </span>
            </label>
            <button className="job-form__submit" type="button" disabled={submitStatus === "sending" || submitStatus === "success"} onClick={submitApplication}>{submitStatus === "sending" ? "Gönderiliyor…" : submitStatus === "success" ? "Başvuru alındı" : "Başvuruyu ve randevuyu onayla"} <span>→</span></button>
            {submitMessage && <p className={`appointment-card__submit-message ${submitStatus === "success" ? "is-success" : "is-error"}`} role="status">{submitMessage}</p>}
          </aside>
        </div>
      </section>
    </main>
  );
}

export function JobsPage() {
  const pathParts = window.location.pathname.replace(/\/+$/, "").split("/");
  const slug = pathParts[2];
  const step = pathParts[3];
  const job = jobs.find((item) => item.slug === slug);

  if (!slug) return <JobsOverview />;
  if (job && step === "bewerbung") {
    const draft = window.history.state?.applicationDraft as ApplicationForm | undefined;
    if (draft) return <ApplicationReview job={job} form={draft} />;
    return <JobDetail job={job} />;
  }
  if (job && !step) return <JobDetail job={job} />;

  return (
    <main className="jobs-page jobs-not-found">
      <div className="jobs-shell">
        <p className="jobs-kicker">İLAN BULUNAMADI</p>
        <h1>Bu pozisyon artık mevcut değil.</h1>
        <button type="button" onClick={() => navigateTo("/jobs")}>Açık pozisyonlara dön</button>
      </div>
    </main>
  );
}
