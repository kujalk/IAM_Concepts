import { useState } from "react";

const sections = [
  { id: "bigpicture", title: "The Big Picture", icon: "🗺️", color: "#6366f1" },
  { id: "oauth2", title: "What is OAuth2?", icon: "🔓", color: "#3b82f6" },
  { id: "oidc", title: "What is OIDC?", icon: "🪪", color: "#8b5cf6" },
  { id: "oauth-vs-oidc", title: "OAuth2 vs OIDC", icon: "⚖️", color: "#f59e0b" },
  { id: "sso", title: "What is SSO?", icon: "🚪", color: "#10b981" },
  { id: "sso-vs-oauth", title: "SSO vs OAuth2 vs OIDC", icon: "🔀", color: "#ec4899" },
  { id: "roles", title: "The 4 Roles", icon: "👥", color: "#14b8a6" },
  { id: "grants", title: "Grant Types", icon: "🎫", color: "#f97316" },
  { id: "tokens", title: "Token Types", icon: "🪙", color: "#ef4444" },
  { id: "providers", title: "OIDC Providers", icon: "🏢", color: "#6366f1" },
  { id: "real-world", title: "Real-World Flows", icon: "🌍", color: "#0ea5e9" },
];

export default function OAuthGuide() {
  const [active, setActive] = useState("bigpicture");
  const [exp, setExp] = useState(null);
  const [grantDetail, setGrantDetail] = useState(null);

  const cur = sections.find(s => s.id === active);
  const curIdx = sections.findIndex(s => s.id === active);

  const C = ({ children, style: s, ...p }) => <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16, ...s }} {...p}>{children}</div>;
  const P = ({ children, bg, color }) => <span style={{ background: bg, color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 12, whiteSpace: "nowrap" }}>{children}</span>;
  const Hdr = ({ children, color }) => <div style={{ fontWeight: 800, fontSize: 15, color: color || "#1e293b", marginBottom: 8 }}>{children}</div>;

  const Expandable = ({ id, icon, title, subtitle, color, children }) => (
    <div onClick={() => setExp(exp === id ? null : id)}
      style={{ marginBottom: 8, background: exp === id ? color + "08" : "#fff", border: "1px solid", borderColor: exp === id ? color + "40" : "#e2e8f0", borderLeft: `3px solid ${color}`, borderRadius: 10, padding: 14, cursor: "pointer", transition: "all 0.15s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon && <span style={{ fontSize: 22 }}>{icon}</span>}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{subtitle}</div>}
        </div>
        <span style={{ color: "#94a3b8" }}>{exp === id ? "▲" : "▼"}</span>
      </div>
      {exp === id && <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${color}20` }}>{children}</div>}
    </div>
  );

  const renderBigPicture = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        These terms overlap and cause confusion because they solve <strong>related but different problems</strong>. Let's untangle them.
      </div>
      <div style={{ background: "#0f172a", borderRadius: 12, padding: 20, marginBottom: 16 }}>
        {[
          { label: "OAuth 2.0", desc: "A framework for AUTHORIZATION — letting apps access resources on your behalf", color: "#3b82f6", q: "\"Can this app access my photos?\"" },
          { label: "OIDC", desc: "A layer ON TOP of OAuth2 for AUTHENTICATION — proving who you are", color: "#8b5cf6", q: "\"Who is this person?\"" },
          { label: "SSO", desc: "A USER EXPERIENCE — log in once, access multiple apps", color: "#10b981", q: "\"Can I avoid logging in again?\"" },
          { label: "SAML", desc: "An older XML-based protocol for SSO — mainly used in enterprises", color: "#f59e0b", q: "\"Enterprise SSO before OIDC existed\"" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 12 : 0, alignItems: "center" }}>
            <div style={{ background: item.color, color: "#fff", padding: "6px 12px", borderRadius: 6, fontWeight: 700, fontSize: 13, minWidth: 80, textAlign: "center" }}>{item.label}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#e2e8f0", fontSize: 13 }}>{item.desc}</div>
              <div style={{ color: item.color, fontSize: 12, fontStyle: "italic", marginTop: 2 }}>{item.q}</div>
            </div>
          </div>
        ))}
      </div>
      <C style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
        <Hdr color="#1e3a5f">The Restaurant Analogy</Hdr>
        <div style={{ fontSize: 13, color: "#1e3a5f", lineHeight: 1.8 }}>
          <div><strong>OAuth 2.0</strong> = The valet parking ticket. You give the valet LIMITED access to your car (drive it, park it) but NOT full access (open the trunk, take your stuff). The valet ticket is AUTHORIZATION.</div>
          <div style={{ marginTop: 8 }}><strong>OIDC</strong> = Your driver's license. It proves WHO you are. The restaurant checks your ID. That's AUTHENTICATION.</div>
          <div style={{ marginTop: 8 }}><strong>SSO</strong> = A wristband at a resort. Show it once at the entrance, then walk into any restaurant, pool, or gym without showing ID again.</div>
          <div style={{ marginTop: 8 }}><strong>SAML</strong> = An older style of membership card (paper-based, XML-based) that does the same thing as the wristband but in a more complex way.</div>
        </div>
      </C>
      <C style={{ marginTop: 10, background: "#fef2f2", borderColor: "#fecaca" }}>
        <div style={{ fontWeight: 700, color: "#991b1b", fontSize: 13, marginBottom: 4 }}>🔑 The Key Distinction</div>
        <div style={{ fontSize: 13, color: "#991b1b", lineHeight: 1.6 }}>
          <strong>Authentication</strong> = Who are you? (proving identity)<br />
          <strong>Authorization</strong> = What can you do? (granting permissions)<br />
          OAuth2 does authorization. OIDC adds authentication on top. SSO is about doing either/both once across many apps.
        </div>
      </C>
    </div>
  );

  const renderOAuth2 = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        OAuth 2.0 is a <strong>framework for delegated authorization</strong>. It lets a user give an application limited access to their resources without sharing their password.
      </div>
      <C style={{ background: "#0f172a", marginBottom: 16, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10, fontWeight: 600 }}>THE PROBLEM OAUTH2 SOLVES</div>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: "#e2e8f0", lineHeight: 2.2 }}>
          <div><span style={{ color: "#f87171" }}>Before OAuth2:</span></div>
          <div style={{ paddingLeft: 16 }}>App: "Give me your Google password so I can read your contacts"</div>
          <div style={{ paddingLeft: 16 }}>User: 😱 "Here's my password..."</div>
          <div style={{ paddingLeft: 16, color: "#f87171" }}>→ App has FULL access to everything. Dangerous!</div>
          <div style={{ marginTop: 12 }}><span style={{ color: "#34d399" }}>With OAuth2:</span></div>
          <div style={{ paddingLeft: 16 }}>App: "Can I read your contacts? (just contacts, nothing else)"</div>
          <div style={{ paddingLeft: 16 }}>Google: "User, do you approve? [Yes/No]"</div>
          <div style={{ paddingLeft: 16 }}>User: ✅ "Yes, contacts only"</div>
          <div style={{ paddingLeft: 16, color: "#34d399" }}>→ App gets a LIMITED token. Password never shared!</div>
        </div>
      </C>
      <Hdr>What OAuth2 Does and Does NOT Do</Hdr>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <C style={{ background: "#f0fdf4", borderColor: "#86efac" }}>
          <div style={{ fontWeight: 700, color: "#166534", fontSize: 13, marginBottom: 8 }}>✅ OAuth2 DOES</div>
          {["Grant limited access to resources", "Let users approve specific permissions (scopes)", "Issue tokens instead of sharing passwords", "Support multiple grant types for different scenarios", "Define how tokens are obtained and used"].map((t, i) => (
            <div key={i} style={{ fontSize: 12, color: "#166534", lineHeight: 1.8 }}>• {t}</div>
          ))}
        </C>
        <C style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
          <div style={{ fontWeight: 700, color: "#991b1b", fontSize: 13, marginBottom: 8 }}>❌ OAuth2 does NOT</div>
          {["Tell you WHO the user is", "Provide user identity/profile", "Define a standard token format", "Handle login/authentication", "Manage sessions or single sign-on"].map((t, i) => (
            <div key={i} style={{ fontSize: 12, color: "#991b1b", lineHeight: 1.8 }}>• {t}</div>
          ))}
        </C>
      </div>
      <Expandable id="oauth-flow" icon="🔄" title="Basic OAuth2 Flow" subtitle="What happens when you click 'Sign in with Google'" color="#3b82f6">
        <div style={{ background: "#0f172a", borderRadius: 8, padding: 14, fontFamily: "monospace", fontSize: 11, color: "#e2e8f0", lineHeight: 2.4 }}>
          <div><span style={{ color: "#3b82f6" }}>1. User</span> → clicks "Connect Google Contacts" on App</div>
          <div><span style={{ color: "#3b82f6" }}>2. App</span> → redirects user to Google's authorization endpoint</div>
          <div style={{ paddingLeft: 20, color: "#64748b" }}>GET https://accounts.google.com/o/oauth2/v2/auth</div>
          <div style={{ paddingLeft: 20, color: "#64748b" }}>?client_id=APP_ID&scope=contacts.readonly&redirect_uri=...</div>
          <div><span style={{ color: "#f59e0b" }}>3. Google</span> → shows consent screen: "App wants to read your contacts"</div>
          <div><span style={{ color: "#3b82f6" }}>4. User</span> → clicks "Allow"</div>
          <div><span style={{ color: "#f59e0b" }}>5. Google</span> → redirects back to App with an authorization code</div>
          <div><span style={{ color: "#3b82f6" }}>6. App</span> → exchanges code for access token (server-to-server)</div>
          <div><span style={{ color: "#3b82f6" }}>7. App</span> → uses access token to call Google Contacts API</div>
        </div>
      </Expandable>
    </div>
  );

  const renderOIDC = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        OIDC (OpenID Connect) is an <strong>identity layer built ON TOP of OAuth 2.0</strong>. While OAuth2 only handles authorization, OIDC adds authentication — it tells you <strong>who the user is</strong>.
      </div>
      <C style={{ background: "#f5f3ff", borderColor: "#c4b5fd", marginBottom: 16 }}>
        <Hdr color="#5b21b6">OIDC = OAuth 2.0 + Identity</Hdr>
        <div style={{ fontSize: 13, color: "#5b21b6", lineHeight: 1.7 }}>
          Think of OAuth2 as a house with rooms (resources). OAuth2 gives you keys to specific rooms. OIDC adds a <strong>name badge</strong> — now the house knows who's holding the keys.
        </div>
      </C>
      <Hdr>What OIDC Adds to OAuth2</Hdr>
      {[
        { add: "ID Token", desc: "A JWT containing user identity claims (name, email, sub). OAuth2 has no concept of this.", icon: "🪪", color: "#8b5cf6" },
        { add: "UserInfo Endpoint", desc: "A standard API endpoint (/userinfo) where apps can fetch user profile details using the access token.", icon: "👤", color: "#3b82f6" },
        { add: "Standard Claims", desc: "Defined claim names: sub, name, email, picture, etc. OAuth2 doesn't standardize what data looks like.", icon: "📋", color: "#f59e0b" },
        { add: "Discovery Document", desc: "A standard URL (/.well-known/openid-configuration) where clients can find all IdP endpoints automatically.", icon: "🔍", color: "#10b981" },
        { add: "ID Token Validation", desc: "Rules for how to verify the ID token (check signature, issuer, audience, expiry) — uses JWKS.", icon: "✅", color: "#ef4444" },
      ].map((item, i) => (
        <Expandable key={i} id={`oidc-${i}`} icon={item.icon} title={item.add} subtitle={item.desc} color={item.color}>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
            {item.add === "ID Token" && (
              <div>
                <div style={{ marginBottom: 8 }}>The ID Token is the core of OIDC. It's a signed JWT that contains:</div>
                <pre style={{ background: "#0f172a", color: "#e2e8f0", padding: 12, borderRadius: 6, fontSize: 11, lineHeight: 1.7 }}>{`{
  "iss": "https://accounts.google.com",  // who issued it
  "sub": "1234567890",                   // unique user ID
  "aud": "your-app-client-id",           // your app
  "exp": 1740500000,                     // expires
  "iat": 1740496400,                     // issued at
  "name": "Jana",                        // user's name
  "email": "jana@company.com",           // user's email
  "picture": "https://..."               // profile photo
}`}</pre>
                <div style={{ marginTop: 8 }}>OAuth2's access token tells you WHAT you can do. The ID token tells you WHO you are. That's the fundamental difference.</div>
              </div>
            )}
            {item.add === "Discovery Document" && (
              <div>
                <div style={{ marginBottom: 8 }}>Every OIDC provider publishes a JSON document at a well-known URL:</div>
                <pre style={{ background: "#0f172a", color: "#e2e8f0", padding: 12, borderRadius: 6, fontSize: 11, lineHeight: 1.7 }}>{`GET https://accounts.google.com/.well-known/openid-configuration

{
  "issuer": "https://accounts.google.com",
  "authorization_endpoint": "https://accounts.google.com/o/oauth2/v2/auth",
  "token_endpoint": "https://oauth2.googleapis.com/token",
  "userinfo_endpoint": "https://openidconnect.googleapis.com/v1/userinfo",
  "jwks_uri": "https://www.googleapis.com/oauth2/v3/certs",
  "scopes_supported": ["openid", "email", "profile"],
  ...
}`}</pre>
                <div style={{ marginTop: 8 }}>This is how GCP Workload Identity Federation discovers your IdP's public keys — it reads the discovery doc to find the jwks_uri.</div>
              </div>
            )}
            {item.add === "UserInfo Endpoint" && <div>After getting an access token with the "openid" scope, your app can call the /userinfo endpoint to get the user's profile. This is an alternative to reading claims from the ID token.</div>}
            {item.add === "Standard Claims" && <div>OIDC standardizes claim names so every provider uses the same format: sub (unique ID), name, given_name, family_name, email, email_verified, picture, locale, etc. Without this standard, every provider would use different field names.</div>}
            {item.add === "ID Token Validation" && <div>OIDC specifies exactly how to verify an ID token: check signature using JWKS public keys, verify iss matches expected issuer, verify aud contains your client ID, check exp hasn't passed, check iat isn't too far in the past. This is exactly what GCP STS does during federation.</div>}
          </div>
        </Expandable>
      ))}
    </div>
  );

  const renderOAuthVsOIDC = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        The simplest way to understand it: <strong>OIDC is OAuth2 with an identity card attached</strong>.
      </div>
      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["", "OAuth 2.0", "OIDC (OpenID Connect)"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #e2e8f0", color: "#475569", fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Purpose", "Authorization (what can you access?)", "Authentication + Authorization (who are you + what can you access?)"],
              ["Answers", "\"Can this app read my photos?\"", "\"Who is this person?\" + \"Can this app read my photos?\""],
              ["Token issued", "Access Token (opaque or JWT)", "Access Token + ID Token (always JWT)"],
              ["User identity", "❌ Not provided", "✅ Provided in ID Token"],
              ["Standard claims", "❌ No standard", "✅ sub, name, email, etc."],
              ["Discovery", "❌ No standard", "✅ /.well-known/openid-configuration"],
              ["Built on", "Standalone framework", "Extension of OAuth 2.0"],
              ["Scope keyword", "Custom scopes (photos, contacts)", "\"openid\" scope triggers OIDC"],
              ["JWKS", "Not specified", "✅ Standard key publication"],
              ["Use case", "API access delegation", "User login + API access"],
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1e293b" }}>{row[0]}</td>
                <td style={{ padding: "10px 12px", color: "#3b82f6" }}>{row[1]}</td>
                <td style={{ padding: "10px 12px", color: "#8b5cf6" }}>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <C style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
        <Hdr color="#92400e">💡 The Magic Keyword: "openid"</Hdr>
        <div style={{ fontSize: 13, color: "#92400e", lineHeight: 1.7 }}>
          The difference between an OAuth2 request and an OIDC request is literally one word in the scope parameter:
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div style={{ background: "#0f172a", padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700, marginBottom: 6 }}>PURE OAUTH2</div>
            <code style={{ fontSize: 11, color: "#e2e8f0" }}>scope=contacts.readonly photos</code>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>→ Returns: access_token only</div>
          </div>
          <div style={{ background: "#0f172a", padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#8b5cf6", fontWeight: 700, marginBottom: 6 }}>OAUTH2 + OIDC</div>
            <code style={{ fontSize: 11, color: "#e2e8f0" }}>scope=<span style={{ color: "#fbbf24", fontWeight: 700 }}>openid</span> contacts.readonly</code>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>→ Returns: access_token + <span style={{ color: "#a78bfa" }}>id_token</span></div>
          </div>
        </div>
      </C>
    </div>
  );

  const renderSSO = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        SSO (Single Sign-On) is a <strong>user experience concept</strong>, not a specific protocol. It means logging in ONCE and getting access to MULTIPLE applications without logging in again.
      </div>
      <C style={{ background: "#f0fdf4", borderColor: "#86efac", marginBottom: 16 }}>
        <Hdr color="#166534">🚪 SSO in Everyday Life</Hdr>
        <div style={{ fontSize: 13, color: "#166534", lineHeight: 2 }}>
          <div>You log into your company's portal <strong>once</strong> in the morning.</div>
          <div>→ Open Gmail — already logged in ✅</div>
          <div>→ Open Slack — already logged in ✅</div>
          <div>→ Open Jira — already logged in ✅</div>
          <div>→ Open Salesforce — already logged in ✅</div>
          <div style={{ marginTop: 6, fontStyle: "italic" }}>That's SSO — one login, many apps.</div>
        </div>
      </C>
      <Hdr>SSO Can Be Implemented Using Different Protocols</Hdr>
      {[
        { proto: "SAML 2.0", desc: "XML-based, enterprise-heavy. The original SSO protocol. Uses SAML assertions (XML documents) posted between IdP and SP. Still widely used with ADFS, Okta, etc.", when: "Enterprise apps, legacy systems, ADFS ↔ Google Workspace", color: "#f59e0b", icon: "📜" },
        { proto: "OIDC", desc: "Modern, JSON/JWT-based. Built on OAuth2. Lighter, easier to implement, mobile-friendly. The newer way to do SSO.", when: "Modern web/mobile apps, APIs, GCP federation", color: "#8b5cf6", icon: "🪪" },
        { proto: "OAuth2 (loosely)", desc: "Some apps use plain OAuth2 for 'Login with Google/GitHub' — technically not SSO but achieves similar UX. Not standardized for identity.", when: "Social login, third-party app access", color: "#3b82f6", icon: "🔓" },
        { proto: "Kerberos", desc: "Ticket-based, used in Windows/Active Directory environments. Your Windows login IS your SSO — domain-joined machines get Kerberos tickets automatically.", when: "On-premise Windows networks, AD environments", color: "#64748b", icon: "🎫" },
      ].map((p, i) => (
        <Expandable key={i} id={`sso-${i}`} icon={p.icon} title={p.proto} subtitle={p.when} color={p.color}>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{p.desc}</div>
        </Expandable>
      ))}
      <C style={{ marginTop: 12, background: "#eff6ff", borderColor: "#bfdbfe" }}>
        <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 13, marginBottom: 4 }}>Key Insight</div>
        <div style={{ fontSize: 13, color: "#1e3a5f", lineHeight: 1.6 }}>
          SSO is the <strong>goal</strong> (one login, many apps). SAML and OIDC are <strong>tools</strong> to achieve that goal. Your ADFS → Google Workspace SSO can use either SAML or OIDC as the underlying protocol.
        </div>
      </C>
    </div>
  );

  const renderSSOvsOAuth = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        This is where most confusion happens. Let's clear it up with a direct comparison.
      </div>
      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["", "SSO", "OAuth 2.0", "OIDC"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #e2e8f0", fontWeight: 700, color: "#475569" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["What is it?", "A concept/goal", "A protocol/framework", "A protocol (extends OAuth2)"],
              ["Primary purpose", "One login, many apps", "Delegated authorization", "Authentication + authorization"],
              ["Answers", "\"Am I already logged in?\"", "\"What can this app access?\"", "\"Who is this user?\""],
              ["Protocol?", "No — uses SAML, OIDC, etc.", "Yes", "Yes (built on OAuth2)"],
              ["User identity?", "✅ Yes (that's the point)", "❌ No", "✅ Yes (ID Token)"],
              ["Tokens", "SAML assertions or OIDC tokens", "Access Token", "ID Token + Access Token"],
              ["User involved?", "✅ Always (user logs in)", "Sometimes (not in client_creds)", "✅ Usually"],
              ["Enterprise use", "Primary use case", "API access", "Modern SSO + API access"],
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "8px 12px", fontWeight: 700, color: "#1e293b", fontSize: 12 }}>{row[0]}</td>
                <td style={{ padding: "8px 12px", color: "#10b981", fontSize: 12 }}>{row[1]}</td>
                <td style={{ padding: "8px 12px", color: "#3b82f6", fontSize: 12 }}>{row[2]}</td>
                <td style={{ padding: "8px 12px", color: "#8b5cf6", fontSize: 12 }}>{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <C style={{ background: "#0f172a", marginBottom: 16, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10, fontWeight: 600 }}>HOW THEY RELATE</div>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: "#e2e8f0", lineHeight: 2.2 }}>
          <div>┌─────────────────────────────────────────────┐</div>
          <div>│  <span style={{ color: "#10b981", fontWeight: 700 }}>SSO</span> (the goal: log in once, use many apps) │</div>
          <div>│                                             │</div>
          <div>│  Implemented via:                           │</div>
          <div>│  ┌─────────────┐  ┌────────────────────┐   │</div>
          <div>│  │ <span style={{ color: "#f59e0b" }}>SAML 2.0</span>    │  │ <span style={{ color: "#8b5cf6" }}>OIDC</span>               │   │</div>
          <div>│  │ (XML-based)  │  │ (JSON/JWT-based)   │   │</div>
          <div>│  │             │  │                    │   │</div>
          <div>│  │             │  │ Built on:          │   │</div>
          <div>│  │             │  │ ┌────────────────┐ │   │</div>
          <div>│  │             │  │ │ <span style={{ color: "#3b82f6" }}>OAuth 2.0</span>      │ │   │</div>
          <div>│  │             │  │ │ (authorization)│ │   │</div>
          <div>│  │             │  │ └────────────────┘ │   │</div>
          <div>│  └─────────────┘  └────────────────────┘   │</div>
          <div>└─────────────────────────────────────────────┘</div>
        </div>
      </C>
      <Hdr>In Your GCP Federation Setup</Hdr>
      <C style={{ background: "#f5f3ff", borderColor: "#c4b5fd" }}>
        <div style={{ fontSize: 13, color: "#5b21b6", lineHeight: 1.8 }}>
          <strong>SSO</strong> — Your users log into AD once and access Google Workspace (SAML-based SSO via ADFS)<br />
          <strong>OIDC</strong> — Your app gets an OIDC token from the IdP to federate into GCP (Workload Identity Federation)<br />
          <strong>OAuth2</strong> — Under the hood, the token exchange with GCP STS uses OAuth2 grant type (token-exchange)<br />
          <strong>All three</strong> are involved in your architecture, at different layers!
        </div>
      </C>
    </div>
  );

  const renderRoles = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        OAuth2 defines four roles. Understanding these makes all the grant flows make sense.
      </div>
      {[
        {
          role: "Resource Owner", simple: "The user who owns the data", icon: "👤", color: "#3b82f6",
          example: "You — the person whose Google Contacts are being accessed",
          inFederation: "The AD user whose identity is used to authenticate",
          analogy: "The homeowner who decides who gets a key"
        },
        {
          role: "Client", simple: "The application requesting access", icon: "💻", color: "#8b5cf6",
          example: "A contacts sync app that wants to read your Google Contacts",
          inFederation: "Your app that requests an OIDC token from the IdP",
          analogy: "The neighbor asking to borrow your lawnmower"
        },
        {
          role: "Authorization Server", simple: "The server that issues tokens", icon: "🏛️", color: "#f59e0b",
          example: "Google's OAuth2 server (accounts.google.com)",
          inFederation: "Your IdP (issues OIDC tokens) + GCP STS (issues federated tokens)",
          analogy: "The locksmith who makes limited-access keys"
        },
        {
          role: "Resource Server", simple: "The API/server that holds the protected data", icon: "🗄️", color: "#10b981",
          example: "Google Contacts API, Google Drive API",
          inFederation: "Google Workspace Admin SDK Directory API",
          analogy: "The house with the lawnmower inside"
        },
      ].map((r, i) => (
        <Expandable key={i} id={`role-${i}`} icon={r.icon} title={r.role} subtitle={r.simple} color={r.color}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Example", text: r.example },
              { label: "In Your Federation Setup", text: r.inFederation },
              { label: "Analogy", text: r.analogy },
            ].map((item, j) => (
              <div key={j} style={{ background: "#f8fafc", borderRadius: 6, padding: "8px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </Expandable>
      ))}
      <C style={{ marginTop: 12, background: "#0f172a" }}>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 600 }}>IN YOUR GCP FEDERATION FLOW</div>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: "#e2e8f0", lineHeight: 2.2 }}>
          <div><span style={{ color: "#3b82f6" }}>Resource Owner</span> → AD User (or the app itself in client_creds)</div>
          <div><span style={{ color: "#8b5cf6" }}>Client</span>         → Your application</div>
          <div><span style={{ color: "#f59e0b" }}>Auth Server</span>    → IdP (token) + GCP STS (exchange) + IAM (impersonation)</div>
          <div><span style={{ color: "#10b981" }}>Resource Server</span> → Workspace Directory API</div>
        </div>
      </C>
    </div>
  );

  const grants = [
    {
      name: "Authorization Code", code: "authorization_code", color: "#3b82f6",
      forWhom: "Web apps where a user logs in via browser",
      security: "Most secure for user-facing apps",
      userInvolved: true,
      simple: "User logs in via browser → gets a code → app exchanges code for token",
      flow: [
        "User clicks 'Login' on your app",
        "App redirects user to IdP login page",
        "User enters credentials at IdP",
        "IdP redirects back to app with authorization CODE (not token)",
        "App's backend exchanges code for tokens (server-to-server)",
        "App receives access_token + id_token"
      ],
      why: "The token never passes through the browser URL — the code is exchanged server-side. This is critical because browser URLs can be logged, cached, or leaked.",
      example: `GET https://idp.com/authorize
  ?response_type=code
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=https://yourapp.com/callback
  &scope=openid email
  &state=random123

→ User logs in
→ Redirect to: https://yourapp.com/callback?code=AUTH_CODE&state=random123

POST https://idp.com/oauth2/token
  grant_type=authorization_code
  &code=AUTH_CODE
  &client_id=YOUR_CLIENT_ID
  &client_secret=YOUR_SECRET
  &redirect_uri=https://yourapp.com/callback`
    },
    {
      name: "Authorization Code + PKCE", code: "authorization_code + PKCE", color: "#6366f1",
      forWhom: "Mobile apps, SPAs (single-page apps), public clients",
      security: "Secure without client secret",
      userInvolved: true,
      simple: "Same as auth code but with an extra proof step — no client secret needed",
      flow: [
        "App generates a random code_verifier and code_challenge",
        "App redirects user to IdP with code_challenge",
        "User logs in, IdP redirects back with authorization code",
        "App exchanges code + code_verifier for tokens",
        "IdP verifies code_verifier matches original code_challenge",
        "IdP returns tokens"
      ],
      why: "Mobile apps and SPAs can't safely store a client_secret (users can decompile the app). PKCE replaces the secret with a cryptographic proof that the same app that started the flow is finishing it.",
      example: `// Step 1: Generate PKCE values
code_verifier = random_string(43 characters)
code_challenge = BASE64URL(SHA256(code_verifier))

// Step 2: Authorize with challenge
GET https://idp.com/authorize
  ?response_type=code
  &client_id=YOUR_CLIENT_ID
  &code_challenge=CHALLENGE
  &code_challenge_method=S256
  &redirect_uri=myapp://callback
  &scope=openid

// Step 3: Exchange with verifier
POST https://idp.com/oauth2/token
  grant_type=authorization_code
  &code=AUTH_CODE
  &code_verifier=VERIFIER     ← proves it's the same app
  &client_id=YOUR_CLIENT_ID`
    },
    {
      name: "Client Credentials", code: "client_credentials", color: "#10b981",
      forWhom: "Service-to-service (machine-to-machine), no user involved",
      security: "App authenticates as itself",
      userInvolved: false,
      simple: "App sends its own ID + secret, gets a token. No user login needed.",
      flow: [
        "App sends client_id + client_secret to IdP's token endpoint",
        "IdP verifies the credentials",
        "IdP returns an access token (and possibly a JWT)",
        "App uses the token to access APIs"
      ],
      why: "When there's no human user — just one service talking to another. Think: background jobs, cron tasks, microservice-to-microservice communication.",
      example: `POST https://idp.com/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=YOUR_CLIENT_ID
&client_secret=YOUR_CLIENT_SECRET
&scope=openid

→ Response:
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600
}`
    },
    {
      name: "Device Code", code: "urn:ietf:params:oauth:grant-type:device_code", color: "#f59e0b",
      forWhom: "Smart TVs, CLI tools, IoT devices — no browser on the device",
      security: "User approves on separate device",
      userInvolved: true,
      simple: "Device shows a code, user goes to a URL on their phone/laptop to approve",
      flow: [
        "Device requests a device code from IdP",
        "IdP returns a device_code + user_code + verification URL",
        "Device displays: 'Go to https://idp.com/device and enter code: ABCD-1234'",
        "User opens URL on their phone/laptop, enters code, logs in",
        "Device polls IdP's token endpoint until user approves",
        "IdP returns tokens to device"
      ],
      why: "Smart TVs and CLI tools don't have a browser for redirects. The user authenticates on a separate device that does have a browser.",
      example: `// Step 1: Device requests code
POST https://idp.com/oauth2/device/code
  client_id=YOUR_CLIENT_ID&scope=openid

→ { "device_code": "xyz", "user_code": "ABCD-1234",
    "verification_uri": "https://idp.com/device" }

// Step 2: Device polls until approved
POST https://idp.com/oauth2/token
  grant_type=urn:ietf:params:oauth:grant-type:device_code
  &device_code=xyz
  &client_id=YOUR_CLIENT_ID

→ { "error": "authorization_pending" }  // keep polling
→ { "access_token": "eyJ..." }          // user approved!`
    },
    {
      name: "Resource Owner Password (ROPC)", code: "password", color: "#ef4444",
      forWhom: "Legacy apps only — DEPRECATED, avoid if possible",
      security: "⚠️ Least secure — user gives password to the app",
      userInvolved: true,
      simple: "User types username + password directly into the app, app sends them to IdP",
      flow: [
        "User enters username + password in the app (not at IdP)",
        "App sends credentials directly to IdP's token endpoint",
        "IdP validates credentials",
        "IdP returns tokens"
      ],
      why: "This defeats the purpose of OAuth2 (not sharing passwords). Only use for migrating legacy apps that can't do redirects. Many IdPs no longer support this.",
      example: `POST https://idp.com/oauth2/token

grant_type=password
&username=jana@company.com
&password=user_password        ← 😱 password sent to app!
&client_id=YOUR_CLIENT_ID
&client_secret=YOUR_SECRET
&scope=openid`
    },
    {
      name: "Token Exchange", code: "urn:ietf:params:oauth:grant-type:token-exchange", color: "#8b5cf6",
      forWhom: "Exchanging one token type for another — exactly what GCP STS uses",
      security: "Trust-based exchange between systems",
      userInvolved: false,
      simple: "Trade a token from System A for a token from System B. This is GCP federation!",
      flow: [
        "App obtains a token from your IdP (any grant type above)",
        "App sends that token to GCP STS",
        "GCP STS validates the token (signature, issuer, audience)",
        "GCP STS issues a GCP federated token in exchange"
      ],
      why: "This is the grant type used in Workload Identity Federation. Your IdP token is exchanged for a GCP token. It's defined in RFC 8693.",
      example: `POST https://sts.googleapis.com/v1/token

grant_type=urn:ietf:params:oauth:grant-type:token-exchange
&audience=//iam.googleapis.com/projects/PROJECT/locations/global/...
&scope=https://www.googleapis.com/auth/cloud-platform
&requested_token_type=urn:ietf:params:oauth:token-type:access_token
&subject_token=eyJhbGciOiJSUzI1NiIs...   ← your IdP token
&subject_token_type=urn:ietf:params:oauth:token-type:jwt`
    },
    {
      name: "JWT Bearer", code: "urn:ietf:params:oauth:grant-type:jwt-bearer", color: "#14b8a6",
      forWhom: "Service accounts asserting identity — used for Workspace domain-wide delegation",
      security: "Strong — requires signed JWT",
      userInvolved: false,
      simple: "App creates and signs a JWT, exchanges it for an access token. Used for SA + Workspace!",
      flow: [
        "App creates a JWT with iss (SA email), sub (admin to impersonate), scope, aud",
        "App signs the JWT with the SA's private key (or via signJwt API)",
        "App POSTs the signed JWT to Google's token endpoint",
        "Google validates and returns an access token with the subject baked in"
      ],
      why: "This is how your service account gets a Workspace-authorized token WITH subject impersonation. The generateAccessToken API doesn't support subject — but JWT bearer does.",
      example: `// JWT payload:
{
  "iss": "sa@project.iam.gserviceaccount.com",
  "sub": "admin@yourdomain.com",        ← impersonated user
  "scope": "https://www.googleapis.com/auth/admin.directory.user.readonly",
  "aud": "https://oauth2.googleapis.com/token",
  "exp": 1740500000, "iat": 1740496400
}

POST https://oauth2.googleapis.com/token
  grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer
  &assertion=SIGNED_JWT`
    },
  ];

  const renderGrants = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 12 }}>
        Grant types define <strong>how an application obtains tokens</strong>. Different scenarios require different grants. Click each to see the full flow.
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        <button onClick={() => setGrantDetail(null)} style={{ padding: "5px 12px", borderRadius: 20, border: "1px solid #e2e8f0", background: !grantDetail ? "#0f172a" : "#fff", color: !grantDetail ? "#fff" : "#475569", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>All</button>
        <button onClick={() => setGrantDetail("user")} style={{ padding: "5px 12px", borderRadius: 20, border: "none", background: grantDetail === "user" ? "#3b82f6" : "#3b82f615", color: grantDetail === "user" ? "#fff" : "#3b82f6", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>User Login</button>
        <button onClick={() => setGrantDetail("machine")} style={{ padding: "5px 12px", borderRadius: 20, border: "none", background: grantDetail === "machine" ? "#10b981" : "#10b98115", color: grantDetail === "machine" ? "#fff" : "#10b981", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Machine-to-Machine</button>
        <button onClick={() => setGrantDetail("federation")} style={{ padding: "5px 12px", borderRadius: 20, border: "none", background: grantDetail === "federation" ? "#8b5cf6" : "#8b5cf615", color: grantDetail === "federation" ? "#fff" : "#8b5cf6", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>GCP Federation</button>
      </div>
      {grants.filter(g => {
        if (!grantDetail) return true;
        if (grantDetail === "user") return g.userInvolved && g.code !== "password";
        if (grantDetail === "machine") return !g.userInvolved || g.code === "password";
        if (grantDetail === "federation") return ["client_credentials", "urn:ietf:params:oauth:grant-type:token-exchange", "urn:ietf:params:oauth:grant-type:jwt-bearer"].includes(g.code);
        return true;
      }).map((g, i) => (
        <Expandable key={g.code} id={`grant-${g.code}`} icon={g.userInvolved ? "👤" : "🤖"} title={g.name} subtitle={g.simple} color={g.color}>
          <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
            <P bg={g.color + "15"} color={g.color}>{g.forWhom}</P>
            <P bg={g.userInvolved ? "#eff6ff" : "#f0fdf4"} color={g.userInvolved ? "#3b82f6" : "#10b981"}>{g.userInvolved ? "User involved" : "No user involved"}</P>
            <P bg="#f8fafc" color="#475569">{g.security}</P>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase" }}>Flow Steps</div>
            {g.flow.map((step, j) => (
              <div key={j} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: g.color + "20", color: g.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{j + 1}</div>
                <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{step}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 6, padding: "8px 10px", fontSize: 12, color: "#92400e", lineHeight: 1.6, marginBottom: 10 }}>
            💡 <strong>Why this grant?</strong> {g.why}
          </div>
          <pre style={{ background: "#0f172a", color: "#e2e8f0", padding: 12, borderRadius: 6, fontSize: 11, overflowX: "auto", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{g.example}</pre>
        </Expandable>
      ))}
    </div>
  );

  const renderTokens = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        OAuth2 and OIDC use different types of tokens. Each serves a different purpose.
      </div>
      {[
        {
          name: "Access Token", icon: "🔑", color: "#3b82f6",
          what: "Grants access to protected resources (APIs). Like a hotel key card — opens specific doors.",
          format: "Can be opaque (random string) OR a JWT. The format is NOT specified by OAuth2.",
          lifetime: "Short-lived (minutes to hours). Must be refreshed.",
          contains: "If opaque: just a random string the server looks up. If JWT: can contain scopes, client_id, exp, etc.",
          usedIn: "Authorization header: Bearer eyJ...",
          inYourSetup: "The GCP federated token and the SA impersonated token are both access tokens."
        },
        {
          name: "ID Token", icon: "🪪", color: "#8b5cf6",
          what: "Proves the user's identity. Like a driver's license — says who you are. OIDC only.",
          format: "Always a JWT. Must be signed. Can be verified without calling the server.",
          lifetime: "Short-lived. Should not be used to call APIs — that's what access tokens are for.",
          contains: "iss, sub, aud, exp, iat, name, email, picture — user identity claims.",
          usedIn: "Decoded by the app to know who logged in. NOT sent to APIs as Bearer token.",
          inYourSetup: "The IdP OIDC token you get and pass to GCP STS for exchange."
        },
        {
          name: "Refresh Token", icon: "🔄", color: "#10b981",
          what: "Used to get a new access token when the current one expires. Like a season pass renewal slip.",
          format: "Opaque string. Never a JWT. Must be stored securely.",
          lifetime: "Long-lived (days, weeks, or until revoked). The most sensitive token.",
          contains: "Just a reference — the server looks it up to issue new access tokens.",
          usedIn: "POST to token endpoint with grant_type=refresh_token",
          inYourSetup: "Not typically used in machine-to-machine federation. More common in user-facing apps."
        },
      ].map((t, i) => (
        <Expandable key={i} id={`token-${i}`} icon={t.icon} title={t.name} subtitle={t.what} color={t.color}>
          {[
            { label: "Format", text: t.format },
            { label: "Lifetime", text: t.lifetime },
            { label: "Contains", text: t.contains },
            { label: "Used As", text: t.usedIn },
            { label: "In Your Federation Setup", text: t.inYourSetup },
          ].map((item, j) => (
            <div key={j} style={{ background: "#f8fafc", borderRadius: 6, padding: "8px 12px", marginBottom: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{item.text}</div>
            </div>
          ))}
        </Expandable>
      ))}
      <C style={{ marginTop: 12, background: "#0f172a" }}>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 600 }}>TOKENS IN YOUR GCP FEDERATION CHAIN</div>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: "#e2e8f0", lineHeight: 2.4 }}>
          <div><span style={{ color: "#8b5cf6" }}>ID Token (JWT)</span>     ← from your IdP (proves app identity)</div>
          <div>        ↓ exchanged at STS</div>
          <div><span style={{ color: "#3b82f6" }}>Access Token</span>       ← GCP federated token (opaque)</div>
          <div>        ↓ used to impersonate SA</div>
          <div><span style={{ color: "#f59e0b" }}>Access Token</span>       ← SA token (for Workspace API calls)</div>
          <div>        ↓ used with Bearer header</div>
          <div><span style={{ color: "#10b981" }}>API Response</span>       ← Workspace Directory data</div>
        </div>
      </C>
    </div>
  );

  const renderProviders = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        An OIDC Provider (IdP — Identity Provider) is any server that implements the OIDC specification. It authenticates users and issues tokens.
      </div>
      <Hdr>What Makes Something an "OIDC Provider"?</Hdr>
      <C style={{ marginBottom: 16, background: "#f5f3ff", borderColor: "#c4b5fd" }}>
        <div style={{ fontSize: 13, color: "#5b21b6", lineHeight: 1.8 }}>
          To be an OIDC Provider, a system must expose these standard endpoints:
        </div>
        {[
          { ep: "Discovery", url: "/.well-known/openid-configuration", desc: "Lists all other endpoints and capabilities" },
          { ep: "Authorization", url: "/authorize", desc: "Where users log in (browser redirect)" },
          { ep: "Token", url: "/oauth2/token", desc: "Where apps exchange codes/credentials for tokens" },
          { ep: "JWKS", url: "/jwks or /keys", desc: "Public keys for verifying token signatures" },
          { ep: "UserInfo", url: "/userinfo", desc: "User profile info (optional but standard)" },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "center" }}>
            <code style={{ fontSize: 11, color: "#5b21b6", fontWeight: 600, minWidth: 100 }}>{e.ep}</code>
            <code style={{ fontSize: 11, color: "#64748b", minWidth: 180 }}>{e.url}</code>
            <span style={{ fontSize: 12, color: "#475569" }}>{e.desc}</span>
          </div>
        ))}
      </C>
      <Hdr>Common OIDC Providers</Hdr>
      {[
        { name: "Okta", type: "Cloud IdP", color: "#3b82f6", desc: "Enterprise identity platform. Common in mid-to-large companies. Great OIDC support.", issuer: "https://your-org.okta.com" },
        { name: "Azure AD (Entra ID)", type: "Cloud IdP", color: "#0078d4", desc: "Microsoft's identity platform. If you have Office 365, you likely have this. Supports OIDC + SAML.", issuer: "https://login.microsoftonline.com/{tenant}/v2.0" },
        { name: "Auth0", type: "Cloud IdP", color: "#eb5424", desc: "Developer-friendly identity platform. Easy to set up. Good for both consumer and enterprise.", issuer: "https://your-domain.auth0.com/" },
        { name: "ADFS", type: "On-Premise", color: "#00bcf2", desc: "Microsoft's on-premise federation server. Supports OIDC (since v3.0) and SAML. Your current setup!", issuer: "https://adfs.company.com/adfs" },
        { name: "Ping Identity", type: "Enterprise IdP", color: "#b1d52f", desc: "Enterprise-grade identity. Common in financial services and healthcare.", issuer: "https://sso.company.com" },
        { name: "Keycloak", type: "Open Source", color: "#4d4d4d", desc: "Red Hat's open-source identity platform. Self-hosted. Full OIDC support.", issuer: "https://keycloak.company.com/auth/realms/{realm}" },
        { name: "Google", type: "Cloud IdP", color: "#4285f4", desc: "Google accounts as an OIDC provider. Used for 'Sign in with Google'.", issuer: "https://accounts.google.com" },
        { name: "AWS Cognito", type: "Cloud IdP", color: "#ff9900", desc: "AWS's identity service. Can be both a user pool (IdP) and federate to other IdPs.", issuer: "https://cognito-idp.{region}.amazonaws.com/{poolId}" },
      ].map((p, i) => (
        <Expandable key={i} id={`prov-${i}`} icon="🏢" title={p.name} subtitle={p.type} color={p.color}>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 8 }}>{p.desc}</div>
          <code style={{ display: "block", background: "#0f172a", color: "#86efac", padding: "8px 12px", borderRadius: 6, fontSize: 11 }}>Issuer: {p.issuer}</code>
        </Expandable>
      ))}
    </div>
  );

  const renderRealWorld = () => (
    <div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
        Here's how OAuth2, OIDC, and SSO show up in real scenarios you encounter every day.
      </div>
      {[
        {
          title: "\"Sign in with Google\" on a website",
          protocols: ["OIDC", "OAuth2"],
          color: "#4285f4",
          flow: "Website redirects you to Google → you log in → Google sends back an ID token (who you are) + access token (to read your profile). The website uses the ID token to create your account, and the access token to fetch your profile photo.",
          grant: "Authorization Code + PKCE"
        },
        {
          title: "Enterprise SSO: Log into AD, access Google Workspace",
          protocols: ["SSO", "SAML or OIDC"],
          color: "#10b981",
          flow: "You log into your Windows machine (Kerberos/AD). When you open Gmail, ADFS intercepts, verifies you're already authenticated, and sends a SAML assertion or OIDC token to Google. You're logged in without entering credentials again.",
          grant: "N/A (SAML) or Authorization Code (OIDC)"
        },
        {
          title: "Your app → GCP → Workspace Directory API",
          protocols: ["OIDC", "OAuth2 Token Exchange", "OAuth2 JWT Bearer"],
          color: "#8b5cf6",
          flow: "Your app gets an OIDC token from IdP (client_credentials) → exchanges it at GCP STS (token-exchange) → impersonates SA (signJwt + jwt-bearer) → calls Workspace API. Three different OAuth2 grants in one flow!",
          grant: "Client Credentials → Token Exchange → JWT Bearer"
        },
        {
          title: "Mobile app accessing a REST API",
          protocols: ["OAuth2", "OIDC"],
          color: "#f59e0b",
          flow: "Mobile app redirects to IdP's login page in a browser → user logs in → app gets auth code → exchanges for tokens using PKCE. Access token is used for API calls, ID token identifies the user.",
          grant: "Authorization Code + PKCE"
        },
        {
          title: "CLI tool (gcloud, aws cli) logging you in",
          protocols: ["OAuth2"],
          color: "#14b8a6",
          flow: "CLI prints 'Go to this URL and enter this code: ABCD-1234'. You open the URL on your browser, log in, enter the code. CLI polls until approved, then gets tokens.",
          grant: "Device Code"
        },
        {
          title: "Microservice A calling Microservice B",
          protocols: ["OAuth2"],
          color: "#ef4444",
          flow: "Service A authenticates with its own client_id and client_secret to get an access token. Uses that token to call Service B's API. No human involved at all.",
          grant: "Client Credentials"
        },
      ].map((s, i) => (
        <Expandable key={i} id={`rw-${i}`} icon="🌍" title={s.title} subtitle={s.grant} color={s.color}>
          <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
            {s.protocols.map(p => <P key={p} bg={s.color + "15"} color={s.color}>{p}</P>)}
          </div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 8 }}>{s.flow}</div>
          <div style={{ background: "#f8fafc", borderRadius: 6, padding: "6px 10px", fontSize: 12, color: "#64748b" }}>
            <strong>Grant type:</strong> {s.grant}
          </div>
        </Expandable>
      ))}
      <C style={{ marginTop: 12, background: "#eff6ff", borderColor: "#bfdbfe" }}>
        <Hdr color="#1e3a5f">Your Federation Uses 3 Grants in Sequence</Hdr>
        <div style={{ background: "#0f172a", borderRadius: 8, padding: 14, fontFamily: "monospace", fontSize: 11, color: "#e2e8f0", lineHeight: 2.4 }}>
          <div><span style={{ color: "#3b82f6" }}>1. client_credentials</span>     → Get OIDC token from your IdP</div>
          <div><span style={{ color: "#8b5cf6" }}>2. token-exchange</span>          → Swap IdP token for GCP token at STS</div>
          <div><span style={{ color: "#10b981" }}>3. jwt-bearer</span>              → SA + subject → Workspace access token</div>
          <div style={{ color: "#64748b", marginTop: 6 }}>Three grants, one flow, zero stored passwords!</div>
        </div>
      </C>
    </div>
  );

  const renderContent = () => {
    switch (active) {
      case "bigpicture": return renderBigPicture();
      case "oauth2": return renderOAuth2();
      case "oidc": return renderOIDC();
      case "oauth-vs-oidc": return renderOAuthVsOIDC();
      case "sso": return renderSSO();
      case "sso-vs-oauth": return renderSSOvsOAuth();
      case "roles": return renderRoles();
      case "grants": return renderGrants();
      case "tokens": return renderTokens();
      case "providers": return renderProviders();
      case "real-world": return renderRealWorld();
      default: return null;
    }
  };

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", maxWidth: 860, margin: "0 auto", padding: 16, background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>OAuth2, OIDC & SSO Explained</h1>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Protocols, Grant Types, Tokens & How They All Connect</p>
      </div>
      <div style={{ display: "flex", gap: 5, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => { setActive(s.id); setExp(null); }}
            style={{ padding: "7px 10px", borderRadius: 8, border: "none", background: active === s.id ? s.color : "#fff", color: active === s.id ? "#fff" : "#475569", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", boxShadow: active === s.id ? `0 2px 8px ${s.color}40` : "0 1px 2px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 12 }}>{s.icon}</span> {s.title}
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
        <button onClick={() => { if (curIdx > 0) { setActive(sections[curIdx - 1].id); setExp(null); } }}
          disabled={curIdx === 0}
          style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #e2e8f0", background: curIdx === 0 ? "#f1f5f9" : "#fff", color: curIdx === 0 ? "#cbd5e1" : "#475569", fontSize: 12, fontWeight: 600, cursor: curIdx === 0 ? "default" : "pointer" }}>
          ← Previous
        </button>
        <span style={{ fontSize: 11, color: "#94a3b8", alignSelf: "center" }}>{curIdx + 1} / {sections.length}</span>
        <button onClick={() => { if (curIdx < sections.length - 1) { setActive(sections[curIdx + 1].id); setExp(null); } }}
          disabled={curIdx === sections.length - 1}
          style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: curIdx === sections.length - 1 ? "#e2e8f0" : cur.color, color: "#fff", fontSize: 12, fontWeight: 600, cursor: curIdx === sections.length - 1 ? "default" : "pointer" }}>
          Next →
        </button>
      </div>
    </div>
  );
}
