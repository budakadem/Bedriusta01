import { useEffect, useRef, useState } from "react";

type ReservationDatePickerProps = {
  value: string;
  min: string;
  max: string;
  onChange: (value: string) => void;
  invalid?: boolean;
};

const weekdays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function dateKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function monthKey(date: Date) {
  return date.getUTCFullYear() * 12 + date.getUTCMonth();
}

function monthStart(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function moveMonth(date: Date, offset: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1));
}

function readableDate(value: string) {
  if (!value) return "Tarih seçiniz";
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(parseDate(value));
}

export function ReservationDatePicker({ value, min, max, onChange, invalid }: ReservationDatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(parseDate(value || min)));
  const minDate = parseDate(min);
  const maxDate = parseDate(max);
  const minTime = minDate.getTime();
  const maxTime = maxDate.getTime();
  const previousDisabled = monthKey(moveMonth(visibleMonth, -1)) < monthKey(minDate);
  const nextDisabled = monthKey(moveMonth(visibleMonth, 1)) > monthKey(maxDate);

  useEffect(() => {
    setVisibleMonth(monthStart(parseDate(value || min)));
  }, [min, value]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const firstWeekday = (visibleMonth.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(visibleMonth.getUTCFullYear(), visibleMonth.getUTCMonth() + 1, 0)).getUTCDate();
  const calendarCells = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });
  const monthTitle = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric", timeZone: "UTC" }).format(visibleMonth);

  return (
    <div className="reservation-date-picker" ref={containerRef}>
      <button className="reservation-date-trigger" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-haspopup="dialog" aria-invalid={invalid}>
        <span className={value ? "" : "is-placeholder"}>{readableDate(value)}</span>
        <span className="reservation-date-trigger__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3.5" y="5" width="17" height="15" rx="2" />
            <path d="M7 3v4M17 3v4M3.5 9.5h17M7.5 13h2M12 13h2M16.5 13h.1M7.5 16.5h2M12 16.5h2" />
          </svg>
        </span>
      </button>

      {open && (
        <>
          <button className="reservation-calendar-backdrop" type="button" onClick={() => setOpen(false)} aria-label="Takvimi kapat" />
          <div className="reservation-calendar" role="dialog" aria-label="Rezervasyon tarihi seç">
            <div className="reservation-calendar__header">
              <button type="button" onClick={() => setVisibleMonth((current) => moveMonth(current, -1))} disabled={previousDisabled} aria-label="Önceki ay">←</button>
              <strong>{monthTitle}</strong>
              <button type="button" onClick={() => setVisibleMonth((current) => moveMonth(current, 1))} disabled={nextDisabled} aria-label="Sonraki ay">→</button>
            </div>
            <div className="reservation-calendar__weekdays" aria-hidden="true">
              {weekdays.map((weekday) => <span key={weekday}>{weekday}</span>)}
            </div>
            <div className="reservation-calendar__days">
              {calendarCells.map((day, index) => {
                if (!day) return <span className="is-empty" key={`empty-${index}`} />;
                const date = new Date(Date.UTC(visibleMonth.getUTCFullYear(), visibleMonth.getUTCMonth(), day));
                const key = dateKey(date);
                const disabled = date.getTime() < minTime || date.getTime() > maxTime;
                return (
                  <button key={key} type="button" className={key === value ? "is-selected" : ""} disabled={disabled} onClick={() => { onChange(key); setOpen(false); }} aria-label={readableDate(key)} aria-pressed={key === value}>
                    {day}
                  </button>
                );
              })}
            </div>
            <div className="reservation-calendar__legend"><span><i className="is-available" /> Seçilebilir</span><span><i /> Seçilemez</span></div>
          </div>
        </>
      )}
    </div>
  );
}
