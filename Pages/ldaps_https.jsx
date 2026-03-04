import { useState } from "react";

const COLORS = {
  bg: "#0a0e1a",
  panel: "#111827",
  panelBorder: "#1e293b",
  accent: "#38bdf8",
  accent2: "#a78bfa",
  accent3: "#34d399",
  warn: "#fbbf24",
  danger: "#f87171",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textMuted: "#64748b",
  line: "#334155",
  highlight: "rgba(56, 189, 248, 0.08)",
};

const actors = {
  ldaps: [
    { id: "ps", label: "PowerShell\nClient", color: COLORS.accent },
    { id: "os", label: "OS TLS\n(SChannel)", color: COLORS.accent2 },
    { id: "dc", label: "Domain Controller\nLDAPS :636", color: COLORS.accent3 },
    { id: "ca", label: "Certificate\nAuthority (CA)", color: COLORS.warn },
    { id: "crl", label: "CRL / OCSP\nEndpoint", color: COLORS.danger },
  ],
  https: [
    { id: "br", label: "Browser /\nHTTPS Client", color: COLORS.accent },
    { id: "os", label: "OS TLS\nLibrary", color: COLORS.accent2 },
    { id: "srv", label: "Web Server\nHTTPS :443", color: COLORS.accent3 },
    { id: "ca", label: "Certificate\nAuthority (CA)", color: COLORS.warn },
    { id: "ocsp", label: "OCSP\nResponder", color: COLORS.danger },
  ],
  tls: [
    { id: "c", label: "Client", color: COLORS.accent },
    { id: "s", label: "Server", color: COLORS.accent3 },
  ],
};

const ldapsSteps = [
  { phase: "TCP + TLS Handshake", color: COLORS.accent },
  { from: 0, to: 2, label: "TCP SYN → port 636", dashed: false, note: "Unlike StartTLS (port 389), LDAPS wraps TLS from the start" },
  { from: 2, to: 0, label: "TCP SYN-ACK", dashed: false },
  { from: 0, to: 2, label: "TCP ACK (3-way done)", dashed: false },
  { from: 0, to: 2, label: "TLS ClientHello (supported ciphers, TLS version, client random)", dashed: false, note: "SChannel sends supported cipher suites, SNI, TLS 1.2/1.3" },
  { from: 2, to: 0, label: "TLS ServerHello (chosen cipher, server random)", dashed: false },
  { from: 2, to: 0, label: "Certificate (DC's cert + chain)", dashed: false, important: true, note: "Server sends its cert signed by your CA. Chain includes intermediate CAs if any." },

  { phase: "Certificate Validation (Client-Side)", color: COLORS.warn },
  { from: 1, to: 1, label: "① Check cert chain → trusted root in local cert store?", dashed: true, self: true, note: "CA public key MUST be in Trusted Root CA store. Without it → connection fails immediately." },
  { from: 1, to: 1, label: "② Validate cert: expiry, SAN/CN matches hostname, key usage", dashed: true, self: true },

  { phase: "CRL / Revocation Check (THE DELAY SOURCE)", color: COLORS.danger },
  { from: 1, to: 1, label: "③ Extract CRL Distribution Point URL from cert", dashed: true, self: true, note: "URL is embedded in the certificate's CDP extension field" },
  { from: 1, to: 1, label: "④ Check local CRL cache — is it still valid (nextUpdate)?", dashed: true, self: true, note: "Windows caches CRLs! Default validity ~1 week. Cached in CryptoAPI URL Cache." },
  { from: 1, to: 4, label: "⑤ CACHE MISS → HTTP GET to CRL endpoint", dashed: true, note: "THIS IS YOUR DELAY. If CA is outside DC, this HTTP call crosses WAN.", important: true },
  { from: 4, to: 1, label: "⑥ CRL file returned (can be large: KBs–MBs)", dashed: true, note: "CRL downloaded, parsed, cached locally. Large CRLs = more delay." },
  { from: 1, to: 1, label: "⑦ Check: is cert serial number in the CRL?", dashed: true, self: true },
  { from: 1, to: 1, label: "Alt: OCSP check (lighter, single cert query)", dashed: true, self: true, note: "If OCSP URL present in cert AIA extension, may be used instead/alongside CRL" },

  { phase: "Key Exchange & Session Establishment", color: COLORS.accent3 },
  { from: 0, to: 2, label: "TLS 1.2: ClientKeyExchange (pre-master secret encrypted w/ server pubkey)", dashed: false, note: "RSA: client encrypts pre-master secret with server's public key from cert" },
  { from: 0, to: 2, label: "TLS 1.3: Key derived via ECDHE (ephemeral keys)", dashed: false, note: "TLS 1.3 uses ephemeral Diffie-Hellman. Forward secrecy guaranteed." },
  { from: 1, to: 1, label: "Both sides derive SESSION KEY from: client random + server random + pre-master", dashed: true, self: true, important: true, note: "Session key is SYMMETRIC (AES-256-GCM etc). All further traffic uses this key." },
  { from: 0, to: 2, label: "ChangeCipherSpec + Finished", dashed: false },
  { from: 2, to: 0, label: "ChangeCipherSpec + Finished", dashed: false },

  { phase: "LDAP Operations (All Encrypted with Session Key)", color: COLORS.accent },
  { from: 0, to: 2, label: "LDAP Bind Request (credentials) — encrypted", dashed: false, note: "Now inside TLS tunnel. Bind can be Simple or SASL." },
  { from: 2, to: 0, label: "LDAP Bind Response (success)", dashed: false },
  { from: 0, to: 2, label: "LDAP Search Request (base DN, filter, scope) — encrypted", dashed: false },
  { from: 2, to: 0, label: "LDAP Search Result Entries — encrypted", dashed: false, note: "All LDAP operations use the symmetric session key. Fast." },
  { from: 0, to: 2, label: "LDAP Unbind / connection close", dashed: false },
];

const httpsSteps = [
  { phase: "DNS + TCP Handshake", color: COLORS.accent },
  { from: 0, to: 2, label: "DNS lookup → resolve hostname to IP", dashed: false, note: "DNS resolution happens first. Can add latency if DNS is slow." },
  { from: 0, to: 2, label: "TCP SYN → port 443", dashed: false },
  { from: 2, to: 0, label: "TCP SYN-ACK", dashed: false },
  { from: 0, to: 2, label: "TCP ACK", dashed: false },

  { phase: "TLS Handshake", color: COLORS.accent2 },
  { from: 0, to: 2, label: "TLS ClientHello (ciphers, ALPN: h2/http1.1, SNI, client random)", dashed: false, note: "SNI tells the server which hostname → correct cert for virtual hosts" },
  { from: 2, to: 0, label: "TLS ServerHello (chosen cipher, server random)", dashed: false },
  { from: 2, to: 0, label: "Certificate (server cert + full chain)", dashed: false, important: true },

  { phase: "Certificate Validation", color: COLORS.warn },
  { from: 1, to: 1, label: "① Chain validation → root in OS/browser trust store?", dashed: true, self: true, note: "Browsers ship with ~150 trusted root CAs. OS also has its own store." },
  { from: 1, to: 1, label: "② Cert checks: expiry, SAN match, CT logs, key usage", dashed: true, self: true, note: "Browsers also check Certificate Transparency (CT) logs" },

  { phase: "OCSP / CRL Revocation Check", color: COLORS.danger },
  { from: 1, to: 1, label: "③ Check for OCSP Staple in ServerHello", dashed: true, self: true, note: "OCSP Stapling: server pre-fetches OCSP response and sends it WITH the cert. No extra round trip!" },
  { from: 1, to: 4, label: "④ No staple → OCSP request to responder (if AIA present)", dashed: true, note: "Live OCSP query adds latency. Some browsers soft-fail if unreachable.", important: true },
  { from: 4, to: 1, label: "⑤ OCSP response: GOOD / REVOKED / UNKNOWN", dashed: true, note: "Response is signed by CA, cached locally (typ. 4-24 hours)" },
  { from: 1, to: 1, label: "⑥ Fallback: CRL check if OCSP unavailable", dashed: true, self: true, note: "CRLs are rarely used in modern HTTPS. Most browsers prefer OCSP or CRLSets." },
  { from: 1, to: 1, label: "Chrome: Uses CRLSets (Google-curated, pre-distributed)", dashed: true, self: true, note: "Chrome rarely does live OCSP. It ships its own revocation data as CRLSets." },

  { phase: "Key Exchange & Session Key", color: COLORS.accent3 },
  { from: 0, to: 2, label: "ECDHE key exchange (ephemeral keys for forward secrecy)", dashed: false, note: "Modern HTTPS almost always uses ECDHE for perfect forward secrecy" },
  { from: 1, to: 1, label: "Derive symmetric SESSION KEY (AES-256-GCM / ChaCha20)", dashed: true, self: true, important: true },
  { from: 0, to: 2, label: "Finished (verify handshake integrity)", dashed: false },
  { from: 2, to: 0, label: "Finished", dashed: false },
  { from: 1, to: 1, label: "TLS 1.3: 1-RTT handshake (or 0-RTT with session resumption)", dashed: true, self: true, note: "TLS 1.3 combines ServerHello + key exchange in one flight. Much faster." },

  { phase: "HTTP Communication (Encrypted with Session Key)", color: COLORS.accent },
  { from: 0, to: 2, label: "GET /resource HTTP/2 — encrypted", dashed: false },
  { from: 2, to: 0, label: "200 OK + body — encrypted", dashed: false, note: "All HTTP data encrypted with the symmetric session key" },
  { from: 0, to: 2, label: "Subsequent requests — same TLS session (no re-handshake)", dashed: false, note: "Session tickets / IDs allow reuse. Huge perf win for keep-alive." },
];

const tls12Steps = [
  { phase: "RTT 1 — Negotiation & Certificate", color: COLORS.accent2 },
  { from: 0, to: 1, label: "ClientHello: version=1.2, random, cipher list, SNI", note: "Client advertises max TLS version (1.2), supported ciphers, and extensions. Cannot send key material yet — must wait for server's DH params first." },
  { from: 1, to: 0, label: "ServerHello: chosen cipher, server random, session ID" },
  { from: 1, to: 0, label: "Certificate — sent in PLAINTEXT!", important: true, note: "Server cert is visible to anyone on the network. In TLS 1.2, the certificate itself is not encrypted during transit." },
  { from: 1, to: 0, label: "ServerKeyExchange (ECDHE: ephemeral DH pubkey, signed)", note: "Only sent for ECDHE/DHE ciphers. Contains server's ephemeral public key, signed by its cert key to prevent MITM." },
  { from: 1, to: 0, label: "ServerHelloDone — server's turn is over" },
  { phase: "RTT 2 — Key Exchange & Finish", color: COLORS.accent3 },
  { from: 0, to: 1, label: "ClientKeyExchange: client ephemeral ECDH public key", note: "Client sends its DH public key. Server and client now independently compute the same pre-master secret via ECDH math." },
  { from: 0, to: 0, self: true, dashed: true, label: "Derive: master_secret = PRF(pre_master, randoms)", important: true, note: "master_secret = PRF(pre_master_secret, 'master secret', client_random || server_random). Both sides run this independently." },
  { from: 0, to: 1, label: "ChangeCipherSpec + Finished (HMAC of full transcript)", note: "Finished = PRF hash over all handshake messages. Proves no tampering. ChangeCipherSpec signals switch to symmetric encryption." },
  { from: 1, to: 0, label: "ChangeCipherSpec + Finished (HMAC verified)" },
  { phase: "Application Data — 2 Round Trips Total", color: COLORS.accent },
  { from: 0, to: 1, label: "App Data — AES-256-GCM encrypted", note: "Symmetric encryption begins after 2 full RTTs. With RSA key exchange (no ECDHE), no forward secrecy — compromise of server key decrypts past sessions." },
  { from: 1, to: 0, label: "App Data response" },
];

const tls13Steps = [
  { phase: "RTT 1 — Negotiation + Key Exchange (single flight!)", color: COLORS.accent2 },
  { from: 0, to: 1, label: "ClientHello: version=1.3, key_share (ECDHE pubkeys), ciphers", note: "Client pre-sends DH key shares for likely groups (X25519, P-256). Eliminates the ServerKeyExchange round trip — key exchange starts immediately." },
  { from: 1, to: 0, label: "ServerHello: selected key_share, chosen cipher", note: "Server picks a key share. Both sides can now independently derive the handshake secret. All following messages are ENCRYPTED." },
  { from: 1, to: 0, label: "EncryptedExtensions (encrypted!)", note: "Extensions are now inside the TLS record encryption layer. In TLS 1.2, extensions were sent in plaintext." },
  { from: 1, to: 0, label: "Certificate (encrypted — not visible on the wire)", important: true, note: "Server cert is fully encrypted in transit. Nobody on the network can see which cert the server is presenting." },
  { from: 1, to: 0, label: "CertificateVerify + Server Finished (encrypted)", note: "Server proves ownership of private key via CertificateVerify, then immediately sends Finished. All in one server flight." },
  { phase: "Client Responds — Handshake Complete in 1 RTT", color: COLORS.accent3 },
  { from: 0, to: 0, self: true, dashed: true, label: "HKDF key schedule: derive traffic secrets", important: true, note: "TLS 1.3 uses HKDF-based key schedule with separate early/handshake/application secrets. No master_secret — cleaner and more secure." },
  { from: 0, to: 1, label: "Client Finished (encrypted)", note: "Client verifies server Finished and responds. No ChangeCipherSpec message needed — protocol is simpler. Handshake done." },
  { phase: "Application Data — 1 Round Trip Total", color: COLORS.accent },
  { from: 0, to: 1, label: "App Data — AEAD only (AES-GCM / ChaCha20-Poly1305)", note: "Data flows after just 1 RTT. TLS 1.3 removes all non-AEAD ciphers (no CBC, no RC4). Forward secrecy is mandatory — ephemeral keys always." },
  { from: 1, to: 0, label: "App Data response" },
  { phase: "0-RTT Resumption (Optional, with Session Ticket)", color: COLORS.warn },
  { from: 0, to: 1, dashed: true, label: "0-RTT Early Data + ClientHello (PSK from prev session)", note: "Client uses a pre-shared key from a previous session ticket and sends application data immediately with ClientHello — before hearing from server." },
  { from: 0, to: 0, self: true, dashed: true, label: "⚠ 0-RTT has replay risk — idempotent requests only!", important: true, note: "0-RTT data is not protected against replay attacks. Never use for state-changing operations (POST, payment, auth). Safe for GET-style requests." },
];

const ACTOR_WIDTH = 110;
const ACTOR_GAP = 160;
const STEP_HEIGHT = 52;
const PHASE_HEIGHT = 44;
const TOP_MARGIN = 90;
const SIDE_PAD = 30;

function Diagram({ title, actorList, steps }) {
  const totalWidth = SIDE_PAD * 2 + (actorList.length - 1) * ACTOR_GAP + ACTOR_WIDTH;

  let y = TOP_MARGIN;
  const rowPositions = [];
  steps.forEach((s) => {
    if (s.phase) {
      rowPositions.push({ y, type: "phase" });
      y += PHASE_HEIGHT;
    } else {
      rowPositions.push({ y, type: "step" });
      y += STEP_HEIGHT + (s.note ? 12 : 0);
    }
  });
  const totalHeight = y + 40;

  const actorX = (i) => SIDE_PAD + ACTOR_WIDTH / 2 + i * ACTOR_GAP;

  const [hoveredStep, setHoveredStep] = useState(null);

  return (
    <div style={{ overflowX: "auto", marginBottom: 32 }}>
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        style={{ display: "block", minWidth: totalWidth }}
      >
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={COLORS.textDim} />
          </marker>
          <marker id="arrow-important" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={COLORS.warn} />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={totalWidth} height={totalHeight} fill={COLORS.bg} rx={8} />

        <text x={totalWidth / 2} y={30} textAnchor="middle" fill={COLORS.text} fontSize={18} fontWeight={700} fontFamily="'JetBrains Mono', 'Fira Code', monospace">
          {title}
        </text>

        {actorList.map((a, i) => {
          const cx = actorX(i);
          return (
            <g key={a.id}>
              <rect x={cx - ACTOR_WIDTH / 2} y={48} width={ACTOR_WIDTH} height={36} rx={6} fill={COLORS.panel} stroke={a.color} strokeWidth={1.5} />
              {a.label.split("\n").map((line, li) => (
                <text key={li} x={cx} y={60 + li * 13} textAnchor="middle" fill={a.color} fontSize={9.5} fontWeight={600} fontFamily="'JetBrains Mono', monospace">
                  {line}
                </text>
              ))}
              <line x1={cx} y1={84} x2={cx} y2={totalHeight - 10} stroke={COLORS.line} strokeWidth={1} strokeDasharray="4,4" />
            </g>
          );
        })}

        {steps.map((step, idx) => {
          const pos = rowPositions[idx];
          if (!pos) return null;

          if (step.phase) {
            return (
              <g key={idx}>
                <rect x={8} y={pos.y} width={totalWidth - 16} height={PHASE_HEIGHT - 8} rx={4} fill={step.color + "12"} stroke={step.color + "40"} strokeWidth={1} />
                <text x={20} y={pos.y + PHASE_HEIGHT / 2 - 1} fill={step.color} fontSize={11} fontWeight={700} fontFamily="'JetBrains Mono', monospace" dominantBaseline="middle">
                  ▸ {step.phase}
                </text>
              </g>
            );
          }

          const fromX = actorX(step.from);
          const toX = step.self ? actorX(step.from) : actorX(step.to);
          const midY = pos.y + STEP_HEIGHT / 2;
          const isHovered = hoveredStep === idx;
          const stepColor = step.important ? COLORS.warn : COLORS.textDim;

          if (step.self) {
            const loopW = 50;
            const loopH = 18;
            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredStep(idx)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{ cursor: step.note ? "pointer" : "default" }}
              >
                {isHovered && step.note && (
                  <rect x={fromX + loopW + 10} y={midY - 28} width={Math.min(step.note.length * 5.2 + 16, 380)} height={36} rx={4} fill={COLORS.panel} stroke={stepColor} strokeWidth={0.8} />
                )}
                {isHovered && step.note && (
                  <text x={fromX + loopW + 18} y={midY - 8} fill={COLORS.text} fontSize={8.5} fontFamily="'JetBrains Mono', monospace">
                    {step.note.length > 72 ? step.note.slice(0, 72) + "..." : step.note}
                  </text>
                )}
                <path
                  d={`M${fromX},${midY - loopH / 2} h${loopW} v${loopH} h-${loopW}`}
                  fill="none"
                  stroke={stepColor}
                  strokeWidth={1.2}
                  strokeDasharray={step.dashed ? "4,3" : "none"}
                  markerEnd={step.important ? "url(#arrow-important)" : "url(#arrow)"}
                />
                <text x={fromX + loopW + 8} y={midY + 4} fill={stepColor} fontSize={8.8} fontFamily="'JetBrains Mono', monospace" fontWeight={step.important ? 700 : 400}>
                  {step.label}
                </text>
              </g>
            );
          }

          const dir = toX > fromX ? 1 : -1;
          const x1 = fromX + dir * 6;
          const x2 = toX - dir * 6;

          return (
            <g
              key={idx}
              onMouseEnter={() => setHoveredStep(idx)}
              onMouseLeave={() => setHoveredStep(null)}
              style={{ cursor: step.note ? "pointer" : "default" }}
            >
              {isHovered && step.note && (
                <>
                  <rect x={Math.min(x1, x2)} y={midY - 30} width={Math.min(step.note.length * 5.2 + 16, 420)} height={20} rx={3} fill={COLORS.bg} fillOpacity={0.95} stroke={stepColor} strokeWidth={0.6} />
                  <text x={Math.min(x1, x2) + 8} y={midY - 17} fill={COLORS.text} fontSize={8} fontFamily="'JetBrains Mono', monospace">
                    {step.note.length > 80 ? step.note.slice(0, 80) + "..." : step.note}
                  </text>
                </>
              )}
              <line
                x1={x1} y1={midY} x2={x2} y2={midY}
                stroke={stepColor}
                strokeWidth={step.important ? 2 : 1.2}
                strokeDasharray={step.dashed ? "5,3" : "none"}
                markerEnd={step.important ? "url(#arrow-important)" : "url(#arrow)"}
                filter={step.important ? "url(#glow)" : undefined}
              />
              <text
                x={(x1 + x2) / 2}
                y={midY - 7}
                textAnchor="middle"
                fill={stepColor}
                fontSize={8.8}
                fontFamily="'JetBrains Mono', monospace"
                fontWeight={step.important ? 700 : 400}
              >
                {step.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function InfoCard({ title, color, children }) {
  return (
    <div style={{
      background: COLORS.panel,
      border: `1px solid ${color}30`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 8,
      padding: "14px 18px",
      marginBottom: 14,
    }}>
      <div style={{ color, fontSize: 13, fontWeight: 700, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>
        {title}
      </div>
      <div style={{ color: COLORS.textDim, fontSize: 12.5, lineHeight: 1.7, fontFamily: "'JetBrains Mono', monospace" }}>
        {children}
      </div>
    </div>
  );
}

export default function TLSFlowDiagrams() {
  const [tab, setTab] = useState("ldaps");

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px", color: COLORS.text, fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
        <h1 style={{
          fontSize: 22,
          fontWeight: 800,
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent2})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 4,
        }}>
          TLS Connection Flow — Deep Dive
        </h1>
        <p style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 20 }}>
          Hover over arrows for detailed notes on each step
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { id: "ldaps", label: "LDAPS (PowerShell → DC)" },
            { id: "https", label: "HTTPS (Browser → Server)" },
            { id: "tlscompare", label: "TLS 1.2 vs 1.3" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: tab === t.id ? COLORS.accent + "20" : COLORS.panel,
                color: tab === t.id ? COLORS.accent : COLORS.textDim,
                border: `1px solid ${tab === t.id ? COLORS.accent + "60" : COLORS.panelBorder}`,
                borderRadius: 6,
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
                transition: "all 0.2s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "ldaps" && (
          <>
            <Diagram
              title="LDAPS Connection Flow — PowerShell to Domain Controller"
              actorList={actors.ldaps}
              steps={ldapsSteps}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
              <InfoCard title="Why You See Delay" color={COLORS.danger}>
                The CRL Distribution Point HTTP URL in the DC's certificate points to your CA server outside the datacenter.
                On first connection (or after CRL cache expires), Windows must download the full CRL file over WAN.
                This HTTP GET is synchronous and blocks the TLS handshake until complete.
              </InfoCard>
              <InfoCard title="CRL Cache Behavior" color={COLORS.warn}>
                Windows caches CRLs in the CryptoAPI URL Cache (certutil -urlcache).
                Cache validity is determined by the CRL's "Next Update" field (typically 1 day–1 week).
                First connection = slow (WAN fetch). Subsequent connections within cache window = fast.
                Run: certutil -urlcache CRL to inspect cached CRLs.
              </InfoCard>
              <InfoCard title="Session Key — Post-Handshake" color={COLORS.accent3}>
                After TLS handshake, a symmetric session key (e.g., AES-256-GCM) is derived.
                ALL subsequent LDAP operations (Bind, Search, Modify) use this fast symmetric encryption.
                No more public-key crypto until next connection — session key handles everything.
              </InfoCard>
              <InfoCard title="Fix: Reduce CRL Delay" color={COLORS.accent}>
                ① Publish CRL to a CDP inside your datacenter (local IIS/web server)<br/>
                ② Increase CRL validity period to reduce re-fetch frequency<br/>
                ③ Enable OCSP (lighter single-cert check vs full CRL download)<br/>
                ④ Pre-cache CRL via scheduled task: certutil -verify -urlfetch
              </InfoCard>
            </div>
          </>
        )}

        {tab === "https" && (
          <>
            <Diagram
              title="HTTPS Connection Flow — Browser to Web Server"
              actorList={actors.https}
              steps={httpsSteps}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
              <InfoCard title="OCSP Stapling (Game Changer)" color={COLORS.accent3}>
                Server pre-fetches its own OCSP response from the CA and staples it to the TLS handshake.
                Client gets revocation status for free — zero extra round trips.
                Most modern web servers (nginx, Apache, IIS) support this. Eliminates the CRL/OCSP delay entirely.
              </InfoCard>
              <InfoCard title="Chrome's CRLSets" color={COLORS.accent2}>
                Chrome does NOT do live OCSP checks by default.
                Instead, Google compiles known-revoked certs into "CRLSets" shipped via Chrome updates.
                This means zero latency for revocation checks but limited coverage (high-value certs only).
                Firefox still does live OCSP with soft-fail.
              </InfoCard>
              <InfoCard title="TLS 1.3 Speed Advantage" color={COLORS.accent}>
                TLS 1.2 = 2 round trips before encrypted data flows.<br/>
                TLS 1.3 = 1 round trip (ServerHello + key share combined).<br/>
                TLS 1.3 0-RTT = Resumption with zero round trips (but replay risk).<br/>
                This is why HTTPS feels faster on modern browsers.
              </InfoCard>
              <InfoCard title="Key Difference vs LDAPS" color={COLORS.warn}>
                HTTPS benefits from OCSP stapling (server-side optimization) — LDAPS typically doesn't.
                Browsers use CT logs + CRLSets — enterprise LDAPS relies on traditional CRL/OCSP.
                HTTPS has HTTP/2 multiplexing — LDAPS is single-connection protocol.
                This is why LDAPS with external CA feels slower than HTTPS to public sites.
              </InfoCard>
            </div>
          </>
        )}

        {tab === "tlscompare" && (
          <>
            {/* Comparison summary table */}
            <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 8, padding: 20, marginBottom: 28 }}>
              <div style={{ color: COLORS.accent, fontWeight: 700, fontSize: 13, marginBottom: 14 }}>▸ Key Differences at a Glance</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                  <thead>
                    <tr>
                      {["Feature", "TLS 1.2", "TLS 1.3"].map((h, i) => (
                        <th key={i} style={{ textAlign: "left", padding: "8px 14px", borderBottom: `1px solid ${COLORS.line}`, color: i === 0 ? COLORS.textMuted : i === 1 ? COLORS.accent2 : COLORS.accent3, fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Round trips to first byte", "2 RTT", "1 RTT (0-RTT with resumption)"],
                      ["Key exchange", "RSA (no FS) or ECDHE (FS optional)", "ECDHE only — FS mandatory"],
                      ["Certificate in transit", "Plaintext (visible on network)", "Encrypted (private)"],
                      ["Cipher suites", "CBC, RC4, 3DES still allowed", "AEAD only (AES-GCM, ChaCha20)"],
                      ["Forward secrecy", "Optional (ECDHE ciphers only)", "Always guaranteed"],
                      ["ChangeCipherSpec msg", "Required", "Removed (cleaner protocol)"],
                      ["ServerKeyExchange msg", "Separate message needed", "Removed (merged into Hello)"],
                      ["Key derivation", "PRF with master_secret", "HKDF key schedule"],
                      ["0-RTT resumption", "No", "Yes (with replay-risk caveat)"],
                      ["Supported since", "2008 (RFC 5246)", "2018 (RFC 8446)"],
                    ].map(([feat, v12, v13], i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : COLORS.bg + "60" }}>
                        <td style={{ padding: "7px 14px", color: COLORS.textDim, borderBottom: `1px solid ${COLORS.line}30` }}>{feat}</td>
                        <td style={{ padding: "7px 14px", color: COLORS.accent2, borderBottom: `1px solid ${COLORS.line}30` }}>{v12}</td>
                        <td style={{ padding: "7px 14px", color: COLORS.accent3, borderBottom: `1px solid ${COLORS.line}30` }}>{v13}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Diagram
              title="TLS 1.2 Handshake — 2 Round Trips"
              actorList={actors.tls}
              steps={tls12Steps}
            />
            <Diagram
              title="TLS 1.3 Handshake — 1 Round Trip"
              actorList={actors.tls}
              steps={tls13Steps}
            />
          </>
        )}
      </div>
  );
}