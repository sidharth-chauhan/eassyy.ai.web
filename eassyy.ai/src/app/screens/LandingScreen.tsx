import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  white: "#ffffff",
  bg: "#f7f9f7",
  panel: "#ffffff",
  border: "rgba(0,0,0,0.08)",
  green: "#1a6b3c",
  greenLight: "#eaf3de",
  greenMid: "#c0dd97",
  greenWa: "#25d366",
  text: "#0d1a0f",
  text2: "rgba(13,26,15,0.55)",
  text3: "rgba(13,26,15,0.35)",
};

const W = Dimensions.get("window").width;

// ─── Pulse Dot ────────────────────────────────────────────────────────────────
const PulseDot = ({ color = C.greenWa }: { color?: string }) => {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.2, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[s.pulseDot, { backgroundColor: color, opacity: anim }]} />;
};

// ─── Typing Dots ──────────────────────────────────────────────────────────────
const TypingDots = () => {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  useEffect(() => {
    dots.forEach((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(d, { toValue: -4, duration: 280, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0, duration: 280, useNativeDriver: true }),
          Animated.delay(600),
        ])
      ).start()
    );
  }, []);
  return (
    <View style={s.typingRow}>
      {dots.map((d, i) => (
        <Animated.View key={i} style={[s.typingDot, { transform: [{ translateY: d }] }]} />
      ))}
    </View>
  );
};

// ─── WhatsApp Mock ────────────────────────────────────────────────────────────
const WA_DATA = {
  realty: {
    name: "Eassyy AI — Nexus Realty",
    msgs: [
      { from: "user", text: "Hi, is the 2BHK in Lodi Road still available?" },
      { from: "ai", text: "Yes! Lodi Heights Unit 12B — ₹1.85Cr, 1,150 sq ft, ready to move. Want photos or to book a viewing?" },
      { from: "user", text: "Book a viewing this Saturday morning please" },
      { from: "ai", text: "Done! Saturday 10:30 AM confirmed. Agent Priya notified. Reminder Friday evening. 🏠" },
    ],
  },
  cafe: {
    name: "Eassyy AI — Ritual Café",
    msgs: [
      { from: "user", text: "Hi, what cold coffees do you have?" },
      { from: "ai", text: "Cold Brew ₹280 · Iced Latte ₹260 · Nitro Espresso ₹320 · Dalgona Shake ₹290. Oat or almond milk available ☕" },
      { from: "user", text: "Iced latte with oat milk, table 7" },
      { from: "ai", text: "Order placed! Iced Latte · Oat Milk · Table 7 · ₹260. Ready in ~4 mins. ✅" },
    ],
  },
};

const WaMock = ({ tab }: { tab: "realty" | "cafe" }) => {
  const d = WA_DATA[tab];
  return (
    <View style={s.waCard}>
      <View style={s.waHeader}>
        <View style={s.waAvatar}>
          <Text style={s.waAvatarText}>EA</Text>
        </View>
        <View>
          <Text style={s.waName}>{d.name}</Text>
          <Text style={s.waStatus}>● Online — AI Active</Text>
        </View>
      </View>
      <View style={s.waBody}>
        {d.msgs.map((m, i) => (
          <View key={i} style={m.from === "user" ? s.waMsgWrapRight : s.waMsgWrapLeft}>
            <Text style={[s.waMsgLabel, m.from === "user" ? s.waMsgLabelUser : s.waMsgLabelAi]}>
              {m.from === "user" ? "You" : "Eassyy AI"}
            </Text>
            <View style={[s.waMsg, m.from === "user" ? s.waMsgOut : s.waMsgAi]}>
              <Text style={s.waMsgText}>{m.text}</Text>
            </View>
          </View>
        ))}
        <View style={s.waMsgWrapLeft}>
          <TypingDots />
        </View>
      </View>
    </View>
  );
};

// ─── Step Item ────────────────────────────────────────────────────────────────
const Step = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
  <View style={s.step}>
    <Text style={s.stepNum}>{num}</Text>
    <View style={{ flex: 1 }}>
      <Text style={s.stepTitle}>{title}</Text>
      <Text style={s.stepDesc}>{desc}</Text>
    </View>
  </View>
);

// ─── Stat Cell ────────────────────────────────────────────────────────────────
const Stat = ({ num, label }: { num: string; label: string }) => (
  <View style={s.statCell}>
    <Text style={s.statNum}>{num}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function LandingScreen() {
  const [tab, setTab] = useState<"realty" | "cafe">("realty");

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>

      {/* ── NAV ── */}
      <View style={s.nav}>
        <Text style={s.navLogo}>
          EASSYY<Text style={s.navLogoDot}>.AI</Text>
        </Text>
        <Pressable style={s.navCta} onPress={() => {}}>
          <Text style={s.navCtaText}>Get Started →</Text>
        </Pressable>
      </View>

      {/* ── HERO ── */}
      <View style={s.hero}>
        <Text style={s.eyebrow}>Plug-and-play WhatsApp Automation</Text>
        <Text style={s.heroTitle}>
          Your business,{"\n"}
          <Text style={s.heroTitleDim}>on autopilot. </Text>
          <Text style={s.heroTitleHL}>24 / 7.</Text>
        </Text>
        <Text style={s.heroSub}>
          AI-powered WhatsApp chat for Real Estate agencies and Cafés. Capture every lead, book every slot — automatically.
        </Text>

        {/* Trust pills */}
        <View style={s.pillRow}>
          {["Inside your WhatsApp Business", "Replies in <3 seconds", "Your brand, your number"].map((t, i) => (
            <View key={i} style={s.pill}>
              <Text style={s.pillCheck}>✓</Text>
              <Text style={s.pillText}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={s.heroActions}>
          <Pressable style={s.btnPrimary} onPress={() => {}}>
            <Text style={s.btnPrimaryText}>See How It Works</Text>
          </Pressable>
          <Pressable style={s.btnWa} onPress={() => {}}>
            <Text style={s.btnWaText}>WhatsApp Demo</Text>
          </Pressable>
        </View>
      </View>

      <View style={s.divider} />

      {/* ── HOW IT WORKS ── */}
      <View style={s.section}>
        <Text style={s.sLabel}>How It Works</Text>
        <Text style={s.sTitle}>Plug in. Never miss again.</Text>

        {/* Tabs */}
        <View style={s.tabRow}>
          <Pressable
            style={[s.tabBtn, tab === "realty" && s.tabBtnActive]}
            onPress={() => setTab("realty")}
          >
            <Text style={[s.tabBtnText, tab === "realty" && s.tabBtnTextActive]}>Real Estate AI</Text>
          </Pressable>
          <Pressable
            style={[s.tabBtn, tab === "cafe" && s.tabBtnActive]}
            onPress={() => setTab("cafe")}
          >
            <Text style={[s.tabBtnText, tab === "cafe" && s.tabBtnTextActive]}>Café AI</Text>
          </Pressable>
        </View>

        {tab === "realty" ? (
          <View style={s.stepsCard}>
            {[
              ["01", "Buyer clicks WhatsApp button", "One tap on your listing opens a chat with your AI."],
              ["02", "AI answers instantly", "Availability, pricing, floor plans — 24/7, no agent needed."],
              ["03", "Lead qualified automatically", "Budget, BHK, locality — all captured before a human steps in."],
              ["04", "Viewing booked on autopilot", "Date confirmed, address sent, agent notified."],
            ].map(([num, title, desc]) => (
              <Step key={num} num={num} title={title} desc={desc} />
            ))}
          </View>
        ) : (
          <View style={s.stepsCard}>
            {[
              ["01", "Customer scans QR code", "Opens WhatsApp instantly — no app download, no login."],
              ["02", "AI shows live menu", "Full menu with modifiers and specials inside WhatsApp."],
              ["03", "Order placed in WhatsApp", "Customer selects, customises, confirms — done."],
              ["04", "Ticket fires to kitchen", "Staff focuses on making great food, not taking orders."],
            ].map(([num, title, desc]) => (
              <Step key={num} num={num} title={title} desc={desc} />
            ))}
          </View>
        )}

        <WaMock tab={tab} />
      </View>

      <View style={s.divider} />

      {/* ── STATS ── */}
      <View style={s.section}>
        <Text style={s.sLabel}>Why It Works</Text>
        <Text style={s.sTitle}>Numbers that close deals.</Text>
        <View style={s.statsGrid}>
          <Stat num="<3s" label="Response speed" />
          <Stat num="100%" label="Leads qualified" />
          <Stat num="40h" label="Staff hours saved / wk" />
          <Stat num="48h" label="Setup time" />
        </View>
      </View>

      <View style={s.divider} />

      {/* ── CTA ── */}
      <View style={s.ctaSection}>
        <View style={s.ctaBox}>
          <Text style={s.sLabel}>Get Started Today</Text>
          <Text style={[s.sTitle, { textAlign: "center" }]}>
            Ready to automate{"\n"}your first client?
          </Text>
          <Text style={[s.heroSub, { textAlign: "center", marginBottom: 20 }]}>
            Live WhatsApp AI for a real estate agency or café in 48 hours. No code required on their end.
          </Text>
          <View style={[s.heroActions, { justifyContent: "center" }]}>
            <Pressable style={s.btnPrimary} onPress={() => {}}>
              <Text style={s.btnPrimaryText}>Book a Demo Call</Text>
            </Pressable>
            <Pressable style={s.btnWa} onPress={() => {}}>
              <Text style={s.btnWaText}>WhatsApp Us</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ── FOOTER ── */}
      <View style={s.footer}>
        <View style={s.footerTop}>
          <Text style={s.footerBrand}>
            EASSYY<Text style={{ color: C.green }}>.AI</Text>
          </Text>
          <View style={s.footerLive}>
            <PulseDot />
            <Text style={s.footerLiveText}>All systems live</Text>
          </View>
        </View>
        <Text style={s.footerCopy}>© 2025 Eassyy AI — All Rights Reserved</Text>
      </View>

    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll: { backgroundColor: C.white },
  container: { flexGrow: 1 },

  // Nav
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 14,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  navLogo: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: C.text,
  },
  navLogoDot: { color: C.green, fontWeight: "400" },
  navCta: {
    backgroundColor: C.green,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navCtaText: { fontSize: 13, fontWeight: "600", color: C.white },

  // Hero
  hero: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 40,
    backgroundColor: C.white,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: C.green,
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: "700",
    lineHeight: 42,
    letterSpacing: -0.5,
    color: C.text,
    marginBottom: 14,
  },
  heroTitleDim: { color: C.text2 },
  heroTitleHL: { color: C.green },
  heroSub: {
    fontSize: 14,
    color: C.text2,
    lineHeight: 22,
    marginBottom: 20,
  },
  pillRow: { gap: 8, marginBottom: 24 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.greenLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  pillCheck: { fontSize: 12, color: C.green, fontWeight: "700" },
  pillText: { fontSize: 12, color: C.green },
  heroActions: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  btnPrimary: {
    backgroundColor: "#1a2e1e",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 8,
  },
  btnPrimaryText: { fontSize: 14, fontWeight: "600", color: C.white },
  btnWa: {
    borderWidth: 1.5,
    borderColor: C.green,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 8,
  },
  btnWaText: { fontSize: 14, fontWeight: "600", color: C.green },

  // Divider
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: 20 },

  // Section
  section: { paddingHorizontal: 20, paddingVertical: 40 },
  sLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: C.green,
    marginBottom: 6,
  },
  sTitle: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: C.text,
    marginBottom: 20,
  },

  // Tabs
  tabRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tabBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
  },
  tabBtnActive: {
    backgroundColor: C.greenLight,
    borderColor: C.green,
  },
  tabBtnText: { fontSize: 13, color: C.text2 },
  tabBtnTextActive: { color: C.green, fontWeight: "600" },

  // Steps
  stepsCard: {
    backgroundColor: C.bg,
    borderRadius: 12,
    padding: 16,
    gap: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  step: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  stepNum: {
    fontSize: 11,
    fontWeight: "700",
    color: C.green,
    minWidth: 22,
    paddingTop: 2,
  },
  stepTitle: { fontSize: 14, fontWeight: "600", color: C.text, marginBottom: 2 },
  stepDesc: { fontSize: 13, color: C.text2, lineHeight: 19 },

  // WhatsApp Mock
  waCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    backgroundColor: "#e5ddd5",
  },
  waHeader: {
    backgroundColor: "#075e54",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  waAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.greenMid,
    alignItems: "center",
    justifyContent: "center",
  },
  waAvatarText: { fontSize: 12, fontWeight: "700", color: "#1a2e1e" },
  waName: { fontSize: 13, fontWeight: "600", color: "#ffffff" },
  waStatus: { fontSize: 11, color: "rgba(255,255,255,0.75)" },
  waBody: { padding: 12, gap: 10 },
  waMsgWrapLeft: { alignSelf: "flex-start" },
  waMsgWrapRight: { alignSelf: "flex-end", alignItems: "flex-end" },
  waMsgLabel: {
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  waMsgLabelAi: { color: "#075e54" },
  waMsgLabelUser: { color: C.text3 },
  waMsg: {
    maxWidth: W * 0.72,
    padding: 10,
    borderRadius: 8,
  },
  waMsgAi: { backgroundColor: "#ffffff" },
  waMsgOut: { backgroundColor: "#dcf8c6" },
  waMsgText: { fontSize: 13, color: "#111", lineHeight: 19 },
  typingRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  typingDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#aaa" },

  // Stats
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  statCell: {
    width: (W - 52) / 2,
    backgroundColor: C.greenLight,
    borderRadius: 12,
    padding: 18,
  },
  statNum: {
    fontSize: 28,
    fontWeight: "700",
    color: C.green,
    marginBottom: 4,
  },
  statLabel: { fontSize: 12, color: C.text2 },

  // CTA
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  ctaBox: {
    backgroundColor: C.greenLight,
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: C.greenMid,
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: C.white,
  },
  footerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  footerBrand: { fontSize: 15, fontWeight: "700", letterSpacing: 1.5, color: C.text },
  footerLive: { flexDirection: "row", alignItems: "center", gap: 6 },
  footerLiveText: { fontSize: 12, color: C.greenWa },
  footerCopy: { fontSize: 11, color: C.text3 },
  pulseDot: { width: 6, height: 6, borderRadius: 3 },
});