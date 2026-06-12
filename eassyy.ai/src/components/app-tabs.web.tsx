import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  black: "#050508",
  offBlack: "#0d0d14",
  panel: "#111118",
  border: "rgba(255,255,255,0.07)",
  borderBright: "rgba(255,255,255,0.18)",
  cyan: "#00f5d4",
  amber: "#f5a623",
  violet: "#b66dff",
  red: "#ff4d6d",
  green: "#25d366",
  text: "#f0f0f8",
  text2: "rgba(240,240,248,0.55)",
  text3: "rgba(240,240,248,0.28)",
};

const W = Dimensions.get("window").width;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PulseDot = ({ color = C.green }: { color?: string }) => {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[s.pulseDot, { backgroundColor: color, opacity: anim }]} />;
};

const TypingDots = () => {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  useEffect(() => {
    const bounce = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -4, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      );
    dots.forEach((d, i) => bounce(d, i * 150).start());
  }, []);
  return (
    <View style={s.typingRow}>
      {dots.map((d, i) => (
        <Animated.View key={i} style={[s.typingDot, { transform: [{ translateY: d }] }]} />
      ))}
    </View>
  );
};

const TickerBar = () => {
  const items = [
    ["EASSYY AI", "LIVE"],
    ["Real Estate Leads", "AUTO-QUALIFIED"],
    ["Café Orders", "INSTANT"],
    ["Response Time", "<3 SEC"],
    ["Human Staff Needed", "ZERO"],
    ["Leads Lost at Night", "NONE"],
    ["WhatsApp Native", "YES"],
  ];
  const anim = useRef(new Animated.Value(0)).current;
  const totalWidth = items.length * 2 * 160;
  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: -totalWidth / 2,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  const doubled = [...items, ...items];
  return (
    <View style={s.tickerWrap}>
      <Animated.View style={[s.tickerTrack, { transform: [{ translateX: anim }] }]}>
        {doubled.map(([label, val], i) => (
          <View key={i} style={s.tickerItem}>
            <Text style={s.tickerLabel}>{label}</Text>
            <Text style={s.tickerVal}> {val}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

// ─── WhatsApp Mock ─────────────────────────────────────────────────────────────
const WA_DATA = {
  realty: {
    avatarColor: C.green,
    name: "Eassyy AI — Nexus Realty",
    statusColor: "rgba(37,211,102,0.8)",
    msgs: [
      { from: "user", text: "Hi, is the 2BHK in Lodi Road still available?" },
      { from: "ai", text: "Yes! Lodi Heights Unit 12B is available — ₹1.85Cr, 1,150 sq ft, ready to move. Would you like photos, floor plan, or to book a viewing?" },
      { from: "user", text: "Book a viewing this Saturday morning please" },
      { from: "ai", text: "Done! Saturday 10:30 AM confirmed at Lodi Heights. Agent Priya has been notified. You'll get a reminder Friday evening. 🏠" },
    ],
  },
  cafe: {
    avatarColor: C.amber,
    name: "Eassyy AI — Ritual Café",
    statusColor: "rgba(245,166,35,0.85)",
    msgs: [
      { from: "user", text: "Hi, what cold coffees do you have?" },
      { from: "ai", text: "Today's cold menu: Cold Brew ₹280 · Iced Latte ₹260 · Nitro Espresso ₹320 · Dalgona Shake ₹290. All available with oat or almond milk. What'd you like? ☕" },
      { from: "user", text: "Iced latte with oat milk, table 7" },
      { from: "ai", text: "Order placed! Iced Latte · Oat Milk · Table 7 · ₹260. Ticket sent to kitchen. Ready in ~4 mins. ✅" },
    ],
  },
};

const WaMock = ({ tab }: { tab: "realty" | "cafe" }) => {
  const d = WA_DATA[tab];
  return (
    <View style={s.waCard}>
      <View style={s.waHeader}>
        <View style={[s.waAvatar, { backgroundColor: d.avatarColor }]}>
          <Text style={s.waAvatarText}>EA</Text>
        </View>
        <View>
          <Text style={s.waName}>{d.name}</Text>
          <Text style={[s.waStatus, { color: d.statusColor }]}>● Online — AI Active</Text>
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

// ─── Step Item ─────────────────────────────────────────────────────────────────
const Step = ({ num, title, desc, color }: { num: string; title: string; desc: string; color: string }) => (
  <View style={s.step}>
    <Text style={[s.stepNum, { color }]}>{num}</Text>
    <View style={{ flex: 1 }}>
      <Text style={s.stepTitle}>{title}</Text>
      <Text style={s.stepDesc}>{desc}</Text>
    </View>
  </View>
);

// ─── Stat Cell ─────────────────────────────────────────────────────────────────
const Stat = ({ num, label, desc, color }: { num: string; label: string; desc: string; color: string }) => (
  <View style={s.statCell}>
    <Text style={s.statLabel}>{label}</Text>
    <Text style={[s.statNum, { color }]}>{num}</Text>
    <Text style={s.statDesc}>{desc}</Text>
  </View>
);

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function LandingScreen() {
  const [tab, setTab] = useState<"realty" | "cafe">("realty");

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      {/* ── NAV ── */}
      <View style={s.nav}>
        <Text style={s.navLogo}>EASSYY<Text style={s.navLogoSub}>.AI</Text></Text>
        <Pressable style={s.navCta} onPress={() => {}}>
          <Text style={s.navCtaText}>Get Started →</Text>
        </Pressable>
      </View>

      {/* ── HERO ── */}
      <View style={s.hero}>
        <View style={s.heroEyebrow}>
          <View style={s.eyebrowLine} />
          <Text style={s.eyebrowText}>Eassyy AI — Plug-and-Play WhatsApp Automation</Text>
        </View>
        <Text style={s.heroTitle}>
          <Text style={s.heroTitleDim}>Your business,{"\n"}</Text>
          <Text>on autopilot.{"\n"}</Text>
          <Text style={s.heroTitleHL}>24 / 7.</Text>
        </Text>
        <Text style={s.heroSub}>
          AI-powered WhatsApp chat engines for Real Estate agencies and Cafés. Capture every lead, answer every question, book every slot — automatically.
        </Text>
        <View style={s.heroActions}>
          <Pressable style={s.btnPrimary}>
            <Text style={s.btnPrimaryText}>See How It Works</Text>
          </Pressable>
          <Pressable style={s.btnWa}>
            <Text style={s.btnWaText}>▲ WhatsApp Demo</Text>
          </Pressable>
        </View>
      </View>

      {/* ── TRUST BAR ── */}
      <View style={s.trustBar}>
        {[
          ["Runs inside", "your WhatsApp Business account"],
          ["Your own", "verified Meta number"],
          ["Replies in", "under 3 seconds"],
          ["100% brand ownership", "always"],
        ].map(([a, b], i) => (
          <View key={i} style={s.trustItem}>
            <View style={s.trustDot} />
            <Text style={s.trustText}>{a} <Text style={s.trustStrong}>{b}</Text></Text>
          </View>
        ))}
      </View>

      {/* ── TICKER ── */}
      <TickerBar />

      {/* ── PROBLEM ── */}
      <View style={[s.section, { backgroundColor: C.offBlack }]}>
        <Text style={[s.sLabel, { color: C.amber }]}>The Problem We Solve</Text>
        <Text style={s.sTitle}>Businesses lose money{"\n"}while they sleep.</Text>
        <Text style={s.sBody}>Every missed WhatsApp message at night or during a rush is a lost customer. Eassyy AI closes that gap permanently.</Text>

        <View style={s.probCard}>
          <View style={[s.probTop, { backgroundColor: C.cyan }]} />
          <Text style={[s.probTag, { color: C.cyan, borderColor: "rgba(0,245,212,0.4)" }]}>REAL ESTATE</Text>
          <Text style={s.probTitle}>Property leads go cold in hours</Text>
          <Text style={s.probDesc}>Buyers text your agency at 11pm asking about a flat. Nobody replies until morning. By then, they've booked a tour with a competitor.</Text>
          <View style={s.probPain}>
            <Text style={s.probPainText}>"Is this flat still available? I want to book a viewing this weekend." — sent at 11:47 PM. Read at 9:14 AM. Buyer already gone.</Text>
          </View>
        </View>

        <View style={[s.probCard, { marginTop: 2 }]}>
          <View style={[s.probTop, { backgroundColor: C.amber }]} />
          <Text style={[s.probTag, { color: C.amber, borderColor: "rgba(245,166,35,0.4)" }]}>CAFÉ / RESTAURANT</Text>
          <Text style={s.probTitle}>Staff can't handle peak rush orders</Text>
          <Text style={s.probDesc}>During the lunch rush, your staff is too slammed to take phone orders. Customers don't want to download another app. Revenue leaks every day.</Text>
          <View style={s.probPain}>
            <Text style={s.probPainText}>"Just let me text my order. I don't want to download your app." — the thought every customer has.</Text>
          </View>
        </View>
      </View>

      {/* ── HOW IT WORKS ── */}
      <View style={[s.section, { backgroundColor: C.black }]}>
        <Text style={[s.sLabel, { color: C.amber }]}>How It Works</Text>
        <Text style={s.sTitle}>Plug in. Turn on.{"\n"}Never miss again.</Text>

        {/* Tabs */}
        <View style={s.tabRow}>
          <Pressable
            style={[s.tabBtn, tab === "realty" && s.tabBtnActiveCyan]}
            onPress={() => setTab("realty")}
          >
            <Text style={[s.tabBtnText, tab === "realty" && { color: C.cyan }]}>Real Estate AI</Text>
          </Pressable>
          <Pressable
            style={[s.tabBtn, tab === "cafe" && s.tabBtnActiveAmber]}
            onPress={() => setTab("cafe")}
          >
            <Text style={[s.tabBtnText, tab === "cafe" && { color: C.amber }]}>Café AI</Text>
          </Pressable>
        </View>

        {tab === "realty" ? (
          <View style={s.stepsCard}>
            <Text style={s.stepsCardTitle}>Property Booking Flow</Text>
            <Step num="01" color={C.cyan} title="Buyer clicks WhatsApp button" desc="An interactive button lives on your listings page, Google profile, or social ads. One tap opens a WhatsApp conversation with your AI." />
            <Step num="02" color={C.cyan} title="AI reads your property database" desc="Instantly pulls flat availability, pricing, floor plans, and viewing schedules — answering buyer questions 24/7." />
            <Step num="03" color={C.cyan} title="Budget qualification — automated" desc="The AI converses naturally to qualify budget, preferred BHK, and locality before a human agent is involved." />
            <Step num="04" color={C.cyan} title="Viewing booked on autopilot" desc="Confirms the tour date, sends the address, adds it to your calendar, and notifies your agent." />
          </View>
        ) : (
          <View style={s.stepsCard}>
            <Text style={s.stepsCardTitle}>Café Order Flow</Text>
            <Step num="01" color={C.amber} title="Customer scans QR or taps button" desc="A QR code on every table or a chat button on Instagram opens WhatsApp. No app download. No login." />
            <Step num="02" color={C.amber} title="AI displays live menu" desc="Full menu with modifiers (extra shot, oat milk, no sugar), pricing, and today's specials — inside WhatsApp." />
            <Step num="03" color={C.amber} title="Order placed inside WhatsApp" desc="Customer selects items, customises, and confirms. AI registers the order with table number and instructions." />
            <Step num="04" color={C.amber} title="Ticket drops to kitchen display" desc="Order fires automatically to the chef's terminal. Staff focuses on making great coffee." />
          </View>
        )}

        <WaMock tab={tab} />
      </View>

      {/* ── OWNERSHIP ── */}
      <View style={[s.section, { backgroundColor: C.offBlack }]}>
        <Text style={[s.sLabel, { color: C.amber }]}>Brand Ownership — Our Promise</Text>
        <Text style={s.sTitle}>You stay in control.{"\n"}Always.</Text>
        <Text style={s.sBody}>The AI runs inside your client's own verified Facebook Business account — their brand, their number, their data.</Text>

        {[
          { icon: "◈", title: "Your WhatsApp Business Account", desc: "AI runs inside your client's own verified account. Their brand, their number, their conversation history." },
          { icon: "◎", title: "Your Meta Wallet Billing", desc: "Meta charges the client's wallet directly for messaging tokens. No middleman markup. Full transparency." },
          { icon: "◇", title: "Your Verified Business Number", desc: "Customers see the client's own business phone number — not a third-party number. Trust stays intact." },
        ].map((o, i) => (
          <View key={i} style={s.ownCard}>
            <Text style={s.ownIcon}>{o.icon}</Text>
            <Text style={s.ownTitle}>{o.title}</Text>
            <Text style={s.ownDesc}>{o.desc}</Text>
          </View>
        ))}
      </View>

      {/* ── PITCH SCRIPTS ── */}
      <View style={[s.section, { backgroundColor: C.black }]}>
        <Text style={[s.sLabel, { color: C.amber }]}>Ready-to-Use Pitch Scripts</Text>
        <Text style={s.sTitle}>Know exactly what{"\n"}to say. Every time.</Text>

        <View style={[s.pitchCard, { borderLeftColor: C.cyan }]}>
          <Text style={[s.pitchTag, { color: C.cyan, borderColor: "rgba(0,245,212,0.3)" }]}>REAL ESTATE PITCH</Text>
          <Text style={[s.pitchQuote, { borderLeftColor: C.cyan }]}>
            "I build AI automation software for real estate agencies. Instead of managing complex manual leads, we put an interactive WhatsApp button on their listings. When a buyer clicks it, our AI instantly pulls building records, answers pricing questions, and schedules the tour on autopilot — 24/7."
          </Text>
          <Text style={s.pitchResult}>→ Result: Zero leads lost to slow response. Tours booked while the agent sleeps.</Text>
        </View>

        <View style={[s.pitchCard, { marginTop: 2, borderLeftColor: C.amber }]}>
          <Text style={[s.pitchTag, { color: C.amber, borderColor: "rgba(245,166,35,0.3)" }]}>CAFÉ PITCH</Text>
          <Text style={[s.pitchQuote, { borderLeftColor: C.amber }]}>
            "I build automated WhatsApp assistants for busy cafés. Customers scan a QR code, the AI shows the live menu, lets them place custom orders inside WhatsApp, sends the ticket straight to the kitchen, and processes the bill automatically — no extra app, no extra staff."
          </Text>
          <Text style={s.pitchResult}>→ Result: Orders handled at peak rush with zero front-desk bottleneck.</Text>
        </View>
      </View>

      {/* ── STATS ── */}
      <View style={[s.section, { backgroundColor: C.offBlack }]}>
        <Text style={[s.sLabel, { color: C.amber }]}>Why It Works</Text>
        <Text style={s.sTitle}>Numbers that{"\n"}close deals.</Text>
        <View style={s.statsGrid}>
          <Stat num="<3s" label="Response Speed" desc="AI replies to every WhatsApp in under 3 seconds — day or night." color={C.cyan} />
          <Stat num="100%" label="Lead Qualification" desc="Every inbound lead is auto-qualified before a human agent gets involved." color={C.amber} />
          <Stat num="40h/wk" label="Staff Hours Saved" desc="Average front-desk hours recovered per location per week." color={C.green} />
          <Stat num="48 hrs" label="Setup Time" desc="From sign-up to fully live AI bot inside your client's WhatsApp." color={C.violet} />
        </View>
      </View>

      {/* ── CTA ── */}
      <View style={[s.section, { backgroundColor: C.black }]}>
        <View style={s.ctaBox}>
          <View style={s.ctaTopBar} />
          <Text style={[s.sLabel, { color: C.amber, textAlign: "center" }]}>Get Started Today</Text>
          <Text style={[s.sTitle, { textAlign: "center" }]}>Ready to automate{"\n"}your first client?</Text>
          <Text style={[s.sBody, { textAlign: "center", marginHorizontal: "auto" }]}>
            Set up a live WhatsApp AI demo for a real estate agency or café in 48 hours. No code required on their end.
          </Text>
          <View style={[s.heroActions, { justifyContent: "center", marginTop: 20 }]}>
            <Pressable style={s.btnPrimary}>
              <Text style={s.btnPrimaryText}>Book a Demo Call</Text>
            </Pressable>
            <Pressable style={s.btnWa}>
              <Text style={s.btnWaText}>▲ WhatsApp Us</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ── FOOTER ── */}
      <View style={s.footer}>
        <Text style={s.footerBrand}>EASSYY.AI</Text>
        <Text style={s.footerTagline}>Plug-and-play WhatsApp AI automation for Real Estate and Cafés. Built for Indian businesses. Deployed in 48 hours.</Text>
        <View style={s.footerDivider} />
        <View style={s.footerBottom}>
          <Text style={s.footerCopy}>© 2025 Eassyy AI — All Rights Reserved</Text>
          <View style={s.footerLive}>
            <PulseDot color={C.green} />
            <Text style={[s.footerCopy, { color: C.green }]}>All systems live</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll: { backgroundColor: C.black },
  container: { flexGrow: 1 },

  // Nav
  nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 52, paddingBottom: 14, backgroundColor: "rgba(5,5,8,0.95)", borderBottomWidth: 1, borderBottomColor: C.border },
  navLogo: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 16, fontWeight: "700", letterSpacing: 2, color: C.cyan },
  navLogoSub: { color: C.text3, fontWeight: "400" },
  navCta: { borderWidth: 1, borderColor: C.green, paddingHorizontal: 14, paddingVertical: 7 },
  navCtaText: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 10, letterSpacing: 1.5, color: C.green, textTransform: "uppercase" },

  // Hero
  hero: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 48, backgroundColor: C.black },
  heroEyebrow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  eyebrowLine: { width: 18, height: 1, backgroundColor: C.cyan },
  eyebrowText: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 9, letterSpacing: 3, color: C.cyan, textTransform: "uppercase" },
  heroTitle: { fontSize: 42, fontWeight: "700", lineHeight: 44, letterSpacing: -1, color: C.text },
  heroTitleDim: { color: C.text3 },
  heroTitleHL: { color: C.cyan },
  heroSub: { marginTop: 16, fontSize: 14, color: C.text2, lineHeight: 22 },
  heroActions: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 20 },
  btnPrimary: { paddingHorizontal: 22, paddingVertical: 12, backgroundColor: C.cyan },
  btnPrimaryText: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 11, fontWeight: "700", letterSpacing: 1.5, color: C.black, textTransform: "uppercase" },
  btnWa: { paddingHorizontal: 22, paddingVertical: 12, backgroundColor: "rgba(37,211,102,0.1)", borderWidth: 1, borderColor: "rgba(37,211,102,0.35)" },
  btnWaText: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 11, letterSpacing: 1.5, color: C.green, textTransform: "uppercase" },

  // Trust bar
  trustBar: { backgroundColor: C.panel, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border, paddingHorizontal: 20, paddingVertical: 14, gap: 10 },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  trustDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.cyan },
  trustText: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 10, color: C.text3, letterSpacing: 1, textTransform: "uppercase" },
  trustStrong: { color: C.text2 },

  // Ticker
  tickerWrap: { backgroundColor: "rgba(0,245,212,0.04)", borderTopWidth: 1, borderBottomWidth: 1, borderColor: "rgba(0,245,212,0.1)", paddingVertical: 9, overflow: "hidden" },
  tickerTrack: { flexDirection: "row", gap: 32 },
  tickerItem: { flexDirection: "row", alignItems: "center", flexShrink: 0 },
  tickerLabel: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 9, letterSpacing: 2, color: C.text3, textTransform: "uppercase" },
  tickerVal: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 9, letterSpacing: 2, color: C.cyan, textTransform: "uppercase" },

  // Section
  section: { paddingHorizontal: 20, paddingVertical: 52 },
  sLabel: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 },
  sTitle: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5, lineHeight: 32, color: C.text, marginBottom: 12 },
  sBody: { fontSize: 13, color: C.text2, lineHeight: 22 },

  // Problem
  probCard: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, padding: 20, marginTop: 20, overflow: "hidden" },
  probTop: { position: "absolute", top: 0, left: 0, right: 0, height: 2 },
  probTag: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-start", marginBottom: 12, marginTop: 4 },
  probTitle: { fontSize: 16, fontWeight: "700", color: C.text, marginBottom: 8 },
  probDesc: { fontSize: 13, color: C.text2, lineHeight: 20 },
  probPain: { marginTop: 14, padding: 12, backgroundColor: "rgba(255,77,109,0.05)", borderWidth: 1, borderColor: "rgba(255,77,109,0.15)" },
  probPainText: { fontSize: 12, color: "rgba(255,120,140,0.85)", fontStyle: "italic", lineHeight: 18 },

  // Tabs
  tabRow: { flexDirection: "row", gap: 2, marginTop: 24, marginBottom: 0 },
  tabBtn: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border },
  tabBtnText: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 10, letterSpacing: 1.5, color: C.text3, textTransform: "uppercase" },
  tabBtnActiveCyan: { backgroundColor: "rgba(0,245,212,0.08)", borderColor: "rgba(0,245,212,0.35)" },
  tabBtnActiveAmber: { backgroundColor: "rgba(245,166,35,0.08)", borderColor: "rgba(245,166,35,0.35)" },

  // Steps
  stepsCard: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, padding: 20, marginTop: 2 },
  stepsCardTitle: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 9, letterSpacing: 2, color: C.text3, textTransform: "uppercase", marginBottom: 20 },
  step: { flexDirection: "row", gap: 14, marginBottom: 20 },
  stepNum: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 11, minWidth: 22, marginTop: 2 },
  stepTitle: { fontSize: 13, fontWeight: "600", color: C.text, marginBottom: 3 },
  stepDesc: { fontSize: 12, color: C.text2, lineHeight: 18 },

  // WA Mock
  waCard: { backgroundColor: "#0d1117", borderWidth: 1, borderColor: C.border, marginTop: 2 },
  waHeader: { backgroundColor: "#1f2c34", padding: 12, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  waAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  waAvatarText: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 11, fontWeight: "700", color: "#000" },
  waName: { fontSize: 13, fontWeight: "600", color: C.text },
  waStatus: { fontSize: 10, color: "rgba(37,211,102,0.8)" },
  waBody: { padding: 12, gap: 8 },
  waMsgWrapLeft: { alignSelf: "flex-start" },
  waMsgWrapRight: { alignSelf: "flex-end", alignItems: "flex-end" },
  waMsgLabel: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 },
  waMsgLabelAi: { color: C.green },
  waMsgLabelUser: { color: C.text3 },
  waMsg: { maxWidth: W * 0.72, padding: 10, borderRadius: 2 },
  waMsgOut: { backgroundColor: "rgba(0,245,212,0.12)", borderWidth: 1, borderColor: "rgba(0,245,212,0.2)" },
  waMsgAi: { backgroundColor: "rgba(37,211,102,0.08)", borderWidth: 1, borderColor: "rgba(37,211,102,0.15)" },
  waMsgText: { fontSize: 12, color: C.text, lineHeight: 18 },
  typingRow: { flexDirection: "row", gap: 4, alignItems: "center", backgroundColor: "#1f2c34", padding: 10, alignSelf: "flex-start" },
  typingDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.green },

  // Ownership
  ownCard: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, borderBottomWidth: 2, borderBottomColor: "transparent", padding: 20, marginTop: 12 },
  ownIcon: { fontSize: 20, color: C.cyan, marginBottom: 10 },
  ownTitle: { fontSize: 14, fontWeight: "600", color: C.text, marginBottom: 6 },
  ownDesc: { fontSize: 12, color: C.text2, lineHeight: 18 },

  // Pitch
  pitchCard: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, borderLeftWidth: 3, padding: 20, marginTop: 20 },
  pitchTag: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-start", marginBottom: 14 },
  pitchQuote: { fontSize: 13, color: C.text2, lineHeight: 22, fontStyle: "italic", borderLeftWidth: 2, paddingLeft: 14, marginBottom: 14 },
  pitchResult: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 11, color: C.text3, letterSpacing: 0.5 },

  // Stats
  statsGrid: { flexDirection: "row", flexWrap: "wrap", borderWidth: 1, borderColor: C.border, marginTop: 24 },
  statCell: { width: "50%", padding: 20, borderRightWidth: 1, borderBottomWidth: 1, borderColor: C.border },
  statLabel: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 8, letterSpacing: 2, color: C.text3, textTransform: "uppercase", marginBottom: 6 },
  statNum: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 28, fontWeight: "700", letterSpacing: -0.5, lineHeight: 30, marginBottom: 6 },
  statDesc: { fontSize: 11, color: C.text2, lineHeight: 16 },

  // CTA
  ctaBox: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, padding: 32, alignItems: "center", overflow: "hidden" },
  ctaTopBar: { position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: C.cyan },

  // Footer
  footer: { backgroundColor: C.black, borderTopWidth: 1, borderTopColor: C.border, padding: 28 },
  footerBrand: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 16, fontWeight: "700", letterSpacing: 2, color: C.cyan, marginBottom: 8 },
  footerTagline: { fontSize: 12, color: C.text3, lineHeight: 18, maxWidth: 260 },
  footerDivider: { height: 1, backgroundColor: C.border, marginVertical: 20 },
  footerBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerCopy: { fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", fontSize: 9, letterSpacing: 1.5, color: C.text3, textTransform: "uppercase" },
  footerLive: { flexDirection: "row", alignItems: "center", gap: 6 },
  pulseDot: { width: 5, height: 5, borderRadius: 3 },
});