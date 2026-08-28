import { useEffect } from "react";
import { LegalPending } from "./LegalPending";
import "./privacy-page.css";

const sections = [
  { id: "kapsam", number: "01", label: "Kapsam" },
  { id: "rezervasyon", number: "02", label: "Rezervasyon sözleşmesi" },
  { id: "iptal", number: "03", label: "İptal ve no-show" },
  { id: "gruplar", number: "04", label: "Grup ve etkinlik talepleri" },
  { id: "menu-fiyat", number: "05", label: "Menü, fiyat ve alerjenler" },
  { id: "hausrecht", number: "06", label: "Ev kuralları" },
  { id: "sorumluluk", number: "07", label: "Sorumluluk sınırlaması" },
  { id: "hukuk", number: "08", label: "Uygulanacak hukuk" },
  { id: "son-hukumler", number: "09", label: "Son hükümler" }
] as const;

export function AgbPage() {
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
          <p className="privacy-kicker">AGB · BEDRİ USTA MANNHEIM</p>
          <h1>Sofraya oturmadan önce şartları da bil.</h1>
          <p className="privacy-hero__lead">
            Bu Genel İşlem Şartları (AGB), Bedri Usta Mannheim üzerinden yapılan masa rezervasyonlarını
            ve restoran ziyaretini kapsar. Menüden sipariş ve ödeme koşulları restoran içinde ayrıca
            geçerlidir ve bu sayfanın kapsamı dışındadır.
          </p>
          <div className="privacy-hero__facts" aria-label="AGB özeti">
            <span>Rezervasyon şartları</span>
            <span>Açık iptal kuralları</span>
            <span>Alman hukuku geçerlidir</span>
          </div>
        </div>
      </header>

      <section className="privacy-content">
        <div className="privacy-shell privacy-layout">
          <aside className="privacy-index">
            <p>BU SAYFADA</p>
            <nav aria-label="AGB bölümleri">
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
            <section id="kapsam">
              <span className="privacy-section__number">01</span>
              <p className="privacy-section__kicker">GELTUNGSBEREICH</p>
              <h2>Kapsam</h2>
              <p>
                Bu şartlar, Bedri Usta Mannheim adı altında faaliyet gösteren işletme (tam yasal
                unvan: <LegalPending />) tarafından K1 1–4, 68159 Mannheim, Almanya adresinden
                işletilen bedriusta.de web sitesi üzerinden yapılan masa rezervasyonu ve grup talebi
                işlemleri için geçerlidir. Farklı yazılı bir anlaşma olmadıkça yalnızca bu şartlar
                uygulanır; misafirin genel işlem şartları kabul edilmez.
              </p>
            </section>

            <section id="rezervasyon">
              <span className="privacy-section__number">02</span>
              <p className="privacy-section__kicker">VERTRAGSSCHLUSS</p>
              <h2>Rezervasyon sözleşmesi</h2>
              <p>
                Web sitesindeki rezervasyon formu bir teklif niteliğindedir. Rezervasyon sözleşmesi,
                tarafımızca e-posta, telefon veya WhatsApp yoluyla onaylandığında kurulmuş sayılır.
                Onay bekleyen talepler, teyit edilene kadar kesin masa garantisi anlamına gelmez.
              </p>
              <p>
                Rezervasyon sırasında verdiğin ad, telefon ve kişi sayısı bilgilerinin doğru olması
                gerekir; telefon doğrulaması yalnızca iletişim bilgisinin geçerliliğini teyit etmek
                içindir.
              </p>
            </section>

            <section id="iptal">
              <span className="privacy-section__number">03</span>
              <p className="privacy-section__kicker">STORNIERUNG</p>
              <h2>İptal ve no-show politikası</h2>
              <p>
                Planların değişmesi halinde rezervasyonunu mümkün olduğunca erken, tercihen randevu
                saatinden <LegalPending /> önce iptal etmeni veya değiştirmeni rica ederiz. Güncel
                iptal süresi ve varsa no-show ücreti politikası netleştiğinde bu bölüm tamamlanacaktır.
              </p>
              <p>
                Haber verilmeden gelinmeyen (no-show) rezervasyonlar, ileride yapılacak rezervasyon
                taleplerinin değerlendirilmesinde dikkate alınabilir.
              </p>
            </section>

            <section id="gruplar">
              <span className="privacy-section__number">04</span>
              <p className="privacy-section__kicker">GRUPPEN &amp; EVENTS</p>
              <h2>Grup ve etkinlik talepleri</h2>
              <p>
                20 kişiden fazla grup talepleri otomatik bir rezervasyon oluşturmaz; tercih edilen
                tarih ve saat üzerinden telefon veya WhatsApp ile iletişime geçilerek personel onayına
                tabidir. Büyük grup ve özel etkinlik talepleri için ayrıca ön ödeme, minimum kişi sayısı
                veya menü seçimi gibi ek şartlar kararlaştırılabilir; bu şartlar ilgili yazışmada ayrıca
                belirtilir.
              </p>
            </section>

            <section id="menu-fiyat">
              <span className="privacy-section__number">05</span>
              <p className="privacy-section__kicker">SPEISEKARTE &amp; PREISE</p>
              <h2>Menü, fiyat ve alerjenler</h2>
              <p>
                Web sitesindeki menü, görsel ve fiyat bilgileri bilgilendirme amaçlıdır; güncel fiyat
                ve ürün mevcudiyeti restoranda geçerli olan menüye göre belirlenir. Alerjen ve katkı
                maddesi bilgileri menü sayfasındaki kod rehberinde açıklanmıştır; özel bir alerjin veya
                intoleransın varsa siparişten önce personelimizden teyit almanı öneririz.
              </p>
            </section>

            <section id="hausrecht">
              <span className="privacy-section__number">06</span>
              <p className="privacy-section__kicker">HAUSRECHT</p>
              <h2>Ev kuralları</h2>
              <p>
                İşletme, misafirlerin ve çalışanların güvenliğini ve restorandaki huzuru korumak
                amacıyla ev hakkını (Hausrecht) kullanma yetkisine sahiptir. Bu kapsamda, haklı bir
                sebep bulunması halinde hizmeti reddetme veya bir misafiri restorandan çıkarma hakkı
                saklıdır.
              </p>
            </section>

            <section id="sorumluluk">
              <span className="privacy-section__number">07</span>
              <p className="privacy-section__kicker">HAFTUNG</p>
              <h2>Sorumluluk sınırlaması</h2>
              <p>
                Kasıt veya ağır ihmalden kaynaklanan zararlar ile yaşam, vücut bütünlüğü veya sağlığa
                verilen zararlardan yasal olarak sınırsız sorumluyuz. Hafif ihmal hâllerinde ise
                yalnızca sözleşmeden doğan esaslı bir yükümlülüğün (Kardinalpflicht) ihlali durumunda
                ve sözleşmeye özgü, öngörülebilir zararla sınırlı olarak sorumluluk üstleniriz. Bunun
                dışındaki sorumluluk, yasaların izin verdiği ölçüde hariç tutulur.
              </p>
            </section>

            <section id="hukuk">
              <span className="privacy-section__number">08</span>
              <p className="privacy-section__kicker">ANWENDBARES RECHT</p>
              <h2>Uygulanacak hukuk ve yetkili mahkeme</h2>
              <p>
                Bu şartlar için Almanya Federal Cumhuriyeti hukuku, tüketicinin mutat mesken hukukunun
                sağladığı zorunlu koruma hükümleri saklı kalmak kaydıyla uygulanır. Tüketiciyle yapılan
                sözleşmelerde yasal yetkili mahkeme kuralları geçerlidir; tacirler için yetkili mahkeme
                işletmenin bulunduğu Mannheim'dır.
              </p>
            </section>

            <section id="son-hukumler">
              <span className="privacy-section__number">09</span>
              <p className="privacy-section__kicker">SCHLUSSBESTIMMUNGEN</p>
              <h2>Son hükümler</h2>
              <p>
                Bu şartların herhangi bir hükmünün geçersiz olması, diğer hükümlerin geçerliliğini
                etkilemez. Bu şartlarda değişiklik yapma hakkımız saklıdır; güncel sürüm her zaman bu
                sayfada yayınlanır. Sorularınız için bize yazabilirsiniz:{" "}
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
