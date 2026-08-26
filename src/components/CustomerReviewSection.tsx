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
    starHint: "Yıldıza dokunarak deneyiminizi değerlendirin.",
    starLabel: (rating: number) => `${rating} yıldız ver`,
    improveTitle: "Daha iyisini yapmak istiyoruz.",
    improveText: "Beklentinizi tam olarak karşılayamadıysak, bize neyi geliştirebileceğimizi söyleyin.",
    privateCta: "Görüşünüzü bizimle paylaşın",
    publicHint: "Deneyiminizi herkese açık olarak da paylaşabilirsiniz.",
    google: "Google'da değerlendir",
    googleStrong: "Google'da değerlendir",
    tripadvisor: "Tripadvisor'da değerlendir",
    thanksTitle: "Teşekkür ederiz! ❤️",
    thanksText: "Deneyiminizi başkalarıyla da paylaşmanız bizi çok mutlu eder.",
    directLink: "Görüşünüzü doğrudan bize iletin",
    tripadvisorUnavailable: "Tripadvisor profilimiz hazır olduğunda bağlantı burada aktif olacaktır.",
    emailBody: (rating: number) => `Puanım: ${rating}/5\n\nGörüşüm:`
  },
  DE: {
    eyebrow: "IHR ERLEBNIS",
    title: "Wir geben alles für 5 Sterne.",
    subtitle: "Wie haben Ihnen unsere Küche und Ihr Besuch gefallen?",
    heritage: "Mit jedem Teller bewahren wir die Werte, für die Bedri Usta seit über 50 Jahren steht: ehrliches Handwerk, echte Gastfreundschaft und Geschmack, der Menschen verbindet.",
    starHint: "Tippen Sie auf einen Stern, um Ihr Erlebnis zu bewerten.",
    starLabel: (rating: number) => `${rating} Sterne vergeben`,
    improveTitle: "Wir möchten es besser machen.",
    improveText: "Wenn wir Ihre Erwartungen nicht vollständig erfüllt haben, sagen Sie uns bitte, was wir verbessern können.",
    privateCta: "Feedback direkt mit uns teilen",
    publicHint: "Sie können Ihre Erfahrung auch öffentlich teilen.",
    google: "Bei Google bewerten",
    googleStrong: "Bei Google bewerten",
    tripadvisor: "Bei Tripadvisor bewerten",
    thanksTitle: "Vielen Dank! ❤️",
    thanksText: "Wir würden uns sehr freuen, wenn Sie Ihre Erfahrung auch mit anderen teilen.",
    directLink: "Feedback direkt an uns senden",
    tripadvisorUnavailable: "Sobald unser Tripadvisor-Profil verfügbar ist, wird der Link hier aktiviert.",
    emailBody: (rating: number) => `Meine Bewertung: ${rating}/5\n\nMein Feedback:`
  },
  ENG: {
    eyebrow: "YOUR EXPERIENCE",
    title: "We Give Our Best for 5 Stars",
    subtitle: "How did you enjoy our food and your experience?",
    heritage: "With every plate, we uphold the values Bedri Usta has stood for over 50 years: honest craftsmanship, genuine hospitality and flavours that bring people together.",
    starHint: "Tap a star to rate your experience.",
    starLabel: (rating: number) => `Give ${rating} stars`,
    improveTitle: "We want to do better.",
    improveText: "If we did not fully meet your expectations, please tell us what we can improve.",
    privateCta: "Share your feedback with us",
    publicHint: "You can also share your experience publicly.",
    google: "Review us on Google",
    googleStrong: "Review us on Google",
    tripadvisor: "Review us on Tripadvisor",
    thanksTitle: "Thank you! ❤️",
    thanksText: "We would be delighted if you shared your experience with others.",
    directLink: "Send feedback directly to us",
    tripadvisorUnavailable: "The link will be activated here as soon as our Tripadvisor profile is ready.",
    emailBody: (rating: number) => `My rating: ${rating}/5\n\nMy feedback:`
  }
} as const;

export function CustomerReviewSection() {
  const [language, setLanguage] = useState<SiteLanguage>(() => getSiteLanguage());
  const [rating, setRating] = useState(0);
  const [linkNotice, setLinkNotice] = useState("");
  const text = copy[language];

  useEffect(() => subscribeToSiteLanguage(setLanguage), []);

  const selectRating = (nextRating: number) => {
    setRating(nextRating);
    setLinkNotice("");
  };

  const openPublicReview = (url: string | null) => {
    if (!url) {
      setLinkNotice(text.tripadvisorUnavailable);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openEmailFeedback = () => {
    const subject = "Feedback Bedri Usta Mannheim";
    const body = text.emailBody(rating);
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const PublicReviewButtons = ({ prominent = false }: { prominent?: boolean }) => (
    <div className={`customer-review__public-actions${prominent ? " customer-review__public-actions--prominent" : ""}`}>
      <button type="button" onClick={() => openPublicReview(GOOGLE_REVIEW_URL)}>
        <img src="/icons/google-review.svg" alt="" aria-hidden="true" />
        <span>{prominent ? text.googleStrong : text.google}</span>
      </button>
      <button type="button" onClick={() => openPublicReview(null)}>
        <img src="/icons/tripadvisor-review.svg" alt="" aria-hidden="true" />
        <span>{text.tripadvisor}</span>
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

        <div className="customer-review__stars" role="group" aria-label={text.subtitle}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => selectRating(star)}
              aria-label={text.starLabel(star)}
              aria-pressed={rating === star}
              className={star <= rating ? "is-selected" : undefined}
            >
              {star <= rating ? "★" : "☆"}
            </button>
          ))}
        </div>
        <p className="customer-review__hint">{text.starHint}</p>

        {rating > 0 && (
          <div className="customer-review__result" aria-live="polite">
            {rating < 5 ? (
              <>
                <h3>{text.improveTitle}</h3>
                <p>{text.improveText}</p>
                <button type="button" className="customer-review__primary" onClick={openEmailFeedback}>
                  {text.privateCta}
                </button>
                <p className="customer-review__public-hint">{text.publicHint}</p>
                <PublicReviewButtons />
              </>
            ) : (
              <>
                <h3>{text.thanksTitle}</h3>
                <p>{text.thanksText}</p>
                <PublicReviewButtons prominent />
                <button type="button" className="customer-review__text-link" onClick={openEmailFeedback}>
                  {text.directLink}
                </button>
              </>
            )}
            {linkNotice && <p className="customer-review__notice" role="status">{linkNotice}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
