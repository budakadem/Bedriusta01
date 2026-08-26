---
name: "Bedri Usta Mannheim"
description: "Ustalığı, sıcak Türk misafirliğini ve çağdaş Mannheim deneyimini birleştiren premium restoran tasarım sistemi."
colors:
  master-wine: "#160807"
  mannheim-burgundy: "#530e0f"
  signature-red: "#a7191e"
  hearth-cream: "#fff8ee"
  porcelain-ivory: "#fffdf8"
  dining-paper: "#f3ece4"
  charcoal-ink: "#351311"
  hospitality-sand: "#e7d1ad"
  heritage-gold: "#dfbf78"
  ember-copper: "#c46632"
typography:
  display:
    fontFamily: "Heebo, sans-serif"
    fontSize: "clamp(40px, 6vw, 70px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Heebo, sans-serif"
    fontSize: "clamp(28px, 4vw, 40px)"
    fontWeight: 800
    lineHeight: 1.1
  body:
    fontFamily: "Heebo, sans-serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.6
  label:
    fontFamily: "Karla, sans-serif"
    fontSize: "11px"
    fontWeight: 800
    lineHeight: 1.45
    letterSpacing: "0.18em"
rounded:
  field: "2px"
  action: "6px"
  surface: "8px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "18px"
  xl: "24px"
  section-edge: "56px"
components:
  button-primary:
    backgroundColor: "{colors.mannheim-burgundy}"
    textColor: "{colors.hearth-cream}"
    rounded: "{rounded.action}"
    padding: "14px 24px"
    height: "58px"
  button-secondary:
    backgroundColor: "{colors.dining-paper}"
    textColor: "{colors.mannheim-burgundy}"
    rounded: "{rounded.action}"
    padding: "10px 18px"
    height: "48px"
  field-default:
    backgroundColor: "{colors.porcelain-ivory}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.field}"
    padding: "12px 13px"
    height: "50px"
  mobile-nav-row:
    backgroundColor: "{colors.master-wine}"
    textColor: "{colors.hearth-cream}"
    padding: "0 6px"
    height: "48px"
---

# Design System: Bedri Usta Mannheim

## Overview

**Creative North Star: "Çağdaş Ocakbaşı Sofrası"**

Bedri Usta Mannheim dijital deneyimi, ateş başındaki ustalığı Mannheim’ın net ve çağdaş ritmiyle buluşturur. Sistem usta işi, sıcak ve kendinden emindir; premium görünür ama hiçbir zaman mesafeli değildir. Gerçek yemek ve mekân fotoğrafları, güçlü bordo yüzeyler, krem nefes alanları ve altın ayrıntılar bu duygusal bağı taşır.

Bilgi mimarisi önce gelir: rezervasyon, menü ve iletişim yolları hızlı; yasal ve ikincil içerik sessiz ama erişilebilirdir. Mobil deneyim 320px’den itibaren taşmadan çalışır, dokunma hedefleri en az 44px’dir ve hareket yalnızca anlamı destekler.

**Key Characteristics:**

- Usta işi, sıcak ve kendinden emin marka tavrı.
- Bordo, krem ve ölçülü altınla kurulan yüksek kontrast.
- Gerçek yemek ve mekân görsellerinin yön verdiği sinematik kompozisyon.
- Mobil öncelikli, erişilebilir ve yatay taşmasız düzen.
- Keskin hiyerarşi, az kart ve ölçülü hareket.

## Colors

Palet, közün koyu bordosunu sıcak sofra kremi ve yalnızca vurgu için kullanılan miras altınıyla dengeler.

### Primary

- **Mannheim Bordosu:** Ana navigasyon, sabit eylem alanları ve güçlü CTA yüzeylerinde kullanılır.
- **İmza Kırmızısı:** Seçim, aktif durum ve sınırlı marka vurgusudur.

### Secondary

- **Miras Altını:** Ayırıcılar, odak vurguları, yıldızlar ve premium detaylar içindir.
- **Köz Bakırı:** Yalnızca sıcak, yemek odaklı ikincil vurgu gerektiğinde kullanılır.

### Neutral

- **Usta Bordosu:** En koyu sayfa zemini ve dramatik bölüm geçişleridir.
- **Ocak Kremi:** Koyu yüzeylerde ana metin ve CTA yazısıdır.
- **Porselen Fildişi:** En açık yüzey ve form alanıdır.
- **Sofra Kâğıdı:** Açık bölüm ve kart yüzeyidir.
- **Kömür Mürekkebi:** Açık yüzeylerde ana metindir.
- **Misafirlik Kumu:** Koyu zemindeki ikincil metin ve nazik vurgudur.

**The Bordo Omurga Rule.** Marka ağırlığını Mannheim Bordosu taşır; yeni rastgele vurgu renkleri eklemek yasaktır.

**The Rare Gold Rule.** Miras Altını dekoratif dolgu değildir; ayırıcı, odak ve önemli premium işaretlerde ölçülü kullanılır.

## Typography

**Display Font:** Heebo (sans-serif fallback)
**Body Font:** Heebo (sans-serif fallback)
**Label Font:** Karla (sans-serif fallback)

**Character:** Heebo’nun güçlü ve açık gövdeleri restoranın güvenini taşır; Karla’nın sıkı etiket ritmi yön bulmayı hızlandırır. Büyük başlıklar güçlü, gövde metni sıcak ve rahat okunur kalır.

### Hierarchy

- **Display:** Ağır, akışkan ölçekli ve sıkı harf aralıklı; yalnız ana başlıklar ve güçlü bölüm açılışları içindir.
- **Headline:** Bölüm ve sonuç başlıklarında kullanılır; bir ekranda birincil hiyerarşiyi bölmez.
- **Body:** Açıklamalar ve yardımcı metinlerde kullanılır; okunabilir satır uzunluğu yaklaşık 65–75 karakterle sınırlanır.
- **Label:** Kısa navigasyon, kicker ve durum metinlerinde kullanılır; uzun cümlelerde büyük harf ve geniş tracking kullanılmaz.

**The One Strong Voice Rule.** Başlık ağırlığı Heebo ile, yönlendirme ritmi Karla ile kurulur; üçüncü bir yazı ailesi eklemek yasaktır.

## Elevation

Sistem tonal katmanlama ile ambient gölgeleri birlikte kullanır. Bordo-krem yüzey geçişleri temel derinliği verir; gölge yalnızca sabit navigasyon, yükselen CTA, önemli kart ve modal benzeri yüzeylerde görünür. Küçük, sert ve kirli gölgeler kullanılmaz.

### Shadow Vocabulary

- **Sabit Navigasyon:** `0 18px 50px rgba(0,0,0,0.30)` — üst barı içerikten ayırır.
- **Yükselen Eylem:** `0 18px 34px rgba(83,14,15,0.22)` — hover veya aktif CTA tepkisidir.
- **Premium Panel:** `0 22px 52px rgba(0,0,0,0.36)` — mobil menü ve güçlü yüzen yüzey içindir.
- **Açık Kart:** `0 12px 34px rgba(57,30,23,0.045)` — açık zeminde neredeyse hissedilmeyen yapısal ayrımdır.

**The Flat-at-Rest Rule.** Sıradan içerik yüzeyleri düz kalır; görünür gölge yalnız hiyerarşi veya etkileşim gerekçesi olduğunda eklenir.

## Components

### Buttons

- **Shape:** Hafif köşeli ve kendinden emin (6px); aşırı yuvarlak değildir.
- **Primary:** Mannheim Bordosu üzerinde Ocak Kremi, en az 58px yükseklik ve 14px × 24px iç boşluk.
- **Hover / Focus:** 2–4px dikey hareket, koyulaşan bordo ve görünür klavye odağı; yalnız opacity/transform/renk animasyonu.
- **Secondary:** Açık sofra yüzeyi, ince sıcak sınır ve bordo yazı; ana CTA ile yarışmaz.

### Chips

- **Style:** Kısa filtre ve durum etiketleri 44px dokunma hedefini korur; seçili durumda bordo dolgu, seçilmemiş durumda ince sıcak sınır kullanır.
- **State:** Kullanılamayan seçenek aktifmiş gibi görünmez; metin ve kontrastla açıkça ayrılır.

### Cards / Containers

- **Corner Style:** Kontrollü, 8px köşe.
- **Background:** İçeriğe göre Mannheim Bordosu, Sofra Kâğıdı veya Porselen Fildişi.
- **Shadow Strategy:** Varsayılan düz; yalnız yükselmiş veya etkileşimli durumda Elevation sözlüğü.
- **Border:** 1px sıcak nötr veya ölçülü altın; kart içinde kart yığılmaz.
- **Internal Padding:** Mobilde 18px’den, geniş ekranda 24px’den başlar.

### Inputs / Fields

- **Style:** Beyaz/fildişi yüzey, 1px sıcak gri çizgi, 2px köşe ve en az 50px yükseklik.
- **Focus:** Bordo sınır ve net odak halkası; layout shift oluşturmaz.
- **Error / Disabled:** Hata metinle birlikte gösterilir; disabled durum yalnız opacity’ye bırakılmaz.

### Navigation

- **Desktop:** Bordo üst ray, ortalanmış değişmez marka logosu ve dengeli sol/sağ bağlantılar.
- **Mobile:** Hamburger düğmesinin altında sol üstte başlayan, en fazla 380px genişliğinde panel; düz 48px satırlar, her satır arasında 1px çizgi ve ana/yasal gruplar arasında 3px altın ayırıcı.
- **Dock:** Menü, rezervasyon ve yön gibi yüksek frekanslı eylemler safe-area korumalı sabit alt barda kalır.
- **Motion:** 180–220ms etkileşim tepkisi ve içerik için 560ms ölçülü reveal; `prefers-reduced-motion` daima desteklenir.

## Do's and Don'ts

### Do:

- **Do** gerçek yemek, usta ve mekân görsellerini tasarımın ana taşıyıcısı yap.
- **Do** mobilde en az 44px dokunma alanı, eşit sağ-sol boşluk ve kesintisiz safe-area koruması kullan.
- **Do** Mannheim Bordosu, Ocak Kremi ve ölçülü Miras Altını ile tutarlı kontrast kur.
- **Do** aktif, kullanılamayan ve seçili durumları hem renk hem metin veya biçimle ayır.
- **Do** hareketi opacity ve transform ile, hızlı ve anlamlı tut; reduced-motion tercihini koru.

### Don't:

- **Don't** generic restaurant templates kullan.
- **Don't** childish/excessively rounded UI üret.
- **Don't** random colors ekle veya weak contrast kullan.
- **Don't** card piles oluştur; içerik hiyerarşisini iç içe kutularla boğma.
- **Don't** attention-seeking motion kullan veya etkileşimleri gereksiz animasyonla yavaşlatma.
- **Don't** fake food visuals kullan; gerçek varlıkların yerine yapay placeholder yerleştirme.
- **Don't** unavailable links’i active-looking biçimde sun veya yanıltıcı tıklanabilirlik yarat.
- **Don't** 100vw, kırılgan sabit genişlik veya yatay taşma oluşturan düzen kullan.
