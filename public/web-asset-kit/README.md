# Bedri Usta Web Asset Kit

Bu klasör, Bedri Usta Mannheim web sitesinde kullanılan marka dosyalarının başka bir web projesine kopyalanabilir, bağımsız paketidir. Mevcut web sayfasına bağlanmamıştır ve sayfanın görünümünü değiştirmez.

## Site teslim ve yeniden kurulum rehberi

Bu bölüm, mevcut Bedri Usta Mannheim ana sayfasını başka bir projede yeniden kuracak geliştirici için hazırlanmıştır. Yalnız görsel dosyaları değil, yapılan değişiklikleri, etkileşimleri ve bağlantı hedeflerini de açıklar.

### 1. Hamburger menü ve mobil navigasyon

- Mobil ve tablet görünümünde üst sol tarafta hamburger menü kullanılır.
- Menü açıldığında sol üstte, üst navigasyona yakın konumlanan bir panel görünür.
- Ana menü sadeleştirilerek `Anasayfa`, `Hakkımızda`, `Jobs`, `Politikalarımız`, `İletişim` ve `FAQ` satırlarından oluşturuldu.
- Ana bağlantılar ile yasal bağlantılar arasında diğer çizgilerden daha kalın altın renkli bir ayırıcı bulunur.
- Yasal bölümde `Impressum`, `Datenschutz`, `Cookie-Einstellungen` ve `AGB` yer alır.
- Her satırın arasında ince yatay çizgi vardır.
- Menü panelinin dışındaki karartılmış alana tıklanınca menü kapanır.
- Sayfa kaydırılınca veya bir menü satırı seçilince menü otomatik kapanır.
- `AGB` henüz gerçek bir sayfaya bağlı değildir. Yanıltıcı aktif bağlantı oluşturmamak için pasif tutulur ve mobil menüde `HAZIRLANIYOR`, footer’da `YAKINDA` olarak gösterilir.

### 2. Üst orta logo

- Üst navigasyonun tam ortasında Bedri Usta’nın dikdörtgen marka logosu bulunur.
- Logo masaüstü, tablet ve telefonda merkezde kalır; hamburger ve sağ taraftaki yardımcı ikonlar logonun konumunu değiştirmez.
- Logoya basıldığında ana sayfa açılır.
- Kullanılan dosya: `brand/bedri-usta-logo-header.png`.
- Logonun krem üst alanı, Bedri Usta portresi ve kırmızı alt alanı tek marka kompozisyonudur. Arka planı silinmemeli, yeniden renklendirilmemeli veya yalnız imza kalacak biçimde kırpılmamalıdır.

### 3. Tarayıcı, telefon ve PWA ikonları

- Tarayıcı faviconu için `app-icons/favicon-32.png` kullanılır.
- iPhone/iPad ana ekranı için `app-icons/apple-touch-icon-180.png` kullanılır.
- PWA için `app-icons/pwa-192.png`, `app-icons/pwa-512.png` ve güvenli kırpma payına sahip `app-icons/pwa-maskable-512.png` kullanılır.
- İkonlarda dikdörtgen logo değiştirilmemiştir. Kare veya yuvarlak ikon alanında logonun dışında kalan boşluklar Mannheim bordosu ile doldurulmuştur.
- Böylece Chrome, Safari, Android ana ekranı ve PWA görünümünde beyaz/şeffaf boşluk yerine tutarlı bordo marka zemini görünür.

### 4. Ana marka tanımı

- Ana girişteki kategori metni `ADANA Ocakbaşı` olarak korunur.
- Ana başlığın altında `KEBAP & GRILL RESTAURANT & CAFE` ifadesi kullanılır; `CAFE` sonradan eklenen güncel tanımdır.
- Bu metin değiştirilirken satır taşması oluşturulmamalı ve mobilde merkez hizası korunmalıdır.

### 5. Bedri Usta hikâyesi ve kilometre taşları

Hakkımızda anlatımının altında dört bilgi kartı bulunur:

1. `1970` — `Mardin · Altıyol`: Bedri Usta’nın doğum yılı ve doğduğu yer.
2. `7 yaşında` — `Adana’da mesleğe başlangıç`: Ustalık yolculuğunun başladığı dönem.
3. `50+ yıl` — `Ocakbaşı tecrübesi`: Birikmiş mesleki deneyim.
4. `2026` — `Mannheim`: Ustalık hikâyesinin Mannheim’daki yeni dönemini gösteren sonradan eklenmiş kilometre taşı.

Kartlar mobilde iki sütun, uygun genişlikte esnek satırlar halinde çalışır. Sabit genişlik kullanılmadığı için küçük ekranlarda yatay taşma oluşturmaz.

### 6. Menümüzdeki sekiz kayan görsel

Kullanılan gerçek kartlar ve ZIP içindeki dosyaları:

1. Adana — `images/menu/menu-adana-portrait.webp`
2. Meze — `images/menu/menu-meze-portrait.webp`
3. Döner — `images/menu/menu-doner-portrait.webp`
4. Lahmacun — `images/menu/menu-lahmacun-portrait.webp`
5. Tava — `images/menu/menu-tava-portrait.webp`
6. Kahvaltı — `images/menu/menu-kahvalti-portrait.webp`
7. Tatlı — `images/menu/menu-dessert-portrait.webp`
8. Café — `images/menu/menu-cafe-portrait.webp`

Teknik çalışma mantığı:

- Kartlar dikey `4:5` görsel oranını korur ve fotoğraflar WebP biçimindedir.
- Ekrana sığmayan kartlar yatay bir ray içinde gösterilir; sağ ve sol oklar yalnız taşma varsa görünür.
- Sekiz gerçek kart kesintisiz döngü oluşturmak için DOM içinde üç kez sıralanır. Böylece rayda toplam 24 fiziksel öğe bulunur.
- İkinci ve üçüncü sekiz kart yalnız döngü kopyasıdır; ekran okuyucularına gerçek içerikmiş gibi tekrar okunmaması için erişilebilirlik ağacından gizlenir.
- Sayfa açıldığında kaydırma konumu orta kopya grubuna yerleştirilir.
- Otomatik hareket belirli saniyelerde sıçrayarak değil, `requestAnimationFrame` ile kesintisiz çalışır.
- Sürekli hız saniyede yaklaşık `42px` değerindedir. Önceki `28px/sn` hızı bazı ekranlarda hareketsiz algılandığı için daha görünür hale getirildi.
- Ray ikinci kopya grubunun sınırına ulaşınca aynı görsel konuma animasyonsuz taşınır. Kullanıcı bu konum düzeltmesini görmez; son karttan ilk karta geri sıçrama hissi oluşmaz.
- Sağ veya sol oka basıldığında tam bir kart genişliği ilerlenir.
- Manuel ok animasyonu `360ms` sürer ve yumuşak ease-out hareketi kullanır.
- Kullanıcı dokunduğunda, fareyle bastığında veya sürüklediğinde otomatik hareket geçici olarak durur; etkileşim bittiğinde devam eder.
- `prefers-reduced-motion: reduce` etkinse otomatik hareket çalışmaz.
- Kart rayı genişlik değişimlerini `ResizeObserver` ile izler; tablet, telefon ve masaüstünde okların gerekip gerekmediğini yeniden hesaplar.
- Düzen `100vw` veya kırılgan sabit genişlik kullanmadığı için yatay sayfa taşması oluşturmaz.

### 7. Rezervasyon ve Events bölümü

- Güncel bölüm etiketi `REZERVASYON · EVENTS · MANNHEIM` şeklindedir. Eski tekil `EVENT` ifadesi `EVENTS` olarak güncellendi.
- Bölümde rezervasyon ve menü sayfası için iki belirgin eylem bulunur.
- Ziyaret saatleri güncellendi:
  - `PAZAR — PERŞEMBE` — `08:00 — 24:00`
  - `CUMA — CUMARTESİ` — `08:00 — 01:00`
- Mannheim adresi `K1 1-4 · 68159` olarak gösterilir.
- `Adresi kopyala` seçeneği `K1 1-4, 68159 Mannheim, Almanya` metnini panoya yazar ve yaklaşık 2,6 saniye `Adres kopyalandı.` bildirimi gösterir.
- `Haritada aç ↗` bağlantısı `https://maps.app.goo.gl/NZHsiEJmyTg9nVgRA` adresini açar.
- Bu iki bağlantı sonradan doğrudan rezervasyon/Events paneline de eklendi; yalnız footer’da bırakılmadı.

### 8. Deneyiminiz ve değerlendirme bölümü

Güncel Türkçe içerik:

- `DENEYİMİNİZ`
- `5 Yıldız İçin Çalışıyoruz`
- `Lezzetimizi ve deneyiminizi nasıl buldunuz?`
- `Her tabakta Bedri Usta’nın 50 yılı aşan değerlerine sahip çıkıyoruz: dürüst ustalık, gerçek misafirperverlik ve insanları aynı sofrada buluşturan lezzet.`
- Beş dolu yıldız sabit olarak görünür; kullanıcıdan tekrar yıldız seçmesi istenmez.
- `Teşekkür ederiz! ❤️`
- `Deneyiminizi başkalarıyla da paylaşmanız bizi çok mutlu eder.`

Bağlantılar:

- `Google'da değerlendir ★★★★★` butonu gerçek Google değerlendirme bağlantısını yeni sekmede açar: `https://g.page/r/CduOWlmMjBxOEBM/review`.
- `Tripadvisor'da değerlendir ★★★★★` butonu görünür kalır ancak Tripadvisor profili henüz hazır olmadığı için dış bağlantı açmaz; profil hazır olduğunda bağlantının etkinleşeceğini açıklayan durum metni gösterir.
- `Bir tavsiyeniz veya isteğiniz mi var? Bize doğrudan yazın.` bağlantısı cihazın e-posta uygulamasını `info@bedriusta.de` adresiyle açar.
- Türkçe e-posta konusu `Bedri Usta Mannheim'a mesaj`, başlangıç metni `Tavsiyem / isteğim:` şeklindedir.
- Almanca e-posta konusu `Nachricht an Bedri Usta Mannheim`, başlangıç metni `Mein Tipp / Wunsch:` şeklindedir.
- İngilizce e-posta konusu `Message to Bedri Usta Mannheim`, başlangıç metni `My suggestion / request:` şeklindedir.
- Google ve Tripadvisor butonlarındaki platform ikonları `icons/social/` klasöründedir ve isimlerin altında beş altın yıldız görünür.

### 9. Sosyal medya bölümü

- Bölüm başlığı `SOSYAL MEDYA` olarak kullanılır.
- Güncel çağrı metni `Takip Et · Beğen · Yorum Yap · Paylaş` şeklindedir; `Beğen` sonradan eklendi.
- Instagram kartı `https://www.instagram.com/mannheim_bedriusta` adresini açar.
- Aynı güncel Instagram bağlantısı sosyal kartta, footer’da ve mobil sabit alt barda kullanılır.
- YouTube kartı `https://www.youtube.com/c/BedriUsta` adresini açar.
- TikTok ve Facebook kartları marka görünümünü korur ancak hesap bağlantısı hazır olmadığı için `Yakında` durumundadır ve tıklanabilir değildir.
- Sosyal medya kartlarında altın çizgili SVG ikon, ortalanmış platform adı ve durum metni kullanılır.

### 10. İletişim bölümü

- `İLETİŞİM` başlığı sosyal medya alanından ayrı bir bölümde gösterilir.
- İletişim Formu: `Yakında aktif`, henüz bağlantı yoktur.
- E-posta: `info@bedriusta.de`, `mailto:info@bedriusta.de` bağlantısını kullanır.
- WhatsApp: `Numara yakında`, henüz bağlantı yoktur.
- Telefon: `Numara yakında`, henüz bağlantı yoktur.
- Hazır olmayan kartlar farklı veya rastgele bir renk kullanmaz; diğer kartlarla aynı bordo marka yüzeyini korur ve yalnız durum metniyle ayrılır.
- Masaüstünde dört küçük kart ortalanır; tablet ve telefonda iki sütunlu responsive grid kullanılır.

### 11. Footer güncellemeleri

- Footer’ın `01 · Ziyaret` sütununda güncel saatler tekrar gösterilir:
  - Pazar — Perşembe: `08:00 — 24:00`
  - Cuma — Cumartesi: `08:00 — 01:00`
- Footer’da adres, `Adresi kopyala` ve `Haritada aç ↗` seçenekleri bulunur.
- Footer iletişim sütunundaki Instagram bağlantısı `https://www.instagram.com/mannheim_bedriusta` olarak güncellendi.
- Yasal sütuna `AGB` ve `FAQ` satırları eklendi.
- `AGB` gerçek içerik hazır olmadığı için `YAKINDA` olarak pasif görünür.
- `FAQ` satırı mevcut iletişim/yardım alanına yönlendirir.
- Footer’ın marka cümlesi `Ustalıkla hazırlanan kebaplar, özenli servis ve sıcak Türk misafirliği.` şeklindedir.

### 12. Responsive ve erişilebilirlik kuralları

- Mobil öncelikli düzen 320px’den itibaren yatay taşmadan çalışmalıdır.
- Dokunulabilir buton ve bağlantılar en az 44px hedef alanını korumalıdır.
- Logo, görsel ve kartlarda sabit genişlik yerine `max-width`, esnek grid ve oran kullanılır.
- Klavye odağı altın odak halkasıyla görünür olmalıdır.
- Hazır olmayan bağlantılar gerçek bağlantı gibi davranmamalıdır.
- Otomatik hareket azaltılmış hareket tercihini desteklemelidir.
- Görsellerde açıklayıcı `alt`, kesin `width`/`height`, uygun yerlerde `loading="lazy"` ve `decoding="async"` kullanılmalıdır.

## Klasörler

- `brand/`: Üst navigasyonda kullanılan değişmez dikdörtgen logo ve şeffaf yardımcı logo.
- `app-icons/`: Bordo dış zemini koruyan favicon, Apple Touch ve PWA ikonları.
- `icons/ui/`: Menü, rezervasyon, yön, iletişim ve sosyal hızlı erişim SVG ikonları.
- `icons/social/`: Google, Tripadvisor ve sosyal platform SVG ikonları.
- `images/menu/`: Web için optimize edilmiş dikey WebP yemek görselleri.
- `images/editorial/`: Ana sayfa ve hakkımızda alanlarında kullanılan optimize WebP görselleri.
- `images/people/`: Portre ve kariyer görseli.
- `css/`: Renk tokenları ve yeniden kullanılabilir buton/kart stilleri.
- `examples/`: Kopyalanabilir HTML örneği.
- `asset-manifest.json`: Önerilen ana dosyaların makine tarafından okunabilir listesi.

## Logo seçimi

Ana web logosu:

```html
<img
  src="/web-asset-kit/brand/bedri-usta-logo-header.png"
  width="180"
  height="233"
  alt="Bedri Usta"
/>
```

Bu dosyanın krem ve kırmızı dikdörtgen zemini logonun parçasıdır; silinmemeli veya şeffaflaştırılmamalıdır.

## Tarayıcı ve PWA ikonları

```html
<link rel="icon" type="image/png" sizes="32x32" href="/web-asset-kit/app-icons/favicon-32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/web-asset-kit/app-icons/apple-touch-icon-180.png" />
```

PWA manifestinde:

```json
{
  "icons": [
    { "src": "/web-asset-kit/app-icons/pwa-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/web-asset-kit/app-icons/pwa-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/web-asset-kit/app-icons/pwa-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Bu ikonlarda özgün dikdörtgen logo değiştirilmemiştir; mobil ve tarayıcı ikonlarının boş dış alanı Mannheim bordosudur.

## CSS kullanımı

```html
<link rel="stylesheet" href="/web-asset-kit/css/bedri-usta-tokens.css" />
<link rel="stylesheet" href="/web-asset-kit/css/bedri-usta-components.css" />
```

Hazır örnekler için `examples/index.html` dosyasına bakın. CSS sınıfları `bu-` öneki taşır; başka projelerin stilleriyle çakışma riski düşüktür.

## Web optimizasyonu

- Fotoğraf ağırlıklı ana görseller WebP olarak paketlendi.
- Arayüz ve platform ikonları ölçeklenebilir SVG olarak paketlendi.
- Favicon/PWA dosyaları gereken kesin PNG ölçülerinde tutuldu.
- Büyük, kullanılmayan ve aynı içeriği tekrar eden eski PNG dosyaları pakete alınmadı.
- Görsellerde `width`, `height`, `loading="lazy"` ve `decoding="async"` kullanılması önerilir.
