import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";

const { width: W } = Dimensions.get("window");

// ─── Theme ────────────────────────────────────────────────────────────────────
const light = {
  bg: "#ffffff",
  bg2: "#f7f9f7",
  bg3: "#f0f4f0",
  border: "rgba(0,0,0,0.08)",
  green: "#1a6b3c",
  greenLight: "#eaf3de",
  greenMid: "#c0dd97",
  greenWa: "#25d366",
  text: "#0d1a0f",
  text2: "rgba(13,26,15,0.55)",
  text3: "rgba(13,26,15,0.35)",
  waHdr: "#075e54",
  waBg: "#e5ddd5",
  btnDark: "#0d1a0f",
  btnDarkText: "#ffffff",
};

const dark = {
  bg: "#0d1117",
  bg2: "#161b22",
  bg3: "#21262d",
  border: "rgba(255,255,255,0.1)",
  green: "#4caf7d",
  greenLight: "#1a2e1e",
  greenMid: "#2d5a3d",
  greenWa: "#25d366",
  text: "#e6edf3",
  text2: "rgba(230,237,243,0.6)",
  text3: "rgba(230,237,243,0.35)",
  waHdr: "#054d44",
  waBg: "#1a1a2e",
  btnDark: "#4caf7d",
  btnDarkText: "#0d1117",
};

type Theme = typeof light;

// ─── Data ─────────────────────────────────────────────────────────────────────
type TabKey = "realty" | "cafe";

interface Step {
  num: string;
  title: string;
  desc: string;
}

interface Msg {
  from: "user" | "ai";
  text: string;
}

interface TabData {
  name: string;
  steps: Step[];
  msgs: Msg[];
}

const DATA: Record<TabKey, TabData> = {
  realty: {
    name: "Eassyy AI — Nexus Realty",
    steps: [
      { num: "01", title: "Buyer clicks WhatsApp button", desc: "One tap on your listing opens a chat with your AI." },
      { num: "02", title: "AI answers instantly", desc: "Availability, pricing, floor plans — 24/7, no agent needed." },
      { num: "03", title: "Lead qualified automatically", desc: "Budget, BHK, locality — all captured before a human steps in." },
      { num: "04", title: "Viewing booked on autopilot", desc: "Date confirmed, address sent, agent notified." },
    ],
    msgs: [
      { from: "user", text: "Hi, is the 2BHK in Lodi Road still available?" },
      { from: "ai", text: "Yes! Lodi Heights Unit 12B — ₹1.85Cr, 1,150 sq ft, ready to move. Want photos or to book a viewing?" },
      { from: "user", text: "Book a viewing this Saturday morning please" },
      { from: "ai", text: "Done! Saturday 10:30 AM confirmed. Agent Priya notified. Reminder Friday evening." },
    ],
  },
  cafe: {
    name: "Eassyy AI — Ritual Café",
    steps: [
      { num: "01", title: "Customer scans QR code", desc: "Opens WhatsApp instantly — no app download, no login." },
      { num: "02", title: "AI shows live menu", desc: "Full menu with modifiers and specials inside WhatsApp." },
      { num: "03", title: "Order placed in WhatsApp", desc: "Customer selects, customises, confirms — done." },
      { num: "04", title: "Ticket fires to kitchen", desc: "Staff focuses on making great food, not taking orders." },
    ],
    msgs: [
      { from: "user", text: "Hi, what cold coffees do you have?" },
      { from: "ai", text: "Cold Brew ₹280 · Iced Latte ₹260 · Nitro Espresso ₹320 · Dalgona Shake ₹290. Oat or almond milk available ☕" },
      { from: "user", text: "Iced latte with oat milk, table 7" },
      { from: "ai", text: "Order placed! Iced Latte · Oat Milk · Table 7 · ₹260. Ready in ~4 mins. ✅" },
    ],
  },
};

// ─── Pulse Dot ────────────────────────────────────────────────────────────────
const PulseDot = ({ color }: { color: string }) => {
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.2, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  return (
    <Animated.View
      style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, opacity: anim }}
    />
  );
};

// ─── Typing Dots ──────────────────────────────────────────────────────────────
const TypingDots = () => {
  const d0 = useRef(new Animated.Value(0)).current;
  const d1 = useRef(new Animated.Value(0)).current;
  const d2 = useRef(new Animated.Value(0)).current;
  const dots = [d0, d1, d2];

  useEffect(() => {
    const animations = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(d, { toValue: -5, duration: 280, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0, duration: 280, useNativeDriver: true }),
          Animated.delay(600),
        ])
      )
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={styles.typingWrap}>
      {dots.map((d, i) => (
        <Animated.View
          key={i}
          style={[styles.typingDot, { transform: [{ translateY: d }] }]}
        />
      ))}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function LandingScreen() {
  const [tab, setTab] = useState<TabKey>("realty");
  const [isDark, setIsDark] = useState(false);
  const C: Theme = isDark ? dark : light;
  const d = DATA[tab];

  // Bubble widths capped to screen
  const bubbleMaxW = W - 48 - 80;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={C.bg}
      />

      <ScrollView
        style={{ backgroundColor: C.bg }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── NAV ── */}
        <View style={[styles.navWrap, { backgroundColor: C.bg, borderBottomColor: C.border }]}>
          <Text style={[styles.navLogo, { color: C.text }]}>
            EASSYY<Text style={{ color: C.green, fontWeight: "400" }}>.AI</Text>
          </Text>
          <View style={styles.navRight}>
            <Pressable
              style={({ pressed }) => [
                styles.toggleBtn,
                { backgroundColor: C.bg3, borderColor: C.border, opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => setIsDark(!isDark)}
            >
              <Text style={{ fontSize: 12, color: C.text2, fontWeight: "600" }}>
                {isDark ? "☀️  Light" : "🌙  Dark"}
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.navCta,
                { backgroundColor: C.green, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}>Get Started →</Text>
            </Pressable>
          </View>
        </View>

        {/* ── HERO ── */}
        <View style={[styles.heroWrap, { backgroundColor: C.bg }]}>
          <Text style={[styles.eyebrow, { color: C.green }]}>
            Plug-and-play WhatsApp Automation
          </Text>
          <Text style={[styles.heroTitle, { color: C.text }]}>
            Your business,{"\n"}
            <Text style={{ color: C.text2 }}>on autopilot. </Text>
            <Text style={{ color: C.green }}>24/7.</Text>
          </Text>
          <Text style={[styles.heroSub, { color: C.text2 }]}>
            AI-powered WhatsApp chat for Real Estate agencies and Cafés. Capture every lead, book
            every slot — automatically.
          </Text>

          <View style={styles.pillRow}>
            {["Inside your WhatsApp Business", "Replies in <3 seconds", "Your brand, your number"].map(
              (t, i) => (
                <View key={i} style={[styles.pill, { backgroundColor: C.greenLight }]}>
                  <Text style={{ fontSize: 12, color: C.green, fontWeight: "700" }}>✓ </Text>
                  <Text style={{ fontSize: 12, color: C.green, fontWeight: "600" }}>{t}</Text>
                </View>
              )
            )}
          </View>

          <View style={styles.heroBtns}>
            <Pressable
              style={({ pressed }) => [
                styles.btnPrimary,
                { backgroundColor: C.btnDark, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: C.btnDarkText }}>
                See How It Works
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.btnOutline,
                { borderColor: C.green, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: C.green }}>
                WhatsApp Demo
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ── DIVIDER ── */}
        <View style={[styles.divider, { backgroundColor: C.border }]} />

        {/* ── HOW IT WORKS ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.green }]}>How It Works</Text>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Plug in. Never miss again.</Text>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {(["realty", "cafe"] as TabKey[]).map((t) => (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                style={[
                  styles.tabBtn,
                  {
                    borderColor: tab === t ? C.green : C.border,
                    backgroundColor: tab === t ? C.greenLight : C.bg3,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: tab === t ? C.green : C.text2,
                  }}
                >
                  {t === "realty" ? "Real Estate AI" : "Café AI"}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Steps */}
          <View style={[styles.stepsCard, { backgroundColor: C.bg2, borderColor: C.border }]}>
            {d.steps.map((s) => (
              <View key={s.num} style={styles.step}>
                <Text style={[styles.stepNum, { color: C.green }]}>{s.num}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stepTitle, { color: C.text }]}>{s.title}</Text>
                  <Text style={[styles.stepDesc, { color: C.text2 }]}>{s.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* WhatsApp Mock */}
          <View style={[styles.waCard, { borderColor: C.border }]}>
            {/* Header */}
            <View style={[styles.waHeader, { backgroundColor: C.waHdr }]}>
              <View style={[styles.waAvatar, { backgroundColor: C.greenMid }]}>
                <Text style={{ fontSize: 11, fontWeight: "800", color: "#1a2e1e" }}>EA</Text>
              </View>
              <View>
                <Text style={styles.waName}>{d.name}</Text>
                <Text style={styles.waOnline}>● Online — AI Active</Text>
              </View>
            </View>

            {/* Body */}
            <View style={[styles.waBody, { backgroundColor: C.waBg }]}>
              {d.msgs.map((m, i) => (
                <View
                  key={i}
                  style={m.from === "user" ? styles.msgRight : styles.msgLeft}
                >
                  <Text
                    style={[
                      styles.msgLabel,
                      m.from === "user"
                        ? { color: "rgba(13,26,15,0.35)" }
                        : { color: "#075e54" },
                    ]}
                  >
                    {m.from === "user" ? "You" : "Eassyy AI"}
                  </Text>
                  <View
                    style={[
                      styles.bubble,
                      { maxWidth: bubbleMaxW },
                      m.from === "user" ? styles.bubbleUser : styles.bubbleAi,
                    ]}
                  >
                    <Text style={styles.bubbleText}>{m.text}</Text>
                  </View>
                </View>
              ))}
              <TypingDots />
            </View>
          </View>
        </View>

        {/* ── DIVIDER ── */}
        <View style={[styles.divider, { backgroundColor: C.border }]} />

        {/* ── STATS ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.green }]}>Why It Works</Text>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Numbers that close deals.</Text>
          <View style={styles.statsGrid}>
            {[
              ["<3s", "Response speed"],
              ["100%", "Leads qualified"],
              ["40h", "Staff hours saved / wk"],
              ["48h", "Setup time"],
            ].map(([num, label]) => (
              <View key={num} style={[styles.statCell, { backgroundColor: C.greenLight }]}>
                <Text style={[styles.statNum, { color: C.green }]}>{num}</Text>
                <Text style={[styles.statLabel, { color: C.text2 }]}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── DIVIDER ── */}
        <View style={[styles.divider, { backgroundColor: C.border }]} />

        {/* ── CTA ── */}
        <View style={styles.section}>
          <View
            style={[
              styles.ctaBox,
              { backgroundColor: C.greenLight, borderColor: C.greenMid },
            ]}
          >
            <Text style={[styles.sectionLabel, { color: C.green }]}>Get Started Today</Text>
            <Text
              style={[
                styles.sectionTitle,
                { color: C.text, textAlign: "center", marginBottom: 10 },
              ]}
            >
              Ready to automate{"\n"}your first client?
            </Text>
            <Text
              style={[
                styles.heroSub,
                { color: C.text2, textAlign: "center", marginBottom: 18 },
              ]}
            >
              Live WhatsApp AI for a real estate agency or café in 48 hours. No code required on
              their end.
            </Text>
            <View style={[styles.heroBtns, { justifyContent: "center" }]}>
              <Pressable
                style={({ pressed }) => [
                  styles.btnPrimary,
                  { backgroundColor: C.btnDark, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={{ fontSize: 14, fontWeight: "700", color: C.btnDarkText }}>
                  Book a Demo Call
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.btnOutline,
                  { borderColor: C.green, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={{ fontSize: 14, fontWeight: "700", color: C.green }}>
                  WhatsApp Us
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ── FOOTER ── */}
        <View style={[styles.footer, { borderTopColor: C.border, backgroundColor: C.bg }]}>
          <View style={styles.footerTop}>
            <Text style={[styles.footerBrand, { color: C.text }]}>
              EASSYY<Text style={{ color: C.green }}>.AI</Text>
            </Text>
            <View style={styles.footerLive}>
              <PulseDot color={C.greenWa} />
              <Text style={{ fontSize: 12, color: C.greenWa, fontWeight: "600", marginLeft: 6 }}>
                All systems live
              </Text>
            </View>
          </View>
          <Text style={[styles.footerCopy, { color: C.text3 }]}>
            © 2025 Eassyy AI — All Rights Reserved
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Nav
  navWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 16 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  navLogo: { fontSize: 17, fontWeight: "800", letterSpacing: 2 },
  navRight: { flexDirection: "row", gap: 8, alignItems: "center" },
  toggleBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  navCta: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  // Hero
  heroWrap: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 36,
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  heroTitle: {
    fontSize: W < 380 ? 34 : 40,
    fontWeight: "800",
    lineHeight: W < 380 ? 38 : 44,
    letterSpacing: -1.5,
    marginBottom: 12,
    textAlign: "center",
  },
  heroSub: {
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 20,
    textAlign: "center",
    maxWidth: 480,
  },
  pillRow: { gap: 8, marginBottom: 24, alignItems: "center" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
  },
  heroBtns: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  btnPrimary: {
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 10,
  },
  btnOutline: {
    borderWidth: 2,
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 10,
  },

  // Divider
  divider: { height: 1, marginHorizontal: 20 },

  // Section
  section: { paddingHorizontal: 20, paddingVertical: 40 },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 20,
    textAlign: "center",
  },

  // Tabs
  tabRow: { flexDirection: "row", gap: 8, justifyContent: "center", marginBottom: 16 },
  tabBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
  },

  // Steps
  stepsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 16,
    marginBottom: 14,
  },
  step: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  stepNum: { fontSize: 10, fontWeight: "800", letterSpacing: 1, minWidth: 22, paddingTop: 2 },
  stepTitle: { fontSize: 13, fontWeight: "700", marginBottom: 2 },
  stepDesc: { fontSize: 12, lineHeight: 18 },

  // WhatsApp
  waCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  waHeader: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  waAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  waName: { fontSize: 13, fontWeight: "700", color: "#fff" },
  waOnline: { fontSize: 10, color: "rgba(255,255,255,0.75)" },
  waBody: { padding: 12, gap: 8 },
  msgLeft: { alignSelf: "flex-start" },
  msgRight: { alignSelf: "flex-end", alignItems: "flex-end" },
  msgLabel: {
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 3,
  },
  bubble: { padding: 9, borderRadius: 10 },
  bubbleAi: { backgroundColor: "#ffffff" },
  bubbleUser: { backgroundColor: "#dcf8c6" },
  bubbleText: { fontSize: 13, color: "#111", lineHeight: 19 },
  typingWrap: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#aaa" },

  // Stats
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCell: {
    width: (W - 52) / 2,
    borderRadius: 14,
    padding: 20,
  },
  statNum: { fontSize: 30, fontWeight: "800", letterSpacing: -1, marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: "500" },

  // CTA
  ctaBox: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
  },

  // Footer
  footer: { paddingHorizontal: 20, paddingVertical: 24, borderTopWidth: 1 },
  footerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  footerBrand: { fontSize: 15, fontWeight: "800", letterSpacing: 2 },
  footerLive: { flexDirection: "row", alignItems: "center" },
  footerCopy: { fontSize: 11 },
});