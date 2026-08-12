import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  getOneSignalSnapshot,
  initializeOneSignal,
  requestPushPermission,
  subscribeToOneSignal,
  type OneSignalSnapshot
} from "../services/oneSignal";

type NotificationCenterProps = {
  onClose: () => void;
  visible: boolean;
};

type StatusTone = "neutral" | "success" | "warning" | "danger";

function StatusRow({
  detail,
  label,
  tone = "neutral"
}: {
  detail: string;
  label: string;
  tone?: StatusTone;
}) {
  return (
    <View style={styles.statusRow}>
      <View style={[styles.statusDot, styles[`statusDot_${tone}`]]} />
      <View style={styles.statusCopy}>
        <Text style={styles.statusLabel}>{label}</Text>
        <Text style={[styles.statusDetail, styles[`statusDetail_${tone}`]]}>{detail}</Text>
      </View>
    </View>
  );
}

function getPermissionCopy(snapshot: OneSignalSnapshot): {
  detail: string;
  tone: StatusTone;
} {
  if (!snapshot.isSupported || snapshot.permission === "unsupported") {
    return { detail: "Desteklenmiyor", tone: "danger" };
  }
  if (snapshot.permission === "denied") {
    return { detail: "Tarayıcıda engellendi", tone: "danger" };
  }
  if (snapshot.permission === "granted") {
    return { detail: "İzin verildi", tone: "success" };
  }
  return { detail: "Henüz sorulmadı", tone: "warning" };
}

function getActionLabel(snapshot: OneSignalSnapshot, busy: boolean): string {
  if (busy) return "Bağlanıyor…";
  if (snapshot.optedIn && snapshot.subscriptionId) return "Bildirimler Açık";
  if (snapshot.permission === "denied") return "Bildirim İzni Engelli";
  if (snapshot.isIos && !snapshot.isStandalone) return "Önce Ana Ekrana Ekleyin";
  return "Bildirimleri Aç";
}

export function NotificationCenter({ onClose, visible }: NotificationCenterProps) {
  const [snapshot, setSnapshot] = useState(getOneSignalSnapshot);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => subscribeToOneSignal(setSnapshot), []);

  useEffect(() => {
    if (!visible) return;

    setMessage(null);
    void initializeOneSignal().catch(() => {
      // Hata merkezi durum kartında kullanıcıya açıklanır.
    });

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose, visible]);

  useEffect(() => {
    if (snapshot.optedIn && snapshot.subscriptionId) {
      setMessage("Harika! Bu cihaz OneSignal'a bağlandı ve test bildirimi almaya hazır.");
    }
  }, [snapshot.optedIn, snapshot.subscriptionId]);

  const permissionCopy = useMemo(() => getPermissionCopy(snapshot), [snapshot]);
  const isSubscribed = snapshot.optedIn && Boolean(snapshot.subscriptionId);
  const needsIosInstall = snapshot.isIos && !snapshot.isStandalone;
  const actionDisabled = busy || isSubscribed || snapshot.permission === "denied" || !snapshot.isSupported;

  const handleEnable = async () => {
    if (actionDisabled || needsIosInstall) return;
    setBusy(true);
    setMessage(null);

    try {
      const nextSnapshot = await requestPushPermission();
      if (nextSnapshot.permission !== "granted") {
        setMessage("Bildirim izni verilmedi. Hazır olduğunuzda tekrar deneyebilirsiniz.");
      } else if (!nextSnapshot.subscriptionId) {
        setMessage("İzin verildi. Cihaz kaydı tamamlanırken bu ekranı birkaç saniye açık tutun.");
      }
    } catch (error) {
      const errorCode = error instanceof Error ? error.message : "";
      if (errorCode === "PERMISSION_BLOCKED") {
        setMessage("Bildirimler tarayıcı ayarlarında engelli. Site izinlerinden bildirimleri açın.");
      } else if (errorCode === "PUSH_UNSUPPORTED") {
        setMessage("Bu tarayıcı web bildirimlerini desteklemiyor.");
      } else {
        setMessage("Bağlantı kurulamadı. OneSignal web ayarlarını ve site adresini kontrol edin.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel="Bildirim merkezini kapat"
          accessibilityRole="button"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />

        <View accessibilityLabel="Bedri Usta bildirim merkezi" style={styles.sheet}>
          <View style={styles.accentLine} />
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topRow}>
              <View style={styles.brandMark}>
                <Text style={styles.brandMarkGlyph}>B</Text>
              </View>
              <Pressable
                accessibilityLabel="Kapat"
                accessibilityRole="button"
                onPress={onClose}
                style={({ hovered, pressed }: any) => [
                  styles.closeButton,
                  (hovered || pressed) && styles.closeButtonActive
                ]}
              >
                <Text style={styles.closeGlyph}>×</Text>
              </Pressable>
            </View>

            <Text style={styles.eyebrow}>BEDRİ USTA · MANNHEIM</Text>
            <Text style={styles.title}>Bildirim Merkezi</Text>
            <Text style={styles.intro}>
              Yeni kampanya ve Royal Club haberlerini kilit ekranınızda görmek için bu cihazda
              bildirimleri açın.
            </Text>

            <View style={styles.statusCard}>
              <Text style={styles.statusCardTitle}>CİHAZ KONTROLÜ</Text>
              <StatusRow
                detail={snapshot.isStandalone ? "Ana ekran uygulaması" : "Tarayıcıdan açık"}
                label="Uygulama"
                tone={snapshot.isStandalone ? "success" : "neutral"}
              />
              <StatusRow detail={permissionCopy.detail} label="Bildirim izni" tone={permissionCopy.tone} />
              <StatusRow
                detail={isSubscribed ? "OneSignal'a bağlı" : "Henüz bağlanmadı"}
                label="Cihaz kaydı"
                tone={isSubscribed ? "success" : "warning"}
              />
            </View>

            {needsIosInstall && (
              <View style={styles.guideCard}>
                <Text style={styles.guideKicker}>IPHONE / IPAD İÇİN GEREKLİ</Text>
                <Text style={styles.guideTitle}>Önce ana ekrana ekleyin</Text>
                <View style={styles.guideStep}>
                  <Text style={styles.guideStepNumber}>1</Text>
                  <Text style={styles.guideStepText}>Tarayıcıdaki Paylaş simgesine dokunun.</Text>
                </View>
                <View style={styles.guideStep}>
                  <Text style={styles.guideStepNumber}>2</Text>
                  <Text style={styles.guideStepText}>“Ana Ekrana Ekle” seçeneğini seçin.</Text>
                </View>
                <View style={styles.guideStep}>
                  <Text style={styles.guideStepNumber}>3</Text>
                  <Text style={styles.guideStepText}>Uygulamayı ana ekrandaki ikonundan açıp tekrar deneyin.</Text>
                </View>
              </View>
            )}

            {snapshot.permission === "denied" && (
              <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>Bildirim izni tarayıcıda engellenmiş</Text>
                <Text style={styles.warningText}>
                  Adres çubuğundaki site ayarlarından Bildirimler iznini açın, ardından sayfayı yenileyin.
                </Text>
              </View>
            )}

            {message && (
              <View style={[styles.messageCard, isSubscribed && styles.messageCardSuccess]}>
                <Text style={[styles.messageText, isSubscribed && styles.messageTextSuccess]}>{message}</Text>
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: actionDisabled || needsIosInstall }}
              disabled={actionDisabled || needsIosInstall}
              onPress={handleEnable}
              style={({ hovered, pressed }: any) => [
                styles.primaryButton,
                isSubscribed && styles.primaryButtonSuccess,
                (actionDisabled || needsIosInstall) && !isSubscribed && styles.primaryButtonDisabled,
                (hovered || pressed) && !actionDisabled && styles.primaryButtonActive
              ]}
            >
              <View style={styles.buttonSignal} />
              <Text style={styles.primaryButtonText}>{getActionLabel(snapshot, busy)}</Text>
              <Text style={styles.primaryButtonArrow}>{isSubscribed ? "✓" : "→"}</Text>
            </Pressable>

            <Text style={styles.privacyNote}>
              İzin yalnızca bu butona bastığınızda sorulur. İstediğiniz zaman cihaz ayarlarından
              kapatabilirsiniz.
            </Text>

            {snapshot.subscriptionId && (
              <Text selectable style={styles.deviceId}>
                Test cihazı · {snapshot.subscriptionId.slice(0, 8)}…
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const colors = {
  wine: "#530e0f",
  darkWine: "#240a09",
  gold: "#dfbf78",
  cream: "#fff8ee",
  paper: "#f6f0e7",
  ink: "#1a0d0a",
  muted: "#776963",
  green: "#277553"
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "max(18px, env(safe-area-inset-top))",
    paddingRight: "max(14px, env(safe-area-inset-right))",
    paddingBottom: "max(18px, env(safe-area-inset-bottom))",
    paddingLeft: "max(14px, env(safe-area-inset-left))",
    backgroundColor: "rgba(18, 4, 3, 0.78)",
    backdropFilter: "blur(12px)"
  } as any,
  sheet: {
    width: "100%",
    maxWidth: 510,
    maxHeight: "min(760px, calc(100vh - 36px))",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(223, 191, 120, 0.62)",
    backgroundColor: colors.cream,
    boxShadow: "0 28px 90px rgba(0, 0, 0, 0.52)"
  } as any,
  accentLine: {
    height: 4,
    backgroundColor: colors.gold
  },
  scrollContent: {
    padding: "clamp(20px, 5vw, 38px)",
    paddingBottom: "max(26px, env(safe-area-inset-bottom))"
  } as any,
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22
  },
  brandMark: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.wine,
    transform: [{ rotate: "45deg" }]
  },
  brandMarkGlyph: {
    color: colors.gold,
    fontFamily: "Karla, sans-serif",
    fontSize: 17,
    lineHeight: 20,
    fontWeight: "900",
    transform: [{ rotate: "-45deg" }]
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d9c8b9",
    backgroundColor: "#fffaf3"
  },
  closeButtonActive: {
    borderColor: colors.wine,
    backgroundColor: "#efe2d4"
  },
  closeGlyph: {
    color: colors.wine,
    fontFamily: "Karla, sans-serif",
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "400",
    marginTop: -2
  },
  eyebrow: {
    color: colors.wine,
    fontFamily: "Karla, sans-serif",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 2.4,
    fontWeight: "800"
  },
  title: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: "clamp(29px, 7vw, 42px)",
    lineHeight: "clamp(34px, 8vw, 47px)",
    letterSpacing: -1.3,
    fontWeight: "900",
    marginTop: 5
  } as any,
  intro: {
    color: "#5e4b43",
    fontFamily: "Heebo, sans-serif",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
    maxWidth: 420
  },
  statusCard: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ded0c4",
    backgroundColor: "#fffdf9",
    gap: 12
  },
  statusCardTitle: {
    color: colors.muted,
    fontFamily: "Karla, sans-serif",
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 1.8,
    fontWeight: "800",
    paddingBottom: 3
  },
  statusRow: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 11
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    flexShrink: 0
  },
  statusDot_neutral: { backgroundColor: "#9e8f88" },
  statusDot_success: { backgroundColor: colors.green },
  statusDot_warning: { backgroundColor: "#c58b2d" },
  statusDot_danger: { backgroundColor: "#b1292e" },
  statusCopy: {
    minWidth: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  statusLabel: {
    color: colors.ink,
    fontFamily: "Heebo, sans-serif",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700"
  },
  statusDetail: {
    flexShrink: 1,
    textAlign: "right",
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "800"
  },
  statusDetail_neutral: { color: colors.muted },
  statusDetail_success: { color: colors.green },
  statusDetail_warning: { color: "#9b6514" },
  statusDetail_danger: { color: "#a21e24" },
  guideCard: {
    marginTop: 14,
    padding: 17,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    backgroundColor: "#2e0c0b",
    gap: 10
  },
  guideKicker: {
    color: colors.gold,
    fontFamily: "Karla, sans-serif",
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 1.4,
    fontWeight: "800"
  },
  guideTitle: {
    color: colors.cream,
    fontFamily: "Heebo, sans-serif",
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "900",
    marginBottom: 2
  },
  guideStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10
  },
  guideStepNumber: {
    width: 22,
    height: 22,
    borderRadius: 999,
    textAlign: "center",
    color: colors.darkWine,
    backgroundColor: colors.gold,
    fontFamily: "Karla, sans-serif",
    fontSize: 11,
    lineHeight: 22,
    fontWeight: "900"
  },
  guideStepText: {
    minWidth: 0,
    flex: 1,
    color: "#f0dfcc",
    fontFamily: "Heebo, sans-serif",
    fontSize: 13,
    lineHeight: 19
  },
  warningCard: {
    marginTop: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0b6ae",
    backgroundColor: "#fff0eb"
  },
  warningTitle: {
    color: "#8d171d",
    fontFamily: "Heebo, sans-serif",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "900"
  },
  warningText: {
    color: "#6f3f39",
    fontFamily: "Heebo, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3
  },
  messageCard: {
    marginTop: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: "#d9c9bb",
    backgroundColor: colors.paper
  },
  messageCardSuccess: {
    borderColor: "#a8cdbb",
    backgroundColor: "#edf7f1"
  },
  messageText: {
    color: colors.muted,
    fontFamily: "Heebo, sans-serif",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600"
  },
  messageTextSuccess: { color: "#245f45" },
  primaryButton: {
    minHeight: 56,
    marginTop: 18,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.wine,
    borderWidth: 1,
    borderColor: colors.wine,
    boxShadow: "0 14px 32px rgba(83, 14, 15, 0.22)",
    transitionProperty: "transform, background-color, border-color",
    transitionDuration: "180ms"
  } as any,
  primaryButtonActive: {
    backgroundColor: "#6b1416",
    transform: [{ translateY: -1 }]
  },
  primaryButtonDisabled: {
    opacity: 0.56,
    boxShadow: "none"
  } as any,
  primaryButtonSuccess: {
    backgroundColor: colors.green,
    borderColor: colors.green
  },
  buttonSignal: {
    width: 10,
    height: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.gold
  },
  primaryButtonText: {
    minWidth: 0,
    flex: 1,
    color: "#ffffff",
    fontFamily: "Heebo, sans-serif",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
    fontWeight: "900"
  },
  primaryButtonArrow: {
    color: colors.gold,
    fontFamily: "Karla, sans-serif",
    fontSize: 19,
    lineHeight: 22,
    fontWeight: "900"
  },
  privacyNote: {
    color: colors.muted,
    fontFamily: "Heebo, sans-serif",
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 8
  },
  deviceId: {
    color: "#9c8d84",
    fontFamily: "Karla, monospace",
    fontSize: 9,
    lineHeight: 14,
    textAlign: "center",
    marginTop: 8
  }
});
