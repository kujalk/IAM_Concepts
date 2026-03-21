import { useState } from "react";

/* ── Dark Palette ── */
const C = {
  bg: "#080a10",
  surface: "#0f1118",
  surface2: "#151820",
  surface3: "#1c2030",
  border: "#242840",
  borderHi: "#363d5e",
  text: "#e2e6f4",
  dim: "#5e6a8a",
  dim2: "#434d6a",
  blue: "#3b82f6",
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#f87171",
  pink: "#f472b6",
  purple: "#a78bfa",
  cyan: "#22d3ee",
  teal: "#2dd4bf",
  orange: "#fb923c",
};

/* ── Shared UI ── */
const Code = ({ children, color = C.cyan }) => (
  <code style={{
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    background: `${color}12`, padding: "2px 7px", borderRadius: 5,
    color, border: `1px solid ${color}25`,
  }}>{children}</code>
);

const Tag = ({ children, color = C.cyan }) => (
  <span style={{
    padding: "2px 9px", borderRadius: 20,
    background: `${color}18`, border: `1px solid ${color}40`,
    color, fontSize: 10, fontWeight: 700,
    display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.5px",
  }}>{children}</span>
);

const SectionLabel = ({ children }) => (
  <div style={{
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
    letterSpacing: 3, textTransform: "uppercase", color: C.dim2, marginBottom: 8,
  }}>{children}</div>
);

const Callout = ({ color = C.cyan, icon, title, children }) => (
  <div style={{
    background: `${color}07`, border: `1px solid ${color}22`,
    borderRadius: 14, padding: "18px 22px", margin: "20px 0",
    display: "flex", gap: 14, alignItems: "flex-start",
  }}>
    <div style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</div>
    <div>
      <div style={{ color, fontSize: 13, fontWeight: 700, marginBottom: 5 }}>{title}</div>
      <div style={{ color: C.dim, fontSize: 13, lineHeight: 1.8 }}>{children}</div>
    </div>
  </div>
);

const XmlBlock = ({ children, label }) => (
  <div style={{ margin: "16px 0" }}>
    {label && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.dim2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>}
    <pre style={{
      background: "#0a0c12", border: `1px solid ${C.border}`,
      borderRadius: 10, padding: "16px 18px", margin: 0,
      color: C.text, fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace",
      overflowX: "auto", lineHeight: 1.7, whiteSpace: "pre",
    }}>{children}</pre>
  </div>
);

/* ── SAML Full Sequence Diagram (SVG) ── */
const ACTORS = [
  { id: "user",    label: "User",    sub: "Browser",          color: C.blue,   icon: "👤" },
  { id: "sp",      label: "SP",      sub: "Service Provider", color: C.green,  icon: "⚡" },
  { id: "idp",     label: "IdP",     sub: "Identity Provider",color: C.amber,  icon: "🛡️" },
  { id: "store",   label: "UserDB",  sub: "LDAP / AD / DB",   color: C.purple, icon: "🗄️" },
];

const COL_W = 200, ACTOR_H = 70, STEP_H = 72, PAD_L = 20, PAD_T = 10;
function getX(i) { return PAD_L + i * COL_W + COL_W / 2; }

function SAMLSequenceDiagram() {
  const steps = [
    // SP-Initiated
    { from: 0, to: 1, label: "GET /dashboard", sub: "User clicks app bookmark", color: C.blue, n: "1" },
    { self: 1, label: "No session cookie found", sub: "Generate SAMLRequest XML", color: C.green, n: "2" },
    { from: 1, to: 0, label: "HTTP 302 Redirect", sub: "Location: idp.com/sso?SAMLRequest=...&RelayState=...", color: C.green, dashed: true, n: "3" },
    { from: 0, to: 2, label: "GET idp.com/sso?SAMLRequest=…", sub: "Browser follows redirect, sends IdP cookie if any", color: C.blue, n: "4" },
    { self: 2, label: "Decode & parse AuthnRequest", sub: "Validate SP EntityID, ACS URL, expiry, signature (if signed)", color: C.amber, n: "5" },
    { self: 2, label: "No IdP session cookie", sub: "Must present login page", color: C.red, n: "6" },
    { from: 2, to: 0, label: "200 OK — Login Page", sub: "HTML form: username/password/MFA", color: C.amber, dashed: true, n: "7" },
    { from: 0, to: 2, label: "POST /login  credentials", sub: "username + password (+ TOTP/FIDO if MFA)", color: C.blue, n: "8" },
    { from: 2, to: 3, label: "Validate credentials", sub: "LDAP Bind / DB lookup", color: C.amber, n: "9" },
    { from: 3, to: 2, label: "Auth Success + attributes", sub: "Return: email, groups, department, roles", color: C.purple, dashed: true, n: "10" },
    // Assertion creation
    { self: 2, label: "Build SAML Response (XML)", sub: "Assertion: NameID, AuthnStatement, Attributes, Conditions", color: C.amber, n: "11" },
    { self: 2, label: "Sign Assertion with IdP private key", sub: "XML-DSIG RSA-SHA256 / SHA512 over canonicalized XML", color: C.amber, n: "12" },
    { self: 2, label: "Set IdP session cookie", sub: "HTTP-Only, Secure, SameSite=None, 8h TTL", color: C.green, n: "13" },
    // Delivery
    { from: 2, to: 0, label: "HTML page with auto-submit form", sub: "SAMLResponse (Base64) + RelayState in hidden inputs", color: C.amber, dashed: true, n: "14" },
    { from: 0, to: 1, label: "POST /acs  (auto-submit)", sub: "SAMLResponse= + RelayState=", color: C.blue, n: "15" },
    // SP Validation
    { self: 1, label: "Base64 decode + XML parse SAMLResponse", sub: "Verify Issuer EntityID matches registered IdP", color: C.green, n: "16" },
    { self: 1, label: "Verify XML digital signature", sub: "Fetch IdP cert from metadata → verify RSA sig → pass/fail", color: C.green, n: "17" },
    { self: 1, label: "Validate Conditions", sub: "NotBefore ≤ now ≤ NotOnOrAfter, AudienceRestriction = SP EntityID", color: C.green, n: "18" },
    { self: 1, label: "Extract identity + attributes", sub: "NameID → user identity; attributes → roles/groups", color: C.green, n: "19" },
    { self: 1, label: "Create SP application session", sub: "Set-Cookie: SP_SESSION=…; generate local user context", color: C.green, n: "20" },
    { from: 1, to: 0, label: "302 → /dashboard  (RelayState URL)", sub: "User lands on original requested resource", color: C.green, dashed: true, n: "21" },
  ];

  const svgH = PAD_T + ACTOR_H + steps.length * STEP_H + 30;
  const svgW = PAD_L * 2 + ACTORS.length * COL_W;
  const llTop = PAD_T + ACTOR_H;

  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, display: "block" }}>
      {/* Actors */}
      {ACTORS.map((a, i) => {
        const cx = getX(i);
        return (
          <g key={a.id}>
            <rect x={cx - 72} y={PAD_T} width={144} height={ACTOR_H - 8}
              rx={10} fill={`${a.color}14`} stroke={a.color} strokeWidth={1.5} />
            <text x={cx} y={PAD_T + 20} textAnchor="middle" fill={a.color} fontSize={17}>{a.icon}</text>
            <text x={cx} y={PAD_T + 38} textAnchor="middle" fill={a.color}
              fontSize={13} fontFamily="'DM Sans',sans-serif" fontWeight={700}>{a.label}</text>
            <text x={cx} y={PAD_T + 52} textAnchor="middle" fill={C.dim}
              fontSize={9} fontFamily="'JetBrains Mono',monospace">{a.sub}</text>
          </g>
        );
      })}
      {/* Lifelines */}
      {ACTORS.map((a, i) => (
        <line key={a.id}
          x1={getX(i)} y1={llTop} x2={getX(i)} y2={svgH - 16}
          stroke={C.border} strokeWidth={1.5} strokeDasharray="6,5" opacity={0.65} />
      ))}
      {/* Steps */}
      {steps.map((s, idx) => {
        const y = llTop + (idx + 0.65) * STEP_H;
        if (s.self !== undefined) {
          const cx = getX(s.self);
          return (
            <g key={idx}>
              <path d={`M ${cx} ${y - 6} Q ${cx + 38} ${y - 6} ${cx + 32} ${y + 8} Q ${cx + 38} ${y + 22} ${cx} ${y + 22}`}
                fill="none" stroke={s.color} strokeWidth={1.5} opacity={0.75} />
              <rect x={cx - 82} y={y - 18} width={164} height={36} rx={7}
                fill={C.surface2} stroke={`${s.color}30`} strokeWidth={1} />
              <text x={cx} y={y - 6} textAnchor="middle" fill={s.color}
                fontSize={8.5} fontFamily="'JetBrains Mono',monospace" fontWeight={700}>STEP {s.n}</text>
              <text x={cx} y={y + 6} textAnchor="middle" fill={C.text}
                fontSize={11} fontFamily="'DM Sans',sans-serif" fontWeight={600}>{s.label}</text>
              <text x={cx} y={y + 20} textAnchor="middle" fill={C.dim}
                fontSize={9} fontFamily="'JetBrains Mono',monospace">{s.sub}</text>
            </g>
          );
        }
        const x1 = getX(s.from), x2 = getX(s.to);
        const dir = x2 > x1 ? 1 : -1;
        const midX = (x1 + x2) / 2;
        return (
          <g key={idx}>
            <line x1={x1} y1={y} x2={x2 - dir * 8} y2={y}
              stroke={s.color} strokeWidth={1.5}
              strokeDasharray={s.dashed ? "5,4" : undefined} opacity={0.85} />
            <polygon points={`${x2},${y} ${x2 - dir * 10},${y - 5} ${x2 - dir * 10},${y + 5}`}
              fill={s.color} opacity={0.85} />
            <rect x={midX - 86} y={y - 24} width={172} height={28} rx={6} fill={`${C.bg}d0`} />
            <text x={midX} y={y - 12} textAnchor="middle" fill={s.color}
              fontSize={8.5} fontFamily="'JetBrains Mono',monospace" fontWeight={700}>STEP {s.n}</text>
            <text x={midX} y={y} textAnchor="middle" fill={C.text}
              fontSize={11.5} fontFamily="'DM Sans',sans-serif" fontWeight={700}>{s.label}</text>
            <text x={midX} y={y + 14} textAnchor="middle" fill={C.dim}
              fontSize={9} fontFamily="'JetBrains Mono',monospace">{s.sub}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Metadata Exchange Diagram ── */
function MetadataFlowDiagram() {
  const svgW = 760, svgH = 260;
  const idpX = 120, spX = 640, midY = 130;
  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, display: "block" }}>
      {/* IdP box */}
      <rect x={20} y={midY - 65} width={200} height={130} rx={12}
        fill={`${C.amber}12`} stroke={C.amber} strokeWidth={1.5} />
      <text x={idpX} y={midY - 42} textAnchor="middle" fill={C.amber} fontSize={18}>🛡️</text>
      <text x={idpX} y={midY - 24} textAnchor="middle" fill={C.amber}
        fontSize={14} fontFamily="'DM Sans',sans-serif" fontWeight={700}>Identity Provider</text>
      {["EntityID", "SSO URL", "SLO URL", "X.509 Cert (public key)"].map((t, i) => (
        <text key={t} x={idpX} y={midY - 6 + i * 16} textAnchor="middle" fill={C.dim}
          fontSize={10} fontFamily="'JetBrains Mono',monospace">{t}</text>
      ))}

      {/* SP box */}
      <rect x={svgW - 220} y={midY - 65} width={200} height={130} rx={12}
        fill={`${C.green}12`} stroke={C.green} strokeWidth={1.5} />
      <text x={spX} y={midY - 42} textAnchor="middle" fill={C.green} fontSize={18}>⚡</text>
      <text x={spX} y={midY - 24} textAnchor="middle" fill={C.green}
        fontSize={14} fontFamily="'DM Sans',sans-serif" fontWeight={700}>Service Provider</text>
      {["EntityID", "ACS URL", "SLO URL", "Optional Encrypt Cert"].map((t, i) => (
        <text key={t} x={spX} y={midY - 6 + i * 16} textAnchor="middle" fill={C.dim}
          fontSize={10} fontFamily="'JetBrains Mono',monospace">{t}</text>
      ))}

      {/* Arrows */}
      {/* IdP → SP: IdP metadata */}
      <defs>
        <marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={C.cyan} />
        </marker>
        <marker id="ah2" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
          <polygon points="8 0, 0 3, 8 6" fill={C.pink} />
        </marker>
      </defs>
      <line x1={230} y1={midY - 22} x2={420} y2={midY - 22}
        stroke={C.cyan} strokeWidth={1.5} markerEnd="url(#ah)" />
      <text x={325} y={midY - 30} textAnchor="middle" fill={C.cyan}
        fontSize={11} fontFamily="'DM Sans',sans-serif" fontWeight={700}>① IdP Metadata XML</text>
      <text x={325} y={midY - 16} textAnchor="middle" fill={C.dim}
        fontSize={9} fontFamily="'JetBrains Mono',monospace">SP imports IdP cert + SSO URL</text>

      {/* SP → IdP: SP metadata */}
      <line x1={420} y1={midY + 22} x2={230} y2={midY + 22}
        stroke={C.pink} strokeWidth={1.5} markerEnd="url(#ah2)" />
      <text x={325} y={midY + 14} textAnchor="middle" fill={C.pink}
        fontSize={11} fontFamily="'DM Sans',sans-serif" fontWeight={700}>② SP Metadata XML</text>
      <text x={325} y={midY + 34} textAnchor="middle" fill={C.dim}
        fontSize={9} fontFamily="'JetBrains Mono',monospace">IdP registers ACS URL + SP EntityID</text>

      {/* Trust label */}
      <rect x={283} y={midY + 48} width={194} height={26} rx={8}
        fill={`${C.green}12`} stroke={`${C.green}40`} strokeWidth={1} />
      <text x={380} y={midY + 65} textAnchor="middle" fill={C.green}
        fontSize={11} fontFamily="'DM Sans',sans-serif" fontWeight={700}>✓ Trust Established</text>
    </svg>
  );
}

/* ── Digital Signature Diagram ── */
function SignatureDiagram() {
  const svgW = 760, svgH = 320;
  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, display: "block" }}>

      {/* SIGNING SIDE */}
      <text x={190} y={28} textAnchor="middle" fill={C.amber}
        fontSize={13} fontFamily="'DM Sans',sans-serif" fontWeight={700}>IdP — Signing</text>

      {/* SAML XML */}
      <rect x={30} y={45} width={160} height={50} rx={8}
        fill={`${C.amber}12`} stroke={`${C.amber}50`} strokeWidth={1.5} />
      <text x={110} y={68} textAnchor="middle" fill={C.amber}
        fontSize={12} fontFamily="'JetBrains Mono',monospace" fontWeight={700}>SAML Assertion</text>
      <text x={110} y={84} textAnchor="middle" fill={C.dim}
        fontSize={9.5} fontFamily="'JetBrains Mono',monospace">XML document</text>

      {/* Arrow: XML → Hash */}
      <line x1={192} y1={70} x2={222} y2={70} stroke={C.dim} strokeWidth={1.5} markerEnd="url(#ah)" />
      <text x={207} y={65} textAnchor="middle" fill={C.dim} fontSize={8}>Hash</text>

      {/* Hash box */}
      <rect x={224} y={45} width={110} height={50} rx={8}
        fill={`${C.purple}10`} stroke={`${C.purple}50`} strokeWidth={1.5} />
      <text x={279} y={68} textAnchor="middle" fill={C.purple}
        fontSize={11} fontFamily="'JetBrains Mono',monospace" fontWeight={700}>SHA-256</text>
      <text x={279} y={84} textAnchor="middle" fill={C.dim}
        fontSize={9} fontFamily="'JetBrains Mono',monospace">digest bytes</text>

      {/* Arrow: Hash → Encrypt */}
      <line x1={335} y1={70} x2={365} y2={70} stroke={C.dim} strokeWidth={1.5} markerEnd="url(#ah)" />
      <text x={350} y={65} textAnchor="middle" fill={C.dim} fontSize={8}>RSA</text>

      {/* Private key */}
      <rect x={200} y={135} width={110} height={45} rx={8}
        fill={`${C.red}10`} stroke={`${C.red}50`} strokeWidth={1.5} />
      <text x={255} y={157} textAnchor="middle" fill={C.red}
        fontSize={11} fontFamily="'JetBrains Mono',monospace" fontWeight={700}>Private Key</text>
      <text x={255} y={171} textAnchor="middle" fill={C.dim}
        fontSize={9} fontFamily="'JetBrains Mono',monospace">IdP only, secret</text>
      {/* Arrow: privkey → encrypt */}
      <line x1={279} y1={135} x2={279} y2={100} stroke={C.red} strokeWidth={1.5} strokeDasharray="4,3" markerEnd="url(#ah)" />

      {/* Encrypt box */}
      <rect x={365} y={45} width={110} height={50} rx={8}
        fill={`${C.cyan}10`} stroke={`${C.cyan}50`} strokeWidth={1.5} />
      <text x={420} y={68} textAnchor="middle" fill={C.cyan}
        fontSize={11} fontFamily="'JetBrains Mono',monospace" fontWeight={700}>Encrypt</text>
      <text x={420} y={84} textAnchor="middle" fill={C.dim}
        fontSize={9} fontFamily="'JetBrains Mono',monospace">RSA encrypt digest</text>

      {/* Arrow → Digital Sig */}
      <line x1={476} y1={70} x2={506} y2={70} stroke={C.dim} strokeWidth={1.5} markerEnd="url(#ah)" />

      {/* Digital Signature */}
      <rect x={508} y={40} width={120} height={60} rx={8}
        fill={`${C.green}12`} stroke={`${C.green}50`} strokeWidth={2} />
      <text x={568} y={63} textAnchor="middle" fill={C.green}
        fontSize={13} fontFamily="'DM Sans',sans-serif" fontWeight={700}>Signature</text>
      <text x={568} y={79} textAnchor="middle" fill={C.dim}
        fontSize={9} fontFamily="'JetBrains Mono',monospace">appended to XML</text>
      <text x={568} y={92} textAnchor="middle" fill={C.dim}
        fontSize={9} fontFamily="'JetBrains Mono',monospace">&lt;ds:SignatureValue&gt;</text>

      {/* Divider */}
      <line x1={30} y1={200} x2={730} y2={200} stroke={C.border} strokeWidth={1} strokeDasharray="8,6" />
      <text x={380} y={196} textAnchor="middle" fill={C.dim2}
        fontSize={9} fontFamily="'JetBrains Mono',monospace" letterSpacing={2}>TRANSMITTED TO SP VIA BROWSER</text>

      {/* VERIFICATION SIDE */}
      <text x={380} y={222} textAnchor="middle" fill={C.blue}
        fontSize={13} fontFamily="'DM Sans',sans-serif" fontWeight={700}>SP — Verification</text>

      {/* Signed SAML */}
      <rect x={30} y={235} width={150} height={50} rx={8}
        fill={`${C.green}10`} stroke={`${C.green}40`} strokeWidth={1.5} />
      <text x={105} y={256} textAnchor="middle" fill={C.green}
        fontSize={11} fontFamily="'JetBrains Mono',monospace" fontWeight={700}>Signed SAMLResponse</text>
      <text x={105} y={272} textAnchor="middle" fill={C.dim}
        fontSize={9} fontFamily="'JetBrains Mono',monospace">XML + Signature block</text>

      {/* SP extracts sig */}
      <line x1={182} y1={260} x2={212} y2={260} stroke={C.dim} strokeWidth={1.5} markerEnd="url(#ah)" />

      {/* Public key from metadata */}
      <rect x={214} y={235} width={130} height={50} rx={8}
        fill={`${C.blue}10`} stroke={`${C.blue}40`} strokeWidth={1.5} />
      <text x={279} y={256} textAnchor="middle" fill={C.blue}
        fontSize={11} fontFamily="'JetBrains Mono',monospace" fontWeight={700}>Public Key</text>
      <text x={279} y={272} textAnchor="middle" fill={C.dim}
        fontSize={9} fontFamily="'JetBrains Mono',monospace">from IdP metadata / cert</text>

      {/* Decrypt */}
      <line x1={345} y1={260} x2={375} y2={260} stroke={C.dim} strokeWidth={1.5} markerEnd="url(#ah)" />
      <text x={360} y={255} textAnchor="middle" fill={C.dim} fontSize={8}>Decrypt sig</text>

      <rect x={377} y={235} width={110} height={50} rx={8}
        fill={`${C.purple}10`} stroke={`${C.purple}40`} strokeWidth={1.5} />
      <text x={432} y={256} textAnchor="middle" fill={C.purple}
        fontSize={11} fontFamily="'JetBrains Mono',monospace" fontWeight={700}>digest₁</text>
      <text x={432} y={272} textAnchor="middle" fill={C.dim}
        fontSize={9} fontFamily="'JetBrains Mono',monospace">decrypted from sig</text>

      {/* Rehash XML */}
      <line x1={105} y1={285} x2={105} y2={308} stroke={C.dim} strokeWidth={1} strokeDasharray="3,3" />
      <line x1={105} y1={308} x2={530} y2={308} stroke={C.dim} strokeWidth={1} strokeDasharray="3,3" />
      <line x1={530} y1={308} x2={530} y2={285} stroke={C.dim} strokeWidth={1} strokeDasharray="3,3" markerEnd="url(#ah)" />
      <text x={318} y={305} textAnchor="middle" fill={C.dim}
        fontSize={9} fontFamily="'JetBrains Mono',monospace">Re-hash XML body → digest₂</text>

      <rect x={495} y={235} width={110} height={50} rx={8}
        fill={`${C.cyan}10`} stroke={`${C.cyan}40`} strokeWidth={1.5} />
      <text x={550} y={256} textAnchor="middle" fill={C.cyan}
        fontSize={11} fontFamily="'JetBrains Mono',monospace" fontWeight={700}>digest₂</text>
      <text x={550} y={272} textAnchor="middle" fill={C.dim}
        fontSize={9} fontFamily="'JetBrains Mono',monospace">rehashed XML body</text>

      {/* Compare → result */}
      <line x1={606} y1={260} x2={636} y2={260} stroke={C.dim} strokeWidth={1.5} markerEnd="url(#ah)" />
      <text x={621} y={255} textAnchor="middle" fill={C.dim} fontSize={8}>Compare</text>

      <rect x={638} y={235} width={92} height={50} rx={8}
        fill={`${C.green}14`} stroke={`${C.green}50`} strokeWidth={2} />
      <text x={684} y={256} textAnchor="middle" fill={C.green}
        fontSize={16} fontFamily="sans-serif">✓</text>
      <text x={684} y={274} textAnchor="middle" fill={C.green}
        fontSize={11} fontFamily="'DM Sans',sans-serif" fontWeight={700}>VALID</text>
    </svg>
  );
}

/* ── Assertion Structure Visual ── */
function AssertionStructure() {
  const blocks = [
    {
      tag: "<samlp:Response>", color: C.dim2, desc: "Wrapper — contains status and the assertion",
      children: [
        {
          tag: "<saml:Issuer>", color: C.amber, desc: "IdP EntityID — who created this response",
          sample: "https://idp.company.com/saml",
        },
        {
          tag: "<samlp:Status>", color: C.green, desc: "StatusCode: urn:oasis:names:tc:SAML:2.0:status:Success",
        },
        {
          tag: "<saml:Assertion>", color: C.cyan, desc: "The core signed document",
          children: [
            { tag: "<saml:Issuer>", color: C.amber, desc: "IdP EntityID (repeated inside assertion)" },
            {
              tag: "<ds:Signature>", color: C.red, desc: "XML Digital Signature over this assertion",
              children: [
                { tag: "<ds:SignedInfo>", color: C.red, desc: "Canonicalized content that was hashed + signed" },
                { tag: "<ds:SignatureValue>", color: C.red, desc: "Base64-encoded RSA signature bytes" },
                { tag: "<ds:KeyInfo>", color: C.red, desc: "X.509 certificate (optional but common)" },
              ],
            },
            {
              tag: "<saml:Subject>", color: C.blue, desc: "User identity",
              children: [
                { tag: "<saml:NameID>", color: C.blue, desc: "User identifier: email, UPN, opaque ID, etc. Format attribute specifies type" },
                { tag: "<saml:SubjectConfirmation>", color: C.blue, desc: "Method: Bearer. Data: NotOnOrAfter, Recipient (ACS URL), InResponseTo" },
              ],
            },
            {
              tag: "<saml:Conditions>", color: C.purple, desc: "Validity window and audience",
              children: [
                { tag: "NotBefore / NotOnOrAfter", color: C.purple, desc: "Assertion is only valid within this time window (typically 2–5 minutes)" },
                { tag: "<saml:AudienceRestriction>", color: C.purple, desc: "SP EntityID — assertion is only valid for this specific SP" },
              ],
            },
            {
              tag: "<saml:AuthnStatement>", color: C.teal, desc: "How and when authentication happened",
              children: [
                { tag: "AuthnInstant", color: C.teal, desc: "UTC timestamp of authentication" },
                { tag: "SessionIndex", color: C.teal, desc: "Unique session ID for SLO correlation" },
                { tag: "<saml:AuthnContext>", color: C.teal, desc: "PasswordProtectedTransport, Kerberos, X509Certificate, etc." },
              ],
            },
            {
              tag: "<saml:AttributeStatement>", color: C.pink, desc: "User attributes from IdP",
              children: [
                { tag: "email", color: C.pink, desc: "john.doe@company.com" },
                { tag: "groups", color: C.pink, desc: "IT-Admins, All-Staff, VPN-Users" },
                { tag: "department", color: C.pink, desc: "Engineering" },
                { tag: "custom attributes", color: C.pink, desc: "Any claims configured in the IdP app mapping" },
              ],
            },
          ],
        },
      ],
    },
  ];

  function renderBlock(b, depth = 0) {
    const indent = depth * 18;
    return (
      <div key={b.tag} style={{ marginLeft: indent }}>
        <div style={{
          display: "flex", gap: 10, alignItems: "flex-start",
          padding: "8px 12px", borderRadius: 8, marginBottom: 3,
          background: depth === 0 ? `${b.color}08` : `${b.color}06`,
          border: `1px solid ${b.color}20`,
        }}>
          <Code color={b.color}>{b.tag}</Code>
          <span style={{ fontSize: 12, color: C.dim, lineHeight: 1.6, marginTop: 1 }}>{b.desc}</span>
          {b.sample && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.dim2, marginTop: 2 }}>{b.sample}</span>}
        </div>
        {b.children && b.children.map(c => renderBlock(c, depth + 1))}
      </div>
    );
  }

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
      {blocks.map(b => renderBlock(b))}
    </div>
  );
}

/* ── Main Component ── */
export default function SAMLDeepDive() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview",   label: "Overview" },
    { id: "metadata",   label: "Metadata Exchange" },
    { id: "authnreq",   label: "AuthnRequest" },
    { id: "flow",       label: "Full SAML Flow" },
    { id: "assertion",  label: "Assertion Anatomy" },
    { id: "signature",  label: "Digital Signatures" },
    { id: "validation", label: "SP Validation" },
    { id: "bindings",   label: "Bindings" },
    { id: "idpinit",    label: "IdP-Initiated" },
    { id: "security",   label: "Security" },
  ];

  const scroll = (id) => {
    setActiveSection(id);
    document.getElementById(`saml-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const wrap = {
    background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif",
    minHeight: "100vh", lineHeight: 1.7, WebkitFontSmoothing: "antialiased",
  };
  const container = { maxWidth: 960, margin: "0 auto", padding: "0 24px 100px" };

  return (
    <div style={wrap}>
      {/* ── Sticky Nav ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(8,10,16,0.92)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.border}`, padding: "10px 24px",
        display: "flex", gap: 4, overflowX: "auto", scrollbarWidth: "none",
      }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => scroll(s.id)} style={{
            flexShrink: 0, padding: "7px 14px", borderRadius: 8,
            border: `1px solid ${activeSection === s.id ? `${C.pink}50` : "transparent"}`,
            background: activeSection === s.id ? `${C.pink}10` : "transparent",
            color: activeSection === s.id ? C.pink : C.dim,
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
            cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
          }}>{s.label}</button>
        ))}
      </nav>

      <div style={container}>
        {/* ── Hero ── */}
        <div style={{ textAlign: "center", padding: "60px 0 52px", borderBottom: `1px solid ${C.border}`, marginBottom: 64 }}>
          <div style={{
            display: "inline-block",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase", color: C.pink,
            background: `${C.pink}10`, border: `1px solid ${C.pink}30`,
            padding: "6px 16px", borderRadius: 20, marginBottom: 20,
          }}>Authentication Deep Dive</div>
          <h1 style={{
            fontSize: "clamp(36px,5.5vw,58px)", fontWeight: 800, letterSpacing: -2,
            lineHeight: 1.08, marginBottom: 18,
            background: `linear-gradient(135deg, ${C.text} 0%, ${C.purple} 50%, ${C.pink} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>SAML 2.0 — Complete Deep Dive</h1>
          <p style={{ color: C.dim, fontSize: 15, fontWeight: 300, maxWidth: 580, margin: "0 auto 24px", lineHeight: 1.8 }}>
            Metadata creation & exchange, trust establishment, AuthnRequest construction,
            digital signatures, assertion anatomy, SP validation, bindings and security.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["XML Assertions", "RSA-SHA256", "POST Binding", "Redirect Binding", "SP-Init", "IdP-Init", "SLO"].map(t => (
              <Tag key={t} color={C.pink}>{t}</Tag>
            ))}
          </div>
        </div>

        {/* ═══════════ 1. OVERVIEW ═══════════ */}
        <section id="saml-overview" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 01</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 700, letterSpacing: -0.5, marginBottom: 20 }}>SAML 2.0 — What It Is</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 20 }}>
            <strong style={{ color: C.text }}>Security Assertion Markup Language (SAML) 2.0</strong> is an XML-based open standard for
            exchanging authentication and authorization data between an Identity Provider (IdP) and a Service Provider (SP).
            Published by OASIS in 2005, it is the dominant enterprise SSO standard — used by Salesforce, AWS, Azure, Workday, ServiceNow and thousands of others.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 10, margin: "24px 0" }}>
            {[
              { icon: "📋", color: C.amber,  title: "XML-Based",        desc: "All messages (AuthnRequest, Response, Assertion) are XML documents. Verbose but highly structured and extensible." },
              { icon: "🔏", color: C.red,    title: "Signed & Encrypted", desc: "Assertions are signed with the IdP's private key. Can also be encrypted with the SP's public key for added confidentiality." },
              { icon: "🌐", color: C.blue,   title: "Browser-Mediated", desc: "All SAML exchanges happen via the user's browser (redirects and form POSTs). No direct IdP↔SP network connection needed." },
              { icon: "🏢", color: C.green,  title: "Enterprise Standard", desc: "Governs SSO for enterprise SaaS apps, federated identity across organizations, and cross-domain authentication." },
            ].map(c => (
              <div key={c.title} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18,
              }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.7 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ 2. METADATA EXCHANGE ═══════════ */}
        <section id="saml-metadata" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 02</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 700, letterSpacing: -0.5, marginBottom: 20 }}>Metadata Creation & Exchange</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 20 }}>
            Before a single SSO request can be processed, IdP and SP must know about each other.
            This is done through <strong style={{ color: C.text }}>SAML Metadata XML</strong> — a one-time configuration exchange.
            The metadata tells each party where to send messages, what certificates to use for signature verification, and which protocols are supported.
          </p>

          <div style={{ overflowX: "auto", marginBottom: 24 }}>
            <MetadataFlowDiagram />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
            {/* IdP Metadata */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
              <div style={{ color: C.amber, fontSize: 14, fontWeight: 700, marginBottom: 14, display: "flex", gap: 8, alignItems: "center" }}>
                <span>🛡️</span> IdP Metadata — generated by IdP
              </div>
              <XmlBlock label="IdP Metadata Structure">
{`<EntityDescriptor entityID="https://idp.company.com/saml">
  <IDPSSODescriptor
    WantAuthnRequestsSigned="true">

    <!-- SSO Endpoints -->
    <SingleSignOnService
      Binding="urn:oasis:...SAML:2.0:bindings:HTTP-Redirect"
      Location="https://idp.company.com/sso/redirect"/>
    <SingleSignOnService
      Binding="urn:oasis:...SAML:2.0:bindings:HTTP-POST"
      Location="https://idp.company.com/sso/post"/>

    <!-- SLO Endpoint -->
    <SingleLogoutService
      Binding="urn:oasis:...SAML:2.0:bindings:HTTP-Redirect"
      Location="https://idp.company.com/slo"/>

    <!-- Signing Certificate (PUBLIC KEY) -->
    <KeyDescriptor use="signing">
      <ds:KeyInfo>
        <ds:X509Data>
          <ds:X509Certificate>
            MIIBkDCB+...base64-encoded-cert...
          </ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </KeyDescriptor>

  </IDPSSODescriptor>
</EntityDescriptor>`}
              </XmlBlock>
            </div>

            {/* SP Metadata */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
              <div style={{ color: C.green, fontSize: 14, fontWeight: 700, marginBottom: 14, display: "flex", gap: 8, alignItems: "center" }}>
                <span>⚡</span> SP Metadata — generated by SP
              </div>
              <XmlBlock label="SP Metadata Structure">
{`<EntityDescriptor entityID="https://app.salesforce.com">
  <SPSSODescriptor
    AuthnRequestsSigned="false"
    WantAssertionsSigned="true">

    <!-- Where IdP should send assertions -->
    <AssertionConsumerService
      Binding="urn:oasis:...SAML:2.0:bindings:HTTP-POST"
      Location="https://app.salesforce.com/acs"
      index="0" isDefault="true"/>

    <!-- SLO endpoint -->
    <SingleLogoutService
      Binding="urn:oasis:...SAML:2.0:bindings:HTTP-Redirect"
      Location="https://app.salesforce.com/slo"/>

    <!-- Encryption Certificate (SP public key) -->
    <!-- IdP uses this to encrypt assertions -->
    <KeyDescriptor use="encryption">
      <ds:KeyInfo>
        <ds:X509Data>
          <ds:X509Certificate>
            MIIBkDCB+...sp-cert-base64...
          </ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </KeyDescriptor>

  </SPSSODescriptor>
</EntityDescriptor>`}
              </XmlBlock>
            </div>
          </div>

          <Callout color={C.cyan} icon="🔑" title="How Certificates Work in SAML Metadata">
            The IdP metadata contains the IdP's <strong style={{ color: C.text }}>public certificate</strong> (public key).
            The SP uses this to <strong style={{ color: C.text }}>verify</strong> the digital signature on assertions.
            The SP metadata optionally contains the SP's public certificate, which the IdP can use to{" "}
            <strong style={{ color: C.text }}>encrypt</strong> assertions so only the SP can decrypt them.
            These are typically self-signed X.509 certificates — PKI chain validation is not required.
          </Callout>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: C.text }}>Certificate Generation (OpenSSL)</div>
            <XmlBlock>
{`# Generate IdP signing key pair (self-signed, 10-year validity)
openssl req -x509 -newkey rsa:2048 -keyout idp-private.pem \\
  -out idp-cert.pem -days 3650 -nodes \\
  -subj "/CN=idp.company.com/O=Company/C=US"

# The public certificate (idp-cert.pem) goes into IdP metadata
# The private key (idp-private.pem) stays SECRET on the IdP server

# Extract the base64 body for metadata XML:
openssl x509 -in idp-cert.pem -noout -text    # view cert info
cat idp-cert.pem | grep -v "^---" | tr -d '\\n' # raw base64 for XML`}
            </XmlBlock>
          </div>
        </section>

        {/* ═══════════ 3. AUTHNREQUEST ═══════════ */}
        <section id="saml-authnreq" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 03</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 700, letterSpacing: -0.5, marginBottom: 20 }}>AuthnRequest — SP's Login Request</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 20 }}>
            In SP-initiated SSO, the SP generates an <strong style={{ color: C.text }}>AuthnRequest</strong> XML document
            and sends it to the IdP's SSO endpoint. The IdP uses this request to know which SP is asking, where to send the response,
            and whether there are any special authentication requirements.
          </p>

          <XmlBlock label="Sample SAML AuthnRequest (SP → IdP)">
{`<samlp:AuthnRequest
  xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"

  ID="_8e8dc5f69a98cc4c1ff3427e5ce34606fd672f91e6"  <!-- Random unique ID -->
  Version="2.0"
  IssueInstant="2024-03-15T14:23:11Z"               <!-- UTC timestamp -->
  Destination="https://idp.company.com/sso/redirect" <!-- From IdP metadata -->
  AssertionConsumerServiceURL="https://app.example.com/acs" <!-- Return address -->
  ProtocolBinding="urn:oasis:...bindings:HTTP-POST"  <!-- How to deliver response -->
  ForceAuthn="false"           <!-- Don't force re-auth if session exists -->
  IsPassive="false"            <!-- OK to show login UI -->
>
  <saml:Issuer>
    https://app.example.com    <!-- SP EntityID — identifies the SP -->
  </saml:Issuer>

  <!-- Optional: specify required NameID format -->
  <samlp:NameIDPolicy
    Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
    AllowCreate="true"/>

  <!-- Optional: require specific auth method -->
  <samlp:RequestedAuthnContext Comparison="minimum">
    <saml:AuthnContextClassRef>
      urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport
    </saml:AuthnContextClassRef>
  </samlp:RequestedAuthnContext>

</samlp:AuthnRequest>`}
          </XmlBlock>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 10, marginTop: 20 }}>
            {[
              { field: "ID", color: C.cyan,   desc: "Unique random request ID. The assertion's InResponseTo must match this to prevent replay attacks." },
              { field: "Issuer", color: C.green,  desc: "SP EntityID. IdP uses this to look up the SP in its registered apps and find the ACS URL to send the response to." },
              { field: "ACS URL", color: C.blue,  desc: "Assertion Consumer Service URL — where the IdP should POST the SAMLResponse. Must match an ACS URL registered in the IdP." },
              { field: "RelayState", color: C.amber, desc: "Opaque string (up to 80 bytes) that the SP attaches and the IdP echoes back. Used to restore the original URL the user was trying to reach." },
              { field: "ForceAuthn", color: C.purple, desc: "If true, IdP must re-authenticate the user even if an active IdP session exists. Used for step-up auth." },
              { field: "IsPassive", color: C.teal,   desc: "If true, IdP must not show any UI. Silent SSO only. If the user isn't authenticated, the IdP returns an error instead of a login page." },
            ].map(f => (
              <div key={f.field} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16,
              }}>
                <Code color={f.color}>{f.field}</Code>
                <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.7, marginTop: 8 }}>{f.desc}</div>
              </div>
            ))}
          </div>

          <Callout color={C.amber} icon="📦" title="How AuthnRequest is Transmitted (Redirect Binding)">
            The AuthnRequest XML is <strong style={{ color: C.text }}>deflated (DEFLATE compressed)</strong>, then{" "}
            <strong style={{ color: C.text }}>Base64 URL-encoded</strong>, then embedded as a query parameter in the redirect URL:{" "}
            <Code>https://idp.com/sso?SAMLRequest=nJJBj9MwEIXv...&RelayState=...&SigAlg=...&Signature=...</Code>
            The full URL can be very long. Modern IdPs accept HTTP POST binding as an alternative for large requests.
          </Callout>
        </section>

        {/* ═══════════ 4. FULL FLOW ═══════════ */}
        <section id="saml-flow" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 04</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 700, letterSpacing: -0.5, marginBottom: 20 }}>Complete SAML SP-Initiated Flow</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            Full sequence diagram: user → SP → IdP → LDAP/AD → assertion signed → delivered → validated.
          </p>

          <div style={{ overflowX: "auto" }}>
            <SAMLSequenceDiagram />
          </div>
        </section>

        {/* ═══════════ 5. ASSERTION ANATOMY ═══════════ */}
        <section id="saml-assertion" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 05</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 700, letterSpacing: -0.5, marginBottom: 20 }}>Assertion Anatomy</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            The <strong style={{ color: C.text }}>SAML Assertion</strong> is the heart of SAML SSO — the signed proof of identity.
            Understanding every element is essential for implementing, debugging, and securing SAML.
          </p>

          <AssertionStructure />

          <XmlBlock label="Full SAML Response Example">
{`<samlp:Response
  xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  ID="_response_9a2b3c4d5e6f"
  Version="2.0"
  IssueInstant="2024-03-15T14:23:14Z"
  Destination="https://app.example.com/acs"
  InResponseTo="_8e8dc5f69a98cc4c1ff3427e5ce34606fd672f91e6"
>
  <saml:Issuer>https://idp.company.com/saml</saml:Issuer>

  <samlp:Status>
    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
  </samlp:Status>

  <saml:Assertion
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="_assertion_abc123def456"
    Version="2.0"
    IssueInstant="2024-03-15T14:23:14Z"
  >
    <saml:Issuer>https://idp.company.com/saml</saml:Issuer>

    <!-- Digital Signature over this Assertion element -->
    <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
      <ds:SignedInfo>
        <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
        <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
        <ds:Reference URI="#_assertion_abc123def456">
          <ds:Transforms>
            <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
            <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
          </ds:Transforms>
          <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
          <ds:DigestValue>c3VwZXJzZWNyZXRoYXNo...</ds:DigestValue>
        </ds:Reference>
      </ds:SignedInfo>
      <ds:SignatureValue>Base64EncodedRSASignatureBytes...</ds:SignatureValue>
      <ds:KeyInfo>
        <ds:X509Data>
          <ds:X509Certificate>IdPPublicCertBase64...</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </ds:Signature>

    <!-- WHO the assertion is about -->
    <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">
        john.doe@company.com
      </saml:NameID>
      <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
        <saml:SubjectConfirmationData
          InResponseTo="_8e8dc5f69a98cc4c1ff3427e5ce34606fd672f91e6"
          NotOnOrAfter="2024-03-15T14:28:14Z"
          Recipient="https://app.example.com/acs"/>
      </saml:SubjectConfirmation>
    </saml:Subject>

    <!-- WHEN the assertion is valid -->
    <saml:Conditions
      NotBefore="2024-03-15T14:23:09Z"
      NotOnOrAfter="2024-03-15T14:28:14Z">
      <saml:AudienceRestriction>
        <saml:Audience>https://app.example.com</saml:Audience>
      </saml:AudienceRestriction>
    </saml:Conditions>

    <!-- HOW the user authenticated -->
    <saml:AuthnStatement
      AuthnInstant="2024-03-15T14:23:13Z"
      SessionIndex="_session_xyz789">
      <saml:AuthnContext>
        <saml:AuthnContextClassRef>
          urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport
        </saml:AuthnContextClassRef>
      </saml:AuthnContext>
    </saml:AuthnStatement>

    <!-- USER ATTRIBUTES from IdP -->
    <saml:AttributeStatement>
      <saml:Attribute Name="email" NameFormat="urn:oasis:...basic:1.1">
        <saml:AttributeValue>john.doe@company.com</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute Name="groups">
        <saml:AttributeValue>IT-Admins</saml:AttributeValue>
        <saml:AttributeValue>All-Staff</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute Name="department">
        <saml:AttributeValue>Engineering</saml:AttributeValue>
      </saml:Attribute>
    </saml:AttributeStatement>

  </saml:Assertion>
</samlp:Response>`}
          </XmlBlock>
        </section>

        {/* ═══════════ 6. DIGITAL SIGNATURES ═══════════ */}
        <section id="saml-signature" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 06</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 700, letterSpacing: -0.5, marginBottom: 20 }}>Digital Signatures — How SAML Guarantees Integrity</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            The digital signature is what makes SAML trustworthy. It guarantees:
            (1) the assertion was created by the real IdP (authenticity), and
            (2) it was not modified in transit (integrity). Even though the assertion travels through the user's browser, it cannot be tampered with.
          </p>

          <div style={{ overflowX: "auto", marginBottom: 24 }}>
            <SignatureDiagram />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
              <div style={{ color: C.amber, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🔏 Signing Process (IdP side)</div>
              {[
                ["1. Canonicalize XML", "Convert to canonical form (removes whitespace differences, normalizes namespace declarations)"],
                ["2. Compute digest", "SHA-256 hash of the canonicalized assertion XML"],
                ["3. Build SignedInfo", "Create XML structure containing the digest and reference to the assertion ID"],
                ["4. Sign with private key", "RSA-SHA256 encrypt the hash using IdP's private key → produces signature bytes"],
                ["5. Base64 encode signature", "Embed the signature bytes as <ds:SignatureValue> inside the assertion"],
                ["6. Optional: encrypt", "Optionally encrypt the assertion using SP's public key for confidentiality"],
              ].map(([k, v]) => (
                <div key={k} style={{ borderBottom: `1px solid ${C.border}`, padding: "8px 0", display: "grid", gridTemplateColumns: "160px 1fr", gap: 10 }}>
                  <Code color={C.amber}>{k}</Code>
                  <span style={{ fontSize: 12, color: C.dim, lineHeight: 1.6 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
              <div style={{ color: C.blue, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>✅ Verification Process (SP side)</div>
              {[
                ["1. Parse SAMLResponse", "Extract the Assertion XML element and the embedded <ds:Signature>"],
                ["2. Get IdP public key", "Retrieve IdP's X.509 certificate from the SAML metadata (or JWKS for OIDC)"],
                ["3. Extract digest from sig", "RSA-decrypt the signature using the IdP public key → original digest bytes"],
                ["4. Re-hash XML body", "Apply the same canonicalization + SHA-256 to the assertion body → new digest"],
                ["5. Compare digests", "digest₁ == digest₂ → signature is VALID. Any mismatch → REJECT immediately"],
                ["6. Check certificate", "Verify cert matches the EntityID, is not expired, and matches registered IdP cert"],
              ].map(([k, v]) => (
                <div key={k} style={{ borderBottom: `1px solid ${C.border}`, padding: "8px 0", display: "grid", gridTemplateColumns: "160px 1fr", gap: 10 }}>
                  <Code color={C.blue}>{k}</Code>
                  <span style={{ fontSize: 12, color: C.dim, lineHeight: 1.6 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ 7. SP VALIDATION ═══════════ */}
        <section id="saml-validation" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 07</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 700, letterSpacing: -0.5, marginBottom: 20 }}>SP Validation Checklist</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            When the SP receives a SAMLResponse, it must validate every aspect before creating a session.
            Skipping any check is a security vulnerability.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { n: "01", color: C.red,    title: "Verify Digital Signature",    desc: "Must verify the XML signature using the IdP's public certificate from registered metadata. Reject if invalid, missing, or signed by unknown cert.", critical: true },
              { n: "02", color: C.red,    title: "Validate Issuer",             desc: "The <saml:Issuer> EntityID must match the registered IdP EntityID. Reject unknown issuers — this prevents IdP spoofing.", critical: true },
              { n: "03", color: C.amber,  title: "Check InResponseTo",         desc: "InResponseTo attribute must match the ID of the AuthnRequest that was sent. Prevents replay attacks and unsolicited assertions in SP-init flows.", critical: false },
              { n: "04", color: C.amber,  title: "Validate Timestamps",         desc: "NotBefore ≤ now ≤ NotOnOrAfter (with configurable clock skew tolerance, typically ±2–5 minutes). Expired assertions must be rejected.", critical: false },
              { n: "05", color: C.amber,  title: "Check AudienceRestriction",   desc: "The <saml:Audience> inside Conditions must match the SP's own EntityID. Prevents assertion theft — an assertion for App A cannot be used at App B.", critical: false },
              { n: "06", color: C.blue,   title: "Validate ACS Recipient",      desc: "SubjectConfirmationData Recipient must match the ACS URL that received the POST. Prevents injection from a different SP's ACS URL.", critical: false },
              { n: "07", color: C.blue,   title: "Check StatusCode",            desc: "samlp:StatusCode must be Success. Non-success responses (AuthnFailed, NoAuthnContext) should return a user-friendly error, not silently create a session.", critical: false },
              { n: "08", color: C.purple, title: "Prevent Assertion Reuse",     desc: "Track processed assertion IDs (store in cache with TTL = assertion expiry). Reject duplicate assertion IDs to prevent replay within the validity window.", critical: false },
              { n: "09", color: C.teal,   title: "Validate NameID",            desc: "NameID must be non-empty and in a format the SP understands. Map it to a local user account using configured attribute mapping.", critical: false },
              { n: "10", color: C.teal,   title: "Extract & Map Attributes",   desc: "Read AttributeStatement values. Map IdP attribute names to local user properties (e.g., email → username, groups → roles). Log any missing required attributes.", critical: false },
            ].map(s => (
              <div key={s.n} style={{
                display: "grid", gridTemplateColumns: "44px 1fr",
                gap: 14, background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: "14px 18px",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: `${s.color}18`, border: `1px solid ${s.color}35`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: s.color,
                }}>{s.n}</div>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.title}</span>
                    {s.critical && <Tag color={C.red}>CRITICAL</Tag>}
                  </div>
                  <div style={{ fontSize: 12.5, color: C.dim, lineHeight: 1.7 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ 8. BINDINGS ═══════════ */}
        <section id="saml-bindings" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 08</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 700, letterSpacing: -0.5, marginBottom: 20 }}>SAML Bindings</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            A binding defines how a SAML message is transported. The two most important are HTTP-Redirect and HTTP-POST.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              {
                color: C.cyan, title: "HTTP-Redirect Binding", tag: "AuthnRequest (SP→IdP)",
                desc: "Used for AuthnRequests (SP → IdP). The XML is DEFLATE-compressed, Base64 URL-encoded, and sent as a query parameter in a 302 redirect URL.",
                flow: ["1. SP generates AuthnRequest XML", "2. DEFLATE compress XML", "3. Base64 URL-encode bytes", "4. Append as ?SAMLRequest= query param", "5. Browser follows 302 redirect to IdP"],
                pro: "Simple, works with any browser", con: "URL length limits restrict large messages",
              },
              {
                color: C.pink, title: "HTTP-POST Binding", tag: "SAMLResponse (IdP→SP)",
                desc: "Used for SAMLResponse (IdP → SP). The XML is Base64 encoded (no compression) and embedded in a hidden form field. JavaScript auto-submits the form.",
                flow: ["1. IdP builds signed SAMLResponse", "2. Base64 encode the XML", "3. Embed in hidden HTML form", "4. JavaScript: form.submit()", "5. Browser POSTs SAMLResponse to SP ACS URL"],
                pro: "No URL length limit, supports large assertions", con: "Requires JavaScript enabled",
              },
            ].map(b => (
              <div key={b.title} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: b.color }}>{b.title}</span>
                  <Tag color={b.color}>{b.tag}</Tag>
                </div>
                <p style={{ color: C.dim, fontSize: 12.5, lineHeight: 1.7, marginBottom: 14 }}>{b.desc}</p>
                {b.flow.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                    <span style={{ color: b.color, fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}.</span>
                    <span style={{ fontSize: 12, color: C.dim, lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12 }}>
                  <span style={{ fontSize: 11.5, color: C.green }}>✓ {b.pro}</span><br />
                  <span style={{ fontSize: 11.5, color: C.amber }}>⚠ {b.con}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginTop: 14 }}>
            <div style={{ color: C.pink, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>HTML Auto-Submit Form (HTTP-POST Binding)</div>
            <XmlBlock>
{`<html>
  <body onload="document.forms[0].submit()">
    <form method="POST" action="https://app.example.com/acs">
      <input type="hidden" name="SAMLResponse"
        value="PHNhbWxwOlJlc3BvbnNlIHhtbG5zOnNhbWxwPS..." />
      <input type="hidden" name="RelayState"
        value="https://app.example.com/dashboard" />
      <noscript>
        <button type="submit">Continue (click if not redirected)</button>
      </noscript>
    </form>
  </body>
</html>`}
            </XmlBlock>
          </div>
        </section>

        {/* ═══════════ 9. IDP-INITIATED ═══════════ */}
        <section id="saml-idpinit" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 09</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 700, letterSpacing: -0.5, marginBottom: 20 }}>IdP-Initiated SSO</h2>

          <p style={{ color: C.dim, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
            In IdP-initiated SSO (also called unsolicited SSO), the user starts at the IdP portal (e.g., Okta dashboard, myapps.microsoft.com)
            and the IdP generates an assertion <strong style={{ color: C.text }}>without receiving an AuthnRequest first</strong>.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
              <div style={{ color: C.purple, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🛡️ IdP-Initiated Flow</div>
              {[
                "User authenticates at IdP portal (myapps.company.com)",
                "User clicks 'Salesforce' tile in the IdP app catalog",
                "IdP looks up the SP app config (target ACS URL, EntityID)",
                "IdP builds SAML Response + Assertion (no AuthnRequest ID → no InResponseTo)",
                "IdP signs assertion and creates auto-submit HTML form",
                "Browser POSTs SAMLResponse directly to SP's ACS URL",
                "SP validates: signature ✓, timestamps ✓, audience ✓ (no InResponseTo to check)",
                "SP creates session and redirects user to app home page",
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: `${C.purple}15`, border: `1px solid ${C.purple}35`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: C.purple, fontFamily: "'JetBrains Mono', monospace",
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 12.5, color: C.dim, lineHeight: 1.6 }}>{s}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Callout color={C.green} icon="✓" title="Advantages">
                <ul style={{ paddingLeft: 16 }}>
                  <li>Simple single portal for users to access all apps</li>
                  <li>No need for the SP to detect unauthenticated users</li>
                  <li>Works well for native apps that can't initiate SP flow</li>
                </ul>
              </Callout>
              <Callout color={C.red} icon="⚠️" title="Security Risks (vs SP-Initiated)">
                <ul style={{ paddingLeft: 16 }}>
                  <li><strong style={{ color: C.text }}>No InResponseTo validation</strong> — can't prevent replay of old assertions</li>
                  <li><strong style={{ color: C.text }}>CSRF risk</strong> — attacker can craft a form that POSTs a stolen assertion to the SP's ACS</li>
                  <li><strong style={{ color: C.text }}>No deep-linking</strong> — user always lands on app home page, not the intended URL</li>
                  <li>SP must explicitly allow unsolicited assertions (opt-in config)</li>
                </ul>
              </Callout>
            </div>
          </div>
        </section>

        {/* ═══════════ 10. SECURITY ═══════════ */}
        <section id="saml-security" style={{ marginBottom: 72, scrollMarginTop: 70 }}>
          <SectionLabel>Chapter 10</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 700, letterSpacing: -0.5, marginBottom: 20 }}>SAML-Specific Security Threats</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 10 }}>
            {[
              {
                title: "XML Signature Wrapping (XSW)",
                icon: "📋", color: C.red, critical: true,
                desc: "Attacker creates a malicious assertion and wraps it around a valid signed assertion. The signature validates on the legitimate element, but the parser processes the attacker's element.",
                fix: "Use ID-based reference in signature. Validate that the signed element is the one actually processed. Never traverse XML twice with different parsers.",
              },
              {
                title: "Assertion Replay",
                icon: "🔁", color: C.red, critical: true,
                desc: "Attacker intercepts a valid SAML assertion and replays it to gain access. Possible if TLS is not enforced or if assertion validity window is too long.",
                fix: "Enforce HTTPS everywhere. Set short NotOnOrAfter (2–5 min). Track used assertion IDs in a cache with TTL = assertion expiry.",
              },
              {
                title: "Man-in-the-Middle",
                icon: "🕵️", color: C.amber, critical: false,
                desc: "Network interception of the assertion during browser transit. Even though assertion is signed, the attacker could replay it from another context.",
                fix: "Always use TLS (HTTPS). Optionally encrypt the assertion with the SP's public key (XML Encryption) to prevent even passive observers from reading it.",
              },
              {
                title: "Open Redirect via RelayState",
                icon: "↩️", color: C.amber, critical: false,
                desc: "Malicious RelayState value causes the SP to redirect the user to an attacker-controlled URL after successful login, enabling phishing.",
                fix: "Validate RelayState against an allowlist. Only accept RelayState values that are paths within the SP's own domain. Reject external URLs.",
              },
              {
                title: "Certificate Confusion",
                icon: "🔑", color: C.amber, critical: false,
                desc: "SP accepts assertions signed by any certificate, including attacker-controlled ones. Must validate against the specific certificate from the registered IdP metadata.",
                fix: "Pin the IdP certificate in SP configuration. Reject assertions signed by certificates not in the registered metadata. Implement cert rotation procedures.",
              },
              {
                title: "SAML Response Injection",
                icon: "💉", color: C.purple, critical: false,
                desc: "Attacker crafts a SAML response and submits it to the SP's ACS URL via CSRF or direct POST, hoping the SP doesn't validate InResponseTo.",
                fix: "Validate InResponseTo against stored AuthnRequest IDs (SP-initiated). Mark AuthnRequest IDs as used after processing. Enforce CSRF tokens on ACS endpoints.",
              },
            ].map(t => (
              <div key={t.title} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18,
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.title}</span>
                  {t.critical && <Tag color={C.red}>CRITICAL</Tag>}
                </div>
                <p style={{ fontSize: 12, color: C.dim, lineHeight: 1.65, marginBottom: 10 }}>{t.desc}</p>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                  background: `${C.green}10`, color: C.green,
                  border: `1px solid ${C.green}25`, borderRadius: 6, padding: "6px 10px",
                }}>✓ {t.fix}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
