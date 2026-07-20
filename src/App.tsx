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
const footerTransparentLogoImage = "/images/bedri-footer-logo-cutout.png";
const instagramIconImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5.2" stroke="#ffffff" stroke-width="2.2"/><circle cx="12" cy="12" r="4.2" stroke="#ffffff" stroke-width="2.2"/><circle cx="17.3" cy="6.7" r="1.25" fill="#ffffff"/></svg>`
)}`;
const youtubeIconImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" fill="none"><rect x="1.5" y="1.5" width="25" height="17" rx="5" stroke="#ffffff" stroke-width="2.4"/><path d="M12 6.2v7.6l6.5-3.8L12 6.2Z" fill="#ffffff"/></svg>`
)}`;
const menuKebabImage = "https://commons.wikimedia.org/wiki/Special:FilePath/Adana_kebap_2024.jpg?width=900";
const menuLahmacunImage = "https://commons.wikimedia.org/wiki/Special:FilePath/Ac%C4%B1l%C4%B1_Lahmacun.jpg?width=900";
const menuMezeImage = "https://commons.wikimedia.org/wiki/Special:FilePath/Turkish_meze_plate.jpg?width=900";
const menuDessertImage = "https://commons.wikimedia.org/wiki/Special:FilePath/F%C4%B1st%C4%B1kl%C4%B1_Baklava.jpg?width=900";
const restaurantAddress = "K1 1-4, 68159 Mannheim, Almanya";
const encodedRestaurantAddress = encodeURIComponent(restaurantAddress);
const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodedRestaurantAddress}`;

const navItems = [
  { label: "Anasayfa", href: "#home" },
  {
    label: "Kurumsal",
    items: [
      { label: "Hakkımızda", href: "#about" },
      { label: "Jobs", href: "#jobs" },
      { label: "Politikalarımız", href: "#policies" }
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
  ["Usta Isi", "Her tabak ayni ritimle hazirlanir: sade, net, hafizada kalici."],
  ["Ates Dengesi", "Is, tuz, aci ve doku birbirini bastirmadan ayni sofrada bulusur."],
  ["Misafirlik", "Hizli degil, iyi agirlanmis hissettiren bir restoran deneyimi."]
];

function scrollToHash(hash: string) {
  const element = document.querySelector(hash);
  element?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openNavigationTarget(href: string) {
  if (href.startsWith("#")) {
    scrollToHash(href);
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

async function openMapForAddress() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = userAgent.includes("android");
  const isIOS =
    /iphone|ipad|ipod/.test(userAgent) ||
    (userAgent.includes("macintosh") && navigator.maxTouchPoints > 1);
  const mapUrls = isIOS
    ? [`maps://?q=${encodedRestaurantAddress}`, googleMapsLink]
    : isAndroid
      ? [`geo:0,0?q=${encodedRestaurantAddress}`, googleMapsLink]
      : [googleMapsLink];

  for (const url of mapUrls) {
    try {
      await Linking.openURL(url);
      return;
    } catch {
      continue;
    }
  }
}

function App() {
  const { width } = useWindowDimensions();
  const layout = useMemo(
    () => ({
      isMobile: width < 1180
    }),
    [width]
  );

  return (
    <View style={styles.page}>
      <Header isMobile={layout.isMobile} />

      <View nativeID="home" style={[styles.hero, layout.isMobile && styles.heroMobile]}>
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
            <Text style={styles.eyebrowDark}>BEDRI USTA</Text>
            <Text style={[styles.sectionTitle, layout.isMobile && styles.sectionTitleMobile]}>
              "Kebabin yanindaki kozlenmis biber gibi seviyorum."
            </Text>
            <Text style={styles.bodyText}>
              Bedri Usta'nin dili gosteristen cok lezzetin kendisine yaslanir.
              Sofrada fazla sus yoktur; iyi et, dogru ates, sicak servis ve
              unutulmayan bir imza vardir.
            </Text>
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
            Ustaligin pahali gorunmesi gerekmez; iyi hissedilmesi yeter.
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

      <Footer isMobile={layout.isMobile} />
    </View>
  );
}

function Header({ isMobile }: { isMobile: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const leftNavItems = navItems.slice(0, 2);
  const rightNavItems = navItems.slice(2);
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

      <View style={styles.headerRail}>
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

        <Pressable style={styles.logoButton} onPress={() => scrollToHash("#home")}>
          <Image source={{ uri: logoImage }} style={styles.logo as any} resizeMode="contain" />
        </Pressable>

        {!isMobile ? (
          <View style={styles.navSide}>
            {rightNavItems.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </View>
        ) : (
          <View style={styles.mobileHeaderSpacer} />
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

function NavItem({
  item,
  compact = false
}: {
  item: (typeof navItems)[number];
  compact?: boolean;
}) {
  const dropdownItems = "items" in item ? item.items : undefined;

  if (dropdownItems) {
    return (
      <Pressable style={styles.navDropdown}>
        {({ hovered, pressed }: any) => {
          const open = hovered || pressed;
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
                      onPress={() => openNavigationTarget(child.href)}
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
          <Image
            source={{ uri: footerTransparentLogoImage }}
            style={[styles.footerBrandFigure, isMobile && styles.footerBrandFigureMobile] as any}
            resizeMode="contain"
          />
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
              <Pressable onPress={handleCopyAddress}>
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
  wine: "#170a08",
  red: "#741b15",
  cream: "#fff7df",
  ivory: "#fffaf0",
  sand: "#ead5ac",
  copper: "#c46632",
  ink: "#0c0705"
};

const styles = StyleSheet.create({
  page: {
    minHeight: "100vh",
    backgroundColor: colors.wine
  } as any,
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingTop: 12,
    paddingHorizontal: 20
  } as any,
  headerRail: {
    minHeight: 76,
    maxWidth: 1180,
    width: "100%",
    marginHorizontal: "auto",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 247, 223, 0.28)",
    backgroundColor: "rgba(116, 27, 21, 0.55)",
    backdropFilter: "blur(18px)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    position: "relative",
    zIndex: 21,
    boxShadow: "0 18px 50px rgba(0,0,0,0.3)"
  } as any,
  navSide: {
    width: "38%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 8
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
    width: 48,
    height: 44,
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
  mobileHeaderSpacer: {
    width: 48,
    height: 44
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
      "radial-gradient(circle at 78% 25%, rgba(196,102,50,.26), transparent 34%), radial-gradient(circle at 18% 78%, rgba(116,27,21,.5), transparent 38%)"
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
  footerBrandFigure: {
    width: "100%",
    maxWidth: 340,
    height: 420,
    objectFit: "contain",
    backgroundColor: "transparent"
  } as any,
  footerBrandFigureMobile: {
    width: "min(72vw, 320px)",
    maxWidth: 320,
    height: "min(96vw, 420px)",
    maxHeight: 420,
    flexShrink: 0,
    marginBottom: 14
  } as any,
  footerText: {
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 18,
    lineHeight: 29,
    marginTop: 14,
    fontWeight: "700",
    maxWidth: 360
  },
  footerTextMobile: {
    textAlign: "center",
    maxWidth: 520,
    marginTop: 0,
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
