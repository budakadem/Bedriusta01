import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";

const brandImage = "/images/bedri-usta-brand.png";
const logoImage = "/images/bedriusta-logo.png";
const portraitImage = "/images/bedri-portrait.png";
const heroV3Image = "/images/hero-v3.png";
const heroVideo = "/videos/hero-deneme02.mp4";
const editorialHeroImage = "/images/mannheim-editorial-hero-v2.webp";
const footerTransparentLogoImage = "/images/bedri-footer-logo-cutout.png";
const instagramIconImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5.2" stroke="#ffffff" stroke-width="2.2"/><circle cx="12" cy="12" r="4.2" stroke="#ffffff" stroke-width="2.2"/><circle cx="17.3" cy="6.7" r="1.25" fill="#ffffff"/></svg>`
)}`;
const youtubeIconImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" fill="none"><rect x="1.5" y="1.5" width="25" height="17" rx="5" stroke="#ffffff" stroke-width="2.4"/><path d="M12 6.2v7.6l6.5-3.8L12 6.2Z" fill="#ffffff"/></svg>`
)}`;
const languageGlobeIcon = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M3.8 12h16.4M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5M12 3.5C9.8 5.8 8.7 8.6 8.7 12s1.1 6.2 3.3 8.5"/></svg>`
)}`;
const loginUserIcon = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#dfbf78" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.3"/><circle cx="12" cy="8.8" r="3"/><path d="M6.7 18.4c.7-3 2.6-4.5 5.3-4.5s4.6 1.5 5.3 4.5"/></svg>`
)}`;
const quickActionIcon = (content: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#dfbf78" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`
  )}`;
const quickActionIcons = {
  menu: quickActionIcon(
    `<path d="M3 5.5c3.4-.8 6.3-.2 9 2.1v12c-2.7-2.3-5.6-2.9-9-2.1v-12Z"/><path d="M21 5.5c-3.4-.8-6.3-.2-9 2.1v12c2.7-2.3 5.6-2.9 9-2.1v-12Z"/><path d="M5 3.7c2.8-.3 5.1.4 7 2.2 1.9-1.8 4.2-2.5 7-2.2"/>`
  ),
  reservation: quickActionIcon(
    `<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M7 3v4M17 3v4M3.5 9.5h17M7.5 13h2M12 13h2M16.5 13h.1M7.5 16.5h2M12 16.5h2"/>`
  ),
  instagram: quickActionIcon(
    `<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.7" r=".8" fill="#dfbf78" stroke="none"/>`
  ),
  directions: quickActionIcon(
    `<path d="M12 17.5s5-4.5 5-9.6a5 5 0 1 0-10 0c0 5.1 5 9.6 5 9.6Z"/><circle cx="12" cy="8" r="1.8"/><ellipse cx="12" cy="20" rx="6.2" ry="1.8"/>`
  ),
  email: quickActionIcon(`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>`),
  youtube: quickActionIcon(
    `<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3V9Z"/>`
  ),
  contact: quickActionIcon(
    `<path d="M6 3.5h9l3 3V20H6V3.5Z"/><path d="M14.5 3.5V7H18M9 11h6M9 14.5h6M9 18h4"/>`
  ),
  phone: quickActionIcon(
    `<path d="M7.2 3.5 10 7.2 8.4 9.6c1.2 2.7 3.3 4.8 6 6l2.4-1.6 3.7 2.8-.8 3c-.2.8-1 1.3-1.8 1.2C9.7 20 4 14.3 3 6.1c-.1-.8.4-1.6 1.2-1.8l3-.8Z"/>`
  ),
  whatsapp: quickActionIcon(
    `<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z"/><path d="M9 8.2c.5 3.2 2.3 5 5.5 5.6"/>`
  ),
  facebook: quickActionIcon(`<path d="M14.5 21v-8h3l.5-3h-3.5V8.2c0-.9.3-1.7 1.8-1.7H18V3.8c-.5-.1-1.5-.3-2.7-.3-2.7 0-4.3 1.6-4.3 4.5v2H8v3h3v8"/>`),
  pinterest: quickActionIcon(
    `<circle cx="12" cy="12" r="8.5"/><path d="M9.7 19.8 12 10.2"/><path d="M10.1 14.8c-1.2-.8-1.8-2-1.8-3.6 0-2.5 1.8-4.5 4.4-4.5 2.3 0 3.8 1.6 3.8 3.8 0 2.8-1.2 4.9-3.1 4.9-1 0-1.7-.8-1.5-1.8"/>`
  ),
  tiktok: quickActionIcon(
    `<path d="M14 4v10.2a4.1 4.1 0 1 1-3.4-4"/><path d="M14 4c.5 2.6 2.1 4 4.6 4.2"/>`
  ),
  twitter: quickActionIcon(`<path d="m5 4 14 16M19 4 5 20"/>`)
} as const;
type QuickActionIconName = keyof typeof quickActionIcons;
const menuKebabImage = "https://commons.wikimedia.org/wiki/Special:FilePath/Adana_kebap_2024.jpg?width=900";
const menuLahmacunImage = "https://commons.wikimedia.org/wiki/Special:FilePath/Ac%C4%B1l%C4%B1_Lahmacun.jpg?width=900";
const menuMezeImage = "https://commons.wikimedia.org/wiki/Special:FilePath/Turkish_meze_plate.jpg?width=900";
const menuDessertImage = "https://commons.wikimedia.org/wiki/Special:FilePath/F%C4%B1st%C4%B1kl%C4%B1_Baklava.jpg?width=900";
const restaurantAddress = "K1 1-4, 68159 Mannheim, Almanya";
const encodedRestaurantAddress = encodeURIComponent(restaurantAddress);
const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodedRestaurantAddress}&travelmode=driving`;

const navItems = [
  { label: "Anasayfa", href: "/" },
  {
    label: "Kurumsal",
    items: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Jobs", href: "#jobs" },
      { label: "Politikalarımız", href: "/politikalarimiz" }
    ]
  },
  { label: "İletişim", href: "#contact" },
  { label: "Menü", href: "#menu" },
  { label: "Rezervasyon", href: "tel:+902160000000" }
];

const mobileFooterNavItems = [
  { label: "FAQ", href: "#faq" },
  { label: "Impressum", href: "#policies" },
  { label: "Datenschutz", href: "#policies" },
  { label: "Cookie-Einstellungen", href: "#policies" },
  { label: "Instagram", href: "https://www.instagram.com/bedriustaa" },
  { label: "YouTube", href: "https://www.youtube.com/c/BedriUsta" }
];

const menuItems = [
  {
    title: "Adana Kebap",
    text: "Zirh kiyma, isli biber, dengeli aci ve odun atesinin kararinda dokunusu.",
    image: menuKebabImage
  },
  {
    title: "Lahmacun",
    text: "Ince hamur, taze yesillik ve sicak firindan cikan citir bir klasik.",
    image: menuLahmacunImage
  },
  {
    title: "Mezeler",
    text: "Sofrayi yavaslatan, sohbeti uzatan kremamsi ve ferah tabaklar.",
    image: menuMezeImage
  },
  {
    title: "Tatlilar",
    text: "Yemegin sonunda hafif, sicak ve zarif bir kapanis hissi.",
    image: menuDessertImage
  }
];

const menuCategories = [
  {
    key: "mezeler",
    label: "Başlangıç ve Mezeler",
    note: "Soğuk mezeler, Ege tabakları ve Bedri Usta imza lezzetleri.",
    items: [
      ["Acılı Ezme", "H", "6,90 €"],
      ["Atom", "G, H", "8,90 €"],
      ["Bedri Usta Özel Meze", "C, G, J, K", "9,90 €"],
      ["Çerkez Tavuğu", "A, G, H", "8,90 €"],
      ["Çiğ Köfte", "-", "10,90 €"],
      ["Girit Ezmesi", "G, H", "8,90 €"],
      ["Humus (Soğuk)", "G, K", "7,90 €"],
      ["Muhammara", "A, H, K", "8,90 €"],
      ["Patlıcan Salatası", "C", "7,90 €"],
      ["Vişneli Yaprak Sarma", "-", "8,50 €"]
    ]
  },
  {
    key: "ara-sicak",
    label: "Ara Sıcaklar",
    note: "Fırından, tavadan ve ocaktan sıcak başlangıçlar.",
    items: [
      ["Fındık Lahmacun (Adet)", "A", "3,90 €"],
      ["Hellim Izgara", "G", "8,90 €"],
      ["Humus Pastırmalı", "G, K", "10,90 €"],
      ["İçli Köfte (Haşlama)", "A, C, H", "9,90 €"],
      ["İçli Köfte (Kızartma)", "A, C, H", "9,90 €"],
      ["Kaşarlı Mantar (Adet)", "G", "8,50 €"],
      ["Mercimek Çorbası", "A, G", "7,90 €"],
      ["Peynir Saganaki", "G, K", "13,90 €"]
    ]
  },
  {
    key: "kebaplar",
    label: "Kebaplar",
    note: "Mannheim’da Adana kebap, ocakbaşı ve köz lezzeti.",
    items: [
      ["Adana (Acılı)", "A", "21,90 €"],
      ["Adana (Acısız)", "A", "21,90 €"],
      ["Altı Ezmeli Kebap", "A", "23,90 €"],
      ["Beyti", "A, G", "22,90 €"],
      ["Beyti Sarma", "A, G", "23,90 €"],
      ["Elinazik (Etten)", "A, C, G", "26,90 €"],
      ["Karışık Kebap", "A", "38,90 €"],
      ["Yoğurtlu Kebap", "A, G", "23,90 €"]
    ]
  },
  {
    key: "etler",
    label: "Etler ve Izgaralar",
    note: "Şiş, pirzola, lokum ve karışık et tabakları.",
    items: [
      ["Bedri Usta Şiş", "A", "41,90 €"],
      ["Ciğer Şiş", "A", "21,90 €"],
      ["Çöp Şiş", "A", "23,90 €"],
      ["Kaburga", "A", "27,90 €"],
      ["Karışık Et Tabağı", "A", "46,90 €"],
      ["Kuzu Pirzola", "A", "32,90 €"],
      ["Lokum", "A, G", "45,90 €"],
      ["Tavuk Kanat", "A", "20,90 €"]
    ]
  },
  {
    key: "tas-firin",
    label: "Taş Fırın",
    note: "Lahmacun, pide ve sıcak hamur işleri.",
    items: [
      ["Adana Usulü Lahmacun (5 Adet)", "A", "14,90 €"],
      ["Adana Usulü Pide (5 Adet)", "A, C, G", "14,90 €"],
      ["Antep Lahmacun (Acılı)", "A", "10,90 €"],
      ["Antep Lahmacun (Acısız)", "A", "10,90 €"],
      ["Karışık Pide", "A, C, G", "16,90 €"],
      ["Kaşarlı Pide", "A, C, G", "12,90 €"],
      ["Kuşbaşı Kaşarlı Pide", "A, C, G", "16,90 €"],
      ["Sembusek", "A", "12,90 €"]
    ]
  },
  {
    key: "tatli-icecek",
    label: "Tatlılar ve İçecekler",
    note: "Kapanış için tatlılar, ayran, şalgam ve soğuk içecekler.",
    items: [
      ["Künefe", "A, G", "9,90 €"],
      ["Kadayıf", "A, G, H", "7,90 €"],
      ["Katmer (2 Kişilik)", "-", "13,90 €"],
      ["Fıstıklı İrmik Helvası", "A, G", "7,90 €"],
      ["Ayran Bardak 33 cl", "-", "3,60 €"],
      ["Şalgam Bardak 33 cl", "-", "3,50 €"],
      ["Portakal Suyu (Taze) 33 cl", "-", "6,90 €"],
      ["Cola 33 cl", "Z1, Z13", "3,90 €"]
    ]
  }
];

const proofItems = [
  ["Usta İşi", "Her tabak aynı özenle hazırlanır: sade, net ve hafızada kalıcı."],
  ["Ateş Dengesi", "Isı, tuz, acı ve doku aynı sofrada kusursuz bir uyum yakalar."],
  ["Misafirlik", "Sıcak karşılama, özenli servis ve sofrada kendini özel hissettiren bir restoran deneyimi."]
];

function navigateToPath(target: string) {
  window.history.pushState({}, "", target);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToHash(hash: string) {
  const element = document.querySelector(hash);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  navigateToPath(`/${hash}`);
  window.setTimeout(() => {
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

function openNavigationTarget(href: string) {
  if (href.startsWith("#")) {
    scrollToHash(href);
    return;
  }

  if (href.startsWith("/")) {
    navigateToPath(href);
    return;
  }

  Linking.openURL(href);
}

async function copyAddress(onCopied?: () => void) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(restaurantAddress);
    onCopied?.();
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = restaurantAddress;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
  onCopied?.();
}

function openMapForAddress() {
  window.location.assign(googleMapsLink);
}

function App() {
  const { width } = useWindowDimensions();
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const layout = useMemo(
    () => ({
      isMobile: width < 1180,
      showBottomDock: width < 900,
      compactActions: width < 600
    }),
    [width]
  );

  useEffect(() => {
    const handleRouteChange = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  if (pathname.replace(/\/+$/, "") === "/politikalarimiz") {
    return (
      <View style={[styles.page, styles.pageWithBottomDock]}>
        <Header isMobile={layout.isMobile} />
        <PoliciesPage isMobile={layout.isMobile} />
        <Footer isMobile={layout.isMobile} />
        <MobileActionDock desktop={!layout.showBottomDock} />
      </View>
    );
  }

  return (
    <View style={[styles.page, styles.pageWithBottomDock]}>
      <Header isMobile={layout.isMobile} />

      <View
        nativeID="home"
        style={[styles.editorialHero, layout.isMobile && styles.editorialHeroMobile]}
      >
        <View
          style={[
            styles.editorialHeroInner,
            layout.isMobile && styles.editorialHeroInnerMobile
          ]}
        >
          <View
            style={[
              styles.editorialHeroMedia,
              layout.isMobile && styles.editorialHeroMediaMobile
            ]}
          >
            <Image
              source={{ uri: editorialHeroImage }}
              style={styles.editorialHeroImage as any}
              resizeMode="contain"
              accessibilityLabel="Bedri Usta Mannheim editorial portresi"
            />
          </View>

          <View
            style={[
              styles.editorialHeroCopy,
              layout.isMobile && styles.editorialHeroCopyMobile
            ]}
          >
            <Text style={styles.editorialHeroEyebrow}>ADANA Ocakbaşı</Text>
            <Text
              style={[
                styles.editorialHeroTitle,
                layout.isMobile && styles.editorialHeroTitleMobile
              ]}
            >
              Bedri Usta Mannheim
            </Text>
            <Text
              style={[
                styles.editorialHeroSubtitle,
                layout.isMobile && styles.editorialHeroSubtitleMobile
              ]}
            >
              KEBAP & GRILL RESTAURANT
            </Text>
            <Text
              style={[
                styles.editorialHeroText,
                layout.isMobile && styles.editorialHeroTextMobile
              ]}
            >
              Bedri Usta'nın 50 yılı aşkın deneyimi, Mannheim şehir merkezinde yeni
              bir ocakbaşı deneyimiyle buluşuyor. Adana kebabı, seçkin grill
              lezzetleri ve sıcak Türk misafirliği; premium ama samimi bir sofrada
              bir araya geliyor.
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.campaignHero, layout.isMobile && styles.campaignHeroMobile]}>
        <video
          src={heroVideo}
          poster={heroV3Image}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          aria-label="Bedri Usta New Story Germany"
          style={StyleSheet.flatten(
            [
              styles.campaignHeroVideo,
              layout.isMobile && styles.campaignHeroVideoMobile
            ]
          ) as any}
        />
      </View>

      <View style={[styles.hero, layout.isMobile && styles.heroMobile]}>
        <View style={styles.heroBackdrop} />
        <View style={[styles.heroCopy, layout.isMobile && styles.heroCopyMobile]}>
          <Text style={styles.eyebrow}>ADANA Ocakbaşı</Text>
          <Text style={[styles.heroTitle, layout.isMobile && styles.heroTitleMobile]}>
            Bedri Usta Mannheim
          </Text>
          <Text style={[styles.heroSubtitle, layout.isMobile && styles.heroSubtitleMobile]}>
            Kebap & Grill Restaurant
          </Text>
          <Text style={[styles.heroText, layout.isMobile && styles.heroTextMobile]}>
            Bedri Usta'nın 50 yılı aşkın deneyimi, Mannheim şehir merkezinde yeni
            bir ocakbaşı deneyimiyle buluşuyor. Adana kebabı, seçkin grill
            lezzetleri ve sıcak Türk misafirliği; premium ama samimi bir sofrada
            bir araya geliyor.
          </Text>
          <View style={[styles.heroActions, layout.isMobile && styles.actionsMobile]}>
            <Button label="Rezervasyon" href="tel:+902160000000" primary />
            <Button label="Menü" onPress={() => scrollToHash("#menu")} />
          </View>
        </View>

        <View style={[styles.heroVisual, layout.isMobile && styles.heroVisualMobile]}>
          <View style={styles.imagePlate}>
            <Image source={{ uri: brandImage }} style={styles.brandImage as any} resizeMode="cover" />
          </View>
          <View style={styles.signatureCard}>
            <Text style={styles.signatureText}>MANNHEIM</Text>
          </View>
        </View>
      </View>

      <View nativeID="about" style={[styles.section, styles.storySection]}>
        <View style={[styles.storyGrid, layout.isMobile && styles.stack]}>
          <View style={styles.portraitFrame}>
            <Image source={{ uri: portraitImage }} style={styles.portrait as any} resizeMode="contain" />
          </View>
          <View style={styles.storyCopy}>
            <Text style={styles.eyebrowDark}>HAKKIMIZDA · BEDRİ USTA</Text>
            <Text style={[styles.sectionTitle, layout.isMobile && styles.sectionTitleMobile]}>
              Mardin’den Adana’ya, ocak başından dünyaya.
            </Text>
            <Text style={styles.bodyText}>
              1970 yılında Mardin’in Altıyol köyünde dünyaya gelen Bedrettin
              Aydoğdu, yedi yaşında ailesiyle Adana’ya göç etti. Mesleğe çocuk
              yaşta ocak başında başladı; yıllar içinde herkesin Bedri Usta
              olarak tanıdığı, gerçek Türk kebabının güçlü temsilcilerinden
              biri oldu.
            </Text>
            <Text style={[styles.bodyText, styles.storyParagraphSecondary]}>
              Adana’da başlayan yolculuk İstanbul’a, ardından yurt içi ve yurt
              dışındaki restoranlara uzandı. Marka büyürken Bedri Usta ocağın
              başından ayrılmadı; doğru ateşi, imza lezzetlerini ve sıcak
              misafirlik anlayışını yeni kuşaklarla paylaşmayı sürdürdü. Bugün
              bu ustalık hikâyesi Mannheim’da yeni bir sofrayla devam ediyor.
            </Text>
            <View style={styles.storyFacts}>
              <View style={styles.storyFact}>
                <Text style={styles.storyFactValue}>1970</Text>
                <Text style={styles.storyFactLabel}>Mardin · Altıyol</Text>
              </View>
              <View style={styles.storyFact}>
                <Text style={styles.storyFactValue}>7 yaşında</Text>
                <Text style={styles.storyFactLabel}>Adana’da mesleğe başlangıç</Text>
              </View>
              <View style={styles.storyFact}>
                <Text style={styles.storyFactValue}>50+ yıl</Text>
                <Text style={styles.storyFactLabel}>Ocakbaşı tecrübesi</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View nativeID="menu" style={[styles.section, styles.menuSection]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.eyebrow}>MENUMUZ</Text>
          <Text style={[styles.sectionTitleLight, layout.isMobile && styles.sectionTitleMobile]}>
            Sofranin merkezinde ates, etrafinda sohbet var.
          </Text>
        </View>
        <View style={[styles.menuGrid, layout.isMobile && styles.menuGridMobile]}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.title}
              style={({ hovered, pressed }: any) => [
                styles.menuCard,
                (hovered || pressed) && styles.menuCardActive
              ]}
            >
              {({ hovered, pressed }: any) => {
                const active = hovered || pressed;
                return (
                  <View style={[styles.menuFlip, active && styles.menuFlipActive]}>
                    <View style={[styles.menuFace, styles.menuFaceFront, index % 2 === 1 && styles.menuCardAlt]}>
                      <Text style={styles.menuNumber}>{String(index + 1).padStart(2, "0")}</Text>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      <Text style={styles.menuText}>{item.text}</Text>
                    </View>
                    <View style={[styles.menuFace, styles.menuFaceBack]}>
                      <Image source={{ uri: item.image }} style={styles.menuImage as any} resizeMode="cover" />
                      <View style={styles.menuBackShade} />
                      <View style={styles.menuBackCaption}>
                        <Text style={styles.menuBackNumber}>{String(index + 1).padStart(2, "0")}</Text>
                        <Text style={styles.menuBackTitle}>{item.title}</Text>
                      </View>
                    </View>
                  </View>
                );
              }}
            </Pressable>
          ))}
        </View>
        <MenuBoard />
      </View>

      <View style={[styles.section, styles.craftSection]}>
        <View style={[styles.craftInner, layout.isMobile && styles.stack]}>
          <Text style={[styles.craftTitle, layout.isMobile && styles.sectionTitleMobile]}>
            Ustalık, ateşin başında başlar; sofrada zarif bir deneyime dönüşür.
          </Text>
          <View style={styles.proofList}>
            {proofItems.map(([title, text]) => (
              <View key={title} style={styles.proofItem}>
                <Text style={styles.proofTitle}>{title}</Text>
                <Text style={styles.proofText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View nativeID="contact" style={[styles.section, styles.contactSection]}>
        <View style={styles.contactPanel}>
          <Image source={{ uri: logoImage }} style={styles.contactLogo as any} resizeMode="contain" />
          <Text style={[styles.contactTitle, layout.isMobile && styles.sectionTitleMobile]}>
            Sofraniz hazir.
          </Text>
          <Text style={styles.contactText}>
            Aile yemeği, iş buluşması ya da sakin bir akşam için Bedri Usta
            deneyimini rezerve edin.
          </Text>
          <View style={[styles.heroActions, layout.isMobile && styles.actionsMobile]}>
            <Button label="Ara" href="tel:+902160000000" primary />
            <Button label="Online Rezervasyon" href="tel:+902160000000" />
          </View>
        </View>
      </View>

      <QuickActionsSection compact={layout.compactActions} />
      <Footer isMobile={layout.isMobile} />
      <MobileActionDock desktop={!layout.showBottomDock} />
    </View>
  );
}

function AboutPage({ isMobile }: { isMobile: boolean }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Hakkımızda | Bedri Usta Mannheim";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const journey = [
    {
      year: "1970",
      city: "Mardin",
      text: "Altıyol köyünde başlayan; yokluğu, emeği ve aileyi merkeze alan ilk bölüm."
    },
    {
      year: "1977",
      city: "Adana",
      text: "Yedi yaşında ocak başıyla tanıştı. Etin, ateşin ve sabrın dilini burada öğrendi."
    },
    {
      year: "İstanbul",
      city: "Bir marka doğuyor",
      text: "Sokak arasındaki tezgahtan, kendi adıyla anılan güçlü bir restoran kültürüne."
    },
    {
      year: "Bugün",
      city: "Mannheim",
      text: "Gerçek Türk kebabı ve sıcak misafirlik, şimdi Mannheim şehir merkezinde."
    }
  ];

  return (
    <>
      <View style={[styles.aboutPageHero, isMobile && styles.aboutPageHeroMobile]}>
        <View style={[styles.aboutVerticalRail, isMobile && styles.aboutVerticalRailMobile]}>
          <Text
            accessibilityLabel="Mardin"
            style={[styles.aboutVerticalText, isMobile && styles.aboutVerticalTextMobile]}
          >
            {"M\nA\nR\nD\nİ\nN"}
          </Text>
        </View>

        <View style={[styles.aboutHeroMain, isMobile && styles.aboutHeroMainMobile]}>
          <View style={[styles.aboutHeroCopy, isMobile && styles.aboutHeroCopyMobile]}>
            <Text style={styles.aboutPageEyebrow}>KÖKLERDEN DÜNYAYA</Text>
            <Text style={[styles.aboutPageTitle, isMobile && styles.aboutPageTitleMobile]}>
              Bir ömür, bir ocak, dört şehir.
            </Text>
            <Text style={[styles.aboutPageLead, isMobile && styles.aboutPageLeadMobile]}>
              Bedri Usta’nın hikâyesi Mardin’de başladı; Adana’da ateşle biçimlendi,
              İstanbul’da markaya dönüştü ve Mannheim’da yeni bir sofrayla devam ediyor.
            </Text>
            <View style={[styles.aboutCityLine, isMobile && styles.aboutCityLineMobile]}>
              {["MARDİN", "ADANA", "İSTANBUL", "MANNHEIM"].map((city, index) => (
                <View key={city} style={styles.aboutCityItem}>
                  <Text style={styles.aboutCityName}>{city}</Text>
                  {index < 3 && <View style={styles.aboutCityConnector} />}
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.aboutHeroMedia, isMobile && styles.aboutHeroMediaMobile]}>
            <View style={styles.aboutHeroMediaGlow} />
            <Image
              source={{ uri: brandImage }}
              style={styles.aboutHeroFigure as any}
              resizeMode="contain"
              accessibilityLabel="Bedri Usta portresi"
            />
            <View style={styles.aboutHeroYearBadge}>
              <Text style={styles.aboutHeroYear}>1970</Text>
              <Text style={styles.aboutHeroYearLabel}>MARDİN</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.aboutJourneySection}>
        <View style={styles.aboutContentInner}>
          <Text style={styles.aboutSectionEyebrow}>USTALIĞIN ROTASI</Text>
          <Text style={[styles.aboutSectionTitleLight, isMobile && styles.aboutSectionTitleMobile]}>
            Mardin’den Mannheim’a uzanan gerçek bir hayat hikâyesi.
          </Text>
          <View style={[styles.aboutJourneyGrid, isMobile && styles.aboutJourneyGridMobile]}>
            {journey.map((item, index) => (
              <View key={`${item.year}-${item.city}`} style={styles.aboutJourneyCard}>
                <Text style={styles.aboutJourneyNumber}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
                <Text style={styles.aboutJourneyYear}>{item.year}</Text>
                <Text style={styles.aboutJourneyCity}>{item.city}</Text>
                <Text style={styles.aboutJourneyText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.aboutManifestoSection}>
        <View style={[styles.aboutManifestoInner, isMobile && styles.aboutManifestoInnerMobile]}>
          <View style={styles.aboutManifestoVisual}>
            <Image
              source={{ uri: portraitImage }}
              style={styles.aboutManifestoPortrait as any}
              resizeMode="contain"
              accessibilityLabel="Bedri Usta illüstrasyonu"
            />
            <Text style={styles.aboutManifestoStamp}>USTALIKLA PİŞER HAYAT</Text>
          </View>
          <View style={styles.aboutManifestoCopy}>
            <Text style={styles.eyebrowDark}>BEDRİ USTA’NIN FELSEFESİ</Text>
            <Text style={[styles.aboutManifestoTitle, isMobile && styles.aboutSectionTitleMobile]}>
              Mesele yalnızca kebap değil; ateşi, emeği ve hayatı doğru pişirmek.
            </Text>
            <Text style={styles.aboutManifestoText}>
              Çocuk yaşta başlayan meslek yolculuğu, yıllar içinde bir ustalık
              kültürüne dönüştü. Bedri Usta için iyi bir sofra; doğru ürünün,
              kararında ateşin ve samimi misafirliğin aynı anda buluşmasıdır.
            </Text>
            <Text style={[styles.aboutManifestoText, styles.aboutManifestoTextSecondary]}>
              Marka büyüse de ocağın başındaki dikkat değişmedi. İmza lezzetler,
              kuşaktan kuşağa aktarılan çalışma disiplini ve sofraya duyulan saygı,
              bugün Bedri Usta adının temelini oluşturuyor.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.aboutMannheimSection}>
        <View style={styles.aboutMannheimInner}>
          <Text style={styles.aboutMannheimKicker}>MARDİN’DEN MANNHEIM’A</Text>
          <Text style={[styles.aboutMannheimTitle, isMobile && styles.aboutMannheimTitleMobile]}>
            Kökler Mardin’de. Sofra Mannheim’da.
          </Text>
          <Text style={styles.aboutMannheimText}>
            Bedri Usta’nın yarım asrı aşan deneyimi, Mannheim’da Adana ocakbaşı
            kültürüyle buluşuyor. Aynı ateş, aynı özen, yeni bir şehir.
          </Text>
          <View style={[styles.heroActions, isMobile && styles.actionsMobile]}>
            <Button label="Menüyü İncele" onPress={() => scrollToHash("#menu")} primary />
            <Button label="Rezervasyon" href="tel:+902160000000" />
          </View>
        </View>
      </View>
    </>
  );
}

function PoliciesPage({ isMobile }: { isMobile: boolean }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Politikalarımız | Bedri Usta Mannheim";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const policies = [
    {
      number: "01",
      title: "Entegre Politika",
      text: "Teknolojik gelişmeleri takip eder; ekiplerimizin bilgi ve becerilerini düzenli eğitimlerle güçlendiririz. Güncel ürün bilgisini şeffaf biçimde paylaşır, üretimin her aşamasında kaliteyi ve sürekli iyileştirmeyi esas alırız."
    },
    {
      number: "02",
      title: "Hijyen Politikası",
      text: "Ürünlerimizin hazırlanmasından sunumuna kadar fiziksel, kimyasal ve biyolojik gıda güvenliği risklerini belirler, kontrol altında tutar ve tüm süreçleri sağlık ile hijyen kurallarına uygun yürütürüz."
    },
    {
      number: "03",
      title: "Fiziksel Görünüş ve Takı",
      text: "Üretim alanlarında temiz koruyucu önlük ve saçı tamamen kapatan bone kullanılır. Gıda güvenliğini korumak amacıyla üretim sırasında takı kullanımına izin verilmez."
    },
    {
      number: "04",
      title: "Üretim Alanlarına Giriş",
      text: "Ziyaretçi ve tedarikçiler üretim alanlarına yalnızca gerekli koruyucu ekipmanla, belirlenen hijyen adımlarını tamamlayarak ve ziyaretçi kontrol sürecine tabi olarak girebilir."
    }
  ];

  return (
    <>
      <View style={[styles.policyHero, isMobile && styles.policyHeroMobile]}>
        <View style={[styles.policyHeroCopy, isMobile && styles.policyHeroCopyMobile]}>
          <Text style={styles.policyEyebrow}>BEDRİ USTA · MANNHEIM</Text>
          <Text style={[styles.policyHeroTitle, isMobile && styles.policyHeroTitleMobile]}>
            Lezzetin arkasında tavizsiz bir standart var.
          </Text>
          <Text style={[styles.policyHeroLead, isMobile && styles.policyHeroLeadMobile]}>
            Misafirlerimize sunduğumuz her üründe gıda güvenliğini, hijyeni, eğitimi ve
            sürekli gelişimi aynı bütünün parçaları olarak görüyoruz.
          </Text>
          <View style={styles.policyPillRow}>
            {["GIDA GÜVENLİĞİ", "HİJYEN", "SÜREKLİ GELİŞİM"].map((label) => (
              <View key={label} style={styles.policyPill}>
                <Text style={styles.policyPillText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.policyHeroVisual, isMobile && styles.policyHeroVisualMobile]}>
          <View style={styles.policyHeroRingOuter}>
            <View style={styles.policyHeroRingInner}>
              <Text style={styles.policyHeroCheck}>✓</Text>
            </View>
          </View>
          <Text style={styles.policyHeroVisualKicker}>HER AŞAMADA</Text>
          <Text style={styles.policyHeroVisualTitle}>ÖZEN</Text>
          <Text style={styles.policyHeroVisualNumber}>01—04</Text>
        </View>
      </View>

      <View style={styles.policyIntroSection}>
        <View style={[styles.policyIntroInner, isMobile && styles.policyIntroInnerMobile]}>
          <View style={styles.policyIntroHeading}>
            <Text style={styles.eyebrowDark}>ENTEGRE YAKLAŞIM</Text>
            <Text style={[styles.policySectionTitle, isMobile && styles.policySectionTitleMobile]}>
              Güven, mutfakta başlayan bir disiplindir.
            </Text>
          </View>
          <Text style={styles.policyIntroText}>
            Gıda güvenliği kültürünün tüm ekip tarafından benimsenmesini sağlıyor;
            çalışanlarımızı düzenli eğitimlerle destekliyoruz. Kaliteli ve hijyenik ürün
            sunarken yasal gerekliliklere uymayı, tüketici ve tedarikçilerle doğru bilgi
            paylaşmayı ve sistemimizi sürekli geliştirmeyi taahhüt ediyoruz.
          </Text>
        </View>
      </View>

      <View style={styles.policyCardsSection}>
        <View style={styles.policyContentInner}>
          <Text style={styles.policySectionKicker}>ÇALIŞMA PRENSİPLERİMİZ</Text>
          <View style={[styles.policyGrid, isMobile && styles.policyGridMobile]}>
            {policies.map((policy) => (
              <View key={policy.number} style={styles.policyCard}>
                <View style={styles.policyCardTop}>
                  <Text style={styles.policyCardNumber}>{policy.number}</Text>
                  <View style={styles.policyCardLine} />
                </View>
                <Text style={styles.policyCardTitle}>{policy.title}</Text>
                <Text style={styles.policyCardText}>{policy.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.policyNoticeSection}>
        <View style={[styles.policyNoticeInner, isMobile && styles.policyNoticeInnerMobile]}>
          <View style={styles.policyNoticeMark}>
            <Text style={styles.policyNoticeMarkText}>!</Text>
          </View>
          <View style={styles.policyNoticeCopy}>
            <Text style={styles.policyNoticeKicker}>ORTAK SORUMLULUK</Text>
            <Text style={[styles.policyNoticeTitle, isMobile && styles.policySectionTitleMobile]}>
              Üretim alanlarında kurallar herkes için geçerlidir.
            </Text>
            <Text style={styles.policyNoticeText}>
              Üretim ve depolama alanlarında sigara içilmez, yiyecek veya içecek
              tüketilmez. Kurallar görünür uyarılarla desteklenir; çalışanların,
              ziyaretçilerin ve hizmet sağlayıcıların bu standartlara uyması sağlanır.
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

function Header({ isMobile }: { isMobile: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const leftNavItems = navItems.slice(0, 2);
  const rightNavItems = navItems.slice(2, 3);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const closeOnScroll = () => closeMobileMenu();

    window.addEventListener("scroll", closeOnScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", closeOnScroll);
    };
  }, [mobileMenuOpen]);

  return (
    <View style={styles.header}>
      {isMobile && mobileMenuOpen && (
        <Pressable style={styles.mobileMenuBackdrop} onPress={closeMobileMenu} />
      )}

      <View style={[styles.headerRail, isMobile && styles.headerRailMobile]}>
        {!isMobile && (
          <View style={styles.navSide}>
            {leftNavItems.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </View>
        )}

        {isMobile && (
          <Pressable
            onPress={() => setMobileMenuOpen((open) => !open)}
            style={({ pressed }: any) => [styles.mobileMenuButton, pressed && styles.mobileMenuButtonActive]}
          >
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </Pressable>
        )}

        <Pressable style={styles.logoButton} onPress={() => openNavigationTarget("/")}>
          <Image source={{ uri: logoImage }} style={styles.logo as any} resizeMode="contain" />
        </Pressable>

        {!isMobile ? (
          <View style={styles.navSide}>
            {rightNavItems.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
            <HeaderUtilities />
          </View>
        ) : (
          <HeaderUtilities compact />
        )}
      </View>
      {isMobile && mobileMenuOpen && (
        <View style={styles.mobileMenuPanel}>
          {navItems.map((item) => {
            const dropdownItems = "items" in item ? item.items : undefined;
            if (dropdownItems) {
              return (
                <View key={item.label} style={styles.mobileMenuGroup}>
                  <Text style={styles.mobileMenuGroupTitle}>{item.label}</Text>
                  {dropdownItems.map((child) => (
                    <Pressable
                      key={child.label}
                      onPress={() => {
                        openNavigationTarget(child.href);
                        closeMobileMenu();
                      }}
                      style={styles.mobileMenuChild}
                    >
                      <Text style={styles.mobileMenuChildText}>{child.label}</Text>
                    </Pressable>
                  ))}
                </View>
              );
            }

            const href = "href" in item && item.href ? item.href : "#home";
            return (
              <Pressable
                key={item.label}
                onPress={() => {
                  openNavigationTarget(href);
                  closeMobileMenu();
                }}
                style={styles.mobileMenuItem}
              >
                <Text style={styles.mobileMenuText}>{item.label}</Text>
              </Pressable>
            );
          })}
          <View style={styles.mobileMenuGroup}>
            <Text style={styles.mobileMenuGroupTitle}>Alt Menü</Text>
            {mobileFooterNavItems.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => {
                  openNavigationTarget(item.href);
                  closeMobileMenu();
                }}
                style={styles.mobileMenuChild}
              >
                <Text style={styles.mobileMenuChildText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function HeaderUtilities({ compact = false }: { compact?: boolean }) {
  return (
    <View
      style={[styles.headerUtilities, compact && styles.headerUtilitiesCompact]}
      accessibilityLabel="Kullanıcı ve dil seçenekleri"
    >
      <View style={[styles.headerLogin, compact && styles.headerLoginCompact]}>
        <Image
          source={{ uri: loginUserIcon }}
          style={[styles.headerLoginIcon, compact && styles.headerLoginIconCompact] as any}
          resizeMode="contain"
        />
      </View>
      <View
        style={[styles.languageMark, compact && styles.languageMarkCompact]}
        accessibilityLabel="Dil seçimi yakında"
      >
        <Image
          source={{ uri: languageGlobeIcon }}
          style={[styles.languageGlobe, compact && styles.languageGlobeCompact] as any}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

function NavItem({
  item,
  compact = false
}: {
  item: (typeof navItems)[number];
  compact?: boolean;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownItems = "items" in item ? item.items : undefined;

  if (dropdownItems) {
    return (
      <Pressable
        onPress={() => setDropdownOpen((open) => !open)}
        style={styles.navDropdown}
        accessibilityRole="button"
        accessibilityState={{ expanded: dropdownOpen }}
      >
        {({ hovered, pressed }: any) => {
          const open = hovered || pressed || dropdownOpen;
          return (
            <>
              <View style={[styles.navLink, compact && styles.navLinkCompact, open && styles.navLinkHover]}>
                <Text style={[styles.navText, compact && styles.navTextCompact]}>{item.label}</Text>
                <Text style={styles.navChevron}>⌄</Text>
              </View>
              {open && (
                <View style={styles.navDropdownPanel}>
                  {dropdownItems.map((child) => (
                    <Pressable
                      key={child.label}
                      onPress={() => {
                        setDropdownOpen(false);
                        openNavigationTarget(child.href);
                      }}
                      style={({ hovered: childHovered }: any) => [
                        styles.navDropdownItem,
                        childHovered && styles.navDropdownItemHover
                      ]}
                    >
                      <Text style={styles.navDropdownText}>{child.label}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </>
          );
        }}
      </Pressable>
    );
  }

  const href = "href" in item && item.href ? item.href : "#home";

  return (
    <Pressable
      onPress={() => openNavigationTarget(href)}
      style={({ hovered }: any) => [
        styles.navLink,
        compact && styles.navLinkCompact,
        hovered && styles.navLinkHover
      ]}
    >
      <Text style={[styles.navText, compact && styles.navTextCompact]}>{item.label}</Text>
    </Pressable>
  );
}

function Button({
  label,
  href,
  onPress,
  primary = false
}: {
  label: string;
  href?: string;
  onPress?: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        if (onPress) onPress();
        if (href) Linking.openURL(href);
      }}
      style={({ hovered, pressed }: any) => [
        styles.button,
        primary && styles.buttonPrimary,
        (hovered || pressed) && styles.buttonActive
      ]}
    >
      {({ hovered, pressed }: any) => {
        const active = hovered || pressed;
        return (
          <Text
            style={[
              styles.buttonText,
              primary && styles.buttonTextPrimary,
              active && styles.buttonTextActive
            ]}
          >
            {label}
          </Text>
        );
      }}
    </Pressable>
  );
}

function MenuBoard() {
  const [activeCategory, setActiveCategory] = useState(menuCategories[2].key);
  const selectedCategory =
    menuCategories.find((category) => category.key === activeCategory) ?? menuCategories[0];

  return (
    <View style={styles.menuBoard}>
      <View style={styles.menuBoardHeader}>
        <View>
          <Text style={styles.menuBoardKicker}>SPEISEKARTE · BEDRİ USTA MANNHEIM</Text>
          <Text style={styles.menuBoardTitle}>Gerçek menü, net fiyatlar, premium sunum.</Text>
        </View>
        <Text style={styles.menuBoardText}>
          K1 1-4 Mannheim için hazırlanan güncel Bedri Usta menüsü; kebap, meze,
          taş fırın, tatlı ve içecek kategorilerini hızlı okunur bir yapıda sunar.
        </Text>
      </View>

      <View style={styles.menuCategoryRail}>
        {menuCategories.map((category) => {
          const active = category.key === selectedCategory.key;
          return (
            <Pressable
              key={category.key}
              onPress={() => setActiveCategory(category.key)}
              style={({ hovered, pressed }: any) => [
                styles.menuCategoryButton,
                active && styles.menuCategoryButtonActive,
                (hovered || pressed) && styles.menuCategoryButtonHover
              ]}
            >
              <Text style={[styles.menuCategoryText, active && styles.menuCategoryTextActive]}>
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.menuListPanel}>
        <View style={styles.menuListIntro}>
          <Text style={styles.menuListTitle}>{selectedCategory.label}</Text>
          <Text style={styles.menuListNote}>{selectedCategory.note}</Text>
        </View>
        <View style={styles.menuListGrid}>
          {selectedCategory.items.map(([name, allergens, price]) => (
            <View key={name} style={styles.menuListItem}>
              <View style={styles.menuItemTopline}>
                <Text style={styles.menuItemName}>{name}</Text>
                <Text style={styles.menuItemPrice}>{price}</Text>
              </View>
              <Text style={styles.menuItemMeta}>
                Alerjen/Katkı kodları: {allergens === "-" ? "Yok" : allergens}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.menuAllergenNote}>
          Alerjen ve katkı bilgileri mevcut reçete kayıtlarına dayanır. Alerjiniz
          veya intoleransınız varsa siparişten önce ekibimize bilgi veriniz.
        </Text>
      </View>
    </View>
  );
}

function QuickActionGlyph({
  type,
  compact = false
}: {
  type: QuickActionIconName;
  compact?: boolean;
}) {
  return (
    <Image
      source={{ uri: quickActionIcons[type] }}
      style={[styles.quickActionGlyph, compact && styles.quickActionGlyphCompact] as any}
      resizeMode="contain"
    />
  );
}

function QuickActionsSection({ compact }: { compact: boolean }) {
  const actions: Array<{
    label: string;
    detail: string;
    icon: QuickActionIconName;
    action?: () => void;
  }> = [
    { label: "Menü", detail: "Lezzetleri keşfet", icon: "menu", action: () => scrollToHash("#menu") },
    {
      label: "Rezervasyon",
      detail: "Masanızı ayırtın",
      icon: "reservation",
      action: () => Linking.openURL("tel:+902160000000")
    },
    {
      label: "Instagram",
      detail: "@bedriustaa",
      icon: "instagram",
      action: () => Linking.openURL("https://www.instagram.com/bedriustaa")
    },
    { label: "Yol Tarifi", detail: "Mannheim merkez", icon: "directions", action: openMapForAddress },
    {
      label: "E-posta",
      detail: "info@bedriusta.de",
      icon: "email",
      action: () => Linking.openURL("mailto:info@bedriusta.de")
    },
    {
      label: "YouTube",
      detail: "Videoları izle",
      icon: "youtube",
      action: () => Linking.openURL("https://www.youtube.com/c/BedriUsta")
    },
    { label: "Pinterest", detail: "Yakında", icon: "pinterest" },
    { label: "TikTok", detail: "Yakında", icon: "tiktok" },
    { label: "Twitter", detail: "Yakında", icon: "twitter" },
    { label: "İletişim", detail: "Bize ulaşın", icon: "contact", action: () => scrollToHash("#contact") },
    {
      label: "Telefon",
      detail: "Hemen arayın",
      icon: "phone",
      action: () => Linking.openURL("tel:+902160000000")
    },
    {
      label: "WhatsApp",
      detail: "Mesaj gönderin",
      icon: "whatsapp",
      action: () => Linking.openURL("https://wa.me/902160000000")
    },
    { label: "Facebook", detail: "Yakında", icon: "facebook" }
  ];

  return (
    <View style={styles.quickActionsSection}>
      <View style={styles.quickActionsInner}>
        <Text style={styles.quickActionsEyebrow}>HIZLI ERİŞİM</Text>
        <Text style={styles.quickActionsTitle}>Tüm bağlantılar tek yerde.</Text>
        <Text style={styles.quickActionsIntro}>
          Menüden yol tarifine, rezervasyondan sosyal kanallara kadar Bedri Usta
          Mannheim'a ulaşmanın en kısa yolları.
        </Text>

        <View style={[styles.quickActionsGrid, compact && styles.quickActionsGridCompact]}>
          {actions.map((item) => {
            const disabled = !item.action;
            return (
              <Pressable
                key={item.label}
                onPress={item.action}
                accessibilityRole={disabled ? undefined : "link"}
                accessibilityState={{ disabled }}
                style={({ hovered, pressed }: any) => [
                  styles.quickActionCard,
                  disabled && styles.quickActionCardDisabled,
                  !disabled && (hovered || pressed) && styles.quickActionCardActive
                ]}
              >
                <View style={styles.quickActionIconFrame}>
                  <QuickActionGlyph type={item.icon} />
                </View>
                <Text style={styles.quickActionLabel}>{item.label}</Text>
                <Text style={styles.quickActionDetail}>{item.detail}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function MobileActionDock({ desktop }: { desktop: boolean }) {
  const items: Array<{
    label: string;
    icon: QuickActionIconName;
    action: () => void;
  }> = [
    { label: "Menü", icon: "menu", action: () => scrollToHash("#menu") },
    {
      label: "Rezervasyon",
      icon: "reservation",
      action: () => Linking.openURL("tel:+902160000000")
    },
    {
      label: "Instagram",
      icon: "instagram",
      action: () => Linking.openURL("https://www.instagram.com/bedriustaa")
    },
    { label: "Yol Tarifi", icon: "directions", action: openMapForAddress }
  ];

  return (
    <View
      style={[styles.mobileActionDock, desktop && styles.desktopActionDock]}
      accessibilityLabel="Hızlı erişim"
    >
      {items.map((item, index) => (
        <Pressable
          key={item.label}
          onPress={item.action}
          accessibilityRole="link"
          style={({ pressed }: any) => [
            styles.mobileActionDockButton,
            desktop && styles.desktopActionDockButton,
            index === items.length - 1 && styles.mobileActionDockButtonLast,
            pressed && styles.mobileActionDockButtonActive
          ]}
        >
          <QuickActionGlyph type={item.icon} compact />
          <Text
            style={[
              styles.mobileActionDockLabel,
              desktop && styles.desktopActionDockLabel
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function Footer({ isMobile }: { isMobile: boolean }) {
  const [addressCopied, setAddressCopied] = useState(false);
  const copyToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const legalLinks = [
    { label: "Impressum", href: "#policies" },
    { label: "Datenschutz", href: "#policies" },
    { label: "Cookie-Einstellungen", href: "#policies" },
    { label: "FAQ", href: "#faq" },
    { label: "İletişim", href: "#contact" }
  ];

  const actionLinks = [
    { label: "Rezervasyon", action: () => Linking.openURL("tel:+902160000000"), primary: true },
    { label: "Menü", action: () => scrollToHash("#menu") },
    { label: "Instagram", action: () => Linking.openURL("https://www.instagram.com/bedriustaa"), icon: "instagram" },
    { label: "YouTube", action: () => Linking.openURL("https://www.youtube.com/c/BedriUsta"), icon: "youtube" }
  ];

  useEffect(() => {
    return () => {
      if (copyToastTimer.current) {
        clearTimeout(copyToastTimer.current);
      }
    };
  }, []);

  const handleCopyAddress = async () => {
    await copyAddress(() => {
      setAddressCopied(true);
      if (copyToastTimer.current) {
        clearTimeout(copyToastTimer.current);
      }
      copyToastTimer.current = setTimeout(() => setAddressCopied(false), 2600);
    });
  };

  return (
    <View style={styles.footer}>
      <View style={[styles.footerInner, isMobile && styles.footerInnerMobile]}>
        <View style={[styles.footerBrand, isMobile && styles.footerBrandMobile]}>
          <View style={[styles.footerBrandMark, isMobile && styles.footerBrandMarkMobile]}>
            <Image
              source={{ uri: footerTransparentLogoImage }}
              style={[styles.footerBrandFigure, isMobile && styles.footerBrandFigureMobile] as any}
              resizeMode="contain"
            />
            <View style={[styles.footerCityBadge, isMobile && styles.footerCityBadgeMobile]}>
              <Text style={styles.footerCityBadgeText}>MANNHEIM</Text>
            </View>
          </View>
          <Text style={[styles.footerText, isMobile && styles.footerTextMobile]}>
            Premium kebap deneyimi, Bedri Usta imzası ve sıcak misafirlik.
          </Text>
        </View>

        <View style={[styles.footerContent, isMobile && styles.footerContentMobile]}>
          <View style={styles.footerActionRow}>
            {actionLinks.map((item) => (
              <Pressable
                key={item.label}
                onPress={item.action}
                style={({ hovered, pressed }: any) => [
                  styles.footerButton,
                  isMobile && styles.footerButtonMobile,
                  item.primary && styles.footerButtonPrimary,
                  (hovered || pressed) && styles.footerButtonActive
                ]}
              >
                {"icon" in item && item.icon && <SocialIcon type={item.icon} primary={item.primary} />}
                <Text style={[styles.footerButtonText, item.primary && styles.footerButtonTextPrimary]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.footerMetaGrid, isMobile && styles.footerMetaGridMobile]}>
            <View style={styles.footerInfoBlock}>
              <Text style={styles.footerHeading}>Açılış Saatleri</Text>
              <Text style={styles.footerInfoText}>Pazartesi - Pazar</Text>
              <Text style={styles.footerInfoStrong}>12:00 - 23:30</Text>
            </View>
            <View nativeID="jobs" style={styles.footerInfoBlock}>
              <Text style={styles.footerHeading}>Kariyer</Text>
              <Text style={styles.footerInfoText}>Ekibimize katılın.</Text>
              <Text style={styles.footerInfoStrong}>Jobs</Text>
            </View>
            <View style={[styles.footerInfoBlock, styles.footerAddressBlock]}>
              <Text style={styles.footerHeading}>Adres</Text>
              <Pressable
                onPress={openMapForAddress}
                accessibilityRole="link"
                accessibilityLabel="QULIS Mannheim adresini Google Maps'te aç"
              >
                <Text style={[styles.footerInfoStrong, styles.footerAddressText]}>{restaurantAddress}</Text>
              </Pressable>
              <View style={styles.footerAddressActions}>
                <Pressable
                  onPress={handleCopyAddress}
                  style={({ hovered, pressed }: any) => [
                    styles.footerSmallButton,
                    (hovered || pressed) && styles.footerSmallButtonActive
                  ]}
                >
                  <Text style={styles.footerSmallButtonText}>Adresi Kopyala</Text>
                </Pressable>
                <Pressable
                  onPress={openMapForAddress}
                  style={({ hovered, pressed }: any) => [
                    styles.footerSmallButton,
                    styles.footerSmallButtonPrimary,
                    (hovered || pressed) && styles.footerSmallButtonActive
                  ]}
                >
                  <Text style={[styles.footerSmallButtonText, styles.footerSmallButtonTextPrimary]}>
                    Haritada Aç
                  </Text>
                </Pressable>
              </View>
              {addressCopied && (
                <View style={styles.copyToast}>
                  <Text style={styles.copyToastText}>Kopyalandı</Text>
                </View>
              )}
            </View>
          </View>

          <View nativeID="policies" style={styles.footerLegalSection}>
            <Text style={styles.footerHeading}>Yasal Bilgiler</Text>
            <View style={[styles.footerLinkRow, isMobile && styles.footerLinkRowMobile]}>
              {legalLinks.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => openNavigationTarget(item.href)}
                  style={styles.footerLegalButton}
                >
                  <Text style={styles.footerLink}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
            <Text nativeID="faq" style={styles.footerFaqText}>
              FAQ: Rezervasyon, menü, adres, çalışma saatleri ve Bedri Usta Mannheim
              hakkında sık sorulan sorular için bizimle iletişime geçebilirsiniz.
            </Text>
            <Text style={styles.copyright}>© 2026 Bedri Usta. Tüm hakları saklıdır.</Text>
          </View>
        </View>

      </View>
    </View>
  );
}

function SocialIcon({ type, primary }: { type: string; primary?: boolean }) {
  return (
    <Image
      source={{ uri: type === "instagram" ? instagramIconImage : youtubeIconImage }}
      style={[styles.socialLogo, primary && styles.socialLogoPrimary] as any}
      resizeMode="contain"
    />
  );
}

const colors = {
  wine: "#160807",
  red: "#a7191e",
  headerRed: "#530e0f",
  cream: "#fff8ee",
  ivory: "#fffdf8",
  paper: "#f6f3f0",
  sand: "#e7d1ad",
  copper: "#c46632",
  ink: "#0c0705"
};

const styles = StyleSheet.create({
  page: {
    minHeight: "100vh",
    backgroundColor: colors.wine
  } as any,
  pageWithBottomDock: {
    paddingBottom: "calc(92px + env(safe-area-inset-bottom))"
  } as any,
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingTop: 12,
    paddingHorizontal: 0
  } as any,
  headerRail: {
    minHeight: 76,
    width: "100%",
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.headerRed,
    backgroundColor: colors.headerRed,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    position: "relative",
    zIndex: 21,
    boxShadow: "0 18px 50px rgba(0,0,0,0.3)"
  } as any,
  headerRailMobile: {
    minHeight: 58,
    paddingHorizontal: 14
  },
  navSide: {
    width: "38%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 8
  },
  headerUtilities: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7
  },
  headerUtilitiesCompact: {
    width: 72,
    justifyContent: "flex-end",
    gap: 5
  },
  headerLogin: {
    width: 36,
    height: 36,
    minHeight: 36,
    paddingHorizontal: 0,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(223,191,120,.48)",
    alignItems: "center",
    justifyContent: "center"
  },
  headerLoginCompact: {
    width: 32,
    height: 32,
    minHeight: 32,
    paddingHorizontal: 0
  },
  headerLoginIcon: {
    width: 27,
    height: 27
  },
  headerLoginIconCompact: {
    width: 24,
    height: 24
  },
  languageMark: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,247,223,.24)",
    alignItems: "center",
    justifyContent: "center"
  },
  languageMarkCompact: {
    width: 32,
    height: 32
  },
  languageGlobe: {
    width: 20,
    height: 20
  },
  languageGlobeCompact: {
    width: 17,
    height: 17
  },
  navLink: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    transitionDuration: "180ms",
    transitionProperty: "background-color, transform"
  } as any,
  navLinkCompact: {
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  navLinkHover: {
    backgroundColor: "rgba(255, 247, 223, 0.14)",
    transform: [{ translateY: -1 }]
  },
  navText: {
    color: "#ffffff",
    fontFamily: "Karla, sans-serif",
    fontSize: 13,
    letterSpacing: 1.8,
    fontWeight: "700"
  },
  navTextCompact: {
    fontSize: 11,
    letterSpacing: 1.1
  },
  navChevron: {
    color: "#ffffff",
    fontFamily: "Karla, sans-serif",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
    transform: [{ translateY: -1 }]
  },
  navDropdown: {
    position: "relative",
    zIndex: 30
  } as any,
  navDropdownPanel: {
    position: "absolute",
    top: 44,
    left: "50%",
    transform: [{ translateX: -96 }],
    width: 192,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,247,223,0.24)",
    backgroundColor: "rgba(23, 10, 8, 0.96)",
    paddingVertical: 8,
    boxShadow: "0 20px 48px rgba(0,0,0,0.36)"
  } as any,
  navDropdownItem: {
    paddingVertical: 11,
    paddingHorizontal: 14
  },
  navDropdownItemHover: {
    backgroundColor: "rgba(255,247,223,0.1)"
  },
  navDropdownText: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700"
  },
  mobileMenuButton: {
    width: 44,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,247,223,0.26)",
    backgroundColor: "rgba(23,10,8,0.2)",
    alignItems: "center",
    justifyContent: "center",
    gap: 5
  },
  mobileMenuButtonActive: {
    backgroundColor: "rgba(255,247,223,0.12)"
  },
  menuLine: {
    width: 22,
    height: 2,
    borderRadius: 999,
    backgroundColor: "#ffffff"
  },
  mobileMenuBackdrop: {
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 18
  } as any,
  mobileMenuPanel: {
    maxWidth: 560,
    width: "calc(100% - 40px)",
    marginHorizontal: "auto",
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,247,223,0.22)",
    backgroundColor: "rgba(23,10,8,0.96)",
    padding: 10,
    position: "relative",
    zIndex: 22,
    boxShadow: "0 22px 52px rgba(0,0,0,0.36)"
  } as any,
  mobileMenuItem: {
    minHeight: 44,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,247,223,0.08)"
  },
  mobileMenuText: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800"
  },
  mobileMenuGroup: {
    borderRadius: 8,
    backgroundColor: "rgba(116,27,21,0.28)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 6
  },
  mobileMenuGroupTitle: {
    color: colors.sand,
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 8
  },
  mobileMenuChild: {
    minHeight: 38,
    justifyContent: "center"
  },
  mobileMenuChildText: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700"
  },
  logoButton: {
    width: 92,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: "50%",
    top: 6,
    transform: [{ translateX: -46 }]
  },
  logo: {
    width: 88,
    height: 108,
    transform: [{ translateY: 12 }]
  },
  editorialHero: {
    width: "100%",
    minHeight: "100svh",
    paddingTop: 124,
    paddingBottom: 48,
    paddingHorizontal: 32,
    backgroundColor: colors.paper,
    justifyContent: "center",
    overflow: "hidden"
  } as any,
  editorialHeroMobile: {
    minHeight: 0,
    paddingTop: 116,
    paddingBottom: 52,
    paddingHorizontal: 18
  } as any,
  editorialHeroInner: {
    width: "100%",
    maxWidth: 1280,
    marginHorizontal: "auto",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 64
  },
  editorialHeroInnerMobile: {
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 34
  },
  editorialHeroMedia: {
    width: "min(43vw, 600px)",
    maxWidth: 600,
    aspectRatio: 1856 / 2304,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.paper
  } as any,
  editorialHeroMediaMobile: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center"
  } as any,
  editorialHeroImage: {
    width: "100%",
    height: "100%"
  },
  editorialHeroCopy: {
    flex: 1,
    minWidth: 0,
    maxWidth: 590
  },
  editorialHeroCopyMobile: {
    width: "100%",
    maxWidth: 620,
    alignItems: "center"
  },
  editorialHeroEyebrow: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 4.5,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 18
  } as any,
  editorialHeroTitle: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 64,
    lineHeight: 68,
    fontWeight: "800",
    letterSpacing: -1.6
  },
  editorialHeroTitleMobile: {
    fontSize: 42,
    lineHeight: 47,
    letterSpacing: -0.8,
    textAlign: "center"
  },
  editorialHeroSubtitle: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 12
  } as any,
  editorialHeroSubtitleMobile: {
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: 1.3,
    textAlign: "center"
  },
  editorialHeroText: {
    color: "#514744",
    fontFamily: "Heebo, sans-serif",
    fontSize: 18,
    lineHeight: 30,
    maxWidth: 560,
    marginTop: 24
  },
  editorialHeroTextMobile: {
    fontSize: 16,
    lineHeight: 27,
    textAlign: "center"
  },
  campaignHero: {
    width: "100%",
    minHeight: 0,
    padding: 0,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  } as any,
  campaignHeroMobile: {
    minHeight: 0,
    padding: 0
  } as any,
  campaignHeroVideo: {
    display: "block",
    width: "100%",
    height: "auto",
    maxWidth: 1920,
    maxHeight: 1080,
    aspectRatio: 16 / 9,
    objectFit: "contain",
    backgroundColor: "#ffffff"
  } as any,
  campaignHeroVideoMobile: {
    width: "100%",
    height: "auto",
    minHeight: 0,
    aspectRatio: 16 / 9
  } as any,
  policyHero: {
    width: "100%",
    minHeight: "82svh",
    paddingTop: 88,
    flexDirection: "row",
    backgroundColor: colors.paper,
    overflow: "hidden"
  } as any,
  policyHeroMobile: {
    minHeight: 0,
    paddingTop: 70,
    flexDirection: "column"
  } as any,
  policyHeroCopy: {
    flex: 1.08,
    minWidth: 0,
    paddingVertical: 82,
    paddingHorizontal: "clamp(28px, 7vw, 112px)",
    justifyContent: "center"
  } as any,
  policyHeroCopyMobile: {
    paddingVertical: 52,
    paddingHorizontal: 24
  },
  policyEyebrow: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 4,
    fontWeight: "800"
  },
  policyHeroTitle: {
    maxWidth: 720,
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 68,
    lineHeight: 73,
    letterSpacing: -2,
    fontWeight: "900",
    marginTop: 20
  },
  policyHeroTitleMobile: {
    fontSize: 42,
    lineHeight: 47,
    letterSpacing: -1
  },
  policyHeroLead: {
    maxWidth: 620,
    color: "#514744",
    fontFamily: "Heebo, sans-serif",
    fontSize: 19,
    lineHeight: 31,
    marginTop: 24
  },
  policyHeroLeadMobile: {
    fontSize: 16,
    lineHeight: 27
  },
  policyPillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginTop: 34
  },
  policyPill: {
    borderWidth: 1,
    borderColor: "#c9bdb5",
    paddingVertical: 9,
    paddingHorizontal: 13
  },
  policyPillText: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.7,
    fontWeight: "800"
  },
  policyHeroVisual: {
    flex: 0.92,
    minWidth: 0,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.headerRed,
    backgroundImage:
      "radial-gradient(circle at 50% 42%, rgba(223,191,120,.14), transparent 35%), linear-gradient(145deg, #3b090b 0%, #681a1e 100%)",
    overflow: "hidden"
  } as any,
  policyHeroVisualMobile: {
    minHeight: 410,
    flex: 0
  },
  policyHeroRingOuter: {
    width: "clamp(190px, 28vw, 340px)",
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(223,191,120,.42)",
    alignItems: "center",
    justifyContent: "center"
  } as any,
  policyHeroRingInner: {
    width: "72%",
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#dfbf78",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(48,5,7,.52)"
  },
  policyHeroCheck: {
    color: "#dfbf78",
    fontFamily: "Heebo, sans-serif",
    fontSize: 92,
    lineHeight: 105,
    fontWeight: "300"
  },
  policyHeroVisualKicker: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 4,
    fontWeight: "800",
    marginTop: 26
  },
  policyHeroVisualTitle: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 46,
    lineHeight: 50,
    letterSpacing: 8,
    fontWeight: "900",
    marginTop: 3
  },
  policyHeroVisualNumber: {
    position: "absolute",
    right: 24,
    bottom: 18,
    color: "rgba(223,191,120,.55)",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 2.4,
    fontWeight: "800"
  } as any,
  policyIntroSection: {
    backgroundColor: "#ffffff",
    paddingVertical: 92,
    paddingHorizontal: 28
  },
  policyIntroInner: {
    width: "100%",
    maxWidth: 1160,
    marginHorizontal: "auto",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 72
  },
  policyIntroInnerMobile: {
    flexDirection: "column",
    gap: 24
  },
  policyIntroHeading: {
    flex: 0.92,
    minWidth: 0
  },
  policySectionTitle: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 46,
    lineHeight: 53,
    letterSpacing: -1,
    fontWeight: "900"
  },
  policySectionTitleMobile: {
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5
  },
  policyIntroText: {
    flex: 1.08,
    minWidth: 0,
    color: "#514744",
    fontFamily: "Heebo, sans-serif",
    fontSize: 17,
    lineHeight: 30
  },
  policyCardsSection: {
    backgroundColor: colors.wine,
    paddingVertical: 100,
    paddingHorizontal: 28
  },
  policyContentInner: {
    width: "100%",
    maxWidth: 1160,
    marginHorizontal: "auto"
  },
  policySectionKicker: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 4,
    fontWeight: "800"
  },
  policyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
    marginTop: 38
  } as any,
  policyGridMobile: {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 10
  } as any,
  policyCard: {
    minHeight: 300,
    borderWidth: 1,
    borderColor: "rgba(223,191,120,.26)",
    backgroundColor: "rgba(255,255,255,.035)",
    paddingVertical: 28,
    paddingHorizontal: "clamp(20px, 4vw, 38px)"
  } as any,
  policyCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  policyCardNumber: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 2.4,
    fontWeight: "800"
  },
  policyCardLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(223,191,120,.22)"
  },
  policyCardTitle: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    marginTop: 42
  },
  policyCardText: {
    color: "rgba(255,255,255,.69)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 16,
    lineHeight: 27,
    marginTop: 16
  },
  policyNoticeSection: {
    backgroundColor: colors.paper,
    paddingVertical: 96,
    paddingHorizontal: 28
  },
  policyNoticeInner: {
    width: "100%",
    maxWidth: 1040,
    marginHorizontal: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 56
  },
  policyNoticeInnerMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 30
  },
  policyNoticeMark: {
    width: 150,
    height: 150,
    flexShrink: 0,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.headerRed,
    boxShadow: "0 20px 55px rgba(83,14,15,.18)"
  } as any,
  policyNoticeMarkText: {
    color: "#dfbf78",
    fontFamily: "Heebo, sans-serif",
    fontSize: 78,
    lineHeight: 88,
    fontWeight: "300"
  },
  policyNoticeCopy: {
    flex: 1,
    minWidth: 0
  },
  policyNoticeKicker: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 3.2,
    fontWeight: "800"
  },
  policyNoticeTitle: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 44,
    lineHeight: 51,
    letterSpacing: -0.9,
    fontWeight: "900",
    marginTop: 12
  },
  policyNoticeText: {
    color: "#514744",
    fontFamily: "Heebo, sans-serif",
    fontSize: 16,
    lineHeight: 28,
    marginTop: 18
  },
  aboutPageHero: {
    width: "100%",
    minHeight: "100svh",
    paddingTop: 88,
    flexDirection: "row",
    backgroundColor: colors.paper,
    overflow: "hidden"
  } as any,
  aboutPageHeroMobile: {
    minHeight: 0,
    paddingTop: 70
  } as any,
  aboutVerticalRail: {
    width: 134,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#ded6cf",
    backgroundColor: "#f1ece8"
  },
  aboutVerticalRailMobile: {
    width: 52
  },
  aboutVerticalText: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 68,
    lineHeight: 75,
    letterSpacing: -2,
    fontWeight: "900",
    textAlign: "center"
  },
  aboutVerticalTextMobile: {
    fontSize: 31,
    lineHeight: 37,
    letterSpacing: -0.5
  },
  aboutHeroMain: {
    flex: 1,
    minWidth: 0,
    maxWidth: 1440,
    marginHorizontal: "auto",
    flexDirection: "row",
    alignItems: "stretch"
  },
  aboutHeroMainMobile: {
    flexDirection: "column"
  },
  aboutHeroCopy: {
    flex: 0.92,
    minWidth: 0,
    paddingVertical: 76,
    paddingHorizontal: "clamp(28px, 5vw, 76px)",
    justifyContent: "center"
  } as any,
  aboutHeroCopyMobile: {
    paddingVertical: 48,
    paddingHorizontal: 20
  },
  aboutPageEyebrow: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 4.4,
    fontWeight: "800"
  },
  aboutPageTitle: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 68,
    lineHeight: 72,
    letterSpacing: -2,
    fontWeight: "900",
    maxWidth: 610,
    marginTop: 18
  },
  aboutPageTitleMobile: {
    fontSize: 42,
    lineHeight: 46,
    letterSpacing: -1
  },
  aboutPageLead: {
    color: "#514744",
    fontFamily: "Heebo, sans-serif",
    fontSize: 19,
    lineHeight: 31,
    maxWidth: 600,
    marginTop: 24
  },
  aboutPageLeadMobile: {
    fontSize: 16,
    lineHeight: 27
  },
  aboutCityLine: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 9,
    marginTop: 34
  },
  aboutCityLineMobile: {
    alignItems: "flex-start",
    gap: 7,
    marginTop: 28
  },
  aboutCityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9
  },
  aboutCityName: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.7,
    fontWeight: "800"
  },
  aboutCityConnector: {
    width: 22,
    height: 1,
    backgroundColor: "#c8aaa1"
  },
  aboutHeroMedia: {
    flex: 1.08,
    minWidth: 0,
    minHeight: 650,
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: colors.headerRed,
    overflow: "hidden"
  } as any,
  aboutHeroMediaMobile: {
    minHeight: 430
  },
  aboutHeroMediaGlow: {
    position: "absolute",
    width: "72%",
    aspectRatio: 1,
    top: "8%",
    borderRadius: 999,
    backgroundColor: "rgba(223,191,120,.16)",
    boxShadow: "0 0 120px rgba(223,191,120,.16)"
  } as any,
  aboutHeroFigure: {
    width: "92%",
    height: "94%"
  },
  aboutHeroYearBadge: {
    position: "absolute",
    right: 22,
    bottom: 22,
    minWidth: 104,
    borderWidth: 1,
    borderColor: "rgba(223,191,120,.66)",
    backgroundColor: "rgba(48,5,7,.84)",
    paddingVertical: 13,
    paddingHorizontal: 16
  } as any,
  aboutHeroYear: {
    color: "#dfbf78",
    fontFamily: "Heebo, sans-serif",
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "900"
  },
  aboutHeroYearLabel: {
    color: "#ffffff",
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 2.5,
    fontWeight: "800",
    marginTop: 2
  },
  aboutJourneySection: {
    backgroundColor: colors.wine,
    paddingVertical: 100,
    paddingHorizontal: 28
  },
  aboutContentInner: {
    width: "100%",
    maxWidth: 1180,
    marginHorizontal: "auto"
  },
  aboutSectionEyebrow: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 4,
    fontWeight: "800"
  },
  aboutSectionTitleLight: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 48,
    lineHeight: 55,
    letterSpacing: -1.1,
    fontWeight: "900",
    maxWidth: 780,
    marginTop: 14
  },
  aboutSectionTitleMobile: {
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5
  },
  aboutJourneyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 14,
    marginTop: 48
  } as any,
  aboutJourneyGridMobile: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
    marginTop: 34
  } as any,
  aboutJourneyCard: {
    minHeight: 270,
    borderWidth: 1,
    borderColor: "rgba(223,191,120,.24)",
    backgroundColor: "rgba(255,255,255,.035)",
    paddingVertical: 24,
    paddingHorizontal: 20
  },
  aboutJourneyNumber: {
    color: "rgba(223,191,120,.58)",
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 2,
    fontWeight: "800"
  },
  aboutJourneyYear: {
    color: "#dfbf78",
    fontFamily: "Heebo, sans-serif",
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
    marginTop: 30
  },
  aboutJourneyCity: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    marginTop: 2
  },
  aboutJourneyText: {
    color: "rgba(255,255,255,.68)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 14,
    lineHeight: 23,
    marginTop: 14
  },
  aboutManifestoSection: {
    backgroundColor: colors.paper,
    paddingVertical: 100,
    paddingHorizontal: 28
  },
  aboutManifestoInner: {
    width: "100%",
    maxWidth: 1120,
    marginHorizontal: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 72
  },
  aboutManifestoInnerMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 42
  },
  aboutManifestoVisual: {
    flex: 0.8,
    minHeight: 470,
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-end",
    borderWidth: 1,
    borderColor: "#ded6cf",
    backgroundColor: "#efe8e3",
    overflow: "hidden"
  } as any,
  aboutManifestoPortrait: {
    width: "92%",
    height: 430
  },
  aboutManifestoStamp: {
    position: "absolute",
    left: 18,
    bottom: 18,
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 2.5,
    fontWeight: "800",
    backgroundColor: "rgba(246,243,240,.9)",
    paddingVertical: 8,
    paddingHorizontal: 10
  } as any,
  aboutManifestoCopy: {
    flex: 1.2,
    minWidth: 0
  },
  aboutManifestoTitle: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 46,
    lineHeight: 53,
    letterSpacing: -1,
    fontWeight: "900",
    marginTop: 14
  },
  aboutManifestoText: {
    color: "#514744",
    fontFamily: "Heebo, sans-serif",
    fontSize: 17,
    lineHeight: 29,
    marginTop: 22
  },
  aboutManifestoTextSecondary: {
    marginTop: 13
  },
  aboutMannheimSection: {
    backgroundColor: colors.headerRed,
    backgroundImage:
      "radial-gradient(circle at 88% 22%, rgba(223,191,120,.18), transparent 34%), linear-gradient(135deg, #3b090b 0%, #530e0f 58%, #210506 100%)",
    paddingVertical: 104,
    paddingHorizontal: 28
  } as any,
  aboutMannheimInner: {
    width: "100%",
    maxWidth: 940,
    marginHorizontal: "auto",
    alignItems: "center"
  },
  aboutMannheimKicker: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 4,
    fontWeight: "800",
    textAlign: "center"
  },
  aboutMannheimTitle: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 56,
    lineHeight: 62,
    letterSpacing: -1.4,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 16
  },
  aboutMannheimTitleMobile: {
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: -0.6
  },
  aboutMannheimText: {
    color: "rgba(255,255,255,.72)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 18,
    lineHeight: 30,
    maxWidth: 680,
    textAlign: "center",
    marginTop: 18,
    marginBottom: 30
  },
  hero: {
    minHeight: "100vh",
    paddingTop: 150,
    paddingBottom: 80,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 42,
    overflow: "hidden"
  } as any,
  heroMobile: {
    paddingTop: 126,
    paddingHorizontal: 18,
    flexDirection: "column",
    gap: 30,
    alignItems: "center"
  },
  heroBackdrop: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "radial-gradient(circle at 78% 25%, rgba(196,102,50,.22), transparent 34%), radial-gradient(circle at 18% 78%, rgba(167,25,30,.48), transparent 38%)"
  } as any,
  heroCopy: {
    maxWidth: 610,
    zIndex: 2
  },
  heroCopyMobile: {
    maxWidth: 520,
    width: "100%",
    alignItems: "center"
  },
  eyebrow: {
    color: colors.sand,
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    letterSpacing: 5,
    fontWeight: "700",
    marginBottom: 18
  },
  eyebrowDark: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    letterSpacing: 5,
    fontWeight: "700",
    marginBottom: 18
  },
  heroTitle: {
    color: colors.cream,
    fontFamily: "Heebo, sans-serif",
    fontSize: 76,
    lineHeight: 80,
    fontWeight: "800",
    letterSpacing: 0
  },
  heroTitleMobile: {
    fontSize: 44,
    lineHeight: 48,
    textAlign: "center"
  },
  heroSubtitle: {
    color: "#ffffff",
    fontFamily: "Karla, sans-serif",
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: 2.2,
    marginTop: 8,
    textTransform: "uppercase"
  } as any,
  heroSubtitleMobile: {
    fontSize: 18,
    lineHeight: 25,
    letterSpacing: 1.2,
    textAlign: "center"
  },
  heroText: {
    color: "rgba(255,247,223,0.76)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 18,
    lineHeight: 30,
    maxWidth: 560,
    marginTop: 22
  },
  heroTextMobile: {
    fontSize: 16,
    lineHeight: 27,
    textAlign: "center"
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 34
  },
  actionsMobile: {
    width: "100%",
    justifyContent: "center"
  },
  button: {
    minHeight: 50,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: colors.red,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    transitionDuration: "180ms",
    transitionProperty: "transform, box-shadow, background-color, border-color"
  } as any,
  buttonPrimary: {
    backgroundColor: colors.red,
    borderColor: colors.red
  },
  buttonActive: {
    transform: [{ translateY: -2 }],
    backgroundColor: colors.cream,
    borderColor: colors.cream,
    boxShadow: "0 14px 30px rgba(0,0,0,.28)"
  } as any,
  buttonText: {
    color: "#ffffff",
    fontFamily: "Karla, sans-serif",
    fontWeight: "700",
    letterSpacing: 1.4,
    fontSize: 13
  },
  buttonTextPrimary: {
    color: "#ffffff"
  },
  buttonTextActive: {
    color: colors.red
  },
  heroVisual: {
    width: "min(42vw, 500px)",
    minWidth: 360,
    zIndex: 2
  } as any,
  heroVisualMobile: {
    width: "100%",
    maxWidth: 520,
    minWidth: 0
  },
  imagePlate: {
    width: "100%",
    aspectRatio: 0.74,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: "rgba(255,247,223,0.28)",
    boxShadow: "0 26px 80px rgba(0,0,0,.34)"
  } as any,
  brandImage: {
    width: "112%",
    height: "100%",
    transform: [{ translateX: -18 }]
  },
  signatureCard: {
    alignSelf: "center",
    marginTop: -1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(116,27,21,0.24)",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingVertical: 14,
    paddingHorizontal: 28,
    minWidth: 196,
    alignItems: "center",
    boxShadow: "0 18px 42px rgba(0,0,0,.34)"
  } as any,
  signatureLabel: {
    display: "none"
  },
  signatureText: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    letterSpacing: 3,
    textAlign: "center"
  },
  section: {
    paddingVertical: 96,
    paddingHorizontal: 32
  },
  storySection: {
    backgroundColor: colors.ivory
  },
  storyGrid: {
    maxWidth: 1120,
    width: "100%",
    marginHorizontal: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 58
  },
  stack: {
    flexDirection: "column",
    alignItems: "stretch"
  },
  portraitFrame: {
    flex: 1,
    minHeight: 460,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fffdf7",
    borderWidth: 1,
    borderColor: "#f0ddbd"
  },
  portrait: {
    width: "86%",
    height: 420
  },
  storyCopy: {
    flex: 1,
    minWidth: 0
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 46,
    lineHeight: 54,
    fontWeight: "800"
  },
  sectionTitleLight: {
    color: colors.cream,
    fontFamily: "Heebo, sans-serif",
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "800",
    maxWidth: 760
  },
  sectionTitleMobile: {
    fontSize: 34,
    lineHeight: 40
  },
  bodyText: {
    color: "#4c3730",
    fontFamily: "Heebo, sans-serif",
    fontSize: 18,
    lineHeight: 31,
    marginTop: 20
  },
  storyParagraphSecondary: {
    marginTop: 14
  },
  storyFacts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 26
  },
  storyFact: {
    flex: 1,
    minWidth: 128,
    minHeight: 94,
    borderWidth: 1,
    borderColor: "#e7d1ad",
    backgroundColor: "#fffdf7",
    paddingVertical: 15,
    paddingHorizontal: 14,
    justifyContent: "center"
  },
  storyFactValue: {
    color: colors.red,
    fontFamily: "Heebo, sans-serif",
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "800"
  },
  storyFactLabel: {
    color: "#5b433b",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    marginTop: 4
  },
  menuSection: {
    backgroundColor: colors.wine,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,247,223,0.12)"
  },
  sectionHeader: {
    maxWidth: 1120,
    width: "100%",
    marginHorizontal: "auto",
    marginBottom: 34
  },
  menuGrid: {
    maxWidth: 1120,
    width: "100%",
    marginHorizontal: "auto",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16
  } as any,
  menuGridMobile: {
    gridTemplateColumns: "1fr"
  } as any,
  menuCard: {
    minHeight: 280,
    borderRadius: 8,
    perspective: 1200,
    transitionDuration: "260ms",
    transitionProperty: "transform, filter",
    transformOrigin: "center center"
  } as any,
  menuCardActive: {
    filter: "drop-shadow(0 28px 46px rgba(0,0,0,.34))",
    transform: [{ translateY: -10 }, { scale: 1.02 }]
  } as any,
  menuFlip: {
    minHeight: 280,
    width: "100%",
    position: "relative",
    transformStyle: "preserve-3d",
    transitionDuration: "620ms",
    transitionProperty: "transform",
    transitionTimingFunction: "cubic-bezier(.2,.78,.18,1)"
  } as any,
  menuFlipActive: {
    transform: [{ rotateY: "180deg" }]
  } as any,
  menuFace: {
    position: "absolute",
    inset: 0,
    borderWidth: 1,
    borderColor: "rgba(255,247,223,0.16)",
    backgroundColor: "rgba(255,247,223,0.055)",
    borderRadius: 8,
    minHeight: 280,
    overflow: "hidden",
    backfaceVisibility: "hidden"
  } as any,
  menuFaceFront: {
    padding: 24,
    justifyContent: "space-between",
    transform: [{ rotateY: "0deg" }]
  } as any,
  menuFaceBack: {
    borderColor: colors.copper,
    backgroundColor: colors.red,
    transform: [{ rotateY: "180deg" }]
  } as any,
  menuCardAlt: {
    backgroundColor: "rgba(116,27,21,0.28)"
  },
  menuImage: {
    width: "100%",
    height: "100%"
  },
  menuBackShade: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(180deg, rgba(23,10,8,.08) 0%, rgba(23,10,8,.18) 42%, rgba(23,10,8,.78) 100%)"
  } as any,
  menuBackCaption: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    zIndex: 2
  } as any,
  menuBackNumber: {
    color: colors.sand,
    fontFamily: "Karla, sans-serif",
    letterSpacing: 3,
    fontWeight: "700",
    marginBottom: 6
  },
  menuBackTitle: {
    color: colors.cream,
    fontFamily: "Heebo, sans-serif",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,.42)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12
  },
  menuNumber: {
    color: colors.copper,
    fontFamily: "Karla, sans-serif",
    letterSpacing: 3,
    fontWeight: "700"
  },
  menuTitle: {
    color: colors.cream,
    fontFamily: "Heebo, sans-serif",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800"
  },
  menuText: {
    color: "rgba(255,247,223,0.72)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 15,
    lineHeight: 24
  },
  menuBoard: {
    maxWidth: 1120,
    width: "100%",
    marginHorizontal: "auto",
    marginTop: 44,
    borderWidth: 1,
    borderColor: "rgba(255,247,223,0.18)",
    borderRadius: 8,
    backgroundColor: "rgba(255,247,223,0.045)",
    overflow: "hidden"
  },
  menuBoardHeader: {
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,247,223,0.14)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
    gap: 20,
    alignItems: "end"
  } as any,
  menuBoardKicker: {
    color: colors.copper,
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: "700",
    marginBottom: 8
  },
  menuBoardTitle: {
    color: colors.cream,
    fontFamily: "Heebo, sans-serif",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800"
  },
  menuBoardText: {
    color: "rgba(255,247,223,0.68)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 15,
    lineHeight: 25
  },
  menuCategoryRail: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    backgroundColor: "rgba(0,0,0,0.16)"
  },
  menuCategoryButton: {
    minHeight: 42,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,247,223,0.18)",
    backgroundColor: "rgba(255,255,255,0.035)",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    transitionDuration: "180ms",
    transitionProperty: "transform, background-color, border-color"
  } as any,
  menuCategoryButtonHover: {
    transform: [{ translateY: -2 }],
    borderColor: "rgba(255,247,223,0.46)"
  },
  menuCategoryButtonActive: {
    backgroundColor: colors.cream,
    borderColor: colors.cream
  },
  menuCategoryText: {
    color: colors.cream,
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    letterSpacing: 1.4,
    fontWeight: "700"
  },
  menuCategoryTextActive: {
    color: colors.red
  },
  menuListPanel: {
    padding: 24
  },
  menuListIntro: {
    marginBottom: 20
  },
  menuListTitle: {
    color: colors.cream,
    fontFamily: "Heebo, sans-serif",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800"
  },
  menuListNote: {
    color: "rgba(255,247,223,0.66)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 15,
    lineHeight: 24,
    marginTop: 6
  },
  menuListGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
    gap: 12
  } as any,
  menuListItem: {
    minHeight: 104,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,247,223,0.13)",
    backgroundColor: "rgba(9,3,2,0.34)",
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: "space-between"
  },
  menuItemTopline: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12
  },
  menuItemName: {
    color: colors.ivory,
    fontFamily: "Heebo, sans-serif",
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
    flex: 1
  },
  menuItemPrice: {
    color: colors.sand,
    fontFamily: "Karla, sans-serif",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "800",
    whiteSpace: "nowrap"
  } as any,
  menuItemMeta: {
    color: "rgba(255,247,223,0.52)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10
  },
  menuAllergenNote: {
    color: "rgba(255,247,223,0.56)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,247,223,0.12)"
  },
  craftSection: {
    backgroundColor: "#0f0806",
    backgroundImage:
      "linear-gradient(135deg, rgba(196,102,50,.2), transparent 32%), radial-gradient(circle at 80% 70%, rgba(116,27,21,.36), transparent 34%)"
  } as any,
  craftInner: {
    maxWidth: 1120,
    width: "100%",
    marginHorizontal: "auto",
    flexDirection: "row",
    gap: 46,
    alignItems: "flex-start"
  },
  craftTitle: {
    flex: 1,
    color: colors.cream,
    fontFamily: "Heebo, sans-serif",
    fontSize: 46,
    lineHeight: 54,
    fontWeight: "800"
  },
  proofList: {
    flex: 1,
    gap: 12
  },
  proofItem: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,247,223,0.18)",
    paddingTop: 20,
    paddingBottom: 16
  },
  proofTitle: {
    color: colors.sand,
    fontFamily: "Karla, sans-serif",
    fontSize: 13,
    letterSpacing: 3,
    fontWeight: "700",
    marginBottom: 8
  },
  proofText: {
    color: "rgba(255,247,223,0.74)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 17,
    lineHeight: 28
  },
  contactSection: {
    backgroundColor: colors.ivory
  },
  contactPanel: {
    maxWidth: 960,
    width: "100%",
    marginHorizontal: "auto",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ead7b7",
    backgroundColor: "#fffdf7",
    paddingVertical: 62,
    paddingHorizontal: 26
  },
  contactLogo: {
    width: 132,
    height: 154,
    marginBottom: 8
  },
  contactTitle: {
    color: colors.red,
    fontFamily: "Heebo, sans-serif",
    fontSize: 52,
    lineHeight: 58,
    fontWeight: "800",
    textAlign: "center"
  },
  contactText: {
    color: "#4c3730",
    fontFamily: "Heebo, sans-serif",
    fontSize: 17,
    lineHeight: 28,
    maxWidth: 560,
    textAlign: "center",
    marginTop: 14
  },
  quickActionsSection: {
    backgroundColor: colors.paper,
    paddingVertical: 88,
    paddingHorizontal: 32,
    borderTopWidth: 1,
    borderTopColor: "#ded6cf"
  },
  quickActionsInner: {
    width: "100%",
    maxWidth: 1180,
    marginHorizontal: "auto"
  },
  quickActionsEyebrow: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 4.2,
    fontWeight: "800",
    textAlign: "center"
  },
  quickActionsTitle: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 44,
    lineHeight: 50,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12
  },
  quickActionsIntro: {
    color: "#5a4e49",
    fontFamily: "Heebo, sans-serif",
    fontSize: 16,
    lineHeight: 26,
    textAlign: "center",
    maxWidth: 650,
    marginHorizontal: "auto",
    marginTop: 14,
    marginBottom: 36
  },
  quickActionsGrid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))",
    gap: 14
  } as any,
  quickActionsGridCompact: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
  } as any,
  quickActionCard: {
    minHeight: 164,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6d2426",
    backgroundColor: colors.headerRed,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    transitionDuration: "180ms",
    transitionProperty: "transform, box-shadow, background-color, border-color"
  } as any,
  quickActionCardActive: {
    transform: [{ translateY: -4 }],
    borderColor: "#dfbf78",
    backgroundColor: "#651316",
    boxShadow: "0 18px 34px rgba(83,14,15,.22)"
  } as any,
  quickActionCardDisabled: {
    opacity: 0.58
  },
  quickActionIconFrame: {
    width: 58,
    height: 58,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(223,191,120,.42)",
    backgroundColor: "rgba(255,255,255,.035)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15
  },
  quickActionGlyph: {
    width: 31,
    height: 31
  },
  quickActionGlyphCompact: {
    width: 22,
    height: 22
  },
  quickActionLabel: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
    textAlign: "center"
  },
  quickActionDetail: {
    color: "rgba(255,255,255,.62)",
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.8,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 5
  },
  mobileActionDock: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 60,
    minHeight: 70,
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: colors.headerRed,
    borderTopWidth: 1,
    borderTopColor: "#8a6638",
    paddingTop: 7,
    paddingBottom: "max(7px, env(safe-area-inset-bottom))",
    paddingHorizontal: 4,
    boxShadow: "0 -12px 34px rgba(31,4,5,.26)"
  } as any,
  desktopActionDock: {
    left: "50%",
    right: "auto",
    bottom: 18,
    width: "min(640px, calc(100% - 48px))",
    minHeight: 68,
    borderWidth: 1,
    borderColor: "rgba(223,191,120,.58)",
    borderRadius: 10,
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 8,
    transform: "translateX(-50%)",
    boxShadow: "0 18px 46px rgba(31,4,5,.34)"
  } as any,
  mobileActionDockButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 55,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: "rgba(223,191,120,.18)"
  },
  desktopActionDockButton: {
    minHeight: 54,
    borderRadius: 6
  },
  mobileActionDockButtonLast: {
    borderRightWidth: 0
  },
  mobileActionDockButtonActive: {
    backgroundColor: "#651316"
  },
  mobileActionDockLabel: {
    color: "#ffffff",
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.2,
    fontWeight: "800",
    textAlign: "center",
    whiteSpace: "nowrap"
  } as any,
  desktopActionDockLabel: {
    fontSize: 11,
    letterSpacing: 0.5
  },
  footer: {
    backgroundColor: "#120604",
    backgroundImage:
      "radial-gradient(circle at 12% 18%, rgba(116,27,21,.62), transparent 34%), linear-gradient(135deg, #250907 0%, #120604 48%, #050202 100%)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 28,
    paddingTop: 64,
    paddingBottom: 20
  } as any,
  footerInner: {
    maxWidth: 1180,
    width: "100%",
    marginHorizontal: "auto",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 28,
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  footerInnerMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 32
  },
  footerBrand: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 340,
    maxWidth: 430
  },
  footerBrandMobile: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: "auto",
    width: "100%",
    maxWidth: "100%",
    alignItems: "center",
    paddingBottom: 4
  },
  footerBrandMark: {
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    position: "relative",
    alignItems: "center",
    paddingBottom: 34
  } as any,
  footerBrandMarkMobile: {
    width: "min(72vw, 320px)",
    maxWidth: 320,
    paddingBottom: 32
  } as any,
  footerBrandFigure: {
    width: "100%",
    maxWidth: 340,
    height: 420,
    objectFit: "contain",
    backgroundColor: "transparent",
    marginBottom: 0
  } as any,
  footerBrandFigureMobile: {
    width: "min(72vw, 320px)",
    maxWidth: 320,
    height: "min(96vw, 420px)",
    maxHeight: 420,
    flexShrink: 0,
    marginBottom: 0
  } as any,
  footerCityBadge: {
    position: "absolute",
    left: "50%",
    bottom: 0,
    transform: [{ translateX: -95 }],
    minWidth: 190,
    minHeight: 54,
    borderRadius: 8,
    backgroundColor: "#050202",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
    boxShadow: "0 12px 28px rgba(0,0,0,0.34)"
  } as any,
  footerCityBadgeMobile: {
    minWidth: 168,
    minHeight: 48,
    transform: [{ translateX: -84 }]
  },
  footerCityBadgeText: {
    color: "#ffffff",
    fontFamily: "Karla, sans-serif",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 5,
    fontWeight: "800"
  },
  footerText: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 18,
    lineHeight: 29,
    marginTop: 24,
    fontWeight: "700",
    maxWidth: 360
  },
  footerTextMobile: {
    textAlign: "center",
    maxWidth: 520,
    marginTop: 22,
    marginBottom: 4
  },
  footerContent: {
    flexGrow: 2,
    flexShrink: 1,
    flexBasis: 460,
    minWidth: 360,
    maxWidth: 620,
    alignItems: "stretch"
  },
  footerContentMobile: {
    minWidth: 0,
    width: "100%",
    maxWidth: "100%",
    alignItems: "stretch",
    marginTop: 0
  },
  footerActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24
  },
  footerButton: {
    minHeight: 46,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 9,
    alignItems: "center",
    justifyContent: "center",
    transitionDuration: "180ms"
  } as any,
  footerButtonMobile: {
    flexGrow: 1,
    flexBasis: "48%",
    minWidth: 150
  },
  footerButtonPrimary: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff"
  },
  footerButtonActive: {
    transform: [{ translateY: -2 }],
    borderColor: "rgba(255,255,255,0.76)",
    boxShadow: "0 14px 28px rgba(0,0,0,.24)"
  } as any,
  footerButtonText: {
    color: "#ffffff",
    fontFamily: "Karla, sans-serif",
    fontSize: 13,
    letterSpacing: 1.2,
    fontWeight: "700",
    whiteSpace: "nowrap"
  } as any,
  footerButtonTextPrimary: {
    color: colors.red
  },
  socialLogo: {
    width: 22,
    height: 22
  },
  socialLogoPrimary: {
    filter: "brightness(0) saturate(100%) invert(17%) sepia(45%) saturate(2199%) hue-rotate(342deg) brightness(85%) contrast(96%)"
  } as any,
  footerMetaGrid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 14,
    marginBottom: 28
  } as any,
  footerMetaGridMobile: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10
  } as any,
  footerInfoBlock: {
    minHeight: 128,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.055)",
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 18
  },
  footerAddressBlock: {
    gridColumn: "1 / -1",
    minHeight: 0
  } as any,
  footerInfoText: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 15,
    lineHeight: 24,
    overflowWrap: "normal"
  } as any,
  footerInfoStrong: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 19,
    lineHeight: 26,
    fontWeight: "800",
    marginTop: 7,
    whiteSpace: "nowrap"
  } as any,
  footerAddressText: {
    whiteSpace: "normal",
    overflowWrap: "anywhere"
  } as any,
  footerAddressActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16
  },
  footerSmallButton: {
    minHeight: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.26)",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    transitionDuration: "180ms",
    transitionProperty: "transform, border-color, background-color"
  } as any,
  footerSmallButtonPrimary: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff"
  },
  footerSmallButtonActive: {
    transform: [{ translateY: -2 }],
    borderColor: "rgba(255,255,255,0.78)"
  },
  footerSmallButtonText: {
    color: "#ffffff",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: "800"
  },
  footerSmallButtonTextPrimary: {
    color: colors.red
  },
  copyToast: {
    alignSelf: "flex-start",
    marginTop: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  copyToastText: {
    color: "#ffffff",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    fontWeight: "800"
  },
  footerHeading: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    letterSpacing: 2.8,
    fontWeight: "700",
    marginBottom: 12,
    whiteSpace: "nowrap"
  } as any,
  footerLegalSection: {
    marginTop: 2,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    position: "relative",
    zIndex: 2
  },
  footerLinkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
    position: "relative",
    zIndex: 2
  },
  footerLinkRowMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 4,
    marginBottom: 14
  },
  footerLegalButton: {
    minHeight: 30,
    justifyContent: "center"
  },
  footerLink: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "700"
  },
  footerFaqText: {
    color: "rgba(255,255,255,0.68)",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 4,
    maxWidth: 760
  },
  copyright: {
    color: "rgba(255,255,255,0.58)",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    letterSpacing: 1.1,
    marginTop: 12,
    lineHeight: 20,
    display: "block"
  } as any
});

export default App;
