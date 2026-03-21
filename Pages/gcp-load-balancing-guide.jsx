import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0e1a",
  surface: "#111827",
  surfaceLight: "#1a2234",
  border: "#1e293b",
  borderActive: "#38bdf8",
  premium: "#f59e0b",
  premiumBg: "rgba(245,158,11,0.08)",
  premiumBorder: "rgba(245,158,11,0.25)",
  standard: "#6366f1",
  standardBg: "rgba(99,102,241,0.08)",
  standardBorder: "rgba(99,102,241,0.25)",
  accent: "#38bdf8",
  accentBg: "rgba(56,189,248,0.08)",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  success: "#34d399",
  external: "#f472b6",
  internal: "#818cf8",
  global: "#fbbf24",
  regional: "#a78bfa",
  layer7: "#2dd4bf",
  layer4: "#fb923c",
};

const FONTS = {
  display: "'JetBrains Mono', 'Fira Code', monospace",
  body: "'IBM Plex Sans', 'Segoe UI', sans-serif",
};

const LOAD_BALANCERS = [
  {
    id: "gxalb",
    name: "Global External Application LB",
    shortName: "Global Ext. App LB",
    layer: 7,
    scope: "global",
    facing: "external",
    tier: "premium",
    protocols: ["HTTP", "HTTPS", "HTTP/2", "gRPC"],
    features: ["URL routing", "Header-based routing", "Traffic splitting", "Cloud CDN", "Cloud Armor", "IAP", "Canary deploys"],
    useCase: "Primary choice for global web apps. Routes users to nearest healthy backend across regions via anycast IP.",
    icon: "🌍",
  },
  {
    id: "rxalb",
    name: "Regional External Application LB",
    shortName: "Regional Ext. App LB",
    layer: 7,
    scope: "regional",
    facing: "external",
    tier: "both",
    protocols: ["HTTP", "HTTPS", "HTTP/2", "gRPC"],
    features: ["URL routing", "Header-based routing", "Traffic splitting", "Cloud Armor"],
    useCase: "L7 features in a single region. Works with Standard Tier for cost savings.",
    icon: "📍",
  },
  {
    id: "gxpnlb",
    name: "Global External Proxy Network LB",
    shortName: "Global Ext. Proxy NLB",
    layer: 4,
    scope: "global",
    facing: "external",
    tier: "premium",
    protocols: ["TCP", "SSL"],
    features: ["SSL offloading", "TCP proxy", "Global anycast", "Multi-region backends"],
    useCase: "Non-HTTP global traffic (gaming, IoT, custom protocols). Terminates TCP/SSL at Google's edge.",
    icon: "🔌",
  },
  {
    id: "rxpnlb",
    name: "Regional External Passthrough Network LB",
    shortName: "Regional Ext. Passthrough NLB",
    layer: 4,
    scope: "regional",
    facing: "external",
    tier: "both",
    protocols: ["TCP", "UDP"],
    features: ["Passthrough (preserves client IP)", "DSR capable", "UDP support", "Maglev backed"],
    useCase: "UDP workloads, or when you need original client IP without proxy protocol. Powered by Maglev.",
    icon: "⚡",
  },
  {
    id: "rialb",
    name: "Regional Internal Application LB",
    shortName: "Regional Int. App LB",
    layer: 7,
    scope: "regional",
    facing: "internal",
    tier: "n/a",
    protocols: ["HTTP", "HTTPS", "HTTP/2", "gRPC"],
    features: ["URL routing", "Service-to-service", "gRPC native", "Traffic splitting"],
    useCase: "Microservice communication within a VPC. The go-to for internal L7 routing.",
    icon: "🔗",
  },
  {
    id: "ripnlb",
    name: "Regional Internal Passthrough Network LB",
    shortName: "Regional Int. Passthrough NLB",
    layer: 4,
    scope: "regional",
    facing: "internal",
    tier: "n/a",
    protocols: ["TCP", "UDP"],
    features: ["Passthrough", "Next-hop routing", "HA for NVAs", "Protocol agnostic"],
    useCase: "Internal TCP/UDP, custom routing next-hop, HA for network virtual appliances.",
    icon: "🛡️",
  },
  {
    id: "cialb",
    name: "Cross-Region Internal Application LB",
    shortName: "Cross-Region Int. App LB",
    layer: 7,
    scope: "global",
    facing: "internal",
    tier: "premium",
    protocols: ["HTTP", "HTTPS", "HTTP/2", "gRPC"],
    features: ["Multi-region internal routing", "Global service mesh", "URL routing", "Traffic splitting"],
    useCase: "Multi-region internal service mesh. When microservices span regions and need global L7 routing.",
    icon: "🌐",
  },
];

const TABS = [
  { id: "overview", label: "Overview", icon: "◉" },
  { id: "tiers", label: "Network Tiers", icon: "◈" },
  { id: "decision", label: "Decision Tree", icon: "◇" },
  { id: "explorer", label: "LB Explorer", icon: "◆" },
  { id: "compare", label: "Compare", icon: "⊞" },
];

const Tag = ({ children, color, bg, border }) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "11px",
      fontFamily: FONTS.display,
      fontWeight: 600,
      letterSpacing: "0.5px",
      color: color,
      backgroundColor: bg,
      border: `1px solid ${border}`,
      textTransform: "uppercase",
    }}
  >
    {children}
  </span>
);

const tierTag = (tier) => {
  if (tier === "premium") return <Tag color={COLORS.premium} bg={COLORS.premiumBg} border={COLORS.premiumBorder}>Premium</Tag>;
  if (tier === "standard") return <Tag color={COLORS.standard} bg={COLORS.standardBg} border={COLORS.standardBorder}>Standard</Tag>;
  if (tier === "both") return <><Tag color={COLORS.premium} bg={COLORS.premiumBg} border={COLORS.premiumBorder}>Premium</Tag>{" "}<Tag color={COLORS.standard} bg={COLORS.standardBg} border={COLORS.standardBorder}>Standard</Tag></>;
  return <Tag color={COLORS.textDim} bg="rgba(100,116,139,0.1)" border="rgba(100,116,139,0.2)">N/A (Internal)</Tag>;
};

// Overview Tab
const OverviewTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
    <div style={{ padding: "24px", background: `linear-gradient(135deg, ${COLORS.surface}, ${COLORS.surfaceLight})`, borderRadius: "12px", border: `1px solid ${COLORS.border}` }}>
      <h3 style={{ margin: "0 0 12px", fontFamily: FONTS.display, color: COLORS.accent, fontSize: "14px", letterSpacing: "1px" }}>THREE AXES OF CLASSIFICATION</h3>
      <p style={{ margin: "0 0 20px", color: COLORS.textMuted, fontSize: "14px", lineHeight: 1.6 }}>
        Every GCP load balancer is defined by three properties. Understanding these axes is the key to navigating the entire system.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {[
          { title: "Traffic Type", items: ["Layer 7 — HTTP(S), gRPC", "Layer 4 — TCP, UDP, SSL"], color: COLORS.layer7, desc: "Determines routing intelligence" },
          { title: "Scope", items: ["Global — Anycast, multi-region", "Regional — Single region"], color: COLORS.global, desc: "Determines geographic reach" },
          { title: "Facing", items: ["External — Internet clients", "Internal — VPC-only (RFC 1918)"], color: COLORS.external, desc: "Determines who can reach it" },
        ].map((axis) => (
          <div key={axis.title} style={{ padding: "16px", borderRadius: "8px", background: COLORS.bg, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontFamily: FONTS.display, color: axis.color, fontSize: "12px", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px" }}>{axis.title}</div>
            <div style={{ fontSize: "11px", color: COLORS.textDim, marginBottom: "10px" }}>{axis.desc}</div>
            {axis.items.map((item) => (
              <div key={item} style={{ fontSize: "13px", color: COLORS.text, marginBottom: "4px", paddingLeft: "10px", borderLeft: `2px solid ${axis.color}30` }}>{item}</div>
            ))}
          </div>
        ))}
      </div>
    </div>

    <div style={{ padding: "24px", background: COLORS.surface, borderRadius: "12px", border: `1px solid ${COLORS.border}` }}>
      <h3 style={{ margin: "0 0 16px", fontFamily: FONTS.display, color: COLORS.accent, fontSize: "14px", letterSpacing: "1px" }}>ALL 7 LOAD BALANCERS AT A GLANCE</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
              {["Load Balancer", "Layer", "Scope", "Facing", "Tier"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontFamily: FONTS.display, color: COLORS.textDim, fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LOAD_BALANCERS.map((lb) => (
              <tr key={lb.id} style={{ borderBottom: `1px solid ${COLORS.border}15` }}>
                <td style={{ padding: "10px 12px", color: COLORS.text, fontWeight: 500 }}>{lb.icon} {lb.shortName}</td>
                <td style={{ padding: "10px 12px" }}>
                  <Tag color={lb.layer === 7 ? COLORS.layer7 : COLORS.layer4} bg={lb.layer === 7 ? "rgba(45,212,191,0.1)" : "rgba(251,146,60,0.1)"} border={lb.layer === 7 ? "rgba(45,212,191,0.2)" : "rgba(251,146,60,0.2)"}>
                    L{lb.layer}
                  </Tag>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <Tag color={lb.scope === "global" ? COLORS.global : COLORS.regional} bg={lb.scope === "global" ? "rgba(251,191,36,0.1)" : "rgba(167,139,250,0.1)"} border={lb.scope === "global" ? "rgba(251,191,36,0.2)" : "rgba(167,139,250,0.2)"}>
                    {lb.scope}
                  </Tag>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <Tag color={lb.facing === "external" ? COLORS.external : COLORS.internal} bg={lb.facing === "external" ? "rgba(244,114,182,0.1)" : "rgba(129,140,248,0.1)"} border={lb.facing === "external" ? "rgba(244,114,182,0.2)" : "rgba(129,140,248,0.2)"}>
                    {lb.facing}
                  </Tag>
                </td>
                <td style={{ padding: "10px 12px" }}>{tierTag(lb.tier)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div style={{ padding: "20px", background: COLORS.premiumBg, borderRadius: "12px", border: `1px solid ${COLORS.premiumBorder}` }}>
      <div style={{ fontFamily: FONTS.display, color: COLORS.premium, fontSize: "12px", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px" }}>💡 KEY INSIGHT</div>
      <p style={{ margin: 0, color: COLORS.text, fontSize: "13px", lineHeight: 1.7 }}>
        Network Tier is <strong>not</strong> just a speed dial — it constrains your architecture. Premium Tier unlocks global anycast and multi-region backends. Standard Tier locks you to regional scope. Internal traffic is unaffected by tiers since it never leaves Google's network.
      </p>
    </div>
  </div>
);

// Tiers Tab
const TiersTab = () => {
  const [hoveredTier, setHoveredTier] = useState(null);
  const comparisons = [
    { aspect: "Traffic Path", premium: "User → Nearest Google PoP → Google backbone → Your VMs", standard: "User → Public internet → Regional Google entry → Your VMs" },
    { aspect: "Entry Points", premium: "100+ global PoPs (anycast)", standard: "Regional ingress only" },
    { aspect: "Load Balancers", premium: "All types (global + regional)", standard: "Regional only" },
    { aspect: "Anycast IP", premium: "✓ Single IP, global reach", standard: "✗ Regional IP only" },
    { aspect: "Multi-Region Backends", premium: "✓ Automatic geo-routing", standard: "✗ Single region" },
    { aspect: "Latency", premium: "Lower & more consistent", standard: "Variable, ISP-dependent" },
    { aspect: "Cost", premium: "Higher egress rates", standard: "~$0.01-0.02/GB cheaper" },
    { aspect: "SLA", premium: "99.99% for global LBs", standard: "99.9% for regional LBs" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {[
          {
            tier: "premium",
            title: "Premium Tier",
            color: COLORS.premium,
            bg: COLORS.premiumBg,
            border: COLORS.premiumBorder,
            tagline: "Google's backbone, global reach",
            points: [
              "Traffic enters at the nearest of 100+ edge PoPs",
              "Travels on Google's private fiber network",
              "Enables global load balancers with anycast IPs",
              "Lower latency, higher reliability, stronger SLA",
              "Required for any multi-region architecture",
            ],
          },
          {
            tier: "standard",
            title: "Standard Tier",
            color: COLORS.standard,
            bg: COLORS.standardBg,
            border: COLORS.standardBorder,
            tagline: "Public internet, regional scope",
            points: [
              "Traffic traverses public internet to your region",
              "Enters Google's network at regional boundary",
              "Only regional load balancers available",
              "No anycast — each region gets its own IP",
              "Cheaper egress, suitable for single-region apps",
            ],
          },
        ].map((t) => (
          <div
            key={t.tier}
            onMouseEnter={() => setHoveredTier(t.tier)}
            onMouseLeave={() => setHoveredTier(null)}
            style={{
              padding: "24px",
              borderRadius: "12px",
              background: t.bg,
              border: `1px solid ${hoveredTier === t.tier ? t.color : t.border}`,
              transition: "all 0.3s ease",
              transform: hoveredTier === t.tier ? "translateY(-2px)" : "none",
            }}
          >
            <div style={{ fontFamily: FONTS.display, color: t.color, fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>{t.title}</div>
            <div style={{ fontSize: "12px", color: COLORS.textDim, marginBottom: "16px", fontStyle: "italic" }}>{t.tagline}</div>
            {t.points.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", fontSize: "13px", color: COLORS.text, lineHeight: 1.5 }}>
                <span style={{ color: t.color, flexShrink: 0 }}>▸</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ padding: "24px", background: COLORS.surface, borderRadius: "12px", border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ margin: "0 0 16px", fontFamily: FONTS.display, color: COLORS.accent, fontSize: "14px", letterSpacing: "1px" }}>SIDE-BY-SIDE COMPARISON</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                <th style={{ textAlign: "left", padding: "8px 12px", fontFamily: FONTS.display, color: COLORS.textDim, fontSize: "10px", letterSpacing: "1px" }}>ASPECT</th>
                <th style={{ textAlign: "left", padding: "8px 12px", fontFamily: FONTS.display, color: COLORS.premium, fontSize: "10px", letterSpacing: "1px" }}>PREMIUM</th>
                <th style={{ textAlign: "left", padding: "8px 12px", fontFamily: FONTS.display, color: COLORS.standard, fontSize: "10px", letterSpacing: "1px" }}>STANDARD</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((c, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}15` }}>
                  <td style={{ padding: "10px 12px", color: COLORS.textMuted, fontWeight: 600, fontSize: "11px", fontFamily: FONTS.display }}>{c.aspect}</td>
                  <td style={{ padding: "10px 12px", color: COLORS.text }}>{c.premium}</td>
                  <td style={{ padding: "10px 12px", color: COLORS.text }}>{c.standard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ padding: "20px", background: COLORS.surface, borderRadius: "12px", border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ margin: "0 0 12px", fontFamily: FONTS.display, color: COLORS.accent, fontSize: "13px", letterSpacing: "1px" }}>TRAFFIC PATH VISUALIZATION</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { label: "Premium Tier", color: COLORS.premium, path: ["User", "Nearest PoP", "Google Backbone", "Target Region", "Your VMs"] },
            { label: "Standard Tier", color: COLORS.standard, path: ["User", "ISP Hops", "Public Internet", "Regional Entry", "Your VMs"] },
          ].map((t) => (
            <div key={t.label}>
              <div style={{ fontFamily: FONTS.display, color: t.color, fontSize: "11px", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px" }}>{t.label}</div>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                {t.path.map((step, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: "4px", background: `${t.color}15`, border: `1px solid ${t.color}30`, color: t.color, fontSize: "11px", fontFamily: FONTS.display, fontWeight: 500 }}>
                      {step}
                    </span>
                    {i < t.path.length - 1 && <span style={{ color: COLORS.textDim }}>→</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Decision Tree Tab
const DecisionTree = () => {
  const [answers, setAnswers] = useState({});
  const questions = [
    { id: "facing", question: "Where do your clients come from?", options: [{ label: "Internet (External)", value: "external", icon: "🌐" }, { label: "Within VPC (Internal)", value: "internal", icon: "🏠" }] },
    { id: "layer", question: "What traffic type?", options: [{ label: "HTTP/HTTPS/gRPC (Layer 7)", value: 7, icon: "📄" }, { label: "TCP/UDP (Layer 4)", value: 4, icon: "⚡" }], show: () => true },
    { id: "scope", question: "Do you need multi-region backends?", options: [{ label: "Yes, global reach", value: "global", icon: "🌍" }, { label: "No, single region", value: "regional", icon: "📍" }], show: () => true },
    { id: "cost", question: "Cost priority?", options: [{ label: "Performance first", value: "performance", icon: "🚀" }, { label: "Cost savings", value: "cost", icon: "💰" }], show: (a) => a.facing === "external" && a.scope === "regional" },
  ];

  const getRecommendation = () => {
    const { facing, layer, scope, cost } = answers;
    if (!facing || !layer || !scope) return null;

    if (facing === "internal") {
      if (layer === 7 && scope === "global") return LOAD_BALANCERS.find((lb) => lb.id === "cialb");
      if (layer === 7) return LOAD_BALANCERS.find((lb) => lb.id === "rialb");
      return LOAD_BALANCERS.find((lb) => lb.id === "ripnlb");
    }
    if (scope === "global") {
      if (layer === 7) return LOAD_BALANCERS.find((lb) => lb.id === "gxalb");
      return LOAD_BALANCERS.find((lb) => lb.id === "gxpnlb");
    }
    if (layer === 7) return LOAD_BALANCERS.find((lb) => lb.id === "rxalb");
    return LOAD_BALANCERS.find((lb) => lb.id === "rxpnlb");
  };

  const tierRec = () => {
    const { facing, scope, cost } = answers;
    if (facing === "internal") return { tier: "N/A", reason: "Internal traffic never leaves Google's network. Tiers don't apply." };
    if (scope === "global") return { tier: "Premium", reason: "Global scope requires Premium Tier for anycast and multi-region routing." };
    if (cost === "cost") return { tier: "Standard", reason: "Standard Tier saves on egress costs. Regional LBs are fully supported." };
    return { tier: "Premium (recommended)", reason: "Premium gives better latency and reliability even for regional setups, but Standard works too." };
  };

  const visibleQuestions = questions.filter((q) => !q.show || q.show(answers));
  const recommendation = getRecommendation();
  const tier = recommendation ? tierRec() : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ padding: "16px 20px", background: COLORS.accentBg, borderRadius: "8px", border: `1px solid ${COLORS.accent}30` }}>
        <p style={{ margin: 0, color: COLORS.text, fontSize: "13px", lineHeight: 1.6 }}>
          Answer the questions below to find the right load balancer and network tier for your use case.
        </p>
      </div>

      {visibleQuestions.map((q, qi) => {
        const isAnswered = answers[q.id] !== undefined;
        const isActive = qi === 0 || Object.keys(answers).length >= qi;
        if (!isActive) return null;
        return (
          <div key={q.id} style={{ padding: "20px", background: COLORS.surface, borderRadius: "12px", border: `1px solid ${isAnswered ? COLORS.success + "40" : COLORS.border}`, transition: "border-color 0.3s" }}>
            <div style={{ fontFamily: FONTS.display, color: isAnswered ? COLORS.success : COLORS.text, fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>
              <span style={{ color: COLORS.textDim, marginRight: "8px" }}>Q{qi + 1}.</span>{q.question}
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const newAnswers = { ...answers, [q.id]: opt.value };
                      // Clear downstream answers
                      const qIds = visibleQuestions.map((vq) => vq.id);
                      const idx = qIds.indexOf(q.id);
                      qIds.slice(idx + 1).forEach((id) => delete newAnswers[id]);
                      setAnswers(newAnswers);
                    }}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "8px",
                      border: `1px solid ${selected ? COLORS.accent : COLORS.border}`,
                      background: selected ? COLORS.accentBg : COLORS.bg,
                      color: selected ? COLORS.accent : COLORS.textMuted,
                      cursor: "pointer",
                      fontFamily: FONTS.body,
                      fontSize: "13px",
                      fontWeight: selected ? 600 : 400,
                      transition: "all 0.2s",
                    }}
                  >
                    {opt.icon} {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {recommendation && (
        <div style={{ padding: "24px", background: `linear-gradient(135deg, ${COLORS.surface}, ${COLORS.surfaceLight})`, borderRadius: "12px", border: `1px solid ${COLORS.success}40`, animation: "fadeIn 0.4s ease" }}>
          <div style={{ fontFamily: FONTS.display, color: COLORS.success, fontSize: "12px", fontWeight: 700, letterSpacing: "1px", marginBottom: "12px" }}>✓ RECOMMENDATION</div>
          <div style={{ fontSize: "20px", color: COLORS.text, fontWeight: 700, marginBottom: "8px" }}>{recommendation.icon} {recommendation.name}</div>
          <p style={{ margin: "0 0 16px", color: COLORS.textMuted, fontSize: "13px", lineHeight: 1.6 }}>{recommendation.useCase}</p>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            <Tag color={recommendation.layer === 7 ? COLORS.layer7 : COLORS.layer4} bg={recommendation.layer === 7 ? "rgba(45,212,191,0.1)" : "rgba(251,146,60,0.1)"} border={recommendation.layer === 7 ? "rgba(45,212,191,0.2)" : "rgba(251,146,60,0.2)"}>
              Layer {recommendation.layer}
            </Tag>
            <Tag color={recommendation.scope === "global" ? COLORS.global : COLORS.regional} bg={recommendation.scope === "global" ? "rgba(251,191,36,0.1)" : "rgba(167,139,250,0.1)"} border={recommendation.scope === "global" ? "rgba(251,191,36,0.2)" : "rgba(167,139,250,0.2)"}>
              {recommendation.scope}
            </Tag>
            {tierTag(recommendation.tier)}
          </div>

          {tier && (
            <div style={{ padding: "12px 16px", background: COLORS.bg, borderRadius: "8px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontFamily: FONTS.display, color: COLORS.premium, fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "4px" }}>NETWORK TIER: {tier.tier}</div>
              <div style={{ color: COLORS.textMuted, fontSize: "12px" }}>{tier.reason}</div>
            </div>
          )}

          <button onClick={() => setAnswers({})} style={{ marginTop: "16px", padding: "8px 16px", background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: "6px", color: COLORS.textDim, cursor: "pointer", fontSize: "12px", fontFamily: FONTS.display }}>
            Reset ↺
          </button>
        </div>
      )}
    </div>
  );
};

// Explorer Tab
const ExplorerTab = () => {
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ layer: null, scope: null, facing: null });

  const filtered = LOAD_BALANCERS.filter((lb) => {
    if (filters.layer && lb.layer !== filters.layer) return false;
    if (filters.scope && lb.scope !== filters.scope) return false;
    if (filters.facing && lb.facing !== filters.facing) return false;
    return true;
  });

  const FilterBtn = ({ label, filterKey, value, color }) => {
    const active = filters[filterKey] === value;
    return (
      <button
        onClick={() => setFilters({ ...filters, [filterKey]: active ? null : value })}
        style={{
          padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontFamily: FONTS.display, cursor: "pointer",
          border: `1px solid ${active ? color : COLORS.border}`,
          background: active ? `${color}15` : "transparent",
          color: active ? color : COLORS.textDim,
          fontWeight: active ? 700 : 400,
          transition: "all 0.2s",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontFamily: FONTS.display, fontSize: "10px", color: COLORS.textDim, letterSpacing: "1px" }}>FILTER:</span>
        <FilterBtn label="L7" filterKey="layer" value={7} color={COLORS.layer7} />
        <FilterBtn label="L4" filterKey="layer" value={4} color={COLORS.layer4} />
        <span style={{ color: COLORS.border }}>|</span>
        <FilterBtn label="Global" filterKey="scope" value="global" color={COLORS.global} />
        <FilterBtn label="Regional" filterKey="scope" value="regional" color={COLORS.regional} />
        <span style={{ color: COLORS.border }}>|</span>
        <FilterBtn label="External" filterKey="facing" value="external" color={COLORS.external} />
        <FilterBtn label="Internal" filterKey="facing" value="internal" color={COLORS.internal} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
        {filtered.map((lb) => (
          <div
            key={lb.id}
            onClick={() => setSelected(selected?.id === lb.id ? null : lb)}
            style={{
              padding: "16px", borderRadius: "10px", cursor: "pointer",
              background: selected?.id === lb.id ? COLORS.surfaceLight : COLORS.surface,
              border: `1px solid ${selected?.id === lb.id ? COLORS.accent : COLORS.border}`,
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div style={{ fontSize: "18px" }}>{lb.icon}</div>
              <div style={{ display: "flex", gap: "4px" }}>
                <Tag color={lb.layer === 7 ? COLORS.layer7 : COLORS.layer4} bg={lb.layer === 7 ? "rgba(45,212,191,0.1)" : "rgba(251,146,60,0.1)"} border={lb.layer === 7 ? "rgba(45,212,191,0.2)" : "rgba(251,146,60,0.2)"}>
                  L{lb.layer}
                </Tag>
              </div>
            </div>
            <div style={{ fontWeight: 600, color: COLORS.text, fontSize: "13px", marginBottom: "6px" }}>{lb.shortName}</div>
            <div style={{ fontSize: "12px", color: COLORS.textDim, lineHeight: 1.5 }}>{lb.useCase}</div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ padding: "24px", background: COLORS.surface, borderRadius: "12px", border: `1px solid ${COLORS.accent}40` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: COLORS.text, marginBottom: "4px" }}>{selected.icon} {selected.name}</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {tierTag(selected.tier)}
                <Tag color={selected.scope === "global" ? COLORS.global : COLORS.regional} bg={selected.scope === "global" ? "rgba(251,191,36,0.1)" : "rgba(167,139,250,0.1)"} border={selected.scope === "global" ? "rgba(251,191,36,0.2)" : "rgba(167,139,250,0.2)"}>
                  {selected.scope}
                </Tag>
                <Tag color={selected.facing === "external" ? COLORS.external : COLORS.internal} bg={selected.facing === "external" ? "rgba(244,114,182,0.1)" : "rgba(129,140,248,0.1)"} border={selected.facing === "external" ? "rgba(244,114,182,0.2)" : "rgba(129,140,248,0.2)"}>
                  {selected.facing}
                </Tag>
              </div>
            </div>
          </div>
          <p style={{ margin: "0 0 16px", color: COLORS.textMuted, fontSize: "13px", lineHeight: 1.7 }}>{selected.useCase}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <div style={{ fontFamily: FONTS.display, fontSize: "10px", color: COLORS.textDim, letterSpacing: "1px", marginBottom: "8px" }}>PROTOCOLS</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {selected.protocols.map((p) => (
                  <span key={p} style={{ padding: "2px 8px", borderRadius: "4px", background: COLORS.bg, border: `1px solid ${COLORS.border}`, fontSize: "11px", color: COLORS.text, fontFamily: FONTS.display }}>{p}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: FONTS.display, fontSize: "10px", color: COLORS.textDim, letterSpacing: "1px", marginBottom: "8px" }}>KEY FEATURES</div>
              {selected.features.map((f) => (
                <div key={f} style={{ fontSize: "12px", color: COLORS.text, marginBottom: "4px" }}>
                  <span style={{ color: COLORS.accent, marginRight: "6px" }}>▸</span>{f}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Compare Tab
const CompareTab = () => {
  const [sel, setSel] = useState([]);
  const toggle = (id) => {
    if (sel.includes(id)) setSel(sel.filter((s) => s !== id));
    else if (sel.length < 3) setSel([...sel, id]);
  };
  const selected = LOAD_BALANCERS.filter((lb) => sel.includes(lb.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ padding: "12px 16px", background: COLORS.accentBg, borderRadius: "8px", border: `1px solid ${COLORS.accent}30` }}>
        <p style={{ margin: 0, color: COLORS.text, fontSize: "13px" }}>Select up to 3 load balancers to compare side-by-side.</p>
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {LOAD_BALANCERS.map((lb) => {
          const active = sel.includes(lb.id);
          return (
            <button key={lb.id} onClick={() => toggle(lb.id)} style={{
              padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontFamily: FONTS.body,
              border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
              background: active ? COLORS.accentBg : "transparent",
              color: active ? COLORS.accent : COLORS.textMuted,
              fontWeight: active ? 600 : 400,
              opacity: !active && sel.length >= 3 ? 0.4 : 1,
            }}>
              {lb.icon} {lb.shortName}
            </button>
          );
        })}
      </div>

      {selected.length >= 2 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                <th style={{ textAlign: "left", padding: "10px", fontFamily: FONTS.display, color: COLORS.textDim, fontSize: "10px", letterSpacing: "1px", minWidth: "100px" }}>PROPERTY</th>
                {selected.map((lb) => (
                  <th key={lb.id} style={{ textAlign: "left", padding: "10px", color: COLORS.accent, fontFamily: FONTS.display, fontSize: "11px", minWidth: "160px" }}>{lb.icon} {lb.shortName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Layer", fn: (lb) => `Layer ${lb.layer}` },
                { label: "Scope", fn: (lb) => lb.scope },
                { label: "Facing", fn: (lb) => lb.facing },
                { label: "Tier", fn: (lb) => lb.tier === "both" ? "Premium or Standard" : lb.tier === "n/a" ? "N/A (Internal)" : lb.tier },
                { label: "Protocols", fn: (lb) => lb.protocols.join(", ") },
                { label: "Features", fn: (lb) => lb.features.join(", ") },
                { label: "Use Case", fn: (lb) => lb.useCase },
              ].map((row) => (
                <tr key={row.label} style={{ borderBottom: `1px solid ${COLORS.border}15` }}>
                  <td style={{ padding: "10px", color: COLORS.textMuted, fontWeight: 600, fontSize: "11px", fontFamily: FONTS.display, verticalAlign: "top" }}>{row.label}</td>
                  {selected.map((lb) => (
                    <td key={lb.id} style={{ padding: "10px", color: COLORS.text, verticalAlign: "top", lineHeight: 1.5 }}>{row.fn(lb)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Main App
export default function App() {
  const [activeTab, setActiveTab] = useState("overview");

  const TabContent = {
    overview: OverviewTab,
    tiers: TiersTab,
    decision: DecisionTree,
    explorer: ExplorerTab,
    compare: CompareTab,
  };
  const ActiveComponent = TabContent[activeTab];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: FONTS.body, padding: "24px 16px" }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        button:hover { filter: brightness(1.1); }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontFamily: FONTS.display, fontSize: "10px", color: COLORS.accent, letterSpacing: "3px", marginBottom: "8px" }}>INTERACTIVE GUIDE</div>
          <h1 style={{ margin: "0 0 4px", fontFamily: FONTS.display, fontSize: "24px", fontWeight: 700, color: COLORS.text }}>
            GCP Load Balancing
          </h1>
          <p style={{ margin: 0, color: COLORS.textDim, fontSize: "13px" }}>
            Network tiers, load balancer types, and how to choose the right one
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "24px", overflowX: "auto", paddingBottom: "4px" }}>
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                  background: active ? COLORS.accent + "18" : "transparent",
                  color: active ? COLORS.accent : COLORS.textDim,
                  fontFamily: FONTS.display, fontSize: "12px", fontWeight: active ? 700 : 400,
                  whiteSpace: "nowrap", transition: "all 0.2s",
                  letterSpacing: "0.3px",
                }}
              >
                <span style={{ marginRight: "6px" }}>{tab.icon}</span>{tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div key={activeTab} style={{ animation: "fadeIn 0.3s ease" }}>
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
