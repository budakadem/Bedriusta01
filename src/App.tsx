import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from "react-native";
import {
  additiveLegend,
  allergenLegend,
  restaurantMenuSections,
  type MenuDiet
} from "./menuData";
import { NotificationCenter } from "./components/NotificationCenter";
import { CustomerReviewSection } from "./components/CustomerReviewSection";
import { getJobsPageMetadata, JobsPage, type PageMetadata } from "./components/JobsPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { ReservationPage } from "./components/ReservationPage";
import { getSiteLanguage, setSiteLanguage, subscribeToSiteLanguage, type SiteLanguage } from "./siteLanguage";

const logoImage = "/images/brand/bedri-usta-logo-rectangular.png";
const portraitImage = "/images/bedri-portrait.png";
const heroVideo = "/videos/hero-deneme02.mp4";
const editorialHeroImage = "/images/mannheim-editorial-hero-v2.webp";
const aboutIllustrationImage = "/images/bedri-usta-about-illustration.webp";
const languageGlobeIcon = "/icons/ui/language-globe.svg";
const loginUserIcon = "/icons/ui/user.svg";
const sharePageIcon = "/icons/ui/share.svg";
const quickActionIcons = {
  menu: "/icons/ui/menu.svg",
  reservation: "/icons/ui/reservation.svg",
  instagram: "/icons/ui/instagram-outline.svg",
  instagramDock: "/icons/ui/instagram-outline.svg",
  directions: "/icons/ui/directions.svg",
  email: "/icons/ui/email.svg",
  youtube: "/icons/ui/youtube-outline.svg",
  contact: "/icons/ui/contact.svg",
  phone: "/icons/ui/phone.svg",
  whatsapp: "/icons/ui/whatsapp.svg",
  facebook: "/icons/ui/facebook-outline.svg",
  tiktok: "/icons/ui/tiktok-outline.svg",
  twitter: "/icons/ui/x.svg"
} as const;
type QuickActionIconName = keyof typeof quickActionIcons;
const menuKebabImage = "/images/menu-adana-portrait.webp";
const menuDonerImage = "/images/menu-doner-portrait.webp";
const menuLahmacunImage = "/images/menu-lahmacun-portrait.webp";
const menuTavaImage = "/images/menu-tava-portrait.webp";
const menuBreakfastImage = "/images/menu-kahvalti-portrait.webp";
const menuMezeImage = "/images/menu-meze-portrait.webp";
const menuDessertImage = "/images/menu-dessert-portrait.webp";
const menuCafeImage = "/images/menu-cafe-portrait-v1.webp";
const restaurantAddress = "K1 1-4, 68159 Mannheim, Almanya";
const googleMapsPlaceLink = "https://maps.app.goo.gl/NZHsiEJmyTg9nVgRA";
const restaurantOpeningHours = [
  { days: "Pazar — Perşembe", time: "08:00 — 24:00" },
  { days: "Cuma — Cumartesi", time: "08:00 — 01:00" }
] as const;
const defaultShareImage = "/images/mannheim-editorial-hero-v2.webp";

function getRouteMetadata(pathname: string): PageMetadata {
  if (pathname === "/menu") {
    return {
      title: "Menü | Bedri Usta Mannheim",
      description: "Bedri Usta Mannheim menüsünü, kebapları, taş fırın lezzetlerini, mezeleri ve tatlıları keşfet."
    };
  }
  if (pathname === "/hakkimizda") {
    return {
      title: "Hakkımızda | Bedri Usta Mannheim",
      description: "Bedri Usta’nın ustalık yolculuğunu ve Mannheim’daki Türk misafirperverliği anlayışını keşfet."
    };
  }
  if (pathname === "/politikalarimiz") {
    return {
      title: "Politikalarımız | Bedri Usta Mannheim",
      description: "Bedri Usta Mannheim kalite, hijyen, gıda güvenliği ve veri koruma politikalarını incele."
    };
  }
  if (pathname === "/datenschutz") {
    return {
      title: "Datenschutz | Bedri Usta Mannheim",
      description: "Bedri Usta Mannheim web sitesi, PWA, bildirimler, rezervasyon, iletişim ve iş başvuruları için veri koruma bilgilendirmesi."
    };
  }
  if (pathname === "/datenschutz/bewerbung") {
    return {
      title: "Datenschutz | Bedri Usta Mannheim",
      description: "Bedri Usta Mannheim web sitesi, PWA, bildirimler, rezervasyon, iletişim ve iş başvuruları için veri koruma bilgilendirmesi."
    };
  }
  if (pathname === "/rezervasyon") {
    return {
      title: "Rezervasyon | Bedri Usta Mannheim",
      description: "Bedri Usta Mannheim için kişi sayını, tarihini ve saatini seç; rezervasyonunu veya grup talebini güvenli biçimde hazırla."
    };
  }
  if (pathname === "/jobs" || pathname.startsWith("/jobs/")) return getJobsPageMetadata(pathname);

  return {
    title: "Bedri Usta Mannheim",
    description: "Bedri Usta Mannheim’da ustalıkla hazırlanan kebapları, özenli servisi ve sıcak Türk misafirperverliğini keşfet."
  };
}

function ensureMeta(selector: string, attributes: Record<string, string>, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function updatePageMetadata(pathname: string) {
  const metadata = getRouteMetadata(pathname);
  const canonicalUrl = new URL(pathname || "/", window.location.origin).toString();
  const imageUrl = new URL(defaultShareImage, window.location.origin).toString();
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  document.title = metadata.title;
  ensureMeta('meta[name="description"]', { name: "description" }, metadata.description);
  ensureMeta('meta[property="og:title"]', { property: "og:title" }, metadata.title);
  ensureMeta('meta[property="og:description"]', { property: "og:description" }, metadata.description);
  ensureMeta('meta[property="og:image"]', { property: "og:image" }, imageUrl);
  ensureMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
  ensureMeta('meta[property="og:type"]', { property: "og:type" }, "website");
  ensureMeta('meta[property="og:site_name"]', { property: "og:site_name" }, "Bedri Usta Mannheim");
  ensureMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
  ensureMeta('meta[name="twitter:title"]', { name: "twitter:title" }, metadata.title);
  ensureMeta('meta[name="twitter:description"]', { name: "twitter:description" }, metadata.description);
  ensureMeta('meta[name="twitter:image"]', { name: "twitter:image" }, imageUrl);

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;
}

const navItems = [
  { label: "Anasayfa", href: "/" },
  {
    label: "Kurumsal",
    items: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Jobs", href: "/jobs" },
      { label: "Politikalarımız", href: "/politikalarimiz" }
    ]
  },
  { label: "İletişim", href: "/#contact" },
  { label: "Menü", href: "/menu" },
  { label: "Rezervasyon", href: "/rezervasyon" }
];

const languageOptions = [
  { code: "TR", label: "Türkçe" },
  { code: "DE", label: "Deutsch" },
  { code: "ENG", label: "English" }
] as const;

const mobilePrimaryNavItems = [
  { label: "Anasayfa", href: "/" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Jobs", href: "/jobs" },
  { label: "Politikalarımız", href: "/politikalarimiz" },
  { label: "İletişim", href: "/#contact" },
  { label: "FAQ", href: "/#contact" }
];

const mobileLegalNavItems: Array<{ label: string; href?: string; disabled?: boolean }> = [
  { label: "Impressum", href: "/#policies" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Cookie-Einstellungen", href: "/datenschutz#cookies" },
  { label: "AGB", disabled: true }
];

const menuItems = [
  {
    title: "Adana",
    text: "Zırh kıyma, özenle seçilen baharatlar ve yılların ustalığıyla hazırlanan Bedri Usta klasiği.",
    image: menuKebabImage
  },
  {
    title: "Meze",
    text: "Sofrayı yavaşlatan, sohbeti uzatan kremamsı ve ferah tabaklar.",
    image: menuMezeImage
  },
  {
    title: "Yaprak Döner",
    text: "Kat kat dizilen et yapraklarının ustalıkla pişirilip ince kesilmesiyle hazırlanan güçlü bir klasik.",
    image: menuDonerImage
  },
  {
    title: "Lahmacun",
    text: "İnce hamur, taze yeşillik ve sıcak fırından çıkan çıtır bir klasik.",
    image: menuLahmacunImage
  },
  {
    title: "Tava",
    text: "Fırından gelen sıcaklık, dengeli baharat ve paylaşmalık bereketli sunum.",
    image: menuTavaImage
  },
  {
    title: "Kahvaltı",
    text: "Çay, sıcak ekmek ve özenle seçilmiş tatlarla güne sıcak bir başlangıç.",
    image: menuBreakfastImage
  },
  {
    title: "Tatlı",
    text: "Yemeğin sonunda dengeli, sıcak ve zarif bir kapanış hissi.",
    image: menuDessertImage
  },
  {
    title: "Café",
    text: "Kahveden pastaya, sıcak ve soğuk içeceklerle Mannheim’ın yeni buluşma noktası.",
    image: menuCafeImage
  }
];

const proofItems = [
  ["Usta İşi", "Her tabak aynı özenle hazırlanır: sade, net ve hafızada kalıcı."],
  ["Lezzet Dengesi", "Tuz, acı ve doku aynı sofrada kusursuz bir uyum yakalar."],
  ["Misafirlik", "Sıcak karşılama, özenli servis ve sofrada kendini özel hissettiren bir restoran deneyimi."]
];

function navigateToPath(target: string) {
  window.history.pushState({}, "", target);
  window.dispatchEvent(new PopStateEvent("popstate"));

  const hash = target.includes("#") ? `#${target.split("#")[1]}` : "";
  if (hash) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    return;
  }

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
  window.location.assign(googleMapsPlaceLink);
}

function ScrollReveal({
  children,
  delay = 0,
  style,
  accessibilityElementsHidden = false
}: {
  children: ReactNode;
  delay?: number;
  style?: any;
  accessibilityElementsHidden?: boolean;
}) {
  const elementRef = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current as HTMLElement | null;

    if (!element) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px"
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <View
      ref={elementRef}
      accessibilityElementsHidden={accessibilityElementsHidden}
      importantForAccessibility={accessibilityElementsHidden ? "no-hide-descendants" : "auto"}
      style={[
        style,
        styles.scrollReveal,
        visible ? styles.scrollRevealVisible : styles.scrollRevealHidden,
        { transitionDelay: `${delay}ms` }
      ]}
    >
      {children}
    </View>
  );
}

function App() {
  const { width } = useWindowDimensions();
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [reservationAddressCopied, setReservationAddressCopied] = useState(false);
  const reservationCopyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const layout = useMemo(
    () => ({
      isMobile: width < 1180,
      isTablet: width >= 600 && width < 1180,
      showBottomDock: width < 900,
      compactActions: width < 600
    }),
    [width]
  );

  useEffect(() => {
    const handleRouteChange = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      if (reservationCopyTimer.current) clearTimeout(reservationCopyTimer.current);
    };
  }, []);

  const handleReservationCopyAddress = async () => {
    await copyAddress(() => {
      setReservationAddressCopied(true);
      if (reservationCopyTimer.current) clearTimeout(reservationCopyTimer.current);
      reservationCopyTimer.current = setTimeout(() => setReservationAddressCopied(false), 2600);
    });
  };

  useEffect(() => {
    updatePageMetadata(pathname.replace(/\/+$/, "") || "/");
  }, [pathname]);

  if (pathname.replace(/\/+$/, "") === "/politikalarimiz") {
    return (
      <View style={[styles.page, styles.pageWithBottomDock]}>
        <Header isMobile={layout.isMobile} />
        <PoliciesPage isMobile={layout.isMobile} />
        <Footer isMobile={layout.isMobile} />
        <BackToTopButton desktop={!layout.showBottomDock} />
        <MobileActionDock desktop={!layout.showBottomDock} />
      </View>
    );
  }
  if (pathname.replace(/\/+$/, "") === "/hakkimizda") {
    return (
      <View style={[styles.page, styles.pageWithBottomDock]}>
        <Header isMobile={layout.isMobile} />
        <AboutPage isMobile={layout.isMobile} />
        <Footer isMobile={layout.isMobile} />
        <BackToTopButton desktop={!layout.showBottomDock} />
        <MobileActionDock desktop={!layout.showBottomDock} />
      </View>
    );
  }
  if (pathname.replace(/\/+$/, "") === "/menu") {
    return (
      <View style={[styles.page, styles.pageWithBottomDock]}>
        <Header isMobile={layout.isMobile} />
        <RestaurantMenuPage isMobile={layout.isMobile} />
        <Footer isMobile={layout.isMobile} />
        <BackToTopButton desktop={!layout.showBottomDock} />
        <MobileActionDock desktop={!layout.showBottomDock} />
      </View>
    );
  }
  if (pathname.replace(/\/+$/, "") === "/datenschutz") {
    return (
      <View style={[styles.page, styles.pageWithBottomDock]}>
        <Header isMobile={layout.isMobile} />
        <PrivacyPage />
        <Footer isMobile={layout.isMobile} />
        <BackToTopButton desktop={!layout.showBottomDock} />
        <MobileActionDock desktop={!layout.showBottomDock} />
      </View>
    );
  }
  if (pathname.replace(/\/+$/, "") === "/datenschutz/bewerbung") {
    return (
      <View style={[styles.page, styles.pageWithBottomDock]}>
        <Header isMobile={layout.isMobile} />
        <PrivacyPage />
        <Footer isMobile={layout.isMobile} />
        <BackToTopButton desktop={!layout.showBottomDock} />
        <MobileActionDock desktop={!layout.showBottomDock} />
      </View>
    );
  }
  if (pathname.replace(/\/+$/, "") === "/rezervasyon") {
    return (
      <View style={[styles.page, styles.pageWithBottomDock]}>
        <Header isMobile={layout.isMobile} />
        <ReservationPage />
        <Footer isMobile={layout.isMobile} />
        <BackToTopButton desktop={!layout.showBottomDock} />
        <MobileActionDock desktop={!layout.showBottomDock} />
      </View>
    );
  }
  if (
    pathname.replace(/\/+$/, "") === "/jobs" ||
    pathname.replace(/\/+$/, "").startsWith("/jobs/")
  ) {
    return (
      <View style={[styles.page, styles.pageWithBottomDock]}>
        <Header isMobile={layout.isMobile} />
        <JobsPage />
        <Footer isMobile={layout.isMobile} />
        <BackToTopButton desktop={!layout.showBottomDock} />
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
              layout.isMobile && styles.editorialHeroMediaMobile,
              layout.isTablet && styles.editorialHeroMediaTablet
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
            <ScrollReveal style={styles.heroRevealLine}>
              <Text
                style={[
                  styles.editorialHeroEyebrow,
                  layout.isMobile && styles.editorialHeroEyebrowMobile
                ]}
              >
                ADANA Ocakbaşı
              </Text>
            </ScrollReveal>
            <ScrollReveal delay={90} style={styles.heroRevealLine}>
              <Text
                style={[
                  styles.editorialHeroTitle,
                  layout.isMobile && styles.editorialHeroTitleMobile
                ]}
              >
                Bedri Usta Mannheim
              </Text>
            </ScrollReveal>
            <ScrollReveal delay={180} style={styles.heroRevealLine}>
              <Text
                style={[
                  styles.editorialHeroSubtitle,
                  layout.isMobile && styles.editorialHeroSubtitleMobile
                ]}
              >
                KEBAP & GRILL RESTAURANT & CAFE
              </Text>
            </ScrollReveal>
            <ScrollReveal delay={270} style={styles.heroRevealLine}>
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
            </ScrollReveal>
          </View>
        </View>
      </View>

      <View style={[styles.campaignHero, layout.isMobile && styles.campaignHeroMobile]}>
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          onLoadedMetadata={(event) => {
            event.currentTarget.muted = true;
            event.currentTarget.defaultMuted = true;
          }}
          onCanPlay={(event) => {
            void event.currentTarget.play().catch(() => {
              // Veri tasarrufu veya cihaz politikası otomatik oynatmayı engelleyebilir.
            });
          }}
          aria-label="Bedri Usta New Story Germany"
          style={StyleSheet.flatten(
            [
              styles.campaignHeroVideo,
              layout.isMobile && styles.campaignHeroVideoMobile
            ]
          ) as any}
        />
      </View>

      <View nativeID="about" style={[styles.section, styles.storySection]}>
        <View style={styles.storyGrid}>
          <ScrollReveal style={styles.storyCopy}>
            <Text style={styles.eyebrowDark}>HAKKIMIZDA · BEDRİ USTA</Text>
            <Text style={[styles.sectionTitle, layout.isMobile && styles.sectionTitleMobile]}>
              Mardin’den Adana’ya, ocak başından dünyaya.
            </Text>
            <Text style={styles.bodyText}>
              1970 yılında Mardin’in Altıyol köyünde dünyaya gelen Bedrettin
              Aydoğdu, yedi yaşında Adana’da çalışmaya ve mesleği öğrenmeye başladı.
              Çocuk yaşta ocak başında başlayan bu yolculukta, yıllar içinde
              herkesin Bedri Usta olarak tanıdığı, gerçek Türk kebabının güçlü
              temsilcilerinden biri oldu.
            </Text>
            <Text style={[styles.bodyText, styles.storyParagraphSecondary]}>
              Adana’da başlayan yolculuk İstanbul’a, ardından yurt içi ve yurt
              dışındaki restoranlara uzandı. Marka büyürken Bedri Usta ocağın
              başından ayrılmadı; imza lezzetlerini ve sıcak
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
              <View style={styles.storyFact}>
                <Text style={styles.storyFactValue}>2026</Text>
                <Text style={styles.storyFactLabel}>Mannheim</Text>
              </View>
            </View>
          </ScrollReveal>
        </View>
      </View>

      <View nativeID="menu" style={[styles.section, styles.menuSection]}>
        <ScrollReveal style={styles.sectionHeader}>
          <Text style={styles.menuEyebrow}>MENÜMÜZ</Text>
          <Text style={[styles.menuSectionTitle, layout.isMobile && styles.sectionTitleMobile]}>
            Paylaşılan her tabakta ustalık, her sofrada güzel bir sohbet var.
          </Text>
        </ScrollReveal>
        <HorizontalCardRail
          id="featured-menu-card-rail"
          accessibilityLabel="Öne çıkan lezzetler"
          tone="paper"
          autoPlay
          loop
        >
          {[...menuItems, ...menuItems, ...menuItems].map((item, index) => {
            const displayIndex = index % menuItems.length;
            const isLoopClone = index >= menuItems.length;

            return (
              <View
                key={`${item.title}-${Math.floor(index / menuItems.length)}`}
                accessibilityElementsHidden={isLoopClone}
                importantForAccessibility={isLoopClone ? "no-hide-descendants" : "auto"}
                style={styles.menuRailItem}
              >
                <Pressable
                  style={({ hovered, pressed }: any) => [
                    styles.menuCard,
                    (hovered || pressed) && styles.menuCardActive
                  ]}
                >
                  {({ hovered, pressed }: any) => {
                    const active = hovered || pressed;
                    return (
                      <View style={styles.menuCardMedia}>
                        <Image
                          source={{ uri: item.image }}
                          style={[styles.menuImage, active && styles.menuImageActive] as any}
                          resizeMode="cover"
                        />
                        <View style={styles.menuBackShade} />
                        <Text style={styles.menuCardNumber}>{String(displayIndex + 1).padStart(2, "0")}</Text>
                        <View style={styles.menuBackCaption}>
                          <Text style={styles.menuBackTitle}>{item.title}</Text>
                          <Text style={styles.menuCardDescription}>{item.text}</Text>
                        </View>
                      </View>
                    );
                  }}
                </Pressable>
              </View>
            );
          })}
        </HorizontalCardRail>
      </View>

      <View style={[styles.section, styles.craftSection]}>
        <ScrollReveal style={[styles.craftInner, layout.isMobile && styles.stack]}>
          <Text style={[styles.craftTitle, layout.isMobile && styles.sectionTitleMobile]}>
            Ustalık, özenle hazırlanır; sofrada zarif bir deneyime dönüşür.
          </Text>
          <View style={styles.proofList}>
            {proofItems.map(([title, text]) => (
              <View key={title} style={styles.proofItem}>
                <Text style={styles.proofTitle}>{title}</Text>
                <Text style={styles.proofText}>{text}</Text>
              </View>
            ))}
          </View>
        </ScrollReveal>
      </View>

      <View style={[styles.section, styles.contactSection]}>
        <ScrollReveal style={[styles.contactPanel, layout.isMobile && styles.contactPanelMobile]}>
          <View style={styles.contactCopy}>
            <View style={styles.contactAccentLine} />
            <Text style={[styles.contactKicker, layout.isMobile && styles.contactKickerMobile]}>
              REZERVASYON · EVENTS · MANNHEIM
            </Text>
            <Text style={[styles.contactTitle, layout.isMobile && styles.contactTitleMobile]}>
              Özel anlar, özenle hazırlanan sofralarda hatırlanır.
            </Text>
            <Text style={styles.contactText}>
              Doğum günü, aile yemeği, iş buluşması ya da sakin bir akşam için
              Bedri Usta deneyiminizi şimdiden planlayın.
            </Text>

            <View style={[styles.contactDetails, layout.isMobile && styles.contactDetailsMobile]}>
              {restaurantOpeningHours.map((hours) => (
                <View key={hours.days} style={styles.contactDetail}>
                  <Text style={styles.contactDetailLabel}>{hours.days.toLocaleUpperCase("tr-TR")}</Text>
                  <Text style={styles.contactDetailValue}>{hours.time}</Text>
                </View>
              ))}
              <View style={styles.contactDetail}>
                <Text style={styles.contactDetailLabel}>MANNHEIM</Text>
                <Text style={styles.contactDetailValue}>K1 1-4 · 68159</Text>
              </View>
            </View>
            <View style={styles.contactAddressActions}>
              <Pressable
                onPress={handleReservationCopyAddress}
                accessibilityRole="button"
                accessibilityLabel="Bedri Usta Mannheim adresini kopyala"
                style={({ hovered, pressed }: any) => [
                  styles.contactAddressAction,
                  (hovered || pressed) && styles.contactAddressActionActive
                ]}
              >
                <Text style={styles.contactAddressActionText}>Adresi kopyala</Text>
              </Pressable>
              <Text style={styles.contactAddressDivider}>·</Text>
              <Pressable
                onPress={openMapForAddress}
                accessibilityRole="link"
                accessibilityLabel="Bedri Usta Mannheim adresini haritada aç"
                style={({ hovered, pressed }: any) => [
                  styles.contactAddressAction,
                  (hovered || pressed) && styles.contactAddressActionActive
                ]}
              >
                <Text style={styles.contactAddressActionText}>Haritada aç ↗</Text>
              </Pressable>
            </View>
            {reservationAddressCopied && (
              <Text style={styles.contactAddressCopied} accessibilityLiveRegion="polite">
                Adres kopyalandı.
              </Text>
            )}
          </View>

          <View
            style={[
              styles.contactActionColumn,
              layout.isMobile && styles.contactActionColumnMobile
            ]}
          >
            <Text style={styles.contactActionIntro}>
              Planınızı seçin, gerisini biz hazırlayalım.
            </Text>
            <Pressable
              onPress={() => openNavigationTarget("/rezervasyon")}
              accessibilityRole="link"
              accessibilityLabel="Rezervasyon sayfasını aç"
              style={({ hovered, pressed }: any) => [
                styles.contactAction,
                styles.contactActionPrimary,
                (hovered || pressed) && styles.contactActionPrimaryActive
              ]}
            >
              <View>
                <Text style={styles.contactActionLabelPrimary}>REZERVASYON</Text>
                <Text style={styles.contactActionTextPrimary}>Masanızı ayırtın</Text>
              </View>
              <Text style={styles.contactActionArrowPrimary}>↗</Text>
            </Pressable>

            <Pressable
              onPress={() => openNavigationTarget("/menu")}
              accessibilityRole="link"
              accessibilityLabel="Menüyü incele"
              style={({ hovered, pressed }: any) => [
                styles.contactAction,
                styles.contactActionSecondary,
                (hovered || pressed) && styles.contactActionSecondaryActive
              ]}
            >
              <View>
                <Text style={styles.contactActionLabelSecondary}>MENÜ</Text>
                <Text style={styles.contactActionTextSecondary}>Lezzetleri inceleyin</Text>
              </View>
              <Text style={styles.contactActionArrowSecondary}>→</Text>
            </Pressable>
          </View>
        </ScrollReveal>
      </View>

      <CustomerReviewSection />
      <QuickActionsSection compact={layout.compactActions} tablet={layout.isTablet} />
      <Footer isMobile={layout.isMobile} />
      <BackToTopButton desktop={!layout.showBottomDock} />
      <MobileActionDock desktop={!layout.showBottomDock} />
    </View>
  );
}

function RestaurantMenuPage({ isMobile }: { isMobile: boolean }) {
  const [query, setQuery] = useState("");
  const [dietFilter, setDietFilter] = useState<"all" | MenuDiet>("all");
  const searchWasActive = useRef(false);
  const itemCount = useMemo(
    () => restaurantMenuSections.reduce((total, section) => total + section.items.length, 0),
    []
  );
  const visibleSections = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");

    return restaurantMenuSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const matchesSearch =
            !normalizedQuery ||
            item.name.toLocaleLowerCase("tr-TR").includes(normalizedQuery);
          const matchesDiet =
            dietFilter === "all" ||
            (dietFilter === "vegan"
              ? item.diet === "vegan"
              : item.diet === "vegetarian" || item.diet === "vegan");

          return matchesSearch && matchesDiet;
        })
      }))
      .filter((section) => section.items.length > 0);
  }, [dietFilter, query]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Menü | Bedri Usta Mannheim";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const searchIsActive = query.trim().length > 0;

    if (searchIsActive && !searchWasActive.current) {
      window.setTimeout(() => {
        document
          .getElementById("restaurant-menu-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }

    searchWasActive.current = searchIsActive;
  }, [query]);

  const scrollToMenuSection = (sectionId: string) => {
    document
      .getElementById(`menu-category-${sectionId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollMenuCategories = (direction: -1 | 1) => {
    const rail = document.getElementById("restaurant-menu-categories");

    if (!rail) return;

    rail.scrollBy({
      left: direction * Math.min(rail.clientWidth * 0.78, 520),
      behavior: "smooth"
    });
  };

  const openMenuPdf = (fileName: string) => {
    window.open(`/menu/${fileName}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <View style={[styles.restaurantMenuHero, isMobile && styles.restaurantMenuHeroMobile]}>
        <View style={styles.restaurantMenuHeroGlow} />
        <View style={[styles.restaurantMenuHeroInner, isMobile && styles.restaurantMenuHeroInnerMobile]}>
          <View style={styles.restaurantMenuHeroCopy}>
            <Text style={styles.restaurantMenuEyebrow}>GÜNCEL MENÜ · MANNHEIM</Text>
            <Text
              style={[
                styles.restaurantMenuHeroTitle,
                isMobile && styles.restaurantMenuHeroTitleMobile
              ]}
            >
              Ustalıkla hazırlanır, birlikte paylaşılır.
            </Text>
            <Text
              style={[
                styles.restaurantMenuHeroLead,
                isMobile && styles.restaurantMenuHeroLeadMobile
              ]}
            >
              Mezeden kebaba, taş fırından tatlıya; ürünler ve açık alerjen
              bilgileriyle tüm menü tek sayfada.
            </Text>
          </View>

          <View style={[styles.restaurantMenuEdition, isMobile && styles.restaurantMenuEditionMobile]}>
            <Text style={styles.restaurantMenuEditionLabel}>20.07.2026</Text>
            <Text style={styles.restaurantMenuEditionValue}>{itemCount} ürün</Text>
            <Text
              style={[
                styles.restaurantMenuEditionMeta,
                isMobile && styles.restaurantMenuEditionMetaMobile
              ]}
            >
              {restaurantMenuSections.length} bölüm · alerjen bilgileri açıkça belirtilmiştir
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.restaurantMenuTools}>
        <View style={styles.restaurantMenuToolsInner}>
          <View style={[styles.restaurantMenuSearchRow, isMobile && styles.restaurantMenuSearchRowMobile]}>
            <View style={styles.restaurantMenuSearch}>
              <Text style={styles.restaurantMenuSearchIcon}>⌕</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Menüde ara: Adana, humus, künefe..."
                placeholderTextColor="#8c7f78"
                accessibilityLabel="Menüde ara"
                style={styles.restaurantMenuSearchInput}
              />
              {query.length > 0 && (
                <Pressable
                  onPress={() => setQuery("")}
                  accessibilityRole="button"
                  accessibilityLabel="Aramayı temizle"
                  style={styles.restaurantMenuSearchClear}
                >
                  <Text style={styles.restaurantMenuSearchClearText}>×</Text>
                </Pressable>
              )}
            </View>
          </View>

          <View
            style={[
              styles.restaurantMenuCommandRow,
              isMobile && styles.restaurantMenuCommandRowMobile
            ]}
          >
            <View style={styles.restaurantMenuFilters}>
              {[
                ["all", "Tümü", ""],
                ["vegetarian", "Vejetaryen", "●"],
                ["vegan", "Vegan", "◆"]
              ].map(([value, label, symbol]) => {
                const active = dietFilter === value;
                return (
                  <Pressable
                    key={value}
                    onPress={() => setDietFilter(value as "all" | MenuDiet)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    style={[
                      styles.restaurantMenuFilter,
                      active && styles.restaurantMenuFilterActive,
                      active && value === "vegetarian" && styles.restaurantMenuFilterVegetarian,
                      active && value === "vegan" && styles.restaurantMenuFilterVegan
                    ]}
                  >
                    <Text
                      style={[
                        styles.restaurantMenuFilterText,
                        active && styles.restaurantMenuFilterTextActive
                      ]}
                    >
                      {symbol ? `${symbol} ${label}` : label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View
              nativeID="restaurant-menu-utilities"
              style={[
                styles.restaurantMenuUtilityRow,
                isMobile && styles.restaurantMenuUtilityRowMobile
              ]}
            >
              <Pressable
                onPress={() => openMenuPdf("bedri-usta-allergen-katki.pdf")}
                style={({ hovered, pressed }: any) => [
                  styles.restaurantMenuUtilityButton,
                  (hovered || pressed) && styles.restaurantMenuUtilityButtonActive
                ]}
                accessibilityRole="link"
                accessibilityLabel="Alerjen PDF dosyasını aç"
              >
                <Text style={styles.restaurantMenuUtilityIcon}>↗</Text>
                <Text style={styles.restaurantMenuUtilityText}>ALERJEN PDF</Text>
              </Pressable>
              <Pressable
                onPress={() => scrollToMenuSection("allergen-guide")}
                style={({ hovered, pressed }: any) => [
                  styles.restaurantMenuAllergenJump,
                  (hovered || pressed) && styles.restaurantMenuAllergenJumpActive
                ]}
                accessibilityRole="link"
                accessibilityLabel="Alerjen kodlarını açıkla"
              >
                <Text style={styles.restaurantMenuAllergenJumpText}>KOD REHBERİ</Text>
                <Text style={styles.restaurantMenuAllergenJumpArrow}>↓</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.restaurantMenuCategoryRailShell}>
            <Pressable
              onPress={() => scrollMenuCategories(-1)}
              accessibilityRole="button"
              accessibilityLabel="Önceki menü kategorilerini göster"
              style={({ hovered, pressed }: any) => [
                styles.restaurantMenuCategoryArrow,
                styles.restaurantMenuCategoryArrowLeft,
                (hovered || pressed) && styles.restaurantMenuCategoryArrowActive
              ]}
            >
              <Text style={styles.restaurantMenuCategoryArrowText}>‹</Text>
            </Pressable>

            <View
              nativeID="restaurant-menu-categories"
              style={styles.restaurantMenuCategoryRail}
            >
              {restaurantMenuSections.map((section, index) => (
                <Pressable
                  key={section.id}
                  onPress={() => scrollToMenuSection(section.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`${section.title} bölümüne git`}
                  style={({ hovered, pressed }: any) => [
                    styles.restaurantMenuCategoryButton,
                    (hovered || pressed) && styles.restaurantMenuCategoryButtonActive
                  ]}
                >
                  <Text style={styles.restaurantMenuCategoryNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                  <Text style={styles.restaurantMenuCategoryText}>{section.title}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => scrollMenuCategories(1)}
              accessibilityRole="button"
              accessibilityLabel="Sonraki menü kategorilerini göster"
              style={({ hovered, pressed }: any) => [
                styles.restaurantMenuCategoryArrow,
                styles.restaurantMenuCategoryArrowRight,
                (hovered || pressed) && styles.restaurantMenuCategoryArrowActive
              ]}
            >
              <Text style={styles.restaurantMenuCategoryArrowText}>›</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View nativeID="restaurant-menu-results" style={styles.restaurantMenuBody}>
        <View style={styles.restaurantMenuBodyInner}>
          {visibleSections.length > 0 ? (
            visibleSections.map((section, sectionIndex) => (
              <View
                key={section.id}
                nativeID={`menu-category-${section.id}`}
                style={styles.restaurantMenuSection}
              >
                <View style={styles.restaurantMenuSectionHeading}>
                  <View style={styles.restaurantMenuSectionTitleRow}>
                    <Text style={styles.restaurantMenuSectionNumber}>
                      {String(
                        restaurantMenuSections.findIndex((item) => item.id === section.id) + 1
                      ).padStart(2, "0")}
                    </Text>
                    <Text
                      style={[
                        styles.restaurantMenuSectionTitle,
                        isMobile && styles.restaurantMenuSectionTitleMobile
                      ]}
                    >
                      {section.title}
                    </Text>
                    <Text style={styles.restaurantMenuSectionCount}>
                      ({section.items.length} ÜRÜN)
                    </Text>
                  </View>
                  <Text style={styles.restaurantMenuSectionNote}>{section.note}</Text>
                </View>

                <View
                  style={[
                    styles.restaurantMenuItemGrid,
                    isMobile && styles.restaurantMenuItemGridMobile
                  ]}
                >
                  {section.items.map((item) => (
                    <View
                      key={`${section.id}-${item.name}`}
                      style={[
                        styles.restaurantMenuItem,
                        item.requiresCheck && styles.restaurantMenuItemWarning
                      ]}
                    >
                      <View style={styles.restaurantMenuItemHeader}>
                        <View style={styles.restaurantMenuItemIdentity}>
                          <Text style={styles.restaurantMenuItemName}>{item.name}</Text>
                          <View style={styles.restaurantMenuInlineBadges}>
                            {item.allergens.map((code) => (
                              <View
                                key={code}
                                accessibilityLabel={`Alerjen ${code}`}
                                style={styles.restaurantMenuCode}
                              >
                                <Text style={styles.restaurantMenuCodeText}>{code}</Text>
                              </View>
                            ))}
                            {item.additives.map((code) => (
                              <View
                                key={code}
                                accessibilityLabel={`Katkı ${code}`}
                                style={[styles.restaurantMenuCode, styles.restaurantMenuAdditiveCode]}
                              >
                                <Text
                                  style={[
                                    styles.restaurantMenuCodeText,
                                    styles.restaurantMenuAdditiveCodeText
                                  ]}
                                >
                                  {code}
                                </Text>
                              </View>
                            ))}
                            {item.diet && (
                              <View
                                style={[
                                  styles.restaurantMenuDiet,
                                  item.diet === "vegan"
                                    ? styles.restaurantMenuDietVegan
                                    : styles.restaurantMenuDietVegetarian
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.restaurantMenuDietText,
                                    item.diet === "vegan"
                                      ? styles.restaurantMenuDietTextVegan
                                      : styles.restaurantMenuDietTextVegetarian
                                  ]}
                                >
                                  {item.diet === "vegan" ? "◆ VEGAN" : "● VEJETARYEN"}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>

                      {item.requiresCheck && (
                        <View style={styles.restaurantMenuCheckNotice}>
                          <Text style={styles.restaurantMenuCheckIcon}>!</Text>
                          <Text style={styles.restaurantMenuCheckText}>
                            KONTROL GEREKLİ · Siparişten önce personelden reçete ve
                            alerjen doğrulaması isteyiniz.
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                {sectionIndex < visibleSections.length - 1 && (
                  <View style={styles.restaurantMenuSectionDivider} />
                )}
              </View>
            ))
          ) : (
            <View style={styles.restaurantMenuEmpty}>
              <Text style={styles.restaurantMenuEmptyKicker}>SONUÇ BULUNAMADI</Text>
              <Text style={styles.restaurantMenuEmptyTitle}>
                Aramanıza uygun bir ürün yok.
              </Text>
              <Text style={styles.restaurantMenuEmptyText}>
                Farklı bir ürün adı deneyin veya beslenme filtresini temizleyin.
              </Text>
              <Pressable
                onPress={() => {
                  setQuery("");
                  setDietFilter("all");
                }}
                style={styles.restaurantMenuEmptyButton}
              >
                <Text style={styles.restaurantMenuEmptyButtonText}>FİLTRELERİ TEMİZLE</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <View nativeID="menu-category-allergen-guide" style={styles.restaurantMenuLegendSection}>
        <View style={styles.restaurantMenuLegendInner}>
          <View style={[styles.restaurantMenuLegendIntro, isMobile && styles.restaurantMenuLegendIntroMobile]}>
            <View>
              <Text style={styles.restaurantMenuLegendKicker}>ALERJEN & KATKI REHBERİ</Text>
              <Text
                style={[
                  styles.restaurantMenuLegendTitle,
                  isMobile && styles.restaurantMenuLegendTitleMobile
                ]}
              >
                Kodları bil, güvenle seç.
              </Text>
            </View>
            <Text style={styles.restaurantMenuLegendLead}>
              Kodlar güncel reçete ve hammadde kayıtlarına dayanır. Çapraz temas tamamen
              önlenemeyebilir; alerji veya intolerans durumunda siparişten önce ekibimizi
              bilgilendiriniz.
            </Text>
          </View>

          <View style={[styles.restaurantMenuLegendColumns, isMobile && styles.restaurantMenuLegendColumnsMobile]}>
            <View style={styles.restaurantMenuLegendColumn}>
              <Text style={styles.restaurantMenuLegendColumnTitle}>ALERJENLER · A—N</Text>
              <View style={styles.restaurantMenuLegendGrid}>
                {allergenLegend.map(([code, description]) => (
                  <View key={code} style={styles.restaurantMenuLegendItem}>
                    <Text style={styles.restaurantMenuLegendCode}>{code}</Text>
                    <Text style={styles.restaurantMenuLegendDescription}>{description}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.restaurantMenuLegendColumn}>
              <Text style={styles.restaurantMenuLegendColumnTitle}>KATKI MADDELERİ · Z1—Z13</Text>
              <View style={styles.restaurantMenuLegendGrid}>
                {additiveLegend.map(([code, description]) => (
                  <View key={code} style={styles.restaurantMenuLegendItem}>
                    <Text style={styles.restaurantMenuLegendCode}>{code}</Text>
                    <Text style={styles.restaurantMenuLegendDescription}>{description}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
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
      text: "Yedi yaşında meslekle tanıştı. Etin, baharatın ve sabrın dilini burada öğrendi."
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
        <View style={[styles.aboutHeroMain, isMobile && styles.aboutHeroMainMobile]}>
          <View style={[styles.aboutHeroCopy, isMobile && styles.aboutHeroCopyMobile]}>
            <Text style={styles.aboutPageEyebrow}>KÖKLERDEN DÜNYAYA</Text>
            <Text style={[styles.aboutPageTitle, isMobile && styles.aboutPageTitleMobile]}>
              Bir ömür, yarım asrı aşan ustalık, 20’yi aşkın şube.
            </Text>
            <Text style={[styles.aboutPageLead, isMobile && styles.aboutPageLeadMobile]}>
              Bedri Usta’nın hikâyesi Mardin’de başladı; Adana’da mesleğe dönüştü,
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
              source={{ uri: aboutIllustrationImage }}
              style={styles.aboutHeroFigure as any}
              resizeMode="contain"
              accessibilityLabel="Bedri Usta editoryal illüstrasyonu"
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
              Mesele yalnızca kebap değil; emeği, disiplini ve misafirliği birlikte yaşatmak.
            </Text>
            <Text style={styles.aboutManifestoText}>
              Çocuk yaşta başlayan meslek yolculuğu, yıllar içinde bir ustalık
              kültürüne dönüştü. Bedri Usta için iyi bir sofra; doğru ürünün,
              ustalığın ve samimi misafirliğin aynı anda buluşmasıdır.
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
            kültürüyle buluşuyor. Aynı özen, aynı ustalık, yeni bir şehir.
          </Text>
          <View style={[styles.heroActions, isMobile && styles.actionsMobile]}>
            <Button label="Menüyü İncele" onPress={() => openNavigationTarget("/menu")} primary />
            <Button label="Rezervasyon" onPress={() => openNavigationTarget("/rezervasyon")} />
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
            Politikalarımız
          </Text>
          <Text
            style={[styles.policyHeroSubtitle, isMobile && styles.policyHeroSubtitleMobile]}
          >
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
            accessibilityRole="button"
            accessibilityLabel={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            accessibilityState={{ expanded: mobileMenuOpen }}
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
          <View>
            {mobilePrimaryNavItems.map((item, index) => (
              <Pressable
                key={item.label}
                onPress={() => {
                  openNavigationTarget(item.href);
                  closeMobileMenu();
                }}
                accessibilityRole="link"
                style={[
                  styles.mobileMenuItem,
                  index < mobilePrimaryNavItems.length - 1 && styles.mobileMenuItemBorder
                ]}
              >
                <Text style={styles.mobileMenuText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.mobileMenuSectionDivider} />

          <View>
            {mobileLegalNavItems.map((item, index) => (
              <Pressable
                key={item.label}
                onPress={item.href ? () => {
                  openNavigationTarget(item.href as string);
                  closeMobileMenu();
                } : undefined}
                disabled={item.disabled}
                accessibilityRole={item.disabled ? undefined : "link"}
                accessibilityState={{ disabled: item.disabled }}
                style={[
                  styles.mobileMenuItem,
                  index < mobileLegalNavItems.length - 1 && styles.mobileMenuItemBorder,
                  item.disabled && styles.mobileMenuItemDisabled
                ]}
              >
                <Text style={[styles.mobileMenuText, item.disabled && styles.mobileMenuTextDisabled]}>
                  {item.label}
                </Text>
                {item.disabled && <Text style={styles.mobileMenuStatus}>HAZIRLANIYOR</Text>}
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function HeaderUtilities({ compact = false }: { compact?: boolean }) {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] =
    useState<(typeof languageOptions)[number]["code"]>(() => getSiteLanguage());
  const languageSelectorRef = useRef<any>(null);

  useEffect(() => {
    if (!languageOpen) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!languageSelectorRef.current?.contains(event.target)) {
        setLanguageOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLanguageOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [languageOpen]);

  return (
    <View
      style={[styles.headerUtilities, compact && styles.headerUtilitiesCompact]}
      accessibilityLabel="Paylaşım, kullanıcı ve dil seçenekleri"
    >
      <ShareButton compact={compact} />
      <Pressable
        onPress={() => setNotificationCenterOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Bildirim merkezini aç"
        accessibilityState={{ expanded: notificationCenterOpen }}
        style={({ hovered, pressed }: any) => [
          styles.headerLogin,
          compact && styles.headerLoginCompact,
          (hovered || pressed || notificationCenterOpen) && styles.headerUtilityActive
        ]}
      >
        <Image
          source={{ uri: loginUserIcon }}
          style={[styles.headerLoginIcon, compact && styles.headerLoginIconCompact] as any}
          resizeMode="contain"
        />
        <View style={styles.headerNotificationDot} />
      </Pressable>

      <View ref={languageSelectorRef} style={styles.languageSelector}>
        <Pressable
          onPress={() => setLanguageOpen((open) => !open)}
          accessibilityRole="button"
          accessibilityLabel={`Dil seçimi, seçili dil ${selectedLanguage}`}
          accessibilityState={{ expanded: languageOpen }}
          style={({ hovered, pressed }: any) => [
            styles.languageMark,
            compact && styles.languageMarkCompact,
            (hovered || pressed || languageOpen) && styles.headerUtilityActive
          ]}
        >
          <Image
            source={{ uri: languageGlobeIcon }}
            style={[styles.languageGlobe, compact && styles.languageGlobeCompact] as any}
            resizeMode="contain"
          />
          <Text style={[styles.languageCurrent, compact && styles.languageCurrentCompact]}>
            {selectedLanguage}
          </Text>
          {!compact && (
            <Text style={[styles.languageChevron, languageOpen && styles.languageChevronOpen]}>
              ⌄
            </Text>
          )}
        </Pressable>

        {languageOpen && (
          <View style={[styles.languageDropdownPanel, compact && styles.languageDropdownPanelCompact]}>
            <View style={styles.languageDropdownHeader}>
              <Text style={styles.languageDropdownKicker}>LANGUAGE</Text>
              <Text style={styles.languageDropdownTitle}>Dil seçimi</Text>
            </View>
            {languageOptions.map((language) => {
              const selected = selectedLanguage === language.code;

              return (
                <Pressable
                  key={language.code}
                  onPress={() => {
                    setSelectedLanguage(language.code);
                    setSiteLanguage(language.code);
                    setLanguageOpen(false);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={({ hovered, pressed }: any) => [
                    styles.languageDropdownItem,
                    selected && styles.languageDropdownItemSelected,
                    (hovered || pressed) && styles.languageDropdownItemHover
                  ]}
                >
                  <Text
                    style={[
                      styles.languageDropdownCode,
                      selected && styles.languageDropdownCodeSelected
                    ]}
                  >
                    {language.code}
                  </Text>
                  <Text style={styles.languageDropdownLabel}>{language.label}</Text>
                  <Text style={styles.languageDropdownCheck}>{selected ? "✓" : "→"}</Text>
                </Pressable>
              );
            })}
            <Text style={styles.languageDropdownNote}>
              Diğer dillerin içerikleri daha sonra bağlanacaktır.
            </Text>
          </View>
        )}
      </View>
      <NotificationCenter
        onClose={() => setNotificationCenterOpen(false)}
        visible={notificationCenterOpen}
      />
    </View>
  );
}

async function copyCurrentUrl(url: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = url;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  if (!copied) throw new Error("copy-failed");
}

function ShareButton({ compact = false }: { compact?: boolean }) {
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMessage(""), 2600);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content
      ?? "Bedri Usta Mannheim sayfasını keşfet.";
    const shareData = { title: document.title, text: description, url };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await copyCurrentUrl(url);
      showToast("Bağlantı kopyalandı");
    } catch {
      showToast("Bağlantı kopyalanamadı");
    }
  };

  return (
    <>
      <Pressable
        onPress={() => void handleShare()}
        accessibilityRole="button"
        accessibilityLabel="Sayfayı paylaş"
        accessibilityHint="Açık sayfayı paylaşım seçenekleriyle paylaşır"
        style={({ hovered, pressed }: any) => [
          styles.headerShare,
          compact && styles.headerShareCompact,
          (hovered || pressed) && styles.headerUtilityActive
        ]}
      >
        <Image
          source={{ uri: sharePageIcon }}
          style={[styles.headerShareIcon, compact && styles.headerShareIconCompact] as any}
          resizeMode="contain"
        />
      </Pressable>
      {toastMessage && (
        <View style={styles.shareToast} accessibilityLiveRegion="polite" accessibilityRole="alert">
          <View style={styles.shareToastMark} />
          <Text style={styles.shareToastText}>{toastMessage}</Text>
        </View>
      )}
    </>
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
  const dropdownRef = useRef<any>(null);
  const dropdownItems = "items" in item ? item.items : undefined;

  useEffect(() => {
    if (!dropdownOpen) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [dropdownOpen]);

  if (dropdownItems) {
    return (
      <View ref={dropdownRef} style={styles.navDropdown}>
        <Pressable
          onPress={() => setDropdownOpen((open) => !open)}
          accessibilityRole="button"
          accessibilityState={{ expanded: dropdownOpen }}
          style={({ hovered, pressed }: any) => [
            styles.navLink,
            compact && styles.navLinkCompact,
            (hovered || pressed || dropdownOpen) && styles.navLinkHover
          ]}
        >
          <Text style={[styles.navText, compact && styles.navTextCompact]}>{item.label}</Text>
          <Text style={[styles.navChevron, dropdownOpen && styles.navChevronOpen]}>⌄</Text>
        </Pressable>

        {dropdownOpen && (
          <View style={styles.navDropdownPanel}>
            <View style={styles.navDropdownHeader}>
              <Text style={styles.navDropdownKicker}>BEDRİ USTA</Text>
              <Text style={styles.navDropdownTitle}>Kurumsal</Text>
            </View>
            {dropdownItems.map((child, index) => (
              <Pressable
                key={child.label}
                onPress={() => {
                  setDropdownOpen(false);
                  openNavigationTarget(child.href);
                }}
                accessibilityRole="link"
                style={({ hovered, pressed }: any) => [
                  styles.navDropdownItem,
                  (hovered || pressed) && styles.navDropdownItemHover
                ]}
              >
                <Text style={styles.navDropdownNumber}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
                <Text style={styles.navDropdownText}>{child.label}</Text>
                <Text style={styles.navDropdownArrow}>→</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
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

function HorizontalCardRail({
  id,
  children,
  accessibilityLabel,
  tone = "wine",
  autoPlay = false,
  loop = false
}: {
  id: string;
  children: ReactNode;
  accessibilityLabel: string;
  tone?: "paper" | "wine" | "gold";
  autoPlay?: boolean;
  loop?: boolean;
}) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const directionRef = useRef<1 | -1>(1);
  const manualScrollFrameRef = useRef<number | null>(null);
  const interactionPausedRef = useRef(false);
  const getLoopSpan = (rail: HTMLElement) => {
    const cloneIndex = Math.floor(rail.children.length / 3);
    const firstItem = rail.children.item(0) as HTMLElement | null;
    const firstClone = rail.children.item(cloneIndex) as HTMLElement | null;
    return firstItem && firstClone ? firstClone.offsetLeft - firstItem.offsetLeft : 0;
  };

  const jumpWithoutAnimation = (rail: HTMLElement, left: number) => {
    const previousScrollBehavior = rail.style.scrollBehavior;
    rail.style.scrollBehavior = "auto";
    rail.scrollLeft = left;
    rail.style.scrollBehavior = previousScrollBehavior;
  };

  const getCardStep = (rail: HTMLElement) => {
    const firstItem = rail.children.item(0) as HTMLElement | null;
    const secondItem = rail.children.item(1) as HTMLElement | null;
    return firstItem && secondItem
      ? secondItem.offsetLeft - firstItem.offsetLeft
      : Math.min(rail.clientWidth * 0.78, 360);
  };

  const animateRailBy = (rail: HTMLElement, distance: number) => {
    setIsPaused(true);

    if (manualScrollFrameRef.current !== null) {
      window.cancelAnimationFrame(manualScrollFrameRef.current);
    }

    const start = rail.scrollLeft;
    const startedAt = window.performance.now();
    const duration = 360;

    const animate = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      rail.scrollLeft = start + distance * eased;

      if (progress < 1) {
        manualScrollFrameRef.current = window.requestAnimationFrame(animate);
      } else {
        manualScrollFrameRef.current = null;
        setIsPaused(false);
      }
    };

    manualScrollFrameRef.current = window.requestAnimationFrame(animate);
  };

  useEffect(
    () => () => {
      if (manualScrollFrameRef.current !== null) {
        window.cancelAnimationFrame(manualScrollFrameRef.current);
      }
    },
    []
  );

  useEffect(() => {
    const rail = document.getElementById(id);
    if (!rail) return;

    const updateOverflow = () => {
      setIsOverflowing(rail.scrollWidth > rail.clientWidth + 4);
    };

    const normalizeLoopPosition = () => {
      if (!loop) return;
      const loopSpan = getLoopSpan(rail);
      if (loopSpan <= 0) return;

      if (rail.scrollLeft >= loopSpan * 2) {
        jumpWithoutAnimation(rail, rail.scrollLeft - loopSpan);
      } else if (rail.scrollLeft <= 0) {
        jumpWithoutAnimation(rail, rail.scrollLeft + loopSpan);
      }
    };

    const resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(rail);
    Array.from(rail.children).forEach((child) => resizeObserver.observe(child));
    rail.addEventListener("scroll", normalizeLoopPosition, { passive: true });
    window.addEventListener("resize", updateOverflow);
    const frame = window.requestAnimationFrame(() => {
      updateOverflow();
      if (loop && rail.scrollLeft <= 1) {
        const loopSpan = getLoopSpan(rail);
        if (loopSpan > 0) jumpWithoutAnimation(rail, loopSpan);
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateOverflow);
      rail.removeEventListener("scroll", normalizeLoopPosition);
      resizeObserver.disconnect();
    };
  }, [id, loop]);

  useEffect(() => {
    if (!autoPlay || !isOverflowing || (!loop && isPaused)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (loop) {
      let frame = 0;
      let previousTime = window.performance.now();

      const moveContinuously = (time: number) => {
        const rail = document.getElementById(id);
        if (!rail) return;

        const elapsed = Math.min(time - previousTime, 64);
        previousTime = time;
        if (manualScrollFrameRef.current === null && !interactionPausedRef.current) {
          rail.scrollLeft += (elapsed / 1000) * 42;
        }
        frame = window.requestAnimationFrame(moveContinuously);
      };

      frame = window.requestAnimationFrame(moveContinuously);
      return () => window.cancelAnimationFrame(frame);
    }

    const moveRail = () => {
      const rail = document.getElementById(id);
      if (!rail) return;

      const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
      if (rail.scrollLeft >= maxScroll - 4) directionRef.current = -1;
      if (rail.scrollLeft <= 4) directionRef.current = 1;

      rail.scrollBy({
        left: directionRef.current * Math.min(rail.clientWidth * 0.78, 360),
        behavior: "smooth"
      });
    };

    const initialMove = window.setTimeout(moveRail, 1400);
    const interval = window.setInterval(moveRail, 3600);

    return () => {
      window.clearTimeout(initialMove);
      window.clearInterval(interval);
    };
  }, [autoPlay, id, isOverflowing, isPaused, loop]);

  const scrollRail = (direction: -1 | 1) => {
    const rail = document.getElementById(id);
    if (!rail) return;

    if (loop) {
      const loopSpan = getLoopSpan(rail);
      const step = getCardStep(rail);
      if (loopSpan > 0 && direction === -1 && rail.scrollLeft <= step) {
        jumpWithoutAnimation(rail, rail.scrollLeft + loopSpan);
      } else if (loopSpan > 0 && direction === 1 && rail.scrollLeft >= loopSpan * 2 - step) {
        jumpWithoutAnimation(rail, rail.scrollLeft - loopSpan);
      }
      animateRailBy(rail, direction * step);
      return;
    }

    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const atStart = rail.scrollLeft <= 4;
    const atEnd = rail.scrollLeft >= maxScroll - 4;
    directionRef.current = direction;

    rail.scrollTo({
      left:
        direction === -1 && atStart
          ? maxScroll
          : direction === 1 && atEnd
            ? 0
            : Math.max(0, Math.min(maxScroll, rail.scrollLeft + direction * Math.min(rail.clientWidth * 0.78, 360))),
      behavior: "smooth"
    });
  };

  const interactionHandlers = {
    onPointerDown: () => {
      interactionPausedRef.current = true;
      setIsPaused(true);
    },
    onPointerUp: () => {
      interactionPausedRef.current = false;
      setIsPaused(false);
    },
    onPointerCancel: () => {
      interactionPausedRef.current = false;
      setIsPaused(false);
    },
    onTouchStart: () => {
      interactionPausedRef.current = true;
      setIsPaused(true);
    },
    onTouchEnd: () => {
      interactionPausedRef.current = false;
      setIsPaused(false);
    }
  } as any;

  return (
    <View style={styles.cardRailShell} {...interactionHandlers}>
      {isOverflowing && (
        <Pressable
          onPress={() => scrollRail(-1)}
          accessibilityRole="button"
          accessibilityLabel={`${accessibilityLabel}: önceki kartlar`}
          style={({ hovered, pressed }: any) => [
            styles.cardRailArrow,
            styles.cardRailArrowLeft,
            tone === "gold" && styles.cardRailArrowGold,
            tone === "paper" && styles.cardRailArrowPaper,
            (hovered || pressed) && styles.cardRailArrowActive
          ]}
        >
          <Text
            style={[
              styles.cardRailArrowText,
              tone === "gold" && styles.cardRailArrowTextGold,
              tone === "paper" && styles.cardRailArrowTextPaper
            ]}
          >
            ‹
          </Text>
        </Pressable>
      )}
      <View
        nativeID={id}
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.cardRail,
          loop && styles.cardRailContinuous,
          isOverflowing && styles.cardRailOverflowing,
          !isOverflowing && styles.cardRailCentered
        ]}
        {...({ className: "horizontal-card-rail" } as any)}
      >
        {children}
      </View>
      {isOverflowing && (
        <Pressable
          onPress={() => scrollRail(1)}
          accessibilityRole="button"
          accessibilityLabel={`${accessibilityLabel}: sonraki kartlar`}
          style={({ hovered, pressed }: any) => [
            styles.cardRailArrow,
            styles.cardRailArrowRight,
            tone === "gold" && styles.cardRailArrowGold,
            tone === "paper" && styles.cardRailArrowPaper,
            (hovered || pressed) && styles.cardRailArrowActive
          ]}
        >
          <Text
            style={[
              styles.cardRailArrowText,
              tone === "gold" && styles.cardRailArrowTextGold,
              tone === "paper" && styles.cardRailArrowTextPaper
            ]}
          >
            ›
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function QuickActionsSection({ compact, tablet }: { compact: boolean; tablet: boolean }) {
  type QuickActionItem = {
    label: string;
    detail: string;
    icon: QuickActionIconName;
    action?: () => void;
  };

  const socialActions: QuickActionItem[] = [
    {
      label: "Instagram",
      detail: "@mannheim_bedriusta",
      icon: "instagram",
      action: () => Linking.openURL("https://www.instagram.com/mannheim_bedriusta")
    },
    { label: "TikTok", detail: "Yakında", icon: "tiktok" },
    {
      label: "YouTube",
      detail: "Videoları izle",
      icon: "youtube",
      action: () => Linking.openURL("https://www.youtube.com/c/BedriUsta")
    },
    { label: "Facebook", detail: "Yakında", icon: "facebook" }
  ];

  const contactActions: QuickActionItem[] = [
    {
      label: "İletişim Formu",
      detail: "Yakında aktif",
      icon: "contact"
    },
    {
      label: "E-posta",
      detail: "info@bedriusta.de",
      icon: "email",
      action: () => Linking.openURL("mailto:info@bedriusta.de")
    },
    { label: "WhatsApp", detail: "Numara yakında", icon: "whatsapp" },
    { label: "Telefon", detail: "Numara yakında", icon: "phone" }
  ];

  const renderActionCard = (item: QuickActionItem, contact = false) => {
    const disabled = !item.action;
    return (
      <Pressable
        key={item.label}
        onPress={item.action}
        accessibilityRole={disabled ? undefined : "link"}
        accessibilityState={{ disabled }}
        style={({ hovered, pressed }: any) => [
          styles.quickActionCard,
          contact && styles.quickActionCardContact,
          disabled && styles.quickActionCardUnavailable,
          !disabled && (hovered || pressed) && (contact ? styles.quickActionCardContactActive : styles.quickActionCardActive)
        ]}
      >
        <View
          style={[
            styles.quickActionIconFrame,
            contact && styles.quickActionIconFrameContact,
            disabled && styles.quickActionIconFrameUnavailable
          ]}
        >
          <QuickActionGlyph type={item.icon} />
        </View>
        <View style={styles.quickActionCardCopy}>
          <Text
            style={[
              styles.quickActionLabel,
              contact && styles.quickActionLabelContact,
              disabled && styles.quickActionLabelUnavailable
            ]}
          >
            {item.label}
          </Text>
          <Text
            style={[
              styles.quickActionDetail,
              contact && styles.quickActionDetailContact,
              disabled && styles.quickActionDetailUnavailable
            ]}
          >
            {item.detail}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <View style={styles.quickActionsSection}>
        <ScrollReveal style={styles.quickActionsInner}>
        <Text style={styles.quickActionsEyebrow}>HIZLI ERİŞİM</Text>
        <Text style={styles.quickActionsTitle}>Sosyal medyada takip edin, bize doğrudan ulaşın.</Text>
        <Text style={styles.quickActionsIntro}>
          Bedri Usta Mannheim'ın sosyal kanallarını keşfedin; sorularınız ve
          talepleriniz için bize doğrudan ulaşın.
        </Text>

        <View style={styles.quickActionsGroup}>
          <Text style={styles.quickActionsGroupEyebrow}>SOSYAL MEDYA</Text>
          <Text style={[styles.quickActionsGroupText, styles.quickActionsSocialPrompt]}>
            Takip Et · Beğen · Yorum Yap · Paylaş
          </Text>
          <View
            accessibilityLabel="Sosyal medya bağlantıları"
            style={[
              styles.quickActionsGrid,
              tablet && styles.quickActionsGridTablet,
              compact && styles.quickActionsGridCompact
            ]}
          >
            {socialActions.map((item) => renderActionCard(item))}
          </View>
        </View>
        </ScrollReveal>
      </View>

      <View nativeID="contact" style={styles.quickActionsContactSection}>
        <ScrollReveal style={styles.quickActionsContactInner}>
          <Text style={[styles.quickActionsGroupEyebrow, styles.quickActionsGroupEyebrowContact]}>İLETİŞİM</Text>
          <Text style={[styles.quickActionsGroupText, styles.quickActionsGroupTextContact]}>Sorularınız ve talepleriniz için doğrudan bağlantılar.</Text>
          <View
            accessibilityLabel="İletişim bağlantıları"
            style={[
              styles.quickActionsGrid,
              tablet && styles.quickActionsGridTablet,
              compact && styles.quickActionsGridCompact
            ]}
          >
            {contactActions.map((item) => renderActionCard(item, true))}
          </View>
        </ScrollReveal>
      </View>
    </>
  );
}

function MobileActionDock({ desktop }: { desktop: boolean }) {
  const items: Array<{
    label: string;
    icon: QuickActionIconName;
    action: () => void;
  }> = [
    { label: "Menü", icon: "menu", action: () => openNavigationTarget("/menu") },
    {
      label: "Rezervasyon",
      icon: "reservation",
      action: () => openNavigationTarget("/rezervasyon")
    },
    {
      label: "Instagram",
      icon: "instagramDock",
      action: () => Linking.openURL("https://www.instagram.com/mannheim_bedriusta")
    },
    { label: "Yol Tarifi", icon: "directions", action: openMapForAddress }
  ];

  return (
    <View
      style={[styles.mobileActionDock, desktop && styles.desktopActionDock]}
      accessibilityLabel="Hızlı erişim"
    >
      {items.map((item, index) => {
        if (item.label === "Yol Tarifi") {
          return (
            <a
              key={item.label}
              href={googleMapsPlaceLink}
              aria-label="Yol Tarifi"
              className={`mobile-map-link${desktop ? " mobile-map-link--desktop" : ""}`}
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
            </a>
          );
        }

        return (
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
        );
      })}
    </View>
  );
}

function BackToTopButton({ desktop }: { desktop: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateVisibility = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setVisible(window.scrollY > Math.max(640, window.innerHeight * 0.85));
      });
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <Pressable
      onPress={scrollToTop}
      pointerEvents={visible ? "auto" : "none"}
      accessibilityRole="button"
      accessibilityLabel="Sayfanın başına dön"
      accessibilityState={{ disabled: !visible }}
      style={({ hovered, pressed }: any) => [
        styles.backToTop,
        desktop && styles.backToTopDesktop,
        visible ? styles.backToTopVisible : styles.backToTopHidden,
        (hovered || pressed) && styles.backToTopActive
      ]}
    >
      <Text style={styles.backToTopArrow}>↑</Text>
      <Text style={styles.backToTopLabel}>YUKARI</Text>
    </Pressable>
  );
}

function Footer({ isMobile }: { isMobile: boolean }) {
  const [addressCopied, setAddressCopied] = useState(false);
  const [language, setLanguage] = useState<SiteLanguage>(() => getSiteLanguage());
  const copyToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const footerCopy = {
    TR: {
      label: "BEDRİ USTA · MANNHEIM",
      lead: "Ustalıkla hazırlanan kebaplar, özenli servis ve sıcak Türk misafirliği."
    },
    DE: {
      label: "BEDRİ USTA · MANNHEIM",
      lead: "Meisterhaft zubereitete Kebabs, aufmerksamer Service und herzliche türkische Gastfreundschaft."
    },
    ENG: {
      label: "BEDRİ USTA · MANNHEIM",
      lead: "Expertly prepared kebabs, attentive service and warm Turkish hospitality."
    }
  } as const;
  const exploreLinks = [
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Menü", href: "/menu" },
    { label: "Politikalarımız", href: "/politikalarimiz" },
    { label: "Kariyer", href: "/jobs" }
  ];
  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/mannheim_bedriusta" },
    { label: "YouTube", href: "https://www.youtube.com/c/BedriUsta" },
    { label: "E-posta", href: "mailto:info@bedriusta.de" }
  ];
  const legalLinks: Array<{ label: string; href?: string; disabled?: boolean }> = [
    { label: "Impressum", href: "#policies" },
    { label: "Datenschutz", href: "/datenschutz" },
    { label: "Cookie-Einstellungen", href: "/datenschutz#cookies" },
    { label: "AGB", disabled: true },
    { label: "FAQ", href: "/#contact" }
  ];

  useEffect(() => {
    const unsubscribeLanguage = subscribeToSiteLanguage(setLanguage);
    return () => {
      unsubscribeLanguage();
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
      <View style={styles.footerGlow} />
      <View style={styles.footerFrame}>
        <View style={[styles.footerMasthead, isMobile && styles.footerMastheadMobile]}>
          <View style={styles.footerMastheadCopy}>
            <Text style={styles.footerEyebrow}>{footerCopy[language].label}</Text>
            <Text style={styles.footerLead}>
              {footerCopy[language].lead}
            </Text>
          </View>
          <View style={[styles.footerPrimaryActions, isMobile && styles.footerPrimaryActionsMobile]}>
            <Pressable
              onPress={() => openNavigationTarget("/rezervasyon")}
              style={({ hovered, pressed }: any) => [
                styles.footerPrimaryAction,
                (hovered || pressed) && styles.footerPrimaryActionActive
              ]}
            >
              <View>
                <Text style={styles.footerActionKicker}>MASANIZI AYIRTIN</Text>
                <Text style={styles.footerActionText}>Rezervasyon</Text>
              </View>
              <Text style={styles.footerActionArrow}>↗</Text>
            </Pressable>
            <Pressable
              onPress={() => openNavigationTarget("/menu")}
              style={({ hovered, pressed }: any) => [
                styles.footerSecondaryAction,
                (hovered || pressed) && styles.footerSecondaryActionActive
              ]}
            >
              <View>
                <Text style={styles.footerSecondaryKicker}>LEZZETLERİ KEŞFEDİN</Text>
                <Text style={styles.footerSecondaryText}>Menüyü İncele</Text>
              </View>
              <Text style={styles.footerSecondaryArrow}>→</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.footerRule} />

        <View style={styles.footerInfoGrid}>
          <View style={styles.footerColumn}>
            <Text style={styles.footerColumnNumber}>01</Text>
            <Text style={styles.footerColumnTitle}>Ziyaret</Text>
            {restaurantOpeningHours.map((hours, index) => (
              <View key={hours.days} style={index > 0 ? styles.footerHoursSecondary : undefined}>
                <Text style={styles.footerColumnMuted}>{hours.days}</Text>
                <Text style={styles.footerColumnStrong}>{hours.time}</Text>
              </View>
            ))}
            <Pressable
              onPress={openMapForAddress}
              accessibilityRole="link"
              accessibilityLabel="Bedri Usta Mannheim adresini haritada aç"
              style={({ hovered, pressed }: any) => [
                styles.footerAddress,
                (hovered || pressed) && styles.footerAddressActive
              ]}
            >
              <Text style={styles.footerAddressText}>{restaurantAddress}</Text>
            </Pressable>
            <View style={styles.footerInlineActions}>
              <Pressable onPress={handleCopyAddress} style={styles.footerTextLinkButton}>
                <Text style={styles.footerTextLink}>Adresi kopyala</Text>
              </Pressable>
              <Text style={styles.footerInlineDivider}>·</Text>
              <Pressable onPress={openMapForAddress} style={styles.footerTextLinkButton}>
                <Text style={styles.footerTextLink}>Haritada aç ↗</Text>
              </Pressable>
            </View>
            {addressCopied && <Text style={styles.footerCopied}>Adres kopyalandı.</Text>}
          </View>

          <View style={styles.footerColumn}>
            <Text style={styles.footerColumnNumber}>02</Text>
            <Text style={styles.footerColumnTitle}>Keşfet</Text>
            {exploreLinks.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => openNavigationTarget(item.href)}
                style={({ hovered, pressed }: any) => [
                  styles.footerNavLink,
                  (hovered || pressed) && styles.footerNavLinkActive
                ]}
              >
                <Text style={styles.footerNavLinkText}>{item.label}</Text>
                <Text style={styles.footerNavLinkArrow}>→</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.footerColumn}>
            <Text style={styles.footerColumnNumber}>03</Text>
            <Text style={styles.footerColumnTitle}>İletişim</Text>
            {socialLinks.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => Linking.openURL(item.href)}
                style={({ hovered, pressed }: any) => [
                  styles.footerNavLink,
                  (hovered || pressed) && styles.footerNavLinkActive
                ]}
              >
                <Text style={styles.footerNavLinkText}>{item.label}</Text>
                <Text style={styles.footerNavLinkArrow}>↗</Text>
              </Pressable>
            ))}
            <Text style={styles.footerEmail}>info@bedriusta.de</Text>
          </View>

          <View nativeID="policies" style={styles.footerColumn}>
            <Text style={styles.footerColumnNumber}>04</Text>
            <Text style={styles.footerColumnTitle}>Yasal</Text>
            {legalLinks.map((item) => (
              <Pressable
                key={item.label}
                onPress={item.href ? () => openNavigationTarget(item.href as string) : undefined}
                disabled={item.disabled}
                accessibilityRole={item.disabled ? undefined : "link"}
                accessibilityState={{ disabled: item.disabled }}
                style={({ hovered, pressed }: any) => [
                  styles.footerNavLink,
                  item.disabled && styles.footerNavLinkDisabled,
                  !item.disabled && (hovered || pressed) && styles.footerNavLinkActive
                ]}
              >
                <Text style={styles.footerNavLinkText}>{item.label}</Text>
                <Text style={styles.footerNavLinkArrow}>{item.disabled ? "YAKINDA" : "→"}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.footerBottom, isMobile && styles.footerBottomMobile]}>
          <View style={[styles.footerBottomCopy, isMobile && styles.footerBottomCopyMobile]}>
            <Text style={[styles.copyright, isMobile && styles.copyrightMobile]}>
              © 2026 Bedri Usta. Tüm hakları saklıdır.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const colors = {
  wine: "#160807",
  red: "#a7191e",
  headerRed: "#530e0f",
  cream: "#fff8ee",
  ivory: "#fffdf8",
  paper: "#f6f3f0",
  menuSurface: "#f3ece4",
  menuSurfaceRaised: "#fffaf3",
  menuInk: "#351311",
  quickReadySurface: "#fffaf3",
  quickReadySurfaceActive: "#f0ddb0",
  quickReadyBorder: "#cdb8a7",
  quickUnavailableSurface: "#530e0f",
  quickUnavailableBorder: "#8a6638",
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
  scrollReveal: {
    transitionProperty: "opacity, transform",
    transitionDuration: "560ms",
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
  } as any,
  scrollRevealHidden: {
    opacity: 0,
    transform: [{ translateY: 32 }],
    willChange: "opacity, transform"
  } as any,
  scrollRevealVisible: {
    opacity: 1,
    transform: [{ translateY: 0 }],
    willChange: "auto"
  } as any,
  scrollRevealGridItem: {
    minWidth: 0
  },
  heroRevealLine: {
    width: "100%",
    minWidth: 0
  },
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
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
    zIndex: 101,
    boxShadow: "0 18px 50px rgba(0,0,0,0.3)"
  } as any,
  headerRailMobile: {
    minHeight: 58,
    paddingHorizontal: 8
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
    gap: 8,
    position: "relative",
    zIndex: 44
  },
  headerUtilitiesCompact: {
    width: 104,
    justifyContent: "flex-end",
    gap: 3
  },
  headerShare: {
    width: 36,
    height: 36,
    minHeight: 36,
    paddingHorizontal: 0,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,247,223,.24)",
    alignItems: "center",
    justifyContent: "center"
  },
  headerShareCompact: {
    width: 30,
    height: 30,
    minHeight: 30
  },
  headerShareIcon: {
    width: 20,
    height: 20
  },
  headerShareIconCompact: {
    width: 17,
    height: 17
  },
  shareToast: {
    position: "fixed",
    top: 100,
    right: 18,
    minHeight: 46,
    maxWidth: "calc(100vw - 36px)",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(223,191,120,.68)",
    borderRadius: 4,
    backgroundColor: colors.headerRed,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 14px 34px rgba(24,5,4,.32)",
    zIndex: 9999
  } as any,
  shareToastMark: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#dfbf78"
  },
  shareToastText: {
    color: "#fff8ee",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800",
    letterSpacing: 0.35
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
    justifyContent: "center",
    position: "relative"
  } as any,
  headerLoginCompact: {
    width: 30,
    height: 30,
    minHeight: 30,
    paddingHorizontal: 0
  },
  headerLoginIcon: {
    width: 27,
    height: 27
  },
  headerLoginIconCompact: {
    width: 22,
    height: 22
  },
  headerNotificationDot: {
    position: "absolute",
    top: -2,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.headerRed,
    backgroundColor: "#dfbf78"
  },
  headerUtilityActive: {
    borderColor: "#dfbf78",
    backgroundColor: "rgba(255,247,223,.1)"
  },
  languageSelector: {
    position: "relative",
    zIndex: 46
  } as any,
  languageMark: {
    minWidth: 68,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,247,223,.24)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 8
  },
  languageMarkCompact: {
    minWidth: 38,
    height: 32,
    paddingHorizontal: 5,
    gap: 3
  },
  languageGlobe: {
    width: 17,
    height: 17
  },
  languageGlobeCompact: {
    width: 14,
    height: 14
  },
  languageCurrent: {
    color: "#ffffff",
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.8,
    fontWeight: "800"
  },
  languageCurrentCompact: {
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 0.2
  },
  languageChevron: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 14,
    fontWeight: "800",
    transitionDuration: "180ms",
    transitionProperty: "transform"
  } as any,
  languageChevronOpen: {
    transform: [{ rotate: "180deg" }]
  },
  languageDropdownPanel: {
    position: "absolute",
    top: 44,
    right: 0,
    width: 224,
    borderWidth: 1,
    borderColor: "#c9b58d",
    backgroundColor: "#fffaf3",
    padding: 8,
    boxShadow: "0 24px 58px rgba(18,0,0,.35)",
    zIndex: 60
  } as any,
  languageDropdownPanelCompact: {
    top: 40,
    right: 0,
    width: 210
  },
  languageDropdownHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#dfd1c5",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 4
  },
  languageDropdownKicker: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 2,
    fontWeight: "800"
  },
  languageDropdownTitle: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "900",
    marginTop: 3
  },
  languageDropdownItem: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#eee3db"
  },
  languageDropdownItemSelected: {
    backgroundColor: "#f3e7d4"
  },
  languageDropdownItemHover: {
    backgroundColor: "#ead9bf"
  },
  languageDropdownCode: {
    width: 38,
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.8,
    fontWeight: "800"
  },
  languageDropdownCodeSelected: {
    color: colors.headerRed
  },
  languageDropdownLabel: {
    flex: 1,
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700"
  },
  languageDropdownCheck: {
    color: colors.red,
    fontFamily: "Heebo, sans-serif",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900"
  },
  languageDropdownNote: {
    color: "#776963",
    fontFamily: "Heebo, sans-serif",
    fontSize: 10,
    lineHeight: 15,
    paddingVertical: 9,
    paddingHorizontal: 10
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
    transform: [{ translateY: -1 }],
    transitionDuration: "180ms",
    transitionProperty: "transform"
  } as any,
  navChevronOpen: {
    transform: [{ rotate: "180deg" }]
  },
  navDropdown: {
    position: "relative",
    zIndex: 30
  } as any,
  navDropdownPanel: {
    position: "absolute",
    top: 48,
    left: "50%",
    transform: [{ translateX: -118 }],
    width: 236,
    borderWidth: 1,
    borderColor: "#c9b58d",
    backgroundColor: "#fffaf3",
    padding: 8,
    boxShadow: "0 24px 58px rgba(18,0,0,.38)"
  } as any,
  navDropdownHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#dfd1c5",
    paddingVertical: 11,
    paddingHorizontal: 10,
    marginBottom: 4
  },
  navDropdownKicker: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 2.2,
    fontWeight: "800"
  },
  navDropdownTitle: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 21,
    lineHeight: 26,
    fontWeight: "900",
    marginTop: 3
  },
  navDropdownItem: {
    minHeight: 48,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee3db"
  },
  navDropdownItemHover: {
    backgroundColor: "#f0e3d1"
  },
  navDropdownNumber: {
    width: 25,
    color: "#a9824e",
    fontFamily: "Karla, sans-serif",
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 1,
    fontWeight: "800"
  },
  navDropdownText: {
    flex: 1,
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700"
  },
  navDropdownArrow: {
    color: colors.red,
    fontFamily: "Heebo, sans-serif",
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "900"
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
    maxWidth: 380,
    width: "calc(100% - 16px)",
    maxHeight: "calc(100svh - 92px)",
    marginLeft: 8,
    marginRight: "auto",
    marginTop: 6,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,247,223,0.22)",
    backgroundColor: "rgba(23,10,8,0.96)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    position: "relative",
    zIndex: 22,
    overflowY: "auto",
    overscrollBehavior: "contain",
    boxShadow: "0 22px 52px rgba(0,0,0,0.36)"
  } as any,
  mobileMenuItem: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 6
  },
  mobileMenuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,247,223,0.14)"
  },
  mobileMenuItemDisabled: {
    opacity: 0.56
  },
  mobileMenuSectionDivider: {
    height: 3,
    marginVertical: 7,
    backgroundColor: "rgba(223,191,120,0.72)"
  },
  mobileMenuStatus: {
    color: colors.sand,
    fontFamily: "Karla, sans-serif",
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.2,
    fontWeight: "800"
  },
  mobileMenuText: {
    minWidth: 0,
    flexShrink: 1,
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800"
  },
  mobileMenuTextDisabled: {
    color: colors.cream
  },
  logoButton: {
    width: 92,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 106,
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
  editorialHeroMediaTablet: {
    width: "min(720px, 78vw)",
    maxWidth: 720
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
  restaurantMenuHero: {
    width: "100%",
    minHeight: 320,
    paddingTop: 88,
    position: "relative",
    justifyContent: "center",
    backgroundColor: colors.headerRed,
    backgroundImage:
      "radial-gradient(circle at 78% 34%, rgba(223,191,120,.16), transparent 28%), linear-gradient(130deg, #280506 0%, #530e0f 52%, #74191c 100%)",
    overflow: "hidden"
  } as any,
  restaurantMenuHeroMobile: {
    minHeight: 0,
    paddingTop: 94
  } as any,
  restaurantMenuHeroGlow: {
    position: "absolute",
    right: "-8%",
    top: "-24%",
    width: "42%",
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(223,191,120,.18)",
    boxShadow: "0 0 140px rgba(223,191,120,.1)"
  } as any,
  restaurantMenuHeroInner: {
    width: "100%",
    maxWidth: 1260,
    minWidth: 0,
    marginHorizontal: "auto",
    paddingVertical: 40,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 42
  },
  restaurantMenuHeroInnerMobile: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    flexDirection: "column",
    alignItems: "stretch",
    gap: 20
  },
  restaurantMenuHeroCopy: {
    flex: 1,
    minWidth: 0,
    maxWidth: 760
  },
  restaurantMenuEyebrow: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 4.2,
    fontWeight: "800"
  },
  restaurantMenuHeroTitle: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 44,
    lineHeight: 49,
    letterSpacing: -1.2,
    fontWeight: "900",
    marginTop: 15
  },
  restaurantMenuHeroTitleMobile: {
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: -0.6
  },
  restaurantMenuHeroLead: {
    color: "rgba(255,255,255,.74)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 16,
    lineHeight: 25,
    maxWidth: 660,
    marginTop: 13
  },
  restaurantMenuHeroLeadMobile: {
    fontSize: 14,
    lineHeight: 22
  },
  restaurantMenuEdition: {
    width: 250,
    flexShrink: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(223,191,120,.4)",
    paddingVertical: 22,
    paddingHorizontal: 4
  },
  restaurantMenuEditionMobile: {
    width: "100%",
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12
  } as any,
  restaurantMenuEditionLabel: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 2.4,
    fontWeight: "800"
  },
  restaurantMenuEditionValue: {
    color: "#fffaf4",
    fontFamily: "Heebo, sans-serif",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "900",
    marginTop: 7
  },
  restaurantMenuEditionMeta: {
    color: "rgba(255,250,244,.62)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 4
  },
  restaurantMenuEditionMetaMobile: {
    display: "none"
  },
  restaurantMenuHeroStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 32,
    marginTop: 42
  },
  restaurantMenuHeroStat: {
    minWidth: 98
  },
  restaurantMenuHeroStatValue: {
    color: "#dfbf78",
    fontFamily: "Heebo, sans-serif",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "900"
  },
  restaurantMenuHeroStatLabel: {
    color: "rgba(255,255,255,.56)",
    fontFamily: "Karla, sans-serif",
    fontSize: 9,
    lineHeight: 14,
    letterSpacing: 1.6,
    fontWeight: "800",
    marginTop: 4
  },
  restaurantMenuHeroMark: {
    width: 330,
    aspectRatio: 0.9,
    flexShrink: 0,
    borderWidth: 1,
    borderColor: "rgba(223,191,120,.42)",
    backgroundColor: "rgba(32,3,4,.28)",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 34px 90px rgba(18,0,0,.26)"
  } as any,
  restaurantMenuHeroMarkMobile: {
    width: "100%",
    maxWidth: 420,
    aspectRatio: 1.45,
    alignSelf: "center"
  } as any,
  restaurantMenuHeroMarkTop: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 6,
    fontWeight: "800"
  },
  restaurantMenuHeroMarkMain: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: 4,
    fontWeight: "900",
    marginTop: 8
  },
  restaurantMenuHeroMarkLine: {
    width: 54,
    height: 2,
    backgroundColor: "#dfbf78",
    marginVertical: 24
  },
  restaurantMenuHeroMarkBottom: {
    color: "rgba(255,255,255,.64)",
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 2.5,
    fontWeight: "700"
  },
  restaurantMenuTools: {
    position: "sticky",
    top: 88,
    zIndex: 30,
    backgroundColor: "#f7f2ed",
    borderBottomWidth: 1,
    borderBottomColor: "#d9cec6",
    boxShadow: "0 14px 34px rgba(42,10,10,.08)"
  } as any,
  restaurantMenuToolsInner: {
    width: "100%",
    maxWidth: 1260,
    minWidth: 0,
    marginHorizontal: "auto",
    paddingTop: 18,
    paddingHorizontal: 24
  },
  restaurantMenuSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  restaurantMenuSearchRowMobile: {
    alignItems: "stretch"
  },
  restaurantMenuSearch: {
    flex: 1,
    minWidth: 0,
    height: 48,
    borderWidth: 1,
    borderColor: "#cfc1b8",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15
  },
  restaurantMenuSearchIcon: {
    color: colors.red,
    fontFamily: "Heebo, sans-serif",
    fontSize: 27,
    lineHeight: 30,
    marginRight: 10
  },
  restaurantMenuSearchInput: {
    flex: 1,
    minWidth: 0,
    height: 46,
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 15,
    outlineStyle: "none"
  } as any,
  restaurantMenuSearchClear: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  restaurantMenuSearchClearText: {
    color: colors.red,
    fontFamily: "Heebo, sans-serif",
    fontSize: 25,
    lineHeight: 28
  },
  restaurantMenuFilters: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  restaurantMenuCommandRow: {
    minWidth: 0,
    marginTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ded3cb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16
  },
  restaurantMenuCommandRowMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 9
  },
  restaurantMenuFilter: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#cfc1b8",
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff"
  },
  restaurantMenuFilterActive: {
    borderColor: colors.headerRed,
    backgroundColor: colors.headerRed
  },
  restaurantMenuFilterVegetarian: {
    borderColor: "#a77b35",
    backgroundColor: "#8b6529"
  },
  restaurantMenuFilterVegan: {
    borderColor: "#466846",
    backgroundColor: "#365537"
  },
  restaurantMenuFilterText: {
    color: "#5c4e49",
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 1.1,
    fontWeight: "800"
  },
  restaurantMenuFilterTextActive: {
    color: "#ffffff"
  },
  restaurantMenuCategoryRailShell: {
    width: "100%",
    minWidth: 0,
    position: "relative",
    marginTop: 12
  },
  restaurantMenuCategoryRail: {
    width: "100%",
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 48,
    paddingBottom: 12,
    overflowX: "auto",
    overscrollBehaviorX: "contain",
    scrollbarWidth: "thin"
  } as any,
  restaurantMenuCategoryArrow: {
    position: "absolute",
    top: 0,
    zIndex: 4,
    width: 40,
    height: 42,
    borderWidth: 1,
    borderColor: "#bba9a0",
    backgroundColor: "#f7f2ed",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 5px 14px rgba(42,10,10,.1)"
  } as any,
  restaurantMenuCategoryArrowLeft: {
    left: 0
  },
  restaurantMenuCategoryArrowRight: {
    right: 0
  },
  restaurantMenuCategoryArrowActive: {
    borderColor: colors.headerRed,
    backgroundColor: "#efe3dc"
  },
  restaurantMenuCategoryArrowText: {
    color: colors.red,
    fontFamily: "Heebo, sans-serif",
    fontSize: 28,
    lineHeight: 31,
    fontWeight: "700"
  },
  restaurantMenuCategoryButton: {
    flexShrink: 0,
    minHeight: 42,
    borderWidth: 1,
    borderColor: "#d8ccc4",
    backgroundColor: "rgba(255,255,255,.72)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 13
  },
  restaurantMenuCategoryButtonActive: {
    borderColor: "#a7272b",
    backgroundColor: "#fff9f4"
  },
  restaurantMenuCategoryNumber: {
    color: "#b68f59",
    fontFamily: "Karla, sans-serif",
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 1,
    fontWeight: "800"
  },
  restaurantMenuCategoryText: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    whiteSpace: "nowrap"
  } as any,
  restaurantMenuUtilityRow: {
    flexGrow: 1,
    maxWidth: 430,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 7,
    minWidth: 0
  },
  restaurantMenuUtilityRowMobile: {
    width: "100%",
    maxWidth: "100%",
    justifyContent: "flex-start",
    gap: 6,
    paddingBottom: 2
  } as any,
  restaurantMenuUtilityButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 38,
    borderWidth: 1,
    borderColor: "#d2c2b7",
    backgroundColor: "#fffdf9",
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    transitionProperty: "border-color, background-color, transform",
    transitionDuration: "160ms"
  } as any,
  restaurantMenuUtilityButtonActive: {
    borderColor: colors.headerRed,
    backgroundColor: "#f3e7df",
    transform: [{ translateY: -1 }]
  },
  restaurantMenuUtilityIcon: {
    color: "#b68f59",
    fontFamily: "Heebo, sans-serif",
    fontSize: 13,
    lineHeight: 16
  },
  restaurantMenuUtilityText: {
    color: colors.headerRed,
    fontFamily: "Karla, sans-serif",
    fontSize: 9,
    lineHeight: 14,
    letterSpacing: 1.1,
    fontWeight: "800",
    whiteSpace: "nowrap"
  } as any,
  restaurantMenuAllergenJump: {
    flex: 1,
    minWidth: 0,
    minHeight: 38,
    borderWidth: 1,
    borderColor: colors.headerRed,
    backgroundColor: colors.headerRed,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  restaurantMenuAllergenJumpActive: {
    backgroundColor: "#6b171a",
    transform: [{ translateY: -1 }]
  },
  restaurantMenuAllergenJumpText: {
    color: "#ffffff",
    fontFamily: "Karla, sans-serif",
    fontSize: 9,
    lineHeight: 14,
    letterSpacing: 1,
    fontWeight: "800",
    whiteSpace: "nowrap"
  } as any,
  restaurantMenuAllergenJumpArrow: {
    color: "#dfbf78",
    fontSize: 14,
    lineHeight: 16
  },
  restaurantMenuBody: {
    backgroundColor: colors.paper,
    paddingVertical: 54,
    paddingHorizontal: 24,
    scrollMarginTop: 250
  } as any,
  restaurantMenuBodyInner: {
    width: "100%",
    maxWidth: 1180,
    minWidth: 0,
    marginHorizontal: "auto"
  },
  restaurantMenuSection: {
    scrollMarginTop: 360
  } as any,
  restaurantMenuSectionHeading: {
    minWidth: 0,
    alignItems: "flex-start",
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#d8ccc4"
  },
  restaurantMenuSectionTitleRow: {
    minWidth: 0,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    columnGap: 12,
    rowGap: 2
  },
  restaurantMenuSectionNumber: {
    color: "#b68f59",
    fontFamily: "Karla, sans-serif",
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 1.8,
    fontWeight: "900"
  },
  restaurantMenuSectionTitle: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: -0.8,
    fontWeight: "900"
  },
  restaurantMenuSectionTitleMobile: {
    fontSize: 27,
    lineHeight: 33,
    letterSpacing: -0.3
  },
  restaurantMenuSectionNote: {
    color: "#70635e",
    fontFamily: "Heebo, sans-serif",
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 760,
    marginTop: 7
  },
  restaurantMenuSectionCount: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 9,
    lineHeight: 16,
    letterSpacing: 1.2,
    fontWeight: "900",
    whiteSpace: "nowrap"
  } as any,
  restaurantMenuItemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 11,
    marginTop: 34
  } as any,
  restaurantMenuItemGridMobile: {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 8
  } as any,
  restaurantMenuItem: {
    minWidth: 0,
    minHeight: 96,
    borderWidth: 1,
    borderColor: "#d8ccc4",
    backgroundColor: "#ffffff",
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: "center"
  },
  restaurantMenuItemWarning: {
    borderColor: "#b6272c",
    borderLeftWidth: 4,
    backgroundColor: "#fff7f3"
  },
  restaurantMenuItemHeader: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14
  },
  restaurantMenuItemIdentity: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    columnGap: 9,
    rowGap: 6
  },
  restaurantMenuInlineBadges: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 5
  },
  restaurantMenuItemName: {
    minWidth: 0,
    flexShrink: 1,
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
    overflowWrap: "anywhere"
  } as any,
  restaurantMenuItemMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 18
  },
  restaurantMenuCode: {
    minWidth: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#bba77f",
    backgroundColor: "#f7f0df",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5
  },
  restaurantMenuCodeText: {
    color: "#745c2c",
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "800"
  },
  restaurantMenuAdditiveCode: {
    borderColor: "#b97d80",
    backgroundColor: "#faebeb"
  },
  restaurantMenuAdditiveCodeText: {
    color: colors.red
  },
  restaurantMenuDiet: {
    minHeight: 22,
    borderRadius: 999,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  restaurantMenuDietVegetarian: {
    backgroundColor: "#efe3c8"
  },
  restaurantMenuDietVegan: {
    backgroundColor: "#dbe9d7"
  },
  restaurantMenuDietText: {
    fontFamily: "Karla, sans-serif",
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 0.7,
    fontWeight: "800"
  },
  restaurantMenuDietTextVegetarian: {
    color: "#7b561c"
  },
  restaurantMenuDietTextVegan: {
    color: "#345a38"
  },
  restaurantMenuCheckNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e6c6c5",
    paddingTop: 12
  },
  restaurantMenuCheckIcon: {
    width: 20,
    height: 20,
    flexShrink: 0,
    borderRadius: 999,
    color: "#ffffff",
    backgroundColor: colors.red,
    fontFamily: "Heebo, sans-serif",
    fontSize: 12,
    lineHeight: 20,
    fontWeight: "900",
    textAlign: "center"
  },
  restaurantMenuCheckText: {
    flex: 1,
    color: "#8a1e22",
    fontFamily: "Heebo, sans-serif",
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "700"
  },
  restaurantMenuSectionDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "#d9cec6",
    marginVertical: 56
  },
  restaurantMenuEmpty: {
    minHeight: 420,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20
  },
  restaurantMenuEmptyKicker: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 2.4,
    fontWeight: "800"
  },
  restaurantMenuEmptyTitle: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 12
  },
  restaurantMenuEmptyText: {
    color: "#70635e",
    fontFamily: "Heebo, sans-serif",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 8
  },
  restaurantMenuEmptyButton: {
    minHeight: 44,
    backgroundColor: colors.headerRed,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 24
  },
  restaurantMenuEmptyButtonText: {
    color: "#ffffff",
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 1.5,
    fontWeight: "800"
  },
  restaurantMenuLegendSection: {
    backgroundColor: colors.wine,
    paddingVertical: 100,
    paddingHorizontal: 24,
    scrollMarginTop: 220
  } as any,
  restaurantMenuLegendInner: {
    width: "100%",
    maxWidth: 1180,
    minWidth: 0,
    marginHorizontal: "auto"
  },
  restaurantMenuLegendIntro: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 64
  },
  restaurantMenuLegendIntroMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 22
  },
  restaurantMenuLegendKicker: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 3.4,
    fontWeight: "800"
  },
  restaurantMenuLegendTitle: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 52,
    lineHeight: 58,
    letterSpacing: -1.2,
    fontWeight: "900",
    marginTop: 12
  },
  restaurantMenuLegendTitleMobile: {
    fontSize: 37,
    lineHeight: 43,
    letterSpacing: -0.5
  },
  restaurantMenuLegendLead: {
    maxWidth: 520,
    color: "rgba(255,255,255,.68)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 15,
    lineHeight: 25
  },
  restaurantMenuLegendColumns: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
    marginTop: 52
  } as any,
  restaurantMenuLegendColumnsMobile: {
    gridTemplateColumns: "minmax(0, 1fr)"
  } as any,
  restaurantMenuLegendColumn: {
    minWidth: 0,
    borderWidth: 1,
    borderColor: "rgba(223,191,120,.25)",
    backgroundColor: "rgba(255,255,255,.035)",
    paddingVertical: 28,
    paddingHorizontal: 24
  },
  restaurantMenuLegendColumnTitle: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 2,
    fontWeight: "800"
  },
  restaurantMenuLegendGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8,
    marginTop: 22
  } as any,
  restaurantMenuLegendItem: {
    minWidth: 0,
    minHeight: 52,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,.1)",
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingVertical: 9
  },
  restaurantMenuLegendCode: {
    width: 28,
    flexShrink: 0,
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "800"
  },
  restaurantMenuLegendDescription: {
    flex: 1,
    minWidth: 0,
    color: "rgba(255,255,255,.74)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 13,
    lineHeight: 19,
    overflowWrap: "anywhere"
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
  policyHeroSubtitle: {
    maxWidth: 650,
    color: colors.red,
    fontFamily: "Heebo, sans-serif",
    fontSize: 31,
    lineHeight: 38,
    letterSpacing: -0.5,
    fontWeight: "800",
    marginTop: 18
  },
  policyHeroSubtitleMobile: {
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.2
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
    paddingTop: 94
  } as any,
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
    backgroundColor: "#fffaf4",
    backgroundImage:
      "radial-gradient(circle at 50% 28%, rgba(167,25,30,.08), transparent 34%), linear-gradient(145deg, #fffdf8 0%, #f1e8df 100%)",
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
    backgroundColor: "rgba(167,25,30,.08)",
    boxShadow: "0 0 120px rgba(167,25,30,.08)"
  } as any,
  aboutHeroFigure: {
    width: "100%",
    height: "100%",
    objectFit: "contain"
  } as any,
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
  section: {
    paddingVertical: 96,
    paddingHorizontal: 32
  },
  storySection: {
    backgroundColor: colors.ivory
  },
  storyGrid: {
    maxWidth: 860,
    width: "100%",
    marginHorizontal: "auto",
    alignItems: "stretch"
  },
  stack: {
    flexDirection: "column",
    alignItems: "stretch"
  },
  storyCopy: {
    width: "100%",
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
    backgroundColor: colors.menuSurface,
    backgroundImage:
      "radial-gradient(circle at 8% 10%, rgba(167,25,30,.075), transparent 28%), linear-gradient(180deg, #f8f3ed 0%, #eee5dc 100%)",
    borderTopWidth: 1,
    borderTopColor: "#ded0c4"
  } as any,
  editorialHeroEyebrowMobile: {
    width: "100%",
    textAlign: "center"
  },
  menuEyebrow: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 4.2,
    fontWeight: "800",
    marginBottom: 16
  },
  menuSectionTitle: {
    color: colors.menuInk,
    fontFamily: "Heebo, sans-serif",
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "900",
    letterSpacing: -0.8,
    maxWidth: 780
  },
  sectionHeader: {
    maxWidth: 1120,
    width: "100%",
    marginHorizontal: "auto",
    marginBottom: 34
  },
  cardRailShell: {
    width: "100%",
    minWidth: 0,
    position: "relative"
  },
  cardRail: {
    width: "100%",
    minWidth: 0,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 16,
    overflowX: "auto",
    overscrollBehaviorX: "contain",
    scrollSnapType: "x mandatory",
    scrollbarWidth: "none",
    scrollBehavior: "smooth"
  } as any,
  cardRailContinuous: {
    scrollBehavior: "auto",
    scrollSnapType: "none"
  } as any,
  cardRailCentered: {
    justifyContent: "center"
  },
  cardRailOverflowing: {
    paddingHorizontal: 58,
    paddingBottom: 10
  },
  cardRailArrow: {
    position: "absolute",
    top: "50%",
    zIndex: 8,
    width: 44,
    height: 58,
    marginTop: -29,
    borderWidth: 1,
    borderColor: "#dfbf78",
    borderRadius: 6,
    backgroundColor: colors.headerRed,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 28px rgba(42,8,9,.24)",
    transitionDuration: "180ms",
    transitionProperty: "transform, background-color, border-color"
  } as any,
  cardRailArrowLeft: {
    left: 4
  },
  cardRailArrowRight: {
    right: 4
  },
  cardRailArrowGold: {
    borderColor: "#6c181b",
    backgroundColor: "#dfbf78"
  },
  cardRailArrowPaper: {
    borderColor: "#8c2b2f",
    backgroundColor: "#fff8ef"
  },
  cardRailArrowActive: {
    transform: [{ scale: 1.06 }],
    borderColor: "#f1d89d"
  },
  cardRailArrowText: {
    color: "#dfbf78",
    fontFamily: "Heebo, sans-serif",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800"
  },
  cardRailArrowTextGold: {
    color: "#641619"
  },
  cardRailArrowTextPaper: {
    color: "#7a2024"
  },
  menuRailItem: {
    width: "clamp(220px, 72vw, 270px)",
    flexShrink: 0,
    scrollSnapAlign: "start"
  } as any,
  menuCard: {
    width: "100%",
    aspectRatio: 9 / 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d3c1b4",
    backgroundColor: colors.menuSurfaceRaised,
    overflow: "hidden",
    boxShadow: "0 18px 46px rgba(67,25,19,.13)",
    transitionDuration: "260ms",
    transitionProperty: "transform, box-shadow, border-color",
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
    transformOrigin: "center center"
  } as any,
  menuCardActive: {
    borderColor: "#9f4447",
    boxShadow: "0 28px 58px rgba(83,14,15,.22)",
    transform: [{ translateY: -7 }, { scale: 1.015 }]
  } as any,
  menuCardMedia: {
    height: "100%",
    width: "100%",
    position: "relative",
    overflow: "hidden"
  } as any,
  menuImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transitionDuration: "480ms",
    transitionProperty: "transform",
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
  } as any,
  menuImageActive: {
    transform: [{ scale: 1.035 }]
  } as any,
  menuBackShade: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(180deg, rgba(35,10,8,.02) 0%, rgba(35,10,8,.12) 42%, rgba(35,10,8,.88) 100%)"
  } as any,
  menuCardNumber: {
    position: "absolute",
    top: 18,
    left: 18,
    zIndex: 2,
    color: colors.cream,
    backgroundColor: "rgba(83,14,15,.9)",
    borderWidth: 1,
    borderColor: "rgba(255,248,238,.48)",
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 10,
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 2,
    fontWeight: "800"
  } as any,
  menuBackCaption: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 22,
    zIndex: 2
  } as any,
  menuBackTitle: {
    color: colors.cream,
    fontFamily: "Heebo, sans-serif",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,.42)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12
  },
  menuCardDescription: {
    color: "rgba(255,248,238,.84)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7
  },
  craftSection: {
    backgroundColor: "#4d1113",
    backgroundImage:
      "linear-gradient(135deg, rgba(223,191,120,.12), transparent 34%), radial-gradient(circle at 82% 72%, rgba(130,34,38,.74), transparent 38%)"
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
    backgroundColor: "#eee6df",
    backgroundImage:
      "linear-gradient(135deg, rgba(83,14,15,.055), transparent 34%), linear-gradient(180deg, #f3eee9 0%, #e9dfd7 100%)"
  } as any,
  contactPanel: {
    maxWidth: 1120,
    width: "100%",
    minWidth: 0,
    marginHorizontal: "auto",
    flexDirection: "row",
    alignItems: "stretch",
    borderWidth: 1,
    borderColor: "#c9b9ad",
    backgroundColor: "#fffaf4",
    boxShadow: "0 30px 80px rgba(44,13,11,.12)"
  } as any,
  contactPanelMobile: {
    flexDirection: "column"
  },
  contactCopy: {
    flex: 1,
    minWidth: 0,
    paddingVertical: "clamp(38px, 6vw, 72px)",
    paddingHorizontal: "clamp(24px, 6vw, 76px)",
    position: "relative"
  } as any,
  contactAccentLine: {
    width: 58,
    height: 3,
    backgroundColor: colors.red,
    marginBottom: 24
  },
  contactKicker: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 3,
    fontWeight: "800"
  },
  contactKickerMobile: {
    fontSize: 9,
    lineHeight: 15,
    letterSpacing: 1.6,
    overflowWrap: "anywhere"
  } as any,
  contactTitle: {
    maxWidth: 590,
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 54,
    lineHeight: 59,
    letterSpacing: -1.2,
    fontWeight: "900",
    marginTop: 13
  },
  contactTitleMobile: {
    fontSize: 38,
    lineHeight: 43,
    letterSpacing: -0.5
  },
  contactText: {
    color: "#5b4e48",
    fontFamily: "Heebo, sans-serif",
    fontSize: 17,
    lineHeight: 28,
    maxWidth: 580,
    marginTop: 17
  },
  contactDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 42,
    marginTop: 36
  },
  contactDetailsMobile: {
    gap: 24
  },
  contactDetail: {
    minWidth: 150,
    borderTopWidth: 1,
    borderTopColor: "#d7c8bd",
    paddingTop: 12
  },
  contactDetailLabel: {
    color: "#a7191e",
    fontFamily: "Karla, sans-serif",
    fontSize: 9,
    lineHeight: 14,
    letterSpacing: 2.1,
    fontWeight: "800"
  },
  contactDetailValue: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800",
    marginTop: 4
  },
  contactAddressActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 9,
    marginTop: 20
  },
  contactAddressAction: {
    minHeight: 44,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "transparent"
  },
  contactAddressActionActive: {
    borderBottomColor: colors.red
  },
  contactAddressActionText: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800",
    letterSpacing: 0.35
  },
  contactAddressDivider: {
    color: "#a98f81",
    fontFamily: "Karla, sans-serif",
    fontSize: 14,
    lineHeight: 18
  },
  contactAddressCopied: {
    color: "#6b171a",
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "800",
    marginTop: 2
  },
  contactActionColumn: {
    width: "clamp(330px, 35vw, 410px)",
    flexShrink: 0,
    backgroundColor: colors.headerRed,
    paddingVertical: "clamp(34px, 5vw, 58px)",
    paddingHorizontal: "clamp(20px, 4vw, 38px)",
    justifyContent: "center",
    gap: 10
  } as any,
  contactActionColumnMobile: {
    width: "100%",
    flexShrink: 1
  },
  contactActionIntro: {
    color: "rgba(255,255,255,.7)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: 10
  },
  contactAction: {
    width: "100%",
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderWidth: 1,
    transitionDuration: "180ms",
    transitionProperty: "transform, background-color, border-color"
  } as any,
  contactActionPrimary: {
    backgroundColor: "#dfbf78",
    borderColor: "#dfbf78"
  },
  contactActionPrimaryActive: {
    backgroundColor: "#f0d897",
    borderColor: "#f0d897",
    transform: [{ translateX: 4 }]
  },
  contactActionSecondary: {
    backgroundColor: "transparent",
    borderColor: "rgba(255,255,255,.3)"
  },
  contactActionSecondaryActive: {
    backgroundColor: "rgba(255,255,255,.08)",
    borderColor: "rgba(255,255,255,.65)",
    transform: [{ translateX: 4 }]
  },
  contactActionLabelPrimary: {
    color: "#6c181b",
    fontFamily: "Karla, sans-serif",
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 2,
    fontWeight: "800"
  },
  contactActionTextPrimary: {
    color: "#2a0809",
    fontFamily: "Heebo, sans-serif",
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900",
    marginTop: 3
  },
  contactActionArrowPrimary: {
    color: "#6c181b",
    fontFamily: "Heebo, sans-serif",
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800"
  },
  contactActionLabelSecondary: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 2,
    fontWeight: "800"
  },
  contactActionTextSecondary: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900",
    marginTop: 3
  },
  contactActionArrowSecondary: {
    color: "#dfbf78",
    fontFamily: "Heebo, sans-serif",
    fontSize: 23,
    lineHeight: 27,
    fontWeight: "800"
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
  quickActionsGroup: {
    width: "100%"
  },
  quickActionsContactSection: {
    width: "100%",
    backgroundColor: "#eee4da",
    backgroundImage:
      "radial-gradient(circle at 90% 18%, rgba(167,25,30,.07), transparent 28%), linear-gradient(180deg, #f4ede6 0%, #e9ddd2 100%)",
    paddingVertical: 72,
    paddingHorizontal: 32,
    borderTopWidth: 1,
    borderTopColor: "#d7c7ba",
    scrollMarginTop: 88
  } as any,
  quickActionsContactInner: {
    width: "100%",
    maxWidth: 1180,
    marginHorizontal: "auto"
  },
  quickActionsGroupEyebrow: {
    color: colors.red,
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 2.8,
    fontWeight: "800",
    textAlign: "center"
  },
  quickActionsGroupEyebrowContact: {
    color: colors.red
  },
  quickActionsGroupText: {
    color: "#6b5b54",
    fontFamily: "Heebo, sans-serif",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 7,
    marginBottom: 22
  },
  quickActionsGroupTextContact: {
    color: "#6b5b54"
  },
  quickActionsSocialPrompt: {
    color: colors.menuInk,
    fontSize: 21,
    lineHeight: 28,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginTop: 10,
    marginBottom: 28
  },
  quickActionsGrid: {
    width: "100%",
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(190px, 218px))",
    justifyContent: "center",
    gap: 18
  } as any,
  quickActionsGridTablet: {
    gridTemplateColumns: "repeat(2, minmax(190px, 218px))",
    gap: 16
  } as any,
  quickActionsGridCompact: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10
  } as any,
  quickActionCard: {
    width: "100%",
    minWidth: 0,
    maxWidth: 218,
    aspectRatio: 4 / 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8a6638",
    backgroundColor: colors.headerRed,
    paddingVertical: "clamp(16px, 2vw, 20px)",
    paddingHorizontal: "clamp(12px, 1.8vw, 18px)",
    alignItems: "center",
    justifyContent: "center",
    transitionDuration: "180ms",
    transitionProperty: "transform, box-shadow, background-color, border-color"
  } as any,
  quickActionCardActive: {
    transform: [{ translateY: -4 }],
    borderColor: "#dfbf78",
    backgroundColor: colors.headerRed,
    boxShadow: "0 18px 34px rgba(83,14,15,.22)"
  } as any,
  quickActionCardContact: {
    aspectRatio: 4 / 5,
    borderWidth: 1,
    borderColor: "#8a6638",
    backgroundColor: colors.headerRed
  },
  quickActionCardContactActive: {
    transform: [{ translateY: -4 }],
    borderColor: "#dfbf78",
    backgroundColor: colors.headerRed,
    boxShadow: "0 18px 34px rgba(83,14,15,.18)"
  } as any,
  quickActionCardUnavailable: {
    borderWidth: 1,
    borderColor: colors.quickUnavailableBorder,
    backgroundColor: colors.quickUnavailableSurface,
    opacity: 1
  },
  quickActionCardCopy: {
    width: "100%",
    minWidth: 0,
    alignItems: "center"
  },
  quickActionIconFrame: {
    width: "clamp(48px, 5vw, 58px)",
    height: "clamp(48px, 5vw, 58px)",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(223,191,120,.64)",
    backgroundColor: "rgba(22,8,7,.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15
  } as any,
  quickActionIconFrameContact: {
    borderColor: "rgba(223,191,120,.64)",
    backgroundColor: "rgba(22,8,7,.2)"
  },
  quickActionIconFrameUnavailable: {
    borderColor: "rgba(223,191,120,.64)",
    backgroundColor: "rgba(22,8,7,.2)"
  },
  quickActionGlyph: {
    width: "clamp(25px, 3vw, 31px)",
    height: "clamp(25px, 3vw, 31px)"
  } as any,
  quickActionGlyphCompact: {
    width: 22,
    height: 22
  },
  quickActionLabel: {
    color: colors.cream,
    fontFamily: "Heebo, sans-serif",
    fontSize: "clamp(15px, 2vw, 18px)",
    lineHeight: "clamp(21px, 2.5vw, 25px)",
    fontWeight: "800",
    textAlign: "center"
  } as any,
  quickActionLabelContact: {
    color: colors.cream
  },
  quickActionLabelUnavailable: {
    color: "#fff8ef"
  },
  quickActionDetail: {
    color: colors.sand,
    fontFamily: "Karla, sans-serif",
    fontSize: "clamp(9px, 1.4vw, 11px)",
    lineHeight: "clamp(14px, 1.8vw, 16px)",
    letterSpacing: 0.6,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 5,
    overflowWrap: "anywhere"
  } as any,
  quickActionDetailContact: {
    color: colors.sand
  },
  quickActionDetailUnavailable: {
    color: colors.sand
  },
  mobileActionDock: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 95,
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
  backToTop: {
    position: "fixed",
    right: 16,
    bottom: "calc(84px + env(safe-area-inset-bottom))",
    zIndex: 90,
    width: 58,
    height: 62,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(223,191,120,.68)",
    backgroundColor: "#530e0f",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    boxShadow: "0 14px 36px rgba(16,3,3,.34)",
    transitionProperty: "opacity, transform, background-color, border-color",
    transitionDuration: "220ms"
  } as any,
  backToTopDesktop: {
    right: 24,
    bottom: 120
  },
  backToTopVisible: {
    opacity: 1,
    transform: [{ translateY: 0 }]
  },
  backToTopHidden: {
    opacity: 0,
    transform: [{ translateY: 14 }]
  },
  backToTopActive: {
    backgroundColor: "#6b171a",
    borderColor: "#dfbf78",
    transform: [{ translateY: -3 }]
  },
  backToTopArrow: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 23,
    lineHeight: 23,
    fontWeight: "700"
  },
  backToTopLabel: {
    color: "#ffffff",
    fontFamily: "Karla, sans-serif",
    fontSize: 8,
    lineHeight: 11,
    letterSpacing: 1.3,
    fontWeight: "800"
  },
  footer: {
    position: "relative",
    zIndex: 80,
    overflow: "hidden",
    backgroundColor: "#100403",
    backgroundImage:
      "linear-gradient(135deg, rgba(83,14,15,.38) 0%, rgba(16,4,3,0) 52%), linear-gradient(180deg, #170706 0%, #0b0303 100%)",
    borderTopWidth: 1,
    borderTopColor: "rgba(223,191,120,.48)",
    paddingHorizontal: "clamp(18px, 4vw, 56px)",
    paddingBottom: 20
  } as any,
  footerGlow: {
    position: "absolute",
    width: 520,
    height: 520,
    right: -220,
    top: -260,
    borderRadius: 520,
    backgroundColor: "rgba(125,25,27,.16)",
    filter: "blur(80px)",
    pointerEvents: "none"
  } as any,
  footerFrame: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 1180,
    marginHorizontal: "auto"
  },
  footerMasthead: {
    paddingVertical: 76,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 64
  },
  footerMastheadMobile: {
    paddingVertical: 52,
    flexDirection: "column",
    alignItems: "stretch",
    gap: 34
  },
  footerMastheadCopy: {
    flex: 1,
    maxWidth: 680
  },
  footerEyebrow: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 3,
    fontWeight: "800",
    marginBottom: 17
  },
  footerTitle: {
    color: "#fffaf2",
    fontFamily: "Heebo, sans-serif",
    fontSize: 54,
    lineHeight: 59,
    letterSpacing: -2,
    fontWeight: "800",
    maxWidth: 640
  },
  footerTitleMobile: {
    fontSize: 38,
    lineHeight: 43,
    letterSpacing: -1.2
  },
  footerLead: {
    color: "rgba(255,250,242,.68)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 17,
    lineHeight: 28,
    marginTop: 19,
    maxWidth: 580
  },
  footerPrimaryActions: {
    width: 340,
    flexShrink: 0,
    gap: 10
  },
  footerPrimaryActionsMobile: {
    width: "100%"
  },
  footerPrimaryAction: {
    minHeight: 88,
    backgroundColor: "#dfbf78",
    borderWidth: 1,
    borderColor: "#dfbf78",
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    transitionProperty: "transform, background-color",
    transitionDuration: "180ms"
  } as any,
  footerPrimaryActionActive: {
    backgroundColor: "#ead092",
    transform: [{ translateX: 4 }]
  },
  footerActionKicker: {
    color: "#530e0f",
    fontFamily: "Karla, sans-serif",
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 1.8,
    fontWeight: "800"
  },
  footerActionText: {
    color: "#270706",
    fontFamily: "Heebo, sans-serif",
    fontSize: 21,
    lineHeight: 28,
    fontWeight: "800",
    marginTop: 3
  },
  footerActionArrow: {
    color: "#530e0f",
    fontSize: 25,
    lineHeight: 28,
    fontWeight: "700"
  },
  footerSecondaryAction: {
    minHeight: 76,
    backgroundColor: "rgba(255,255,255,.025)",
    borderWidth: 1,
    borderColor: "rgba(223,191,120,.34)",
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    transitionProperty: "transform, border-color, background-color",
    transitionDuration: "180ms"
  } as any,
  footerSecondaryActionActive: {
    backgroundColor: "rgba(223,191,120,.08)",
    borderColor: "#dfbf78",
    transform: [{ translateX: 4 }]
  },
  footerSecondaryKicker: {
    color: "rgba(255,250,242,.52)",
    fontFamily: "Karla, sans-serif",
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 1.7,
    fontWeight: "800"
  },
  footerSecondaryText: {
    color: "#fffaf2",
    fontFamily: "Heebo, sans-serif",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    marginTop: 2
  },
  footerSecondaryArrow: {
    color: "#dfbf78",
    fontSize: 23,
    lineHeight: 26
  },
  footerRule: {
    height: 1,
    backgroundColor: "rgba(223,191,120,.28)"
  },
  footerInfoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(230px, 100%), 1fr))",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(223,191,120,.18)"
  } as any,
  footerColumn: {
    minWidth: 0,
    minHeight: 300,
    paddingVertical: 34,
    paddingHorizontal: "clamp(18px, 2.5vw, 30px)",
    borderRightWidth: 1,
    borderRightColor: "rgba(223,191,120,.18)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(223,191,120,.18)"
  } as any,
  footerColumnNumber: {
    color: "#b99556",
    fontFamily: "Karla, sans-serif",
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 1.8,
    fontWeight: "800",
    marginBottom: 12
  },
  footerColumnTitle: {
    color: "#fffaf2",
    fontFamily: "Heebo, sans-serif",
    fontSize: 23,
    lineHeight: 30,
    fontWeight: "800",
    marginBottom: 20
  },
  footerColumnMuted: {
    color: "rgba(255,250,242,.54)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 14,
    lineHeight: 22
  },
  footerHoursSecondary: {
    marginTop: 12
  },
  footerColumnStrong: {
    color: "#fffaf2",
    fontFamily: "Heebo, sans-serif",
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "800",
    marginTop: 3
  },
  footerAddress: {
    minHeight: 44,
    justifyContent: "center",
    marginTop: 18,
    transitionProperty: "opacity",
    transitionDuration: "160ms"
  } as any,
  footerAddressActive: {
    opacity: 0.72
  },
  footerAddressText: {
    color: "rgba(255,250,242,.82)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 14,
    lineHeight: 21,
    overflowWrap: "anywhere"
  } as any,
  footerInlineActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginTop: 10
  },
  footerTextLinkButton: {
    minHeight: 32,
    justifyContent: "center"
  },
  footerTextLink: {
    color: "#dfbf78",
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "800"
  },
  footerInlineDivider: {
    color: "rgba(223,191,120,.44)"
  },
  footerCopied: {
    color: "#ead092",
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5
  },
  footerNavLink: {
    minHeight: 45,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,250,242,.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    transitionProperty: "transform, background-color",
    transitionDuration: "160ms"
  } as any,
  footerNavLinkActive: {
    backgroundColor: "rgba(223,191,120,.045)",
    transform: [{ translateX: 4 }]
  },
  footerNavLinkDisabled: {
    opacity: 0.56
  },
  footerNavLinkText: {
    color: "rgba(255,250,242,.78)",
    fontFamily: "Heebo, sans-serif",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600"
  },
  footerNavLinkArrow: {
    color: "#b99556",
    fontSize: 15,
    lineHeight: 20
  },
  footerEmail: {
    color: "rgba(255,250,242,.46)",
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 18,
    marginTop: 18,
    overflowWrap: "anywhere"
  } as any,
  footerBottom: {
    paddingVertical: 38,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 32
  },
  footerBottomMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingVertical: 30,
    gap: 20
  },
  footerBottomCopy: {
    maxWidth: 460,
    alignItems: "flex-end"
  },
  footerBottomCopyMobile: {
    width: "100%",
    alignItems: "flex-start"
  },
  footerFaqText: {
    color: "rgba(255,250,242,.48)",
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 18,
    textAlign: "right"
  },
  footerFaqTextMobile: {
    textAlign: "left"
  },
  copyright: {
    color: "rgba(255,250,242,.38)",
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1,
    marginTop: 6,
    textAlign: "right"
  },
  copyrightMobile: {
    textAlign: "left"
  }
});

export default App;
