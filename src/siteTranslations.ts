import type { SiteLanguage } from "./siteLanguage";
import { formTranslations } from "./siteTranslationsForms";
import { privacyTranslations } from "./siteTranslationsPrivacy";

type Translation = { DE: string; ENG: string };

const translations: Record<string, Translation> = {
  "Anasayfa": { DE: "Startseite", ENG: "Home" },
  "Hakkımızda": { DE: "Über uns", ENG: "About us" },
  "Politikalarımız": { DE: "Unsere Richtlinien", ENG: "Our policies" },
  "İletişim": { DE: "Kontakt", ENG: "Contact" },
  "İletişim Formu": { DE: "Kontaktformular", ENG: "Contact Form" },
  "Rezervasyon": { DE: "Reservierung", ENG: "Reservation" },
  "Menü": { DE: "Speisekarte", ENG: "Menu" },
  "Cookie-Einstellungen": { DE: "Cookie-Einstellungen", ENG: "Cookie settings" },
  "HAZIRLANIYOR": { DE: "IN VORBEREITUNG", ENG: "COMING SOON" },
  "Yakında": { DE: "Demnächst", ENG: "Coming soon" },
  "Yakında aktif": { DE: "Demnächst aktiv", ENG: "Coming soon" },
  "Numara yakında": { DE: "Nummer folgt in Kürze", ENG: "Number coming soon" },
  "Bedri Usta Mannheim editorial portresi": { DE: "Editorialporträt von Bedri Usta Mannheim", ENG: "Bedri Usta Mannheim editorial portrait" },
  "ADANA Ocakbaşı": { DE: "ADANA OCAKBAŞI", ENG: "ADANA OCAKBAŞI" },
  "Bedri Usta'nın 50 yılı aşkın deneyimi, Mannheim şehir merkezinde yeni bir ocakbaşı deneyimiyle buluşuyor. Adana kebabı, seçkin grill lezzetleri ve sıcak Türk misafirliği; premium ama samimi bir sofrada bir araya geliyor.": {
    DE: "Mehr als 50 Jahre Erfahrung von Bedri Usta treffen im Herzen Mannheims auf ein neues Ocakbaşı-Erlebnis. Adana-Kebab, ausgewählte Grillspezialitäten und herzliche türkische Gastfreundschaft vereinen sich an einer hochwertigen und zugleich persönlichen Tafel.",
    ENG: "More than 50 years of Bedri Usta experience meet a new ocakbaşı tradition in central Mannheim. Adana kebab, selected grilled specialities and warm Turkish hospitality come together around a premium yet welcoming table."
  },
  "HAKKIMIZDA · BEDRİ USTA": { DE: "ÜBER UNS · BEDRİ USTA", ENG: "ABOUT · BEDRİ USTA" },
  "Mardin’den Adana’ya, ocak başından dünyaya.": { DE: "Von Mardin nach Adana, vom Ocakbaşı in die Welt.", ENG: "From Mardin to Adana, from the ocakbaşı to the world." },
  "1970 yılında Mardin’in Altıyol köyünde dünyaya gelen Bedrettin Aydoğdu, yedi yaşında Adana’da çalışmaya ve mesleği öğrenmeye başladı. Çocuk yaşta ocak başında başlayan bu yolculukta, yıllar içinde herkesin Bedri Usta olarak tanıdığı, gerçek Türk kebabının güçlü temsilcilerinden biri oldu.": {
    DE: "Bedrettin Aydoğdu wurde 1970 im Dorf Altıyol bei Mardin geboren und begann mit sieben Jahren in Adana zu arbeiten und sein Handwerk zu erlernen. Aus diesem frühen Weg am Ocakbaşı wurde über die Jahre Bedri Usta – einer der prägenden Vertreter echten türkischen Kebabs.",
    ENG: "Born in 1970 in Altıyol near Mardin, Bedrettin Aydoğdu began working and learning his craft in Adana at the age of seven. That early journey at the ocakbaşı shaped the man known today as Bedri Usta, a leading representative of authentic Turkish kebab."
  },
  "Adana’da başlayan yolculuk İstanbul’a, ardından yurt içi ve yurt dışındaki restoranlara uzandı. Marka büyürken Bedri Usta ocağın başından ayrılmadı; imza lezzetlerini ve sıcak misafirlik anlayışını yeni kuşaklarla paylaşmayı sürdürdü. Bugün bu ustalık hikâyesi Mannheim’da yeni bir sofrayla devam ediyor.": {
    DE: "Der in Adana begonnene Weg führte nach Istanbul und später in Restaurants im In- und Ausland. Auch mit dem Wachstum der Marke blieb Bedri Usta seinem Handwerk treu und gab seine charakteristischen Gerichte und herzliche Gastfreundschaft an neue Generationen weiter. Heute setzt sich diese Geschichte der Meisterschaft an einer neuen Tafel in Mannheim fort.",
    ENG: "The journey that began in Adana continued to Istanbul and then to restaurants in Türkiye and abroad. As the brand grew, Bedri Usta remained close to his craft, passing his signature flavours and warm hospitality to new generations. Today, that story of mastery continues around a new table in Mannheim."
  },
  "7 yaşında": { DE: "Mit 7 Jahren", ENG: "At age 7" },
  "Adana’da mesleğe başlangıç": { DE: "Beginn des Handwerks in Adana", ENG: "The craft begins in Adana" },
  "50+ yıl": { DE: "50+ Jahre", ENG: "50+ years" },
  "Ocakbaşı tecrübesi": { DE: "Ocakbaşı-Erfahrung", ENG: "Ocakbaşı experience" },
  "MENÜMÜZ": { DE: "UNSERE SPEISEKARTE", ENG: "OUR MENU" },
  "Paylaşılan her tabakta ustalık, her sofrada güzel bir sohbet var.": { DE: "Meisterschaft auf jedem geteilten Teller, gute Gespräche an jedem Tisch.", ENG: "Craftsmanship in every shared plate and good conversation around every table." },
  "Öne çıkan lezzetler": { DE: "Ausgewählte Spezialitäten", ENG: "Featured flavours" },
  "Ustalık, özenle hazırlanır; sofrada zarif bir deneyime dönüşür.": { DE: "Meisterschaft wird mit Sorgfalt zubereitet und am Tisch zu einem besonderen Erlebnis.", ENG: "Craftsmanship is prepared with care and becomes an elegant dining experience." },
  "REZERVASYON · EVENTS · MANNHEIM": { DE: "RESERVIERUNG · EVENTS · MANNHEIM", ENG: "RESERVATIONS · EVENTS · MANNHEIM" },
  "Özel anlar, özenle hazırlanan sofralarda hatırlanır.": { DE: "Besondere Momente bleiben an liebevoll gedeckten Tafeln in Erinnerung.", ENG: "Special moments are remembered around thoughtfully prepared tables." },
  "Doğum günü, aile yemeği, iş buluşması ya da sakin bir akşam için Bedri Usta deneyiminizi şimdiden planlayın.": { DE: "Planen Sie Ihr Bedri-Usta-Erlebnis für einen Geburtstag, ein Familienessen, ein Geschäftstreffen oder einen entspannten Abend.", ENG: "Plan your Bedri Usta experience for a birthday, family dinner, business meeting or a relaxed evening." },
  "Bedri Usta Mannheim adresini kopyala": { DE: "Adresse von Bedri Usta Mannheim kopieren", ENG: "Copy Bedri Usta Mannheim address" },
  "Adresi kopyala": { DE: "Adresse kopieren", ENG: "Copy address" },
  "Kahvaltı": { DE: "Frühstück", ENG: "Breakfast" },
  "K1 1-4, 68159 Mannheim, Almanya": { DE: "K1 1-4, 68159 Mannheim, Deutschland", ENG: "K1 1-4, 68159 Mannheim, Germany" },
  "Bedri Usta Mannheim adresini haritada aç": { DE: "Bedri Usta Mannheim auf der Karte öffnen", ENG: "Open Bedri Usta Mannheim on the map" },
  "Haritada aç ↗": { DE: "Karte öffnen ↗", ENG: "Open map ↗" },
  "Adres kopyalandı.": { DE: "Adresse kopiert.", ENG: "Address copied." },
  "Planınızı seçin, gerisini biz hazırlayalım.": { DE: "Wählen Sie Ihren Plan – wir kümmern uns um den Rest.", ENG: "Choose your plan and let us take care of the rest." },
  "Rezervasyon sayfasını aç": { DE: "Reservierungsseite öffnen", ENG: "Open reservation page" },
  "REZERVASYON": { DE: "RESERVIERUNG", ENG: "RESERVATION" },
  "Masanızı ayırtın": { DE: "Tisch reservieren", ENG: "Reserve your table" },
  "Menüyü incele": { DE: "Speisekarte ansehen", ENG: "View the menu" },
  "Lezzetleri inceleyin": { DE: "Spezialitäten entdecken", ENG: "Explore our flavours" },
  "GÜNCEL MENÜ · MANNHEIM": { DE: "AKTUELLE SPEISEKARTE · MANNHEIM", ENG: "CURRENT MENU · MANNHEIM" },
  "Ustalıkla hazırlanır, birlikte paylaşılır.": { DE: "Mit Meisterschaft zubereitet, gemeinsam genossen.", ENG: "Crafted with mastery, made to be shared." },
  "Mezeden kebaba, taş fırından tatlıya; ürünler ve açık alerjen bilgileriyle tüm menü tek sayfada.": { DE: "Von Meze bis Kebab, aus dem Steinofen bis zum Dessert – die gesamte Speisekarte mit klaren Allergenangaben auf einer Seite.", ENG: "From meze to kebab, stone oven dishes to dessert—the full menu with clear allergen information on one page." },
  "ürün": { DE: "Produkte", ENG: "items" },
  "bölüm · alerjen bilgileri açıkça belirtilmiştir": { DE: "Kategorien · Allergene sind klar ausgewiesen", ENG: "sections · allergen information is clearly indicated" },
  "Menüde ara: Adana, humus, künefe...": { DE: "Speisekarte durchsuchen: Adana, Hummus, Künefe…", ENG: "Search the menu: Adana, hummus, künefe…" },
  "Menüde ara": { DE: "Speisekarte durchsuchen", ENG: "Search the menu" },
  "Aramayı temizle": { DE: "Suche löschen", ENG: "Clear search" },
  "ALERJEN PDF": { DE: "ALLERGEN-PDF", ENG: "ALLERGEN PDF" },
  "KOD REHBERİ": { DE: "CODE-ÜBERSICHT", ENG: "CODE GUIDE" },
  "Önceki menü kategorilerini göster": { DE: "Vorherige Menükategorien anzeigen", ENG: "Show previous menu categories" },
  "Sonraki menü kategorilerini göster": { DE: "Nächste Menükategorien anzeigen", ENG: "Show next menu categories" },
  "KONTROL GEREKLİ · Siparişten önce personelden reçete ve alerjen doğrulaması isteyiniz.": { DE: "PRÜFUNG ERFORDERLICH · Bitte lassen Sie Rezeptur und Allergene vor der Bestellung durch unser Team bestätigen.", ENG: "CHECK REQUIRED · Please ask our team to confirm the recipe and allergens before ordering." },
  "SONUÇ BULUNAMADI": { DE: "KEINE ERGEBNISSE", ENG: "NO RESULTS" },
  "Aramanıza uygun bir ürün yok.": { DE: "Kein Produkt entspricht Ihrer Suche.", ENG: "No item matches your search." },
  "Farklı bir ürün adı deneyin veya beslenme filtresini temizleyin.": { DE: "Versuchen Sie einen anderen Produktnamen oder setzen Sie den Ernährungsfilter zurück.", ENG: "Try another item name or clear the dietary filter." },
  "FİLTRELERİ TEMİZLE": { DE: "FILTER ZURÜCKSETZEN", ENG: "CLEAR FILTERS" },
  "ALERJEN & KATKI REHBERİ": { DE: "ALLERGEN- & ZUSATZSTOFFÜBERSICHT", ENG: "ALLERGEN & ADDITIVE GUIDE" },
  "Kodları bil, güvenle seç.": { DE: "Codes verstehen, sicher auswählen.", ENG: "Know the codes, choose with confidence." },
  "Kodlar güncel reçete ve hammadde kayıtlarına dayanır. Çapraz temas tamamen önlenemeyebilir; alerji veya intolerans durumunda siparişten önce ekibimizi bilgilendiriniz.": { DE: "Die Codes basieren auf aktuellen Rezeptur- und Rohstoffdaten. Kreuzkontakte können nicht vollständig ausgeschlossen werden; bitte informieren Sie unser Team vor der Bestellung über Allergien oder Unverträglichkeiten.", ENG: "Codes are based on current recipe and ingredient records. Cross-contact cannot be completely excluded; please inform our team about any allergy or intolerance before ordering." },
  "ALERJENLER · A—N": { DE: "ALLERGENE · A—N", ENG: "ALLERGENS · A—N" },
  "KATKI MADDELERİ · Z1—Z13": { DE: "ZUSATZSTOFFE · Z1—Z13", ENG: "ADDITIVES · Z1—Z13" },
  "VEJETARYEN": { DE: "VEGETARISCH", ENG: "VEGETARIAN" },
  "TÜMÜ": { DE: "ALLE", ENG: "ALL" },
  "Başlangıç ve Mezeler": { DE: "Vorspeisen & Meze", ENG: "Starters & Meze" },
  "Sofraya yayılan, paylaşmayı ve sohbeti uzatan sıcak-soğuk başlangıçlar.": { DE: "Warme und kalte Vorspeisen zum Teilen, die Gespräche am Tisch verlängern.", ENG: "Warm and cold starters made for sharing and lingering conversations." },
  "Ara Sıcaklar": { DE: "Warme Vorspeisen", ENG: "Warm Starters" },
  "Taş fırından, tavadan ve közden sofraya gelen sıcak başlangıçlar.": { DE: "Warme Vorspeisen aus Steinofen, Pfanne und vom Grill.", ENG: "Warm starters from the stone oven, pan and grill." },
  "Kebaplar": { DE: "Kebabs", ENG: "Kebabs" },
  "Zırh kıyma, seçkin baharatlar ve Bedri Usta’nın yarım asrı aşan ocakbaşı tecrübesi.": { DE: "Hackfleisch aus dem Zırh-Messer, ausgewählte Gewürze und mehr als ein halbes Jahrhundert Ocakbaşı-Erfahrung.", ENG: "Zırh-minced meat, selected spices and more than half a century of ocakbaşı experience." },
  "Etler": { DE: "Fleischgerichte", ENG: "Meat Dishes" },
  "Seçkin etler, ustalıkla hazırlanan şişler ve kararında dinlendirilmiş lezzetler.": { DE: "Ausgewählte Fleischstücke, meisterhaft zubereitete Spieße und sorgfältig gereifte Aromen.", ENG: "Selected cuts, expertly prepared skewers and carefully rested flavours." },
  "Fırın Tavalar": { DE: "Ofen- & Pfannengerichte", ENG: "Oven & Pan Dishes" },
  "Döküm tavada ve fırında hazırlanan paylaşmalık ana yemekler.": { DE: "Hauptgerichte zum Teilen, in der Gusspfanne und im Ofen zubereitet.", ENG: "Sharing mains prepared in cast-iron pans and the oven." },
  "Taş Fırınlar": { DE: "Aus dem Steinofen", ENG: "From the Stone Oven" },
  "İnce hamur, güçlü harç ve taş fırının çıtır dokusu.": { DE: "Dünner Teig, kräftiger Belag und die knusprige Textur des Steinofens.", ENG: "Thin dough, full-flavoured toppings and the crisp texture of the stone oven." },
  "Salatalar": { DE: "Salate", ENG: "Salads" },
  "Taze yeşillikler, nar ekşisi ve sofrayı dengeleyen ferah tabaklar.": { DE: "Frische Kräuter, Granatapfelsirup und leichte Teller, die den Tisch ausbalancieren.", ENG: "Fresh greens, pomegranate molasses and refreshing plates that balance the table." },
  "Çocuk Menüsü": { DE: "Kindermenü", ENG: "Kids’ Menu" },
  "Küçük misafirlerimiz için sevilen lezzetlerin dengeli porsiyonları.": { DE: "Ausgewogene Portionen beliebter Gerichte für unsere kleinen Gäste.", ENG: "Balanced portions of favourite dishes for our younger guests." },
  "Tatlılar": { DE: "Desserts", ENG: "Desserts" },
  "Sıcak, şerbetli ve dondurmalı klasiklerle zarif bir kapanış.": { DE: "Ein feiner Abschluss mit warmen, sirupartigen und eisgekühlten Klassikern.", ENG: "An elegant finish with warm, syrup-soaked and ice-cream classics." },
  "Meyveler": { DE: "Obst", ENG: "Fruit" },
  "Mevsime göre hazırlanan sade ve ferah meyve tabakları.": { DE: "Schlichte, erfrischende Obstteller der Saison.", ENG: "Simple, refreshing seasonal fruit plates." },
  "Soğuk İçecekler": { DE: "Kalte Getränke", ENG: "Cold Drinks" },
  "Sofraya eşlik eden klasik soğuk içecekler, ayran ve şalgam.": { DE: "Klassische Kaltgetränke, Ayran und Şalgam als Begleitung zum Essen.", ENG: "Classic cold drinks, ayran and şalgam to accompany your meal." },
  "KÖKLERDEN DÜNYAYA": { DE: "VON DEN WURZELN IN DIE WELT", ENG: "FROM ROOTS TO THE WORLD" },
  "Bir ömür, yarım asrı aşan ustalık, 20’yi aşkın şube.": { DE: "Ein Lebenswerk, über ein halbes Jahrhundert Meisterschaft, mehr als 20 Standorte.", ENG: "A lifetime, over half a century of mastery and more than 20 locations." },
  "Bedri Usta’nın hikâyesi Mardin’de başladı; Adana’da mesleğe dönüştü, İstanbul’da markaya dönüştü ve Mannheim’da yeni bir sofrayla devam ediyor.": { DE: "Die Geschichte von Bedri Usta begann in Mardin, wurde in Adana zum Handwerk, in Istanbul zur Marke und setzt sich heute an einer neuen Tafel in Mannheim fort.", ENG: "Bedri Usta’s story began in Mardin, became a craft in Adana, a brand in Istanbul and now continues around a new table in Mannheim." },
  "USTALIĞIN ROTASI": { DE: "DER WEG DER MEISTERSCHAFT", ENG: "THE JOURNEY OF MASTERY" },
  "Mardin’den Mannheim’a uzanan gerçek bir hayat hikâyesi.": { DE: "Eine wahre Lebensgeschichte von Mardin bis Mannheim.", ENG: "A true life story stretching from Mardin to Mannheim." },
  "USTALIKLA PİŞER HAYAT": { DE: "DAS LEBEN REIFT MIT MEISTERSCHAFT", ENG: "LIFE IS CRAFTED WITH MASTERY" },
  "BEDRİ USTA’NIN FELSEFESİ": { DE: "BEDRİ USTAS PHILOSOPHIE", ENG: "BEDRİ USTA’S PHILOSOPHY" },
  "Mesele yalnızca kebap değil; emeği, disiplini ve misafirliği birlikte yaşatmak.": { DE: "Es geht nicht nur um Kebab, sondern darum, Handwerk, Disziplin und Gastfreundschaft gemeinsam zu leben.", ENG: "It is not only about kebab; it is about keeping hard work, discipline and hospitality alive together." },
  "Çocuk yaşta başlayan meslek yolculuğu, yıllar içinde bir ustalık kültürüne dönüştü. Bedri Usta için iyi bir sofra; doğru ürünün, ustalığın ve samimi misafirliğin aynı anda buluşmasıdır.": { DE: "Der berufliche Weg, der schon in der Kindheit begann, entwickelte sich über die Jahre zu einer Kultur der Meisterschaft. Für Bedri Usta entsteht eine gute Tafel dort, wo hochwertige Zutaten, Können und aufrichtige Gastfreundschaft zusammenkommen.", ENG: "A professional journey that began in childhood grew into a culture of mastery. For Bedri Usta, a great table is where the right ingredients, craftsmanship and genuine hospitality meet." },
  "Marka büyüse de ocağın başındaki dikkat değişmedi. İmza lezzetler, kuşaktan kuşağa aktarılan çalışma disiplini ve sofraya duyulan saygı, bugün Bedri Usta adının temelini oluşturuyor.": { DE: "Auch mit dem Wachstum der Marke blieb die Sorgfalt am Ocak unverändert. Charakteristische Gerichte, über Generationen weitergegebene Arbeitsdisziplin und Respekt vor der Tafel bilden bis heute das Fundament des Namens Bedri Usta.", ENG: "Even as the brand grew, the care at the ocak remained unchanged. Signature flavours, discipline passed from generation to generation and respect for the table form the foundation of the Bedri Usta name today." },
  "MARDİN’DEN MANNHEIM’A": { DE: "VON MARDIN NACH MANNHEIM", ENG: "FROM MARDIN TO MANNHEIM" },
  "Kökler Mardin’de. Sofra Mannheim’da.": { DE: "Die Wurzeln liegen in Mardin. Die Tafel steht in Mannheim.", ENG: "Roots in Mardin. A table in Mannheim." },
  "Bedri Usta’nın yarım asrı aşan deneyimi, Mannheim’da Adana ocakbaşı kültürüyle buluşuyor. Aynı özen, aynı ustalık, yeni bir şehir.": { DE: "Mehr als ein halbes Jahrhundert Erfahrung von Bedri Usta trifft in Mannheim auf die Adana-Ocakbaşı-Kultur. Die gleiche Sorgfalt, die gleiche Meisterschaft, eine neue Stadt.", ENG: "More than half a century of Bedri Usta experience meets Adana ocakbaşı culture in Mannheim. The same care, the same mastery, a new city." },
  "Lezzetin arkasında tavizsiz bir standart var.": { DE: "Hinter dem Geschmack steht ein kompromissloser Standard.", ENG: "Behind every flavour is an uncompromising standard." },
  "Misafirlerimize sunduğumuz her üründe gıda güvenliğini, hijyeni, eğitimi ve sürekli gelişimi aynı bütünün parçaları olarak görüyoruz.": { DE: "Bei jedem Produkt für unsere Gäste betrachten wir Lebensmittelsicherheit, Hygiene, Schulung und kontinuierliche Verbesserung als Teile eines Ganzen.", ENG: "In every product we serve, we see food safety, hygiene, training and continuous improvement as parts of one whole." },
  "HER AŞAMADA": { DE: "IN JEDEM SCHRITT", ENG: "AT EVERY STEP" },
  "ÖZEN": { DE: "SORGFALT", ENG: "CARE" },
  "ENTEGRE YAKLAŞIM": { DE: "INTEGRIERTER ANSATZ", ENG: "INTEGRATED APPROACH" },
  "Güven, mutfakta başlayan bir disiplindir.": { DE: "Vertrauen ist eine Disziplin, die in der Küche beginnt.", ENG: "Trust is a discipline that begins in the kitchen." },
  "ÇALIŞMA PRENSİPLERİMİZ": { DE: "UNSERE ARBEITSPRINZIPIEN", ENG: "OUR WORKING PRINCIPLES" },
  "ORTAK SORUMLULUK": { DE: "GEMEINSAME VERANTWORTUNG", ENG: "SHARED RESPONSIBILITY" },
  "Üretim alanlarında kurallar herkes için geçerlidir.": { DE: "In Produktionsbereichen gelten die Regeln für alle.", ENG: "The rules apply to everyone in production areas." },
  "Paylaşım, kullanıcı ve dil seçenekleri": { DE: "Teilen, Benachrichtigungen und Sprachauswahl", ENG: "Sharing, notifications and language options" },
  "Bildirim merkezini aç": { DE: "Benachrichtigungscenter öffnen", ENG: "Open notification centre" },
  "Dil seçimi": { DE: "Sprachauswahl", ENG: "Language selection" },
  "Dil seçimi, seçili dil": { DE: "Sprachauswahl, ausgewählte Sprache", ENG: "Language selection, selected language" },
  "Dil tercihiniz bu cihazda saklanır.": { DE: "Ihre Sprachauswahl wird auf diesem Gerät gespeichert.", ENG: "Your language choice is saved on this device." },
  "Sayfayı paylaş": { DE: "Seite teilen", ENG: "Share page" },
  "Kurumsal": { DE: "Unternehmen", ENG: "Company" },
  "HIZLI ERİŞİM": { DE: "SCHNELLZUGRIFF", ENG: "QUICK ACCESS" },
  "Sosyal medyada takip edin, bize doğrudan ulaşın.": { DE: "Folgen Sie uns in den sozialen Medien und erreichen Sie uns direkt.", ENG: "Follow us on social media and contact us directly." },
  "SOSYAL MEDYA": { DE: "SOCIAL MEDIA", ENG: "SOCIAL MEDIA" },
  "Takip Et · Beğen · Yorum Yap · Paylaş": { DE: "Folgen · Liken · Kommentieren · Teilen", ENG: "Follow · Like · Comment · Share" },
  "İLETİŞİM": { DE: "KONTAKT", ENG: "CONTACT" },
  "Sorularınız ve talepleriniz için doğrudan bağlantılar.": { DE: "Direkte Kontaktmöglichkeiten für Ihre Fragen und Wünsche.", ENG: "Direct ways to reach us with your questions and requests." },
  "Hızlı erişim": { DE: "Schnellzugriff", ENG: "Quick access" },
  "Yol Tarifi": { DE: "Route", ENG: "Directions" },
  "Sayfanın başına dön": { DE: "Zum Seitenanfang", ENG: "Back to top" },
  "YUKARI": { DE: "OBEN", ENG: "TOP" },
  "MASANIZI AYIRTIN": { DE: "TISCH RESERVIEREN", ENG: "RESERVE YOUR TABLE" },
  "LEZZETLERİ KEŞFEDİN": { DE: "SPEZIALITÄTEN ENTDECKEN", ENG: "DISCOVER THE FLAVOURS" },
  "Menüyü İncele": { DE: "Speisekarte ansehen", ENG: "View Menu" },
  "Ziyaret": { DE: "Besuch", ENG: "Visit" },
  "Keşfet": { DE: "Entdecken", ENG: "Explore" },
  "Yasal": { DE: "Rechtliches", ENG: "Legal" },
  "© 2026 Bedri Usta. Tüm hakları saklıdır.": { DE: "© 2026 Bedri Usta. Alle Rechte vorbehalten.", ENG: "© 2026 Bedri Usta. All rights reserved." },
  "Pazar — Perşembe": { DE: "Sonntag — Donnerstag", ENG: "Sunday — Thursday" },
  "Cuma — Cumartesi": { DE: "Freitag — Samstag", ENG: "Friday — Saturday" },
  "Zırh kıyma, özenle seçilen baharatlar ve yılların ustalığıyla hazırlanan Bedri Usta klasiği.": { DE: "Ein Bedri-Usta-Klassiker aus Zırh-Hackfleisch, ausgewählten Gewürzen und jahrelanger Meisterschaft.", ENG: "A Bedri Usta classic made with zırh-minced meat, selected spices and years of mastery." },
  "Sofrayı yavaşlatan, sohbeti uzatan kremamsı ve ferah tabaklar.": { DE: "Cremige und frische Teller, die zum Verweilen und Genießen einladen.", ENG: "Creamy, refreshing plates that invite you to slow down and stay at the table." },
  "Kat kat dizilen et yapraklarının ustalıkla pişirilip ince kesilmesiyle hazırlanan güçlü bir klasik.": { DE: "Ein kräftiger Klassiker aus geschichteten Fleischscheiben, meisterhaft gegart und fein geschnitten.", ENG: "A bold classic of layered meat, expertly cooked and finely sliced." },
  "İnce hamur, taze yeşillik ve sıcak fırından çıkan çıtır bir klasik.": { DE: "Dünner Teig, frische Kräuter und ein knuspriger Klassiker direkt aus dem Ofen.", ENG: "Thin dough, fresh greens and a crisp classic straight from the oven." },
  "Fırından gelen sıcaklık, dengeli baharat ve paylaşmalık bereketli sunum.": { DE: "Ofenwärme, ausgewogene Gewürze und eine großzügige Präsentation zum Teilen.", ENG: "Oven warmth, balanced spices and a generous presentation made for sharing." },
  "Geleneksel tatlar, çay ve özenle hazırlanan seçeneklerle güne keyifli bir başlangıç.": { DE: "Ein angenehmer Start in den Tag mit traditionellen Aromen, Tee und sorgfältig ausgewählten Spezialitäten.", ENG: "A delightful start to the day with traditional flavours, tea and carefully prepared choices." },
  "Tatlı": { DE: "Dessert", ENG: "Dessert" },
  "Yemeğin sonunda dengeli, sıcak ve zarif bir kapanış hissi.": { DE: "Ein ausgewogener, warmer und eleganter Abschluss des Essens.", ENG: "A balanced, warm and elegant finish to the meal." },
  "Kahveden pastaya, sıcak ve soğuk içeceklerle Mannheim’ın yeni buluşma noktası.": { DE: "Von Kaffee bis Kuchen, mit warmen und kalten Getränken – Mannheims neuer Treffpunkt.", ENG: "From coffee to cake, with hot and cold drinks—Mannheim’s new meeting place." },
  "Taze yeşillikler, özenle hazırlanan salatalar ve zengin vegan–vejetaryen seçeneklerle sofraya ferah bir denge.": { DE: "Frische Kräuter, sorgfältig zubereitete Salate und eine vielfältige vegane und vegetarische Auswahl bringen Leichtigkeit auf den Tisch.", ENG: "Fresh greens, carefully prepared salads and a rich vegan and vegetarian selection bring refreshing balance to the table." },
  "Usta İşi": { DE: "Meisterhaft", ENG: "Master Crafted" },
  "Her tabak aynı özenle hazırlanır: sade, net ve hafızada kalıcı.": { DE: "Jeder Teller entsteht mit derselben Sorgfalt: klar, authentisch und unvergesslich.", ENG: "Every plate is prepared with the same care: simple, clear and memorable." },
  "Lezzet Dengesi": { DE: "Geschmack in Balance", ENG: "Balanced Flavour" },
  "Tuz, acı ve doku aynı sofrada kusursuz bir uyum yakalar.": { DE: "Salz, Schärfe und Textur finden am Tisch ihre perfekte Balance.", ENG: "Salt, spice and texture find perfect harmony at the table." },
  "Misafirlik": { DE: "Gastfreundschaft", ENG: "Hospitality" },
  "Sıcak karşılama, özenli servis ve sofrada kendini özel hissettiren bir restoran deneyimi.": { DE: "Herzlicher Empfang, aufmerksamer Service und ein Restauranterlebnis, bei dem Sie sich besonders fühlen.", ENG: "A warm welcome, attentive service and a dining experience that makes you feel special." },
  "Altıyol köyünde başlayan; yokluğu, emeği ve aileyi merkeze alan ilk bölüm.": { DE: "Der erste Abschnitt beginnt im Dorf Altıyol und stellt Entbehrung, Arbeit und Familie in den Mittelpunkt.", ENG: "The first chapter begins in Altıyol, shaped by hardship, hard work and family." },
  "Yedi yaşında meslekle tanıştı. Etin, baharatın ve sabrın dilini burada öğrendi.": { DE: "Mit sieben Jahren lernte er das Handwerk kennen. Hier lernte er die Sprache von Fleisch, Gewürzen und Geduld.", ENG: "He entered the profession at seven and learned the language of meat, spices and patience." },
  "Bir marka doğuyor": { DE: "Eine Marke entsteht", ENG: "A brand is born" },
  "Sokak arasındaki tezgahtan, kendi adıyla anılan güçlü bir restoran kültürüne.": { DE: "Vom kleinen Stand in einer Seitenstraße zu einer starken Restaurantkultur unter seinem eigenen Namen.", ENG: "From a side-street counter to a strong restaurant culture bearing his own name." },
  "Bugün": { DE: "Heute", ENG: "Today" },
  "Gerçek Türk kebabı ve sıcak misafirlik, şimdi Mannheim şehir merkezinde.": { DE: "Echter türkischer Kebab und herzliche Gastfreundschaft – jetzt im Herzen Mannheims.", ENG: "Authentic Turkish kebab and warm hospitality, now in central Mannheim." },
  "Entegre Politika": { DE: "Integrierte Richtlinie", ENG: "Integrated Policy" },
  "Hijyen Politikası": { DE: "Hygienerichtlinie", ENG: "Hygiene Policy" },
  "Fiziksel Görünüş ve Takı": { DE: "Erscheinungsbild und Schmuck", ENG: "Appearance and Jewellery" },
  "Üretim Alanlarına Giriş": { DE: "Zutritt zu Produktionsbereichen", ENG: "Access to Production Areas" },
  "Seçilmedi": { DE: "Nicht ausgewählt", ENG: "Not selected" },
  "Hakkımızda | Bedri Usta Mannheim": { DE: "Über uns | Bedri Usta Mannheim", ENG: "About Us | Bedri Usta Mannheim" },
  "Politikalarımız | Bedri Usta Mannheim": { DE: "Unsere Richtlinien | Bedri Usta Mannheim", ENG: "Our Policies | Bedri Usta Mannheim" }
  ,"Menü | Bedri Usta Mannheim": { DE: "Speisekarte | Bedri Usta Mannheim", ENG: "Menu | Bedri Usta Mannheim" }
  ,"Rezervasyon | Bedri Usta Mannheim": { DE: "Reservierung | Bedri Usta Mannheim", ENG: "Reservation | Bedri Usta Mannheim" }
  ,"İletişim | Bedri Usta Mannheim": { DE: "Kontakt | Bedri Usta Mannheim", ENG: "Contact | Bedri Usta Mannheim" }
  ,"Bedri Usta Mannheim ile iletişime geç; adres, çalışma saatleri, telefon, e-posta ve sosyal medya kanallarını tek sayfada bul.": { DE: "Kontaktieren Sie Bedri Usta Mannheim: Adresse, Öffnungszeiten, Telefon, E-Mail und Social-Media-Kanäle finden Sie auf einer Seite.", ENG: "Get in touch with Bedri Usta Mannheim: find our address, opening hours, phone, email and social media channels on one page." }
  ,"Bedri Usta Mannheim menüsünü, kebapları, taş fırın lezzetlerini, mezeleri ve tatlıları keşfet.": { DE: "Entdecken Sie die Speisekarte von Bedri Usta Mannheim mit Kebabs, Steinofenspezialitäten, Meze und Desserts.", ENG: "Explore the Bedri Usta Mannheim menu, including kebabs, stone-oven specialities, meze and desserts." }
  ,"Bedri Usta’nın ustalık yolculuğunu ve Mannheim’daki Türk misafirperverliği anlayışını keşfet.": { DE: "Entdecken Sie Bedri Ustas Weg der Meisterschaft und seine türkische Gastfreundschaft in Mannheim.", ENG: "Discover Bedri Usta’s journey of mastery and his approach to Turkish hospitality in Mannheim." }
  ,"Bedri Usta Mannheim kalite, hijyen, gıda güvenliği ve veri koruma politikalarını incele.": { DE: "Lesen Sie die Richtlinien von Bedri Usta Mannheim zu Qualität, Hygiene, Lebensmittelsicherheit und Datenschutz.", ENG: "Read Bedri Usta Mannheim’s quality, hygiene, food safety and data protection policies." }
  ,"Bedri Usta Mannheim web sitesi, PWA, bildirimler, rezervasyon, iletişim ve iş başvuruları için veri koruma bilgilendirmesi.": { DE: "Datenschutzhinweise von Bedri Usta Mannheim für Website, PWA, Benachrichtigungen, Reservierungen, Kontakt und Bewerbungen.", ENG: "Bedri Usta Mannheim privacy information for the website, PWA, notifications, reservations, contact and job applications." }
  ,"Bedri Usta Mannheim için kişi sayını, tarihini ve saatini seç; rezervasyonunu veya grup talebini güvenli biçimde hazırla.": { DE: "Wählen Sie Personenzahl, Datum und Uhrzeit und bereiten Sie Ihre Reservierung oder Gruppenanfrage bei Bedri Usta Mannheim sicher vor.", ENG: "Choose your party size, date and time and securely prepare your Bedri Usta Mannheim reservation or group request." }
  ,"Bedri Usta Mannheim’da ustalıkla hazırlanan kebapları, özenli servisi ve sıcak Türk misafirperverliğini keşfet.": { DE: "Entdecken Sie meisterhaft zubereitete Kebabs, aufmerksamen Service und herzliche türkische Gastfreundschaft bei Bedri Usta Mannheim.", ENG: "Discover expertly prepared kebabs, attentive service and warm Turkish hospitality at Bedri Usta Mannheim." }
  ,"Alerjen PDF dosyasını aç": { DE: "Allergen-PDF öffnen", ENG: "Open allergen PDF" }
  ,"Alerjen kodlarını açıkla": { DE: "Allergencodes erklären", ENG: "Explain allergen codes" }
  ,"Gıda güvenliği kültürünün tüm ekip tarafından benimsenmesini sağlıyor; çalışanlarımızı düzenli eğitimlerle destekliyoruz. Kaliteli ve hijyenik ürün sunarken yasal gerekliliklere uymayı, tüketici ve tedarikçilerle doğru bilgi paylaşmayı ve sistemimizi sürekli geliştirmeyi taahhüt ediyoruz.": { DE: "Wir verankern eine Kultur der Lebensmittelsicherheit im gesamten Team und unterstützen unsere Mitarbeitenden durch regelmäßige Schulungen. Wir verpflichten uns zu hochwertigen, hygienischen Produkten, zur Einhaltung gesetzlicher Anforderungen, transparenter Information und kontinuierlicher Verbesserung.", ENG: "We embed a culture of food safety throughout the team and support our people with regular training. We are committed to quality, hygiene, legal compliance, transparent information and continuous improvement." }
  ,"Üretim ve depolama alanlarında sigara içilmez, yiyecek veya içecek tüketilmez. Kurallar görünür uyarılarla desteklenir; çalışanların, ziyaretçilerin ve hizmet sağlayıcıların bu standartlara uyması sağlanır.": { DE: "In Produktions- und Lagerbereichen sind Rauchen sowie der Verzehr von Speisen und Getränken untersagt. Sichtbare Hinweise unterstützen die Regeln; Mitarbeitende, Besucher und Dienstleister müssen diese Standards einhalten.", ENG: "Smoking and consuming food or drink are prohibited in production and storage areas. Clear notices reinforce the rules, and employees, visitors and service providers must follow these standards." }
  ,"Bedri Usta Mannheim'ın sosyal kanallarını keşfedin; sorularınız ve talepleriniz için bize doğrudan ulaşın.": { DE: "Entdecken Sie die Social-Media-Kanäle von Bedri Usta Mannheim und kontaktieren Sie uns direkt mit Ihren Fragen und Wünschen.", ENG: "Discover Bedri Usta Mannheim’s social channels and contact us directly with your questions and requests." }
  ,"Sosyal medya bağlantıları": { DE: "Social-Media-Links", ENG: "Social media links" }
  ,"İletişim bağlantıları": { DE: "Kontaktlinks", ENG: "Contact links" }
  ,"GIDA GÜVENLİĞİ": { DE: "LEBENSMITTELSICHERHEIT", ENG: "FOOD SAFETY" }
  ,"HİJYEN": { DE: "HYGIENE", ENG: "HYGIENE" }
  ,"SÜREKLİ GELİŞİM": { DE: "KONTINUIERLICHE VERBESSERUNG", ENG: "CONTINUOUS IMPROVEMENT" }
  ,"Teknolojik gelişmeleri takip eder; ekiplerimizin bilgi ve becerilerini düzenli eğitimlerle güçlendiririz. Güncel ürün bilgisini şeffaf biçimde paylaşır, üretimin her aşamasında kaliteyi ve sürekli iyileştirmeyi esas alırız.": { DE: "Wir verfolgen technologische Entwicklungen und stärken Wissen und Fähigkeiten unserer Teams durch regelmäßige Schulungen. Aktuelle Produktinformationen kommunizieren wir transparent; Qualität und kontinuierliche Verbesserung bestimmen jeden Produktionsschritt.", ENG: "We follow technological developments and strengthen our teams through regular training. We share current product information transparently and make quality and continuous improvement central to every production stage." }
  ,"Ürünlerimizin hazırlanmasından sunumuna kadar fiziksel, kimyasal ve biyolojik gıda güvenliği risklerini belirler, kontrol altında tutar ve tüm süreçleri sağlık ile hijyen kurallarına uygun yürütürüz.": { DE: "Von der Zubereitung bis zur Ausgabe identifizieren und kontrollieren wir physikalische, chemische und biologische Risiken und führen alle Prozesse nach Gesundheits- und Hygienestandards durch.", ENG: "From preparation to presentation, we identify and control physical, chemical and biological food-safety risks and conduct every process in line with health and hygiene standards." }
  ,"Üretim alanlarında temiz koruyucu önlük ve saçı tamamen kapatan bone kullanılır. Gıda güvenliğini korumak amacıyla üretim sırasında takı kullanımına izin verilmez.": { DE: "In Produktionsbereichen werden saubere Schutzkleidung und eine vollständige Haarbedeckung getragen. Schmuck ist während der Produktion zum Schutz der Lebensmittelsicherheit nicht erlaubt.", ENG: "Clean protective clothing and full hair covering are worn in production areas. Jewellery is not permitted during production in order to protect food safety." }
  ,"Ziyaretçi ve tedarikçiler üretim alanlarına yalnızca gerekli koruyucu ekipmanla, belirlenen hijyen adımlarını tamamlayarak ve ziyaretçi kontrol sürecine tabi olarak girebilir.": { DE: "Besucher und Lieferanten dürfen Produktionsbereiche nur mit vorgeschriebener Schutzausrüstung, nach Abschluss der Hygieneschritte und im Rahmen der Besucherkontrolle betreten.", ENG: "Visitors and suppliers may enter production areas only with required protective equipment, after completing hygiene steps and subject to visitor controls." }
};

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function translateSiteText(value: string, language: SiteLanguage): string {
  if (language === "TR") return value;

  const normalized = normalize(value);
  const direct = translations[normalized] ?? formTranslations[normalized] ?? privacyTranslations[normalized];
  if (direct) return direct[language];

  const productCount = normalized.match(/^\(?([0-9]+)\s+ÜRÜN\)?$/i);
  if (productCount) {
    return language === "DE" ? `(${productCount[1]} PRODUKTE)` : `(${productCount[1]} ITEMS)`;
  }

  return value;
}

// For dynamic strings (a name, a count, an email address) that still need a
// translated shell. `key` carries `{placeholder}` markers matched against
// `vars`; only the shell is looked up in the dictionaries above, so the
// interpolated values pass through unchanged in every language.
export function translateSiteTextTemplate(
  key: string,
  language: SiteLanguage,
  vars: Record<string, string | number>
): string {
  let text = translateSiteText(key, language);
  for (const [name, value] of Object.entries(vars)) {
    text = text.split(`{${name}}`).join(String(value));
  }
  return text;
}
