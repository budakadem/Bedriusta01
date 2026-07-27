import { useEffect, useMemo, useRef, useState } from "react";
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

const logoImage = "/images/bedriusta-logo.png";
const portraitImage = "/images/bedri-portrait.png";
const heroV3Image = "/images/hero-v3.png";
const heroVideo = "/videos/hero-deneme02.mp4";
const editorialHeroImage = "/images/mannheim-editorial-hero-v2.webp";
const aboutIllustrationImage = "/images/bedri-usta-about-illustration.webp";
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
const menuKebabImage = "/images/adana-kebap-premium.webp";
const menuLahmacunImage = "https://commons.wikimedia.org/wiki/Special:FilePath/Ac%C4%B1l%C4%B1_Lahmacun.jpg?width=900";
const menuMezeImage = "https://commons.wikimedia.org/wiki/Special:FilePath/Turkish_meze_plate.jpg?width=900";
const menuDessertImage = "https://commons.wikimedia.org/wiki/Special:FilePath/F%C4%B1st%C4%B1kl%C4%B1_Baklava.jpg?width=900";
const restaurantAddress = "K1 1-4, 68159 Mannheim, Almanya";
const restaurantMapDestination = `QULIS - Mannheim, ${restaurantAddress}`;
const encodedRestaurantDestination = encodeURIComponent(restaurantMapDestination);
const googleMapsLink =
  `https://www.google.com/maps/dir/?api=1&destination=${encodedRestaurantDestination}` +
  "&travelmode=driving&dir_action=navigate";
const androidGoogleNavigationLink =
  `google.navigation:q=${encodedRestaurantDestination}&mode=d`;

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
  { label: "Menü", href: "/menu" },
  { label: "Rezervasyon", href: "tel:+902160000000" }
];

const languageOptions = [
  { code: "TR", label: "Türkçe" },
  { code: "DE", label: "Deutsch" },
  { code: "ENG", label: "English" }
] as const;

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
    text: "Zırh kıyma, seçkin baharatlar ve dengeli acıyla hazırlanan imza lezzet.",
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

const proofItems = [
  ["Usta İşi", "Her tabak aynı özenle hazırlanır: sade, net ve hafızada kalıcı."],
  ["Lezzet Dengesi", "Tuz, acı ve doku aynı sofrada kusursuz bir uyum yakalar."],
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
  if (/Android/i.test(navigator.userAgent)) {
    const fallbackTimer = window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        window.location.assign(googleMapsLink);
      }
    }, 1400);

    const cancelFallbackWhenMapsOpens = () => {
      if (document.visibilityState === "hidden") {
        window.clearTimeout(fallbackTimer);
      }
    };

    document.addEventListener("visibilitychange", cancelFallbackWhenMapsOpens, {
      once: true
    });
    window.location.assign(androidGoogleNavigationLink);
    return;
  }

  Linking.openURL(googleMapsLink).catch(() => {
    window.location.assign(googleMapsLink);
  });
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
            </View>
          </View>
        </View>
      </View>

      <View nativeID="menu" style={[styles.section, styles.menuSection]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.eyebrow}>MENUMUZ</Text>
          <Text style={[styles.sectionTitleLight, layout.isMobile && styles.sectionTitleMobile]}>
            Paylaşılan her tabakta ustalık, her sofrada güzel bir sohbet var.
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
      </View>

      <View style={[styles.section, styles.craftSection]}>
        <View style={[styles.craftInner, layout.isMobile && styles.stack]}>
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
        </View>
      </View>

      <View nativeID="contact" style={[styles.section, styles.contactSection]}>
        <View style={[styles.contactPanel, layout.isMobile && styles.contactPanelMobile]}>
          <View style={styles.contactCopy}>
            <View style={styles.contactAccentLine} />
            <Text style={styles.contactKicker}>REZERVASYON · MANNHEIM</Text>
            <Text style={[styles.contactTitle, layout.isMobile && styles.contactTitleMobile]}>
              Bir masa, güzel bir akşam.
            </Text>
            <Text style={styles.contactText}>
              Aile yemeği, iş buluşması ya da sakin bir akşam için Bedri Usta
              deneyiminizi şimdiden planlayın.
            </Text>

            <View style={[styles.contactDetails, layout.isMobile && styles.contactDetailsMobile]}>
              <View style={styles.contactDetail}>
                <Text style={styles.contactDetailLabel}>HER GÜN</Text>
                <Text style={styles.contactDetailValue}>12:00 — 23:30</Text>
              </View>
              <View style={styles.contactDetail}>
                <Text style={styles.contactDetailLabel}>MANNHEIM</Text>
                <Text style={styles.contactDetailValue}>K1 1-4 · 68159</Text>
              </View>
            </View>
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
              onPress={() => Linking.openURL("tel:+902160000000")}
              accessibilityRole="link"
              accessibilityLabel="Rezervasyon için ara"
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
        </View>
      </View>

      <QuickActionsSection compact={layout.compactActions} />
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
              Mezeden kebaba, taş fırından tatlıya; güncel fiyatlar ve açık alerjen
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
              {restaurantMenuSections.length} bölüm · fiyat ve alerjen bilgileri güncel
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
                onPress={() => openMenuPdf("bedri-usta-mannheim-menu.pdf")}
                style={({ hovered, pressed }: any) => [
                  styles.restaurantMenuUtilityButton,
                  (hovered || pressed) && styles.restaurantMenuUtilityButtonActive
                ]}
                accessibilityRole="link"
                accessibilityLabel="Menü PDF dosyasını aç"
              >
                <Text style={styles.restaurantMenuUtilityIcon}>↗</Text>
                <Text style={styles.restaurantMenuUtilityText}>MENÜ PDF</Text>
              </Pressable>
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
                        <Text style={styles.restaurantMenuItemPrice}>{item.price}</Text>
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
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] =
    useState<(typeof languageOptions)[number]["code"]>("TR");
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
      accessibilityLabel="Kullanıcı ve dil seçenekleri"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Login"
        style={({ hovered, pressed }: any) => [
          styles.headerLogin,
          compact && styles.headerLoginCompact,
          (hovered || pressed) && styles.headerUtilityActive
        ]}
      >
        <Image
          source={{ uri: loginUserIcon }}
          style={[styles.headerLoginIcon, compact && styles.headerLoginIconCompact] as any}
          resizeMode="contain"
        />
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

function QuickActionsSection({ compact }: { compact: boolean }) {
  const actions: Array<{
    label: string;
    detail: string;
    icon: QuickActionIconName;
    action?: () => void;
  }> = [
    { label: "Menü", detail: "Lezzetleri keşfet", icon: "menu", action: () => openNavigationTarget("/menu") },
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
    { label: "Menü", icon: "menu", action: () => openNavigationTarget("/menu") },
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
  const copyToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exploreLinks = [
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Menü", href: "/menu" },
    { label: "Politikalarımız", href: "/politikalarimiz" },
    { label: "Kariyer", href: "#jobs" }
  ];
  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/bedriustaa" },
    { label: "YouTube", href: "https://www.youtube.com/c/BedriUsta" },
    { label: "E-posta", href: "mailto:info@bedriusta.de" }
  ];
  const legalLinks = [
    { label: "Impressum", href: "#policies" },
    { label: "Datenschutz", href: "#policies" },
    { label: "Cookie-Einstellungen", href: "#policies" },
    { label: "FAQ", href: "#faq" }
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
      <View style={styles.footerGlow} />
      <View style={styles.footerFrame}>
        <View style={[styles.footerMasthead, isMobile && styles.footerMastheadMobile]}>
          <View style={styles.footerMastheadCopy}>
            <Text style={styles.footerEyebrow}>BEDRİ USTA · MANNHEIM</Text>
            <Text style={[styles.footerTitle, isMobile && styles.footerTitleMobile]}>
              Mannheim’da sofranın yeni adresi.
            </Text>
            <Text style={styles.footerLead}>
              Ustalıkla hazırlanan kebaplar, özenli servis ve sıcak Türk misafirliği.
            </Text>
          </View>
          <View style={[styles.footerPrimaryActions, isMobile && styles.footerPrimaryActionsMobile]}>
            <Pressable
              onPress={() => Linking.openURL("tel:+902160000000")}
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
            <Text style={styles.footerColumnMuted}>Pazartesi — Pazar</Text>
            <Text style={styles.footerColumnStrong}>12:00 — 23:30</Text>
            <Pressable
              onPress={openMapForAddress}
              accessibilityRole="link"
              accessibilityLabel="QULIS Mannheim adresini haritada aç"
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
                nativeID={item.href === "#jobs" ? "jobs" : undefined}
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
        </View>

        <View style={[styles.footerBottom, isMobile && styles.footerBottomMobile]}>
          <View style={[styles.footerBottomCopy, isMobile && styles.footerBottomCopyMobile]}>
            <Text
              nativeID="faq"
              style={[styles.footerFaqText, isMobile && styles.footerFaqTextMobile]}
            >
              Rezervasyon ve ziyaret sorularınız için bize ulaşabilirsiniz.
            </Text>
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
    gap: 8,
    position: "relative",
    zIndex: 44
  },
  headerUtilitiesCompact: {
    width: 80,
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
    minWidth: 39,
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
  restaurantMenuItemPrice: {
    flexShrink: 0,
    color: colors.red,
    fontFamily: "Heebo, sans-serif",
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "900"
  },
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
    height: "100%",
    objectFit: "cover"
  } as any,
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
