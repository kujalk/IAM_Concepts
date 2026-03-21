import { useState } from "react";

/* ── Dark Palette ── */
const C = {
  bg: "#06070b",
  surface: "#0d0f16",
  surface2: "#13161f",
  surface3: "#1a1e2b",
  border: "#222840",
  borderHi: "#333a55",
  text: "#dee2f0",
  dim: "#636d8c",
  dim2: "#4a5270",
  blue: "#4e8ff7",
  green: "#34d399",
  amber: "#fbbf24",
  red: "#f87171",
  pink: "#f472b6",
  purple: "#a78bfa",
  cyan: "#22d3ee",
  teal: "#2dd4bf",
  orange: "#fb923c",
};

/* ── Shared Components ── */
const Tag = ({ children, color = C.cyan }) => (
  <span style={{
    padding: "2px 9px", borderRadius: 20,
    background: `${color}18`, border: `1px solid ${color}40`,
    color, fontSize: 10, fontWeight: 700,
    display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.5px",
  }}>{children}</span>
);

const Code = ({ children }) => (
  <code style={{
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    background: C.surface3, padding: "2px 7px", borderRadius: 5,
    color: C.cyan, border: `1px solid ${C.border}`,
  }}>{children}</code>
);

const SectionLabel = ({ children }) => (
  <div style={{
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
    letterSpacing: 3, textTransform: "uppercase", color: C.dim2, marginBottom: 8,
  }}>{children}</div>
);

const Callout = ({ color = C.cyan, icon, title, children }) => (
  <div style={{
    background: `${color}08`, border: `1px solid ${color}20`,
    borderRadius: 14, padding: "18px 22px", margin: "20px 0",
    display: "flex", gap: 14, alignItems: "flex-start",
  }}>
    <div style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</div>
    <div>
      <div style={{ color, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{title}</div>
      <div style={{ color: C.dim, fontSize: 13, lineHeight: 1.75 }}>{children}</div>
    </div>
  </div>
);

/* ── SVG Sequence Diagram ── */
const ACTORS = [
  { id: "user",    label: "User",             sub: "Employee",        color: C.blue,   icon: "👤" },
  { id: "browser", label: "Browser",          sub: "Chrome/Edge",     color: C.purple, icon: "🌐" },
  { id: "sp",      label: "Service Provider", sub: "App (Salesforce…)", color: C.green,  icon: "⚡" },
  { id: "idp",     label: "Identity Provider",sub: "Okta/Azure AD…",  color: C.amber,  icon: "🛡️" },
];

const COL_W = 220, ACTOR_H = 70, STEP_H = 68, PAD_LEFT = 20, PAD_TOP = 10;

function getX(idx) { return PAD_LEFT + idx * COL_W + COL_W / 2; }

const Arrow = ({ from, to, label, sublabel, color, dashed, y }) => {
  const x1 = getX(from), x2 = getX(to);
  const dir = x2 > x1 ? 1 : -1;
  const midX = (x1 + x2) / 2;
  return (
    <g>
      <line
        x1={x1} y1={y} x2={x2 - dir * 8} y2={y}
        stroke={color} strokeWidth={1.5}
        strokeDasharray={dashed ? "5,4" : undefined}
        opacity={0.85}
      />
      <polygon
        points={`${x2},${y} ${x2 - dir * 10},${y - 5} ${x2 - dir * 10},${y + 5}`}
        fill={color} opacity={0.85}
      />
      <text x={midX} y={y - 8} textAnchor="middle" fill={C.text}
        fontSize={12} fontFamily="'DM Sans', sans-serif" fontWeight={600}>{label}</text>
      {sublabel && (
        <text x={midX} y={y + 18} textAnchor="middle" fill={C.dim}
          fontSize={10} fontFamily="'JetBrains Mono', monospace">{sublabel}</text>
      )}
    </g>
  );
};

const ActorBox = ({ idx, actor }) => {
  const cx = getX(idx);
  return (
    <g>
      <rect x={cx - 80} y={PAD_TOP} width={160} height={ACTOR_H - 10}
        rx={10} fill={`${actor.color}15`} stroke={actor.color} strokeWidth={1.5} />
      <text x={cx} y={PAD_TOP + 22} textAnchor="middle" fill={actor.color}
        fontSize={18} fontFamily="sans-serif">{actor.icon}</text>
      <text x={cx} y={PAD_TOP + 40} textAnchor="middle" fill={actor.color}
        fontSize={13} fontFamily="'DM Sans', sans-serif" fontWeight={700}>{actor.label}</text>
      <text x={cx} y={PAD_TOP + 55} textAnchor="middle" fill={C.dim}
        fontSize={10} fontFamily="'JetBrains Mono', monospace">{actor.sub}</text>
    </g>
  );
};

const StepLabel = ({ stepNum, text, x, y, color }) => (
  <g>
    <rect x={x - 85} y={y - 16} width={170} height={34}
      rx={8} fill={C.surface2} stroke={`${color}30`} strokeWidth={1} />
    <text x={x} y={y - 4} textAnchor="middle" fill={color}
      fontSize={9} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>STEP {stepNum}</text>
    <text x={x} y={y + 10} textAnchor="middle" fill={C.text}
      fontSize={11} fontFamily="'DM Sans', sans-serif" fontWeight={500}>{text}</text>
  </g>
);

function SequenceDiagram({ scenario }) {
  const totalWidth = PAD_LEFT * 2 + ACTORS.length * COL_W;
  const lifelineTop = PAD_TOP + ACTOR_H;

  const firstLoginSteps = [
    { from: 0, to: 2, label: "GET /app", sublabel: "Access protected resource", color: C.blue, stepNum: 1, labelAt: 1 },
    { from: 2, to: 2, label: "No session found", sublabel: "Generate AuthnRequest", color: C.green, stepNum: 2, self: true, labelAt: 2 },
    { from: 2, to: 1, label: "302 Redirect → IdP", sublabel: "Carries SAMLRequest / OIDC auth req", color: C.green, dashed: true, stepNum: 3, labelAt: 1 },
    { from: 1, to: 3, label: "GET /sso?SAMLRequest=…", sublabel: "Browser follows redirect", color: C.purple, stepNum: 4, labelAt: 2 },
    { from: 3, to: 3, label: "No IdP session cookie", sublabel: "Must authenticate", color: C.amber, stepNum: 5, self: true, labelAt: 3 },
    { from: 3, to: 1, label: "Login page", sublabel: "Username + Password + MFA", color: C.amber, dashed: true, stepNum: 6, labelAt: 2 },
    { from: 1, to: 0, label: "Show login form", sublabel: "User sees IdP login UI", color: C.purple, dashed: true, stepNum: 7, labelAt: 0 },
    { from: 0, to: 1, label: "Submit credentials", sublabel: "POST username/password/MFA", color: C.blue, stepNum: 8, labelAt: 0 },
    { from: 1, to: 3, label: "Validate credentials", sublabel: "POST /login", color: C.purple, stepNum: 9, labelAt: 2 },
    { from: 3, to: 3, label: "Auth success! Create session", sublabel: "Set IdP session cookie • Build assertion", color: C.green, stepNum: 10, self: true, labelAt: 3 },
    { from: 3, to: 1, label: "Set-Cookie: IdP_SESSION", sublabel: "HTTP-Only, Secure, scoped to IdP domain", color: C.amber, dashed: true, stepNum: 11, labelAt: 2 },
    { from: 3, to: 1, label: "HTML form + signed assertion", sublabel: "SAML Response or OIDC code", color: C.amber, dashed: true, stepNum: 12, labelAt: 2 },
    { from: 1, to: 2, label: "POST /acs  (assertion)", sublabel: "Browser auto-submits form to SP ACS URL", color: C.purple, stepNum: 13, labelAt: 1 },
    { from: 2, to: 2, label: "Verify signature • Extract identity", sublabel: "Create SP application session", color: C.green, stepNum: 14, self: true, labelAt: 2 },
    { from: 2, to: 1, label: "Set-Cookie: SP_SESSION • 200 OK", sublabel: "User is logged in to the app", color: C.green, dashed: true, stepNum: 15, labelAt: 1 },
  ];

  const silentLoginSteps = [
    { from: 0, to: 2, label: "GET /app2", sublabel: "User visits second application", color: C.blue, stepNum: 1, labelAt: 1 },
    { from: 2, to: 2, label: "No SP session", sublabel: "Generate AuthnRequest", color: C.green, stepNum: 2, self: true, labelAt: 2 },
    { from: 2, to: 1, label: "302 Redirect → IdP", sublabel: "Same as first login", color: C.green, dashed: true, stepNum: 3, labelAt: 1 },
    { from: 1, to: 3, label: "GET /sso?SAMLRequest=…", sublabel: "Browser sends IdP session cookie", color: C.purple, stepNum: 4, labelAt: 2 },
    { from: 3, to: 3, label: "✓ IdP session cookie found!", sublabel: "Skip login — user already authenticated", color: C.green, stepNum: 5, self: true, labelAt: 3 },
    { from: 3, to: 1, label: "New signed assertion for App2", sublabel: "No credentials required", color: C.amber, dashed: true, stepNum: 6, labelAt: 2 },
    { from: 1, to: 2, label: "POST /acs (assertion)", sublabel: "Auto-submit form", color: C.purple, stepNum: 7, labelAt: 1 },
    { from: 2, to: 2, label: "Verify + create session", sublabel: "Seamless login — user never saw a prompt", color: C.green, stepNum: 8, self: true, labelAt: 2 },
    { from: 2, to: 1, label: "Set-Cookie: SP_SESSION • 200 OK", sublabel: "~1 second, invisible to user", color: C.green, dashed: true, stepNum: 9, labelAt: 1 },
  ];

  const steps = scenario === 0 ? firstLoginSteps : silentLoginSteps;
  const svgHeight = lifelineTop + steps.length * STEP_H + 40;

  return (
    <svg width="100%" viewBox={`0 0 ${totalWidth} ${svgHeight}`}
      style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "visible" }}>
      {/* Actors */}
      {ACTORS.map((a, i) => <ActorBox key={a.id} idx={i} actor={a} />)}

      {/* Lifelines */}
      {ACTORS.map((a, i) => (
        <line key={a.id}
          x1={getX(i)} y1={lifelineTop}
          x2={getX(i)} y2={svgHeight - 20}
          stroke={C.border} strokeWidth={1.5}
          strokeDasharray="6,5" opacity={0.6}
        />
      ))}

      {/* Steps */}
      {steps.map((s, idx) => {
        const y = lifelineTop + (idx + 0.7) * STEP_H;
        if (s.self) {
          const cx = getX(s.from);
          const bx = cx + 30;
          return (
            <g key={idx}>
              <path d={`M ${cx} ${y} Q ${bx + 25} ${y} ${bx} ${y + 22} Q ${bx + 25} ${y + 44} ${cx} ${y + 44}`}
                fill="none" stroke={s.color} strokeWidth={1.5} opacity={0.8} />
              <rect x={cx - 85} y={y - 12} width={170} height={34}
                rx={7} fill={C.surface2} stroke={`${s.color}35`} strokeWidth={1} />
              <text x={cx} y={y + 1} textAnchor="middle" fill={s.color}
                fontSize={9} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>STEP {s.stepNum}</text>
              <text x={cx} y={y + 14} textAnchor="middle" fill={C.text}
                fontSize={11} fontFamily="'DM Sans', sans-serif" fontWeight={500}>{s.label}</text>
              {s.sublabel && (
                <text x={cx} y={y + 30} textAnchor="middle" fill={C.dim}
                  fontSize={9} fontFamily="'JetBrains Mono', monospace">{s.sublabel}</text>
              )}
            </g>
          );
        }
        const x1 = getX(s.from), x2 = getX(s.to);
        const dir = x2 > x1 ? 1 : -1;
        const midX = (x1 + x2) / 2;
        const labelX = s.labelAt !== undefined ? getX(s.labelAt) : midX;
        return (
          <g key={idx}>
            <line x1={x1} y1={y} x2={x2 - dir * 8} y2={y}
              stroke={s.color} strokeWidth={1.5}
              strokeDasharray={s.dashed ? "5,4" : undefined} opacity={0.85} />
            <polygon points={`${x2},${y} ${x2 - dir * 10},${y - 5} ${x2 - dir * 10},${y + 5}`}
              fill={s.color} opacity={0.85} />
            <rect x={labelX - 85} y={y - 26} width={170} height={28}
              rx={6} fill={`${C.bg}cc`} />
            <text x={labelX} y={y - 14} textAnchor="middle" fill={s.color}
              fontSize={9} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>STEP {s.stepNum}</text>
            <text x={labelX} y={y - 2} textAnchor="middle" fill={C.text}
              fontSize={11} fontFamily="'DM Sans', sans-serif" fontWeight={600}>{s.label}</text>
            {s.sublabel && (
              <text x={labelX} y={y + 12} textAnchor="middle" fill={C.dim}
                fontSize={9} fontFamily="'JetBrains Mono', monospace">{s.sublabel}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Protocol Comparison Table ── */
const protocols = [
  { name: "SAML 2.0",  year: "2005", format: "XML Assertions",      transport: "Browser POST/Redirect", token: "SAML Assertion",    use: "Enterprise SSO", color: C.amber },
  { name: "OIDC",      year: "2014", format: "JWT (JSON)",           transport: "HTTP Redirect + API",   token: "ID Token + Access", use: "Modern Web/Mobile", color: C.blue },
  { name: "OAuth 2.0", year: "2012", format: "Opaque / JWT",         transport: "HTTP Redirect",         token: "Access Token",      use: "API Authorization", color: C.green },
  { name: "WS-Fed",    year: "2007", format: "XML (SAML/JWT)",       transport: "Browser Form POST",     token: "Security Token",    use: "Microsoft ecosystem", color: C.purple },
  { name: "CAS",       year: "2002", format: "XML Tickets",          transport: "HTTP Redirect",         token: "Service Ticket",    use: "University/Portal SSO", color: C.teal },
];

/* ── Main Component ── */
export default function SSOConcepts() {
  const [activeSection, setActiveSection] = useState("what");
  const [seqScenario, setSeqScenario] = useState(0);

  const sections = [
    { id: "what", label: "What is SSO" },
    { id: "actors", label: "Key Actors" },
    { id: "flow", label: "Full Flow" },
    { id: "sessions", label: "Session Layers" },
    { id: "protocols", label: "Protocols" },
    { id: "initiation", label: "SP vs IdP Init" },
    { id: "tokens", label: "Tokens & Assertions" },
    { id: "trust", label: "Trust & Certs" },
    { id: "slo", label: "SLO / Logout" },
    { id: "security", label: "Security" },
  ];

  const scroll = (id) => {
    setActiveSection(id);
    document.getElementById(`sso-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const wrap = {
    background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif",
    minHeight: "100vh", lineHeight: 1.7, WebkitFontSmoothing: "antialiased",
  };
  const container = { maxWidth: 920, margin: "0 auto", padding: "0 24px 100px" };

  return (
    <div style={wrap}>
      {/* ── Sticky Nav ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(6,7,11,0.9)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.border}`, padding: "10px 24px",
        display: "flex", gap: 4, overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => scroll(s.id)} style={{
            flexShrink: 0, padding: "7px 14px", borderRadius: 8,
            border: `1px solid ${activeSection === s.id ? `${C.cyan}40` : "transparent"}`,
            background: activeSection === s.id ? `${C.cyan}12` : "transparent",
            color: activeSection === s.id ? C.cyan : C.dim,
            fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 600,
            cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
          }}>{s.label}</button>
        ))}
      </nav>

      <div style={container}>
        {/* ── Hero ── */}
        <div style={{ textAlign: "center", padding: "60px 0 52px", borderBottom: `1px solid ${C.border}`, marginBottom: 64 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
            letterSpacing: 3, textTransform: "uppercase", color: C.cyan, marginBottom: 20,
          }}>Complete Concept Reference</div>
          <h1 style={{
            fontSize: "clamp(38px,6vw,62px)", fontWeight: 300, letterSpacing: -2,
            lineHeight: 1.08, marginBottom: 20, fontFamily: "'DM Sans', sans-serif",
          }}>
            Single Sign-On{" "}
            <span style={{
              fontStyle: "italic",
              background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Demystified</span>
          </h1>
          <p style={{ color: C.dim, fontSize: 16, fontWeight: 300, maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            Everything you need to understand SSO — from the basic idea to session layers, SAML assertions,
            trust chains, protocol comparison, and real security threats.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
            {["SAML 2.0", "OIDC", "OAuth2", "SP-Init", "IdP-Init", "SLO"].map(t => (
              <Tag key={t} color={C.cyan}>{t}</Tag>
            ))}
          </div>
        </div>

        {/* ═══════════ 1. WHAT IS SSO ═══════════ */}
        <section id="sso-what" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 01</SectionLabel>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 300, letterSpacing: -1, marginBottom: 20 }}>What is Single Sign-On?</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 20 }}>
            SSO is an <strong style={{ color: C.text }}>authentication architecture</strong> where a user logs in once to a central authority
            and then gains access to multiple independent applications without re-entering credentials.
            It doesn't eliminate authentication — it <strong style={{ color: C.text }}>centralizes</strong> it.
          </p>

          {/* Without vs With SSO */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18,
            padding: "28px 24px", margin: "24px 0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ padding: "18px 28px", borderRadius: 14, background: `${C.red}10`, border: `1px solid ${C.red}25`, textAlign: "center", minWidth: 200 }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>😫</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.red, marginBottom: 6 }}>Without SSO</div>
                <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.7 }}>
                  App1 → login<br />App2 → login again<br />App3 → login again<br />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>N apps = N logins</span>
                </div>
              </div>
              <div style={{ fontSize: 28, color: C.dim }}>→</div>
              <div style={{ padding: "18px 28px", borderRadius: 14, background: `${C.green}10`, border: `1px solid ${C.green}25`, textAlign: "center", minWidth: 200 }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>😎</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.green, marginBottom: 6 }}>With SSO</div>
                <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.7 }}>
                  IdP → login <strong style={{ color: C.green }}>once</strong><br />App1 → auto ✓<br />App2 → auto ✓<br />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>N apps = 1 login</span>
                </div>
              </div>
            </div>
          </div>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85 }}>
            Think of it like an airport. Without SSO, you'd show your passport at every shop and lounge.
            With SSO, you show it once at security (the IdP), get a boarding pass (a token/assertion),
            and every gate (application) accepts that boarding pass.
          </p>

          <Callout color={C.cyan} icon="💡" title="Key Principle">
            SSO separates <strong style={{ color: C.text }}>authentication</strong> (who are you?) from{" "}
            <strong style={{ color: C.text }}>authorization</strong> (what can you access?). The IdP handles authentication centrally.
            Each application still handles its own authorization — what the user can do once identified.
          </Callout>
        </section>

        {/* ═══════════ 2. KEY ACTORS ═══════════ */}
        <section id="sso-actors" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 02</SectionLabel>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 300, letterSpacing: -1, marginBottom: 20 }}>The Four Actors</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            Every SSO interaction involves four participants. Understanding their roles is fundamental to everything else.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 12, margin: "24px 0" }}>
            {[
              { icon: "👤", color: C.blue,   title: "User (Subject)",        sub: "Principal", desc: "The human or service trying to access a resource. Holds credentials at the IdP. Interacts through a user agent (browser)." },
              { icon: "🌐", color: C.purple, title: "Browser",               sub: "User Agent", desc: "The silent but critical 4th actor. Carries cookies, follows redirects, and auto-submits forms. Standard HTTP cookie behavior makes SSO possible." },
              { icon: "🛡️", color: C.amber,  title: "IdP",                   sub: "Identity Provider", desc: "The central trust authority. Stores credentials, performs authentication, manages sessions, issues signed tokens. E.g., Okta, Azure AD, Keycloak, ADFS." },
              { icon: "⚡", color: C.green,  title: "SP",                    sub: "Service Provider", desc: "The application the user wants to access. Delegates authentication to the IdP. Never sees the user's password. E.g., Salesforce, Slack, AWS Console." },
            ].map(a => (
              <div key={a.title} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
                padding: 22, transition: "all 0.3s",
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 14,
                  background: `${a.color}18`, border: `1px solid ${a.color}35`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, marginBottom: 14,
                }}>{a.icon}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: a.color, marginBottom: 4 }}>{a.sub}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{a.title}</div>
                <div style={{ fontSize: 12.5, color: C.dim, lineHeight: 1.7 }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ 3. FULL FLOW + SEQUENCE DIAGRAM ═══════════ */}
        <section id="sso-flow" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 03</SectionLabel>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 300, letterSpacing: -1, marginBottom: 20 }}>How SSO Actually Works</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            The fundamental mechanism is: <strong style={{ color: C.text }}>HTTP redirects + cookies + cryptographic assertions</strong>.
            Select a scenario to see the full interactive sequence diagram.
          </p>

          {/* Scenario Tabs */}
          <div style={{
            display: "flex", gap: 4,
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: 5, marginBottom: 24,
          }}>
            {[
              { label: "First Login", sub: "No IdP session", icon: "🔐" },
              { label: "Silent Login", sub: "IdP session exists", icon: "✨" },
            ].map((s, i) => (
              <button key={i} onClick={() => setSeqScenario(i)} style={{
                flex: 1, padding: "12px 16px", borderRadius: 10,
                border: "none",
                background: seqScenario === i ? C.surface2 : "transparent",
                color: seqScenario === i ? C.text : C.dim,
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: seqScenario === i ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
              }}>
                <div style={{ fontSize: 16, marginBottom: 3 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: C.dim }}>{s.sub}</div>
              </button>
            ))}
          </div>

          {seqScenario === 0 && (
            <Callout color={C.red} icon="🔐" title="Scenario: First Login — No Active IdP Session">
              User opens an application for the first time today. No IdP session cookie exists.{" "}
              <strong style={{ color: C.text }}>Credentials will be required.</strong>
            </Callout>
          )}
          {seqScenario === 1 && (
            <Callout color={C.green} icon="✨" title="Scenario: Silent Login — IdP Session Active">
              User accesses a second application. The IdP session cookie from the first login is still valid.{" "}
              <strong style={{ color: C.text }}>No credentials required — login is seamless (~1 second).</strong>
            </Callout>
          )}

          <div style={{ overflowX: "auto", marginTop: 8 }}>
            <SequenceDiagram scenario={seqScenario} />
          </div>

          {/* Step-by-step breakdown */}
          <div style={{ marginTop: 32 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.dim2, textTransform: "uppercase", marginBottom: 16 }}>Step-by-Step Breakdown</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {(seqScenario === 0 ? [
                { n: "1–2", color: C.blue,   title: "Request & AuthnRequest", desc: "User hits the app. SP finds no local session and builds a SAML AuthnRequest (or OIDC authorization request) containing: SP entity ID, ACS URL, random ID (for correlation), and optional ForceAuthn." },
                { n: "3–4", color: C.purple, title: "Redirect to IdP", desc: "SP issues a 302 redirect. Browser follows automatically. Carries SAMLRequest (Base64 URL-encoded) + RelayState (original URL). IdP receives request and checks its own cookie jar." },
                { n: "5–8", color: C.amber,  title: "Authentication", desc: "No IdP session → user must authenticate. IdP presents login form. User submits credentials. IdP validates against LDAP/AD/DB. MFA evaluated if configured." },
                { n: "9–12", color: C.green, title: "Session + Assertion Creation", desc: "Auth succeeds. IdP sets its own session cookie (e.g. KEYCLOAK_SESSION, OIDC_COOKIE). Then builds a signed assertion: user identity, attributes, validity window, audience restriction. Signs it with IdP private key." },
                { n: "13–15", color: C.purple, title: "Assertion Delivery & Validation", desc: "IdP delivers assertion to SP via browser (SAML: HTML auto-POST to ACS URL; OIDC: redirect with code, then back-channel token request). SP verifies signature, checks timestamps, extracts NameID/claims, creates local session cookie." },
              ] : [
                { n: "1–3", color: C.blue,   title: "New App Request", desc: "User visits App2. SP finds no local session and generates an AuthnRequest. Issues 302 redirect to IdP — identical to first login." },
                { n: "4–5", color: C.green,  title: "IdP Session Hit", desc: "Browser automatically sends the IdP session cookie set during first login. IdP finds a valid session — user is already authenticated. No login form shown." },
                { n: "6–7", color: C.amber,  title: "New Assertion Issued", desc: "IdP immediately builds and signs a new assertion for App2. Delivers it via browser redirect/POST back to App2's ACS URL." },
                { n: "8–9", color: C.purple, title: "Silent Admission", desc: "App2 validates the assertion and creates its own session cookie. User is logged in. The entire flow takes ~1 second. User sees no prompts." },
              ]).map(s => (
                <div key={s.n} style={{ display: "grid", gridTemplateColumns: "52px 1fr", gap: 14, position: "relative" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: `${s.color}18`, border: `1px solid ${s.color}35`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700,
                    color: s.color, flexShrink: 0,
                  }}>{s.n}</div>
                  <div style={{
                    background: C.surface2, border: `1px solid ${C.border}`,
                    borderRadius: 12, padding: "14px 18px", marginBottom: 8,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 12.5, color: C.dim, lineHeight: 1.7 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ 4. SESSION LAYERS ═══════════ */}
        <section id="sso-sessions" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 04</SectionLabel>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 300, letterSpacing: -1, marginBottom: 20 }}>The Three Session Layers</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            One of the most misunderstood aspects of SSO. There are <strong style={{ color: C.text }}>three independent session layers</strong>,
            each with its own lifecycle, storage mechanism, and expiry. Understanding these explains every SSO behavior you'll encounter.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "24px 0" }}>
            {[
              {
                layer: "Layer 1", sub: "OS / Desktop Session", color: C.blue, icon: "🖥️",
                title: "OS / Kerberos Session",
                detail: "Created when you log into your workstation. On Windows domain machines, produces a Kerberos TGT from Active Directory. This is the foundation — in enterprise environments, this is often the only time you type a password all day.",
                ttl: "Until machine lock / logoff",
              },
              {
                layer: "Layer 2", sub: "IdP Session", color: C.amber, icon: "🛡️",
                title: "IdP Session Cookie",
                detail: "Created when you authenticate with the Identity Provider. Stored as a session cookie in the browser, scoped to the IdP's domain (e.g. login.microsoftonline.com). This is the linchpin of SSO — its presence enables silent login to all apps.",
                ttl: "Typically 8–12 hours (configurable)",
              },
              {
                layer: "Layer 3", sub: "SP App Session", color: C.green, icon: "⚡",
                title: "Application Session Cookies",
                detail: "Created by each individual application after validating the IdP's assertion. Completely independent — Salesforce, Slack, and Jira each have their own sessions with their own TTLs. If a SP session expires, SSO redirect happens again — but if the IdP session is alive, it's still seamless.",
                ttl: "Per-app (15 min to hours)",
              },
            ].map(s => (
              <div key={s.layer} style={{
                display: "grid", gridTemplateColumns: "160px 1fr",
                border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden",
              }}>
                <div style={{
                  padding: "18px 16px",
                  background: `${s.color}10`, borderRight: `1px solid ${C.border}`,
                  display: "flex", flexDirection: "column", justifyContent: "center",
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ color: s.color, fontSize: 13, fontWeight: 700 }}>{s.layer}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: 1, color: s.color, textTransform: "uppercase", marginTop: 2 }}>{s.sub}</div>
                </div>
                <div style={{ padding: "18px 20px", background: C.surface }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 12.5, color: C.dim, lineHeight: 1.7, marginBottom: 8 }}>{s.detail}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    color: s.color, background: `${s.color}12`,
                    padding: "4px 10px", borderRadius: 6, display: "inline-block",
                  }}>TTL: {s.ttl}</div>
                </div>
              </div>
            ))}
          </div>

          <Callout color={C.purple} icon="🧠" title="Debugging SSO Tip">
            When "SSO stopped working," ask: <strong style={{ color: C.text }}>which layer's session expired?</strong>{" "}
            SP session expired but IdP alive → silent re-auth. IdP session expired → login prompt.
            OS session expired (lockout) → nothing works. Always debug the right layer first.
          </Callout>
        </section>

        {/* ═══════════ 5. PROTOCOLS ═══════════ */}
        <section id="sso-protocols" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 05</SectionLabel>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 300, letterSpacing: -1, marginBottom: 20 }}>SSO Protocols Compared</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            Multiple protocols implement SSO. They differ in token format, transport mechanism, and target use case.
            SAML and OIDC are the two dominant standards today.
          </p>

          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%", borderCollapse: "separate", borderSpacing: 0,
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
              overflow: "hidden", fontSize: 12.5,
            }}>
              <thead>
                <tr style={{ background: C.surface2 }}>
                  {["Protocol", "Year", "Format", "Transport", "Token Type", "Best For"].map(h => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, borderBottom: `1px solid ${C.border}`, color: C.text }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {protocols.map((p, i) => (
                  <tr key={p.name} style={{ background: i % 2 === 0 ? "transparent" : `${C.surface2}50` }}>
                    <td style={{ padding: "11px 14px", borderBottom: `1px solid ${C.border}`, fontWeight: 700, color: p.color }}>{p.name}</td>
                    <td style={{ padding: "11px 14px", borderBottom: `1px solid ${C.border}`, fontFamily: "'JetBrains Mono', monospace", color: C.dim, fontSize: 11 }}>{p.year}</td>
                    <td style={{ padding: "11px 14px", borderBottom: `1px solid ${C.border}`, color: C.dim }}>{p.format}</td>
                    <td style={{ padding: "11px 14px", borderBottom: `1px solid ${C.border}`, color: C.dim }}>{p.transport}</td>
                    <td style={{ padding: "11px 14px", borderBottom: `1px solid ${C.border}`, color: C.dim }}>{p.token}</td>
                    <td style={{ padding: "11px 14px", borderBottom: `1px solid ${C.border}`, color: C.dim }}>{p.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SAML vs OIDC deep comparison */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24 }}>
            {[
              {
                color: C.amber, title: "SAML 2.0", icon: "📋",
                points: [
                  "XML-based, verbose but widely supported",
                  "Assertion passed through browser via POST",
                  "Ideal for enterprise: Salesforce, AWS, Azure",
                  "Metadata XML defines trust relationship",
                  "SP-Initiated and IdP-Initiated both common",
                  "Used in government, healthcare, finance",
                ],
              },
              {
                color: C.blue, title: "OpenID Connect (OIDC)", icon: "🔑",
                points: [
                  "JSON/JWT-based, modern and lightweight",
                  "Built on OAuth 2.0 authorization framework",
                  "Native support for mobile/SPA applications",
                  "JWKS endpoint for public key distribution",
                  "/.well-known/openid-configuration discovery",
                  "Preferred for cloud-native / modern apps",
                ],
              },
            ].map(p => (
              <div key={p.title} style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 20 }}>{p.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: p.color }}>{p.title}</span>
                </div>
                {p.points.map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: p.color, flexShrink: 0, fontSize: 12 }}>▸</span>
                    <span style={{ color: C.dim, fontSize: 12.5, lineHeight: 1.6 }}>{pt}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ 6. SP vs IdP INITIATION ═══════════ */}
        <section id="sso-initiation" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 06</SectionLabel>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 300, letterSpacing: -1, marginBottom: 20 }}>SP-Initiated vs IdP-Initiated</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            SSO flows can start from two different places. The difference matters for deep-link handling and security.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              {
                color: C.green, title: "SP-Initiated", icon: "⚡", badge: "Most Common",
                desc: "The user tries to access the application (SP) directly. The SP detects no session, builds an AuthnRequest, and redirects to the IdP. The IdP authenticates and returns the assertion to the SP.",
                flow: ["User → SP (no session)", "SP builds AuthnRequest", "SP → 302 → IdP", "IdP authenticates", "IdP → assertion → SP", "SP creates session"],
                pro: "Deep-linking works. User can bookmark specific app URLs.",
                con: "Slightly more hops, SP must handle RelayState carefully.",
              },
              {
                color: C.purple, title: "IdP-Initiated", icon: "🛡️", badge: "Portal Style",
                desc: "The user starts at the IdP's portal (e.g., Okta dashboard, myapps.microsoft.com). They click an app tile. The IdP generates an unsolicited assertion and POSTs it directly to the SP's ACS URL.",
                flow: ["User → IdP portal", "User clicks app tile", "IdP builds assertion (no AuthnRequest)", "IdP → POST → SP ACS URL", "SP validates assertion", "SP creates session"],
                pro: "Simpler for end users — central app launch portal.",
                con: "No AuthnRequest → InResponseTo check can't be done. Higher CSRF/replay risk.",
              },
            ].map(f => (
              <div key={f.title} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 22,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>{f.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: f.color }}>{f.title}</span>
                  <Tag color={f.color}>{f.badge}</Tag>
                </div>
                <p style={{ color: C.dim, fontSize: 12.5, lineHeight: 1.7, marginBottom: 14 }}>{f.desc}</p>
                <div style={{ marginBottom: 14 }}>
                  {f.flow.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 6,
                        background: `${f.color}18`, border: `1px solid ${f.color}35`,
                        fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
                        color: f.color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                        flexShrink: 0,
                      }}>{i + 1}</div>
                      <span style={{ fontSize: 12, color: C.text }}>{step}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11.5, marginBottom: 4 }}>
                  <span style={{ color: C.green, fontWeight: 700 }}>✓ </span>
                  <span style={{ color: C.dim }}>{f.pro}</span>
                </div>
                <div style={{ fontSize: 11.5 }}>
                  <span style={{ color: C.amber, fontWeight: 700 }}>⚠ </span>
                  <span style={{ color: C.dim }}>{f.con}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ 7. TOKENS & ASSERTIONS ═══════════ */}
        <section id="sso-tokens" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 07</SectionLabel>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 300, letterSpacing: -1, marginBottom: 20 }}>Tokens & Assertions</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            The assertion/token is the cryptographic proof that the IdP issues to tell the SP who the user is.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 14 }}>
            {[
              {
                color: C.amber, title: "SAML Assertion (XML)", icon: "📋",
                fields: [
                  ["Issuer", "IdP entity ID — who signed this"],
                  ["Subject / NameID", "User identity (email, UPN, opaque ID)"],
                  ["AuthnStatement", "When/how the user authenticated"],
                  ["AttributeStatement", "User attributes: groups, email, roles"],
                  ["Conditions", "NotBefore, NotOnOrAfter, AudienceRestriction"],
                  ["Signature", "XML digital signature using IdP private key"],
                ],
              },
              {
                color: C.blue, title: "OIDC ID Token (JWT)", icon: "🔑",
                fields: [
                  ["iss", "Issuer — IdP URL"],
                  ["sub", "Subject — unique user ID"],
                  ["aud", "Audience — must include SP client_id"],
                  ["exp / iat", "Expiry and issued-at timestamps"],
                  ["nonce", "Replay prevention (from AuthnRequest)"],
                  ["Custom claims", "Email, roles, groups, etc."],
                ],
              },
            ].map(t => (
              <div key={t.title} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20,
              }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 20 }}>{t.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: t.color }}>{t.title}</span>
                </div>
                {t.fields.map(([k, v]) => (
                  <div key={k} style={{
                    display: "grid", gridTemplateColumns: "140px 1fr",
                    borderBottom: `1px solid ${C.border}`, padding: "8px 0", gap: 12,
                  }}>
                    <Code>{k}</Code>
                    <span style={{ fontSize: 12, color: C.dim, lineHeight: 1.6 }}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <Callout color={C.amber} icon="🔒" title="Why Can't the Browser Tamper With the Assertion?">
            The assertion is <strong style={{ color: C.text }}>cryptographically signed</strong> using the IdP's private key.
            The SP validates the signature using the IdP's public certificate (obtained from metadata or JWKS endpoint).
            Any modification to the assertion — even a single character — would invalidate the signature and cause the SP to reject it.
          </Callout>
        </section>

        {/* ═══════════ 8. TRUST & CERTS ═══════════ */}
        <section id="sso-trust" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 08</SectionLabel>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 300, letterSpacing: -1, marginBottom: 20 }}>Trust & Certificates</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            Before any SSO flow can happen, the SP and IdP must establish trust. This is done through{" "}
            <strong style={{ color: C.text }}>metadata exchange</strong> — a configuration step that happens once.
          </p>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.dim2, textTransform: "uppercase", marginBottom: 14 }}>Trust Establishment Flow</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              {[
                { label: "IdP publishes metadata XML", color: C.amber },
                { label: "→" },
                { label: "SP downloads/imports IdP metadata", color: C.green },
                { label: "→" },
                { label: "SP registers with IdP (upload SP metadata)", color: C.blue },
                { label: "→" },
                { label: "Trust established ✓", color: C.cyan },
              ].map((s, i) => s.label === "→"
                ? <span key={i} style={{ color: C.dim, fontSize: 18 }}>→</span>
                : <div key={i} style={{ padding: "8px 14px", background: `${s.color}12`, border: `1px solid ${s.color}30`, borderRadius: 8, fontSize: 12.5, color: s.color, fontWeight: 600 }}>{s.label}</div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              {
                color: C.amber, title: "IdP Metadata contains:", icon: "🛡️",
                items: ["EntityID — unique IdP identifier", "SSO endpoint URL (Redirect + POST bindings)", "SLO endpoint URL", "X.509 signing certificate (public key)", "NameID formats supported", "Attribute profiles"],
              },
              {
                color: C.green, title: "SP Metadata contains:", icon: "⚡",
                items: ["EntityID — unique SP identifier", "ACS URL (where to deliver assertions)", "SLO URL", "Optional encryption certificate", "NameID format preference", "Requested attributes"],
              },
            ].map(m => (
              <div key={m.title} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontSize: 18 }}>{m.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.title}</span>
                </div>
                {m.items.map(item => (
                  <div key={item} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: m.color, fontSize: 12 }}>▸</span>
                    <span style={{ fontSize: 12.5, color: C.dim, lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ 9. SLO ═══════════ */}
        <section id="sso-slo" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 09</SectionLabel>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 300, letterSpacing: -1, marginBottom: 20 }}>Single Logout (SLO)</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            Logging out of SSO is more complex than logging out of a single app. SLO must terminate all sessions across the chain.
          </p>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.dim2, textTransform: "uppercase", marginBottom: 16 }}>SLO Flow</div>
            {[
              { n: 1, color: C.blue,   text: "User clicks 'Logout' on App1 (SP)" },
              { n: 2, color: C.green,  text: "SP sends LogoutRequest to IdP's SLO endpoint" },
              { n: 3, color: C.amber,  text: "IdP receives request — invalidates IdP session cookie" },
              { n: 4, color: C.amber,  text: "IdP sends LogoutRequest to all other connected SPs that have active sessions" },
              { n: 5, color: C.green,  text: "Each SP invalidates its own app session cookie and responds with LogoutResponse" },
              { n: 6, color: C.amber,  text: "IdP sends LogoutResponse back to the originating SP" },
              { n: 7, color: C.blue,   text: "User is redirected to login page or logout landing" },
            ].map(s => (
              <div key={s.n} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                  background: `${s.color}18`, border: `1px solid ${s.color}35`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace",
                }}>{s.n}</div>
                <div style={{ fontSize: 13, color: C.dim, lineHeight: 1.6, paddingTop: 3 }}>{s.text}</div>
              </div>
            ))}
          </div>

          <Callout color={C.amber} icon="⚠️" title="SLO Challenges">
            Not all SPs support SLO properly. Many only clear the SP session without notifying the IdP.
            Some apps use long-lived cookies that survive logout. Always test your SLO implementation.{" "}
            <strong style={{ color: C.text }}>SP-initiated SLO only logs out the SP session — the IdP session may still be alive</strong>,
            allowing re-login to other apps until the IdP session expires naturally.
          </Callout>
        </section>

        {/* ═══════════ 10. SECURITY ═══════════ */}
        <section id="sso-security" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 10</SectionLabel>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 300, letterSpacing: -1, marginBottom: 20 }}>Security Threats & Mitigations</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            Because SSO is a single point of trust, vulnerabilities here can compromise all connected applications simultaneously.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 10 }}>
            {[
              { title: "Assertion Replay Attack", icon: "🔁", color: C.red, desc: "Attacker captures a valid assertion and replays it. Mitigated by: short assertion validity windows (1–5 min), InResponseTo correlation, and one-time-use assertion IDs.", fix: "NotOnOrAfter + InResponseTo check" },
              { title: "CSRF on ACS Endpoint", icon: "🎯", color: C.red, desc: "Attacker tricks browser into POSTing a forged assertion. Mitigated by validating RelayState and InResponseTo fields, CSRF tokens on ACS endpoints.", fix: "Validate RelayState + InResponseTo" },
              { title: "IdP Session Hijacking", icon: "🍪", color: C.amber, desc: "If the IdP session cookie is stolen, the attacker gains SSO access to all connected apps. Mitigated by HttpOnly + Secure flags, short TTL, binding session to IP/User-Agent.", fix: "HttpOnly + Secure + short TTL" },
              { title: "Open Redirect", icon: "↩️", color: C.amber, desc: "Malicious RelayState value redirects user to phishing site after login. Mitigated by validating RelayState against an allowlist of SP-registered URLs.", fix: "RelayState URL allowlist validation" },
              { title: "XML Signature Wrapping", icon: "📋", color: C.red, desc: "Attacker modifies unsigned portions of SAML XML while keeping signature valid. Mitigated by strict XML canonicalization and validating the signed element is what you actually process.", fix: "Use canonical XML, validate signed ref" },
              { title: "IdP Spoofing", icon: "🎭", color: C.purple, desc: "Attacker sets up a fake IdP. SP must validate Issuer field in assertion against registered IdP EntityID and verify signature with the correct IdP certificate.", fix: "Pin IdP EntityID + certificate" },
            ].map(t => (
              <div key={t.title} style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 18,
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.title}</span>
                </div>
                <p style={{ fontSize: 12, color: C.dim, lineHeight: 1.65, marginBottom: 10 }}>{t.desc}</p>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                  background: `${C.green}10`, color: C.green,
                  border: `1px solid ${C.green}25`, borderRadius: 6,
                  padding: "5px 10px",
                }}>✓ {t.fix}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
