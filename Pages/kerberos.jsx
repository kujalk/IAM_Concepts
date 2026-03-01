import { useState } from "react";

const sections = ["Overview","The Parties","Key Concepts","The Flow","Keytab","Browser Auth","AD & Renewal","Golden Ticket","Quiz"];

const PartyCard = ({ icon, name, aka, desc, color }) => (
  <div className={`border-2 rounded-xl p-5 ${color} transition-all hover:scale-105 cursor-default`}>
    <div className="text-3xl mb-2">{icon}</div>
    <h3 className="text-lg font-bold mb-1">{name}</h3>
    {aka && <p className="text-xs font-mono opacity-70 mb-2">{aka}</p>}
    <p className="text-sm leading-relaxed">{desc}</p>
  </div>
);

const StepCard = ({ num, title, desc, detail, color, expanded, onToggle }) => (
  <div className={`border-2 rounded-xl overflow-hidden ${color} transition-all`}>
    <div className="p-4 cursor-pointer flex items-start gap-3" onClick={onToggle}>
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center font-bold text-sm">{num}</span>
      <div className="flex-1">
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs mt-1 opacity-80">{desc}</p>
      </div>
      <span className="text-xs mt-1">{expanded ? "▲" : "▼"}</span>
    </div>
    {expanded && (
      <div className="px-4 pb-4 ml-11">
        <div className="bg-white bg-opacity-20 rounded-lg p-3 text-xs leading-relaxed">{detail}</div>
      </div>
    )}
  </div>
);

const Analogy = ({ children }) => (
  <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 my-4">
    <div className="flex items-center gap-2 mb-2"><span className="text-xl">🎭</span><span className="font-bold text-amber-800 text-sm">Real-World Analogy</span></div>
    <p className="text-sm text-amber-900 leading-relaxed">{children}</p>
  </div>
);

const InfoBox = ({ title, children, emoji = "💡" }) => (
  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 my-4">
    <div className="flex items-center gap-2 mb-2"><span className="text-xl">{emoji}</span><span className="font-bold text-blue-800 text-sm">{title}</span></div>
    <div className="text-sm text-blue-900 leading-relaxed">{children}</div>
  </div>
);

const WarnBox = ({ children }) => (
  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 my-4">
    <div className="flex items-center gap-2 mb-2"><span className="text-xl">⚠️</span><span className="font-bold text-red-800 text-sm">Security Warning</span></div>
    <p className="text-sm text-red-900 leading-relaxed">{children}</p>
  </div>
);

/* ── Sequence Diagram Component ── */
const SeqDiagram = () => {
  const actors = [
    { id: "client", label: "Client\n(Your PC)", x: 80, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "as", label: "AS\n(Auth Service)", x: 280, color: "#8B5CF6", bg: "#F5F3FF" },
    { id: "tgs", label: "TGS\n(Ticket Granting)", x: 480, color: "#6D28D9", bg: "#EDE9FE" },
    { id: "srv", label: "App Server\n(Service)", x: 680, color: "#059669", bg: "#ECFDF5" },
  ];
  const msgs = [
    { from: 0, to: 1, y: 100, label: "1. AS-REQ", sub: "Username + Encrypted Timestamp (Pre-Auth)", color: "#3B82F6", dash: false },
    { from: 1, to: 0, y: 155, label: "2. AS-REP", sub: "TGT (sealed w/ KRBTGT key) + Session Key₁", color: "#8B5CF6", dash: false },
    { from: 0, to: 0, y: 210, label: "", sub: "Client caches TGT + Session Key₁ in LSA memory", color: "#6B7280", dash: true, self: true },
    { from: 0, to: 2, y: 265, label: "3. TGS-REQ", sub: "TGT + Authenticator (enc w/ SK₁) + Target SPN", color: "#3B82F6", dash: false },
    { from: 2, to: 0, y: 320, label: "4. TGS-REP", sub: "Service Ticket (sealed w/ service key) + Session Key₂", color: "#6D28D9", dash: false },
    { from: 0, to: 3, y: 385, label: "5. AP-REQ", sub: "Service Ticket + Authenticator (enc w/ SK₂)", color: "#3B82F6", dash: false },
    { from: 3, to: 0, y: 440, label: "6. AP-REP", sub: "Mutual Auth: Server proves identity w/ SK₂", color: "#059669", dash: false },
  ];
  const H = 500, W = 780;
  return (
    <div className="overflow-x-auto my-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[700px]" style={{ maxHeight: 520 }}>
        <defs>
          <marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#374151" /></marker>
          <marker id="ahb" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#8B5CF6" /></marker>
          <marker id="ahg" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#059669" /></marker>
          <filter id="ds" x="-4%" y="-4%" width="108%" height="108%"><feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.1"/></filter>
        </defs>
        {/* Actor boxes */}
        {actors.map((a, i) => (
          <g key={i}>
            <rect x={a.x - 55} y={10} width={110} height={48} rx={8} fill={a.bg} stroke={a.color} strokeWidth={2} filter="url(#ds)" />
            {a.label.split("\n").map((l, li) => (
              <text key={li} x={a.x} y={30 + li * 15} textAnchor="middle" fontSize={li === 0 ? 12 : 10} fontWeight={li === 0 ? "bold" : "normal"} fill={a.color}>{l}</text>
            ))}
            {/* Lifeline */}
            <line x1={a.x} y1={58} x2={a.x} y2={H - 20} stroke={a.color} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.35} />
          </g>
        ))}
        {/* Phase backgrounds */}
        <rect x={5} y={82} width={W - 10} height={140} rx={6} fill="#F0F9FF" opacity={0.5} />
        <text x={15} y={96} fontSize={9} fontWeight="bold" fill="#1E40AF" opacity={0.7}>PHASE 1 — Get TGT</text>
        <rect x={5} y={242} width={W - 10} height={100} rx={6} fill="#FAF5FF" opacity={0.5} />
        <text x={15} y={256} fontSize={9} fontWeight="bold" fill="#5B21B6" opacity={0.7}>PHASE 2 — Get Service Ticket</text>
        <rect x={5} y={362} width={W - 10} height={100} rx={6} fill="#ECFDF5" opacity={0.5} />
        <text x={15} y={376} fontSize={9} fontWeight="bold" fill="#065F46" opacity={0.7}>PHASE 3 — Access Service</text>
        {/* Messages */}
        {msgs.map((m, i) => {
          if (m.self) {
            const cx = actors[m.from].x;
            const rw = 240;
            const rx = Math.max(5, cx - rw / 2);
            return (
              <g key={i}>
                <rect x={rx} y={m.y - 12} width={rw} height={24} rx={4} fill="#F9FAFB" stroke="#D1D5DB" strokeWidth={1} strokeDasharray="4,3" />
                <text x={rx + rw / 2} y={m.y + 4} textAnchor="middle" fontSize={9} fill="#6B7280" fontStyle="italic">{m.sub}</text>
              </g>
            );
          }
          const x1 = actors[m.from].x, x2 = actors[m.to].x;
          const dir = x2 > x1 ? 1 : -1;
          const lx1 = x1 + dir * 8, lx2 = x2 - dir * 8;
          const mid = (lx1 + lx2) / 2;
          const mkr = m.color === "#059669" ? "url(#ahg)" : m.color === "#8B5CF6" || m.color === "#6D28D9" ? "url(#ahb)" : "url(#ah)";
          return (
            <g key={i}>
              <line x1={lx1} y1={m.y} x2={lx2} y2={m.y} stroke={m.color} strokeWidth={2} markerEnd={mkr} strokeDasharray={m.dash ? "6,3" : "none"} />
              <rect x={mid - 55} y={m.y - 22} width={110} height={16} rx={4} fill={m.color} opacity={0.9} />
              <text x={mid} y={m.y - 11} textAnchor="middle" fontSize={10} fontWeight="bold" fill="white">{m.label}</text>
              <text x={mid} y={m.y + 14} textAnchor="middle" fontSize={8.5} fill="#4B5563">{m.sub}</text>
            </g>
          );
        })}
        {/* Legend */}
        <rect x={W - 200} y={H - 40} width={190} height={30} rx={6} fill="#F9FAFB" stroke="#E5E7EB" />
        <text x={W - 190} y={H - 20} fontSize={8} fill="#6B7280">SK₁ = TGT Session Key | SK₂ = Service Session Key</text>
      </svg>
    </div>
  );
};

/* ── Browser SSPI Diagram ── */
const BrowserDiagram = () => {
  const W = 780, H = 520;
  const actors = [
    { label: "Browser", sub: "(Chrome/Edge)", x: 80, c: "#2563EB", bg: "#EFF6FF" },
    { label: "SSPI / LSA", sub: "(Windows Kernel)", x: 250, c: "#7C3AED", bg: "#F5F3FF" },
    { label: "KDC", sub: "(Domain Controller)", x: 450, c: "#9333EA", bg: "#FAF5FF" },
    { label: "Web Server", sub: "(IIS / Apache)", x: 650, c: "#059669", bg: "#ECFDF5" },
  ];
  const msgs = [
    { f: 0, t: 3, y: 95, lbl: "1. HTTP GET /page", sub: "No auth headers", c: "#6B7280" },
    { f: 3, t: 0, y: 145, lbl: "2. 401 Unauthorized", sub: "WWW-Authenticate: Negotiate", c: "#DC2626" },
    { f: 0, t: 1, y: 200, lbl: "3. InitializeSecurityContext()", sub: "Browser calls SSPI with target SPN", c: "#2563EB" },
    { f: 1, t: 2, y: 255, lbl: "4. TGS-REQ", sub: "TGT + SPN: HTTP/intranet.company.com", c: "#7C3AED" },
    { f: 2, t: 1, y: 310, lbl: "5. TGS-REP", sub: "Service Ticket (enc w/ service key)", c: "#9333EA" },
    { f: 1, t: 0, y: 365, lbl: "6. SPNEGO Token returned", sub: "Wraps Kerberos AP-REQ in GSSAPI", c: "#7C3AED" },
    { f: 0, t: 3, y: 420, lbl: "7. HTTP GET + Authorization", sub: "Authorization: Negotiate YIIGhg...", c: "#2563EB" },
    { f: 3, t: 0, y: 475, lbl: "8. 200 OK + Mutual Auth", sub: "Access granted — no password ever sent", c: "#059669" },
  ];
  return (
    <div className="overflow-x-auto my-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[700px]" style={{ maxHeight: 540 }}>
        <defs>
          <marker id="ba" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#6B7280" /></marker>
          <marker id="ba-red" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#DC2626" /></marker>
          <marker id="ba-blue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#2563EB" /></marker>
          <marker id="ba-purple" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#7C3AED" /></marker>
          <marker id="ba-dpurple" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#9333EA" /></marker>
          <marker id="ba-green" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#059669" /></marker>
          <filter id="bs" x="-4%" y="-4%" width="108%" height="108%"><feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.1"/></filter>
        </defs>
        {actors.map((a, i) => (
          <g key={i}>
            <rect x={a.x - 55} y={10} width={110} height={48} rx={8} fill={a.bg} stroke={a.c} strokeWidth={2} filter="url(#bs)" />
            <text x={a.x} y={30} textAnchor="middle" fontSize={12} fontWeight="bold" fill={a.c}>{a.label}</text>
            <text x={a.x} y={44} textAnchor="middle" fontSize={9} fill={a.c} opacity={0.7}>{a.sub}</text>
            <line x1={a.x} y1={58} x2={a.x} y2={H - 5} stroke={a.c} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.3} />
          </g>
        ))}
        {/* Phase labels */}
        <rect x={5} y={78} width={W - 10} height={82} rx={6} fill="#FEF2F2" opacity={0.3} />
        <text x={15} y={91} fontSize={9} fontWeight="bold" fill="#991B1B" opacity={0.7}>CHALLENGE</text>
        <rect x={5} y={180} width={W - 10} height={200} rx={6} fill="#F5F3FF" opacity={0.3} />
        <text x={15} y={193} fontSize={9} fontWeight="bold" fill="#5B21B6" opacity={0.7}>SSPI + KERBEROS (invisible to user)</text>
        <rect x={5} y={400} width={W - 10} height={95} rx={6} fill="#ECFDF5" opacity={0.3} />
        <text x={15} y={413} fontSize={9} fontWeight="bold" fill="#065F46" opacity={0.7}>AUTHENTICATED</text>
        {msgs.map((m, i) => {
          const x1 = actors[m.f].x, x2 = actors[m.t].x;
          const dir = x2 > x1 ? 1 : -1;
          const lx1 = x1 + dir * 8, lx2 = x2 - dir * 8;
          const mid = (lx1 + lx2) / 2;
          const mkrMap = { "#6B7280": "url(#ba)", "#DC2626": "url(#ba-red)", "#2563EB": "url(#ba-blue)", "#7C3AED": "url(#ba-purple)", "#9333EA": "url(#ba-dpurple)", "#059669": "url(#ba-green)" };
          const mkr = mkrMap[m.c] || "url(#ba)";
          return (
            <g key={i}>
              <line x1={lx1} y1={m.y} x2={lx2} y2={m.y} stroke={m.c} strokeWidth={2} markerEnd={mkr} />
              <rect x={mid - 65} y={m.y - 22} width={130} height={16} rx={4} fill={m.c} opacity={0.85} />
              <text x={mid} y={m.y - 11} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill="white">{m.lbl}</text>
              <text x={mid} y={m.y + 14} textAnchor="middle" fontSize={8} fill="#4B5563">{m.sub}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default function KerberosGuide() {
  const [active, setActive] = useState(0);
  const [exp, setExp] = useState({});
  const [quizAns, setQuizAns] = useState({});
  const [showRes, setShowRes] = useState(false);
  const toggle = (k) => setExp(p => ({ ...p, [k]: !p[k] }));

  const quiz = [
    { q: "What does KDC stand for?", opts: ["Key Distribution Center", "Kerberos Domain Controller", "Key Domain Certificate", "Kerberos Data Center"], c: 0 },
    { q: "What is the default lifetime of a TGT in Active Directory?", opts: ["4 hours", "8 hours", "10 hours", "24 hours"], c: 2 },
    { q: "Which service issues the TGT?", opts: ["TGS", "AS (Authentication Service)", "Application Server", "DNS"], c: 1 },
    { q: "What makes a Golden Ticket attack so dangerous?", opts: ["It exploits DNS", "It uses the KRBTGT hash to forge TGTs", "It bypasses firewalls", "It disables antivirus"], c: 1 },
    { q: "What port does Kerberos use by default?", opts: ["443", "389", "88", "636"], c: 2 },
    { q: "In browser SSO, what HTTP header carries the Kerberos token?", opts: ["X-Auth-Token", "Authorization: Negotiate", "WWW-Authenticate: Basic", "Cookie: KERB"], c: 1 },
    { q: "A keytab file replaces which part of the Kerberos flow?", opts: ["The Service Ticket", "The password-based pre-authentication", "The TGS request", "The PAC validation"], c: 1 },
    { q: "Which Windows component brokers Kerberos tokens for the browser?", opts: ["WinHTTP", "SSPI (Security Support Provider Interface)", "CryptoAPI", "DPAPI"], c: 1 },
    { q: "What command generates a keytab on Linux?", opts: ["klist", "ktutil / ktpass", "kinit", "kadmin"], c: 1 },
    { q: "Which AD policy controls TGT renewal lifetime?", opts: ["Account Lockout Policy", "Kerberos Policy (Default Domain Policy)", "Audit Policy", "Password Policy"], c: 1 },
    { q: "What does SPNEGO negotiate between?", opts: ["OAuth and SAML", "Kerberos and NTLM", "TLS and SSL", "LDAP and RADIUS"], c: 1 },
  ];

  const R = () => {
    switch (active) {
      case 0: return (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">What is Kerberos?</h2>
          <p className="text-sm leading-relaxed text-gray-700 mb-4">Kerberos is a <strong>network authentication protocol</strong> using <strong>symmetric-key cryptography</strong>. Developed at MIT and named after <strong>Cerberus</strong> — the three-headed dog guarding Hades — it involves three parties. The core principle: <strong>your password never travels the network</strong>. Instead, encrypted <strong>tickets</strong> prove your identity.</p>
          <Analogy>Think of it like an <strong>amusement park wristband</strong>. Show your ID once at the gate (authentication) → get a wristband (TGT). Show your wristband at each ride → get a ride-specific pass (Service Ticket). You never show your ID again.</Analogy>
          <h3 className="text-lg font-bold mb-3 text-gray-800">Why Kerberos?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {[["🔐","No Passwords on Wire","Password is NEVER sent across the network. Only encrypted tickets travel."],["🎫","Single Sign-On (SSO)","Authenticate once, access multiple services without re-entering credentials."],["🤝","Mutual Authentication","Both client AND server prove their identity to each other."]].map(([i,t,d],n) => (
              <div key={n} className="bg-gray-50 border rounded-xl p-4"><div className="text-2xl mb-2">{i}</div><h4 className="font-bold text-sm mb-1">{t}</h4><p className="text-xs text-gray-600">{d}</p></div>
            ))}
          </div>
          <InfoBox title="Kerberos Version">Current version is <strong>Kerberos V5</strong> (RFC 4120). This is what Active Directory uses. It operates on <strong>port 88</strong> (TCP/UDP).</InfoBox>
        </div>
      );
      case 1: return (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">The Three Parties</h2>
          <p className="text-sm text-gray-600 mb-4">Three parties — hence the three-headed dog.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <PartyCard icon="👤" name="Client (Principal)" aka="You / Your workstation" desc="The user requesting access. Your identity is a 'Principal' (e.g., jana@COMPANY.COM)." color="bg-blue-50 border-blue-300" />
            <PartyCard icon="🏛️" name="KDC" aka="Domain Controller in AD" desc="Trusted third party with TWO sub-services: the Authentication Service (AS) and Ticket Granting Service (TGS)." color="bg-purple-50 border-purple-300" />
            <PartyCard icon="🖥️" name="Application Server" aka="File server, web app, SQL…" desc="The resource you want. Each registers a Service Principal Name (SPN) like HTTP/intranet.company.com." color="bg-green-50 border-green-300" />
          </div>
          <h3 className="text-lg font-bold mb-3 text-gray-800">Inside the KDC</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-5">
              <span className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">SUB-SERVICE 1</span>
              <h4 className="font-bold text-lg mt-2 mb-2">AS — Authentication Service</h4>
              <p className="text-sm text-gray-700">The <strong>front gate</strong>. Verifies your identity at login and issues the <strong>TGT</strong>. Only contacted during initial login or TGT expiry.</p>
            </div>
            <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-5">
              <span className="bg-indigo-200 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">SUB-SERVICE 2</span>
              <h4 className="font-bold text-lg mt-2 mb-2">TGS — Ticket Granting Service</h4>
              <p className="text-sm text-gray-700">The <strong>ticket booth</strong>. Takes your TGT and issues <strong>Service Tickets</strong> for specific resources. Contacted every time you access a new service.</p>
            </div>
          </div>
          <InfoBox title="The KRBTGT Account" emoji="🔑">The KDC uses the <strong>KRBTGT</strong> account's password hash to encrypt all TGTs. It's the <strong>most sensitive account</strong> in your domain. If compromised → Golden Ticket attack.</InfoBox>
        </div>
      );
      case 2: return (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Key Concepts</h2>
          <p className="text-sm text-gray-600 mb-5">Click to understand each building block.</p>
          {[
            { t: "TGT — Ticket Granting Ticket", e: "🎫", cl: "bg-amber-50 border-amber-300", content: (
              <div><p className="mb-2">Your <strong>master credential</strong> after login — proves "this user already authenticated."</p>
                <div className="bg-white bg-opacity-60 rounded-lg p-3 my-2 font-mono text-xs">
                  <p><strong>Encrypted with:</strong> KRBTGT account's key</p><p><strong>Contains:</strong> Username, realm, session key, PAC, expiry</p><p><strong>Default lifetime:</strong> 10 hours | <strong>Max renewal:</strong> 7 days</p><p><strong>Stored:</strong> LSA memory cache on workstation</p></div>
                <p className="mt-2"><strong>Key:</strong> Only the KDC can decrypt it. Your workstation carries it like a sealed envelope.</p></div>
            )},
            { t: "Service Ticket (ST)", e: "🎟️", cl: "bg-green-50 border-green-300", content: (
              <div><p className="mb-2">Grants access to a <strong>specific service</strong>.</p>
                <div className="bg-white bg-opacity-60 rounded-lg p-3 my-2 font-mono text-xs">
                  <p><strong>Encrypted with:</strong> Target service account's key</p><p><strong>Scope:</strong> ONE specific service only</p></div>
                <p className="mt-2">Only the target service can decrypt this. You just carry it.</p></div>
            )},
            { t: "Session Key", e: "🔑", cl: "bg-blue-50 border-blue-300", content: (
              <div><p className="mb-2">Temporary symmetric key generated by the KDC for secure communication.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div className="bg-white bg-opacity-60 rounded-lg p-3 text-xs"><p className="font-bold mb-1">TGT Session Key (SK₁)</p><p>Between you & KDC. Encrypts TGS requests.</p></div>
                  <div className="bg-white bg-opacity-60 rounded-lg p-3 text-xs"><p className="font-bold mb-1">Service Session Key (SK₂)</p><p>Between you & target service. Encrypts the session.</p></div></div></div>
            )},
            { t: "PAC — Privilege Attribute Certificate", e: "📋", cl: "bg-rose-50 border-rose-300", content: (
              <div><p className="mb-2">Microsoft extension inside tickets carrying your <strong>authorization data</strong>: User SID, group SIDs, rights, restrictions. This is how a server knows your groups without querying AD.</p></div>
            )},
            { t: "SPN — Service Principal Name", e: "🏷️", cl: "bg-teal-50 border-teal-300", content: (
              <div><p className="mb-2">Unique identifier for a service in AD. Tells Kerberos which key to use.</p>
                <div className="bg-white bg-opacity-60 rounded-lg p-3 my-2 font-mono text-xs">
                  <p>HTTP/intranet.company.com</p><p>MSSQLSvc/sqlserver.company.com:1433</p><p>CIFS/fileserver.company.com</p></div></div>
            )},
          ].map((item, i) => (
            <div key={i} className={`${item.cl} border-2 rounded-xl p-5 mb-4`}>
              <div className="flex items-center gap-2 mb-3"><span className="text-2xl">{item.e}</span><h3 className="font-bold text-lg">{item.t}</h3></div>
              <div className="text-sm text-gray-700 leading-relaxed">{item.content}</div></div>
          ))}
        </div>
      );
      case 3: return (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">The Kerberos Flow</h2>
          <p className="text-sm text-gray-600 mb-2">The complete authentication sequence. Study the diagram, then expand each step below for details.</p>
          <SeqDiagram />
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-5">
            <h3 className="font-bold text-sm mb-3 text-gray-700">PHASE 1 — Getting Your TGT (Login)</h3>
            <div className="flex flex-col gap-3">
              <StepCard num="1" title="AS-REQ → Authentication Request" color="bg-blue-50 border-blue-200" expanded={exp.f1} onToggle={() => toggle('f1')}
                desc="Workstation sends your principal name + encrypted timestamp to the KDC."
                detail={<div><p className="mb-2">When you type your password at Ctrl+Alt+Del:</p><p className="mb-1">1. Workstation derives an <strong>encryption key from your password hash</strong> (password never sent).</p><p className="mb-1">2. Sends AS-REQ: username, realm, <strong>pre-auth timestamp encrypted with your key</strong>.</p><p className="mt-2 font-mono bg-white bg-opacity-50 p-2 rounded">AS-REQ → KDC:88 | principal + enc_timestamp</p></div>} />
              <StepCard num="2" title="AS-REP ← KDC returns TGT" color="bg-purple-50 border-purple-200" expanded={exp.f2} onToggle={() => toggle('f2')}
                desc="KDC validates your timestamp, builds TGT encrypted with KRBTGT hash."
                detail={<div><p className="mb-1">1. KDC looks up your hash in AD, decrypts the timestamp — if valid and within 5 min → you're verified.</p><p className="mb-1">2. Generates <strong>TGT Session Key (SK₁)</strong>.</p><p className="mb-1">3. Builds <strong>TGT</strong>: your identity + PAC + SK₁ copy + expiry → encrypts with <strong>KRBTGT key</strong>.</p><p className="mb-1">4. Sends AS-REP: [encrypted TGT] + [SK₁ encrypted with YOUR key].</p><p className="mt-2">Your workstation decrypts SK₁ using your password hash, caches TGT + SK₁ in <strong>LSA memory</strong>.</p></div>} />
            </div>
          </div>
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-5">
            <h3 className="font-bold text-sm mb-3 text-gray-700">PHASE 2 — Getting a Service Ticket</h3>
            <div className="flex flex-col gap-3">
              <StepCard num="3" title="TGS-REQ → Request for specific service" color="bg-teal-50 border-teal-200" expanded={exp.f3} onToggle={() => toggle('f3')}
                desc="Present your TGT + target SPN to the Ticket Granting Service."
                detail={<div><p className="mb-2">When you access \\fileserver\share:</p><p className="mb-1">• Sends TGT (still sealed with KRBTGT key)</p><p className="mb-1">• Authenticator: your name + timestamp encrypted with SK₁</p><p className="mb-1">• Target SPN: CIFS/fileserver.company.com</p></div>} />
              <StepCard num="4" title="TGS-REP ← Service Ticket issued" color="bg-indigo-50 border-indigo-200" expanded={exp.f4} onToggle={() => toggle('f4')}
                desc="KDC opens TGT, validates authenticator, issues ticket encrypted with service key."
                detail={<div><p className="mb-1">1. Decrypts TGT with KRBTGT key → extracts SK₁ and your identity.</p><p className="mb-1">2. Decrypts Authenticator with SK₁ → confirms freshness.</p><p className="mb-1">3. Looks up SPN → gets service account's key.</p><p className="mb-1">4. Generates <strong>Service Session Key (SK₂)</strong>.</p><p className="mb-1">5. Builds Service Ticket: your identity + PAC + SK₂ → encrypted with <strong>service account's key</strong>.</p></div>} />
            </div>
          </div>
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-sm mb-3 text-gray-700">PHASE 3 — Accessing the Service</h3>
            <div className="flex flex-col gap-3">
              <StepCard num="5" title="AP-REQ → Present ticket to the server" color="bg-green-50 border-green-200" expanded={exp.f5} onToggle={() => toggle('f5')}
                desc="Send Service Ticket + authenticator directly to the application server."
                detail={<div><p className="mb-2">Server decrypts Service Ticket with its own key → extracts your identity, PAC, SK₂. Verifies Authenticator. Now knows who you are and your groups — <strong>without ever contacting the KDC</strong>.</p></div>} />
              <StepCard num="6" title="AP-REP ← Mutual Authentication" color="bg-emerald-50 border-emerald-200" expanded={exp.f6} onToggle={() => toggle('f6')}
                desc="Server proves ITS identity back to you."
                detail={<div><p>Server returns your Authenticator's timestamp encrypted with SK₂. You decrypt it — if it matches, you know you're talking to the <strong>real server</strong>, because only the real server could have opened the Service Ticket to obtain SK₂.</p></div>} />
            </div>
          </div>
          <Analogy><strong>Sealed envelope system:</strong> University dean (KDC) gives you a sealed recommendation (TGT). Career office (TGS) writes a new sealed letter for a specific company (Service Ticket). The company opens their letter and lets you in. You never opened either letter — you just carried them.</Analogy>
        </div>
      );
      case 4: return (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Keytab Files</h2>
          <p className="text-sm text-gray-600 mb-4">How services and automated processes authenticate to Kerberos <strong>without a password prompt</strong>.</p>

          <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-5 mb-5">
            <h3 className="text-lg font-bold text-indigo-800 mb-3">What is a Keytab?</h3>
            <p className="text-sm text-gray-700 mb-3">A <strong>keytab</strong> (key table) is a file that contains one or more <strong>Kerberos principal names and their corresponding encryption keys</strong> (derived from the account's password). It's essentially a "password in file form" — it allows a process to authenticate to Kerberos without any human typing a password.</p>
            <div className="bg-white bg-opacity-60 rounded-lg p-4 font-mono text-xs">
              <p className="font-bold mb-1">Keytab file contents (conceptual):</p>
              <p>┌─────────────────────────────────────────────┐</p>
              <p>│ Principal: HTTP/webserver.company.com@REALM  │</p>
              <p>│ Key Version: 3 (kvno)                        │</p>
              <p>│ Encryption: aes256-cts-hmac-sha1-96           │</p>
              <p>│ Key: 0x8a3f...encrypted key bytes...          │</p>
              <p>├─────────────────────────────────────────────┤</p>
              <p>│ Principal: svc-app@COMPANY.COM               │</p>
              <p>│ Key Version: 5                                │</p>
              <p>│ Encryption: aes256-cts-hmac-sha1-96           │</p>
              <p>│ Key: 0xb7c2...encrypted key bytes...          │</p>
              <p>└─────────────────────────────────────────────┘</p>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-3 text-gray-800">Why No Password is Needed</h3>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-5">
            <p className="text-sm text-gray-700 mb-3">Remember from the Flow section: in Step 1 (AS-REQ), the client encrypts a <strong>pre-authentication timestamp with a key derived from the password</strong>. The KDC decrypts it using the same key from AD.</p>
            <p className="text-sm text-gray-700 mb-3">A keytab <strong>already contains that derived key</strong>. So instead of:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-4 border">
                <p className="font-bold text-sm text-red-600 mb-2">Normal (Interactive) Login</p>
                <p className="text-xs mb-1">1. User types password</p>
                <p className="text-xs mb-1">2. Windows derives encryption key from password</p>
                <p className="text-xs mb-1">3. Encrypts timestamp with that key</p>
                <p className="text-xs">4. Sends AS-REQ → gets TGT</p>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <p className="font-bold text-sm text-green-600 mb-2">Keytab Login (Non-Interactive)</p>
                <p className="text-xs mb-1">1. Process reads key directly from keytab file</p>
                <p className="text-xs mb-1">2. <em>(skip — key already derived)</em></p>
                <p className="text-xs mb-1">3. Encrypts timestamp with that key</p>
                <p className="text-xs">4. Sends AS-REQ → gets TGT</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-3">The KDC can't tell the difference — the AS-REQ looks identical. The keytab simply <strong>replaces the password → key derivation step</strong> with a pre-computed key from a file.</p>
          </div>

          <h3 className="text-lg font-bold mb-3 text-gray-800">How Keytab Generates Kerberos Cache</h3>
          <div className="flex flex-col gap-3 mb-5">
            {[
              { n: "1", t: "kinit reads the keytab", d: "The kinit command (or Windows equivalent) opens the keytab file and extracts the principal's encryption key.", dt: <div><p className="font-mono bg-white bg-opacity-50 p-2 rounded mb-2">$ kinit -kt /etc/krb5.keytab svc-app@COMPANY.COM</p><p>The <strong>-kt</strong> flag tells kinit to use a keytab file instead of prompting for a password. It reads the key for the specified principal from the file.</p></div>, c: "bg-blue-50 border-blue-200" },
              { n: "2", t: "Sends AS-REQ with pre-auth timestamp", d: "Encrypts the current timestamp using the key from the keytab — exactly like a password-based login.", dt: <div><p>The AS-REQ is identical to a normal one. The KDC validates it the same way — decrypts timestamp, checks it's within 5 minutes, verifies the principal exists in AD.</p></div>, c: "bg-purple-50 border-purple-200" },
              { n: "3", t: "Receives AS-REP → TGT + Session Key", d: "KDC returns a TGT (encrypted with KRBTGT) and a session key (encrypted with the keytab's key).", dt: <div><p>kinit decrypts the session key using the same key from the keytab (since it's the same key the KDC used to encrypt it).</p></div>, c: "bg-indigo-50 border-indigo-200" },
              { n: "4", t: "TGT cached in credential cache (ccache)", d: "The TGT and session key are written to the Kerberos credential cache.", dt: <div><p className="mb-2">The cache location depends on the platform:</p><p className="font-mono bg-white bg-opacity-50 p-2 rounded text-xs mb-2">Linux:   /tmp/krb5cc_$(id -u)  or  KCM:uid<br/>macOS:   Kerberos.app keychain<br/>Windows: LSA memory (LSASS process)</p><p>You can verify with: <strong>klist</strong> — this shows all cached tickets.</p></div>, c: "bg-green-50 border-green-200" },
            ].map((s, i) => (
              <StepCard key={i} num={s.n} title={s.t} desc={s.d} detail={s.dt} color={s.c} expanded={exp[`k${i}`]} onToggle={() => toggle(`k${i}`)} />
            ))}
          </div>

          <h3 className="text-lg font-bold mb-3 text-gray-800">Creating Keytab Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4">
              <h4 className="font-bold text-sm mb-2">🐧 Linux — ktutil</h4>
              <div className="font-mono text-xs bg-white rounded p-3">
                <p>$ ktutil</p>
                <p>ktutil: addent -password -p svc-app@COMPANY.COM \</p>
                <p>  -k 1 -e aes256-cts-hmac-sha1-96</p>
                <p>Password for svc-app@COMPANY.COM: ****</p>
                <p>ktutil: wkt /etc/krb5.keytab</p>
                <p>ktutil: quit</p>
              </div>
            </div>
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4">
              <h4 className="font-bold text-sm mb-2">🪟 Windows — ktpass</h4>
              <div className="font-mono text-xs bg-white rounded p-3">
                <p>ktpass -princ HTTP/web.company.com@COMPANY.COM \</p>
                <p>  -mapuser COMPANY\svc-web \</p>
                <p>  -pass MyP@ssw0rd \</p>
                <p>  -crypto AES256-SHA1 \</p>
                <p>  -ptype KRB5_NT_PRINCIPAL \</p>
                <p>  -out C:\keytabs\web.keytab</p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-3 text-gray-800">Common Use Cases</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {[
              ["🤖","Service Accounts","Apache/Nginx/Tomcat use keytabs to authenticate to Kerberos for SPNEGO web SSO — the web server needs a keytab for its HTTP/ SPN."],
              ["⏰","Cron Jobs / Scheduled Tasks","Automated scripts that need to access Kerberized resources (Hadoop, databases) use keytabs + kinit in a crontab."],
              ["🐘","Big Data (Hadoop/Spark)","Kerberized Hadoop clusters require keytabs for every service (HDFS, YARN, Hive). Each node has its own keytab."]
            ].map(([i,t,d],n) => (
              <div key={n} className="bg-gray-50 border rounded-xl p-4"><div className="text-2xl mb-2">{i}</div><h4 className="font-bold text-sm mb-1">{t}</h4><p className="text-xs text-gray-600">{d}</p></div>
            ))}
          </div>

          <WarnBox><strong>Keytab = Password equivalent!</strong> Anyone with the keytab file can authenticate as that principal. Protect keytabs with strict file permissions (chmod 600, owned by the service user). Never commit keytabs to git or share them. Rotate the associated password periodically (which invalidates old keytabs).</WarnBox>

          <Analogy>A keytab is like a <strong>master key card</strong> for a building. Normal employees type a PIN (password) at the door. But the night security guard has a key card (keytab) that opens the door without a PIN. The door lock (KDC) can't tell the difference — both produce the same signal. But if someone steals that key card, they can walk right in.</Analogy>
        </div>
      );
      case 5: return (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Browser Authentication (Integrated Windows Auth)</h2>
          <p className="text-sm text-gray-600 mb-4">How your intranet "just works" after logging into your domain workstation — and the critical role of <strong>Windows SSPI</strong>.</p>

          <h3 className="text-lg font-bold mb-2 text-gray-800">The Key Question: How Does the Browser Know It's You?</h3>
          <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-5 mb-5">
            <p className="text-sm text-gray-700 mb-3">The browser <strong>does NOT</strong> authenticate you itself. It <strong>delegates</strong> to the operating system via <strong>SSPI (Security Support Provider Interface)</strong>. Here's the trust chain:</p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2"><span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">1</span><p><strong>You already proved your identity</strong> when you logged into Windows (Ctrl+Alt+Del → password → AS-REQ/AS-REP). Windows stored your TGT in the <strong>LSA (Local Security Authority)</strong> memory inside the LSASS process.</p></div>
              <div className="flex items-center gap-2"><span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">2</span><p><strong>The browser asks Windows</strong>: "I need a token to access HTTP/intranet.company.com" by calling the SSPI function <strong>InitializeSecurityContext()</strong>.</p></div>
              <div className="flex items-center gap-2"><span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">3</span><p><strong>Windows SSPI handles the Kerberos exchange</strong> under the hood — uses the cached TGT to get a Service Ticket from the KDC, wraps it in a SPNEGO token, and hands it back to the browser.</p></div>
              <div className="flex items-center gap-2"><span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">4</span><p>The browser just blindly puts the token in the <strong>Authorization: Negotiate</strong> header. It has <strong>no idea what's inside</strong>.</p></div>
            </div>
          </div>

          <InfoBox title="SSPI is the Answer to Your Question" emoji="✅">
            <p className="mb-2">Yes — the browser uses <strong>Windows SSPI</strong> (specifically the <strong>Kerberos Security Support Provider</strong>) to verify the user. The browser itself does NOT read credentials, doesn't know your password, and doesn't contact the KDC directly.</p>
            <p>SSPI is the Windows implementation of the <strong>GSSAPI</strong> (Generic Security Services API) standard. On Linux, browsers use GSSAPI directly (e.g., Firefox calls into libgssapi_krb5).</p>
          </InfoBox>

          <h3 className="text-lg font-bold mb-2 text-gray-800">Complete Sequence Diagram</h3>
          <BrowserDiagram />

          <h3 className="text-lg font-bold mb-3 text-gray-800">Step-by-Step Breakdown</h3>
          <div className="flex flex-col gap-3 mb-5">
            {[
              { n:"1", t:"Browser → HTTP GET (no auth)", d:"Normal request to http://intranet.company.com. No credentials yet.", dt:<div><p>The browser has no idea authentication is needed. It sends a plain HTTP GET. The web server sees no auth header and challenges the client.</p></div>, c:"bg-slate-50 border-slate-200" },
              { n:"2", t:"Server → 401 + WWW-Authenticate: Negotiate", d:"Server challenges using SPNEGO protocol.", dt:<div><p className="mb-2">The server responds:</p><p className="font-mono bg-white bg-opacity-50 p-2 rounded mb-2">HTTP/1.1 401 Unauthorized<br/>WWW-Authenticate: Negotiate</p><p><strong>"Negotiate"</strong> means the server supports <strong>SPNEGO</strong> (Simple and Protected GSSAPI Negotiation Mechanism). SPNEGO negotiates between Kerberos (preferred) and NTLM (fallback).</p></div>, c:"bg-red-50 border-red-200" },
              { n:"3", t:"Browser → SSPI: InitializeSecurityContext()", d:"Browser delegates to Windows — 'I need a token for this SPN.'", dt:<div><p className="mb-2">The browser calls the Win32 SSPI function:</p><p className="font-mono bg-white bg-opacity-50 p-2 rounded mb-2">InitializeSecurityContext(<br/>  hCredential,  // user's logon session<br/>  "HTTP/intranet.company.com",  // target SPN<br/>  ISC_REQ_MUTUAL_AUTH | ISC_REQ_DELEGATE<br/>)</p><p className="mb-2">The browser extracts the SPN from the URL hostname: <strong>HTTP/</strong> + hostname. This is why accessing by IP breaks Kerberos — you can't form a valid SPN from an IP address.</p><p>SSPI runs within the <strong>LSASS process</strong>, which has access to your cached TGT.</p></div>, c:"bg-purple-50 border-purple-200" },
              { n:"4", t:"SSPI → KDC: TGS-REQ (behind the scenes)", d:"Windows uses your cached TGT to request a Service Ticket for the web server's SPN.", dt:<div><p className="mb-2">SSPI's Kerberos SSP checks the ticket cache:</p><p className="mb-1">• <strong>Cache hit?</strong> Skip to step 6 — reuse the existing Service Ticket.</p><p className="mb-2">• <strong>Cache miss?</strong> Send TGS-REQ to KDC (port 88) with your TGT + the target SPN.</p><p>This is standard Kerberos Phase 2 (TGS-REQ/TGS-REP) — happens entirely inside Windows, invisible to the browser.</p></div>, c:"bg-violet-50 border-violet-200" },
              { n:"5", t:"KDC → SSPI: TGS-REP (Service Ticket)", d:"KDC returns Service Ticket encrypted with the web server's service account key.", dt:<div><p>SSPI receives the Service Ticket and the Service Session Key. The ticket is cached for future requests to the same SPN.</p></div>, c:"bg-indigo-50 border-indigo-200" },
              { n:"6", t:"SSPI → Browser: SPNEGO Token", d:"SSPI wraps the Kerberos AP-REQ in a GSSAPI/SPNEGO envelope and returns it to the browser.", dt:<div><p className="mb-2">The SPNEGO token structure:</p><p className="font-mono bg-white bg-opacity-50 p-2 rounded mb-2">{"SPNEGO NegTokenInit {"}<br/>{"  mechTypes: [1.2.840.113554.1.2.2]  // OID for Kerberos"}<br/>{"  mechToken: KRB5_AP-REQ {"}<br/>{"    ticket: [Service Ticket]"}<br/>{"    authenticator: [encrypted w/ SK₂]"}<br/>{"  }"}<br/>{"}"}</p><p>The browser receives this opaque binary blob. It doesn't parse it. Base64-encodes it and moves to the next step.</p></div>, c:"bg-blue-50 border-blue-200" },
              { n:"7", t:"Browser → HTTP GET + Authorization: Negotiate YII…", d:"Browser re-sends the request with the Kerberos token in the Authorization header.", dt:<div><p className="font-mono bg-white bg-opacity-50 p-2 rounded mb-2">GET /page HTTP/1.1<br/>Host: intranet.company.com<br/>Authorization: Negotiate YIIGhgYGKwYBBQUCoII...</p><p className="mb-2">The Base64 token prefix reveals the auth type:</p><p className="mb-1">• <strong>YII</strong> = Kerberos (SPNEGO wrapping a KRB5 AP-REQ)</p><p>• <strong>TlR</strong> = NTLM (fell back because Kerberos failed)</p></div>, c:"bg-green-50 border-green-200" },
              { n:"8", t:"Server → 200 OK (Authenticated!)", d:"IIS decrypts the Service Ticket, reads your PAC, grants access.", dt:<div><p className="mb-1">1. IIS calls <strong>AcceptSecurityContext()</strong> (the server-side SSPI function).</p><p className="mb-1">2. Decrypts Service Ticket with the service account's key.</p><p className="mb-1">3. Extracts your identity + PAC (group SIDs) → creates Windows access token.</p><p className="mb-1">4. Performs authorization (are your groups allowed?).</p><p className="mb-1">5. Returns the content — optionally with a <strong>WWW-Authenticate: Negotiate</strong> response token for mutual auth.</p><p className="mt-2">All this happens in <strong>milliseconds</strong>. You never saw a login prompt.</p></div>, c:"bg-emerald-50 border-emerald-200" },
            ].map((s, i) => (
              <StepCard key={i} num={s.n} title={s.t} desc={s.d} detail={s.dt} color={s.c} expanded={exp[`b${i}`]} onToggle={() => toggle(`b${i}`)} />
            ))}
          </div>

          <h3 className="text-lg font-bold mb-3 text-gray-800">SSPI vs. OIDC/IDP Redirect — Key Difference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4">
              <h4 className="font-bold text-sm mb-2">🏢 Kerberos/SSPI (Intranet)</h4>
              <p className="text-xs text-gray-700 mb-2">No redirect. No login page. The browser calls the OS kernel (SSPI/GSSAPI) which already has your TGT from Windows login. Token exchange happens via <strong>HTTP headers</strong> (401 challenge → Negotiate response). Everything is invisible.</p>
              <p className="text-xs font-bold text-purple-700">Identity proof: Your Windows logon session (TGT in memory)</p>
            </div>
            <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4">
              <h4 className="font-bold text-sm mb-2">🌐 OIDC/IDP Redirect (Internet/Cloud)</h4>
              <p className="text-xs text-gray-700 mb-2">Browser redirects to IDP login page → you enter credentials → IDP issues auth code → app exchanges for tokens. This is an <strong>explicit user interaction</strong>. But if the IDP is ADFS and you're on a domain workstation, ADFS itself can use <strong>Kerberos/SSPI</strong> to authenticate you silently!</p>
              <p className="text-xs font-bold text-orange-700">Identity proof: IDP session cookie (after initial auth)</p>
            </div>
          </div>

          <InfoBox title="The ADFS + Kerberos Bridge" emoji="🌉">
            <p className="mb-2">This is the beautiful connection: When you access a cloud app that redirects to <strong>ADFS</strong> for OIDC/SAML login, and you're on a domain-joined workstation:</p>
            <p className="mb-1">1. App redirects browser → ADFS authorization endpoint</p>
            <p className="mb-1">2. ADFS is configured for <strong>Windows Integrated Auth</strong></p>
            <p className="mb-1">3. ADFS sends <strong>401 Negotiate</strong> challenge</p>
            <p className="mb-1">4. Browser calls SSPI → gets Kerberos token → sends it to ADFS</p>
            <p className="mb-1">5. ADFS validates the Kerberos token → issues OIDC auth code/SAML assertion</p>
            <p className="mb-1">6. You're logged in without ever seeing a password prompt</p>
            <p className="mt-2">So <strong>Kerberos is the underlying mechanism</strong> that makes "seamless SSO" work even in OIDC/SAML flows, as long as the IDP supports Windows Integrated Auth.</p>
          </InfoBox>

          <InfoBox title="When Kerberos Falls Back to NTLM" emoji="🔄">
            <p className="mb-1">• Access by <strong>IP address</strong> (can't form SPN)</p>
            <p className="mb-1">• SPN <strong>missing or duplicated</strong> in AD</p>
            <p className="mb-1">• Can't reach <strong>Domain Controller</strong> on port 88</p>
            <p className="mb-1">• URL not in browser's <strong>Intranet zone</strong></p>
            <p>• Firefox: <strong>network.negotiate-auth.trusted-uris</strong> not configured</p>
          </InfoBox>
        </div>
      );
      case 6: return (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Active Directory & Ticket Renewal</h2>
          <p className="text-sm text-gray-600 mb-4">How AD manages Kerberos ticket lifetimes and renewal.</p>
          <h3 className="text-lg font-bold mb-3 text-gray-800">Which Service Handles Renewal?</h3>
          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-5 mb-5">
            <p className="text-sm mb-3">The <strong>KDC service (KdcSvc)</strong> running inside LSASS on every Domain Controller handles all AS and TGS requests including renewal.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white bg-opacity-60 rounded-lg p-3"><h4 className="font-bold text-sm mb-2">On the Domain Controller</h4><p className="text-xs mb-1">• <strong>KDC Service</strong> (inside lsass.exe) handles all ticket operations</p><p className="text-xs mb-1">• <strong>Kerberos Policy</strong> in <strong>Default Domain Policy</strong> GPO controls lifetimes</p><p className="text-xs">• Path: Computer Config → Policies → Windows Settings → Security → Account Policies → Kerberos Policy</p></div>
              <div className="bg-white bg-opacity-60 rounded-lg p-3"><h4 className="font-bold text-sm mb-2">On the Client</h4><p className="text-xs mb-1">• <strong>Kerberos SSP</strong> in lsass.exe manages the ticket cache</p><p className="text-xs mb-1">• Auto-renews TGT at ~50% lifetime</p><p className="text-xs">• Falls back to re-authentication if renewal fails</p></div>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-3 text-gray-800">Default Kerberos Policy Settings</h3>
          <div className="overflow-x-auto mb-5">
            <table className="w-full text-sm border-collapse"><thead><tr className="bg-gray-100">
              <th className="border p-3 text-left font-bold">Policy Setting</th><th className="border p-3 text-left font-bold">Default</th><th className="border p-3 text-left font-bold">What It Controls</th></tr></thead><tbody>
              {[["Max lifetime for user ticket (TGT)","10 hours","How long a TGT is valid"],["Max lifetime for service ticket","600 min (10 hrs)","Service Ticket validity"],["Max lifetime for user ticket renewal","7 days","Renewal window for TGT"],["Max tolerance for clock sync","5 minutes","Time skew allowed between client and KDC"],["Enforce user logon restrictions","Enabled","Checks account status on every TGS request"]].map((r,i) => (
              <tr key={i} className={i%2===0?"bg-white":"bg-gray-50"}><td className="border p-3 font-mono text-xs">{r[0]}</td><td className="border p-3 font-bold">{r[1]}</td><td className="border p-3 text-xs">{r[2]}</td></tr>))}
            </tbody></table>
          </div>
          <h3 className="text-lg font-bold mb-3 text-gray-800">Renewal Lifecycle</h3>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-5">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3"><span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">T+0</span><p><strong>Login:</strong> TGT issued, valid 10 hours, renewable for 7 days.</p></div>
              <div className="flex items-start gap-3"><span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">~T+5h</span><p><strong>Auto-renewal:</strong> Client sends TGS-REQ with RENEWABLE flag. KDC issues fresh 10-hour TGT (7-day window doesn't reset).</p></div>
              <div className="flex items-start gap-3"><span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">T+7d</span><p><strong>Renewal limit:</strong> Must re-authenticate (password) for a new TGT + new 7-day window.</p></div>
            </div>
          </div>
          <WarnBox><strong>Clock Skew!</strong> If your workstation's clock is &gt;5 minutes off from the DC, ALL Kerberos auth fails. Windows uses <strong>W32Time</strong> to sync with the PDC Emulator.</WarnBox>
          <InfoBox title="klist — Your Debugging Best Friend" emoji="🛠️">
            <div className="font-mono bg-white bg-opacity-50 p-2 rounded text-xs">
              <p>C:\&gt; klist</p><p>Cached Tickets: (3)</p><p>#0&gt; Client: jana@COMPANY.COM</p><p>&nbsp;&nbsp;&nbsp;Server: krbtgt/COMPANY.COM@COMPANY.COM</p><p>&nbsp;&nbsp;&nbsp;Encryption: AES-256-CTS</p><p>&nbsp;&nbsp;&nbsp;End Time: 2/28/2026 18:00:00</p><p>&nbsp;&nbsp;&nbsp;Renew Time: 3/7/2026 8:00:00</p>
            </div>
            <p className="mt-2">Use <strong>klist purge</strong> to clear cache and force re-auth.</p>
          </InfoBox>
        </div>
      );
      case 7: return (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Golden Ticket Attack</h2>
          <p className="text-sm text-gray-600 mb-4">The most infamous AD attack — and why the KRBTGT account is the crown jewel.</p>
          <div className="bg-red-50 border-2 border-red-400 rounded-xl p-5 mb-5">
            <h3 className="text-lg font-bold text-red-800 mb-3">What is a Golden Ticket?</h3>
            <p className="text-sm text-red-900 mb-3">A <strong>forged TGT</strong> crafted using the <strong>KRBTGT hash</strong>. Since the KDC encrypts all real TGTs with this key, a forged one is <strong>indistinguishable from legitimate</strong>. The attacker can impersonate <strong>any user</strong>, access <strong>any service</strong>, and set <strong>arbitrary lifetimes</strong>.</p>
          </div>
          <h3 className="text-lg font-bold mb-3 text-gray-800">Attack Steps</h3>
          <div className="flex flex-col gap-3 mb-5">
            {[["1","Compromise a Domain Controller","Privilege escalation, lateral movement, or exploit to gain DC admin.","bg-red-50 border-red-200"],["2","Extract KRBTGT hash","Mimikatz DCSync or NTDS.dit extraction → get KRBTGT NTLM hash + domain SID.","bg-red-50 border-red-200"],["3","Forge a TGT (Golden Ticket)","Use KRBTGT hash + SID to craft a TGT for any user with any groups. Set expiry to 10 years.","bg-red-50 border-red-200"],["4","Inject & request Service Tickets","Inject the Golden Ticket → KDC decrypts it successfully → issues legitimate Service Tickets.","bg-red-50 border-red-200"],["5","Full domain access","Access any resource as any user. Game over.","bg-red-50 border-red-200"]].map(([n,t,d,c],i) => (
              <div key={i} className={`${c} border-2 rounded-xl p-4 flex items-start gap-3`}>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-200 flex items-center justify-center font-bold text-sm text-red-800">{n}</span>
                <div><h4 className="font-bold text-sm">{t}</h4><p className="text-xs mt-1 text-gray-700">{d}</p></div></div>
            ))}
          </div>
          <h3 className="text-lg font-bold mb-3 text-gray-800">Why It's Devastating</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {[["👻","Survives Password Resets","TGT is signed with KRBTGT, not the user's key."],["⏰","Arbitrary Lifetime","Attacker sets 10+ year expiry. KDC trusts its own signature."],["🕵️","Hard to Detect","Looks legitimate to the KDC. Requires advanced monitoring."],["🌍","Full Domain Compromise","One ticket = complete control over the entire domain."]].map(([i,t,d],n) => (
              <div key={n} className="bg-gray-50 border rounded-xl p-4"><div className="text-2xl mb-2">{i}</div><h4 className="font-bold text-sm mb-1">{t}</h4><p className="text-xs text-gray-600">{d}</p></div>
            ))}
          </div>
          <h3 className="text-lg font-bold mb-3 text-gray-800">Related Attacks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4">
              <h4 className="font-bold text-sm mb-2">🥈 Silver Ticket</h4>
              <p className="text-xs text-gray-700">Forged <strong>Service Ticket</strong> using a service account's hash. Access to one service only. Never contacts KDC — harder to detect.</p>
            </div>
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
              <h4 className="font-bold text-sm mb-2">🔑 Kerberoasting</h4>
              <p className="text-xs text-gray-700">Any domain user requests Service Tickets, then <strong>offline brute-forces</strong> the service account password from the encrypted ticket.</p>
            </div>
          </div>
          <InfoBox title="Mitigation" emoji="🛡️">
            <p className="mb-1">• <strong>Rotate KRBTGT password twice</strong> (current + previous hash are both valid)</p>
            <p className="mb-1">• <strong>Monitor Event ID 4769</strong> for impossible lifetimes or non-existent users</p>
            <p className="mb-1">• <strong>Limit Domain Admin usage</strong> — tiered admin model</p>
            <p className="mb-1">• <strong>Protected Users group</strong> — disables NTLM, delegation, weak encryption</p>
            <p>• <strong>Enforce AES-256</strong> — disable RC4 to reduce Kerberoasting risk</p>
          </InfoBox>
        </div>
      );
      case 8: return (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Knowledge Check</h2>
          <p className="text-sm text-gray-600 mb-5">10 questions covering all sections. Select the best answer.</p>
          {quiz.map((q, qi) => (
            <div key={qi} className="mb-5 bg-gray-50 border rounded-xl p-4">
              <p className="font-bold text-sm mb-3">{qi+1}. {q.q}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {q.opts.map((o, oi) => {
                  const sel = quizAns[qi] === oi;
                  const ok = showRes && oi === q.c;
                  const bad = showRes && sel && oi !== q.c;
                  return (<button key={oi} onClick={() => !showRes && setQuizAns(p=>({...p,[qi]:oi}))}
                    className={`text-left text-sm p-3 rounded-lg border-2 transition-all ${ok?"bg-green-100 border-green-500 font-bold":bad?"bg-red-100 border-red-400":sel?"bg-blue-100 border-blue-400":"bg-white border-gray-200 hover:border-blue-300"}`}>{o}</button>);
                })}
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <button onClick={() => setShowRes(true)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Check Answers</button>
            <button onClick={() => {setQuizAns({});setShowRes(false);}} className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300">Reset</button>
          </div>
          {showRes && <div className={`mt-4 p-4 rounded-xl border-2 ${quiz.every((q,i)=>quizAns[i]===q.c)?"bg-green-50 border-green-300":"bg-blue-50 border-blue-200"}`}>
            <p className="font-bold text-sm">Score: {quiz.filter((q,i)=>quizAns[i]===q.c).length} / {quiz.length}{quiz.every((q,i)=>quizAns[i]===q.c) && " — Perfect! 🎉"}</p>
          </div>}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white p-6 pb-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2"><span className="text-4xl">🐕‍🦺</span><div><h1 className="text-2xl font-bold">Kerberos Authentication</h1><p className="text-sm opacity-80">Interactive Deep Dive — From Basics to Golden Ticket</p></div></div>
          <div className="flex flex-wrap gap-1 mt-4">
            {sections.map((s, i) => (
              <button key={i} onClick={() => setActive(i)} className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-all ${active===i?"bg-white text-gray-900":"bg-white bg-opacity-10 hover:bg-opacity-20"}`}>{s}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-6">
        {R()}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <button onClick={() => setActive(Math.max(0,active-1))} disabled={active===0} className={`px-4 py-2 rounded-lg text-sm font-medium ${active===0?"text-gray-300":"text-blue-600 hover:bg-blue-50"}`}>← {active>0&&sections[active-1]}</button>
          <span className="text-xs text-gray-400 self-center">{active+1} / {sections.length}</span>
          <button onClick={() => setActive(Math.min(sections.length-1,active+1))} disabled={active===sections.length-1} className={`px-4 py-2 rounded-lg text-sm font-medium ${active===sections.length-1?"text-gray-300":"text-blue-600 hover:bg-blue-50"}`}>{active<sections.length-1&&sections[active+1]} →</button>
        </div>
      </div>
    </div>
  );
}