export type ReservationPolicy = {
  timeZone: string;
  firstSlot: string;
  lastSlot: string;
  slotIntervalMinutes: number;
  normalBookingWindowMonths: number;
  groupBookingWindowYears: number;
  groupThreshold: number;
  capacityWindowMinutes: number;
  capacityWindowGuestLimit: number;
};

// Dashboard hazır olduğunda bu varsayılanlar sunucudaki şube ayarlarından gelecek.
// Kapasite sınırı istemcide değil, rezervasyon kaydıyla aynı transaction içinde
// backend tarafından yeniden kontrol edilmelidir.
export const reservationDefaults: Readonly<ReservationPolicy> = Object.freeze({
  timeZone: "Europe/Berlin",
  firstSlot: "08:00",
  lastSlot: "23:00",
  slotIntervalMinutes: 30,
  normalBookingWindowMonths: 2,
  groupBookingWindowYears: 1,
  groupThreshold: 20,
  capacityWindowMinutes: 120,
  capacityWindowGuestLimit: 180
});

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function createReservationTimeOptions(policy: ReservationPolicy) {
  const first = timeToMinutes(policy.firstSlot);
  const last = timeToMinutes(policy.lastSlot);
  const options: string[] = [];

  for (let minutes = first; minutes <= last; minutes += policy.slotIntervalMinutes) {
    const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
    const remainder = (minutes % 60).toString().padStart(2, "0");
    options.push(`${hours}:${remainder}`);
  }

  return options;
}
