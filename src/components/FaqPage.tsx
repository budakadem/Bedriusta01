import { useSiteLanguage } from "../siteLanguage";
import { translateSiteText } from "../siteTranslations";
import "./faq-page.css";

const questions = [
  {
    question: "Ürünleriniz helal mi?",
    answer: "Evet. Et ürünlerimiz helal standartlarına uygundur."
  },
  {
    question: "Alkollü içecek servis ediyor musunuz?",
    answer: "Hayır. İşletmemizde alkollü içecek servisi yapılmaz."
  }
] as const;

export function FaqPage() {
  const language = useSiteLanguage();
  const t = (value: string) => translateSiteText(value, language);

  return (
    <main className="faq-page">
      <header className="faq-hero">
        <div className="faq-shell">
          <button className="faq-back" type="button" onClick={() => window.history.back()}>
            <span aria-hidden="true">←</span> {t("Geri dön")}
          </button>
          <p className="faq-kicker">FAQ · BEDRİ USTA MANNHEIM</p>
          <h1>{t("Merak edilenler, kısa ve net.")}</h1>
          <p className="faq-lead">
            {t("Helal ürünlerimiz ve alkolsüz servis anlayışımız hakkında kısa cevaplar.")}
          </p>
        </div>
      </header>

      <section className="faq-content" aria-labelledby="faq-title">
        <div className="faq-shell">
          <h2 id="faq-title">{t("Sık Sorulan Sorular")}</h2>
          <div className="faq-grid">
            {questions.map((item, index) => (
              <article className="faq-card" key={item.question}>
                <span className="faq-card__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{t(item.question)}</h3>
                <p>{t(item.answer)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
