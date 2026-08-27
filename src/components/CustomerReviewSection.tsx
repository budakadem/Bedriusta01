import { useEffect, useState } from "react";
import { getSiteLanguage, subscribeToSiteLanguage, type SiteLanguage } from "../siteLanguage";
import "./customer-review-section.css";

const GOOGLE_REVIEW_URL = "https://g.page/r/CduOWlmMjBxOEBM/review";
const FEEDBACK_EMAIL = "info@bedriusta.de";

const copy = {
  TR: {
    eyebrow: "DENEYİMİNİZ",
    title: "5 Yıldız İçin Çalışıyoruz",
    subtitle: "Lezzetimizi ve deneyiminizi nasıl buldunuz?",
    heritage: "Her tabakta Bedri Usta’nın 50 yılı aşan değerlerine sahip çıkıyoruz: dürüst ustalık, gerçek misafirperverlik ve insanları aynı sofrada buluşturan lezzet.",
    googleStrong: "Google'da değerlendir",
    tripadvisor: "Tripadvisor'da değerlendir",
    thanksTitle: "Teşekkür ederiz! ❤️",
    thanksText: "Deneyiminizi başkalarıyla da paylaşmanız bizi çok mutlu eder.",
    directLink: "Bir tavsiyeniz veya isteğiniz mi var? Bize doğrudan yazın.",
    ratingLabel: "5 üzerinden 5 yıldız",
    tripadvisorUnavailable: "Tripadvisor profilimiz hazır olduğunda bağlantı burada aktif olacaktır.",
    emailSubject: "Bedri Usta Mannheim'a mesaj",
    emailBody: "Tavsiyem / isteğim:"
  },
  DE: {
    eyebrow: "IHR ERLEBNIS",
    title: "Wir geben alles für 5 Sterne.",
    subtitle: "Wie haben Ihnen unsere Küche und Ihr Besuch gefallen?",
    heritage: "Mit jedem Teller bewahren wir die Werte, für die Bedri Usta seit über 50 Jahren steht: ehrliches Handwerk, echte Gastfreundschaft und Geschmack, der Menschen verbindet.",
    googleStrong: "Bei Google bewerten",
    tripadvisor: "Bei Tripadvisor bewerten",
    thanksTitle: "Vielen Dank! ❤️",
    thanksText: "Wir würden uns sehr freuen, wenn Sie Ihre Erfahrung auch mit anderen teilen.",
    directLink: "Haben Sie einen Tipp oder einen Wunsch? Schreiben Sie uns direkt.",
    ratingLabel: "5 von 5 Sternen",
    tripadvisorUnavailable: "Sobald unser Tripadvisor-Profil verfügbar ist, wird der Link hier aktiviert.",
    emailSubject: "Nachricht an Bedri Usta Mannheim",
    emailBody: "Mein Tipp / Wunsch:"
  },
  ENG: {
    eyebrow: "YOUR EXPERIENCE",
    title: "We Give Our Best for 5 Stars",
    subtitle: "How did you enjoy our food and your experience?",
    heritage: "With every plate, we uphold the values Bedri Usta has stood for over 50 years: honest craftsmanship, genuine hospitality and flavours that bring people together.",
    googleStrong: "Review us on Google",
    tripadvisor: "Review us on Tripadvisor",
    thanksTitle: "Thank you! ❤️",
    thanksText: "We would be delighted if you shared your experience with others.",
    directLink: "Have a suggestion or a request? Write to us directly.",
    ratingLabel: "5 out of 5 stars",
    tripadvisorUnavailable: "The link will be activated here as soon as our Tripadvisor profile is ready.",
    emailSubject: "Message to Bedri Usta Mannheim",
    emailBody: "My suggestion / request:"
  }
} as const;

export function CustomerReviewSection() {
  const [language, setLanguage] = useState<SiteLanguage>(() => getSiteLanguage());
  const [linkNotice, setLinkNotice] = useState("");
  const text = copy[language];

  useEffect(() => subscribeToSiteLanguage(setLanguage), []);

  const openPublicReview = (url: string | null) => {
    if (!url) {
      setLinkNotice(text.tripadvisorUnavailable);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openEmailFeedback = () => {
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(text.emailSubject)}&body=${encodeURIComponent(text.emailBody)}`;
  };

  const PublicReviewButtons = () => (
    <div className="customer-review__public-actions customer-review__public-actions--prominent">
      <button type="button" onClick={() => openPublicReview(GOOGLE_REVIEW_URL)}>
        <img src="/icons/google-review.svg" alt="" aria-hidden="true" />
        <span className="customer-review__platform-copy">
          <span>{text.googleStrong}</span>
          <span className="customer-review__platform-stars" aria-label={text.ratingLabel}>★★★★★</span>
        </span>
      </button>
      <button type="button" onClick={() => openPublicReview(null)}>
        <img src="/icons/tripadvisor-review.svg" alt="" aria-hidden="true" />
        <span className="customer-review__platform-copy">
          <span>{text.tripadvisor}</span>
          <span className="customer-review__platform-stars" aria-label={text.ratingLabel}>★★★★★</span>
        </span>
      </button>
    </div>
  );

  return (
    <section id="customer-review" className="customer-review" aria-labelledby="customer-review-title">
      <div className="customer-review__inner">
        <p className="customer-review__eyebrow">
          <span>{text.eyebrow}</span>
          <span className="customer-review__eyebrow-stars" aria-hidden="true">★★★★★</span>
        </p>
        <h2 id="customer-review-title">{text.title}</h2>
        <p className="customer-review__subtitle">{text.subtitle}</p>
        <p className="customer-review__heritage">{text.heritage}</p>

        <div className="customer-review__stars" role="img" aria-label={text.ratingLabel}>
          <span aria-hidden="true">★★★★★</span>
        </div>

        <div className="customer-review__result">
          <h3>{text.thanksTitle}</h3>
          <p>{text.thanksText}</p>
          <PublicReviewButtons />
          <button type="button" className="customer-review__text-link" onClick={openEmailFeedback}>
            {text.directLink}
          </button>
          {linkNotice && <p className="customer-review__notice" role="status">{linkNotice}</p>}
        </div>
      </div>
    </section>
  );
}
