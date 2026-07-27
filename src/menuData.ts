export type MenuDiet = "vegan" | "vegetarian";

export type RestaurantMenuItem = {
  name: string;
  price: string;
  allergens: string[];
  additives: string[];
  diet?: MenuDiet;
  requiresCheck: boolean;
};

export type RestaurantMenuSection = {
  id: string;
  title: string;
  note: string;
  items: RestaurantMenuItem[];
};

const menuItem = (
  name: string,
  price: string,
  allergens = "",
  diet?: MenuDiet,
  requiresCheck = false,
  additives = ""
): RestaurantMenuItem => ({
  name,
  price,
  allergens: allergens ? allergens.split(",") : [],
  additives: additives ? additives.split(",") : [],
  diet,
  requiresCheck
});

export const restaurantMenuSections: RestaurantMenuSection[] = [
  {
    id: "mezeler",
    title: "Başlangıç ve Mezeler",
    note: "Sofraya yayılan, paylaşmayı ve sohbeti uzatan sıcak-soğuk başlangıçlar.",
    items: [
      menuItem("Acılı Ezme", "6,90 €", "H", "vegan"),
      menuItem("Ada Aşığı", "6,90 €", "A,G", "vegetarian"),
      menuItem("Al Biber", "6,90 €", "", "vegan"),
      menuItem("Atom", "8,90 €", "G,H", "vegetarian"),
      menuItem("Badem Ezmesi", "8,90 €", "G,H", "vegetarian"),
      menuItem("Barbunya Pilaki", "7,90 €", "A,F,I"),
      menuItem("Bedri Usta Özel Meze", "9,90 €", "C,G,J,K"),
      menuItem("Beyaz Peynir (Dilim)", "5,90 €", "G", "vegetarian"),
      menuItem("Çerkez Tavuğu", "8,90 €", "A,G,H"),
      menuItem("Çiğ Köfte", "10,90 €"),
      menuItem("Çıtır Kabak", "7,90 €"),
      menuItem("Çubuk Turşu", "5,90 €"),
      menuItem("Deniz Börülcesi", "7,90 €", "", "vegan"),
      menuItem("Ege Karması", "9,90 €", "H", "vegan"),
      menuItem("Enginar Çanak", "8,90 €", "A", "vegan"),
      menuItem("Enginar Kalbi (Adet)", "4,90 €", "", "vegan"),
      menuItem("Enginarlı Fava", "7,90 €", "", "vegan"),
      menuItem("Fava", "7,90 €", "", "vegan"),
      menuItem("Girit Ezmesi", "8,90 €", "G,H", "vegetarian"),
      menuItem("Zeytin Salatası (Kuru Domatesli)", "8,90 €", "", undefined, true),
      menuItem("Havuç Tarator", "7,90 €", "G,H", "vegetarian"),
      menuItem("Haydari", "7,90 €", "G", "vegetarian"),
      menuItem("Humus (Soğuk)", "7,90 €", "G,K", "vegetarian"),
      menuItem("İşkembe (Tereyağlı)", "8,90 €", "G,I"),
      menuItem("Kabakis", "6,90 €", "G,H", "vegetarian"),
      menuItem("Kalamata Zeytin", "7,90 €", "H", "vegan"),
      menuItem("Karışık Turşu", "5,90 €"),
      menuItem("Kaya Koruğu", "7,90 €", "", "vegan"),
      menuItem("Kinoa Tabule", "8,90 €", "", "vegan"),
      menuItem("Kırmızı Pancar", "6,90 €"),
      menuItem("Kopoğlu", "7,90 €", "G", "vegetarian"),
      menuItem("Kuru Cacık", "7,90 €", "G", "vegetarian"),
      menuItem("Kuru Domates Salatası", "9,90 €", "H", "vegan"),
      menuItem("Lübnan Mantısı", "8,90 €", "A,G,H", "vegetarian"),
      menuItem("Manca", "7,90 €", "G,H", "vegetarian"),
      menuItem("Mantar Borani", "7,90 €", "G,H", "vegetarian"),
      menuItem("Muhammara", "8,90 €", "A,H,K"),
      menuItem("Patlıcan Salatası", "7,90 €", "C", "vegetarian"),
      menuItem("Mütebbel", "8,50 €"),
      menuItem("Pembe Sultan", "7,90 €", "G,H", "vegetarian"),
      menuItem("Patates Çökertme", "8,90 €"),
      menuItem("Şakşuka", "7,50 €", "", "vegan"),
      menuItem("Semizotu", "7,90 €", "G", "vegetarian"),
      menuItem("Sicilyano", "9,90 €", "C,H", "vegetarian"),
      menuItem("Süzme Yoğurt", "6,90 €", "G", "vegetarian"),
      menuItem("Tahinli Salata", "7,90 €", "G,K", "vegetarian"),
      menuItem("Tulum Peyniri", "8,90 €", "G", "vegetarian"),
      menuItem("Vişneli Yaprak Sarma", "8,50 €")
    ]
  },
  {
    id: "ara-sicaklar",
    title: "Ara Sıcaklar",
    note: "Taş fırından, tavadan ve közden sofraya gelen sıcak başlangıçlar.",
    items: [
      menuItem("Ege Otları Cibes (Sıcak)", "6,90 €", "G", "vegetarian"),
      menuItem("Fındık Lahmacun (Adet)", "3,90 €", "A"),
      menuItem("Hellim Izgara", "8,90 €", "G", "vegetarian"),
      menuItem("Humus (Sıcak)", "8,90 €", "G,K", "vegetarian"),
      menuItem("Humus Pastırmalı", "10,90 €", "G,K"),
      menuItem("İçli Köfte (Haşlama)", "9,90 €", "A,C,H"),
      menuItem("İçli Köfte (Kızartma)", "9,90 €", "A,C,H"),
      menuItem("Kaşarlı Mantar (Adet)", "8,50 €", "G", "vegetarian"),
      menuItem("Közde Soğan Sarımsak", "7,90 €", "", "vegan"),
      menuItem("Kuru Patlıcan Dolması (Adet)", "3,90 €", "H"),
      menuItem("Mercimek Çorbası", "7,90 €", "A,G", "vegetarian"),
      menuItem("Patates Kızartması", "4,90 €", "C"),
      menuItem("Patlıcan Söğürme", "8,90 €", "C", "vegetarian"),
      menuItem("Peynir Saganaki", "13,90 €", "G,K", "vegetarian")
    ]
  },
  {
    id: "kebaplar",
    title: "Kebaplar",
    note: "Zırh kıyma, seçkin baharatlar ve Bedri Usta’nın yarım asrı aşan ocakbaşı tecrübesi.",
    items: [
      menuItem("Adana (Acılı)", "21,90 €", "A"),
      menuItem("Adana (Acısız)", "21,90 €", "A"),
      menuItem("Altı Ezmeli Kebap", "23,90 €", "A"),
      menuItem("Beyti", "22,90 €", "A,G"),
      menuItem("Beyti Sarma", "23,90 €", "A,G"),
      menuItem("Elinazik (Etten)", "26,90 €", "A,C,G"),
      menuItem("Elinazik (Kıymadan)", "24,90 €", "A,C,G"),
      menuItem("Karışık Kebap", "38,90 €", "A"),
      menuItem("Patlıcan Kebap", "21,90 €", "A"),
      menuItem("Tablacı Kebap", "20,90 €", "A"),
      menuItem("Yağlı Karalı", "23,90 €", "A"),
      menuItem("Yoğurtlu Kebap", "23,90 €", "A,G")
    ]
  },
  {
    id: "etler",
    title: "Etler",
    note: "Seçkin etler, ustalıkla hazırlanan şişler ve kararında dinlendirilmiş lezzetler.",
    items: [
      menuItem("Bedri Usta Şiş", "41,90 €", "A"),
      menuItem("Ciğer Şiş", "21,90 €", "A"),
      menuItem("Çöp Şiş", "23,90 €", "A"),
      menuItem("Kaburga", "27,90 €", "A"),
      menuItem("Karışık Et Tabağı", "46,90 €", "A"),
      menuItem("Kuzu Külbastı", "26,90 €", "A"),
      menuItem("Kuzu Kuşleme", "30,90 €", "A"),
      menuItem("Kuzu Pirzola", "32,90 €", "A"),
      menuItem("Kuzu Şiş", "28,90 €", "A"),
      menuItem("Lokum", "45,90 €", "A,G"),
      menuItem("Tavuk Kanat", "20,90 €", "A"),
      menuItem("Tavuk Şiş", "20,90 €", "A")
    ]
  },
  {
    id: "firin-tavalar",
    title: "Fırın Tavalar",
    note: "Döküm tavada ve fırında hazırlanan paylaşmalık ana yemekler.",
    items: [
      menuItem("Arap Tava", "23,90 €", "A,G"),
      menuItem("Canım Ciğerim", "22,90 €", "A"),
      menuItem("Et Tava", "29,90 €", "A,G"),
      menuItem("Kanat Tava", "21,90 €", "A,G"),
      menuItem("Kuzu Pirzola Tava", "34,90 €", "A,G"),
      menuItem("Piliç Tava", "21,90 €", "A,G")
    ]
  },
  {
    id: "tas-firinlar",
    title: "Taş Fırınlar",
    note: "İnce hamur, güçlü harç ve taş fırının çıtır dokusu.",
    items: [
      menuItem("Adana Usulü Lahmacun (5 Adet)", "14,90 €", "A"),
      menuItem("Adana Usulü Pide (5 Adet)", "14,90 €", "A,C,G", "vegetarian"),
      menuItem("Antep Lahmacun (Acılı)", "10,90 €", "A"),
      menuItem("Antep Lahmacun (Acısız)", "10,90 €", "A"),
      menuItem("Karışık Pide", "16,90 €", "A,C,G"),
      menuItem("Kaşarlı Pide", "12,90 €", "A,C,G", "vegetarian"),
      menuItem("Kıymalı Kaşarlı Pide", "14,90 €", "A,C,G"),
      menuItem("Kıymalı Pide", "14,90 €", "A,C"),
      menuItem("Kuşbaşı Kaşarlı Pide", "16,90 €", "A,C,G"),
      menuItem("Kuşbaşı Pide", "15,90 €", "A,C"),
      menuItem("Sembusek", "12,90 €", "A")
    ]
  },
  {
    id: "salatalar",
    title: "Salatalar",
    note: "Taze yeşillikler, nar ekşisi ve sofrayı dengeleyen ferah tabaklar.",
    items: [
      menuItem("Bedri Usta Salata", "13,90 €", "", "vegan"),
      menuItem("Çoban Salata", "8,90 €", "", "vegan"),
      menuItem("Ezme Salata", "7,90 €", "", "vegan"),
      menuItem("Gavurdağı Salata", "11,90 €", "H", "vegan"),
      menuItem("Harman Salata", "9,90 €", "", "vegan"),
      menuItem("Kaşık Salata", "10,90 €", "", "vegan"),
      menuItem("Mevsim Salata", "9,90 €", "G", "vegetarian"),
      menuItem("Tablacı Salata", "8,90 €", "", "vegan"),
      menuItem("Tulum Peynirli Cevizli Roka Salata", "14,90 €", "G,H", "vegetarian")
    ]
  },
  {
    id: "cocuk-menusu",
    title: "Çocuk Menüsü",
    note: "Küçük misafirlerimiz için sevilen lezzetlerin dengeli porsiyonları.",
    items: [
      menuItem("Adana Burger", "17,90 €", "A,C"),
      menuItem("Çıtır Tavuk", "11,90 €", "A,C,H,J"),
      menuItem("Çocuk Köftesi", "14,90 €", "C"),
      menuItem("Domates Soslu Makarna", "9,90 €", "A")
    ]
  },
  {
    id: "tatlilar",
    title: "Tatlılar",
    note: "Sıcak, şerbetli ve dondurmalı klasiklerle zarif bir kapanış.",
    items: [
      menuItem("Dondurma", "5,90 €", "G"),
      menuItem("Fıstıklı İrmik Helvası", "7,90 €", "A,G", "vegetarian"),
      menuItem("Havuç Dilimi (1 Dilim)", "8,90 €", "A,G,H"),
      menuItem("Kadayıf", "7,90 €", "A,G,H"),
      menuItem("Katmer (2 Kişilik)", "13,90 €"),
      menuItem("Künefe", "9,90 €", "A,G")
    ]
  },
  {
    id: "meyveler",
    title: "Meyveler",
    note: "Mevsime göre hazırlanan sade ve ferah meyve tabakları.",
    items: [
      menuItem("Meyve Tabağı (Duble)", "13,90 €", "", "vegan"),
      menuItem("Meyve Tabağı (Tek)", "8,90 €", "", "vegan")
    ]
  },
  {
    id: "soguk-icecekler",
    title: "Soğuk İçecekler",
    note: "Sofraya eşlik eden klasik soğuk içecekler, ayran ve şalgam.",
    items: [
      menuItem("Ayran 1 L", "9,90 €"),
      menuItem("Ayran Bardak 33 cl", "3,60 €"),
      menuItem("Cappy Meyve Suyu 33 cl", "3,90 €"),
      menuItem("Cola 33 cl", "3,90 €", "", undefined, false, "Z1,Z13"),
      menuItem("Fanta 33 cl", "3,90 €"),
      menuItem("Ice Tea Limon 33 cl", "4,20 €"),
      menuItem("Ice Tea Şeftali 33 cl", "4,20 €"),
      menuItem("Portakal Suyu (Taze) 33 cl", "6,90 €"),
      menuItem("Red Bull 25 cl", "5,00 €"),
      menuItem("Şalgam 1 L", "11,90 €"),
      menuItem("Şalgam Bardak 33 cl", "3,50 €"),
      menuItem("Soda 20 cl", "3,00 €"),
      menuItem("Sprite 33 cl", "3,90 €"),
      menuItem("Su 1 L", "7,50 €")
    ]
  }
];

export const allergenLegend = [
  ["A", "Gluten içeren tahıllar"],
  ["B", "Kabuklular"],
  ["C", "Yumurta"],
  ["D", "Balık"],
  ["E", "Yer fıstığı"],
  ["F", "Soya"],
  ["G", "Süt / Laktoz"],
  ["H", "Sert kabuklu yemişler"],
  ["I", "Kereviz"],
  ["J", "Hardal"],
  ["K", "Susam"],
  ["L", "Kükürtdioksit / Sülfit"],
  ["M", "Acı bakla"],
  ["N", "Yumuşakçalar"]
] as const;

export const additiveLegend = [
  ["Z1", "Renklendirici"],
  ["Z2", "Koruyucu"],
  ["Z3", "Antioksidan"],
  ["Z4", "Nitrit / Nitrat"],
  ["Z5", "Lezzet artırıcı"],
  ["Z6", "Karartılmış"],
  ["Z7", "Mumlanmış"],
  ["Z8", "Fosfat"],
  ["Z9", "Tatlandırıcı"],
  ["Z10", "Tatlandırıcı bazlı"],
  ["Z11", "Fenilalanin kaynağı"],
  ["Z12", "Poliol > %10"],
  ["Z13", "Kafein / Kinin"]
] as const;
