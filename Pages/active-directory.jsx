import { useState } from "react";

export default function ADGuide() {
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
      <p className="text-sm text-red-900 leading-relaxed">{children}</p>
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
    { id: "overview", title: "AD Overview", icon: "🏰", color: "#0ea5e9" },
    { id: "database", title: "AD Database", icon: "🗄️", color: "#8b5cf6" },
    { id: "fsmo", title: "FSMO Roles", icon: "👑", color: "#f59e0b" },
    { id: "sites", title: "AD Sites", icon: "🌐", color: "#10b981" },
    { id: "trusts", title: "AD Trusts", icon: "🤝", color: "#ec4899" },
    { id: "security", title: "Security", icon: "🛡️", color: "#ef4444" },
    { id: "quiz", title: "Quiz", icon: "🧠", color: "#6366f1" },
  ];

  /* ══════════════════════════════════════════════════════
     SECTION 1 — AD OVERVIEW
     ══════════════════════════════════════════════════════ */

  const renderOverview = () => (
    <div>
      <SectionTitle icon="🏰">What is Active Directory?</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Active Directory (AD) is Microsoft's directory service for Windows domain networks. It stores information about objects on the network — users, computers, groups, policies — and makes this data available to administrators and users. AD uses <strong>LDAP</strong>, <strong>Kerberos</strong>, and <strong>DNS</strong> as its core protocols.
      </p>

      <Analogy>
        Think of Active Directory as a <strong>city's government registry</strong>. The Forest is the country, Domains are states/provinces, OUs are cities, and every person, building, and vehicle is registered (users, computers, printers). Domain Controllers are the government offices that hold copies of all records.
      </Analogy>

      {/* ── Logical Hierarchy ── */}
      <SectionTitle icon="🌳">Logical Hierarchy: Forest → Domain → OU</SectionTitle>

      <DiagramBox title="AD Logical Structure">
{`┌─────────────────────────────────────────────────────────┐
│                    🌳 FOREST                             │
│              (corp.example.com)                          │
│         Highest boundary · Shared schema                 │
│                                                         │
│  ┌────────────────────┐   ┌────────────────────────┐    │
│  │   🌲 TREE 1         │   │   🌲 TREE 2             │    │
│  │                    │   │                        │    │
│  │ ┌────────────────┐ │   │ ┌────────────────────┐ │    │
│  │ │ 🏛️ ROOT DOMAIN  │ │   │ │ 🏛️ ROOT DOMAIN     │ │    │
│  │ │ corp.example.com│ │   │ │ dev.example.com    │ │    │
│  │ └──────┬─────────┘ │   │ └──────┬─────────────┘ │    │
│  │        │           │   │        │               │    │
│  │  ┌─────┴──────┐    │   │  ┌─────┴──────┐       │    │
│  │  │CHILD DOMAIN│    │   │  │CHILD DOMAIN│       │    │
│  │  │us.corp     │    │   │  │lab.dev     │       │    │
│  │  │.example.com│    │   │  │.example.com│       │    │
│  │  └────────────┘    │   │  └────────────┘       │    │
│  └────────────────────┘   └────────────────────────┘    │
│                                                         │
│  Shared: Schema partition, Configuration partition,     │
│          Global Catalog, Trust relationships             │
└─────────────────────────────────────────────────────────┘`}
      </DiagramBox>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-sky-50 border-2 border-sky-200 rounded-xl p-4">
          <div className="text-2xl mb-2">🌳</div>
          <h4 className="font-bold text-sky-800 text-sm mb-1">Forest</h4>
          <p className="text-xs text-sky-700 leading-relaxed">
            The <strong>top-level security boundary</strong>. All domains in a forest share a common schema, configuration, and Global Catalog. A forest is the ultimate trust boundary — nothing is shared across forests unless an explicit trust exists.
          </p>
        </div>
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4">
          <div className="text-2xl mb-2">🏛️</div>
          <h4 className="font-bold text-indigo-800 text-sm mb-1">Domain</h4>
          <p className="text-xs text-indigo-700 leading-relaxed">
            A <strong>logical partition</strong> within the forest. Each domain maintains its own database of objects, its own security policies, and its own set of trust relationships with other domains. Domains share contiguous DNS namespaces within a tree.
          </p>
        </div>
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
          <div className="text-2xl mb-2">📁</div>
          <h4 className="font-bold text-emerald-800 text-sm mb-1">Organizational Unit (OU)</h4>
          <p className="text-xs text-emerald-700 leading-relaxed">
            A <strong>container within a domain</strong> used to organize objects and delegate administration. OUs can have Group Policies (GPOs) linked to them. They are <em>not</em> a security boundary — just an organizational one.
          </p>
        </div>
      </div>

      {/* ── Domain Controller ── */}
      <SectionTitle icon="🖥️">Domain Controller (DC)</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">
        A Domain Controller is a server that hosts a copy of the AD database (NTDS.dit) and responds to authentication requests. All DCs in a domain are peers — AD uses <strong>multi-master replication</strong>, meaning any DC can accept writes (with exceptions for FSMO roles).
      </p>

      <ExpandCard id="dc-writable" icon="✏️" title="Writable Domain Controller" subtitle="Standard DC — accepts reads and writes" color="#3b82f6">
        <ul className="list-disc ml-4 space-y-1 text-sm">
          <li>Hosts a full read/write copy of the domain partition</li>
          <li>Processes authentication (Kerberos TGT issuance)</li>
          <li>Replicates changes bidirectionally with other DCs</li>
          <li>Can create, modify, and delete AD objects</li>
          <li>Runs the KDC (Key Distribution Center) service</li>
          <li>Minimum recommendation: <strong>2 writable DCs per domain</strong> for redundancy</li>
        </ul>
      </ExpandCard>

      <ExpandCard id="dc-rodc" icon="👁️" title="Read-Only Domain Controller (RODC)" subtitle="Restricted DC for branch offices and DMZs" color="#f59e0b">
        <p className="mb-3">An RODC holds a <strong>read-only copy</strong> of the AD database. It was introduced in Windows Server 2008 for scenarios where physical security cannot be guaranteed.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="font-bold text-green-800 text-xs mb-2">Key Features</div>
            <ul className="list-disc ml-3 space-y-1 text-xs text-green-700">
              <li>Read-only NTDS.dit — no write operations</li>
              <li>Unidirectional replication (receives only)</li>
              <li>Filtered attribute set (can exclude sensitive data)</li>
              <li>Credential caching controlled by password replication policy</li>
              <li>Read-only DNS</li>
              <li>Admin role separation (local admin without domain admin)</li>
            </ul>
          </div>
          <div className="bg-amber-50 rounded-lg p-3">
            <div className="font-bold text-amber-800 text-xs mb-2">When to Use</div>
            <ul className="list-disc ml-3 space-y-1 text-xs text-amber-700">
              <li>Branch offices with poor physical security</li>
              <li>DMZ networks</li>
              <li>Locations without local IT staff</li>
              <li>When you want local authentication but limited risk</li>
              <li>Read-heavy workloads with infrequent writes</li>
            </ul>
          </div>
        </div>
        <Warning title="RODC Compromise Risk">
          If an RODC is compromised, only the passwords cached on it are at risk. Ensure your Password Replication Policy only caches credentials for users who actually authenticate at that site.
        </Warning>
      </ExpandCard>

      <ExpandCard id="dc-gc" icon="📚" title="Global Catalog (GC) Server" subtitle="Holds a partial, read-only copy of ALL domains" color="#8b5cf6">
        <p className="mb-2">A Global Catalog server stores a <strong>full copy of its own domain's objects</strong> plus a <strong>partial (read-only) copy of every other domain in the forest</strong>. It stores the most commonly searched attributes.</p>
        <ul className="list-disc ml-4 space-y-1 text-sm">
          <li>Enables forest-wide searches without querying every domain</li>
          <li>Required for Universal Group membership resolution during login</li>
          <li>Runs on <strong>TCP port 3268</strong> (LDAP) and <strong>3269</strong> (LDAPS)</li>
          <li>First DC in a forest is automatically a GC</li>
          <li>Recommendation: <strong>every DC should be a GC</strong> in most designs</li>
        </ul>
      </ExpandCard>

      <DiagramBox title="DC Types Comparison">
{`┌──────────────────┬──────────────┬──────────────┬──────────────┐
│ Feature          │ Writable DC  │ RODC         │ GC Server    │
├──────────────────┼──────────────┼──────────────┼──────────────┤
│ Read AD objects   │ ✅ Yes        │ ✅ Yes        │ ✅ Yes (all)   │
│ Write AD objects  │ ✅ Yes        │ ❌ No         │ ✅ Own domain  │
│ Replication       │ ↔ Bi-dir     │ ← Receive    │ ↔ Bi-dir     │
│ Password cache    │ All          │ Policy-based │ All (own)    │
│ FSMO holder       │ ✅ Possible   │ ❌ Never      │ ✅ Possible   │
│ Kerberos KDC      │ ✅ Full       │ ⚡ Limited    │ ✅ Full       │
│ Typical location  │ HQ / DC      │ Branch / DMZ │ Every site   │
└──────────────────┴──────────────┴──────────────┴──────────────┘`}
      </DiagramBox>
    </div>
  );

  /* ══════════════════════════════════════════════════════
     SECTION 2 — AD DATABASE
     ══════════════════════════════════════════════════════ */

  const renderDatabase = () => (
    <div>
      <SectionTitle icon="🗄️">The AD Database: NTDS.dit</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Active Directory stores all its data in a file called <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">NTDS.dit</code>, located by default at <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">%SystemRoot%\NTDS\ntds.dit</code>. This file uses the <strong>Extensible Storage Engine (ESE)</strong>, also known as <strong>JET Blue</strong> — the same database engine used by Microsoft Exchange.
      </p>

      <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 mb-4">
        <div className="font-bold text-slate-800 text-sm mb-2">Database Files on Every DC</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { file: "ntds.dit", desc: "Main AD database — all objects, attributes, and the schema", icon: "📦", size: "Can grow to several GB" },
            { file: "edb.log", desc: "Transaction log — writes are journaled here first", icon: "📝", size: "10 MB each (rotating)" },
            { file: "edb.chk", desc: "Checkpoint file — tracks which log entries are committed", icon: "✅", size: "Small" },
            { file: "temp.edb", desc: "Temporary scratch space for in-progress transactions", icon: "⏳", size: "Variable" },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <span>{f.icon}</span>
                <code className="font-mono text-xs font-bold text-slate-800">{f.file}</code>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              <p className="text-xs text-slate-400 mt-1">Size: {f.size}</p>
            </div>
          ))}
        </div>
      </div>

      <Analogy>
        NTDS.dit is like a bank's <strong>central ledger</strong>. The transaction logs (edb.log) are the teller's notepad — every change is written there first before being posted to the ledger. The checkpoint file (edb.chk) marks which notes have been posted. If the bank loses power, the notepad can replay unfinished work.
      </Analogy>

      {/* ── Partitions ── */}
      <SectionTitle icon="📊">AD Partitions (Naming Contexts)</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        The NTDS.dit database is logically divided into <strong>partitions</strong> (also called <strong>naming contexts</strong>). Each partition holds a different category of data and has its own replication scope.
      </p>

      <ExpandCard id="part-schema" icon="📐" title="Schema Partition" subtitle="Forest-wide · Replicated to ALL DCs" color="#8b5cf6">
        <p className="mb-2">Defines the <strong>blueprint</strong> for every object class and attribute in the forest. There is exactly <strong>one schema for the entire forest</strong>.</p>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>DN:</strong> <code className="bg-slate-100 px-1 rounded text-xs">CN=Schema,CN=Configuration,DC=corp,DC=example,DC=com</code></li>
          <li>Contains class definitions (e.g., "user", "computer", "group")</li>
          <li>Contains attribute definitions (e.g., "sAMAccountName", "mail")</li>
          <li>Changes are controlled by the <strong>Schema Master FSMO</strong> role holder</li>
          <li>Schema modifications are <strong>irreversible</strong> (attributes can only be deactivated, not deleted)</li>
        </ul>
        <Warning title="Schema Changes Are Permanent">
          Never modify the schema in production without testing in a lab first. Schema extensions cannot be removed — only deactivated. A bad schema change can break the entire forest.
        </Warning>
      </ExpandCard>

      <ExpandCard id="part-config" icon="⚙️" title="Configuration Partition" subtitle="Forest-wide · Replicated to ALL DCs" color="#0ea5e9">
        <p className="mb-2">Stores the <strong>topology and configuration</strong> of the forest — sites, subnets, site links, services, and replication connections.</p>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>DN:</strong> <code className="bg-slate-100 px-1 rounded text-xs">CN=Configuration,DC=corp,DC=example,DC=com</code></li>
          <li>Sites, Subnets, and Site Links</li>
          <li>Replication topology (NTDS Settings, Connection objects)</li>
          <li>Service configuration (Exchange, ADFS, etc.)</li>
          <li>Display specifiers (how objects appear in admin tools)</li>
        </ul>
      </ExpandCard>

      <ExpandCard id="part-domain" icon="🏛️" title="Domain Partition" subtitle="Domain-wide · Replicated to DCs in same domain" color="#10b981">
        <p className="mb-2">Contains <strong>all the actual objects</strong> in the domain — users, computers, groups, OUs, GPOs.</p>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>DN:</strong> <code className="bg-slate-100 px-1 rounded text-xs">DC=corp,DC=example,DC=com</code></li>
          <li>User accounts and their attributes</li>
          <li>Computer accounts</li>
          <li>Security groups and distribution groups</li>
          <li>Organizational Units (OUs)</li>
          <li>Group Policy Objects (GPOs)</li>
          <li><strong>Each domain has its own partition — not shared across domains</strong></li>
        </ul>
      </ExpandCard>

      <ExpandCard id="part-dns" icon="🌐" title="Application Partitions (DNS Zones)" subtitle="Configurable replication scope" color="#ec4899">
        <p className="mb-2">AD-integrated DNS stores zone data in special application partitions with <strong>flexible replication scope</strong>.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          <div className="bg-pink-50 rounded-lg p-3">
            <div className="font-bold text-pink-800 text-xs mb-1">ForestDnsZones</div>
            <p className="text-xs text-pink-700">Replicated to <strong>all DNS servers in the forest</strong>. Stores forest-wide DNS records (e.g., _msdcs zone).</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="font-bold text-purple-800 text-xs mb-1">DomainDnsZones</div>
            <p className="text-xs text-purple-700">Replicated to <strong>all DNS servers in the domain</strong>. Stores domain-specific DNS records.</p>
          </div>
        </div>
      </ExpandCard>

      <DiagramBox title="Partition Replication Scope">
{`  Replication Scope          Partition
  ─────────────────────────────────────────────
  🌳 All DCs in FOREST ──── Schema Partition
                           Configuration Partition
                           ForestDnsZones

  🏛️ All DCs in DOMAIN ──── Domain Partition
                           DomainDnsZones

  ─────────────────────────────────────────────
  Note: Global Catalog servers also store a
  PARTIAL read-only copy of every domain
  partition in the forest (subset of attributes)`}
      </DiagramBox>

      {/* ── SYSVOL ── */}
      <SectionTitle icon="📂">SYSVOL & Replication</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">
        <strong>SYSVOL</strong> is a special shared folder on every DC that stores Group Policy templates, login scripts, and other domain-wide files. It is <em>not</em> inside NTDS.dit — it lives on the file system.
      </p>

      <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 mb-4">
        <div className="font-bold text-slate-800 text-sm mb-2">SYSVOL Details</div>
        <ul className="list-disc ml-4 space-y-1 text-sm text-slate-600">
          <li><strong>Default path:</strong> <code className="bg-white px-1 rounded text-xs">%SystemRoot%\SYSVOL</code></li>
          <li><strong>Shared as:</strong> <code className="bg-white px-1 rounded text-xs">\\domain\SYSVOL</code> and <code className="bg-white px-1 rounded text-xs">\\domain\NETLOGON</code></li>
          <li><strong>Contains:</strong> GPO templates (Group Policy Templates folder), login/logoff scripts</li>
          <li><strong>Replication:</strong> Uses <strong>DFS-R</strong> (Distributed File System Replication) since Server 2008 R2; older environments used FRS (File Replication Service)</li>
        </ul>
      </div>

      <DiagramBox title="Replication: How DCs Stay in Sync">
{`  ┌─────────────┐    AD Replication     ┌─────────────┐
  │   DC-01      │ ◄════════════════════► │   DC-02      │
  │              │    (NTDS.dit data)     │              │
  │  NTDS.dit    │                       │  NTDS.dit    │
  │  SYSVOL  ────┼── DFS-R ────────────► │── SYSVOL     │
  │              │    (file-based)        │              │
  └──────┬───────┘                       └──────┬───────┘
         │          AD Replication               │
         ◄═══════════════════════════════════════►
         │                                       │
  ┌──────┴───────┐                       ┌──────┴───────┐
  │   DC-03      │                       │   RODC-01    │
  │  (Writable)  │                       │  (Read-only) │
  │              │                       │  ← One-way   │
  └──────────────┘                       └──────────────┘

  AD Replication = object-level, attribute-level replication
  DFS-R          = file-level replication for SYSVOL`}
      </DiagramBox>

      <InfoBox title="Write Conflict Resolution">
        When two DCs change the same attribute simultaneously, AD uses <strong>last-writer-wins</strong> based on a version number and timestamp. Each attribute has a USN (Update Sequence Number) and a replication metadata stamp. The higher version number wins; if tied, the later timestamp wins; if still tied, the DC with the higher GUID wins.
      </InfoBox>
    </div>
  );

  /* ══════════════════════════════════════════════════════
     SECTION 3 — FSMO ROLES
     ══════════════════════════════════════════════════════ */

  const fsmoRoles = [
    {
      name: "Schema Master",
      scope: "forest",
      icon: "📐",
      color: "#8b5cf6",
      one: "1 per forest",
      desc: "Controls all modifications to the AD schema. Only this DC can write to the Schema partition.",
      details: [
        "Only one DC in the entire forest holds this role",
        "Required when installing Exchange, ADFS, or any app that extends the schema",
        "If offline: no schema changes possible, but normal operations continue",
        "Rarely transferred — only when decommissioning or rebuilding the role holder",
      ],
    },
    {
      name: "Domain Naming Master",
      scope: "forest",
      icon: "🏷️",
      color: "#8b5cf6",
      one: "1 per forest",
      desc: "Controls addition and removal of domains (and application partitions) in the forest.",
      details: [
        "Must be a Global Catalog server",
        "Required when adding/removing child domains or application partitions",
        "If offline: cannot add or remove domains, but everything else works",
        "Should be on the same DC as the Schema Master in small environments",
      ],
    },
    {
      name: "RID Master",
      scope: "domain",
      icon: "🔢",
      color: "#0ea5e9",
      one: "1 per domain",
      desc: "Allocates pools of Relative IDs (RIDs) to each DC. RIDs are combined with the domain SID to create unique Security Identifiers (SIDs) for new objects.",
      details: [
        "Each DC gets a pool of ~500 RIDs at a time",
        "When a DC's pool runs low, it requests a new batch from the RID Master",
        "If offline: DCs can still create objects until their RID pool runs out",
        "Also handles domain-wide SID verification and cross-domain object moves",
      ],
    },
    {
      name: "PDC Emulator",
      scope: "domain",
      icon: "⏰",
      color: "#0ea5e9",
      one: "1 per domain",
      desc: "The busiest FSMO role. Handles password changes, account lockouts, time sync, GPO editing, and backward compatibility.",
      details: [
        "Receives urgent password change replication (password changes replicate to PDC Emulator immediately)",
        "Authoritative time source for the domain (other DCs sync from it, clients sync from DCs)",
        "Preferred DC for Group Policy management tools",
        "Handles account lockout processing",
        "If offline: password changes may take longer to propagate, time sync issues, GPO edit conflicts",
        "This role has the MOST impact on daily operations when unavailable",
      ],
    },
    {
      name: "Infrastructure Master",
      scope: "domain",
      icon: "🔗",
      color: "#0ea5e9",
      one: "1 per domain",
      desc: "Updates cross-domain references (phantom objects) when objects in other domains are renamed or moved.",
      details: [
        "Translates GUIDs, SIDs, and DNs of objects referenced from other domains",
        "Should NOT be on a Global Catalog server (in multi-domain forests) — otherwise it will never find stale references since it already has the data",
        "Exception: if ALL DCs are GCs (Microsoft's recommendation), this role is irrelevant",
        "If offline: cross-domain references may become stale, but within-domain operations are fine",
      ],
    },
  ];

  const renderFSMO = () => (
    <div>
      <SectionTitle icon="👑">FSMO Roles (Flexible Single Master Operations)</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        While AD uses <strong>multi-master replication</strong> (any DC can accept writes), certain operations must be handled by a single DC to prevent conflicts. These are the <strong>5 FSMO roles</strong>, split into 2 forest-wide and 3 domain-wide roles.
      </p>

      <Analogy>
        Even in a company where all managers can approve requests (multi-master), some decisions need a single authority: one person controls the org chart template (Schema Master), one approves opening new offices (Domain Naming Master), one issues employee ID numbers (RID Master), one is the "final say" on time and passwords (PDC Emulator), and one keeps the cross-office directory current (Infrastructure Master).
      </Analogy>

      <DiagramBox title="FSMO Role Distribution">
{`  ┌─────────────────────────────────────────────────────┐
  │            🌳 FOREST-WIDE ROLES (1 each)             │
  │                                                     │
  │    📐 Schema Master         🏷️ Domain Naming Master  │
  │    Controls schema writes    Controls domain add/rm  │
  │    (1 per forest)           (1 per forest, needs GC) │
  ├─────────────────────────────────────────────────────┤
  │          🏛️ DOMAIN-WIDE ROLES (1 each per domain)    │
  │                                                     │
  │    🔢 RID Master     ⏰ PDC Emulator    🔗 Infra     │
  │    Allocates SID     Password, time,    Cross-domain │
  │    pools to DCs      GPO, lockout       references   │
  │    (1 per domain)    (1 per domain)     (1 per dom.) │
  └─────────────────────────────────────────────────────┘

  Example: 1 forest with 3 domains = 2 + (3 × 3) = 11 FSMO roles`}
      </DiagramBox>

      {/* ── Individual Roles ── */}
      <h4 className="font-bold text-slate-700 text-sm mt-6 mb-3">Forest-Wide Roles</h4>
      {fsmoRoles.filter(r => r.scope === "forest").map((r, i) => (
        <ExpandCard key={i} id={`fsmo-${i}`} icon={r.icon} title={r.name} subtitle={r.one} color={r.color}>
          <p className="mb-2">{r.desc}</p>
          <ul className="list-disc ml-4 space-y-1">
            {r.details.map((d, j) => <li key={j}>{d}</li>)}
          </ul>
        </ExpandCard>
      ))}

      <h4 className="font-bold text-slate-700 text-sm mt-6 mb-3">Domain-Wide Roles</h4>
      {fsmoRoles.filter(r => r.scope === "domain").map((r, i) => (
        <ExpandCard key={i} id={`fsmo-d${i}`} icon={r.icon} title={r.name} subtitle={r.one} color={r.color}>
          <p className="mb-2">{r.desc}</p>
          <ul className="list-disc ml-4 space-y-1">
            {r.details.map((d, j) => <li key={j}>{d}</li>)}
          </ul>
        </ExpandCard>
      ))}

      {/* ── Transfer vs Seize ── */}
      <SectionTitle icon="🔄">Transferring vs Seizing FSMO Roles</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <div className="text-2xl mb-2">🤝</div>
          <h4 className="font-bold text-green-800 text-sm mb-2">Transfer (Graceful)</h4>
          <ul className="list-disc ml-3 space-y-1 text-xs text-green-700">
            <li>Current role holder is <strong>online and healthy</strong></li>
            <li>Uses <code className="bg-white px-1 rounded">Move-ADDirectoryServerOperationMasterRole</code></li>
            <li>Role is safely moved — both DCs coordinate the handoff</li>
            <li>Always preferred method</li>
          </ul>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="text-2xl mb-2">⚡</div>
          <h4 className="font-bold text-red-800 text-sm mb-2">Seize (Forced)</h4>
          <ul className="list-disc ml-3 space-y-1 text-xs text-red-700">
            <li>Current role holder is <strong>permanently offline/dead</strong></li>
            <li>Uses <code className="bg-white px-1 rounded">Move-ADDirectoryServerOperationMasterRole -Force</code> or <code className="bg-white px-1 rounded">ntdsutil</code></li>
            <li>Role is forcibly claimed — the old holder must <strong>never come back online</strong></li>
            <li>Last resort only — the old DC must be demoted before reconnecting</li>
          </ul>
        </div>
      </div>

      <DiagramBox title="FSMO Transfer Sequence">
{`  Admin                  New DC (DC-02)           Old DC (DC-01)
    │                         │                         │
    │── Transfer request ────►│                         │
    │                         │── "I want the role" ───►│
    │                         │                         │
    │                         │◄── "OK, role released" ─│
    │                         │                         │
    │                         │ (Updates roleOwner      │
    │                         │  attribute in AD)       │
    │                         │                         │
    │◄── "Transfer complete" ─│                         │
    │                         │                         │
    ▼                         ▼                         ▼

  SEIZE (when old DC is dead):
  Admin                  New DC (DC-02)           Old DC (DC-01)
    │                         │                         │ ✖ OFFLINE
    │── Seize request ───────►│                         │
    │                         │── (tries to contact) ──►│ ✖ TIMEOUT
    │                         │                         │
    │                         │ (Forcibly updates       │
    │                         │  roleOwner attribute)   │
    │                         │                         │
    │◄── "Role seized" ──────│                         │
    │                         │                         │
  ⚠️ Old DC must NEVER rejoin the domain without being demoted first!`}
      </DiagramBox>

      <InfoBox title="How to Check Current FSMO Holders">
        <div className="space-y-1 font-mono text-xs">
          <div><strong>PowerShell:</strong> <code className="bg-white px-1 rounded">netdom query fsmo</code></div>
          <div><strong>Or:</strong> <code className="bg-white px-1 rounded">Get-ADForest | Select SchemaMaster, DomainNamingMaster</code></div>
          <div><strong>And:</strong> <code className="bg-white px-1 rounded">Get-ADDomain | Select PDCEmulator, RIDMaster, InfrastructureMaster</code></div>
        </div>
      </InfoBox>
    </div>
  );

  /* ══════════════════════════════════════════════════════
     SECTION 4 — AD SITES
     ══════════════════════════════════════════════════════ */

  const renderSites = () => (
    <div>
      <SectionTitle icon="🌐">What is an AD Site?</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        An AD Site represents a <strong>well-connected group of IP subnets</strong> — typically a physical location (data center, office, campus). Sites control <strong>replication traffic</strong> and help clients find the <strong>nearest Domain Controller</strong>.
      </p>

      <Analogy>
        Sites are like <strong>postal zones</strong>. Within the same zone (site), mail (replication) is delivered quickly and frequently. Between zones (sites), mail goes via specific routes (site links) on a schedule to save bandwidth — like a mail truck that runs once an hour.
      </Analogy>

      {/* ── Components ── */}
      <SectionTitle icon="🧩">Site Components</SectionTitle>

      <ExpandCard id="site-obj" icon="📍" title="Sites" subtitle="Logical representation of physical locations" color="#10b981">
        <ul className="list-disc ml-4 space-y-1">
          <li>Each site is a container in the Configuration partition</li>
          <li>A new forest starts with one site: <code className="bg-slate-100 px-1 rounded text-xs">Default-First-Site-Name</code></li>
          <li>Sites do NOT need to align with domains — a single domain can span multiple sites, and a site can contain DCs from multiple domains</li>
          <li>DCs are assigned to sites based on their IP subnet</li>
        </ul>
      </ExpandCard>

      <ExpandCard id="site-subnet" icon="🔌" title="Subnets" subtitle="IP ranges mapped to sites" color="#3b82f6">
        <p className="mb-2">Each subnet object maps an IP range (CIDR notation) to a site.</p>
        <ul className="list-disc ml-4 space-y-1">
          <li>Example: <code className="bg-slate-100 px-1 rounded text-xs">10.1.0.0/16 → London-Site</code></li>
          <li>A client's IP determines which site it belongs to</li>
          <li><strong>Critical for DC locator:</strong> clients use their subnet to find the nearest DC</li>
          <li>Unmapped subnets cause clients to authenticate against random DCs (slow!)</li>
        </ul>
        <Warning>
          Always ensure every IP subnet in your network is mapped to a site. Unmapped clients will get redirected to random DCs, causing slow logins and unnecessary WAN traffic.
        </Warning>
      </ExpandCard>

      <ExpandCard id="site-link" icon="🔗" title="Site Links" subtitle="Replication paths between sites" color="#f59e0b">
        <p className="mb-2">Site links define which sites can replicate with each other and on what schedule.</p>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>Cost:</strong> lower cost = preferred path (default: 100)</li>
          <li><strong>Replication interval:</strong> minimum 15 minutes (default: 180 minutes / 3 hours)</li>
          <li><strong>Schedule:</strong> 24/7 by default, can restrict to off-hours</li>
          <li><strong>Transport:</strong> IP (RPC over IP) — standard; SMTP — only for schema/config partitions across slow links</li>
          <li>Default link: <code className="bg-slate-100 px-1 rounded text-xs">DEFAULTIPSITELINK</code></li>
        </ul>
      </ExpandCard>

      <ExpandCard id="site-kcc" icon="🤖" title="Knowledge Consistency Checker (KCC)" subtitle="Automatic replication topology generator" color="#8b5cf6">
        <p className="mb-2">The KCC is an AD process that runs on every DC and <strong>automatically builds the replication topology</strong>.</p>
        <ul className="list-disc ml-4 space-y-1">
          <li>Runs every <strong>15 minutes</strong> by default</li>
          <li><strong>Intra-site:</strong> creates a ring topology with shortcut connections (max 3 hops to any DC)</li>
          <li><strong>Inter-site:</strong> uses the Inter-Site Topology Generator (ISTG) — one DC per site elected to build cross-site connections</li>
          <li>Creates <strong>Connection Objects</strong> in AD that define replication partnerships</li>
          <li>Automatically heals the topology if a DC goes offline</li>
        </ul>
      </ExpandCard>

      <DiagramBox title="Site Topology & Replication">
{`  ┌──────────────────────────────────────────────────────────────┐
  │                    AD Site Architecture                      │
  │                                                              │
  │  ┌─────────────────────┐         ┌─────────────────────┐    │
  │  │   🏢 HQ-Site         │         │   🏢 London-Site     │    │
  │  │   10.1.0.0/16       │         │   10.2.0.0/16       │    │
  │  │                     │         │                     │    │
  │  │  DC-01 ◄──► DC-02   │  Site   │  DC-03 ◄──► DC-04   │    │
  │  │   (ring topology)   │  Link   │   (ring topology)   │    │
  │  │                     ├─────────┤                     │    │
  │  │  Intra-site:        │Cost:200 │  Intra-site:        │    │
  │  │  • Automatic        │Int:60min│  • Automatic        │    │
  │  │  • Near-instant     │         │  • Near-instant     │    │
  │  │  • Change notif.    │         │  • Change notif.    │    │
  │  └─────────┬───────────┘         └─────────────────────┘    │
  │            │ Site Link                                      │
  │            │ Cost: 500                                      │
  │            │ Interval: 180 min                              │
  │  ┌─────────┴───────────┐                                    │
  │  │   🏢 Branch-Site     │                                    │
  │  │   10.3.0.0/16       │                                    │
  │  │                     │                                    │
  │  │  RODC-01            │                                    │
  │  │  (Read-only DC)     │                                    │
  │  └─────────────────────┘                                    │
  └──────────────────────────────────────────────────────────────┘`}
      </DiagramBox>

      {/* ── Intra vs Inter ── */}
      <SectionTitle icon="🔄">Intra-Site vs Inter-Site Replication</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <h4 className="font-bold text-green-800 text-sm mb-2">Intra-Site (Within a Site)</h4>
          <ul className="list-disc ml-3 space-y-1 text-xs text-green-700">
            <li><strong>Trigger:</strong> Change notification (near-instant)</li>
            <li><strong>Delay:</strong> ~15 seconds after a change, then 3-second staggered notifications</li>
            <li><strong>Compression:</strong> None (assumed fast LAN)</li>
            <li><strong>Topology:</strong> Ring + shortcuts (auto-built by KCC)</li>
            <li><strong>Transport:</strong> RPC over IP</li>
          </ul>
        </div>
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
          <h4 className="font-bold text-amber-800 text-sm mb-2">Inter-Site (Between Sites)</h4>
          <ul className="list-disc ml-3 space-y-1 text-xs text-amber-700">
            <li><strong>Trigger:</strong> Schedule-based (not instant)</li>
            <li><strong>Interval:</strong> Configurable (default 180 min, min 15 min)</li>
            <li><strong>Compression:</strong> Yes — data is compressed to save bandwidth</li>
            <li><strong>Topology:</strong> Bridgehead servers handle cross-site traffic</li>
            <li><strong>Transport:</strong> RPC over IP (or SMTP for schema/config only)</li>
          </ul>
        </div>
      </div>

      <DiagramBox title="Client DC Locator Process">
{`  Client (10.1.50.100)
    │
    │ 1. DNS query: _ldap._tcp.dc._msdcs.corp.example.com
    │
    ├──► DNS returns list of all DCs (SRV records)
    │
    │ 2. Client sends LDAP ping to nearest DC
    │    (DC checks client IP against subnet-to-site mapping)
    │
    ├──► DC responds: "You are in HQ-Site"
    │
    │ 3. If DC is in same site → use it ✅
    │    If DC is in different site → DC returns referral
    │    to a DC in client's site
    │
    │ 4. Client caches the site name in registry:
    │    HKLM\SYSTEM\CurrentControlSet\Services\Netlogon\Parameters\DynamicSiteName
    │
    └──► Subsequent lookups: _ldap._tcp.HQ-Site._sites.dc._msdcs.corp.example.com`}
      </DiagramBox>
    </div>
  );

  /* ══════════════════════════════════════════════════════
     SECTION 5 — AD TRUSTS
     ══════════════════════════════════════════════════════ */

  const trustTypes = [
    {
      name: "Parent-Child Trust",
      icon: "👨‍👦",
      color: "#3b82f6",
      direction: "Two-Way",
      transitive: "Yes",
      auto: "Automatic",
      desc: "Created automatically when a child domain is added to a tree. Example: us.corp.example.com trusts corp.example.com and vice versa.",
      details: "This trust follows the DNS hierarchy. If you create a child domain, the trust is established automatically. You cannot delete it without removing the child domain."
    },
    {
      name: "Tree-Root Trust",
      icon: "🌲",
      color: "#10b981",
      direction: "Two-Way",
      transitive: "Yes",
      auto: "Automatic",
      desc: "Created automatically when a new tree is added to an existing forest. Links the tree root to the forest root.",
      details: "For example, if the forest root is corp.example.com and you add a new tree dev.example.com, a tree-root trust is automatically created between them. This is a shortcut trust."
    },
    {
      name: "Shortcut Trust",
      icon: "⚡",
      color: "#f59e0b",
      direction: "One-Way or Two-Way",
      transitive: "Yes",
      auto: "Manual",
      desc: "Manually created between two domains in the same forest to speed up authentication by bypassing the trust path.",
      details: "Without a shortcut, auth between us.corp.example.com and lab.dev.example.com would traverse: child → parent → forest root → tree root → child. A shortcut trust creates a direct path."
    },
    {
      name: "Forest Trust",
      icon: "🌳",
      color: "#8b5cf6",
      direction: "One-Way or Two-Way",
      transitive: "Yes (within each forest)",
      auto: "Manual",
      desc: "Connects two separate forests. Requires Forest Functional Level 2003+. Provides access between all domains in both forests.",
      details: "Both forests must have their forest functional level at Windows Server 2003 or higher. Selective authentication can limit which users from the trusted forest can access resources. SID filtering is enabled by default."
    },
    {
      name: "External Trust",
      icon: "🔗",
      color: "#ec4899",
      direction: "One-Way or Two-Way",
      transitive: "No",
      auto: "Manual",
      desc: "Connects a domain in your forest to a domain in another forest (or a standalone NT4 domain). Non-transitive — only between the two specific domains.",
      details: "Use this when you need access to just one specific domain in another forest, or when the other forest's functional level is too low for a forest trust. SID filtering is enabled by default."
    },
    {
      name: "Realm Trust",
      icon: "🐧",
      color: "#059669",
      direction: "One-Way or Two-Way",
      transitive: "Configurable",
      auto: "Manual",
      desc: "Connects an AD domain to a non-Windows Kerberos realm (e.g., MIT Kerberos on Linux). Uses Kerberos authentication across platforms.",
      details: "Requires both sides to be running Kerberos. Transitivity can be configured. This is the bridge between Windows AD and Unix/Linux Kerberos environments."
    },
  ];

  const renderTrusts = () => (
    <div>
      <SectionTitle icon="🤝">What is an AD Trust?</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        A trust is a <strong>logical relationship between two domains</strong> that allows users in one domain to be authenticated and access resources in the other. Trusts define the "path" that authentication requests follow.
      </p>

      <Analogy>
        AD trusts are like <strong>passport agreements between countries</strong>. A two-way trust is like a mutual visa-free travel agreement — citizens of either country can visit the other. A one-way trust is like a unilateral visa exemption — only one side's citizens can travel freely. Transitive trusts are like the EU's Schengen Area — if Country A trusts Country B, and B trusts C, then A automatically trusts C.
      </Analogy>

      {/* ── Direction & Transitivity ── */}
      <SectionTitle icon="🧭">Trust Direction & Transitivity</SectionTitle>

      <DiagramBox title="Trust Direction">
{`  ONE-WAY TRUST (Trusting → Trusted)
  ┌─────────────┐        ┌─────────────┐
  │  Domain A    │───────►│  Domain B    │
  │  (Trusting)  │ trusts │  (Trusted)   │
  └─────────────┘        └─────────────┘
  Users in B ──► can access resources in A
  Users in A ──✖ cannot access resources in B

  💡 The arrow points to the TRUSTED domain.
     Access flows OPPOSITE to the arrow.

  TWO-WAY TRUST
  ┌─────────────┐        ┌─────────────┐
  │  Domain A    │◄──────►│  Domain B    │
  │              │ trusts │              │
  └─────────────┘        └─────────────┘
  Users in A ◄──► can access resources in B (and vice versa)`}
      </DiagramBox>

      <DiagramBox title="Transitivity">
{`  TRANSITIVE TRUST
  ┌───────┐       ┌───────┐       ┌───────┐
  │   A   │◄─────►│   B   │◄─────►│   C   │
  └───────┘       └───────┘       └───────┘
  A trusts B, B trusts C → A automatically trusts C ✅

  NON-TRANSITIVE TRUST
  ┌───────┐       ┌───────┐       ┌───────┐
  │   A   │◄─────►│   B   │◄─────►│   C   │
  └───────┘       └───────┘       └───────┘
  A trusts B, B trusts C → A does NOT trust C ❌
  (Each trust is isolated)`}
      </DiagramBox>

      {/* ── Trust Types ── */}
      <SectionTitle icon="📋">Trust Types</SectionTitle>

      {trustTypes.map((t, i) => (
        <ExpandCard key={i} id={`trust-${i}`} icon={t.icon} title={t.name} subtitle={`${t.direction} · ${t.transitive} transitive · ${t.auto}`} color={t.color}>
          <p className="mb-3">{t.desc}</p>
          <p className="text-slate-500 text-xs mb-3">{t.details}</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 rounded-lg p-2 text-center">
              <div className="text-xs text-slate-400">Direction</div>
              <div className="text-xs font-bold text-slate-700">{t.direction}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-2 text-center">
              <div className="text-xs text-slate-400">Transitive</div>
              <div className="text-xs font-bold text-slate-700">{t.transitive}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-2 text-center">
              <div className="text-xs text-slate-400">Creation</div>
              <div className="text-xs font-bold text-slate-700">{t.auto}</div>
            </div>
          </div>
        </ExpandCard>
      ))}

      <DiagramBox title="Trust Relationships in a Multi-Forest Environment">
{`  ┌──────────────────────────────────┐    Forest    ┌──────────────────────────┐
  │        🌳 FOREST A                │    Trust     │    🌳 FOREST B            │
  │                                  │◄════════════►│                          │
  │  corp.example.com (root)         │  (Two-Way,   │  partner.com (root)      │
  │       │                          │   Transitive │       │                  │
  │       ├── us.corp.example.com    │   within)    │       ├── eu.partner.com │
  │       │    (Parent─Child, auto)  │              │       │                  │
  │       ├── uk.corp.example.com    │              │       └── ap.partner.com │
  │       │    (Parent─Child, auto)  │              │                          │
  │       │         ⚡                │              └──────────────────────────┘
  │       │    (Shortcut Trust       │
  │       │     to dev.example.com)  │         External    ┌──────────────────┐
  │       │                          │         Trust       │  legacy.old.com  │
  │  dev.example.com (tree root)     │────────────────────►│  (NT4 / single   │
  │       │  (Tree─Root trust, auto) │    (One-Way,        │   domain)        │
  │       │                          │     Non-Transitive) │                  │
  │       └── lab.dev.example.com    │                     └──────────────────┘
  │                                  │
  └──────────────────────────────────┘`}
      </DiagramBox>

      <InfoBox title="SID Filtering & Selective Authentication">
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>SID Filtering:</strong> Enabled by default on external and forest trusts. Strips foreign SIDs from tokens to prevent SID history abuse (a major attack vector). Only disable if you understand the risk.</li>
          <li><strong>Selective Authentication:</strong> Available on forest trusts. Instead of granting blanket access, you explicitly grant "Allowed to Authenticate" permission on specific resources. More secure but more management overhead.</li>
        </ul>
      </InfoBox>
    </div>
  );

  /* ══════════════════════════════════════════════════════
     SECTION 6 — SECURITY
     ══════════════════════════════════════════════════════ */

  const securityItems = [
    {
      title: "Administrative Tiering (Red Forest / ESAE)",
      icon: "🏗️",
      color: "#ef4444",
      items: [
        "Implement the 3-tier admin model: Tier 0 (DC/AD admins), Tier 1 (server admins), Tier 2 (workstation admins)",
        "Never use Tier 0 credentials on Tier 1/2 systems — prevents credential theft escalation",
        "Use Privileged Access Workstations (PAWs) for Tier 0 and Tier 1 administration",
        "Consider Enhanced Security Admin Environment (ESAE) — a hardened forest for Tier 0 management",
        "Deploy 'Admin Forest' (Red Forest) where admin accounts live in a separate, trusted forest",
      ]
    },
    {
      title: "Domain Controller Hardening",
      icon: "🖥️",
      color: "#0ea5e9",
      items: [
        "DCs should be on a dedicated VLAN with strict firewall rules",
        "Only install the AD DS, DNS, and required roles — no extra software",
        "Use Server Core (no GUI) to reduce attack surface",
        "Enable BitLocker on DC volumes — especially RODCs in branch offices",
        "Disable print spooler service on DCs (prevents PrintNightmare and similar exploits)",
        "Apply Security Compliance Toolkit (SCT) or CIS baselines via GPO",
        "Restrict who can log on to DCs (only Tier 0 admins)",
      ]
    },
    {
      title: "Kerberos & Authentication Security",
      icon: "🔑",
      color: "#8b5cf6",
      items: [
        "Disable RC4 (ArcFour) encryption — enforce AES-128 and AES-256 for Kerberos",
        "Enable Kerberos Armoring (FAST) where possible",
        "Configure Kerberos constrained delegation carefully — prefer resource-based constrained delegation",
        "Avoid unconstrained delegation at all costs (allows credential theft from any connecting user)",
        "Set up Protected Users security group for privileged accounts (disables NTLM, forces Kerberos, shorter TGT lifetime)",
        "Deploy credential guard on workstations to protect cached credentials",
      ]
    },
    {
      title: "LAPS & Password Management",
      icon: "🔒",
      color: "#10b981",
      items: [
        "Deploy LAPS (Local Administrator Password Solution) for randomizing local admin passwords",
        "Windows LAPS (built into Server 2019+/Win 11) replaces legacy Microsoft LAPS",
        "Enable password encryption and history in Windows LAPS",
        "Use Group Managed Service Accounts (gMSA) instead of regular service accounts where possible",
        "Fine-Grained Password Policies: enforce stronger policies for admin and service accounts",
        "KRBTGT password: reset twice (with replication wait between) at least every 180 days",
      ]
    },
    {
      title: "Group Policy (GPO) Security",
      icon: "📜",
      color: "#f59e0b",
      items: [
        "Restrict GPO editing to authorized personnel only",
        "Deploy AppLocker or Windows Defender Application Control (WDAC) via GPO",
        "Configure audit policies: logon events, privilege use, object access, directory service changes",
        "Enable Advanced Audit Policy Configuration for granular logging",
        "Block inheritance carefully — use Security Filtering and WMI Filters instead where possible",
        "Regularly review GPOs for drift and unauthorized changes",
      ]
    },
    {
      title: "Monitoring & Attack Detection",
      icon: "👁️",
      color: "#ec4899",
      items: [
        "Forward DC event logs to a SIEM (Splunk, Sentinel, Elastic)",
        "Monitor critical events: 4624/4625 (logon), 4672 (special privilege), 4768/4769 (Kerberos), 4728/4732/4756 (group changes)",
        "Deploy Microsoft Defender for Identity (formerly Azure ATP) for behavioral detection",
        "Alert on: DCSync attacks (Directory Replication Service), Golden Ticket usage, DCShadow, Kerberoasting",
        "Monitor AdminSDHolder for unauthorized ACL changes",
        "Watch for new FSMO role holders and unexpected replication partners",
        "Implement honeypot accounts (decoy admin accounts) to detect attackers enumerating AD",
      ]
    },
    {
      title: "Secure New Domain Checklist",
      icon: "✅",
      color: "#6366f1",
      items: [
        "Rename or disable the default Administrator account",
        "Create separate admin accounts (day-to-day account + privileged account)",
        "Remove Authenticated Users from Pre-Windows 2000 Compatible Access group",
        "Raise the Domain and Forest Functional Level to the latest supported version",
        "Enable the AD Recycle Bin (requires Forest FL 2008 R2+)",
        "Configure DNS to use AD-integrated zones with secure dynamic updates only",
        "Deploy at least 2 DCs per domain for redundancy",
        "Place FSMO roles on reliable, well-connected DCs",
        "Set up automated AD backups (system state backup) daily",
        "Document your OU structure, GPO links, delegation model, and trust relationships",
      ]
    },
  ];

  const renderSecurity = () => (
    <div>
      <SectionTitle icon="🛡️">Security Considerations for Active Directory</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Active Directory is the <strong>backbone of enterprise identity</strong> — if AD is compromised, the attacker owns everything. The sections below cover the critical security measures for setting up and maintaining a secure AD environment.
      </p>

      <Warning title="AD is the #1 Target">
        Over 90% of Fortune 500 companies use Active Directory. Attackers target AD because gaining Domain Admin access means controlling all users, computers, and data in the environment. Security must be built into AD from day one — retrofitting is much harder.
      </Warning>

      <DiagramBox title="AD Attack Surface Overview">
{`  ┌─────────────────────────────────────────────────────────────────┐
  │                   AD ATTACK SURFACE                             │
  │                                                                 │
  │  Credential Attacks        Protocol Attacks       Config Flaws  │
  │  ─────────────────         ────────────────       ────────────  │
  │  • Kerberoasting           • LDAP Relay           • Weak GPOs  │
  │  • AS-REP Roasting         • NTLM Relay           • Open ACLs  │
  │  • Pass-the-Hash           • DCSync               • No tiering │
  │  • Pass-the-Ticket         • DCShadow             • Stale SPNs │
  │  • Golden Ticket           • Skeleton Key         • No LAPS    │
  │  • Silver Ticket           • Print Spooler abuse  • FG pwd off │
  │                            • Constrained Deleg.                 │
  │                                                                 │
  │  ─────────────────────── DEFENSES ───────────────────────────── │
  │  Tiering │ LAPS │ PAW │ Protected Users │ Monitoring │ Backup   │
  └─────────────────────────────────────────────────────────────────┘`}
      </DiagramBox>

      {securityItems.map((s, i) => (
        <ExpandCard key={i} id={`sec-${i}`} icon={s.icon} title={s.title} color={s.color}>
          <ul className="list-disc ml-4 space-y-1.5">
            {s.items.map((item, j) => <li key={j}>{item}</li>)}
          </ul>
        </ExpandCard>
      ))}

      <DiagramBox title="Recommended Admin Tiering Model">
{`  ┌──────────────────────────────────────────────────────────────┐
  │                    TIER 0 — Identity                         │
  │              Domain Controllers, AD, PKI, ADFS               │
  │            🔒 Only accessed from PAW workstations             │
  │            🔒 Separate admin accounts (t0-admin)              │
  │            🔒 No internet access, no email                    │
  ├──────────────────────────────────────────────────────────────┤
  │                    TIER 1 — Infrastructure                   │
  │         Member servers, databases, app servers, SCCM         │
  │            🔒 Separate admin accounts (t1-admin)              │
  │            🔒 Cannot log into Tier 0 systems                  │
  │            🔒 Cannot be managed FROM Tier 2                   │
  ├──────────────────────────────────────────────────────────────┤
  │                    TIER 2 — Endpoints                        │
  │         Workstations, laptops, user devices                  │
  │            🔒 Help desk accounts (t2-admin)                   │
  │            🔒 No privilege escalation path to Tier 1/0        │
  │            🔒 Standard user accounts live here                │
  └──────────────────────────────────────────────────────────────┘

  ⛔ RULE: Credentials from higher tiers NEVER touch lower tiers
     (prevents credential theft escalation)`}
      </DiagramBox>
    </div>
  );

  /* ══════════════════════════════════════════════════════
     SECTION 7 — QUIZ
     ══════════════════════════════════════════════════════ */

  const quiz = [
    { q: "What is the highest security boundary in Active Directory?", opts: ["Domain", "Forest", "OU", "Site"], c: 1 },
    { q: "What database engine does NTDS.dit use?", opts: ["SQL Server", "SQLite", "Extensible Storage Engine (ESE / JET Blue)", "LevelDB"], c: 2 },
    { q: "How many Schema Master FSMO roles exist in a forest with 5 domains?", opts: ["5", "1", "10", "One per DC"], c: 1 },
    { q: "Which DC type holds a read-only copy of the AD database?", opts: ["Global Catalog", "PDC Emulator", "RODC", "Bridgehead Server"], c: 2 },
    { q: "What replication type does SYSVOL use (Server 2008 R2+)?", opts: ["AD Replication", "FRS", "DFS-R", "SMTP"], c: 2 },
    { q: "Which FSMO role is the authoritative time source for the domain?", opts: ["Schema Master", "Infrastructure Master", "RID Master", "PDC Emulator"], c: 3 },
    { q: "Which trust type is automatically created when adding a child domain?", opts: ["Forest Trust", "External Trust", "Parent-Child Trust", "Shortcut Trust"], c: 2 },
    { q: "What is the default inter-site replication interval?", opts: ["15 minutes", "60 minutes", "180 minutes", "24 hours"], c: 2 },
    { q: "Where should the Infrastructure Master NOT be placed (in a multi-domain forest)?", opts: ["On the PDC Emulator", "On a Global Catalog server", "On an RODC", "In the root domain"], c: 1 },
    { q: "What group should privileged accounts be added to for maximum Kerberos protection?", opts: ["Domain Admins", "Schema Admins", "Protected Users", "Enterprise Admins"], c: 2 },
    { q: "What does SID Filtering do on trusts?", opts: ["Blocks all authentication", "Strips foreign SIDs from tokens", "Encrypts SID values", "Converts SIDs to GUIDs"], c: 1 },
    { q: "Which partition is replicated to ALL DCs in the forest?", opts: ["Domain Partition", "Schema Partition", "DomainDnsZones", "Application Partition"], c: 1 },
  ];

  const renderQuiz = () => {
    const total = quiz.length;
    const answered = Object.keys(quizAns).length;
    const correct = showRes ? quiz.filter((q, i) => quizAns[i] === q.c).length : 0;

    return (
      <div>
        <SectionTitle icon="🧠">Knowledge Check</SectionTitle>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Test your understanding of Active Directory concepts. Select the best answer for each question.
        </p>

        {showRes && (
          <div className={`rounded-xl p-4 mb-6 border-2 text-center ${correct >= 10 ? "bg-green-50 border-green-300" : correct >= 7 ? "bg-amber-50 border-amber-300" : "bg-red-50 border-red-300"}`}>
            <div className="text-3xl mb-2">{correct >= 10 ? "🏆" : correct >= 7 ? "👍" : "📚"}</div>
            <div className="font-bold text-lg">{correct} / {total}</div>
            <div className="text-sm text-slate-600 mt-1">
              {correct >= 10 ? "Excellent! You know AD inside out!" : correct >= 7 ? "Good job! Review the sections you missed." : "Keep studying! Re-read the guide sections above."}
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
      case "database": return renderDatabase();
      case "fsmo": return renderFSMO();
      case "sites": return renderSites();
      case "trusts": return renderTrusts();
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
          <span style={{ fontSize: 32 }}>🏰</span>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>Active Directory</h1>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Domain Controllers, FSMO, Trusts & AD Architecture</p>
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
