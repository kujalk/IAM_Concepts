import { useState } from "react";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: "📋" },
  { id: "ports", label: "Ports & Transport", icon: "🔌" },
  { id: "ntlm-flow", label: "NTLM Auth Flow", icon: "🔄" },
  { id: "ldap-bind", label: "LDAP Bind & SPNEGO", icon: "🔗" },
  { id: "cross-domain", label: "Cross-Domain & Cross-Forest", icon: "🌐" },
  { id: "security", label: "Security & Mitigations", icon: "🛡" },
];

const p = {
  bg: "#0a0c10",
  surface: "#12151c",
  surfaceAlt: "#181c26",
  border: "#1e2433",
  accent: "#6366f1",
  text: "#e2e8f0",
  textDim: "#8892a4",
  textMuted: "#5a6478",
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#eab308",
  blue: "#3b82f6",
  purple: "#a855f7",
  cyan: "#06b6d4",
  orange: "#f97316",
};

/* ── Shared primitives ── */

const Card = ({ children, color = p.border, bg = p.surfaceAlt, style = {} }) => (
  <div style={{ border: `1.5px solid ${color}`, borderRadius: 10, padding: "14px 18px", background: bg, ...style }}>
    {children}
  </div>
);

const InfoBox = ({ children, color = p.blue, icon = "ℹ" }) => (
  <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 8, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start", marginTop: 12 }}>
    <span style={{ color, fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
    <div style={{ color: p.textDim, fontSize: 13, lineHeight: 1.7 }}>{children}</div>
  </div>
);

const Code = ({ children }) => (
  <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: p.cyan, background: `${p.cyan}12`, padding: "1px 6px", borderRadius: 4 }}>
    {children}
  </code>
);

const SectionTitle = ({ children }) => (
  <h3 style={{ color: p.text, fontWeight: 700, fontSize: 15, marginBottom: 12, marginTop: 28, display: "flex", alignItems: "center", gap: 8 }}>
    {children}
  </h3>
);

/* ── SVG Sequence Diagram Engine ── */

const SeqDiagram = ({ actors, messages, height = 440, title }) => {
  const COL_SPACING = 190;
  const START_X = 90;
  const ACTOR_Y = 16;
  const ACTOR_H = 34;
  const LINE_START = ACTOR_Y + ACTOR_H;
  const LINE_END = height - 16;
  const MSG_START = LINE_START + 28;
  const MSG_SPACING = (LINE_END - MSG_START - 10) / Math.max(messages.length, 1);
  const svgWidth = START_X + (actors.length - 1) * COL_SPACING + 80;

  return (
    <div style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 10, padding: "16px", overflowX: "auto" }}>
      {title && <div style={{ color: p.textMuted, fontSize: 12, fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</div>}
      <svg viewBox={`0 0 ${svgWidth} ${height}`} style={{ width: "100%", minWidth: svgWidth, fontFamily: "'IBM Plex Sans', sans-serif" }}>
        {/* Actor boxes + lifelines */}
        {actors.map((a, i) => {
          const x = START_X + i * COL_SPACING;
          return (
            <g key={i}>
              <rect x={x - 62} y={ACTOR_Y} width={124} height={ACTOR_H} rx={6}
                fill={`${a.color}18`} stroke={a.color} strokeWidth={1.5} />
              <text x={x} y={ACTOR_Y + 21} textAnchor="middle" fill={a.color}
                fontSize={11} fontWeight="700">{a.label}</text>
              {a.sublabel && (
                <text x={x} y={ACTOR_Y + 33} textAnchor="middle" fill={p.textMuted} fontSize={9}>{a.sublabel}</text>
              )}
              <line x1={x} y1={LINE_START} x2={x} y2={LINE_END}
                stroke={`${a.color}40`} strokeWidth={1.5} strokeDasharray="5,4" />
            </g>
          );
        })}

        {/* Messages */}
        {messages.map((m, i) => {
          const fromX = START_X + m.from * COL_SPACING;
          const toX = START_X + m.to * COL_SPACING;
          const y = MSG_START + i * MSG_SPACING;
          const goRight = toX > fromX;
          const arrowTip = goRight ? toX - 2 : toX + 2;
          const dir = goRight ? 1 : -1;
          const midX = (fromX + toX) / 2;
          const isDashed = m.type === "response" || m.type === "dashed";
          const msgColor = m.color || actors[m.from].color;
          const self = m.from === m.to;

          if (self) {
            const loopX = fromX + 50;
            return (
              <g key={i}>
                <path d={`M ${fromX} ${y} C ${loopX} ${y}, ${loopX} ${y + 28}, ${fromX} ${y + 28}`}
                  fill="none" stroke={msgColor} strokeWidth={1.5} strokeDasharray={isDashed ? "5,3" : "none"} />
                <polygon points={`${fromX},${y + 28} ${fromX + 8},${y + 20} ${fromX - 2},${y + 20}`} fill={msgColor} />
                <text x={loopX + 8} y={y + 10} fill={p.text} fontSize={10} fontWeight="600">{m.label}</text>
                {m.sub && <text x={loopX + 8} y={y + 22} fill={p.textMuted} fontSize={9}>{m.sub}</text>}
              </g>
            );
          }

          return (
            <g key={i}>
              <line x1={fromX} y1={y} x2={arrowTip} y2={y}
                stroke={msgColor} strokeWidth={1.5} strokeDasharray={isDashed ? "5,3" : "none"} />
              <polygon points={`${arrowTip},${y} ${arrowTip - dir * 10},${y - 4} ${arrowTip - dir * 10},${y + 4}`}
                fill={msgColor} />
              <text x={midX} y={y - 6} textAnchor="middle" fill={p.text} fontSize={10} fontWeight="600">{m.label}</text>
              {m.sub && <text x={midX} y={y + 13} textAnchor="middle" fill={p.textMuted} fontSize={9}>{m.sub}</text>}
              {m.note && (
                <text x={midX} y={y + 23} textAnchor="middle" fill={msgColor} fontSize={8} fontStyle="italic">{m.note}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SECTION 1 — OVERVIEW
═══════════════════════════════════════════════ */

const OverviewSection = () => (
  <div>
    <p style={{ color: p.textDim, lineHeight: 1.8, marginBottom: 20 }}>
      <strong style={{ color: p.accent }}>NTLM (NT LAN Manager)</strong> is Microsoft's proprietary{" "}
      <strong style={{ color: p.text }}>challenge-response authentication protocol</strong>. The password is never sent
      over the wire — instead, the client proves it knows the password by computing a response to a server-issued challenge
      using a hash derived from the password.
    </p>

    {/* Stats bar */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
      {[
        { label: "Messages", value: "3 (Negotiate → Challenge → Authenticate)", icon: "✉" },
        { label: "Credential transport", value: "Hash response — password never sent", icon: "🔐" },
        { label: "Mutual auth", value: "No (NTLMv2 doesn't verify server)", icon: "⚠" },
        { label: "Protocol type", value: "Sub-protocol, carried by SMB/HTTP/LDAP", icon: "🔌" },
      ].map((s, i) => (
        <Card key={i} color={p.accent} style={{ padding: 16 }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
          <div style={{ color: p.accent, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{s.label}</div>
          <div style={{ color: p.textDim, fontSize: 11, lineHeight: 1.5 }}>{s.value}</div>
        </Card>
      ))}
    </div>

    <SectionTitle>NTLM Versions</SectionTitle>
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
      {[
        {
          version: "LM (LAN Manager)", color: p.red, status: "Obsolete",
          hash: "Two 7-char DES keys from uppercase password. Trivially crackable.",
          used: "Windows 9x era. Disabled on all modern systems.",
        },
        {
          version: "NTLMv1", color: p.orange, status: "Legacy / Avoid",
          hash: "MD4(UTF-16LE(password)) = NT hash. 24-byte DES response to 8-byte challenge. Weak — no client challenge.",
          used: "Still negotiated by some legacy systems. Disable via group policy.",
        },
        {
          version: "NTLMv2", color: p.green, status: "Current Standard",
          hash: "HMAC-MD5(NT hash, username+target) keyed. Response includes client challenge + timestamp + target info. Prevents precomputed attacks.",
          used: "Default since Windows Vista. Used when Kerberos unavailable.",
        },
      ].map((v, i) => (
        <Card key={i} color={v.color} style={{ padding: "12px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ color: v.color, fontWeight: 700, fontSize: 13 }}>{v.version}</div>
            <span style={{ padding: "2px 8px", borderRadius: 10, background: `${v.color}20`, color: v.color, fontSize: 10, fontWeight: 700 }}>{v.status}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 8, fontSize: 12 }}>
            <div style={{ color: p.textMuted }}>Hash/Response:</div>
            <div style={{ color: p.textDim }}>{v.hash}</div>
            <div style={{ color: p.textMuted }}>Used in:</div>
            <div style={{ color: p.textDim }}>{v.used}</div>
          </div>
        </Card>
      ))}
    </div>

    <SectionTitle>When is NTLM Used? (Kerberos Fallback)</SectionTitle>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
      {[
        { icon: "🌐", title: "IP-based connections", desc: "Client connects by IP address instead of hostname — Kerberos can't build an SPN, so NTLM is used." },
        { icon: "💻", title: "Non-domain machines", desc: "Workgroup computers or devices not joined to Active Directory can't get Kerberos tickets." },
        { icon: "🔗", title: "Local accounts", desc: "Authenticating with a local SAM account (not domain account) always uses NTLM." },
        { icon: "🌲", title: "Cross-forest (no Kerberos trust)", desc: "External forest with no Kerberos trust configured — NTLM passthrough auth is used instead." },
        { icon: "⏱", title: "KDC unreachable", desc: "If the Domain Controller / KDC is temporarily unreachable, Windows may fall back to NTLM." },
        { icon: "🖥", title: "Certain legacy apps", desc: "Older IIS apps, older SMB clients, some databases configured to request NTLM specifically." },
      ].map((item, i) => (
        <Card key={i} color={p.border} style={{ padding: "12px 14px" }}>
          <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
          <div style={{ color: p.text, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>{item.title}</div>
          <div style={{ color: p.textDim, fontSize: 11, lineHeight: 1.5 }}>{item.desc}</div>
        </Card>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   SECTION 2 — PORTS & TRANSPORT
═══════════════════════════════════════════════ */

const PortsSection = () => (
  <div>
    <p style={{ color: p.textDim, lineHeight: 1.8, marginBottom: 20 }}>
      NTLM is <strong style={{ color: p.text }}>not a standalone network protocol with its own port</strong>.
      It is an <em>authentication mechanism</em> that is carried <em>inside</em> other protocols. Think of NTLM as the
      authentication handshake embedded within the connection of another service.
    </p>

    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
      {[
        {
          protocol: "SMB (Server Message Block)",
          ports: ["TCP 445", "TCP 139 (NetBIOS-SSN, legacy)"],
          color: p.accent,
          use: "File sharing, printer sharing, named pipes, DCE/RPC over named pipes",
          ntlmRole: "NTLM or Kerberos used for the initial SMB session setup (NTLM in NTLMSSP sub-protocol within SMB negotiate)",
          notes: "TCP 445 is the modern direct SMB port. TCP 139 relies on NetBIOS over TCP/IP (NBT). Always prefer 445.",
        },
        {
          protocol: "HTTP / HTTPS",
          ports: ["TCP 80 (HTTP)", "TCP 443 (HTTPS)"],
          color: p.blue,
          use: "IIS web apps, Exchange, SharePoint, RD Web, REST APIs with Windows Auth",
          ntlmRole: "WWW-Authenticate: NTLM or WWW-Authenticate: Negotiate (SPNEGO) headers carry the NTLM tokens",
          notes: "Negotiate is preferred — it tries Kerberos first and falls back to NTLM automatically.",
        },
        {
          protocol: "LDAP / LDAPS",
          ports: ["TCP 389 (LDAP)", "TCP 636 (LDAPS)", "TCP 3268 (GC)", "TCP 3269 (GC over TLS)"],
          color: p.purple,
          use: "Active Directory queries, directory binds, LDAP authentication",
          ntlmRole: "NTLM carried as SASL (Simple Authentication and Security Layer) mechanism. Client sends LDAP Bind Request with saslMechanism = GSS-SPNEGO or NTLM",
          notes: "LDAP Simple Bind sends credentials in cleartext — always use LDAPS (636) or require signing/sealing.",
        },
        {
          protocol: "DCE/RPC (Remote Procedure Calls)",
          ports: ["TCP 135 (Endpoint Mapper)", "Dynamic: 49152–65535 (high ports)"],
          color: p.cyan,
          use: "Netlogon secure channel, domain trust operations, AD replication, NTLM passthrough auth",
          ntlmRole: "NTLM carried inside the DCE/RPC authentication negotiation. Netlogon (NL_Auth) uses NTLM for the secure channel establishment",
          notes: "The Netlogon secure channel over RPC is how member servers pass NTLM auth to DCs for validation.",
        },
        {
          protocol: "MS-SQL / MSSQL",
          ports: ["TCP 1433 (default)", "UDP 1434 (SQL Browser)"],
          color: p.orange,
          use: "Database connections with Windows Authentication (Integrated Security=SSPI)",
          ntlmRole: "TDS (Tabular Data Stream) protocol carries NTLM SSPI tokens in SSPI login packets",
          notes: "SSPI (Security Support Provider Interface) = Windows abstraction layer over NTLM/Kerberos.",
        },
      ].map((item, i) => (
        <Card key={i} color={item.color}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 auto" }}>
              <div style={{ color: item.color, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{item.protocol}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {item.ports.map((port, j) => (
                  <span key={j} style={{ padding: "3px 10px", borderRadius: 16, background: `${item.color}18`, border: `1px solid ${item.color}35`, color: item.color, fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{port}</span>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: "4px 12px", fontSize: 12 }}>
                <div style={{ color: p.textMuted }}>Use:</div>
                <div style={{ color: p.textDim }}>{item.use}</div>
                <div style={{ color: p.textMuted }}>NTLM role:</div>
                <div style={{ color: p.textDim }}>{item.ntlmRole}</div>
                <div style={{ color: p.textMuted }}>Notes:</div>
                <div style={{ color: p.textDim }}>{item.notes}</div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>

    <InfoBox color={p.yellow} icon="💡">
      <strong>Key insight:</strong> Firewall rules for NTLM authentication must account for the <em>carrier protocol's</em> port — not a separate NTLM port.
      If you're blocking NTLM for SMB, you block TCP 445. For LDAP NTLM, you control TCP 389/636.
      The Netlogon passthrough auth (used for cross-domain NTLM) requires TCP 135 + dynamic RPC ports to the Domain Controller.
    </InfoBox>
  </div>
);

/* ═══════════════════════════════════════════════
   SECTION 3 — NTLM AUTH FLOW
═══════════════════════════════════════════════ */

const NTLMFlowSection = () => {
  const [scenario, setScenario] = useState("local");

  const localActors = [
    { label: "Client", sublabel: "Domain Member", color: p.blue },
    { label: "Resource Server", sublabel: "Domain Member", color: p.green },
    { label: "Domain Controller", sublabel: "DC (Same Domain)", color: p.accent },
  ];

  const localMessages = [
    { from: 0, to: 1, label: "1. NEGOTIATE_MESSAGE", sub: "NTLMSSP flags + client OS version" },
    { from: 1, to: 0, label: "2. CHALLENGE_MESSAGE", sub: "8-byte ServerChallenge + TargetInfo", type: "response", color: p.green },
    { from: 0, to: 0, label: "Compute NTLMv2 response", sub: "HMAC-MD5(NT-hash, Challenge+ClientChallenge+Timestamp+TargetInfo)" },
    { from: 0, to: 1, label: "3. AUTHENTICATE_MESSAGE", sub: "NTLMv2 response + Domain + Username + Workstation" },
    { from: 1, to: 2, label: "4. NetLogon PassThrough (RPC)", sub: "Forwards AUTHENTICATE to DC for validation", color: p.cyan },
    { from: 2, to: 2, label: "Validate: recompute NTLMv2", sub: "DC uses stored NT hash from AD", type: "dashed" },
    { from: 2, to: 1, label: "5. Auth Result + Session Key", sub: "Success + PAC (group memberships)", type: "response", color: p.accent },
    { from: 1, to: 0, label: "6. Access granted / denied", sub: "Resource applies PAC group info for authz", type: "response", color: p.green },
  ];

  const crossDomainActors = [
    { label: "Client", sublabel: "Domain A", color: p.blue },
    { label: "Server", sublabel: "Domain B Member", color: p.green },
    { label: "DC-B", sublabel: "Domain B DC", color: p.accent },
    { label: "DC-A", sublabel: "Domain A DC", color: p.purple },
  ];

  const crossDomainMessages = [
    { from: 0, to: 1, label: "1. NEGOTIATE", sub: "Client initiates NTLM" },
    { from: 1, to: 0, label: "2. CHALLENGE", sub: "Server sends challenge", type: "response", color: p.green },
    { from: 0, to: 1, label: "3. AUTHENTICATE", sub: "NTLMv2 response (Domain A user)" },
    { from: 1, to: 2, label: "4. NetLogon Passthrough", sub: "Server B asks DC-B to validate", color: p.cyan },
    { from: 2, to: 3, label: "5. Passthrough Auth (trust)", sub: "DC-B sees Domain A user → forwards to DC-A via Netlogon secure channel", color: p.orange },
    { from: 3, to: 3, label: "DC-A validates NTLMv2", sub: "Recomputes using Domain A's NT hash store", type: "dashed" },
    { from: 3, to: 2, label: "6. Auth Result + PAC", sub: "Domain A confirms user identity + groups", type: "response", color: p.purple },
    { from: 2, to: 1, label: "7. Forward Result", sub: "DC-B passes result back to Server B", type: "response", color: p.accent },
    { from: 1, to: 0, label: "8. Access Response", sub: "Resource grants/denies based on PAC", type: "response", color: p.green },
  ];

  const scenarios = {
    local: { actors: localActors, messages: localMessages, title: "Same-Domain NTLM Authentication", height: 520 },
    crossdomain: { actors: crossDomainActors, messages: crossDomainMessages, title: "Cross-Domain NTLM (Passthrough Auth)", height: 590 },
  };

  const current = scenarios[scenario];

  return (
    <div>
      <p style={{ color: p.textDim, lineHeight: 1.8, marginBottom: 20 }}>
        NTLM uses a <strong style={{ color: p.text }}>3-message challenge-response</strong>: Negotiate → Challenge → Authenticate.
        The password is never transmitted — only an HMAC-MD5 hash response that can only be computed by someone who knows the NT hash.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { id: "local", label: "Same-Domain" },
          { id: "crossdomain", label: "Cross-Domain (Passthrough)" },
        ].map(s => (
          <button key={s.id} onClick={() => setScenario(s.id)} style={{
            padding: "8px 20px", borderRadius: 8,
            border: `1.5px solid ${scenario === s.id ? p.accent : p.border}`,
            background: scenario === s.id ? `${p.accent}15` : "transparent",
            color: scenario === s.id ? p.accent : p.textMuted,
            cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
          }}>{s.label}</button>
        ))}
      </div>

      <SeqDiagram actors={current.actors} messages={current.messages} height={current.height} title={current.title} />

      <SectionTitle>NTLMv2 Response — How It's Computed</SectionTitle>
      <Card color={p.accent} bg={p.bg} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { step: "1", label: "NT Hash", formula: "MD4(UTF-16LE(password))", color: p.blue, note: "This 16-byte hash is what's stored in AD / SAM. Never changes unless password changes." },
            { step: "2", label: "NTLMv2 Hash (session base key)", formula: "HMAC-MD5(NT_hash, uppercase(username) + uppercase(target_domain))", color: p.purple, note: "Binds the response to the specific username and domain." },
            { step: "3", label: "NTLMv2 Response (blob)", formula: "HMAC-MD5(NTLMv2_hash, ServerChallenge + NTProofStr_blob)", color: p.green, note: "The blob contains: ClientChallenge (8 bytes random) + Timestamp + TargetInfo (DNS name, NetBIOS name, etc.)\nThis is what's sent in AUTHENTICATE_MESSAGE." },
          ].map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 12, alignItems: "start" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${item.color}20`, border: `2px solid ${item.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: item.color, fontWeight: 700, flexShrink: 0 }}>{item.step}</div>
              <div>
                <div style={{ color: item.color, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.cyan, background: `${p.cyan}10`, borderRadius: 6, padding: "6px 10px", marginBottom: 6, wordBreak: "break-all" }}>{item.formula}</div>
                <div style={{ color: p.textDim, fontSize: 11, lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.note}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <InfoBox color={p.yellow} icon="⚠">
        <strong>No mutual authentication:</strong> In NTLMv2, the <em>client</em> does not verify the server's identity. A rogue server can capture the Authenticate message and relay it elsewhere (NTLM relay attack). Extended Protection for Authentication (EPA) / Channel Binding mitigates this.
      </InfoBox>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SECTION 4 — LDAP BIND & SPNEGO
═══════════════════════════════════════════════ */

const LDAPBindSection = () => {
  const [bindType, setBindType] = useState("spnego");

  const BIND_TYPES = [
    {
      id: "anonymous",
      label: "Anonymous Bind",
      color: p.textMuted,
      icon: "👤",
      desc: "No credentials provided. Grants access to publicly readable LDAP entries only. Most AD environments limit this severely.",
      security: "Low risk on its own. AD allows reading some objects anonymously (rootDSE). Use to discover LDAP server info.",
      packet: "BindRequest { version: 3, name: \"\", authentication: simple(\"\") }",
    },
    {
      id: "simple",
      label: "Simple Bind",
      color: p.red,
      icon: "🔓",
      desc: "Sends DN (Distinguished Name) + password in plaintext in the LDAP Bind Request. Equivalent to HTTP Basic Auth.",
      security: "DANGEROUS over plain TCP 389 — credentials are in cleartext. Only use over LDAPS (636) or with STARTTLS.",
      packet: "BindRequest { version: 3, name: \"CN=alice,DC=corp,DC=com\", authentication: simple(\"P@ssw0rd\") }",
    },
    {
      id: "ntlm-sasl",
      label: "SASL/NTLM Bind",
      color: p.orange,
      icon: "🔐",
      desc: "SASL (Simple Authentication and Security Layer) bind using the NTLM mechanism directly. The 3 NTLM messages are exchanged as LDAP SASL tokens.",
      security: "Hash response — no password in the clear. Still vulnerable to relay attacks. Prefer SPNEGO (which also negotiates encryption).",
      packet: "BindRequest { saslMechanism: \"NTLM\", credentials: <NTLM NEGOTIATE token> }\n→ BindResponse { resultCode: saslBindInProgress, serverSaslCreds: <CHALLENGE> }\n→ BindRequest { saslMechanism: \"NTLM\", credentials: <AUTHENTICATE token> }",
    },
    {
      id: "spnego",
      label: "SASL/GSS-SPNEGO (Negotiate)",
      color: p.green,
      icon: "⚡",
      desc: "The preferred and default method. SPNEGO negotiates the best available mechanism — Kerberos if available, NTLM as fallback. Provides encryption (sealing) and signing.",
      security: "Best option. Kerberos provides mutual auth + session encryption. If NTLM is selected, signing and sealing protect against relay.",
      packet: "BindRequest { saslMechanism: \"GSS-SPNEGO\", credentials: <SPNEGO InitialContextToken> }\nThe InitialContextToken offers: [Kerberos5 (preferred), NTLM (fallback)]\nServer selects Kerberos if it has a valid SPN. Falls back to NTLM.",
    },
    {
      id: "gssapi",
      label: "SASL/GSSAPI (Kerberos only)",
      color: p.purple,
      icon: "🎫",
      desc: "SASL with GSSAPI mechanism directly requests Kerberos. Unlike SPNEGO, no NTLM fallback — if Kerberos fails, the bind fails.",
      security: "Strongest option when Kerberos is guaranteed. Provides mutual authentication, integrity, and confidentiality.",
      packet: "BindRequest { saslMechanism: \"GSSAPI\", credentials: <Kerberos AP-REQ token> }",
    },
  ];

  const selected = BIND_TYPES.find(b => b.id === bindType);

  const spnegoActors = [
    { label: "LDAP Client", color: p.blue },
    { label: "Domain Controller", sublabel: "LDAP Server", color: p.accent },
  ];

  const spnegoMessages = [
    { from: 0, to: 1, label: "TCP Connect (port 389 / 636)" },
    { from: 0, to: 1, label: "LDAP Bind Req: GSS-SPNEGO", sub: "InitialContextToken: [Kerberos (preferred), NTLM]" },
    { from: 1, to: 1, label: "Check: can satisfy Kerberos?", sub: "Does the server have a valid SPN + keytab?", type: "dashed" },
    { from: 1, to: 0, label: "A) Kerberos selected", sub: "NegTokenResp → negState: acceptIncomplete, mech: Kerberos", type: "response", color: p.green },
    { from: 0, to: 1, label: "A) AP-REQ (Kerberos ticket)", sub: "Client presents service ticket from KDC" },
    { from: 1, to: 0, label: "A) Bind Success + AP-REP", sub: "Mutual auth confirmed — session established", type: "response", color: p.green },
  ];

  const ntlmFallbackMessages = [
    { from: 0, to: 1, label: "LDAP Bind Req: GSS-SPNEGO", sub: "InitialContextToken: [Kerberos, NTLM]" },
    { from: 1, to: 0, label: "B) NTLM selected (fallback)", sub: "NegTokenResp → negState: acceptIncomplete, mech: NTLM", type: "response", color: p.orange },
    { from: 0, to: 1, label: "B) NTLM NEGOTIATE embedded", sub: "In SPNEGO NegTokenResp" },
    { from: 1, to: 0, label: "B) NTLM CHALLENGE", sub: "Server sends 8-byte challenge", type: "response", color: p.orange },
    { from: 0, to: 1, label: "B) NTLM AUTHENTICATE", sub: "NTLMv2 response embedded in SPNEGO" },
    { from: 1, to: 0, label: "B) Bind Success (saslOK)", sub: "LDAP session established with NTLM auth", type: "response", color: p.orange },
  ];

  return (
    <div>
      <p style={{ color: p.textDim, lineHeight: 1.8, marginBottom: 20 }}>
        LDAP offers multiple authentication mechanisms at the <strong style={{ color: p.text }}>Bind</strong> operation level.
        The mechanism greatly affects security — from cleartext Simple Bind to the fully negotiated SPNEGO which
        selects between Kerberos and NTLM automatically.
      </p>

      <SectionTitle>LDAP Bind Types</SectionTitle>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {BIND_TYPES.map(b => (
          <button key={b.id} onClick={() => setBindType(b.id)} style={{
            padding: "7px 14px", borderRadius: 8,
            border: `1.5px solid ${bindType === b.id ? b.color : p.border}`,
            background: bindType === b.id ? `${b.color}15` : "transparent",
            color: bindType === b.id ? b.color : p.textMuted,
            cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600, transition: "all 0.15s",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <span>{b.icon}</span> {b.label}
          </button>
        ))}
      </div>

      <Card color={selected.color} style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>{selected.icon}</span>
          <div style={{ color: selected.color, fontWeight: 700, fontSize: 14 }}>{selected.label}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "8px 16px", fontSize: 13, marginBottom: 12 }}>
          <div style={{ color: p.textMuted }}>How:</div>
          <div style={{ color: p.textDim, lineHeight: 1.7 }}>{selected.desc}</div>
          <div style={{ color: p.textMuted }}>Security:</div>
          <div style={{ color: p.textDim, lineHeight: 1.7 }}>{selected.security}</div>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.cyan, background: p.bg, borderRadius: 6, padding: "10px 14px", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
          {selected.packet}
        </div>
      </Card>

      <SectionTitle>SPNEGO / "Negotiate" — How It Works</SectionTitle>
      <p style={{ color: p.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
        <strong style={{ color: p.text }}>SPNEGO</strong> (Simple and Protected GSSAPI Negotiation Mechanism — RFC 4178)
        is the protocol behind the <Code>Negotiate</Code> HTTP auth header and <Code>GSS-SPNEGO</Code> SASL mechanism in LDAP.
        It negotiates the authentication protocol so both sides use the strongest mutually supported option.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ color: p.green, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Path A: Kerberos Selected</div>
          <SeqDiagram actors={spnegoActors} messages={spnegoMessages} height={360} />
        </div>
        <div>
          <div style={{ color: p.orange, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Path B: NTLM Fallback</div>
          <SeqDiagram actors={spnegoActors} messages={ntlmFallbackMessages} height={360} />
        </div>
      </div>

      <InfoBox color={p.blue} icon="ℹ">
        <strong>Negotiate vs NTLM directly:</strong> When a client sends <Code>Authorization: NTLM &lt;token&gt;</Code> it's forcing NTLM.
        When it sends <Code>Authorization: Negotiate &lt;token&gt;</Code> it's using SPNEGO — which will use Kerberos if the server has a valid SPN
        (e.g., <Code>HTTP/webserver.corp.com</Code>). Always prefer Negotiate for flexibility and Kerberos auto-selection.
      </InfoBox>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SECTION 5 — CROSS-DOMAIN & CROSS-FOREST
═══════════════════════════════════════════════ */

const CrossDomainSection = () => {
  const [topic, setTopic] = useState("cross-domain");

  const TOPICS = {
    "cross-domain": {
      label: "Cross-Domain NTLM",
      color: p.cyan,
      content: (
        <div>
          <p style={{ color: p.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
            Within the <strong style={{ color: p.text }}>same AD forest</strong>, domains have implicit two-way Kerberos trusts.
            NTLM passthrough still works when needed (e.g. IP-based connections). Here's what happens when a Domain A user
            authenticates to a server in Domain B using NTLM:
          </p>
          <SeqDiagram
            height={520}
            actors={[
              { label: "Client", sublabel: "Domain A User", color: p.blue },
              { label: "Server", sublabel: "Domain B Member", color: p.green },
              { label: "DC-B", sublabel: "Domain B DC", color: p.accent },
              { label: "DC-A", sublabel: "Domain A DC", color: p.purple },
            ]}
            messages={[
              { from: 0, to: 1, label: "NTLM NEGOTIATE" },
              { from: 1, to: 0, label: "NTLM CHALLENGE (ServerChallenge)", type: "response", color: p.green },
              { from: 0, to: 1, label: "NTLM AUTHENTICATE (NTLMv2 response, DOMAIN=CORP-A)" },
              { from: 1, to: 2, label: "NetLogon: NetrLogonSamLogon (RPC)", sub: "Server B forwards auth request to its DC", color: p.cyan },
              { from: 2, to: 2, label: "DC-B: unknown domain CORP-A", sub: "Looks up trust → finds Domain A via intra-forest trust", type: "dashed" },
              { from: 2, to: 3, label: "NetLogon Passthrough (trust channel)", sub: "DC-B forwards AUTHENTICATE to DC-A via secure RPC channel", color: p.orange },
              { from: 3, to: 3, label: "DC-A validates NTLMv2", sub: "Uses NT hash from AD + rebuilds response to verify", type: "dashed" },
              { from: 3, to: 2, label: "Auth result + PAC (groups from Domain A)", type: "response", color: p.purple },
              { from: 2, to: 1, label: "NetLogon response → authorized", type: "response", color: p.accent },
              { from: 1, to: 0, label: "Access granted/denied", type: "response", color: p.green },
            ]}
          />
          <InfoBox color={p.cyan} icon="ℹ">
            The <strong>Netlogon secure channel</strong> between DC-B and DC-A is established using the trust account credentials.
            It uses its own authentication (MSCHAPv2-like mechanism) to secure the channel before passing NTLM tokens through it.
          </InfoBox>
        </div>
      ),
    },
    "cross-forest": {
      label: "Cross-Forest NTLM",
      color: p.purple,
      content: (
        <div>
          <p style={{ color: p.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
            <strong style={{ color: p.text }}>Cross-forest NTLM</strong> requires an explicit forest trust. The passthrough chain extends further:
            through the entire domain path to the forest root, then across the forest trust link.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {[
              {
                title: "With Forest Trust — NTLM Passthrough",
                color: p.green,
                steps: [
                  "User in Forest A authenticates to resource in Forest B",
                  "Server B passes AUTHENTICATE to DC-B via NetLogon",
                  "DC-B cannot validate — routes to Domain B forest root DC",
                  "Forest B root DC sends via forest trust link to Forest A root DC",
                  "Forest A root DC routes to the user's domain DC",
                  "User's DC validates + returns result back up the chain",
                  "Entire chain returns result to Server B",
                ],
              },
              {
                title: "Without Forest Trust — NTLM Fails",
                color: p.red,
                steps: [
                  "User in Forest A authenticates to resource in Forest B",
                  "Server B passes AUTHENTICATE to DC-B",
                  "DC-B has no trust path to Forest A",
                  "DC-B returns: STATUS_NO_LOGON_SERVERS or logon failure",
                  "Server B denies access — authentication fails",
                  "(External trust between specific domains can also work if configured)",
                ],
              },
            ].map((item, i) => (
              <Card key={i} color={item.color}>
                <div style={{ color: item.color, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>{item.title}</div>
                <ol style={{ paddingLeft: 16, margin: 0, color: p.textDim, fontSize: 11, lineHeight: 1.9 }}>
                  {item.steps.map((s, j) => <li key={j}>{s}</li>)}
                </ol>
              </Card>
            ))}
          </div>
          <InfoBox color={p.yellow} icon="⚠">
            <strong>Performance note:</strong> Cross-forest NTLM passthrough can traverse many DCs (one per domain in the chain).
            This adds latency and points of failure. Kerberos cross-forest auth (with forest trust) is more efficient.
            Prefer Kerberos + SPN-based connections for cross-forest scenarios.
          </InfoBox>
        </div>
      ),
    },
    "ldap-crossdomain": {
      label: "LDAP Cross-Domain Queries",
      color: p.blue,
      content: (
        <div>
          <p style={{ color: p.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
            Can LDAP query objects across domains? Yes — multiple mechanisms exist, each with different capabilities:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {[
              {
                method: "Global Catalog (GC) — Port 3268 / 3269",
                color: p.green,
                desc: "The Global Catalog holds a partial replica of every object in the entire AD forest. Query port 3268 (or 3269 for TLS) to search across all domains without referrals. Only a subset of attributes is replicated to the GC (those marked as Is-Member-Of-Partial-Attribute-Set).",
                use: "Best for: finding users/groups across the whole forest, user login UPN lookup, group membership lookups.",
              },
              {
                method: "LDAP Referrals",
                color: p.blue,
                desc: "When querying a DC about an object in another domain, it returns an LDAP referral (resultCode=10) pointing to the correct domain's DC. The client then follows the referral and connects to the target DC. Requires trust + proper DNS.",
                use: "Transparent if your LDAP client follows referrals automatically. Some clients don't — check your LDAP library settings.",
              },
              {
                method: "Direct DC Query",
                color: p.purple,
                desc: "Connect directly to the target domain's DC (DNS name or IP) and bind with appropriate cross-domain credentials. With trusts established, a Domain A credential can bind to Domain B's DC using NTLM passthrough or Kerberos cross-domain ticket.",
                use: "Explicit cross-domain admin tasks, replication monitoring, etc.",
              },
              {
                method: "Chase Referrals (LDAP subtree)",
                color: p.cyan,
                desc: "Starting from the forest root or a parent domain, use a subtree search. The DC will generate referrals for child domains. Client must be configured to follow these referrals automatically.",
                use: "Forest-wide subtree searches from a single bind point.",
              },
            ].map((item, i) => (
              <Card key={i} color={item.color} style={{ padding: "12px 16px" }}>
                <div style={{ color: item.color, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{item.method}</div>
                <div style={{ color: p.textDim, fontSize: 12, lineHeight: 1.7, marginBottom: 6 }}>{item.desc}</div>
                <div style={{ fontSize: 11, color: p.textMuted }}><strong style={{ color: item.color }}>Best for: </strong>{item.use}</div>
              </Card>
            ))}
          </div>
          <InfoBox color={p.blue} icon="ℹ">
            <strong>Authentication for cross-domain LDAP:</strong> Once you're bound to the target DC (either via referral or direct connection),
            the authentication itself uses NTLM passthrough (if NTLM) or a cross-domain Kerberos service ticket (if Kerberos).
            The trust relationship enables both mechanisms across domains.
          </InfoBox>
        </div>
      ),
    },
  };

  const current = TOPICS[topic];

  return (
    <div>
      <p style={{ color: p.textDim, lineHeight: 1.8, marginBottom: 20 }}>
        NTLM supports cross-domain and cross-forest authentication through a{" "}
        <strong style={{ color: p.text }}>passthrough authentication</strong> mechanism.
        The resource server delegates validation to its DC, which then routes the request to the user's DC via trust links.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.entries(TOPICS).map(([id, t]) => (
          <button key={id} onClick={() => setTopic(id)} style={{
            padding: "8px 18px", borderRadius: 8,
            border: `1.5px solid ${topic === id ? t.color : p.border}`,
            background: topic === id ? `${t.color}15` : "transparent",
            color: topic === id ? t.color : p.textMuted,
            cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>
      <div key={topic} style={{ animation: "fadeSlideUp 0.3s ease both" }}>
        {current.content}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SECTION 6 — SECURITY & MITIGATIONS
═══════════════════════════════════════════════ */

const SecuritySection = () => (
  <div>
    <p style={{ color: p.textDim, lineHeight: 1.8, marginBottom: 20 }}>
      NTLM has significant security weaknesses compared to Kerberos. Understanding the attack surface helps you apply
      the right mitigations and move toward disabling NTLM where possible.
    </p>

    <SectionTitle>Attack Vectors</SectionTitle>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
      {[
        {
          attack: "NTLM Relay Attack",
          severity: "Critical",
          color: p.red,
          icon: "⚡",
          how: "Attacker intercepts a client's NTLM NEGOTIATE message, relays it to a different server, relays the CHALLENGE back, then relays the AUTHENTICATE message. The attacker authenticates to the second server AS the victim — without knowing the password.",
          mitigations: ["SMB Signing (required): prevents relay to SMB", "LDAP Signing + Channel Binding: prevents relay to LDAP", "EPA (Extended Protection for Auth): binds NTLM to TLS channel — relay fails if TLS differs", "Disable NTLM and enforce Kerberos where possible"],
        },
        {
          attack: "Pass-the-Hash (PtH)",
          severity: "High",
          color: p.orange,
          icon: "🔑",
          how: "NTLM authentication only requires the NT hash — not the plaintext password. If an attacker dumps LSASS memory (using Mimikatz etc.) and extracts the NT hash, they can authenticate as that user to any NTLM-accepting service.",
          mitigations: ["Credential Guard (virtualization-based security for LSASS)", "Protected Users security group: prevents NTLM auth for protected accounts", "Disable NTLM", "Least privilege: limit who can log on to servers interactively"],
        },
        {
          attack: "NTLM Downgrade",
          severity: "Medium",
          color: p.yellow,
          icon: "⬇",
          how: "A MitM attacker manipulates the SPNEGO negotiation to remove Kerberos from the offer list, forcing NTLM to be selected. The weaker NTLM auth is then relayed or attacked.",
          mitigations: ["Require Kerberos via Group Policy (network security: restrict NTLM)", "Require Kerberos authentication for specific services via SPN", "Use TLS mutual authentication to prevent MitM"],
        },
        {
          attack: "Brute-force / Cracking NTLMv2 Hashes",
          severity: "Medium",
          color: p.yellow,
          icon: "💥",
          how: "NTLMv2 Challenge-Response hashes captured during relay attacks (or via Responder.py on the network) can be cracked offline. The hash is computed from the NT hash — which can be brute-forced if the password is weak.",
          mitigations: ["Strong password policy (length > 15 chars)", "Block NTLM where not needed (Responder fails if NTLM is disabled)", "Monitor for unusual NTLM auth events (Event ID 4776)"],
        },
      ].map((item, i) => (
        <Card key={i} color={item.color}>
          <div style={{ display: "flex", align: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <div style={{ color: item.color, fontWeight: 700, fontSize: 13 }}>{item.attack}</div>
            <span style={{ padding: "2px 8px", borderRadius: 10, background: `${item.color}20`, color: item.color, fontSize: 10, fontWeight: 700 }}>Severity: {item.severity}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: "8px 12px", fontSize: 12 }}>
            <div style={{ color: p.textMuted }}>How it works:</div>
            <div style={{ color: p.textDim, lineHeight: 1.7 }}>{item.how}</div>
            <div style={{ color: p.textMuted }}>Mitigations:</div>
            <ul style={{ margin: 0, paddingLeft: 16, color: p.textDim, lineHeight: 1.9 }}>
              {item.mitigations.map((m, j) => <li key={j}>{m}</li>)}
            </ul>
          </div>
        </Card>
      ))}
    </div>

    <SectionTitle>Recommended Group Policy Settings</SectionTitle>
    <div style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: p.surfaceAlt }}>
            <th style={{ padding: "10px 14px", textAlign: "left", color: p.textMuted, borderBottom: `1px solid ${p.border}` }}>Group Policy Setting</th>
            <th style={{ padding: "10px 14px", textAlign: "left", color: p.textMuted, borderBottom: `1px solid ${p.border}` }}>Recommended Value</th>
            <th style={{ padding: "10px 14px", textAlign: "left", color: p.textMuted, borderBottom: `1px solid ${p.border}` }}>Effect</th>
          </tr>
        </thead>
        <tbody>
          {[
            { setting: "Network security: LAN Manager authentication level", value: "Send NTLMv2 response only. Refuse LM & NTLM", effect: "Disables LM and NTLMv1 entirely — only NTLMv2 allowed" },
            { setting: "Network security: Restrict NTLM: NTLM authentication in this domain", value: "Deny all", effect: "Blocks all NTLM in the domain — requires Kerberos (test carefully)" },
            { setting: "Network security: Restrict NTLM: Add server exceptions in this domain", value: "List servers that still need NTLM", effect: "Allows NTLM only for explicitly listed servers" },
            { setting: "Microsoft network server: Digitally sign communications (always)", value: "Enabled", effect: "Requires SMB signing — prevents NTLM relay to SMB" },
            { setting: "Domain controller: LDAP server signing requirements", value: "Require signing", effect: "Forces LDAP clients to sign — prevents relay to LDAP" },
            { setting: "Domain controller: LDAP server channel binding token requirements", value: "Always", effect: "Requires TLS channel binding — blocks LDAPS relay attacks" },
          ].map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? p.surfaceAlt : "transparent" }}>
              <td style={{ padding: "9px 14px", color: p.textDim, borderBottom: `1px solid ${p.border}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{row.setting}</td>
              <td style={{ padding: "9px 14px", borderBottom: `1px solid ${p.border}` }}><span style={{ color: p.green, fontSize: 11 }}>{row.value}</span></td>
              <td style={{ padding: "9px 14px", color: p.textDim, borderBottom: `1px solid ${p.border}`, fontSize: 11 }}>{row.effect}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <InfoBox color={p.green} icon="✓">
      <strong>Modern stance:</strong> Microsoft now recommends <strong>disabling NTLM entirely</strong> in favor of Kerberos and modern auth.
      Windows Server 2025 and Windows 11 24H2 introduce further NTLM restrictions. Start by auditing NTLM usage
      (Event ID 4776 for NTLM auth), identify which services require it, migrate them to Kerberos, then progressively
      restrict NTLM via Group Policy.
    </InfoBox>
  </div>
);

/* ═══════════════════════════════════════════════
   SECTION REGISTRY + MAIN EXPORT
═══════════════════════════════════════════════ */

const sectionComponents = {
  "overview": OverviewSection,
  "ports": PortsSection,
  "ntlm-flow": NTLMFlowSection,
  "ldap-bind": LDAPBindSection,
  "cross-domain": CrossDomainSection,
  "security": SecuritySection,
};

export default function NTLMGuide() {
  const [activeSection, setActiveSection] = useState("overview");
  const ActiveComponent = sectionComponents[activeSection];

  const navigate = (id) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px", fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif", color: p.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 32 }}>🔐</span>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: p.text, margin: 0 }}>NTLM Authentication</h1>
            <p style={{ fontSize: 13, color: p.textDim, margin: 0 }}>Challenge-Response, LDAP Binds, SPNEGO, Cross-Domain & Security</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 5, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => navigate(s.id)} style={{
            padding: "7px 12px", borderRadius: 8, border: "none",
            background: activeSection === s.id ? p.accent : p.surface,
            color: activeSection === s.id ? "#fff" : p.textDim,
            fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            boxShadow: activeSection === s.id ? `0 2px 10px ${p.accent}50` : "none",
            display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s", fontFamily: "inherit",
          }}>
            <span style={{ fontSize: 13 }}>{s.icon}</span> {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 28 }}>
        <div key={activeSection} style={{ animation: "fadeSlideUp 0.4s ease both" }}>
          <ActiveComponent />
        </div>

        {/* Prev / Next */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 20, borderTop: `1px solid ${p.border}` }}>
          {(() => {
            const idx = SECTIONS.findIndex(s => s.id === activeSection);
            const prev = idx > 0 ? SECTIONS[idx - 1] : null;
            const next = idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;
            return (
              <>
                {prev ? (
                  <button onClick={() => navigate(prev.id)} style={{
                    background: "transparent", border: `1px solid ${p.border}`, borderRadius: 8,
                    padding: "10px 20px", color: p.textDim, cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                  }}>← {prev.label}</button>
                ) : <div />}
                {next && (
                  <button onClick={() => navigate(next.id)} style={{
                    background: `${p.accent}15`, border: `1px solid ${p.accent}40`, borderRadius: 8,
                    padding: "10px 20px", color: p.accent, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                  }}>{next.label} →</button>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
