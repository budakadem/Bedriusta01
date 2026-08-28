import { useEffect } from "react";
import { LegalPending } from "./LegalPending";
import "./privacy-page.css";

const sections = [
  { id: "isletme", number: "01", label: "İşletme bilgileri" },
  { id: "temsil", number: "02", label: "Yetkili temsilci" },
  { id: "sicil", number: "03", label: "Ticaret sicili ve vergi" },
  { id: "icerik-sorumlusu", number: "04", label: "İçerik sorumlusu" },
  { id: "sorumluluk", number: "05", label: "Sorumluluk reddi" },
  { id: "telif", number: "06", label: "Telif hakkı" },
  { id: "anlasmazlik", number: "07", label: "Anlaşmazlık çözümü" }
] as const;

export function ImpressumPage() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    window.requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ block: "start" }));
  }, []);

  return (
    <main className="privacy-page">
      <header className="privacy-hero">
        <div className="privacy-shell">
          <button className="privacy-back" type="button" onClick={() => window.history.back()}>
            <span aria-hidden="true">←</span> Geri dön
          </button>
          <p className="privacy-kicker">İMPRESSUM · BEDRİ USTA MANNHEIM</p>
          <h1>Kim olduğumuzu açıkça biliyorsun.</h1>
          <p className="privacy-hero__lead">
            Bu sayfa, Almanya'da faaliyet gösteren dijital hizmet sağlayıcıları için zorunlu olan yasal
            bilgilendirmeyi (Impressum) içerir. § 5 DDG (Digitale-Dienste-Gesetz, eski adıyla § 5 TMG) ve
            gerektiğinde § 18 Abs. 2 MStV kapsamında istenen bilgiler aşağıda yer alır.
          </p>
          <div className="privacy-hero__facts" aria-label="Impressum özeti">
            <span>Yasal olarak zorunlu</span>
            <span>Şeffaf işletme bilgisi</span>
            <span>Sürekli güncel tutulur</span>
          </div>
        </div>
      </header>

      <section className="privacy-content">
        <div className="privacy-shell privacy-layout">
          <aside className="privacy-index">
            <p>BU SAYFADA</p>
            <nav aria-label="Impressum bölümleri">
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`}>
                  <span>{section.number}</span>{section.label}
                </a>
              ))}
            </nav>
            <div className="privacy-index__contact">
              <strong>Bir sorun mu var?</strong>
              <a href="mailto:info@bedriusta.de">info@bedriusta.de</a>
            </div>
          </aside>

          <article className="privacy-article">
            <section id="isletme">
              <span className="privacy-section__number">01</span>
              <p className="privacy-section__kicker">DİENSTEANBİETER</p>
              <h2>İşletme bilgileri</h2>
              <p>Bu web sitesinin işletmecisi ve içerikten sorumlu hizmet sağlayıcısı:</p>
              <div className="legal-fields">
                <div className="legal-field">
                  <span className="legal-field-label">İşletme adı (marka):</span>
                  <span className="legal-field-value">Bedri Usta Mannheim</span>
                </div>
                <div className="legal-field">
                  <span className="legal-field-label">Tam yasal unvan ve işletme sahibi:</span>
                  <span className="legal-field-value"><LegalPending /></span>
                </div>
                <div className="legal-field">
                  <span className="legal-field-label">Adres:</span>
                  <span className="legal-field-value">K1 1–4, 68159 Mannheim, Almanya</span>
                </div>
                <div className="legal-field">
                  <span className="legal-field-label">E-posta:</span>
                  <span className="legal-field-value"><a href="mailto:info@bedriusta.de">info@bedriusta.de</a></span>
                </div>
                <div className="legal-field">
                  <span className="legal-field-label">Telefon:</span>
                  <span className="legal-field-value"><LegalPending /></span>
                </div>
              </div>
              <div className="legal-intro-note">
                Kırmızı etiketli alanlar, işletmenin yasal türü ve iletişim numarası netleştiğinde
                doldurulacak. Yanlış veya uydurma bilgiyle yayınlanmadı; bu bölüm gerçek veriler
                sağlanana kadar bilinçli olarak boş bırakılmıştır.
              </div>
            </section>

            <section id="temsil">
              <span className="privacy-section__number">02</span>
              <p className="privacy-section__kicker">VERTRETUNG</p>
              <h2>Yetkili temsilci</h2>
              <p>
                İşletmeyi temsile yetkili kişi ya da kişiler (şahıs işletmesinde işletme sahibi,
                sermaye şirketinde Geschäftsführer):
              </p>
              <p><LegalPending /></p>
            </section>

            <section id="sicil">
              <span className="privacy-section__number">03</span>
              <p className="privacy-section__kicker">HANDELSREGISTER &amp; STEUER</p>
              <h2>Ticaret sicili ve vergi bilgileri</h2>
              <div className="legal-fields">
                <div className="legal-field">
                  <span className="legal-field-label">Ticaret sicili kaydı (varsa):</span>
                  <span className="legal-field-value"><LegalPending /></span>
                </div>
                <div className="legal-field">
                  <span className="legal-field-label">Sicil mahkemesi ve sicil numarası:</span>
                  <span className="legal-field-value"><LegalPending /></span>
                </div>
                <div className="legal-field">
                  <span className="legal-field-label">KDV kimlik numarası (§ 27a UStG) veya § 19 UStG küçük işletme durumu:</span>
                  <span className="legal-field-value"><LegalPending /></span>
                </div>
              </div>
            </section>

            <section id="icerik-sorumlusu">
              <span className="privacy-section__number">04</span>
              <p className="privacy-section__kicker">§ 18 ABS. 2 MSTV</p>
              <h2>İçerik sorumlusu</h2>
              <p>
                Gazetecilik-editöryal nitelikte içerik için sorumlu kişi (adres yukarıdaki gibidir):
              </p>
              <p><LegalPending /></p>
            </section>

            <section id="sorumluluk">
              <span className="privacy-section__number">05</span>
              <p className="privacy-section__kicker">HAFTUNGSAUSSCHLUSS</p>
              <h2>Sorumluluk reddi</h2>
              <p>
                İçeriklerimizi özenle hazırlıyor ve doğruluğunu düzenli olarak kontrol ediyoruz. Buna
                rağmen içeriklerin güncelliği, doğruluğu ve eksiksizliği için sorumluluk üstlenemeyiz.
                Genel kanunlar çerçevesinde kendi içeriklerimizden hizmet sağlayıcı olarak sorumluyuz;
                ancak bize aktarılmayan veya kaydedilmeyen üçüncü taraf bilgilerini izlemek ya da
                hukuka aykırılığa işaret eden koşulları araştırmakla yükümlü değiliz. İlgili yasal
                düzenlemeler kapsamındaki kaldırma ve engelleme yükümlülükleri bundan etkilenmez; bu
                konudaki sorumluluk yalnızca somut bir hukuka aykırılığın öğrenildiği andan itibaren
                söz konusu olabilir. İlgili bir ihlalden haberdar olduğumuzda içerikleri derhal
                kaldırırız.
              </p>
              <p>
                Sitemiz, içeriği üzerinde etkimizin olmadığı harici üçüncü taraf web sitelerine
                bağlantılar içerir (örn. Google Haritalar, Instagram, YouTube). Bu nedenle bu harici
                içerikler için herhangi bir sorumluluk üstlenemeyiz; ilgili sayfanın sağlayıcısı veya
                işletmecisi her zaman kendi içeriğinden sorumludur. Bağlantı verilen sayfalar, bağlantı
                verildiği anda olası hukuka aykırılıklar bakımından kontrol edilmiştir; o anda hukuka
                aykırı bir içerik tespit edilmemiştir. Somut bir hukuka aykırılık bildirimi olmadan
                bağlantılı sayfaların sürekli olarak kontrol edilmesi makul değildir. Bir ihlalden
                haberdar olduğumuzda ilgili bağlantıları derhal kaldırırız.
              </p>
            </section>

            <section id="telif">
              <span className="privacy-section__number">06</span>
              <p className="privacy-section__kicker">URHEBERRECHT</p>
              <h2>Telif hakkı</h2>
              <p>
                Bu web sitesinde yer alan içerik ve eserler Alman telif hakkı kanununa tabidir. Telif
                hakkı kanununun izin verdiği sınırların dışında kalan her türlü çoğaltma, işleme, yayma
                ve kullanım için önceden yazılı onayımız gereklidir. Bu sitedeki içeriğin bireysel
                kopyaları yalnızca özel, ticari olmayan kullanım için izinlidir.
              </p>
              <p>
                Bu sitedeki içerik bizzat tarafımızca oluşturulmadıysa üçüncü tarafların telif hakları
                gözetilir ve bu tür içerikler ayrıca işaretlenir. Buna rağmen bir telif hakkı ihlali
                fark edersen bizi bilgilendirmeni rica ederiz; somut bir bildirim üzerine ilgili
                içerikleri derhal kaldırırız.
              </p>
            </section>

            <section id="anlasmazlik">
              <span className="privacy-section__number">07</span>
              <p className="privacy-section__kicker">STREITSCHLICHTUNG</p>
              <h2>Anlaşmazlık çözümü</h2>
              <p>
                Bir tüketici hakem kurulu (Verbraucherschlichtungsstelle) önünde anlaşmazlık çözümü
                sürecine katılmakla yükümlü değiliz ve şu an için bu tür bir sürece katılmaya hazır
                değiliz. Bir anlaşmazlık durumunda önce doğrudan bize yazmanı rica ederiz:{" "}
                <a href="mailto:info@bedriusta.de">info@bedriusta.de</a>
              </p>
            </section>

            <footer className="privacy-updated">
              <span>VERSİYON 0.1 · TASLAK</span>
              <strong>Son güncelleme: 28 Ağustos 2026</strong>
            </footer>
          </article>
        </div>
      </section>
    </main>
  );
}
