export const contactLinks = {
  email: "mailto:info@bedriusta.de",
  instagram: "https://www.instagram.com/mannheim_bedriusta",
  tiktok: "https://www.tiktok.com/@mannheim_bedriusta",
  youtube: "https://www.youtube.com/@bedriustamannheim",
  facebook: "https://www.facebook.com/p/Bedri-Usta-Mannheim-61595028296770/",
  restaurantPhone: "tel:+4962140547045",
  cafePhone: "tel:+4962140547046"
} as const;

export const contactPhoneLabels = {
  restaurant: "+49 621 40547045",
  cafe: "+49 621 40547046"
} as const;

export const openingHoursByVenue = [
  {
    venue: "Restaurant",
    hours: [
      { days: "Pazar — Cuma", time: "08:00 — 23:00" },
      { days: "Cumartesi", time: "08:00 — 01:00" }
    ]
  },
  {
    venue: "Café",
    hours: [
      { days: "Pazar — Cuma", time: "12:00 — 01:00" },
      { days: "Cumartesi", time: "12:00 — 02:00" }
    ]
  }
] as const;
