import { useState } from "react";

const sampleHeader = {
  alg: "RS256",
  typ: "JWT",
  kid: "abc123-key-id"
};

const samplePayload = {
  iss: "https://your-idp.com",
  sub: "user-12345",
  aud: "gcp-federation-client-id",
  exp: 1740500000,
  iat: 1740496400,
  nbf: 1740496400,
  jti: "unique-token-id-789",
  email: "jana@company.com",
  groups: ["engineering", "devops"],
  name: "Jana"
};

const headerB64 = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFiYzEyMy1rZXktaWQifQ";
const payloadB64 = "eyJpc3MiOiJodHRwczovL3lvdXItaWRwLmNvbSIsInN1YiI6InVzZXItMTIzNDUiLCJhdWQiOiJnY3AtZmVkZXJhdGlvbi1jbGllbnQtaWQiLCJleHAiOjE3NDA1MDAwMDAsImlhdCI6MTc0MDQ5NjQwMCwibmJmIjoxNzQwNDk2NDAwLCJqdGkiOiJ1bmlxdWUtdG9rZW4taWQtNzg5IiwiZW1haWwiOiJqYW5hQGNvbXBhbnkuY29tIiwiZ3JvdXBzIjpbImVuZ2luZWVyaW5nIiwiZGV2b3BzIl0sIm5hbWUiOiJKYW5hIn0";
const signatureB64 = "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c_RkZ7v...";

const claims = [
  {
    key: "iss", fullName: "Issuer", category: "registered",
    simple: "Who issued this token — the IdP's identity",
    technical: "A case-sensitive URL identifying the IdP that created and signed this JWT. The recipient (GCP) uses this to know which public keys to fetch for signature verification.",
    inFederation: "Must EXACTLY match the --issuer-uri in GCP's OIDC provider config. Even https vs http or trailing slash differences cause rejection.",
    example: '"iss": "https://your-idp.com"',
    icon: "🏛️", color: "#3b82f6",
    analogy: "Like the country name printed on a passport — tells you who issued it."
  },
  {
    key: "sub", fullName: "Subject", category: "registered",
    simple: "Who this token is about — the authenticated identity",
    technical: "A locally unique, never-reassigned identifier for the user or service that authenticated. Combined with 'iss', it globally identifies the entity. Can be a user ID, email, or service identifier.",
    inFederation: "Mapped to google.subject via attribute mapping. Used in IAM bindings to grant specific identities permission to impersonate service accounts. E.g., principalSet://...pools/POOL/subject/user-12345",
    example: '"sub": "user-12345"',
    icon: "👤", color: "#8b5cf6",
    analogy: "Like the name and photo on a passport — identifies the holder."
  },
  {
    key: "aud", fullName: "Audience", category: "registered",
    simple: "Who this token is intended for — the recipient",
    technical: "Identifies the recipient(s) the JWT is intended for. Can be a string or array of strings. The recipient MUST reject the token if it doesn't recognize itself in the aud claim. Prevents token misuse across services.",
    inFederation: "Must match one of the --allowed-audiences in GCP's OIDC provider. Usually set to the Client ID of the app registered in the IdP. This prevents tokens meant for other apps from being used with GCP.",
    example: '"aud": "gcp-federation-client-id"',
    icon: "🎯", color: "#f59e0b",
    analogy: "Like the destination country stamped on a visa — proves this passport was issued specifically for entering this country."
  },
  {
    key: "exp", fullName: "Expiration Time", category: "registered",
    simple: "When this token expires — after this time it's invalid",
    technical: "A Unix timestamp (seconds since epoch) after which the JWT MUST NOT be accepted. Enforces token lifetime. Short expiration = more secure but requires more frequent token refresh.",
    inFederation: "GCP STS rejects expired tokens. Typical IdP tokens last 1 hour. If your app caches IdP tokens, ensure they're refreshed before expiry.",
    example: '"exp": 1740500000  // Feb 25, 2025 18:13:20 UTC',
    icon: "⏰", color: "#ef4444",
    analogy: "Like the expiry date on a passport — after this date, border control won't accept it."
  },
  {
    key: "iat", fullName: "Issued At", category: "registered",
    simple: "When this token was created",
    technical: "Unix timestamp indicating when the JWT was issued. Can be used to determine the age of a token. Some validators reject tokens that are too old even if not expired.",
    inFederation: "GCP may use this to check token freshness. Large differences between iat and current time might indicate a replay attack.",
    example: '"iat": 1740496400  // Feb 25, 2025 17:13:20 UTC',
    icon: "📅", color: "#6366f1",
    analogy: "Like the issue date on a passport — when it was printed."
  },
  {
    key: "nbf", fullName: "Not Before", category: "registered",
    simple: "Don't accept this token before this time",
    technical: "Unix timestamp before which the JWT MUST NOT be accepted. Useful for tokens issued in advance. Usually equals 'iat' but can be set to a future time.",
    inFederation: "GCP STS checks this to ensure the token isn't being used before its intended activation time.",
    example: '"nbf": 1740496400',
    icon: "🚫", color: "#64748b",
    analogy: "Like a 'valid from' date — the passport isn't active until this date."
  },
  {
    key: "jti", fullName: "JWT ID", category: "registered",
    simple: "Unique ID for this specific token — prevents reuse",
    technical: "A unique identifier for the JWT, used to prevent the token from being replayed. The value MUST be unique per token. Validators can track seen jti values to detect replay attacks.",
    inFederation: "Optional but recommended. GCP may or may not enforce jti uniqueness, but it's good security practice.",
    example: '"jti": "unique-token-id-789"',
    icon: "🆔", color: "#10b981",
    analogy: "Like the passport number — unique to this specific document."
  },
  {
    key: "email", fullName: "Email", category: "custom",
    simple: "User's email address — a custom claim added by the IdP",
    technical: "Not part of the JWT standard (RFC 7519) but commonly included by OIDC providers. The IdP decides which custom claims to include based on scope and configuration.",
    inFederation: "Can be mapped to GCP attributes via attribute-mapping: attribute.email=assertion.email. Useful for conditional IAM bindings.",
    example: '"email": "jana@company.com"',
    icon: "📧", color: "#ec4899",
    analogy: "Like additional details in the passport — address, nationality, etc."
  },
  {
    key: "groups", fullName: "Groups", category: "custom",
    simple: "Groups/roles the user belongs to — custom claim",
    technical: "A custom claim (not in JWT spec) commonly used in OIDC. Can be an array of strings representing group memberships, roles, or permissions.",
    inFederation: "Can be mapped to google.groups for group-based access control. Enables policies like 'only members of the engineering group can impersonate this SA'.",
    example: '"groups": ["engineering", "devops"]',
    icon: "👥", color: "#14b8a6",
    analogy: "Like visa categories or travel permissions listed in the passport."
  }
];

const headerFields = [
  { key: "alg", name: "Algorithm", desc: "The cryptographic algorithm used to sign the token. RS256 means RSA with SHA-256 — asymmetric, so IdP signs with private key, GCP verifies with public key.", icon: "🔐", color: "#3b82f6" },
  { key: "typ", name: "Type", desc: "The type of token. Always 'JWT' for JSON Web Tokens.", icon: "📄", color: "#64748b" },
  { key: "kid", name: "Key ID", desc: "Identifies which specific key from the JWKS endpoint was used to sign this token. GCP uses this to pick the right public key for verification. Critical when the IdP rotates keys.", icon: "🔑", color: "#f59e0b" },
];

const signingAlgorithms = [
  { alg: "RS256", type: "Asymmetric", family: "RSA", desc: "IdP signs with RSA private key, GCP verifies with RSA public key (from JWKS). Most common for federation.", recommended: true },
  { alg: "RS384", type: "Asymmetric", family: "RSA", desc: "Same as RS256 but with SHA-384 hash. Stronger but slower.", recommended: false },
  { alg: "RS512", type: "Asymmetric", family: "RSA", desc: "Same as RS256 but with SHA-512 hash. Strongest RSA option.", recommended: false },
  { alg: "ES256", type: "Asymmetric", family: "ECDSA", desc: "Elliptic Curve signing. Smaller keys, faster verification. Increasingly popular.", recommended: true },
  { alg: "HS256", type: "Symmetric", family: "HMAC", desc: "Uses shared secret for both signing and verification. NOT suitable for federation — GCP would need the IdP's secret.", recommended: false },
];

const sections = [
  { id: "structure", title: "JWT Structure", icon: "🏗️", color: "#6366f1" },
  { id: "visual", title: "Visual Breakdown", icon: "🔬", color: "#8b5cf6" },
  { id: "header", title: "Header Deep Dive", icon: "📋", color: "#3b82f6" },
  { id: "claims", title: "Claims Explorer", icon: "📦", color: "#f59e0b" },
  { id: "signing", title: "How Signing Works", icon: "✍️", color: "#ef4444" },
  { id: "verification", title: "Verification Flow", icon: "🔍", color: "#10b981" },
  { id: "jwks", title: "JWKS & Key Rotation", icon: "🔑", color: "#ec4899" },
  { id: "federation-map", title: "Claims → GCP Mapping", icon: "🗺️", color: "#14b8a6" },
];

export default function JWTGuide() {
  const [active, setActive] = useState("structure");
  const [expanded, setExpanded] = useState(null);
  const [hoveredPart, setHoveredPart] = useState(null);
  const [claimFilter, setClaimFilter] = useState("all");

  const cur = sections.find(s => s.id === active);
  const curIdx = sections.findIndex(s => s.id === active);

  const Card = ({ children, style: s, ...p }) => (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16, ...s }} {...p}>{children}</div>
  );

  const Pill = ({ children, bg, color }) => (
    <span style={{ background: bg, color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 12, whiteSpace: "nowrap" }}>{children}</span>
  );

  const renderStructure = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        A JWT (JSON Web Token) is just <strong>three Base64-encoded strings separated by dots</strong>. That's it. Nothing magical — it's a structured, signed piece of JSON you can decode and read.
      </div>

      <div style={{ background: "#0f172a", borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontFamily: "monospace", fontSize: 13, marginBottom: 16, textAlign: "center", lineHeight: 2 }}>
          <span style={{ color: "#f87171", background: "#f871711a", padding: "4px 8px", borderRadius: 4 }}>HEADER</span>
          <span style={{ color: "#64748b", fontSize: 20, margin: "0 4px" }}>.</span>
          <span style={{ color: "#a78bfa", background: "#a78bfa1a", padding: "4px 8px", borderRadius: 4 }}>PAYLOAD</span>
          <span style={{ color: "#64748b", fontSize: 20, margin: "0 4px" }}>.</span>
          <span style={{ color: "#34d399", background: "#34d3991a", padding: "4px 8px", borderRadius: 4 }}>SIGNATURE</span>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.8, wordBreak: "break-all" }}>
          <span style={{ color: "#f87171" }}>{headerB64}</span>
          <span style={{ color: "#64748b" }}>.</span>
          <span style={{ color: "#a78bfa" }}>{payloadB64}</span>
          <span style={{ color: "#64748b" }}>.</span>
          <span style={{ color: "#34d399" }}>{signatureB64}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            part: "Header", color: "#f87171", bg: "#fef2f2", border: "#fecaca",
            what: "Metadata about the token — what algorithm was used to sign it and which key was used",
            contains: "alg (algorithm), typ (type), kid (key ID)",
            encoded: "Base64URL encoded JSON"
          },
          {
            part: "Payload", color: "#8b5cf6", bg: "#f5f3ff", border: "#c4b5fd",
            what: "The actual data — claims about the identity (who, for whom, when, etc.)",
            contains: "iss, sub, aud, exp, iat, nbf, + custom claims",
            encoded: "Base64URL encoded JSON"
          },
          {
            part: "Signature", color: "#10b981", bg: "#f0fdf4", border: "#86efac",
            what: "Cryptographic proof that the header + payload haven't been tampered with",
            contains: "ALGORITHM(base64(header) + '.' + base64(payload), secret_or_private_key)",
            encoded: "Base64URL encoded binary"
          }
        ].map((p, i) => (
          <Card key={i} style={{ background: p.bg, borderColor: p.border }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: p.color, marginBottom: 6 }}>Part {i + 1}: {p.part}</div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 6 }}>{p.what}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}><strong>Contains:</strong> {p.contains}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}><strong>Encoding:</strong> {p.encoded}</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginTop: 14, background: "#fffbeb", borderColor: "#fde68a" }}>
        <div style={{ fontWeight: 700, color: "#92400e", fontSize: 13, marginBottom: 4 }}>⚠️ Base64 ≠ Encryption</div>
        <div style={{ fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
          The header and payload are only Base64-encoded, NOT encrypted. Anyone can decode and read them! The signature doesn't hide the data — it only proves the data hasn't been modified. Never put secrets (passwords, etc.) in a JWT payload.
        </div>
      </Card>
    </div>
  );

  const renderVisual = () => {
    const parts = [
      { id: "header", label: "HEADER", color: "#f87171", bg: "#f871711a", data: sampleHeader, desc: "Tells the verifier HOW to validate this token" },
      { id: "payload", label: "PAYLOAD (Claims)", color: "#a78bfa", bg: "#a78bfa1a", data: samplePayload, desc: "The actual identity data — WHO, for WHOM, WHEN" },
      { id: "signature", label: "SIGNATURE", color: "#34d399", bg: "#34d3991a", data: null, desc: "Cryptographic proof — computed from header + payload + private key" }
    ];

    return (
      <div>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
          Hover/click each part to see the decoded JSON content. The colored raw token below highlights the corresponding section.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {parts.map((p, i) => (
            <div key={p.id}
              onMouseEnter={() => setHoveredPart(p.id)}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              style={{ background: hoveredPart === p.id || expanded === p.id ? p.bg : "#fff", border: "2px solid", borderColor: hoveredPart === p.id || expanded === p.id ? p.color : "#e2e8f0", borderRadius: 10, padding: 14, cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: p.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: p.color }}>{p.label}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{p.desc}</div>
                  </div>
                </div>
                <span style={{ color: "#94a3b8" }}>{expanded === p.id ? "▲" : "▼"}</span>
              </div>
              {expanded === p.id && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${p.color}30` }}>
                  {p.data ? (
                    <pre style={{ margin: 0, background: "#0f172a", color: "#e2e8f0", padding: 14, borderRadius: 8, fontSize: 12, overflowX: "auto", lineHeight: 1.7 }}>
                      {JSON.stringify(p.data, null, 2)}
                    </pre>
                  ) : (
                    <div style={{ background: "#0f172a", padding: 14, borderRadius: 8 }}>
                      <div style={{ fontFamily: "monospace", fontSize: 12, color: "#e2e8f0", lineHeight: 1.8 }}>
                        <div style={{ color: "#64748b" }}>// The signature is computed as:</div>
                        <div><span style={{ color: "#f59e0b" }}>RS256</span>(</div>
                        <div style={{ paddingLeft: 16 }}><span style={{ color: "#f87171" }}>base64url(header)</span> + <span style={{ color: "#94a3b8" }}>"."</span> + <span style={{ color: "#a78bfa" }}>base64url(payload)</span>,</div>
                        <div style={{ paddingLeft: 16 }}><span style={{ color: "#34d399" }}>IdP_private_key</span></div>
                        <div>)</div>
                        <div style={{ color: "#64748b", marginTop: 8 }}>// Only the IdP has the private key</div>
                        <div style={{ color: "#64748b" }}>// GCP verifies using the PUBLIC key from JWKS</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ background: "#0f172a", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8, fontWeight: 600 }}>RAW TOKEN (hover parts above to highlight)</div>
          <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.6, wordBreak: "break-all" }}>
            <span style={{ color: "#f87171", opacity: hoveredPart && hoveredPart !== "header" ? 0.3 : 1, transition: "opacity 0.2s", textDecoration: hoveredPart === "header" ? "underline" : "none" }}>{headerB64}</span>
            <span style={{ color: "#64748b" }}>.</span>
            <span style={{ color: "#a78bfa", opacity: hoveredPart && hoveredPart !== "payload" ? 0.3 : 1, transition: "opacity 0.2s", textDecoration: hoveredPart === "payload" ? "underline" : "none" }}>{payloadB64}</span>
            <span style={{ color: "#64748b" }}>.</span>
            <span style={{ color: "#34d399", opacity: hoveredPart && hoveredPart !== "signature" ? 0.3 : 1, transition: "opacity 0.2s", textDecoration: hoveredPart === "signature" ? "underline" : "none" }}>{signatureB64}</span>
          </div>
        </div>

        <Card style={{ marginTop: 14, background: "#eff6ff", borderColor: "#bfdbfe" }}>
          <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 13, marginBottom: 4 }}>🔑 What Gets Signed?</div>
          <div style={{ fontSize: 12, color: "#1e3a5f", lineHeight: 1.7 }}>
            The signature covers <strong>both the header AND the payload</strong> (specifically: <code style={{ background: "#dbeafe", padding: "1px 4px", borderRadius: 3 }}>base64url(header) + "." + base64url(payload)</code>). This means if ANYONE modifies even a single character in either the header or payload, the signature becomes invalid. The signature itself is NOT included in the signing input — it's the output.
          </div>
        </Card>
      </div>
    );
  };

  const renderHeader = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        The header is the smallest part of the JWT but it's critical — it tells the verifier how to check the signature.
      </div>
      <Card style={{ background: "#0f172a", marginBottom: 16 }}>
        <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 13, lineHeight: 1.8 }}>{JSON.stringify(sampleHeader, null, 2)}</pre>
      </Card>
      {headerFields.map((f, i) => (
        <div key={i} onClick={() => setExpanded(expanded === `h${i}` ? null : `h${i}`)}
          style={{ marginBottom: 8, background: expanded === `h${i}` ? "#f0f4ff" : "#fff", border: "1px solid", borderColor: expanded === `h${i}` ? "#93c5fd" : "#e2e8f0", borderRadius: 10, padding: 14, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>{f.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <code style={{ fontWeight: 700, fontSize: 15, color: f.color }}>{f.key}</code>
                <span style={{ fontSize: 13, color: "#64748b" }}>— {f.name}</span>
              </div>
            </div>
            <span style={{ color: "#94a3b8" }}>{expanded === `h${i}` ? "▲" : "▼"}</span>
          </div>
          {expanded === `h${i}` && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #e2e8f0", fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{f.desc}</div>
          )}
        </div>
      ))}
      <Card style={{ marginTop: 12, background: "#fffbeb", borderColor: "#fde68a" }}>
        <div style={{ fontWeight: 700, color: "#92400e", fontSize: 13, marginBottom: 6 }}>Why "kid" Matters for Federation</div>
        <div style={{ fontSize: 12, color: "#92400e", lineHeight: 1.7 }}>
          When your IdP rotates signing keys, it publishes multiple keys in the JWKS endpoint. The <code>kid</code> in the JWT header tells GCP which specific key to use for verification. Without it, GCP would have to try all keys — slower and error-prone.
        </div>
      </Card>
    </div>
  );

  const renderClaims = () => {
    const filtered = claimFilter === "all" ? claims : claims.filter(c => c.category === claimFilter);
    return (
      <div>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 12 }}>
          Claims are the key-value pairs in the payload. Click each claim to explore its role in GCP federation.
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {[
            { id: "all", label: "All Claims", color: "#475569" },
            { id: "registered", label: "Standard (RFC 7519)", color: "#6366f1" },
            { id: "custom", label: "Custom / IdP-Specific", color: "#ec4899" },
          ].map(f => (
            <button key={f.id} onClick={() => setClaimFilter(f.id)}
              style={{ padding: "5px 12px", borderRadius: 20, border: "none", background: claimFilter === f.id ? f.color : f.color + "12", color: claimFilter === f.id ? "#fff" : f.color, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              {f.label}
            </button>
          ))}
        </div>
        {filtered.map((c, i) => (
          <div key={c.key} onClick={() => setExpanded(expanded === `cl-${c.key}` ? null : `cl-${c.key}`)}
            style={{ marginBottom: 8, background: expanded === `cl-${c.key}` ? c.color + "08" : "#fff", border: "1px solid", borderColor: expanded === `cl-${c.key}` ? c.color + "40" : "#e2e8f0", borderLeft: `3px solid ${c.color}`, borderRadius: 10, padding: 14, cursor: "pointer", transition: "all 0.15s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>{c.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <code style={{ fontWeight: 800, fontSize: 15, color: c.color }}>{c.key}</code>
                  <span style={{ fontSize: 13, color: "#1e293b", fontWeight: 600 }}>{c.fullName}</span>
                  <Pill bg={c.category === "registered" ? "#eff6ff" : "#fdf2f8"} color={c.category === "registered" ? "#3b82f6" : "#ec4899"}>
                    {c.category === "registered" ? "Standard" : "Custom"}
                  </Pill>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{c.simple}</div>
              </div>
              <span style={{ color: "#94a3b8", flexShrink: 0 }}>{expanded === `cl-${c.key}` ? "▲" : "▼"}</span>
            </div>
            {expanded === `cl-${c.key}` && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${c.color}20` }}>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4, textTransform: "uppercase" }}>Technical</div>
                  <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{c.technical}</div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4, textTransform: "uppercase" }}>In GCP Federation</div>
                  <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{c.inFederation}</div>
                </div>
                <code style={{ display: "block", background: "#0f172a", color: "#86efac", padding: 10, borderRadius: 6, fontSize: 12 }}>{c.example}</code>
                <div style={{ marginTop: 8, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 6, padding: "6px 10px", fontSize: 12, color: "#92400e" }}>
                  💡 Analogy: {c.analogy}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSigning = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        The signature is what makes a JWT trustworthy. Without it, anyone could create a fake token.
      </div>

      <Card style={{ background: "#0f172a", marginBottom: 16, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10, fontWeight: 600 }}>HOW THE SIGNATURE IS CREATED:</div>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: "#e2e8f0", lineHeight: 2.2 }}>
          <div><span style={{ color: "#64748b" }}>Step 1:</span> <span style={{ color: "#f87171" }}>signing_input</span> = <span style={{ color: "#fbbf24" }}>base64url</span>(<span style={{ color: "#f87171" }}>header</span>) + <span style={{ color: "#94a3b8" }}>"."</span> + <span style={{ color: "#fbbf24" }}>base64url</span>(<span style={{ color: "#a78bfa" }}>payload</span>)</div>
          <div><span style={{ color: "#64748b" }}>Step 2:</span> <span style={{ color: "#34d399" }}>signature</span> = <span style={{ color: "#f59e0b" }}>RS256_SIGN</span>(<span style={{ color: "#f87171" }}>signing_input</span>, <span style={{ color: "#fb923c" }}>IdP_PRIVATE_key</span>)</div>
          <div><span style={{ color: "#64748b" }}>Step 3:</span> <span style={{ color: "#e2e8f0" }}>JWT</span> = <span style={{ color: "#f87171" }}>signing_input</span> + <span style={{ color: "#94a3b8" }}>"."</span> + <span style={{ color: "#fbbf24" }}>base64url</span>(<span style={{ color: "#34d399" }}>signature</span>)</div>
        </div>
      </Card>

      <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", marginBottom: 10 }}>Signing Algorithms</div>
      {signingAlgorithms.map((a, i) => (
        <div key={i} onClick={() => setExpanded(expanded === `alg${i}` ? null : `alg${i}`)}
          style={{ marginBottom: 6, background: expanded === `alg${i}` ? "#f0f4ff" : "#fff", border: "1px solid", borderColor: expanded === `alg${i}` ? "#93c5fd" : "#e2e8f0", borderRadius: 8, padding: 12, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <code style={{ fontWeight: 800, fontSize: 14, color: a.recommended ? "#10b981" : "#64748b", minWidth: 50 }}>{a.alg}</code>
            <Pill bg={a.type === "Asymmetric" ? "#f0fdf4" : "#fef2f2"} color={a.type === "Asymmetric" ? "#16a34a" : "#dc2626"}>{a.type}</Pill>
            <Pill bg="#f1f5f9" color="#475569">{a.family}</Pill>
            {a.recommended && <Pill bg="#f0fdf4" color="#16a34a">✓ Recommended</Pill>}
            <span style={{ color: "#94a3b8", marginLeft: "auto" }}>{expanded === `alg${i}` ? "▲" : "▼"}</span>
          </div>
          {expanded === `alg${i}` && (
            <div style={{ marginTop: 8, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{a.desc}</div>
          )}
        </div>
      ))}

      <Card style={{ marginTop: 14, background: "#fef2f2", borderColor: "#fecaca" }}>
        <div style={{ fontWeight: 700, color: "#991b1b", fontSize: 13, marginBottom: 4 }}>🚨 HS256 is NOT for Federation</div>
        <div style={{ fontSize: 12, color: "#991b1b", lineHeight: 1.6 }}>
          HS256 uses a shared secret — both the signer and verifier need the SAME key. For GCP Workload Identity Federation, GCP would need your IdP's secret, which is a security problem. Always use <strong>asymmetric algorithms</strong> (RS256, ES256) where the IdP keeps the private key secret and only publishes the public key via JWKS.
        </div>
      </Card>
    </div>
  );

  const renderVerification = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        When GCP STS receives your IdP's JWT, here's exactly what it does to verify it — step by step.
      </div>
      {[
        {
          n: 1, title: "Parse the JWT", color: "#6366f1",
          detail: "Split the token by dots into three parts. Decode the header (Part 1) to read the algorithm (alg) and key ID (kid).",
          visual: `eyJhbGci... . eyJpc3Mi... . SflKxwRJ...
     ↓              ↓              ↓
   HEADER        PAYLOAD       SIGNATURE
     ↓
  Read: alg=RS256, kid=abc123`
        },
        {
          n: 2, title: "Fetch Public Keys (JWKS)", color: "#3b82f6",
          detail: "Using the IdP's issuer URI, GCP fetches the OIDC discovery document, finds the jwks_uri, and downloads the public keys. Then matches the 'kid' from the header to find the right key.",
          visual: `GET https://your-idp.com/.well-known/openid-configuration
  → finds: "jwks_uri": "https://your-idp.com/.well-known/jwks.json"

GET https://your-idp.com/.well-known/jwks.json
  → finds key with kid="abc123"
  → extracts RSA public key`
        },
        {
          n: 3, title: "Verify Signature", color: "#10b981",
          detail: "Recreate the signing input (base64url(header) + '.' + base64url(payload)), then use the public key to verify the signature matches. If someone modified any byte, verification fails.",
          visual: `signing_input = "eyJhbGci..." + "." + "eyJpc3Mi..."

RSA_VERIFY(signing_input, signature, public_key)
  → ✅ VALID: token is authentic and unmodified
  → ❌ INVALID: token was tampered with or not from this IdP`
        },
        {
          n: 4, title: "Validate Claims", color: "#f59e0b",
          detail: "After confirming the token is authentic, GCP checks the payload claims: issuer matches config, audience matches config, token isn't expired, and token isn't used before nbf.",
          visual: `iss == "https://your-idp.com"?     ✅ Matches provider config
aud == "gcp-federation-client-id"?  ✅ In allowed-audiences
exp > current_time?                 ✅ Not expired
nbf < current_time?                 ✅ Past "not before" time`
        },
        {
          n: 5, title: "Map Attributes", color: "#8b5cf6",
          detail: "Finally, GCP maps the token claims to GCP attributes using your attribute-mapping configuration. These mapped attributes become the federated identity.",
          visual: `assertion.sub  →  google.subject = "user-12345"
assertion.email →  attribute.email = "jana@company.com"

Federated identity:
  principal://...pools/my-pool/subject/user-12345`
        }
      ].map((s, i) => (
        <div key={i} onClick={() => setExpanded(expanded === `v${i}` ? null : `v${i}`)}
          style={{ display: "flex", gap: 12, marginBottom: 8, cursor: "pointer" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 36 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>{s.n}</div>
            {i < 4 && <div style={{ width: 2, flex: 1, background: s.color + "30", marginTop: 2 }} />}
          </div>
          <div style={{ flex: 1, background: expanded === `v${i}` ? s.color + "08" : "#fff", border: "1px solid", borderColor: expanded === `v${i}` ? s.color + "40" : "#e2e8f0", borderRadius: 8, padding: 12, transition: "all 0.15s" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{s.title}</div>
              <span style={{ color: "#94a3b8" }}>{expanded === `v${i}` ? "▲" : "▼"}</span>
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{s.detail}</div>
            {expanded === `v${i}` && (
              <pre style={{ marginTop: 10, background: "#0f172a", color: "#e2e8f0", padding: 12, borderRadius: 6, fontSize: 11, overflowX: "auto", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{s.visual}</pre>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderJWKS = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        JWKS (JSON Web Key Set) is how your IdP publishes its public keys. GCP uses these to verify token signatures without needing any shared secret.
      </div>

      <Card style={{ background: "#0f172a", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8, fontWeight: 600 }}>SAMPLE JWKS ENDPOINT RESPONSE</div>
        <pre style={{ margin: 0, color: "#e2e8f0", fontSize: 11, lineHeight: 1.7, overflowX: "auto" }}>{`{
  "keys": [
    {
      "kty": "RSA",           // Key type
      "kid": "abc123-key-id", // Matches JWT header's kid
      "use": "sig",           // Used for signatures
      "alg": "RS256",         // Algorithm
      "n": "0vx7agoebGc...",  // RSA modulus (public key component)
      "e": "AQAB"             // RSA exponent (public key component)
    },
    {
      "kty": "RSA",           // Second key (for rotation)
      "kid": "def456-key-id",
      "use": "sig",
      "alg": "RS256",
      "n": "1b3agoebGc...",
      "e": "AQAB"
    }
  ]
}`}</pre>
      </Card>

      <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", marginBottom: 10 }}>Key Rotation Flow</div>
      {[
        { n: 1, text: "IdP generates a new signing key pair (private + public)", color: "#3b82f6" },
        { n: 2, text: "IdP publishes BOTH old and new public keys in JWKS (overlap period)", color: "#8b5cf6" },
        { n: 3, text: "IdP starts signing new tokens with the new private key + new kid", color: "#f59e0b" },
        { n: 4, text: "GCP STS refreshes its cached JWKS and picks up the new key", color: "#10b981" },
        { n: 5, text: "Old tokens (signed with old key) are still valid until they expire", color: "#64748b" },
        { n: 6, text: "After all old tokens expire, IdP removes the old key from JWKS", color: "#ef4444" },
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{s.n}</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, paddingTop: 2 }}>{s.text}</div>
        </div>
      ))}

      <Card style={{ marginTop: 14, background: "#fef2f2", borderColor: "#fecaca" }}>
        <div style={{ fontWeight: 700, color: "#991b1b", fontSize: 13, marginBottom: 4 }}>🌐 JWKS Must Be Public</div>
        <div style={{ fontSize: 12, color: "#991b1b", lineHeight: 1.6 }}>
          GCP STS fetches the JWKS endpoint from Google's infrastructure. If your IdP's JWKS endpoint is behind a firewall, GCP cannot verify tokens and federation will fail. The token endpoint can be internal (only your app calls it), but <strong>JWKS must be internet-accessible</strong>.
        </div>
      </Card>
    </div>
  );

  const renderFederationMap = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        Here's how each JWT claim maps to GCP Workload Identity Federation configuration and how it's used at each stage.
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["JWT Claim", "Example Value", "GCP Config", "Used For"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #e2e8f0", color: "#475569", fontWeight: 700, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { claim: "iss", val: "https://your-idp.com", config: "--issuer-uri on provider", use: "GCP verifies token came from trusted IdP", color: "#3b82f6" },
              { claim: "aud", val: "gcp-client-id", config: "--allowed-audiences on provider", use: "Ensures token was meant for this GCP federation", color: "#f59e0b" },
              { claim: "sub", val: "user-12345", config: "google.subject=assertion.sub", use: "Becomes the federated principal identity in IAM", color: "#8b5cf6" },
              { claim: "email", val: "jana@company.com", config: "attribute.email=assertion.email", use: "Optional — for attribute-based IAM conditions", color: "#ec4899" },
              { claim: "groups", val: '["engineering"]', config: "google.groups=assertion.groups", use: "Optional — for group-based access policies", color: "#14b8a6" },
              { claim: "exp", val: "1740500000", config: "Checked automatically", use: "GCP rejects expired tokens", color: "#ef4444" },
              { claim: "kid", val: "abc123-key-id", config: "Matched to JWKS keys", use: "GCP finds correct public key for signature check", color: "#f59e0b" },
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "10px 12px" }}><code style={{ fontWeight: 700, color: r.color }}>{r.claim}</code></td>
                <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11, color: "#64748b" }}>{r.val}</td>
                <td style={{ padding: "10px 12px", fontSize: 11, color: "#1e293b" }}>{r.config}</td>
                <td style={{ padding: "10px 12px", fontSize: 11, color: "#475569" }}>{r.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card style={{ marginTop: 16, background: "#f5f3ff", borderColor: "#c4b5fd" }}>
        <div style={{ fontWeight: 700, color: "#5b21b6", fontSize: 13, marginBottom: 6 }}>Attribute Mapping in gcloud</div>
        <pre style={{ margin: 0, background: "#0f172a", color: "#e2e8f0", padding: 12, borderRadius: 6, fontSize: 11, lineHeight: 1.8, overflowX: "auto" }}>{`--attribute-mapping="\\
  google.subject=assertion.sub,\\
  attribute.email=assertion.email,\\
  google.groups=assertion.groups"`}</pre>
        <div style={{ marginTop: 8, fontSize: 12, color: "#5b21b6", lineHeight: 1.6 }}>
          <code>assertion.*</code> refers to claims in the JWT token. <code>google.*</code> are GCP's internal attributes. <code>attribute.*</code> are custom attributes you can use in IAM conditions.
        </div>
      </Card>

      <Card style={{ marginTop: 10, background: "#f0fdf4", borderColor: "#86efac" }}>
        <div style={{ fontWeight: 700, color: "#166534", fontSize: 13, marginBottom: 6 }}>The Full Trust Chain</div>
        <div style={{ background: "#0f172a", borderRadius: 8, padding: 14, fontFamily: "monospace", fontSize: 11, color: "#e2e8f0", lineHeight: 2.2 }}>
          <div><span style={{ color: "#3b82f6" }}>JWT.iss</span> ──matches──▶ <span style={{ color: "#8b5cf6" }}>GCP Provider --issuer-uri</span> <span style={{ color: "#64748b" }}>(trust the IdP)</span></div>
          <div><span style={{ color: "#f59e0b" }}>JWT.aud</span> ──matches──▶ <span style={{ color: "#8b5cf6" }}>GCP Provider --allowed-audiences</span> <span style={{ color: "#64748b" }}>(token meant for us)</span></div>
          <div><span style={{ color: "#10b981" }}>JWT.sig</span> ──verified──▶ <span style={{ color: "#ec4899" }}>JWKS public key</span> <span style={{ color: "#64748b" }}>(token is authentic)</span></div>
          <div><span style={{ color: "#8b5cf6" }}>JWT.sub</span> ──maps to──▶ <span style={{ color: "#f59e0b" }}>google.subject</span> ──has──▶ <span style={{ color: "#14b8a6" }}>workloadIdentityUser role on SA</span></div>
          <div><span style={{ color: "#14b8a6" }}>SA Client ID</span> ──registered──▶ <span style={{ color: "#10b981" }}>Workspace Domain-Wide Delegation</span></div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (active) {
      case "structure": return renderStructure();
      case "visual": return renderVisual();
      case "header": return renderHeader();
      case "claims": return renderClaims();
      case "signing": return renderSigning();
      case "verification": return renderVerification();
      case "jwks": return renderJWKS();
      case "federation-map": return renderFederationMap();
      default: return null;
    }
  };

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", maxWidth: 860, margin: "0 auto", padding: 16, background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>JWT Deep Dive</h1>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Structure, Signing, Claims & How They Map to GCP Federation</p>
      </div>

      <div style={{ display: "flex", gap: 5, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => { setActive(s.id); setExpanded(null); }}
            style={{ padding: "7px 12px", borderRadius: 8, border: "none", background: active === s.id ? s.color : "#fff", color: active === s.id ? "#fff" : "#475569", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", boxShadow: active === s.id ? `0 2px 8px ${s.color}40` : "0 1px 2px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 13 }}>{s.icon}</span> {s.title}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: 22, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>{cur.icon}</span>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>{cur.title}</h2>
        </div>
        {renderContent()}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
        <button onClick={() => { if (curIdx > 0) { setActive(sections[curIdx - 1].id); setExpanded(null); } }}
          disabled={curIdx === 0}
          style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #e2e8f0", background: curIdx === 0 ? "#f1f5f9" : "#fff", color: curIdx === 0 ? "#cbd5e1" : "#475569", fontSize: 12, fontWeight: 600, cursor: curIdx === 0 ? "default" : "pointer" }}>
          ← Previous
        </button>
        <span style={{ fontSize: 11, color: "#94a3b8", alignSelf: "center" }}>{curIdx + 1} / {sections.length}</span>
        <button onClick={() => { if (curIdx < sections.length - 1) { setActive(sections[curIdx + 1].id); setExpanded(null); } }}
          disabled={curIdx === sections.length - 1}
          style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: curIdx === sections.length - 1 ? "#e2e8f0" : cur.color, color: "#fff", fontSize: 12, fontWeight: 600, cursor: curIdx === sections.length - 1 ? "default" : "pointer" }}>
          Next →
        </button>
      </div>
    </div>
  );
}
