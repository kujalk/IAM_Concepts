import { useState } from "react";

/* ── Light Palette ── */
const C = {
  bg: "#f8fafc",
  panel: "#ffffff",
  panelBorder: "#e2e8f0",
  panelAlt: "#f1f5f9",
  accent: "#059669",
  accent2: "#7c3aed",
  accent3: "#0284c7",
  warn: "#d97706",
  danger: "#dc2626",
  text: "#1e293b",
  textDim: "#475569",
  textMuted: "#94a3b8",
  line: "#cbd5e1",
  codeBg: "#1e293b",
  codeText: "#a3e635",
};

/* ── Shared UI ── */
const Tag = ({ children, color = C.accent }) => (
  <span style={{
    padding: "2px 9px", borderRadius: 20,
    background: `${color}18`, border: `1px solid ${color}50`,
    color, fontSize: 11, fontWeight: 600,
    display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
  }}>{children}</span>
);

const Code = ({ children }) => (
  <code style={{
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.accent3,
    background: `${C.accent3}12`, padding: "1px 6px", borderRadius: 4,
    border: `1px solid ${C.accent3}25`,
  }}>{children}</code>
);

const InfoCard = ({ title, color = C.accent, children }) => (
  <div style={{
    background: C.panel,
    border: `1px solid ${color}30`,
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: "14px 18px",
    marginBottom: 14,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  }}>
    <div style={{ color, fontSize: 12, fontWeight: 700, marginBottom: 7, fontFamily: "'JetBrains Mono', monospace" }}>
      {title}
    </div>
    <div style={{ color: C.textDim, fontSize: 12.5, lineHeight: 1.75, fontFamily: "'JetBrains Mono', monospace" }}>
      {children}
    </div>
  </div>
);

const CodeBlock = ({ children, color = C.accent }) => (
  <pre style={{
    background: C.codeBg,
    border: `1px solid ${color}40`,
    borderRadius: 6,
    padding: "10px 14px",
    margin: 0,
    color: C.codeText,
    fontSize: 11.5,
    fontFamily: "'JetBrains Mono', monospace",
    overflowX: "auto",
    lineHeight: 1.65,
    whiteSpace: "pre",
  }}>{children}</pre>
);

/* ════════════════════════════════════════
   SEQUENCE DIAGRAM ENGINE
════════════════════════════════════════ */

const AW = 110, AG = 155, SH = 54, PH = 42, TM = 90, SP = 28;
const MAX_SELF_LABEL = 42; // truncate self-loop labels in SVG; full text is in hover note

function SeqDiagram({ title, actorList, steps }) {
  const [hovered, setHovered] = useState(null);
  const totalW = SP * 2 + (actorList.length - 1) * AG + AW;
  let y = TM;
  const rows = [];
  steps.forEach((s) => {
    if (s.phase) { rows.push({ y, type: "phase" }); y += PH; }
    else { rows.push({ y, type: "step" }); y += SH + (s.note ? 10 : 0); }
  });
  const totalH = y + 36;
  const ax = (i) => SP + AW / 2 + i * AG;

  return (
    <div style={{ overflowX: "auto", marginBottom: 28, borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
      <svg width={totalW} height={totalH} viewBox={`0 0 ${totalW} ${totalH}`} style={{ display: "block", minWidth: totalW }}>
        <defs>
          <marker id="pkiArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={C.textMuted} />
          </marker>
          <marker id="pkiArrowHot" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={C.warn} />
          </marker>
          <filter id="pkiGlow">
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Light background */}
        <rect width={totalW} height={totalH} fill={C.panelAlt} rx={8} />

        <text x={totalW / 2} y={30} textAnchor="middle" fill={C.text} fontSize={15} fontWeight={700} fontFamily="'JetBrains Mono', monospace">
          {title}
        </text>

        {actorList.map((a, i) => {
          const cx = ax(i);
          return (
            <g key={a.id}>
              <rect x={cx - AW / 2} y={46} width={AW} height={36} rx={6} fill={C.panel} stroke={a.color} strokeWidth={1.8} />
              {a.label.split("\n").map((line, li) => (
                <text key={li} x={cx} y={59 + li * 13} textAnchor="middle" fill={a.color} fontSize={9.5} fontWeight={700} fontFamily="'JetBrains Mono', monospace">{line}</text>
              ))}
              <line x1={cx} y1={82} x2={cx} y2={totalH - 10} stroke={C.line} strokeWidth={1} strokeDasharray="4,4" />
            </g>
          );
        })}

        {steps.map((step, idx) => {
          const pos = rows[idx];
          if (!pos) return null;

          if (step.phase) {
            return (
              <g key={idx}>
                <rect x={6} y={pos.y} width={totalW - 12} height={PH - 6} rx={4} fill={step.color + "18"} stroke={step.color + "50"} strokeWidth={1} />
                <text x={18} y={pos.y + PH / 2 - 1} fill={step.color} fontSize={10.5} fontWeight={700} fontFamily="'JetBrains Mono', monospace" dominantBaseline="middle">▸ {step.phase}</text>
              </g>
            );
          }

          const fromX = ax(step.from);
          const toX = step.self ? ax(step.from) : ax(step.to);
          const midY = pos.y + SH / 2;
          const isHov = hovered === idx;
          const sc = step.important ? C.warn : C.textDim;

          if (step.self) {
            const lw = 48, lh = 18;
            // Flip loop to the left for right-side actors to avoid overflow
            const flipLeft = fromX > totalW * 0.55;
            const truncLabel = step.label.length > MAX_SELF_LABEL
              ? step.label.slice(0, MAX_SELF_LABEL) + "…"
              : step.label;

            if (flipLeft) {
              return (
                <g key={idx} onMouseEnter={() => setHovered(idx)} onMouseLeave={() => setHovered(null)} style={{ cursor: step.note ? "pointer" : "default" }}>
                  {isHov && step.note && (
                    <>
                      <rect x={Math.max(4, fromX - lw - step.note.length * 5 - 16)} y={midY - 30} width={Math.min(step.note.length * 5 + 16, fromX - lw - 8)} height={22} rx={3} fill={C.panel} stroke={sc} strokeWidth={0.8} />
                      <text x={fromX - lw - 12} y={midY - 16} textAnchor="end" fill={C.text} fontSize={8.5} fontFamily="'JetBrains Mono', monospace">{step.note.length > 65 ? step.note.slice(0, 65) + "…" : step.note}</text>
                    </>
                  )}
                  <path d={`M${fromX},${midY - lh / 2} h-${lw} v${lh} h${lw}`} fill="none" stroke={sc} strokeWidth={1.2} strokeDasharray={step.dashed ? "4,3" : "none"} markerEnd={step.important ? "url(#pkiArrowHot)" : "url(#pkiArrow)"} />
                  <text x={fromX - lw - 6} y={midY + 4} textAnchor="end" fill={sc} fontSize={8.5} fontFamily="'JetBrains Mono', monospace" fontWeight={step.important ? 700 : 400}>{truncLabel}</text>
                </g>
              );
            }

            return (
              <g key={idx} onMouseEnter={() => setHovered(idx)} onMouseLeave={() => setHovered(null)} style={{ cursor: step.note ? "pointer" : "default" }}>
                {isHov && step.note && (
                  <>
                    <rect x={fromX + lw + 8} y={midY - 30} width={Math.min(step.note.length * 5 + 16, totalW - fromX - lw - 16)} height={22} rx={3} fill={C.panel} stroke={sc} strokeWidth={0.8} />
                    <text x={fromX + lw + 14} y={midY - 16} fill={C.text} fontSize={8.5} fontFamily="'JetBrains Mono', monospace">{step.note.length > 65 ? step.note.slice(0, 65) + "…" : step.note}</text>
                  </>
                )}
                <path d={`M${fromX},${midY - lh / 2} h${lw} v${lh} h-${lw}`} fill="none" stroke={sc} strokeWidth={1.2} strokeDasharray={step.dashed ? "4,3" : "none"} markerEnd={step.important ? "url(#pkiArrowHot)" : "url(#pkiArrow)"} />
                <text x={fromX + lw + 6} y={midY + 4} fill={sc} fontSize={8.5} fontFamily="'JetBrains Mono', monospace" fontWeight={step.important ? 700 : 400}>{truncLabel}</text>
              </g>
            );
          }

          const dir = toX > fromX ? 1 : -1;
          const x1 = fromX + dir * 6, x2 = toX - dir * 6;
          const truncArrow = step.label && step.label.length > 55 ? step.label.slice(0, 55) + "…" : step.label;
          return (
            <g key={idx} onMouseEnter={() => setHovered(idx)} onMouseLeave={() => setHovered(null)} style={{ cursor: step.note ? "pointer" : "default" }}>
              {isHov && step.note && (
                <>
                  <rect x={Math.min(x1, x2)} y={midY - 32} width={Math.min(step.note.length * 5 + 16, Math.abs(x2 - x1))} height={22} rx={3} fill={C.panel} fillOpacity={0.96} stroke={sc} strokeWidth={0.6} />
                  <text x={Math.min(x1, x2) + 8} y={midY - 19} fill={C.text} fontSize={8.5} fontFamily="'JetBrains Mono', monospace">{step.note.length > 75 ? step.note.slice(0, 75) + "…" : step.note}</text>
                </>
              )}
              <line x1={x1} y1={midY} x2={x2} y2={midY} stroke={sc} strokeWidth={step.important ? 2 : 1.2} strokeDasharray={step.dashed ? "5,3" : "none"} markerEnd={step.important ? "url(#pkiArrowHot)" : "url(#pkiArrow)"} filter={step.important ? "url(#pkiGlow)" : undefined} />
              <text x={(x1 + x2) / 2} y={midY - 7} textAnchor="middle" fill={sc} fontSize={8.5} fontFamily="'JetBrains Mono', monospace" fontWeight={step.important ? 700 : 400}>{truncArrow}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════
   TAB 1 — WHAT IS PKI / CA
════════════════════════════════════════ */

function TabOverview() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <InfoCard title="What is PKI?" color={C.accent}>
          <b style={{ color: C.text }}>Public Key Infrastructure</b> is the complete system of policies, processes,
          hardware, software, and people that creates, manages, distributes, stores, and revokes digital certificates.
          <br /><br />
          It binds public keys to identities (people, servers, services) using a trusted third party — the Certificate Authority.
        </InfoCard>
        <InfoCard title="Why Do We Need PKI?" color={C.accent2}>
          When you connect to <Code>https://bank.com</Code>, how do you know you're really talking to the bank and not an attacker?
          <br /><br />
          PKI solves this: the bank's certificate is signed by a CA your OS already trusts.
          The math proves the certificate was issued by that CA — and only the bank holds the private key.
        </InfoCard>
      </div>

      {/* CA Types */}
      <div style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 10, padding: "18px 20px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ color: C.accent, fontWeight: 700, fontSize: 13, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>▸ Certificate Authority Types</div>
        {[
          {
            label: "Root CA", color: C.warn, tag: "Trust Anchor",
            desc: "The top of the PKI hierarchy. Its certificate is self-signed — it signs itself. Root CAs are inherently trusted because they're pre-installed in OS/browser trust stores. Root CAs should be kept OFFLINE (air-gapped) for maximum security.",
            notes: ["Self-signed certificate", "Pre-installed in OS/browser trust stores", "Should be kept offline (air-gapped)", "Signs Intermediate CA certificates directly"],
          },
          {
            label: "Intermediate CA", color: C.accent2, tag: "Issuing CA",
            desc: "Sits between the Root CA and end-entity certificates. The Root CA signs the Intermediate CA's certificate. Intermediate CAs are online and do the actual day-to-day certificate issuance. If an Intermediate CA is compromised, only its certificates need revocation — the Root CA remains safe.",
            notes: ["Signed by Root CA (or another Intermediate)", "Online — handles certificate requests", "Issues end-entity certificates", "Compromise is contained — root stays trusted"],
          },
          {
            label: "End-Entity Certificate", color: C.accent3, tag: "Leaf Certificate",
            desc: "The certificate installed on a server, client, or device. Signed by an Intermediate CA. Contains the public key, identity (CN/SAN), validity period, and key usage. Cannot sign other certificates (pathLenConstraint = 0).",
            notes: ["Signed by Intermediate CA", "Cannot sign other certificates", "Contains Subject, SANs, public key, validity", "Has explicit Key Usage (TLS Server, Client Auth, etc.)"],
          },
          {
            label: "Public CA vs Private CA", color: C.danger, tag: "Trust Model",
            desc: "Public CAs (DigiCert, Let's Encrypt, Sectigo) are trusted by all browsers/OSes by default. Private/Enterprise CAs are internal — you must manually push their root cert via GPO or MDM to devices. Internal services often use private CAs.",
            notes: ["Public CA: trusted by browsers out of the box", "Private CA: root must be deployed to endpoints", "Enterprise PKI: ADCS, HashiCorp Vault, AWS ACM-PCA", "Let's Encrypt: free, public, automated via ACME"],
          },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
            <div style={{ width: 4, minHeight: 80, borderRadius: 4, background: item.color, flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ color: item.color, fontWeight: 700, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</span>
                <Tag color={item.color}>{item.tag}</Tag>
              </div>
              <div style={{ color: C.textDim, fontSize: 12.5, lineHeight: 1.7, marginBottom: 8 }}>{item.desc}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {item.notes.map((n) => (
                  <span key={n} style={{ fontSize: 11, color: item.color, background: `${item.color}10`, border: `1px solid ${item.color}30`, borderRadius: 4, padding: "2px 8px", fontFamily: "'JetBrains Mono', monospace" }}>{n}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate anatomy */}
      <div style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 10, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ color: C.accent3, fontWeight: 700, fontSize: 13, marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" }}>▸ What's Inside a Certificate (X.509 v3)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { field: "Subject", val: "CN=api.corp.com, O=Corp Inc, C=US — identity being certified" },
            { field: "Issuer", val: "CN=Corp Intermediate CA — who signed this certificate" },
            { field: "Serial Number", val: "Unique identifier issued by the CA (used in CRL/OCSP)" },
            { field: "Validity (Not Before / Not After)", val: "Certificate's lifespan. After expiry it's rejected." },
            { field: "Public Key", val: "RSA-2048 / ECDSA P-256 — what the world uses to encrypt/verify" },
            { field: "Subject Alternative Names (SANs)", val: "api.corp.com, *.corp.com — hostnames this cert covers" },
            { field: "Key Usage", val: "Digital Signature, Key Encipherment — what the key can do" },
            { field: "Extended Key Usage (EKU)", val: "TLS Web Server Auth (1.3.6.1.5.5.7.3.1), Client Auth, etc." },
            { field: "Basic Constraints", val: "CA: FALSE for leaf certs. CA: TRUE + pathLen for CAs." },
            { field: "CRL Distribution Points", val: "URL where revoked cert list is published" },
            { field: "Authority Info Access (AIA)", val: "OCSP responder URL + Issuer cert download URL" },
            { field: "Signature Algorithm", val: "SHA256WithRSAEncryption — how the CA signed this cert" },
          ].map(({ field, val }) => (
            <div key={field} style={{ background: C.panelAlt, border: `1px solid ${C.panelBorder}`, borderRadius: 6, padding: "8px 12px" }}>
              <div style={{ color: C.accent3, fontSize: 11, fontWeight: 700, marginBottom: 3, fontFamily: "'JetBrains Mono', monospace" }}>{field}</div>
              <div style={{ color: C.textDim, fontSize: 11.5, lineHeight: 1.6 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TAB 2 — CERT REQUEST SEQUENCE DIAGRAM
════════════════════════════════════════ */

const certActors = [
  { id: "dev", label: "Applicant\n(Server/Dev)", color: C.accent3 },
  { id: "fs", label: "File System\n/ Key Store", color: C.textDim },
  { id: "ica", label: "Intermediate\nCA (Online)", color: C.accent2 },
  { id: "rca", label: "Root CA\n(Offline)", color: C.warn },
];

const certSteps = [
  { phase: "Step 1 — Generate Key Pair", color: C.accent3 },
  { from: 0, to: 0, self: true, dashed: true, label: "openssl genrsa -out server.key 2048", important: true, note: "Generate RSA-2048 private key. Never leave the server. Use 4096 for long-lived certs or ECDSA for smaller keys." },
  { from: 0, to: 0, self: true, dashed: true, label: "Private key created: server.key (NEVER share)", note: "server.key contains both private and public key material. The private key is the secret that proves identity." },
  { from: 0, to: 1, label: "Store server.key securely (chmod 600, root-owned)", note: "Private key must be readable only by the web server process. Compromise = all past/future TLS sessions exposed." },

  { phase: "Step 2 — Create Certificate Signing Request (CSR)", color: C.accent2 },
  { from: 0, to: 0, self: true, dashed: true, label: "openssl req -new -key server.key -out server.csr", note: "CSR contains: Subject (CN, O, OU, C), Public Key, and a signature proving you own the private key." },
  { from: 0, to: 0, self: true, dashed: true, label: "Fill: CN=api.corp.com, O=Corp, C=US", note: "CN is the primary hostname. Modern clients check SANs. Always add SANs to the CSR config or CA template." },
  { from: 0, to: 0, self: true, dashed: true, label: "CSR self-signed with private key (proves ownership)", important: true, note: "The CSR signature proves you control the private key. CA verifies this before signing. CSR itself has no trust." },

  { phase: "Step 3 — Submit CSR to Certificate Authority", color: C.accent },
  { from: 0, to: 2, label: "Submit server.csr → CA (portal / ACME / AD CS)", note: "CSR is public — safe to transmit. Private key NEVER leaves your server. CA reads the public key from the CSR." },
  { from: 2, to: 2, self: true, dashed: true, label: "CA validates: domain control (DV/OV/EV)", note: "DV: prove you control the domain (DNS/HTTP challenge). OV: org verification via documents. EV: extended org vetting." },
  { from: 2, to: 2, self: true, dashed: true, label: "CA checks: CSR signature, key length, policy", note: "CA verifies the CSR's self-signature, checks key algorithm/length, applies policy (min RSA-2048, no MD5, etc.)." },

  { phase: "Step 4 — CA Signs the Certificate", color: C.warn },
  { from: 2, to: 2, self: true, dashed: true, label: "CA copies Subject + Public Key from CSR", note: "CA copies the Subject DN and Public Key from your CSR into the new certificate struct (TBSCertificate)." },
  { from: 2, to: 2, self: true, dashed: true, label: "CA adds: Issuer, Serial, Validity, SANs, EKU…", important: true, note: "CA appends its own fields: serial number, validity dates, AIA (OCSP URL), CDP (CRL URL), and EKU extensions." },
  { from: 2, to: 2, self: true, dashed: true, label: "Signature = SHA256(TBSCert) enc with CA key", important: true, note: "Signature = hash of cert body, encrypted with Intermediate CA's private key. Anyone with CA's public key can verify." },
  { from: 2, to: 0, label: "Return server.crt (signed certificate)", note: "server.crt is now trusted by anyone who trusts the Intermediate CA, which chains up to the Root CA." },

  { phase: "Step 5 — Build & Deploy Certificate Chain", color: C.accent3 },
  { from: 2, to: 0, dashed: true, label: "Return intermediate-ca.crt (CA certificate)", note: "Server must send the full chain to clients. Leaf-only = clients may fail to build the trust path." },
  { from: 0, to: 0, self: true, dashed: true, label: "cat server.crt intermediate-ca.crt > fullchain.pem", note: "fullchain.pem = leaf cert + intermediate cert(s). Root CA cert NOT included — clients already have it." },
  { from: 0, to: 0, self: true, dashed: true, label: "Deploy: server.key + fullchain.pem to web server", important: true, note: "Web server uses private key to prove identity and fullchain.pem to let clients verify the trust path." },

  { phase: "Step 6 — Root CA Signs Intermediate CA (one-time, offline)", color: C.warn },
  { from: 2, to: 3, dashed: true, label: "Intermediate CA CSR → Root CA (offline ceremony)", note: "Rare, high-security event. Air-gapped machine. Witnessed by multiple people. Logged and audited." },
  { from: 3, to: 2, dashed: true, label: "Root CA signs Intermediate CA cert", important: true, note: "Root CA private key signs the Intermediate CA cert. Foundation of all trust. Root CA goes back offline." },
];

function TabCertRequest() {
  return (
    <div>
      <p style={{ color: C.textDim, fontSize: 12.5, marginBottom: 20, lineHeight: 1.7 }}>
        Hover over arrows for detailed notes. The diagram shows a complete certificate lifecycle.
        The private key <b style={{ color: C.danger }}>never leaves Step 1</b> — everything submitted to the CA is public.
      </p>
      <SeqDiagram
        title="Certificate Request & Signing Flow"
        actorList={certActors}
        steps={certSteps}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <InfoCard title="Key Insight: What the CA Actually Signs" color={C.warn}>
          The CA never sees your private key. It only signs a structure containing:
          your <b style={{ color: C.text }}>public key</b> + your <b style={{ color: C.text }}>identity (Subject DN)</b> + extensions it adds.
          <br /><br />
          The resulting signature says: <i>"This entity controls this public key, and I (the CA) vouch for it."</i>
        </InfoCard>
        <InfoCard title="DV vs OV vs EV Certificates" color={C.accent2}>
          <b style={{ color: C.text }}>DV (Domain Validated):</b> Prove domain control only. Automated. Let's Encrypt.<br />
          <b style={{ color: C.text }}>OV (Organization Validated):</b> Org identity verified. Human review.<br />
          <b style={{ color: C.text }}>EV (Extended Validation):</b> Rigorous legal entity vetting. Green bar (older browsers).
          <br /><br />
          All three provide the same TLS encryption strength — only identity assurance differs.
        </InfoCard>
        <InfoCard title="ACME Protocol (Let's Encrypt Automation)" color={C.accent3}>
          Let's Encrypt uses the <b style={{ color: C.text }}>ACME protocol</b> to automate DV issuance:
          <br />① Client requests cert for domain<br />
          ② CA issues a challenge (DNS TXT record or HTTP-01 file)<br />
          ③ Client proves domain control by completing the challenge<br />
          ④ CA issues 90-day cert automatically<br /><br />
          Tools: <Code>certbot</Code>, <Code>acme.sh</Code>, Caddy (built-in)
        </InfoCard>
        <InfoCard title="AD CS (Windows Enterprise PKI)" color={C.accent}>
          Active Directory Certificate Services issues certs via:
          <br />• <b style={{ color: C.text }}>Web Enrollment</b> (certsrv) — browser UI<br />
          • <b style={{ color: C.text }}>certreq.exe</b> — CLI tool<br />
          • <b style={{ color: C.text }}>Auto-enrollment</b> via GPO (computers/users get certs automatically)<br />
          • <b style={{ color: C.text }}>NDES</b> — for network devices via SCEP<br /><br />
          Certificate templates define what EKUs/SANs are allowed per requestor.
        </InfoCard>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TAB 3 — CERTIFICATE CHAIN
════════════════════════════════════════ */

function ChainDiagram() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, margin: "28px 0" }}>
      {[
        {
          label: "Root CA Certificate", tag: "Self-Signed / Trust Anchor", color: C.warn,
          fields: ["Subject: CN=Corp Root CA", "Issuer: CN=Corp Root CA (self-signed)", "Basic Constraints: CA=TRUE, pathLen=2", "Key Usage: Certificate Sign, CRL Sign", "Validity: 20 years", "Stored in: OS / Browser Trust Store"],
          note: "The Root CA certificate IS the trust anchor. It proves nothing by signature — it's trusted because it's pre-installed on your device. The Root CA's private key signs Intermediate CA certs.",
        },
        {
          label: "Intermediate CA Certificate", tag: "Signed by Root CA", color: C.accent2,
          fields: ["Subject: CN=Corp Issuing CA 01", "Issuer: CN=Corp Root CA (signed by Root)", "Basic Constraints: CA=TRUE, pathLen=0", "Key Usage: Certificate Sign, CRL Sign", "Validity: 10 years", "AIA: http://ocsp.corp.com"],
          note: "The Intermediate CA is trusted because it was signed by the Root CA. pathLen=0 means it cannot sign other CAs — only leaf certs. The Intermediate CA's private key signs end-entity certs.",
        },
        {
          label: "Server / End-Entity Certificate", tag: "Signed by Intermediate CA", color: C.accent3,
          fields: ["Subject: CN=api.corp.com", "Issuer: CN=Corp Issuing CA 01", "Basic Constraints: CA=FALSE", "EKU: TLS Web Server Authentication", "SANs: api.corp.com, *.api.corp.com", "Validity: 1 year"],
          note: "The leaf cert is trusted because it was signed by the Intermediate CA. CA=FALSE means it cannot sign anything. This cert + its private key is what the server uses to prove its identity.",
        },
      ].map((node, i) => (
        <div key={node.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <div style={{ background: C.panel, border: `2px solid ${node.color}60`, borderRadius: 10, padding: "16px 20px", width: "min(620px, 100%)", boxShadow: `0 2px 12px ${node.color}15` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ color: node.color, fontWeight: 800, fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>{node.label}</span>
              <Tag color={node.color}>{node.tag}</Tag>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 10 }}>
              {node.fields.map((f) => (
                <div key={f} style={{ fontSize: 11, color: C.textDim, fontFamily: "'JetBrains Mono', monospace", padding: "3px 0" }}>• {f}</div>
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: C.textMuted, lineHeight: 1.65, borderTop: `1px solid ${C.panelBorder}`, paddingTop: 8 }}>{node.note}</div>
          </div>
          {i < 2 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, margin: "4px 0" }}>
              <div style={{ width: 2, height: 18, background: C.line }} />
              <div style={{ color: C.textDim, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", background: C.panelAlt, border: `1px solid ${C.panelBorder}`, borderRadius: 4, padding: "3px 10px" }}>
                {i === 0 ? "Root CA signs Intermediate CA cert" : "Intermediate CA signs Leaf cert"}
              </div>
              <div style={{ width: 2, height: 18, background: C.line }} />
              <div style={{ fontSize: 18, color: C.warn }}>▼</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TabChain() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <InfoCard title="What is the Chain of Trust?" color={C.accent}>
          When a client receives a server certificate, it works backwards:
          <br /><br />
          ① Is the leaf cert signed by an issuer I recognize?<br />
          ② Is that issuer's cert signed by someone I trust further up?<br />
          ③ Does this chain eventually reach a Root CA in my trust store?<br /><br />
          Each verification uses the <b style={{ color: C.text }}>issuer's public key</b>. If every link checks out, the cert is valid.
        </InfoCard>
        <InfoCard title="Why Intermediate CAs?" color={C.warn}>
          Root CAs are precious — if compromised, all certificates issued by that root become untrusted.
          <br /><br />
          Intermediate CAs provide a <b style={{ color: C.text }}>buffer layer</b>: the Root CA stays offline, while
          Intermediate CAs handle day-to-day issuance. If an Intermediate CA is compromised:
          <br />• Revoke the Intermediate CA cert<br />
          • Issue a new Intermediate CA<br />
          • Root CA is unaffected and remains trusted
        </InfoCard>
      </div>

      <ChainDiagram />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <InfoCard title="pathLenConstraint Explained" color={C.accent2}>
          <Code>pathLen=2</Code> on Root CA: at most 2 more CAs can appear below it in a chain.<br />
          <Code>pathLen=0</Code> on Intermediate CA: can only sign leaf certs (no more CAs below).<br />
          <Code>CA=FALSE</Code> on leaf certs: cannot sign anything — end of chain.<br /><br />
          This prevents rogue CAs from issuing sub-CAs without Root CA authorization.
        </InfoCard>
        <InfoCard title="Trust Store Locations" color={C.accent3}>
          <b style={{ color: C.text }}>Windows:</b> certmgr.msc → Trusted Root CAs / Intermediate CAs<br />
          <b style={{ color: C.text }}>Linux:</b> /etc/ssl/certs/, /etc/ca-certificates.conf<br />
          <b style={{ color: C.text }}>macOS:</b> Keychain Access → System Roots<br />
          <b style={{ color: C.text }}>Java:</b> $JAVA_HOME/lib/security/cacerts (keytool)<br />
          <b style={{ color: C.text }}>Node.js:</b> Uses OS trust store or NODE_EXTRA_CA_CERTS env var<br /><br />
          Enterprise CAs are pushed via GPO / MDM / config management.
        </InfoCard>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TAB 4 — OPENSSL COMMANDS
════════════════════════════════════════ */

const cmdGroups = [
  {
    title: "Key Generation", color: C.accent,
    cmds: [
      {
        label: "Generate RSA-2048 private key",
        cmd: `openssl genrsa -out server.key 2048`,
        note: "Standard RSA key. Use 4096 for extra long-lived certs.",
      },
      {
        label: "Generate RSA-4096 private key (AES-encrypted)",
        cmd: `openssl genrsa -aes256 -out server.key 4096`,
        note: "AES-256 encrypted. You'll need the passphrase every time the server restarts.",
      },
      {
        label: "Generate ECDSA P-256 key (smaller, faster)",
        cmd: `openssl ecparam -name prime256v1 -genkey -noout -out ec.key`,
        note: "ECDSA P-256 keys are much smaller than RSA-2048 but equivalent security. Preferred for modern deployments.",
      },
      {
        label: "View private key details",
        cmd: `openssl rsa -in server.key -text -noout`,
        note: "Shows modulus, exponents, primes. Never share or log this output.",
      },
    ],
  },
  {
    title: "CSR — Certificate Signing Requests", color: C.accent2,
    cmds: [
      {
        label: "Generate CSR from existing key",
        cmd: `openssl req -new -key server.key -out server.csr`,
        note: "Interactive: prompts for CN, O, OU, C, etc.",
      },
      {
        label: "Generate CSR with SANs (non-interactive)",
        cmd: `openssl req -new -key server.key -out server.csr \\
  -subj "/CN=api.corp.com/O=Corp/C=US" \\
  -addext "subjectAltName=DNS:api.corp.com,DNS:*.api.corp.com"`,
        note: "Modern clients require SANs. CN alone is no longer sufficient for browsers.",
      },
      {
        label: "View CSR contents",
        cmd: `openssl req -in server.csr -text -noout -verify`,
        note: "Verify: checks the CSR's self-signature (proves you own the private key). Text: shows all fields.",
      },
      {
        label: "Generate key + CSR in one command",
        cmd: `openssl req -newkey rsa:2048 -nodes -keyout server.key \\
  -out server.csr -subj "/CN=api.corp.com/O=Corp/C=US"`,
        note: "-nodes = no DES (no passphrase). Generates key and CSR simultaneously.",
      },
    ],
  },
  {
    title: "Certificate Inspection", color: C.accent3,
    cmds: [
      {
        label: "View certificate details (PEM)",
        cmd: `openssl x509 -in server.crt -text -noout`,
        note: "Shows all fields: Subject, Issuer, SANs, EKU, validity, extensions, signature algorithm.",
      },
      {
        label: "View expiry date only",
        cmd: `openssl x509 -in server.crt -noout -enddate`,
        note: "Quick check for cert expiry. Use in scripts to alert before expiration.",
      },
      {
        label: "View certificate from live server",
        cmd: `openssl s_client -connect api.corp.com:443 -showcerts 2>/dev/null \\
  | openssl x509 -noout -text`,
        note: "Pulls the live certificate from the server and parses it. No local file needed.",
      },
      {
        label: "View full chain from live server",
        cmd: `openssl s_client -connect api.corp.com:443 -showcerts 2>/dev/null`,
        note: "Dumps ALL certificates in the chain (leaf + intermediates). Look for multiple BEGIN CERTIFICATE blocks.",
      },
      {
        label: "Get SHA-256 fingerprint of cert",
        cmd: `openssl x509 -in server.crt -noout -fingerprint -sha256`,
        note: "Fingerprint is a hash of the entire DER-encoded cert. Useful for pinning or identity comparison.",
      },
    ],
  },
  {
    title: "Verify Key & Certificate Match", color: C.warn,
    cmds: [
      {
        label: "Compare modulus — cert and key MUST match",
        cmd: `# These two commands must output the SAME hash:
openssl x509 -in server.crt -noout -modulus | openssl md5
openssl rsa  -in server.key -noout -modulus | openssl md5`,
        note: "If the MD5 hashes match, the certificate and private key are a pair. If they differ, wrong key is used.",
      },
      {
        label: "Verify cert was signed by a specific CA",
        cmd: `openssl verify -CAfile ca-chain.pem server.crt`,
        note: "ca-chain.pem = Root CA + Intermediate CA concatenated. Returns 'OK' if cert chains up to that CA.",
      },
      {
        label: "Verify cert chain against system trust store",
        cmd: `openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt server.crt`,
        note: "Uses the system's bundle of trusted root CAs. Simulates what TLS clients do.",
      },
      {
        label: "Check CSR and key match",
        cmd: `openssl req -in server.csr -noout -modulus | openssl md5
openssl rsa -in server.key -noout -modulus | openssl md5`,
        note: "Verify the CSR was generated from this specific private key before submitting to CA.",
      },
    ],
  },
  {
    title: "Certificate Chain & Conversion", color: C.accent2,
    cmds: [
      {
        label: "Concatenate into full chain PEM",
        cmd: `cat server.crt intermediate-ca.crt > fullchain.pem
# Optional: append root for verification bundles
cat server.crt intermediate-ca.crt root-ca.crt > bundle.pem`,
        note: "Order matters: leaf cert first, then each issuing CA up to (but usually not including) root.",
      },
      {
        label: "Convert PEM to PKCS#12 (for Windows/Java)",
        cmd: `openssl pkcs12 -export -in server.crt -inkey server.key \\
  -certfile intermediate-ca.crt -out server.p12 -name "api.corp.com"`,
        note: "PKCS#12 (.p12/.pfx) bundles the cert + private key + chain in one password-protected binary file.",
      },
      {
        label: "Convert PKCS#12 to PEM",
        cmd: `openssl pkcs12 -in server.p12 -out server.pem -nodes`,
        note: "-nodes = don't encrypt the output private key. Use with caution.",
      },
      {
        label: "Convert DER to PEM",
        cmd: `openssl x509 -in server.der -inform DER -out server.pem -outform PEM`,
        note: "DER is binary; PEM is base64. Most Linux tools expect PEM format.",
      },
    ],
  },
  {
    title: "TLS Debugging & Validation", color: C.danger,
    cmds: [
      {
        label: "Test TLS connection and show handshake",
        cmd: `openssl s_client -connect api.corp.com:443 -tls1_2
openssl s_client -connect api.corp.com:443 -tls1_3`,
        note: "Force specific TLS version. Look for 'Verify return code: 0 (ok)' at the bottom.",
      },
      {
        label: "Check OCSP status of a certificate",
        cmd: `# 1. Extract OCSP URL from cert
openssl x509 -in server.crt -noout -ocsp_uri

# 2. Send OCSP request
openssl ocsp -issuer intermediate-ca.crt -cert server.crt \\
  -url http://ocsp.corp.com -resp_text`,
        note: "OCSP response: 'good' = not revoked, 'revoked' = revoked with reason, 'unknown' = CA doesn't know.",
      },
      {
        label: "Test with SNI (virtual hosting)",
        cmd: `openssl s_client -connect api.corp.com:443 -servername api.corp.com`,
        note: "SNI tells the server which certificate to present. Without -servername, server may return wrong cert.",
      },
      {
        label: "Test LDAPS (port 636)",
        cmd: `openssl s_client -connect dc01.corp.com:636 -showcerts`,
        note: "Tests LDAPS connection. Useful for debugging DC certificate issues. Check for 'Verify return code: 0 (ok)'.",
      },
      {
        label: "Self-sign a test certificate (dev only)",
        cmd: `openssl req -x509 -newkey rsa:2048 -nodes \\
  -keyout self.key -out self.crt -days 365 \\
  -subj "/CN=localhost" \\
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"`,
        note: "Self-signed certs are NOT trusted by browsers by default. For dev/testing only.",
      },
    ],
  },
];

function TabOpenSSL() {
  const [openGroup, setOpenGroup] = useState(null);
  return (
    <div>
      <p style={{ color: C.textDim, fontSize: 12.5, marginBottom: 20, lineHeight: 1.7 }}>
        Click a section to expand. Commands use <Code>openssl</Code> — available on Linux/macOS.
        On Windows, use Git Bash, WSL, or install via <Code>choco install openssl</Code>.
      </p>

      {cmdGroups.map((group) => {
        const isOpen = openGroup === group.title;
        return (
          <div key={group.title} style={{ marginBottom: 10 }}>
            <button
              onClick={() => setOpenGroup(isOpen ? null : group.title)}
              style={{
                width: "100%", textAlign: "left",
                background: isOpen ? `${group.color}08` : C.panel,
                border: `1px solid ${isOpen ? group.color + "70" : C.panelBorder}`,
                borderRadius: isOpen ? "8px 8px 0 0" : 8,
                padding: "12px 16px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <span style={{ color: group.color, fontWeight: 700, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
                {isOpen ? "▾ " : "▸ "}{group.title}
              </span>
              <span style={{ color: group.color, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", opacity: 0.7 }}>
                {group.cmds.length} commands
              </span>
            </button>
            {isOpen && (
              <div style={{ background: C.panelAlt, border: `1px solid ${group.color}40`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: "16px" }}>
                {group.cmds.map((c, ci) => (
                  <div key={c.label} style={{ marginBottom: ci < group.cmds.length - 1 ? 20 : 0 }}>
                    <div style={{ color: C.text, fontSize: 12.5, fontWeight: 600, marginBottom: 7, fontFamily: "'JetBrains Mono', monospace" }}>
                      <span style={{ color: group.color, marginRight: 6 }}>$</span>{c.label}
                    </div>
                    <CodeBlock color={group.color}>{c.cmd}</CodeBlock>
                    {c.note && (
                      <div style={{ color: C.textDim, fontSize: 12, marginTop: 6, lineHeight: 1.65, paddingLeft: 4, borderLeft: `2px solid ${group.color}40`, paddingLeft: 10 }}>
                        {c.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <InfoCard title="Quick Cert Health Check Script" color={C.accent}>
          <CodeBlock color={C.accent}>{`#!/bin/bash
CERT="server.crt"
KEY="server.key"

echo "=== Expiry ==="
openssl x509 -in $CERT -noout -enddate

echo "=== SANs ==="
openssl x509 -in $CERT -noout -ext subjectAltName

echo "=== Key Match ==="
CERT_MOD=$(openssl x509 -in $CERT -noout -modulus | md5sum)
KEY_MOD=$(openssl rsa -in $KEY -noout -modulus | md5sum)
[ "$CERT_MOD" = "$KEY_MOD" ] && echo "MATCH ✓" || echo "MISMATCH ✗"

echo "=== Chain Verify ==="
openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt $CERT`}</CodeBlock>
        </InfoCard>
        <InfoCard title="Common Errors & Fixes" color={C.danger}>
          <b style={{ color: C.text }}>SSL_ERROR_RX_RECORD_TOO_LONG:</b> Server not using TLS on this port<br />
          <b style={{ color: C.text }}>CERTIFICATE_VERIFY_FAILED:</b> CA cert not in trust store — add it<br />
          <b style={{ color: C.text }}>SSL_ERROR_BAD_CERT_DOMAIN:</b> Hostname not in SANs — wrong cert<br />
          <b style={{ color: C.text }}>CERTIFICATE_EXPIRED:</b> Renew the cert<br />
          <b style={{ color: C.text }}>unable to get local issuer cert:</b> Intermediate CA missing from chain<br />
          <b style={{ color: C.text }}>key mismatch:</b> Cert and key are from different pairs — re-match them
        </InfoCard>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   ROOT COMPONENT
════════════════════════════════════════ */

const TABS = [
  { id: "overview", label: "PKI & CA Overview" },
  { id: "certrequest", label: "Certificate Request Flow" },
  { id: "chain", label: "Certificate Chain" },
  { id: "openssl", label: "OpenSSL Commands" },
];

export default function PKIGuide() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px", color: C.text, fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", background: C.bg, minHeight: "100vh" }}>
      <h1 style={{
        fontSize: 22, fontWeight: 800,
        background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        marginBottom: 4,
      }}>
        PKI — Public Key Infrastructure
      </h1>
      <p style={{ color: C.textMuted, fontSize: 12, marginBottom: 22 }}>
        Certificate Authorities, Trust Chains, CSR Flow & OpenSSL Reference
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: tab === t.id ? C.accent + "15" : C.panel,
              color: tab === t.id ? C.accent : C.textDim,
              border: `1px solid ${tab === t.id ? C.accent + "70" : C.panelBorder}`,
              borderRadius: 6, padding: "8px 16px", cursor: "pointer",
              fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.2s",
              boxShadow: tab === t.id ? `0 0 0 2px ${C.accent}20` : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <TabOverview />}
      {tab === "certrequest" && <TabCertRequest />}
      {tab === "chain" && <TabChain />}
      {tab === "openssl" && <TabOpenSSL />}
    </div>
  );
}
