import { useEffect } from "react";
import "./privacy-page.css";

const sections = [
  { id: "sorumlu", number: "01", label: "Veri sorumlusu" },
  { id: "site", number: "02", label: "Site ve hosting" },
  { id: "pwa", number: "03", label: "PWA ve cihaz" },
  { id: "bildirimler", number: "04", label: "Bildirimler" },
  { id: "dis-servisler", number: "05", label: "Dış servisler" },
  { id: "iletisim", number: "06", label: "İletişim" },
  { id: "reservierung", number: "07", label: "Rezervasyon" },
  { id: "basvuru", number: "08", label: "İş başvuruları" },
  { id: "cookies", number: "09", label: "Çerez ve depolama" },
  { id: "haklar", number: "10", label: "Hakların" }
] as const;

export function PrivacyPage() {
  useEffect(() => {
    const isLegacyCandidateRoute = window.location.pathname.replace(/\/+$/, "") === "/datenschutz/bewerbung";
    const hash = isLegacyCandidateRoute ? "#basvuru" : window.location.hash;
    if (isLegacyCandidateRoute) {
      window.history.replaceState({}, "", `/datenschutz${hash}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
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
          <p className="privacy-kicker">DATENSCHUTZERKLÄRUNG · BEDRİ USTA MANNHEIM</p>
          <h1>Verilerin konusunda açık ve netiz.</h1>
          <p className="privacy-hero__lead">
            Bu bilgilendirme; web sitesi, PWA özellikleri, bildirimler, dış bağlantılar,
            iletişim, rezervasyon ve iş başvuruları kapsamında kişisel verilerin nasıl işlendiğini açıklar.
          </p>
          <div className="privacy-hero__facts" aria-label="Veri koruma özeti">
            <span>Gerektiği kadar veri</span>
            <span>Şeffaf işleme</span>
            <span>Kontrol sende</span>
          </div>
        </div>
      </header>

      <section className="privacy-content">
        <div className="privacy-shell privacy-layout">
          <aside className="privacy-index">
            <p>BU SAYFADA</p>
            <nav aria-label="Veri koruma bölümleri">
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
            <section id="sorumlu">
              <span className="privacy-section__number">01</span>
              <p className="privacy-section__kicker">SORUMLULUK</p>
              <h2>Veri sorumlusu</h2>
              <p>Bu web sitesi ve burada açıklanan veri işlemlerinden sorumlu işletme:</p>
              <address>
                <strong>Bedri Usta Mannheim</strong><br />
                K1 1–4, 68159 Mannheim, Almanya<br />
                E-posta: <a href="mailto:info@bedriusta.de">info@bedriusta.de</a>
              </address>
              <div className="privacy-note">
                Ticari işletmecinin tam yasal unvanı ve temsil bilgileri Impressum’da belirtilir.
              </div>
            </section>

            <section id="site">
              <span className="privacy-section__number">02</span>
              <p className="privacy-section__kicker">WEB SİTESİ VE HOSTING</p>
              <h2>Siteyi ziyaret ettiğinde</h2>
              <p>
                Sayfaların güvenli ve kararlı biçimde sunulabilmesi için IP adresi, istek zamanı, çağrılan adres,
                yönlendiren sayfa, tarayıcı ve işletim sistemi bilgisi gibi teknik erişim verileri sunucu kayıtlarında
                işlenebilir. Bu işlem güvenlik, hata tespiti ve kötüye kullanımın önlenmesine yönelik meşru menfaatimize
                dayanır (GDPR Art. 6 Abs. 1 lit. f).
              </p>
              <p>
                Site Vercel altyapısında barındırılır. Hizmet sağlayıcılar yalnızca gerekli kapsamda ve veri koruma
                sözleşmeleri çerçevesinde kullanılır. Avrupa Ekonomik Alanı dışına aktarım gerçekleşirse GDPR Art. 44
                ve devamındaki uygun güvenceler uygulanır.
              </p>
            </section>

            <section id="pwa">
              <span className="privacy-section__number">03</span>
              <p className="privacy-section__kicker">PWA VE CİHAZ ÖZELLİKLERİ</p>
              <h2>Uygulama gibi kullanım</h2>
              <p>
                Bedri Usta sitesi ana ekrana eklenebilen bir PWA’dır. Service worker, sayfaların daha hızlı açılması ve
                temel içeriğin bağlantı kesildiğinde kullanılabilmesi için cihazında teknik önbellek oluşturabilir.
                Bu önbellek reklam profili oluşturmak için kullanılmaz ve tarayıcı/PWA verileri temizlenerek kaldırılabilir.
              </p>
              <p>
                Menü araması cihazında yerel olarak çalışır ve arama metni sunucuya gönderilmez. “Sayfayı paylaş” özelliği
                cihazın Web Share API’sini kullanır; destek yoksa yalnızca açık sayfanın bağlantısı panoya kopyalanır.
                Hangi uygulamayla paylaşım yapacağını sen seçersin.
              </p>
            </section>

            <section id="bildirimler">
              <span className="privacy-section__number">04</span>
              <p className="privacy-section__kicker">PUSH BİLDİRİMLERİ</p>
              <h2>Yalnızca sen açarsan</h2>
              <p>
                Bildirim merkezi açıldığında OneSignal altyapısı yüklenebilir. Push bildirimi aboneliği yalnızca açık
                işlemin ve tarayıcı iznin sonrasında etkinleşir. Bu sırada bildirim izni durumu, abonelik kimliği, cihaz
                ve tarayıcıya ilişkin teknik bilgiler ile IP adresi OneSignal tarafından işlenebilir. Hukuki dayanak
                onayındır (GDPR Art. 6 Abs. 1 lit. a).
              </p>
              <p>
                Bildirim iznini cihazının veya tarayıcının site ayarlarından istediğin zaman kapatabilirsin. İzni geri
                çekmen, geri çekmeden önceki işlemenin hukuka uygunluğunu etkilemez.
              </p>
            </section>

            <section id="dis-servisler">
              <span className="privacy-section__number">05</span>
              <p className="privacy-section__kicker">DIŞ İÇERİK VE BAĞLANTILAR</p>
              <h2>Harita, sosyal medya ve yazı tipleri</h2>
              <p>
                Yol tarifi, Instagram ve YouTube bağlantıları yalnızca tıkladığında ilgili hizmeti açar. Bu noktadan
                sonra ilgili sağlayıcı IP adresi, cihaz bilgisi ve varsa hesabınla bağlantılı verileri kendi kuralları
                kapsamında işleyebilir. Harita bağlantısı Google Maps’e yönlendirir.
              </p>
              <p>
                Görsel bütünlük için Google Fonts üzerinden Heebo ve Karla yazı tipleri çağrılır. Bağlantı kurulurken
                IP adresi ve teknik istek bilgileri Google’a iletilebilir. Menüde kullanılan bazı medya dosyaları harici
                kaynaklardan çağrıldığında aynı şekilde ilgili sunucuya teknik bağlantı bilgileri aktarılabilir.
              </p>
            </section>

            <section id="iletisim">
              <span className="privacy-section__number">06</span>
              <p className="privacy-section__kicker">İLETİŞİM</p>
              <h2>Bize ulaştığında</h2>
              <p>
                E-posta veya telefonla iletişim kurduğunda ilettiğin bilgiler talebini yanıtlamak ve gerekli takip
                işlemlerini yapmak için işlenir. İşlem, talebin sözleşme öncesi veya sözleşmesel bir konuyla ilgiliyse
                GDPR Art. 6 Abs. 1 lit. b; diğer durumlarda iletişimi yürütmeye ilişkin meşru menfaatimiz kapsamında
                GDPR Art. 6 Abs. 1 lit. f temeline dayanır.
              </p>
              <p>
                Veriler, iletişim amacı tamamlandığında ve başka bir yasal saklama zorunluluğu bulunmadığında silinir.
                Vergi veya ticaret hukuku kapsamında saklanması gereken yazışmalar ilgili yasal süre boyunca korunabilir.
              </p>
            </section>

            <section id="reservierung">
              <span className="privacy-section__number">07</span>
              <p className="privacy-section__kicker">REZERVASYON VE GRUP TALEPLERİ</p>
              <h2>Bir masa ayırttığında</h2>
              <p>
                Rezervasyonu veya grup talebini oluşturmak, müsaitliği kontrol etmek, seninle iletişim kurmak,
                rezervasyonu yönetmek ve kötüye kullanımı önlemek için ad, soyad, telefon, e-posta, kişi sayısı,
                tarih, saat, bölüm tercihi, rezervasyon amacı ve isteğe bağlı notlarını işleriz. İşleme, rezervasyon
                sözleşmesinin kurulması ve yürütülmesi için GDPR Art. 6 Abs. 1 lit. b kapsamında gerçekleştirilir.
              </p>
              <p>
                Telefon doğrulama verileri yalnızca iletişim bilgisinin doğruluğunu ve işlemin güvenliğini sağlamak
                amacıyla kullanılır. Masa ve kapasite durumu son onay sırasında sunucuda yeniden kontrol edilir.
                Rezervasyon iletişimleri pazarlama mesajlarından teknik ve hukuki olarak ayrı tutulur.
              </p>
              <div className="privacy-recruitment-grid">
                <div>
                  <strong>Grup talepleri</strong>
                  <p>20’den fazla kişilik talepler otomatik rezervasyon değildir. Tercih edilen tarih ve saat, telefon veya WhatsApp iletişimi ve personel onayı için işlenir.</p>
                </div>
                <div>
                  <strong>Tabla Club</strong>
                  <p>Tabla Club katılımı isteğe bağlıdır ve rezervasyonu etkilemez. Üyelik talebi ile e-posta, WhatsApp, push ve partner kampanyası izinleri ayrı ayrı kaydedilir.</p>
                </div>
                <div>
                  <strong>Saklama</strong>
                  <p>Rezervasyon ve ziyaret verileri operasyon, ispat ve uygulanabilir yasal saklama yükümlülükleri için gerekli süre boyunca tutulur; amaç sona erdiğinde silinir veya anonimleştirilir.</p>
                </div>
                <div>
                  <strong>Hizmet sağlayıcılar</strong>
                  <p>Hosting, telefon doğrulama ve transactional mesaj sağlayıcıları yalnızca gerekli kapsamda ve veri işleme sözleşmeleri çerçevesinde kullanılır.</p>
                </div>
              </div>
            </section>

            <section id="basvuru">
              <span className="privacy-section__number">08</span>
              <p className="privacy-section__kicker">KARİYER VE İŞ BAŞVURULARI</p>
              <h2>Adaylar için veri koruma bilgilendirmesi</h2>
              <p>
                Kariyer formunda verdiğin iletişim, eğitim, deneyim, dil, çalışma yetkisi ve görüşme tercihi bilgileri
                yalnızca başvurunun değerlendirilmesi ve işe alım sürecinin yürütülmesi için işlenir. Normal başvuru için
                ayrıca rıza kutusu kullanılmaz. İsteğe bağlı aday havuzu onayı mevcut başvurudan ayrıdır.
              </p>
              <div className="privacy-recruitment-grid">
                <div>
                  <strong>İşleme amacı ve hukuki dayanak</strong>
                  <p>
                    Veriler; adayın uygunluğunu değerlendirmek, iletişim kurmak, görüşme planlamak ve işe alım kararını
                    vermek için BDSG § 26 Abs. 1 ve uygulanabildiği ölçüde GDPR Art. 6 Abs. 1 lit. b kapsamında işlenir.
                    Aday havuzu yalnızca ayrı ve isteğe bağlı onayına dayanır (GDPR Art. 6 Abs. 1 lit. a).
                  </p>
                </div>
                <div>
                  <strong>İşlenen bilgiler</strong>
                  <p>
                    İletişim bilgileri, eğitim, mesleki deneyim, dil bilgileri, çalışma yetkisi beyanı, LinkedIn bağlantısı,
                    serbest açıklamalar, görüşme tercihi ve e-posta doğrulama bilgileri işlenebilir.
                  </p>
                </div>
                <div>
                  <strong>Erişim ve hizmet sağlayıcılar</strong>
                  <p>
                    Verilere yalnızca işe alımda görevli yetkili kişiler erişir. Hosting, e-posta doğrulama ve başvuru
                    altyapısı sağlayıcıları verileri yalnızca talimatlarımız ve gerekli sözleşmeler çerçevesinde işler.
                  </p>
                </div>
                <div>
                  <strong>Zorunlu bilgiler ve çalışma yetkisi</strong>
                  <p>
                    Zorunlu alanlar verilmezse başvuru tamamlanamaz. İşe başlangıç tarihinde Almanya’da geçerli çalışma
                    yetkisi gerekir. Belgenin aslı görüşmede kontrol edilebilir; ilk başvuruda kimlik, oturum kartı veya
                    çalışma izni kopyası yükletilmez.
                  </p>
                </div>
              </div>
              <div className="privacy-recruitment-retention">
                <strong>Saklama ve silme</strong>
                <p>
                  İşe alınmayan adayların başvuru verileri, süreç sonuçlandıktan sonra olası hukuki taleplerin
                  değerlendirilmesi amacıyla en fazla altı ay saklanır ve ardından silinir. İşe alınan kişinin gerekli
                  verileri yeni amaç ve yasal saklama süreleri kapsamında personel dosyasına aktarılır.
                </p>
                <p>
                  Aday havuzuna isteğe bağlı katılırsan profilin başvurunun sonuçlanmasından itibaren 12 ay saklanır.
                  Süre sonunda yeniden onay vermediğin takdirde silinir. Onayını daha önce geri çekersen geleceğe yönelik
                  aday havuzu işlemesi durdurulur; bu seçim mevcut başvurunu etkilemez.
                </p>
              </div>
              <p>
                Başvurular hakkında yalnızca otomatik işlemeye veya profil oluşturmaya dayanan bir işe alım kararı
                verilmez. Bu sayfanın “Hakların” bölümündeki erişim, düzeltme, silme, kısıtlama ve şikâyet hakları aday
                verileri için de geçerlidir.
              </p>
            </section>

            <section id="cookies">
              <span className="privacy-section__number">09</span>
              <p className="privacy-section__kicker">ÇEREZLER VE YEREL DEPOLAMA</p>
              <h2>Teknik olarak gerekli kullanım</h2>
              <p>
                Site şu anda kendi adına reklam veya davranış analizi çerezi kullanmaz. PWA önbelleği sitenin teknik
                çalışması için cihazında tutulabilir. Bildirim özelliğini açtığında OneSignal, aboneliği sürdürebilmek
                ve izin durumunu yönetmek amacıyla çerez veya benzeri yerel depolama teknolojileri kullanabilir.
              </p>
              <p>
                Tarayıcı ayarlarından çerezleri, site verilerini ve PWA önbelleğini görüntüleyebilir veya silebilirsin.
                Teknik olarak zorunlu verilerin engellenmesi bazı uygulama işlevlerinin çalışmasını sınırlayabilir.
              </p>
            </section>

            <section id="haklar">
              <span className="privacy-section__number">10</span>
              <p className="privacy-section__kicker">HAKLARIN VE BAŞVURU YOLU</p>
              <h2>Verilerin üzerinde söz sahibisin</h2>
              <p>
                Koşulları oluştuğunda kişisel verilerine erişme, düzeltme, silme, işlemeyi kısıtlama, veri taşınabilirliği
                ve meşru menfaate dayalı işlemeye itiraz etme haklarına sahipsin. Onaya dayanan işlemlerde onayını geleceğe
                yönelik olarak istediğin zaman geri çekebilirsin.
              </p>
              <p>
                Talebini <a href="mailto:info@bedriusta.de">info@bedriusta.de</a> adresine gönderebilirsin. Ayrıca yetkili
                denetim makamı olan Baden-Württemberg Veri Koruma ve Bilgi Özgürlüğü Eyalet Görevlisine şikâyette
                bulunabilirsin: <a href="https://www.baden-wuerttemberg.datenschutz.de/" target="_blank" rel="noreferrer">baden-wuerttemberg.datenschutz.de</a>.
              </p>
              <p>
                Yalnızca otomatik işlemeye dayanan ve senin üzerinde hukuki veya benzer derecede önemli sonuç doğuran
                bir karar verme sistemi kullanmıyoruz.
              </p>
            </section>

            <footer className="privacy-updated">
              <span>VERSİYON 1.0</span>
              <strong>Son güncelleme: 13 Ağustos 2026</strong>
            </footer>
          </article>
        </div>
      </section>
    </main>
  );
}
