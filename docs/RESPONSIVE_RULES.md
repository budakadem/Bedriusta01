# Responsive Rules

Bu proje her değişiklikte mobil, tablet ve desktop için güvenli kalmalıdır.

## Zorunlu Breakpoint Mantığı

- `1180px` altındaki ekranlarda header hamburger menüye geçmelidir.
- `1180px` altındaki ekranlarda hero bölümü tek kolon olmalıdır.
- `1024px` tablet genişliği desktop kabul edilmemelidir.
- `430px`, `390px`, `375px` ve `320px` mobil genişliklerde yatay taşma olmamalıdır.

## Kontrol Edilecek Ekranlar

- 320px küçük mobil
- 375px iPhone
- 390px modern iPhone
- 430px büyük telefon
- 768px tablet
- 1024px iPad/tablet
- 1180px breakpoint sınırı
- 1280px desktop
- 1440px geniş desktop

## UI Kuralları

- Header küçük/orta ekranda linkleri sıkıştırmak yerine hamburger kullanır.
- Hero görsel ve metin 1180px altında yan yana durmaz.
- Kartlar, footer blokları ve menü gridleri `minmax(min(..., 100%), 1fr)` gibi güvenli grid kurallarıyla kurulmalıdır.
- Uzun metinlerde `overflowWrap` veya kontrollü satır kırma kullanılmalıdır.
- `100vw` layout kullanılmamalıdır; yatay scroll oluşturan sabit genişliklerden kaçınılmalıdır.
- Görseller her zaman `max-width: 100%` ve stabil aspect/height ile kullanılmalıdır.
- Arka plansız logo/figür istenen alanlarda dama desenli ekran görüntüsü kullanılmaz; görsel dosyası gerçek alpha transparan PNG/WebP olmalı, mümkünse kırpılmış yeni asset adıyla kullanılmalıdır.
- Footer marka görseli kare boş alan veya beyaz/dama arka plan göstermemeli; dosya değiştirilirse mobil ve desktop footer üzerinde tekrar kontrol edilmelidir.

## Değişiklikten Sonra Çalıştır

```bash
npm run build
```

Sonra tarayıcıda en az şu görünümleri kontrol et:

- 430 x 932
- 768 x 1024
- 1024 x 1366
- 1280 x 800
