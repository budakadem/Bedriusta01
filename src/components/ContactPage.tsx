import { type FormEvent, useEffect, useState } from "react";
import "./reservation-page.css";
import "./contact-page.css";

const restaurantAddress = "K1 1-4, 68159 Mannheim, Almanya";
const restaurantAddressWithName = `Bedri Usta ${restaurantAddress}`;
const googleMapsPlaceLink = "https://maps.app.goo.gl/NZHsiEJmyTg9nVgRA";
const openingHours = [
  { days: "Pazar — Perşembe", time: "08:00 — 24:00" },
  { days: "Cuma — Cumartesi", time: "08:00 — 01:00" }
] as const;

type ContactForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

const initialForm: ContactForm = { firstName: "", lastName: "", email: "", phone: "", message: "" };

async function copyAddress(onCopied?: () => void) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(restaurantAddressWithName);
    onCopied?.();
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = restaurantAddressWithName;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
  onCopied?.();
}

function scrollToForm() {
  document.getElementById("mesaj-formu")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ContactPage() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [addressCopied, setAddressCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    window.requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ block: "start" }));
  }, []);

  const update = (field: keyof ContactForm, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleCopyAddress = async () => {
    await copyAddress(() => {
      setAddressCopied(true);
      window.setTimeout(() => setAddressCopied(false), 2600);
    });
  };

  const submitContactForm = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof ContactForm, string>> = {};
    if (!form.firstName.trim()) nextErrors.firstName = "Adını girmelisin.";
    if (!form.lastName.trim()) nextErrors.lastName = "Soyadını girmelisin.";
    if (!form.email.trim()) nextErrors.email = "E-posta adresini girmelisin.";
    if (!form.message.trim()) nextErrors.message = "Mesajını girmelisin.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitted(true);
  };

  return (
    <main className="reservation-page">
      <header className="reservation-intro">
        <div className="reservation-shell">
          <button className="reservation-back" type="button" onClick={() => window.history.back()} aria-label="Önceki sayfaya dön">← Geri dön</button>
          <p className="reservation-kicker">BEDRİ USTA MANNHEIM</p>
          <h1>İletişim</h1>
          <p>Sorularınız ve mesajlarınız için buradayız.</p>
        </div>
      </header>

      <section className="reservation-content">
        <div className="reservation-shell reservation-shell--form">
          <div className="contact-tiles">
            <button type="button" className="contact-tile" onClick={scrollToForm}>
              <span className="contact-tile__label">İletişim Formu</span>
              <span className="contact-tile__value">Mesaj gönder</span>
            </button>
            <a className="contact-tile" href="mailto:info@bedriusta.de">
              <span className="contact-tile__label">E-posta</span>
              <span className="contact-tile__value">info@bedriusta.de</span>
            </a>
            <div className="contact-tile contact-tile--muted">
              <span className="contact-tile__label">WhatsApp</span>
              <span className="contact-tile__value">Numara yakında</span>
            </div>
            <div className="contact-tile contact-tile--muted">
              <span className="contact-tile__label">Telefon</span>
              <span className="contact-tile__value">Numara yakında</span>
            </div>
          </div>

          <div className="reservation-form">
            <div className="reservation-steps">
              <section className="reservation-section" aria-labelledby="contact-info">
                <div className="reservation-section__heading">
                  <span>01</span>
                  <div><h2 id="contact-info">Adres ve çalışma saatleri</h2><p>Bize Mannheim şehir merkezinde ulaşabilirsin.</p></div>
                </div>

                <div className="reservation-section__body">
                  <div className="reservation-grid reservation-grid--two">
                    {openingHours.map((hours) => (
                      <div key={hours.days} className="reservation-field">
                        <span>{hours.days}</span>
                        <p style={{ margin: 0 }}>{hours.time}</p>
                      </div>
                    ))}
                  </div>

                  <div className="reservation-field">
                    <span>Adres</span>
                    <p style={{ margin: 0 }}>{restaurantAddress}</p>
                  </div>

                  <div className="reservation-grid reservation-grid--two">
                    <button type="button" className="reservation-map-link" onClick={handleCopyAddress}>
                      Adresi kopyala
                    </button>
                    <a className="reservation-map-link" href={googleMapsPlaceLink} target="_blank" rel="noreferrer">Haritada aç ↗</a>
                  </div>
                  {addressCopied && <p className="reservation-verified reservation-verified--panel">Adres kopyalandı.</p>}
                </div>
              </section>

              {submitted ? (
                <section className="reservation-section" id="mesaj-formu" aria-labelledby="contact-sent">
                  <div className="reservation-section__heading">
                    <span>02</span>
                    <div><h2 id="contact-sent">Mesajın alındı</h2></div>
                  </div>
                  <div className="reservation-section__body">
                    <p className="reservation-verified reservation-verified--panel">
                      Teşekkürler, {form.firstName}! Bu form altyapısı yakında tamamen aktif olacak;
                      şimdilik mesajını not aldık. Acil konular için bize doğrudan yazabilirsin:{" "}
                      <a href="mailto:info@bedriusta.de">info@bedriusta.de</a>
                    </p>
                  </div>
                </section>
              ) : (
                <form onSubmit={submitContactForm} noValidate>
                  <section className="reservation-section" id="mesaj-formu" aria-labelledby="contact-form">
                    <div className="reservation-section__heading">
                      <span>02</span>
                      <div><h2 id="contact-form">Mesaj gönder</h2><p>Sorunu veya talebini bize ilet.</p></div>
                    </div>

                    <div className="reservation-section__body">
                      <div className="reservation-grid reservation-grid--two">
                        <label className={errors.firstName ? "reservation-field reservation-field--invalid" : "reservation-field"}>
                          <span>Ad *</span>
                          <input autoComplete="given-name" value={form.firstName} onChange={(event) => update("firstName", event.target.value)} aria-invalid={Boolean(errors.firstName)} />
                          {errors.firstName && <span className="reservation-field__error">{errors.firstName}</span>}
                        </label>
                        <label className={errors.lastName ? "reservation-field reservation-field--invalid" : "reservation-field"}>
                          <span>Soyad *</span>
                          <input autoComplete="family-name" value={form.lastName} onChange={(event) => update("lastName", event.target.value)} aria-invalid={Boolean(errors.lastName)} />
                          {errors.lastName && <span className="reservation-field__error">{errors.lastName}</span>}
                        </label>
                      </div>
                      <div className="reservation-grid reservation-grid--two">
                        <label className={errors.email ? "reservation-field reservation-field--invalid" : "reservation-field"}>
                          <span>E-posta *</span>
                          <input type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} />
                          {errors.email && <span className="reservation-field__error">{errors.email}</span>}
                        </label>
                        <label className="reservation-field">
                          <span>Telefon <em>(isteğe bağlı)</em></span>
                          <input type="tel" autoComplete="tel" placeholder="+49 ..." value={form.phone} onChange={(event) => update("phone", event.target.value)} />
                        </label>
                      </div>
                      <label className={errors.message ? "reservation-field reservation-field--invalid" : "reservation-field"}>
                        <span>Mesaj *</span>
                        <textarea rows={5} value={form.message} onChange={(event) => update("message", event.target.value)} aria-invalid={Boolean(errors.message)} />
                        {errors.message && <span className="reservation-field__error">{errors.message}</span>}
                      </label>

                      <button type="submit" className="reservation-submit">Mesajı gönder</button>
                    </div>
                  </section>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
