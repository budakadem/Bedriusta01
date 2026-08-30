import { FormEvent, useState } from "react";
import "./reservation-page.css";
import { createReservationTimeOptions, reservationDefaults } from "../config/reservation";
import { ReservationDatePicker } from "./ReservationDatePicker";
import { getIntlLocale, type SiteLanguage, useSiteLanguage } from "../siteLanguage";
import { translateSiteText, translateSiteTextTemplate } from "../siteTranslations";

type ReservationKind = "normal" | "group";
type ReservationForm = {
  partySize: string;
  groupPartySize: string;
  date: string;
  time: string;
  note: string;
  salutation: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

const reservationApiUrl = (import.meta.env.VITE_RESERVATION_API_URL as string | undefined)?.replace(/\/$/, "");
const timeOptions = createReservationTimeOptions(reservationDefaults);

const initialForm: ReservationForm = {
  partySize: "",
  groupPartySize: "",
  date: "",
  time: "",
  note: "",
  salutation: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: ""
};

function berlinDate(offsetDays = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: reservationDefaults.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function berlinCalendarDate({ months = 0, years = 0 }: { months?: number; years?: number }) {
  const [year, month, day] = berlinDate().split("-").map(Number);
  const monthIndex = month - 1 + months + years * 12;
  const targetYear = year + Math.floor(monthIndex / 12);
  const targetMonthIndex = ((monthIndex % 12) + 12) % 12;
  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, targetMonthIndex + 1, 0)).getUTCDate();
  const targetDay = Math.min(day, lastDayOfTargetMonth);
  return `${targetYear}-${String(targetMonthIndex + 1).padStart(2, "0")}-${String(targetDay).padStart(2, "0")}`;
}

function formattedDate(value: string, locale: string, language: SiteLanguage) {
  if (!value) return translateSiteText("Seçilmedi", language);
  return new Intl.DateTimeFormat(locale, {
    timeZone: reservationDefaults.timeZone,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${value}T12:00:00+02:00`));
}

function berlinTimeInMinutes() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: reservationDefaults.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(values.hour) * 60 + Number(values.minute);
}

function availableTimesForDate(date: string) {
  if (!date || date !== berlinDate()) return timeOptions;
  const nowInMinutes = berlinTimeInMinutes();
  return timeOptions.filter((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes > nowInMinutes;
  });
}

function FieldError({ children }: { children?: string }) {
  return children ? <span className="reservation-field__error" role="alert">{children}</span> : null;
}

export function ReservationPage() {
  const language = useSiteLanguage();
  const locale = getIntlLocale(language);
  const t = (value: string) => translateSiteText(value, language);
  const tpl = (key: string, vars: Record<string, string | number>) => translateSiteTextTemplate(key, language, vars);
  const [form, setForm] = useState<ReservationForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpCode, setOtpCode] = useState("");
  const [verificationState, setVerificationState] = useState<"idle" | "sending" | "sent" | "checking" | "verified">("idle");
  const [serviceMessage, setServiceMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ reference: string; status: string } | null>(null);

  const reservationKind: ReservationKind = form.partySize === "group" ? "group" : "normal";
  const maxDate = reservationKind === "group"
    ? berlinCalendarDate({ years: reservationDefaults.groupBookingWindowYears })
    : berlinCalendarDate({ months: reservationDefaults.normalBookingWindowMonths });
  const availableTimeOptions = availableTimesForDate(form.date);
  const groupPartySize = Number(form.groupPartySize);
  const groupSizeValid = Number.isInteger(groupPartySize)
    && groupPartySize > reservationDefaults.groupThreshold
    && groupPartySize <= reservationDefaults.capacityWindowGuestLimit;
  const groupSizeLimitError = form.groupPartySize && groupPartySize > reservationDefaults.capacityWindowGuestLimit
    ? tpl("En fazla {limit} kişi olabilir.", { limit: reservationDefaults.capacityWindowGuestLimit })
    : "";
  const partySelectionComplete = Boolean(form.partySize) && (reservationKind === "normal" || groupSizeValid);
  const partyLabel = reservationKind === "group"
    ? form.groupPartySize ? tpl("{n} kişi, grup talebi", { n: form.groupPartySize }) : tpl("{n}’den fazla kişi", { n: reservationDefaults.groupThreshold })
    : form.partySize ? `${form.partySize} ${t("kişi")}` : t("Kişi seçilmedi");
  const scheduleComplete = partySelectionComplete && Boolean(form.date && form.time);
  const reservationDetailsComplete = scheduleComplete;
  const contactDetailsComplete = reservationDetailsComplete
    && Boolean(form.salutation && form.firstName.trim() && form.lastName.trim())
    && /^\+?[0-9 ()-]{8,20}$/.test(form.phone.trim())
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());

  const update = <K extends keyof ReservationForm>(key: K, value: ReservationForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    if (key === "email") {
      setVerificationState("idle");
      setOtpCode("");
    }
  };

  const changePartySize = (nextPartySize: string) => {
    const nextKind: ReservationKind = nextPartySize === "group" ? "group" : "normal";
    const nextMaxDate = nextKind === "group"
      ? berlinCalendarDate({ years: reservationDefaults.groupBookingWindowYears })
      : berlinCalendarDate({ months: reservationDefaults.normalBookingWindowMonths });

    setForm((current) => ({
      ...current,
      partySize: nextPartySize,
      groupPartySize: nextKind === "group" ? current.groupPartySize : "",
      date: current.date && current.date <= nextMaxDate ? current.date : "",
      time: ""
    }));
    setErrors((current) => {
      const next = { ...current };
      ["partySize", "groupPartySize", "date", "time"].forEach((key) => delete next[key]);
      return next;
    });
    setServiceMessage("");
  };

  const changeGroupPartySize = (nextGroupPartySize: string) => {
    setForm((current) => ({ ...current, groupPartySize: nextGroupPartySize, time: "" }));
    setErrors((current) => {
      const next = { ...current };
      delete next.groupPartySize;
      delete next.time;
      return next;
    });
    setServiceMessage("");
  };

  const changeDate = (nextDate: string) => {
    setForm((current) => ({ ...current, date: nextDate, time: "" }));
    setErrors((current) => {
      const next = { ...current };
      delete next.date;
      delete next.time;
      return next;
    });
    setServiceMessage("");
  };

  const validateAll = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.partySize) nextErrors.partySize = t("Kişi sayısını seçmelisin.");
    if (reservationKind === "group" && !groupSizeValid) nextErrors.groupPartySize = tpl("Kişi sayısı {min}–{max} arasında olmalı.", { min: reservationDefaults.groupThreshold + 1, max: reservationDefaults.capacityWindowGuestLimit });
    if (!form.date) nextErrors.date = t("Tarih seçmelisin.");
    if (!form.time) nextErrors.time = t("Saat seçmelisin.");
    if (!form.salutation) nextErrors.salutation = t("Hitap seçmelisin.");
    if (!form.firstName.trim()) nextErrors.firstName = t("Adını yazmalısın.");
    if (!form.lastName.trim()) nextErrors.lastName = t("Soyadını yazmalısın.");
    if (!/^\+?[0-9 ()-]{8,20}$/.test(form.phone.trim())) nextErrors.phone = t("Geçerli bir telefon numarası yazmalısın.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = t("Geçerli bir e-posta adresi yazmalısın.");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      window.requestAnimationFrame(() => {
        const firstInvalid = document.querySelector<HTMLElement>(".reservation-field--invalid input, .reservation-field--invalid select, .reservation-field--invalid textarea, .reservation-field--invalid button");
        firstInvalid?.focus();
        firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return false;
    }
    return true;
  };

  const sendVerification = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setErrors((current) => ({ ...current, email: t("Önce geçerli bir e-posta adresi yazmalısın.") }));
      return false;
    }
    if (!reservationApiUrl) {
      setServiceMessage(t("E-posta doğrulama servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar dene."));
      return false;
    }
    setVerificationState("sending");
    setServiceMessage("");
    try {
      const response = await fetch(`${reservationApiUrl}/verification/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, purpose: "restaurant_reservation" })
      });
      if (!response.ok) throw new Error();
      setVerificationState("sent");
      setServiceMessage(t("Altı haneli doğrulama kodu e-posta adresine gönderildi."));
      return true;
    } catch {
      setVerificationState("idle");
      setServiceMessage(t("Kod şu anda gönderilemedi. Lütfen biraz sonra yeniden dene."));
      return false;
    }
  };

  const verifyCode = async () => {
    if (!/^\d{6}$/.test(otpCode)) {
      setServiceMessage(t("Altı haneli kodu eksiksiz yazmalısın."));
      return;
    }
    if (!reservationApiUrl) return;
    setVerificationState("checking");
    try {
      const response = await fetch(`${reservationApiUrl}/verification/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: otpCode, purpose: "restaurant_reservation" })
      });
      if (!response.ok) throw new Error();
      setVerificationState("verified");
      setServiceMessage(t("E-posta adresin doğrulandı."));
    } catch {
      setVerificationState("sent");
      setServiceMessage(t("Kod geçersiz veya süresi dolmuş. Lütfen tekrar dene."));
    }
  };

  const submitReservation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateAll()) return;
    if (!reservationApiUrl) {
      setServiceMessage(t("Rezervasyon sistemi şu anda kullanılamıyor. Lütfen daha sonra tekrar dene."));
      return;
    }
    if (verificationState !== "verified") {
      const codeSent = await sendVerification();
      if (codeSent) {
        window.requestAnimationFrame(() => document.getElementById("eposta-kodu")?.scrollIntoView({ behavior: "smooth", block: "center" }));
      }
      return;
    }
    setSubmitting(true);
    setServiceMessage("");
    try {
      const endpoint = reservationKind === "group" ? "group-requests" : "reservations";
      const response = await fetch(`${reservationApiUrl}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationCode: "mannheim",
          timeZone: reservationDefaults.timeZone,
          kind: reservationKind,
          ...form
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 409) throw new Error("slot_unavailable");
        throw new Error("submit_failed");
      }
      setConfirmation({ reference: result.reference ?? "", status: reservationKind === "group" ? t("ONAY BEKLİYOR") : t("ONAYLANDI") });
    } catch (error) {
      setServiceMessage(error instanceof Error && error.message === "slot_unavailable"
        ? t("Bu saat az önce doldu. Lütfen başka bir saat seç.")
        : t("İşlem şu anda tamamlanamadı. Bilgilerin kaydedilmedi; lütfen yeniden dene."));
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <main className="reservation-page reservation-result">
        <section className="reservation-result__card">
          <span className="reservation-result__mark" aria-hidden="true">✓</span>
          <p>{reservationKind === "group" ? t("GRUP TALEBİ") : t("REZERVASYON")}</p>
          <h1>{reservationKind === "group" ? t("Talebin gönderildi.") : t("Rezervasyonun onaylandı.")}</h1>
          <div className="reservation-result__status">{confirmation.status}</div>
          <dl>
            <div><dt>{t("Tarih")}</dt><dd>{formattedDate(form.date, locale, language)}</dd></div>
            <div><dt>{t("Saat")}</dt><dd>{form.time}</dd></div>
            <div><dt>{t("Kişi")}</dt><dd>{partyLabel}</dd></div>
            {confirmation.reference && <div><dt>{t("Referans")}</dt><dd>{confirmation.reference}</dd></div>}
          </dl>
          {reservationKind === "group" && <p className="reservation-result__note">{t("Ekibimiz seninle iletişime geçecek. Talep, personel onayından sonra kesinleşir.")}</p>}
          <button type="button" onClick={() => window.location.assign("/")}>{t("Ana sayfaya dön")}</button>
        </section>
      </main>
    );
  }

  return (
    <main className="reservation-page">
      <header className="reservation-intro">
        <div className="reservation-shell">
          <button className="reservation-back" type="button" onClick={() => window.history.back()} aria-label={t("Önceki sayfaya dön")}>{t("← Geri dön")}</button>
          <p className="reservation-kicker">BEDRİ USTA MANNHEIM</p>
          <h1>{t("Rezervasyon")}</h1>
          <p>Restaurant &amp; Café</p>
        </div>
      </header>

      <section className="reservation-content">
        <div className="reservation-shell reservation-shell--form">
          <form className="reservation-form" onSubmit={submitReservation} noValidate>
            <div className="reservation-steps">
            <section className={`reservation-section reservation-section--tracked ${partySelectionComplete ? "is-complete" : "is-active"}`} aria-labelledby="kisi-sayisi">
              <div className="reservation-section__heading">
                <span>01</span>
                <div><h2 id="kisi-sayisi">{t("Kişi sayısı")}</h2><p>{t("Rezervasyona katılacak kişi sayısını seç.")}</p></div>
              </div>

              <div className="reservation-section__body">
                <label className={errors.partySize ? "reservation-field reservation-field--invalid" : "reservation-field"}>
                  <span>{t("Kişi sayısı *")}</span>
                  <select value={form.partySize} onChange={(event) => changePartySize(event.target.value)} aria-invalid={Boolean(errors.partySize)}>
                    <option value="">{t("Seçiniz")}</option>
                    {Array.from({ length: reservationDefaults.groupThreshold }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count} {t("kişi")}</option>)}
                    <option value="group">{tpl("{n} kişiden fazla, grup talebi", { n: reservationDefaults.groupThreshold })}</option>
                  </select>
                  <FieldError>{errors.partySize}</FieldError>
                </label>

                {reservationKind === "group" && (
                  <label className={errors.groupPartySize || groupSizeLimitError ? "reservation-field reservation-field--invalid" : "reservation-field"}>
                    <span>{t("Grup kişi sayısı *")}</span>
                    <input type="number" inputMode="numeric" min={reservationDefaults.groupThreshold + 1} max={reservationDefaults.capacityWindowGuestLimit} value={form.groupPartySize} onChange={(event) => changeGroupPartySize(event.target.value)} placeholder={`${reservationDefaults.groupThreshold + 1}–${reservationDefaults.capacityWindowGuestLimit}`} aria-invalid={Boolean(errors.groupPartySize || groupSizeLimitError)} />
                    <FieldError>{groupSizeLimitError || errors.groupPartySize}</FieldError>
                  </label>
                )}
              </div>
            </section>

            <section className={`reservation-section reservation-section--tracked ${reservationDetailsComplete ? "is-complete" : partySelectionComplete ? "is-active" : "is-locked"}`} aria-labelledby="tarih-saat-not" aria-disabled={!partySelectionComplete}>
              <div className="reservation-section__heading">
                <span>02</span>
                <div><h2 id="tarih-saat-not">{t("Tarih, saat ve not")}</h2><p>{t("Ziyaret zamanını seç ve varsa notunu ekle.")}</p></div>
              </div>

              {partySelectionComplete ? <div className="reservation-section__body">

                <div className="reservation-grid reservation-grid--two">
                  <div className={errors.date ? "reservation-field reservation-field--invalid" : "reservation-field"}>
                    <span>{reservationKind === "group" ? t("Tercih edilen tarih *") : t("Tarih *")}</span>
                    <ReservationDatePicker min={berlinDate()} max={maxDate} value={form.date} onChange={changeDate} invalid={Boolean(errors.date)} />
                    <FieldError>{errors.date}</FieldError>
                  </div>
                  <label className={errors.time ? "reservation-field reservation-field--invalid" : "reservation-field"}>
                    <span>{reservationKind === "group" ? t("Tercih edilen saat *") : t("Saat *")}</span>
                    <select value={form.time} onChange={(event) => update("time", event.target.value)} aria-invalid={Boolean(errors.time)}>
                      <option value="">{t("Seçiniz")}</option>
                      {availableTimeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <FieldError>{errors.time}</FieldError>
                  </label>
                </div>

                {reservationKind === "group" && (
                  <div className="reservation-info">
                    {t("20 kişiden büyük gruplarda talebin ekibimiz tarafından kontrol edilir ve iletişim sonrasında kesinleşir.")}
                  </div>
                )}
                <label className="reservation-field">
                  <span>{t("Not")} <em>{t("(isteğe bağlı)")}</em></span>
                  <textarea
                    rows={4}
                    maxLength={600}
                    value={form.note}
                    onChange={(event) => update("note", event.target.value)}
                    placeholder={t("İş yemeği, doğum günü, pasta talebi, evlilik yıldönümü, çocuk sandalyesi veya diğer özel istekler...")}
                    aria-label={t("Not (isteğe bağlı)")}
                  />
                  <small>{form.note.length}/600</small>
                </label>
              </div> : <div className="reservation-section__locked"><span aria-hidden="true">02</span><p>{t("Önce kişi sayısını seç.")}</p></div>}
            </section>

            <section className={`reservation-section reservation-section--tracked ${contactDetailsComplete ? "is-complete" : reservationDetailsComplete ? "is-active" : "is-locked"}`} aria-labelledby="iletisim" aria-disabled={!reservationDetailsComplete}>
              <div className="reservation-section__heading">
                <span>03</span>
                <div><h2 id="iletisim">{t("İletişim")}</h2><p>{t("Onay ve rezervasyon bilgileri için.")}</p></div>
              </div>
              {reservationDetailsComplete ? <div className="reservation-section__body">
                <div className="reservation-grid reservation-grid--name">
                  <label className={errors.salutation ? "reservation-field reservation-field--invalid" : "reservation-field"}>
                    <span>{t("Hitap *")}</span>
                    <select value={form.salutation} onChange={(event) => update("salutation", event.target.value)} aria-invalid={Boolean(errors.salutation)}>
                      <option value="">{t("Seçiniz")}</option><option value="herr">{t("Bay")}</option><option value="frau">{t("Bayan")}</option><option value="divers">{t("Çeşitli")}</option><option value="none">{t("Belirtmek istemiyorum")}</option>
                    </select>
                    <FieldError>{errors.salutation}</FieldError>
                  </label>
                  <label className={errors.firstName ? "reservation-field reservation-field--invalid" : "reservation-field"}>
                    <span>{t("Ad *")}</span><input autoComplete="given-name" value={form.firstName} onChange={(event) => update("firstName", event.target.value)} aria-invalid={Boolean(errors.firstName)} /><FieldError>{errors.firstName}</FieldError>
                  </label>
                  <label className={errors.lastName ? "reservation-field reservation-field--invalid" : "reservation-field"}>
                    <span>{t("Soyad *")}</span><input autoComplete="family-name" value={form.lastName} onChange={(event) => update("lastName", event.target.value)} aria-invalid={Boolean(errors.lastName)} /><FieldError>{errors.lastName}</FieldError>
                  </label>
                </div>
                <div className="reservation-grid reservation-grid--two">
                  <label className={errors.phone ? "reservation-field reservation-field--invalid" : "reservation-field"}>
                    <span>{t("Telefon *")}</span><input type="tel" autoComplete="tel" placeholder="+49 ..." value={form.phone} onChange={(event) => update("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} /><FieldError>{errors.phone}</FieldError>
                  </label>
                  <label className={errors.email ? "reservation-field reservation-field--invalid" : "reservation-field"}>
                    <span>{t("E-posta *")}</span><input type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} /><FieldError>{errors.email}</FieldError>
                  </label>
                </div>

              </div> : <div className="reservation-section__locked"><span aria-hidden="true">03</span><p>{t("Önce tarih ve saat bilgilerini tamamla.")}</p></div>}
            </section>

            <section className={`reservation-section reservation-section--tracked reservation-section--tracked-last ${verificationState === "verified" ? "is-complete" : contactDetailsComplete ? "is-active" : "is-locked"}`} aria-labelledby="kontrol-ve-gonderim" aria-disabled={!contactDetailsComplete}>
              <div className="reservation-section__heading">
                <span>04</span>
                <div><h2 id="kontrol-ve-gonderim">{t("Kontrol ve gönderim")}</h2><p>{t("Bilgilerini kontrol et ve rezervasyonunu tamamla.")}</p></div>
              </div>
              {contactDetailsComplete ? <div className="reservation-section__body reservation-section__body--final">
            <div className="reservation-final" aria-label={t("Rezervasyon özeti")}>
              <div className="reservation-final__summary">
                <div><span>{t("Kişi")}</span><strong>{partyLabel}</strong></div>
                <div><span>{t("Tarih")}</span><strong>{formattedDate(form.date, locale, language)}</strong></div>
                <div><span>{t("Saat")}</span><strong>{form.time || t("Seçilmedi")}</strong></div>
              </div>
              <div className="reservation-final__legal">
                <div><strong>{t("Rezervasyon verilerinin korunması")}</strong><p>{t("Bilgilerin yalnızca rezervasyonu veya grup talebini yürütmek için işlenir. Ayrıntıları")} <a href="/datenschutz#reservierung">{t("veri koruma bilgilendirmesinde")}</a> {t("inceleyebilirsin.")}</p></div>
                <p>{t("Masa, gecikme durumunda standart olarak 15 dakika korunur. Saatler Europe/Berlin zaman dilimindedir.")}</p>
              </div>
              {serviceMessage && <div className="reservation-service-message" role="status">{serviceMessage}</div>}
              {(verificationState === "sent" || verificationState === "checking") && (
                <div className="reservation-code" id="eposta-kodu">
                  <label className="reservation-field"><span>{t("E-postana gönderilen 6 haneli kod")}</span><input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otpCode} onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, ""))} /></label>
                  <button type="button" onClick={verifyCode} disabled={verificationState === "checking"}>{verificationState === "checking" ? t("Kontrol ediliyor...") : t("Kodu doğrula")}</button>
                </div>
              )}
              {verificationState === "verified" && <div className="reservation-verified reservation-verified--panel">{t("✓ E-posta adresin doğrulandı.")}</div>}
              <button className="reservation-submit" type="submit" disabled={submitting || verificationState === "sending"}>
                {submitting || verificationState === "sending" ? t("Hazırlanıyor...") : reservationKind === "group" ? t("Grup talebini gönder") : t("Rezervasyonu tamamla")}
              </button>
              <p className="reservation-submit-note">{t("Rezervasyonu tamamladığında e-posta adresine tek kullanımlık doğrulama kodu gönderilir.")}</p>
              <a className="reservation-map-link" href="https://maps.app.goo.gl/NZHsiEJmyTg9nVgRA" target="_blank" rel="noreferrer">{t("K1 1–4, 68159 Mannheim · Haritada aç ↗")}</a>
            </div>
              </div> : <div className="reservation-section__locked"><span aria-hidden="true">04</span><p>{t("Önce iletişim bilgilerini tamamla.")}</p></div>}
            </section>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
