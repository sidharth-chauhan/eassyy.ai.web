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

const W = Dimensions.get("window").width;

// ─── Theme ────────────────────────────────────────────────────────────────────
const light = {
  bg: "#ffffff",
  bg2: "#f7f9f7",
  bg3: "#f0f4f0",
  panel: "#ffffff",
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
};

const dark = {
  bg: "#0d1117",
  bg2: "#161b22",
  bg3: "#21262d",
  panel: "#161b22",
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
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const DATA = {
  realty: {
    name: "Eassyy AI — Nexus Realty",
    steps: [
      ["01", "Buyer clicks WhatsApp button", "One tap on your listing opens a chat with your AI."],
      ["02", "AI answers instantly", "Availability, pricing, floor plans — 24/7, no agent needed."],
      ["03", "Lead qualified automatically", "Budget, BHK, locality — all captured before a human steps in."],
      ["04", "Viewing booked on autopilot", "Date confirmed, address sent, agent notified."],
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
      ["01", "Customer scans QR code", "Opens WhatsApp instantly — no app download, no login."],
      ["02", "AI shows live menu", "Full menu with modifiers and specials inside WhatsApp."],
      ["03", "Order placed in WhatsApp", "Customer selects, customises, confirms — done."],
      ["04", "Ticket fires to kitchen", "Staff focuses on making great food, not taking orders."],
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
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.2, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, opacity: anim }} />;
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
          Animated.timing(d, { toValue: -5, duration: 280, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0, duration: 280, useNativeDriver: true }),
          Animated.delay(600),
        ])
      ).start()
    );
  }, []);
  return (
    <View style={{ flexDirection: "row", gap: 4, alignItems: "center", backgroundColor: "#fff", padding: 10, borderRadius: 10, alignSelf: "flex-start" }}>
      {dots.map((d, i) => (
        <Animated.View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#aaa", transform: [{ translateY: d }] }} />
      ))}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function LandingScreen() {
  const [tab, setTab] = useState<"realty" | "cafe">("realty");
  const [isDark, setIsDark] = useState(false);
  const C = isDark ? dark : light;

  const d = DATA[tab];

  return (
    <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ flexGrow: 1 }}>

      {/* ── NAV ── */}
      <View style={[nav.wrap, { backgroundColor: C.bg, borderBottomColor: C.border }]}>
        <Text style={[nav.logo, { color: C.text }]}>
          EASSYY<Text style={{ color: C.green, fontWeight: "400" }}>.AI</Text>
        </Text>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Pressable
            style={[nav.toggleBtn, { backgroundColor: C.bg3, borderColor: C.border }]}
            onPress={() => setIsDark(!isDark)}
          >
            <Text style={{ fontSize: 13, color: C.text2, fontWeight: "600" }}>
              {isDark ? "☀️  Light" : "🌙  Dark"}
            </Text>
          </Pressable>
          <Pressable style={[nav.cta, { backgroundColor: C.green }]}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#fff" }}>Get Started →</Text>
          </Pressable>
        </View>
      </View>

      {/* ── HERO ── */}
      <View style={[hero.wrap, { backgroundColor: C.bg }]}>
        <Text style={[hero.eyebrow, { color: C.green }]}>Plug-and-play WhatsApp Automation</Text>
        <Text style={[hero.title, { color: C.text }]}>
          Your business,{"\n"}
          <Text style={{ color: C.text2 }}>on autopilot. </Text>
          <Text style={{ color: C.green }}>24/7.</Text>
        </Text>
        <Text style={[hero.sub, { color: C.text2 }]}>
          AI-powered WhatsApp chat for Real Estate agencies and Cafés. Capture every lead, book every slot — automatically.
        </Text>

        <View style={hero.pillRow}>
          {["Inside your WhatsApp Business", "Replies in <3 seconds", "Your brand, your number"].map((t, i) => (
            <View key={i} style={[hero.pill, { backgroundColor: C.greenLight }]}>
              <Text style={{ fontSize: 13, color: C.green, fontWeight: "700" }}>✓ </Text>
              <Text style={{ fontSize: 13, color: C.green, fontWeight: "600" }}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={hero.btns}>
          <Pressable style={[hero.btnPrimary, { backgroundColor: C.btnDark }]}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>See How It Works</Text>
          </Pressable>
          <Pressable style={[hero.btnOutline, { borderColor: C.green }]}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: C.green }}>WhatsApp Demo</Text>
          </Pressable>
        </View>
      </View>

      <View style={[{ height: 1, backgroundColor: C.border, marginHorizontal: 24 }]} />

      {/* ── HOW IT WORKS ── */}
      <View style={section.wrap}>
        <Text style={[section.label, { color: C.green }]}>How It Works</Text>
        <Text style={[section.title, { color: C.text }]}>Plug in. Never miss again.</Text>

        {/* Tabs */}
        <View style={{ flexDirection: "row", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {(["realty", "cafe"] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[
                tabStyle.btn,
                { borderColor: tab === t ? C.green : C.border, backgroundColor: tab === t ? C.greenLight : C.bg3 },
              ]}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: tab === t ? C.green : C.text2 }}>
                {t === "realty" ? "Real Estate AI" : "Café AI"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Steps */}
        <View style={[hiw.stepsCard, { backgroundColor: C.bg2, borderColor: C.border }]}>
          {d.steps.map(([num, title, desc]) => (
            <View key={num} style={hiw.step}>
              <Text style={[hiw.stepNum, { color: C.green }]}>{num}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[hiw.stepTitle, { color: C.text }]}>{title}</Text>
                <Text style={[hiw.stepDesc, { color: C.text2 }]}>{desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* WhatsApp Mock */}
        <View style={[wa.card, { borderColor: C.border }]}>
          <View style={[wa.header, { backgroundColor: C.waHdr }]}>
            <View style={[wa.avatar, { backgroundColor: C.greenMid }]}>
              <Text style={{ fontSize: 12, fontWeight: "800", color: "#1a2e1e" }}>EA</Text>
            </View>
            <View>
              <Text style={wa.name}>{d.name}</Text>
              <Text style={wa.status}>● Online — AI Active</Text>
            </View>
          </View>
          <View style={[wa.body, { backgroundColor: C.waBg }]}>
            {d.msgs.map((m, i) => (
              <View key={i} style={m.from === "user" ? wa.wrapRight : wa.wrapLeft}>
                <Text style={[wa.label, m.from === "user" ? wa.labelUser : wa.labelAi]}>
                  {m.from === "user" ? "You" : "Eassyy AI"}
                </Text>
                <View style={[wa.bubble, m.from === "user" ? wa.bubbleUser : wa.bubbleAi]}>
                  <Text style={wa.bubbleText}>{m.text}</Text>
                </View>
              </View>
            ))}
            <View style={wa.wrapLeft}>
              <TypingDots />
            </View>
          </View>
        </View>
      </View>

      <View style={[{ height: 1, backgroundColor: C.border, marginHorizontal: 24 }]} />

      {/* ── STATS ── */}
      <View style={section.wrap}>
        <Text style={[section.label, { color: C.green }]}>Why It Works</Text>
        <Text style={[section.title, { color: C.text }]}>Numbers that close deals.</Text>
        <View style={stats.grid}>
          {[
            ["<3s", "Response speed"],
            ["100%", "Leads qualified"],
            ["40h", "Staff hours saved / wk"],
            ["48h", "Setup time"],
          ].map(([num, label]) => (
            <View key={num} style={[stats.cell, { backgroundColor: C.greenLight }]}>
              <Text style={[stats.num, { color: C.green }]}>{num}</Text>
              <Text style={[stats.label, { color: C.text2 }]}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[{ height: 1, backgroundColor: C.border, marginHorizontal: 24 }]} />

      {/* ── CTA ── */}
      <View style={cta.wrap}>
        <View style={[cta.box, { backgroundColor: C.greenLight, borderColor: C.greenMid }]}>
          <Text style={[section.label, { color: C.green }]}>Get Started Today</Text>
          <Text style={[section.title, { color: C.text, textAlign: "center", marginBottom: 12 }]}>
            Ready to automate{"\n"}your first client?
          </Text>
          <Text style={[hero.sub, { color: C.text2, textAlign: "center", marginBottom: 20 }]}>
            Live WhatsApp AI for a real estate agency or café in 48 hours. No code required on their end.
          </Text>
          <View style={[hero.btns, { justifyContent: "center" }]}>
            <Pressable style={[hero.btnPrimary, { backgroundColor: C.btnDark }]}>
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>Book a Demo Call</Text>
            </Pressable>
            <Pressable style={[hero.btnOutline, { borderColor: C.green }]}>
              <Text style={{ fontSize: 15, fontWeight: "700", color: C.green }}>WhatsApp Us</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ── FOOTER ── */}
      <View style={[foot.wrap, { borderTopColor: C.border, backgroundColor: C.bg }]}>
        <View style={foot.top}>
          <Text style={[foot.brand, { color: C.text }]}>
            EASSYY<Text style={{ color: C.green }}>.AI</Text>
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <PulseDot color={C.greenWa} />
            <Text style={{ fontSize: 13, color: C.greenWa, fontWeight: "600" }}>All systems live</Text>
          </View>
        </View>
        <Text style={[foot.copy, { color: C.text3 }]}>© 2025 Eassyy AI — All Rights Reserved</Text>
      </View>

    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const nav = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  logo: { fontSize: 18, fontWeight: "800", letterSpacing: 2 },
  toggleBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cta: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

const hero = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 40, alignItems: "center" },
  eyebrow: { fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: "700", marginBottom: 14, textAlign: "center" },
  title: { fontSize: 44, fontWeight: "800", lineHeight: 48, letterSpacing: -1.5, marginBottom: 14, textAlign: "center" },
  sub: { fontSize: 16, lineHeight: 24, marginBottom: 24, textAlign: "center", maxWidth: 500 },
  pillRow: { gap: 10, marginBottom: 28, alignItems: "center" },
  pill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, alignSelf: "flex-start" },
  btns: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center" },
  btnPrimary: { paddingHorizontal: 26, paddingVertical: 14, borderRadius: 10 },
  btnOutline: { borderWidth: 2, paddingHorizontal: 26, paddingVertical: 14, borderRadius: 10 },
});

const section = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingVertical: 48 },
  label: { fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: "700", marginBottom: 8, textAlign: "center" },
  title: { fontSize: 32, fontWeight: "800", letterSpacing: -0.8, marginBottom: 24, textAlign: "center" },
});

const tabStyle = StyleSheet.create({
  btn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 1 },
});

const hiw = StyleSheet.create({
  stepsCard: { borderRadius: 16, borderWidth: 1, padding: 20, gap: 18, marginBottom: 16 },
  step: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  stepNum: { fontSize: 11, fontWeight: "800", letterSpacing: 1, minWidth: 24, paddingTop: 2 },
  stepTitle: { fontSize: 14, fontWeight: "700", marginBottom: 3 },
  stepDesc: { fontSize: 13, lineHeight: 20 },
});

const wa = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  header: { padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 14, fontWeight: "700", color: "#fff" },
  status: { fontSize: 11, color: "rgba(255,255,255,0.75)" },
  body: { padding: 14, gap: 10 },
  wrapLeft: { alignSelf: "flex-start", maxWidth: W * 0.78 },
  wrapRight: { alignSelf: "flex-end", maxWidth: W * 0.78, alignItems: "flex-end" },
  label: { fontSize: 9, letterSpacing: 1, textTransform: "uppercase", fontWeight: "700", marginBottom: 3 },
  labelAi: { color: "#075e54" },
  labelUser: { color: "rgba(13,26,15,0.35)" },
  bubble: { padding: 10, borderRadius: 10 },
  bubbleAi: { backgroundColor: "#ffffff" },
  bubbleUser: { backgroundColor: "#dcf8c6" },
  bubbleText: { fontSize: 13, color: "#111", lineHeight: 20 },
});

const stats = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  cell: { width: (W - 54) / 2, borderRadius: 14, padding: 22 },
  num: { fontSize: 34, fontWeight: "800", letterSpacing: -1, marginBottom: 6 },
  label: { fontSize: 13, fontWeight: "500" },
});

const cta = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingVertical: 40 },
  box: { borderRadius: 20, borderWidth: 1, padding: 36, alignItems: "center" },
});

const foot = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingVertical: 28, borderTopWidth: 1 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  brand: { fontSize: 16, fontWeight: "800", letterSpacing: 2 },
  copy: { fontSize: 12 },
});