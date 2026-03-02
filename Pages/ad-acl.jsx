import { useState } from "react";

/* ── SVG: ACL Evaluation Flow ── */
const AclEvaluationDiagram = () => {
  const W = 820, H = 560;
  const mkr = { blue: "#3B82F6", red: "#EF4444", green: "#10B981", gray: "#64748B", purple: "#8B5CF6", amber: "#F59E0B" };
  return (
    <div className="overflow-x-auto my-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[750px]" style={{ maxHeight: 580 }}>
        <defs>
          {Object.entries(mkr).map(([id, c]) => (
            <marker key={id} id={`acl-${id}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill={c} /></marker>
          ))}
          <filter id="acls" x="-4%" y="-4%" width="108%" height="108%"><feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.1" /></filter>
        </defs>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#1E293B">ACL Evaluation Order (Access Check Algorithm)</text>
        {/* User requests access */}
        <rect x={310} y={38} width={200} height={44} rx={10} fill="#EFF6FF" stroke="#3B82F6" strokeWidth={2} filter="url(#acls)" />
        <text x={410} y={57} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#1E40AF">User Requests Access</text>
        <text x={410} y={73} textAnchor="middle" fontSize={8} fill="#3B82F6">e.g., Read property on OU</text>
        {/* Arrow down */}
        <line x1={410} y1={86} x2={410} y2={108} stroke="#64748B" strokeWidth={2} markerEnd="url(#acl-gray)" />
        {/* Step 1: Owner? */}
        <rect x={300} y={112} width={220} height={40} rx={10} fill="#FAF5FF" stroke="#8B5CF6" strokeWidth={2} filter="url(#acls)" />
        <text x={410} y={130} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#6D28D9">1. Is user the object Owner?</text>
        <text x={410} y={145} textAnchor="middle" fontSize={8} fill="#8B5CF6">Owner has implicit READ_CONTROL + WRITE_DAC</text>
        <line x1={410} y1={156} x2={410} y2={175} stroke="#64748B" strokeWidth={2} markerEnd="url(#acl-gray)" />
        {/* Step 2: Build token SIDs */}
        <rect x={280} y={180} width={260} height={48} rx={10} fill="#FFFBEB" stroke="#F59E0B" strokeWidth={2} filter="url(#acls)" />
        <text x={410} y={200} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#92400E">2. Collect User's Security Token</text>
        <text x={410} y={215} textAnchor="middle" fontSize={8} fill="#A16207">User SID + all Group SIDs + special SIDs</text>
        <text x={410} y={225} textAnchor="middle" fontSize={7} fill="#D97706">(Domain Users, Authenticated Users, Everyone...)</text>
        <line x1={410} y1={232} x2={410} y2={252} stroke="#64748B" strokeWidth={2} markerEnd="url(#acl-gray)" />
        {/* Step 3: Walk DACL */}
        <rect x={260} y={256} width={300} height={44} rx={12} fill="#F0FDF4" stroke="#10B981" strokeWidth={2.5} filter="url(#acls)" />
        <text x={410} y={275} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#065F46">3. Walk DACL Top → Bottom</text>
        <text x={410} y={292} textAnchor="middle" fontSize={8} fill="#047857">Process each ACE in order until decision is reached</text>
        {/* Three ACE type branches */}
        <line x1={320} y1={304} x2={140} y2={340} stroke="#EF4444" strokeWidth={2} markerEnd="url(#acl-red)" />
        <line x1={410} y1={304} x2={410} y2={340} stroke="#10B981" strokeWidth={2} markerEnd="url(#acl-green)" />
        <line x1={500} y1={304} x2={680} y2={340} stroke="#64748B" strokeWidth={2} markerEnd="url(#acl-gray)" />
        {/* Deny ACE */}
        <rect x={40} y={344} width={200} height={55} rx={10} fill="#FEF2F2" stroke="#EF4444" strokeWidth={2} filter="url(#acls)" />
        <text x={140} y={365} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#DC2626">Explicit Deny ACE</text>
        <text x={140} y={380} textAnchor="middle" fontSize={8} fill="#EF4444">SID matches + permission matches?</text>
        <text x={140} y={393} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#DC2626">→ ACCESS DENIED (stop)</text>
        {/* Allow ACE */}
        <rect x={280} y={344} width={260} height={55} rx={10} fill="#ECFDF5" stroke="#10B981" strokeWidth={2} filter="url(#acls)" />
        <text x={410} y={365} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#059669">Explicit Allow ACE</text>
        <text x={410} y={380} textAnchor="middle" fontSize={8} fill="#10B981">SID matches + permission matches?</text>
        <text x={410} y={393} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#059669">→ Accumulate permission bits</text>
        {/* No match */}
        <rect x={580} y={344} width={200} height={55} rx={10} fill="#F8FAFC" stroke="#94A3B8" strokeWidth={2} filter="url(#acls)" />
        <text x={680} y={365} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#475569">No SID Match</text>
        <text x={680} y={380} textAnchor="middle" fontSize={8} fill="#64748B">ACE doesn't apply to this user</text>
        <text x={680} y={393} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#475569">→ Skip, check next ACE</text>
        {/* Step 4 */}
        <line x1={410} y1={404} x2={410} y2={430} stroke="#64748B" strokeWidth={2} markerEnd="url(#acl-gray)" />
        <rect x={270} y={434} width={280} height={40} rx={10} fill="#EFF6FF" stroke="#3B82F6" strokeWidth={2} filter="url(#acls)" />
        <text x={410} y={452} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#1E40AF">4. All ACEs processed?</text>
        <text x={410} y={467} textAnchor="middle" fontSize={8} fill="#3B82F6">All requested bits accumulated?</text>
        {/* Final outcomes */}
        <line x1={270} y1={454} x2={120} y2={500} stroke="#10B981" strokeWidth={2} markerEnd="url(#acl-green)" />
        <line x1={550} y1={454} x2={680} y2={500} stroke="#EF4444" strokeWidth={2} markerEnd="url(#acl-red)" />
        <rect x={30} y={504} width={190} height={40} rx={10} fill="#DCFCE7" stroke="#10B981" strokeWidth={2.5} filter="url(#acls)" />
        <text x={125} y={529} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#059669">ACCESS GRANTED</text>
        <rect x={590} y={504} width={190} height={40} rx={10} fill="#FEE2E2" stroke="#EF4444" strokeWidth={2.5} filter="url(#acls)" />
        <text x={685} y={529} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#DC2626">IMPLICIT DENY</text>
        <text x={125} y={497} fontSize={8} fontWeight="bold" fill="#10B981">Yes, all bits granted</text>
        <text x={640} y={497} fontSize={8} fontWeight="bold" fill="#EF4444">Missing permission bits</text>
        {/* Key rule callout */}
        <rect x={30} y={434} width={200} height={30} rx={6} fill="#FEF9C3" stroke="#EAB308" strokeWidth={1.5} />
        <text x={130} y={453} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#854D0E">KEY: Deny always wins over Allow</text>
      </svg>
    </div>
  );
};

/* ── SVG: Inheritance Flow ── */
const InheritanceDiagram = () => {
  const W = 780, H = 480;
  const mkr = { blue: "#3B82F6", green: "#10B981", gray: "#64748B", purple: "#8B5CF6", red: "#EF4444" };
  return (
    <div className="overflow-x-auto my-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[700px]" style={{ maxHeight: 500 }}>
        <defs>
          {Object.entries(mkr).map(([id, c]) => (
            <marker key={id} id={`inh-${id}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill={c} /></marker>
          ))}
          <filter id="inhs" x="-4%" y="-4%" width="108%" height="108%"><feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.1" /></filter>
        </defs>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#1E293B">ACL Inheritance: Domain → OU → Child OU → Object</text>
        {/* Domain */}
        <rect x={280} y={40} width={220} height={55} rx={12} fill="#FAF5FF" stroke="#8B5CF6" strokeWidth={2.5} filter="url(#inhs)" />
        <text x={390} y={62} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#6D28D9">corp.example.com</text>
        <text x={390} y={80} textAnchor="middle" fontSize={9} fill="#8B5CF6">Domain root — ACL set here</text>
        <text x={390} y={92} textAnchor="middle" fontSize={7} fill="#A78BFA">Domain Admins: Full Control (inheritable)</text>
        {/* Arrow */}
        <line x1={390} y1={100} x2={390} y2={125} stroke="#8B5CF6" strokeWidth={2} markerEnd="url(#inh-purple)" />
        <text x={420} y={116} fontSize={8} fill="#8B5CF6" fontStyle="italic">inherits ↓</text>
        {/* Parent OU */}
        <rect x={260} y={130} width={260} height={65} rx={12} fill="#EFF6FF" stroke="#3B82F6" strokeWidth={2.5} filter="url(#inhs)" />
        <text x={390} y={152} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#1E40AF">OU=Departments</text>
        <text x={390} y={170} textAnchor="middle" fontSize={9} fill="#3B82F6">Inherited: Domain Admins Full Control</text>
        <text x={390} y={184} textAnchor="middle" fontSize={8} fill="#2563EB" fontWeight="bold">+ Explicit: HR-Admins: Read (inheritable)</text>
        {/* Two branches */}
        <line x1={340} y1={200} x2={180} y2={240} stroke="#3B82F6" strokeWidth={2} markerEnd="url(#inh-blue)" />
        <line x1={440} y1={200} x2={600} y2={240} stroke="#3B82F6" strokeWidth={2} markerEnd="url(#inh-blue)" />
        <text x={240} y={228} fontSize={8} fill="#3B82F6" fontStyle="italic">inherits ↓</text>
        <text x={540} y={228} fontSize={8} fill="#3B82F6" fontStyle="italic">inherits ↓</text>
        {/* Child OU with inheritance */}
        <rect x={60} y={245} width={250} height={70} rx={12} fill="#ECFDF5" stroke="#10B981" strokeWidth={2.5} filter="url(#inhs)" />
        <text x={185} y={267} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#065F46">OU=HR</text>
        <text x={185} y={283} textAnchor="middle" fontSize={8} fill="#10B981">Inherited: Domain Admins Full Control</text>
        <text x={185} y={295} textAnchor="middle" fontSize={8} fill="#10B981">Inherited: HR-Admins Read</text>
        <text x={185} y={307} textAnchor="middle" fontSize={8} fill="#059669" fontWeight="bold">+ Explicit: HR-Managers: Write (this obj only)</text>
        {/* Child OU with BLOCKED inheritance */}
        <rect x={470} y={245} width={260} height={70} rx={12} fill="#FEF2F2" stroke="#EF4444" strokeWidth={2.5} filter="url(#inhs)" />
        <text x={600} y={267} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#DC2626">OU=Finance</text>
        <rect x={548} y={273} width={105} height={16} rx={4} fill="#FEE2E2" />
        <text x={600} y={285} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#DC2626">INHERITANCE BLOCKED</text>
        <text x={600} y={300} textAnchor="middle" fontSize={8} fill="#EF4444">No inherited ACEs from parent!</text>
        <text x={600} y={312} textAnchor="middle" fontSize={8} fill="#B91C1C" fontWeight="bold">Only Explicit: Finance-Admins Full Control</text>
        {/* Objects under HR */}
        <line x1={130} y1={320} x2={130} y2={355} stroke="#10B981" strokeWidth={2} markerEnd="url(#inh-green)" />
        <line x1={240} y1={320} x2={240} y2={355} stroke="#10B981" strokeWidth={2} markerEnd="url(#inh-green)" />
        <rect x={50} y={360} width={160} height={50} rx={10} fill="#F0FDF4" stroke="#10B981" strokeWidth={1.5} filter="url(#inhs)" />
        <text x={130} y={380} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#065F46">User: Jana</text>
        <text x={130} y={395} textAnchor="middle" fontSize={7} fill="#10B981">Effective: DA Full + HR-Admins Read</text>
        <text x={130} y={405} textAnchor="middle" fontSize={7} fill="#059669">+ HR-Managers Write (from OU)</text>
        <rect x={180} y={360} width={160} height={50} rx={10} fill="#F0FDF4" stroke="#10B981" strokeWidth={1.5} filter="url(#inhs)" />
        <text x={260} y={380} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#065F46">Group: HR-Team</text>
        <text x={260} y={395} textAnchor="middle" fontSize={7} fill="#10B981">Inherits same ACL stack</text>
        {/* Objects under Finance */}
        <line x1={600} y1={320} x2={600} y2={355} stroke="#EF4444" strokeWidth={2} markerEnd="url(#inh-red)" />
        <rect x={510} y={360} width={180} height={50} rx={10} fill="#FEF2F2" stroke="#EF4444" strokeWidth={1.5} filter="url(#inhs)" />
        <text x={600} y={380} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#DC2626">User: Bob</text>
        <text x={600} y={395} textAnchor="middle" fontSize={7} fill="#EF4444">Effective: ONLY Finance-Admins Full</text>
        <text x={600} y={405} textAnchor="middle" fontSize={7} fill="#B91C1C">No Domain Admin access! (blocked)</text>
        {/* ACE order callout */}
        <rect x={50} y={430} width={680} height={40} rx={10} fill="#FFFBEB" stroke="#EAB308" strokeWidth={1.5} />
        <text x={390} y={450} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#92400E">ACE Processing Order in DACL:</text>
        <text x={390} y={465} textAnchor="middle" fontSize={9} fill="#A16207">Explicit Deny → Explicit Allow → Inherited Deny → Inherited Allow</text>
      </svg>
    </div>
  );
};

/* ── SVG: Security Descriptor Structure ── */
const SecurityDescriptorDiagram = () => {
  const W = 780, H = 340;
  return (
    <div className="overflow-x-auto my-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[700px]" style={{ maxHeight: 360 }}>
        <defs>
          <filter id="sds2" x="-4%" y="-4%" width="108%" height="108%"><feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.1" /></filter>
        </defs>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#1E293B">Security Descriptor Structure (ntSecurityDescriptor)</text>
        {/* Main container */}
        <rect x={30} y={35} width={720} height={290} rx={14} fill="#F8FAFC" stroke="#E2E8F0" strokeWidth={2} />
        <text x={60} y={58} fontSize={12} fontWeight="bold" fill="#334155">Security Descriptor (stored on every AD object)</text>
        {/* Owner */}
        <rect x={50} y={70} width={150} height={60} rx={10} fill="#FAF5FF" stroke="#8B5CF6" strokeWidth={2} filter="url(#sds2)" />
        <text x={125} y={92} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#6D28D9">Owner SID</text>
        <text x={125} y={108} textAnchor="middle" fontSize={8} fill="#8B5CF6">Who created the</text>
        <text x={125} y={119} textAnchor="middle" fontSize={8} fill="#8B5CF6">object (implicit perms)</text>
        {/* Group */}
        <rect x={220} y={70} width={150} height={60} rx={10} fill="#EFF6FF" stroke="#3B82F6" strokeWidth={2} filter="url(#sds2)" />
        <text x={295} y={92} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#1E40AF">Primary Group</text>
        <text x={295} y={108} textAnchor="middle" fontSize={8} fill="#3B82F6">POSIX compat.</text>
        <text x={295} y={119} textAnchor="middle" fontSize={8} fill="#3B82F6">(rarely used in AD)</text>
        {/* DACL */}
        <rect x={50} y={150} width={320} height={160} rx={12} fill="#ECFDF5" stroke="#10B981" strokeWidth={2.5} filter="url(#sds2)" />
        <text x={210} y={172} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#065F46">DACL (Discretionary ACL)</text>
        <text x={210} y={186} textAnchor="middle" fontSize={8} fill="#047857">Controls WHO can access and WHAT they can do</text>
        {/* ACEs inside DACL */}
        {[
          { y: 198, bg: "#FEE2E2", bc: "#EF4444", t: "Explicit Deny ACE", sub: "Domain Admins → Deny Delete", tc: "#DC2626" },
          { y: 224, bg: "#DCFCE7", bc: "#10B981", t: "Explicit Allow ACE", sub: "HR-Admins → Allow Read/Write", tc: "#059669" },
          { y: 250, bg: "#FEF2F2", bc: "#F87171", t: "Inherited Deny ACE", sub: "(from parent OU)", tc: "#EF4444" },
          { y: 276, bg: "#F0FDF4", bc: "#6EE7B7", t: "Inherited Allow ACE", sub: "Domain Admins → Allow Full Control", tc: "#10B981" },
        ].map((a, i) => (
          <g key={i}>
            <rect x={70} y={a.y} width={280} height={22} rx={5} fill={a.bg} stroke={a.bc} strokeWidth={1} />
            <text x={80} y={a.y + 15} fontSize={8.5} fontWeight="bold" fill={a.tc}>{a.t}</text>
            <text x={215} y={a.y + 15} fontSize={7.5} fill="#64748B">{a.sub}</text>
          </g>
        ))}
        {/* SACL */}
        <rect x={400} y={150} width={330} height={160} rx={12} fill="#FFFBEB" stroke="#F59E0B" strokeWidth={2.5} filter="url(#sds2)" />
        <text x={565} y={172} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#92400E">SACL (System ACL)</text>
        <text x={565} y={186} textAnchor="middle" fontSize={8} fill="#A16207">Controls AUDITING — who gets logged</text>
        {[
          { y: 198, t: "Audit Success ACE", sub: "Log when Domain Admins modify this object" },
          { y: 224, t: "Audit Failure ACE", sub: "Log when anyone fails to access this object" },
          { y: 250, t: "System Mandatory Label", sub: "Integrity level (Low, Medium, High, System)" },
        ].map((a, i) => (
          <g key={i}>
            <rect x={420} y={a.y} width={290} height={22} rx={5} fill="#FEF3C7" stroke="#FBBF24" strokeWidth={1} />
            <text x={430} y={a.y + 15} fontSize={8.5} fontWeight="bold" fill="#92400E">{a.t}</text>
            <text x={570} y={a.y + 15} fontSize={7.5} fill="#A16207">{a.sub}</text>
          </g>
        ))}
        {/* Control Flags */}
        <rect x={400} y={70} width={330} height={60} rx={10} fill="#FDF4FF" stroke="#A855F7" strokeWidth={2} filter="url(#sds2)" />
        <text x={565} y={92} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#7E22CE">Control Flags</text>
        <text x={565} y={108} textAnchor="middle" fontSize={8} fill="#A855F7">SE_DACL_PROTECTED (block inheritance)</text>
        <text x={565} y={119} textAnchor="middle" fontSize={8} fill="#A855F7">SE_DACL_AUTO_INHERITED, SE_SACL_PRESENT...</text>
      </svg>
    </div>
  );
};

/* ── SVG: Permission Application Diagram ── */
const PermissionTargetDiagram = () => {
  const W = 820, H = 520;
  const mkr = { gray: "#64748B", blue: "#3B82F6", green: "#10B981", purple: "#8B5CF6" };
  return (
    <div className="overflow-x-auto my-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[750px]" style={{ maxHeight: 540 }}>
        <defs>
          {Object.entries(mkr).map(([id, c]) => (
            <marker key={id} id={`pt-${id}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill={c} /></marker>
          ))}
          <filter id="pts" x="-4%" y="-4%" width="108%" height="108%"><feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.1" /></filter>
        </defs>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#1E293B">How ACEs Apply to Different Object Types</text>
        {/* Actors */}
        {[
          { x: 100, y: 50, w: 140, h: 50, label: "Security Principal", sub: "(User, Group, Computer)", c: "#3B82F6", bg: "#EFF6FF" },
          { x: 410, y: 50, w: 140, h: 50, label: "ACE in DACL", sub: "(Access Control Entry)", c: "#8B5CF6", bg: "#FAF5FF" },
          { x: 700, y: 50, w: 140, h: 50, label: "Target Object", sub: "(any AD object)", c: "#10B981", bg: "#ECFDF5" },
        ].map((a, i) => (
          <g key={i}>
            <rect x={a.x - a.w / 2} y={a.y} width={a.w} height={a.h} rx={10} fill={a.bg} stroke={a.c} strokeWidth={2} filter="url(#pts)" />
            <text x={a.x} y={a.y + 22} textAnchor="middle" fontSize={11} fontWeight="bold" fill={a.c}>{a.label}</text>
            <text x={a.x} y={a.y + 38} textAnchor="middle" fontSize={8} fill={a.c}>{a.sub}</text>
          </g>
        ))}
        {/* Connecting arrows */}
        <line x1={175} y1={75} x2={335} y2={75} stroke="#64748B" strokeWidth={2} markerEnd="url(#pt-gray)" />
        <text x={255} y={68} textAnchor="middle" fontSize={8} fill="#64748B">SID matches Trustee?</text>
        <line x1={485} y1={75} x2={625} y2={75} stroke="#64748B" strokeWidth={2} markerEnd="url(#pt-gray)" />
        <text x={555} y={68} textAnchor="middle" fontSize={8} fill="#64748B">applied to</text>
        {/* ACE scope types */}
        <text x={W / 2} y={128} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#334155">ACE Scope Settings (InheritanceFlags + ObjectType)</text>
        {[
          { y: 145, label: "This Object Only", desc: "ACE applies ONLY to the object it's set on. Does not propagate to children.", icon: "1", c: "#EF4444", bg: "#FEF2F2", ex: "Set on OU=HR → only OU=HR gets the permission, not users inside it" },
          { y: 210, label: "This Object + All Descendants", desc: "ACE applies to the object AND all child objects below it (full inheritance).", icon: "2", c: "#10B981", bg: "#ECFDF5", ex: "Set on OU=HR → HR OU + every user, group, computer under HR gets it" },
          { y: 275, label: "Descendant Objects Only", desc: "ACE only applies to child objects, NOT the container itself.", icon: "3", c: "#3B82F6", bg: "#EFF6FF", ex: "Set on OU=HR → only objects inside HR get it, not the HR OU itself" },
          { y: 340, label: "Specific Object Type Only", desc: "ACE only applies to children of a specific class (e.g., only User objects).", icon: "4", c: "#8B5CF6", bg: "#FAF5FF", ex: "Set on OU=HR for objectClass=User → only user objects inside HR, not groups" },
          { y: 405, label: "Specific Property / Property Set", desc: "ACE grants access to a single attribute or property set, not the entire object.", icon: "5", c: "#F59E0B", bg: "#FFFBEB", ex: "Allow HR-Admins to Write the 'telephoneNumber' attribute only" },
        ].map((s, i) => (
          <g key={i}>
            <rect x={40} y={s.y} width={700} height={55} rx={10} fill={s.bg} stroke={s.c} strokeWidth={1.5} filter="url(#pts)" />
            <circle cx={70} cy={s.y + 20} r={13} fill={s.c} />
            <text x={70} y={s.y + 25} textAnchor="middle" fontSize={12} fontWeight="bold" fill="white">{s.icon}</text>
            <text x={95} y={s.y + 18} fontSize={11} fontWeight="bold" fill={s.c}>{s.label}</text>
            <text x={95} y={s.y + 33} fontSize={8.5} fill="#475569">{s.desc}</text>
            <text x={95} y={s.y + 47} fontSize={7.5} fill="#94A3B8" fontStyle="italic">Example: {s.ex}</text>
          </g>
        ))}
        {/* Footer */}
        <rect x={40} y={472} width={700} height={35} rx={8} fill="#F0F9FF" stroke="#BAE6FD" strokeWidth={1.5} />
        <text x={390} y={494} textAnchor="middle" fontSize={9} fill="#0369A1" fontWeight="bold">These scope settings are configured in the "Advanced Security Settings" → "Applies to" dropdown in ADUC</text>
      </svg>
    </div>
  );
};

export default function ADACLGuide() {
  const [active, setActive] = useState("overview");
  const [expanded, setExpanded] = useState(null);
  const [quizAns, setQuizAns] = useState({});
  const [showRes, setShowRes] = useState(false);

  const Analogy = ({ children }) => (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 my-4">
      <div className="flex items-center gap-2 mb-2"><span className="text-xl">🎭</span><span className="font-bold text-amber-800 text-sm">Real-World Analogy</span></div>
      <p className="text-sm text-amber-900 leading-relaxed">{children}</p>
    </div>
  );
  const Warning = ({ title, children }) => (
    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 my-4">
      <div className="flex items-center gap-2 mb-2"><span className="text-xl">⚠️</span><span className="font-bold text-red-800 text-sm">{title || "Security Warning"}</span></div>
      <div className="text-sm text-red-900 leading-relaxed">{children}</div>
    </div>
  );
  const InfoBox = ({ title, children }) => (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 my-4">
      <div className="flex items-center gap-2 mb-2"><span className="text-xl">💡</span><span className="font-bold text-blue-800 text-sm">{title}</span></div>
      <div className="text-sm text-blue-900 leading-relaxed">{children}</div>
    </div>
  );
  const DiagramBox = ({ title, children }) => (
    <div className="my-4 rounded-xl overflow-hidden border-2 border-slate-200">
      {title && <div className="bg-slate-800 text-slate-200 px-4 py-2 text-xs font-bold tracking-wide uppercase">{title}</div>}
      <pre className="bg-slate-900 text-green-400 p-4 text-xs leading-relaxed overflow-x-auto m-0 font-mono">{children}</pre>
    </div>
  );
  const CodeBlock = ({ title, children }) => (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-200">
      {title && <div className="bg-slate-700 text-slate-200 px-4 py-1.5 text-xs font-bold">{title}</div>}
      <pre className="bg-slate-900 text-emerald-400 p-4 text-xs leading-relaxed overflow-x-auto m-0 font-mono">{children}</pre>
    </div>
  );
  const ExpandCard = ({ id, icon, title, subtitle, color, children }) => {
    const isOpen = expanded === id;
    return (
      <div onClick={() => setExpanded(isOpen ? null : id)} className={`mb-3 border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${isOpen ? "shadow-md" : "hover:shadow-sm"}`} style={{ borderColor: isOpen ? color : "#e2e8f0", background: isOpen ? color + "08" : "#fff" }}>
        <div className="p-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">{icon}</span>
          <div className="flex-1 min-w-0"><div className="font-bold text-sm" style={{ color: isOpen ? color : "#1e293b" }}>{title}</div>{subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}</div>
          <span className="text-slate-400 text-xs flex-shrink-0">{isOpen ? "▲" : "▼"}</span>
        </div>
        {isOpen && <div className="px-4 pb-4 ml-10" onClick={e => e.stopPropagation()}><div className="border-t pt-3 text-sm text-slate-700 leading-relaxed" style={{ borderColor: color + "30" }}>{children}</div></div>}
      </div>
    );
  };
  const SectionTitle = ({ icon, children }) => (
    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4 mt-6"><span className="text-xl">{icon}</span> {children}</h3>
  );

  const sections = [
    { id: "overview", title: "Overview", icon: "🔐", color: "#3b82f6" },
    { id: "descriptor", title: "Security Descriptor", icon: "📋", color: "#8b5cf6" },
    { id: "permissions", title: "Permissions", icon: "🔑", color: "#10b981" },
    { id: "inheritance", title: "Inheritance", icon: "🔄", color: "#f59e0b" },
    { id: "evaluation", title: "Evaluation Order", icon: "⚖️", color: "#ef4444" },
    { id: "delegation", title: "Delegation", icon: "👥", color: "#ec4899" },
    { id: "tools", title: "Tools & Audit", icon: "🛠️", color: "#0ea5e9" },
    { id: "quiz", title: "Quiz", icon: "🧠", color: "#6366f1" },
  ];

  /* ── OVERVIEW ── */
  const renderOverview = () => (
    <div>
      <SectionTitle icon="🔐">What is an AD ACL?</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">Every object in Active Directory — users, groups, OUs, computers, GPOs — has a <strong>Security Descriptor</strong> that controls who can read, modify, delete, or manage it. The core of this is the <strong>Access Control List (ACL)</strong>, which contains ordered <strong>Access Control Entries (ACEs)</strong>.</p>
      <Analogy>Think of AD ACLs like a <strong>bouncer list at a VIP club</strong>. Each object (room) has a list on the door. The list says who is allowed in (Allow ACE), who is banned (Deny ACE), and what they can do once inside (read the menu, order drinks, go backstage). Deny entries are always checked first — if you're on the ban list, it doesn't matter that you're also on the VIP list.</Analogy>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {[
          { icon: "📋", title: "ACL", desc: "Access Control List — an ordered list of ACEs attached to an AD object. Two types: DACL (who can access) and SACL (who gets audited).", color: "bg-blue-50 border-blue-200" },
          { icon: "📝", title: "ACE", desc: "Access Control Entry — a single rule: 'Allow/Deny [SID] [Permission] on [Scope]'. Multiple ACEs form the ACL.", color: "bg-green-50 border-green-200" },
          { icon: "🏷️", title: "SID", desc: "Security Identifier — uniquely identifies the user or group the ACE applies to (the 'Trustee').", color: "bg-purple-50 border-purple-200" },
        ].map((c, i) => (
          <div key={i} className={`${c.color} border-2 rounded-xl p-4`}>
            <div className="text-2xl mb-2">{c.icon}</div>
            <h4 className="font-bold text-sm mb-1">{c.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
      <InfoBox title="Where Are ACLs Stored?">
        <p className="mb-1">ACLs are stored in the <code className="bg-white px-1 rounded text-xs">ntSecurityDescriptor</code> attribute of every AD object inside <strong>NTDS.dit</strong>. This is a binary blob in <strong>SDDL (Security Descriptor Definition Language)</strong> format.</p>
        <p>You can view it with: <code className="bg-white px-1 rounded text-xs">dsacls "OU=HR,DC=corp,DC=com"</code> or in ADUC → Properties → Security tab.</p>
      </InfoBox>
    </div>
  );

  /* ── SECURITY DESCRIPTOR ── */
  const renderDescriptor = () => (
    <div>
      <SectionTitle icon="📋">The Security Descriptor</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">Every AD object stores a <strong>Security Descriptor</strong> in its <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">ntSecurityDescriptor</code> attribute. It has four components.</p>
      <SecurityDescriptorDiagram />
      <ExpandCard id="sd-owner" icon="👤" title="Owner SID" subtitle="Who owns the object" color="#8b5cf6">
        <ul className="list-disc ml-4 space-y-1">
          <li>By default, the <strong>creator</strong> of the object becomes the owner</li>
          <li>Owner has implicit <strong>READ_CONTROL</strong> and <strong>WRITE_DAC</strong> — can always read and modify the DACL</li>
          <li>Even if every ACE denies the owner, they can still change the ACL to grant themselves access</li>
          <li>Domain Admins and Enterprise Admins can take ownership of any object</li>
        </ul>
        <Warning title="Owner = Backdoor">If an attacker gains ownership of an object, they can grant themselves any permission. Always audit ownership on sensitive OUs and groups.</Warning>
      </ExpandCard>
      <ExpandCard id="sd-dacl" icon="✅" title="DACL (Discretionary ACL)" subtitle="Controls who can access the object and what they can do" color="#10b981">
        <ul className="list-disc ml-4 space-y-1">
          <li>Contains an <strong>ordered list of ACEs</strong> (Deny and Allow entries)</li>
          <li>Processed <strong>top to bottom</strong> — order matters!</li>
          <li>If no DACL exists (null DACL), <strong>everyone has full access</strong></li>
          <li>If DACL exists but is empty, <strong>no one has access</strong> (except the owner)</li>
          <li>This is what you manage in the "Security" tab of AD objects</li>
        </ul>
      </ExpandCard>
      <ExpandCard id="sd-sacl" icon="📊" title="SACL (System ACL)" subtitle="Controls auditing — what gets logged" color="#f59e0b">
        <ul className="list-disc ml-4 space-y-1">
          <li>Contains <strong>audit ACEs</strong> that trigger Windows event log entries</li>
          <li>Can audit success (someone accessed the object) and/or failure (someone was denied)</li>
          <li>Requires <strong>SeSecurityPrivilege</strong> to view or modify</li>
          <li>Events appear in the <strong>Security event log</strong> (Event IDs 4662, 4663, etc.)</li>
          <li>Essential for detecting attacks like DCSync, privilege escalation, and ACL abuse</li>
        </ul>
      </ExpandCard>
      <ExpandCard id="sd-flags" icon="🚩" title="Control Flags" subtitle="Metadata about the security descriptor" color="#a855f7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { f: "SE_DACL_PROTECTED", d: "Blocks inheritance from parent — only explicit ACEs apply" },
            { f: "SE_DACL_AUTO_INHERITED", d: "DACL was set through inheritance mechanism" },
            { f: "SE_DACL_PRESENT", d: "A DACL exists (if absent = null DACL = everyone full access)" },
            { f: "SE_SACL_PRESENT", d: "A SACL exists for auditing" },
            { f: "SE_SELF_RELATIVE", d: "All pointers are offsets (used when serialized)" },
            { f: "SE_OWNER_DEFAULTED", d: "Owner was set by default mechanism, not explicitly" },
          ].map((fl, i) => (
            <div key={i} className="bg-slate-50 rounded-lg p-2">
              <code className="text-xs font-mono font-bold text-purple-700">{fl.f}</code>
              <p className="text-xs text-slate-500 mt-1">{fl.d}</p>
            </div>
          ))}
        </div>
      </ExpandCard>
      <CodeBlock title="View ACL with PowerShell">
{`# View DACL of an OU
Get-Acl "AD:OU=HR,DC=corp,DC=example,DC=com" | Format-List

# View all ACEs in detail
(Get-Acl "AD:OU=HR,DC=corp,DC=example,DC=com").Access | Format-Table `
  + "`" + `IdentityReference, AccessControlType, ActiveDirectoryRights, `
  + "`" + `InheritanceType, ObjectType -AutoSize

# View in SDDL format
(Get-Acl "AD:OU=HR,DC=corp,DC=example,DC=com").Sddl

# dsacls (built-in tool)
dsacls "OU=HR,DC=corp,DC=example,DC=com"`}
      </CodeBlock>
    </div>
  );

  /* ── PERMISSIONS ── */
  const renderPermissions = () => (
    <div>
      <SectionTitle icon="🔑">AD Permission Types</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">AD permissions come in two levels: <strong>standard (generic)</strong> permissions that map to common operations, and <strong>extended (granular)</strong> permissions for fine-grained control over specific attributes and operations.</p>
      <PermissionTargetDiagram />
      <SectionTitle icon="📦">Standard Permissions</SectionTitle>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-slate-100">
            <th className="border border-slate-200 p-2 text-left font-bold text-xs">Permission</th>
            <th className="border border-slate-200 p-2 text-left font-bold text-xs">What It Allows</th>
            <th className="border border-slate-200 p-2 text-left font-bold text-xs">Risk Level</th>
          </tr></thead>
          <tbody>
            {[
              ["Full Control", "All permissions — read, write, delete, change ACL, take ownership", "🔴 Critical"],
              ["Read", "View object and its attributes", "🟢 Low"],
              ["Write", "Modify attributes (but not delete or change ACL)", "🟡 Medium"],
              ["Create Child Objects", "Add new objects inside a container (OU, domain)", "🟡 Medium"],
              ["Delete Child Objects", "Remove objects from a container", "🔴 High"],
              ["Delete", "Delete this specific object", "🔴 High"],
              ["Read Permissions", "View the DACL on this object", "🟢 Low"],
              ["Modify Permissions", "Change the DACL (grant/revoke access)", "🔴 Critical"],
              ["Modify Owner", "Take ownership of the object", "🔴 Critical"],
            ].map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="border border-slate-200 p-2 font-bold text-xs">{r[0]}</td>
                <td className="border border-slate-200 p-2 text-xs">{r[1]}</td>
                <td className="border border-slate-200 p-2 text-xs">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SectionTitle icon="🎯">Extended / Property-Level Permissions</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">Extended rights allow control over <strong>specific attributes</strong> or <strong>special operations</strong>. They are identified by GUIDs.</p>
      {[
        { title: "Reset Password", icon: "🔒", color: "#ef4444", guid: "00299570-246d-11d0-a768...", desc: "Allows resetting a user's password without knowing the current one. One of the most delegated permissions in AD.", risk: "Can be used to take over any user account." },
        { title: "Write Member (Group)", icon: "👥", color: "#8b5cf6", guid: "bf9679c0-0de6-11d0-a285...", desc: "Allows adding/removing members of a group. If delegated on a privileged group (Domain Admins), this is a full domain compromise.", risk: "Adding yourself to Domain Admins = game over." },
        { title: "DS-Replication-Get-Changes-All", icon: "📡", color: "#ef4444", guid: "1131f6ad-9c07-11d1-f79f...", desc: "Required for DCSync attack — allows replicating all AD data including password hashes. Only DCs should have this.", risk: "DCSync = extract every password hash in the domain." },
        { title: "Write Property (specific attribute)", icon: "✏️", color: "#10b981", guid: "Varies by attribute GUID", desc: "Allows modifying a specific attribute, e.g., 'description', 'telephoneNumber', 'scriptPath'. Granular delegation target.", risk: "Depends on the attribute — scriptPath can execute code on login." },
        { title: "Validated Write to SPN", icon: "🏷️", color: "#f59e0b", guid: "f3a64788-5306-11d1-a9c5...", desc: "Allows writing servicePrincipalName. Can be abused for targeted Kerberoasting if set on user objects.", risk: "Set a fake SPN on a user → request their TGS → crack offline." },
      ].map((p, i) => (
        <ExpandCard key={i} id={`perm-${i}`} icon={p.icon} title={p.title} subtitle={`GUID: ${p.guid}`} color={p.color}>
          <p className="mb-2">{p.desc}</p>
          <Warning title="Attack Risk">{p.risk}</Warning>
        </ExpandCard>
      ))}
    </div>
  );

  /* ── INHERITANCE ── */
  const renderInheritance = () => (
    <div>
      <SectionTitle icon="🔄">How ACL Inheritance Works</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">When you set a permission on a parent container (domain, OU), that ACE <strong>propagates to all child objects</strong> unless inheritance is blocked. This is how administrators grant broad access without setting permissions on every individual object.</p>
      <Analogy>Inheritance is like a <strong>family will</strong>. Grandparent sets a rule: "All descendants can access the family estate." This flows to children, grandchildren, and so on — unless a child specifically writes their own will that says "Ignore all previous family rules" (blocking inheritance).</Analogy>
      <InheritanceDiagram />
      <SectionTitle icon="📐">Inheritance Rules</SectionTitle>
      <ExpandCard id="inh-flow" icon="⬇️" title="How Inheritance Flows" subtitle="Parent → Child, following the AD tree" color="#3b82f6">
        <ul className="list-disc ml-4 space-y-1.5">
          <li>ACEs with the <strong>Inheritable</strong> flag set propagate to child objects</li>
          <li>Inherited ACEs appear as <strong>grayed out</strong> in the Security tab (you can't edit them directly)</li>
          <li>The <strong>InheritanceType</strong> on the ACE controls scope: "This object only", "This object and descendants", "Descendant objects only", or "Specific child type"</li>
          <li>New objects created inside a container automatically receive the parent's inheritable ACEs</li>
        </ul>
      </ExpandCard>
      <ExpandCard id="inh-block" icon="🚫" title="Blocking Inheritance" subtitle="SE_DACL_PROTECTED flag" color="#ef4444">
        <p className="mb-2">You can block inheritance on any object by setting the <strong>SE_DACL_PROTECTED</strong> control flag. This removes all inherited ACEs and keeps only explicit ones.</p>
        <CodeBlock title="Block inheritance via PowerShell">
{`$acl = Get-Acl "AD:OU=Finance,DC=corp,DC=example,DC=com"

# Block inheritance and COPY existing inherited ACEs as explicit
$acl.SetAccessRuleProtection($true, $true)  # (protect, preserveInheritance)

# Block inheritance and REMOVE all inherited ACEs (dangerous!)
$acl.SetAccessRuleProtection($true, $false)

Set-Acl "AD:OU=Finance,DC=corp,DC=example,DC=com" $acl`}
        </CodeBlock>
        <Warning title="Blocking Inheritance Is Dangerous">Removing inherited ACEs without adding explicit replacements can lock everyone out. Always copy inherited ACEs to explicit when blocking, then remove what you don't need.</Warning>
      </ExpandCard>
      <ExpandCard id="inh-order" icon="📊" title="ACE Ordering in the DACL" subtitle="The critical precedence rules" color="#f59e0b">
        <p className="mb-3">Windows sorts ACEs in this <strong>canonical order</strong>. This order determines which rules take effect first:</p>
        <div className="space-y-2">
          {[
            { n: "1", label: "Explicit Deny", color: "bg-red-100 border-red-400 text-red-800", desc: "Deny ACEs set directly on this object — processed first, always wins" },
            { n: "2", label: "Explicit Allow", color: "bg-green-100 border-green-400 text-green-800", desc: "Allow ACEs set directly on this object — checked after denies" },
            { n: "3", label: "Inherited Deny", color: "bg-red-50 border-red-200 text-red-600", desc: "Deny ACEs inherited from parent containers — checked third" },
            { n: "4", label: "Inherited Allow", color: "bg-green-50 border-green-200 text-green-600", desc: "Allow ACEs inherited from parent containers — checked last" },
          ].map((a, i) => (
            <div key={i} className={`flex items-center gap-3 ${a.color} border-2 rounded-lg p-3`}>
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-sm">{a.n}</span>
              <div><span className="font-bold text-sm">{a.label}</span><p className="text-xs mt-0.5 opacity-80">{a.desc}</p></div>
            </div>
          ))}
        </div>
        <InfoBox title="Key Takeaway">Explicit permissions always override inherited ones. And within each level, Deny always beats Allow. This means you can set a broad Allow at the domain level and selectively Deny at a child OU.</InfoBox>
      </ExpandCard>
    </div>
  );

  /* ── EVALUATION ORDER ── */
  const renderEvaluation = () => (
    <div>
      <SectionTitle icon="⚖️">ACL Evaluation Algorithm</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">When a user tries to access an AD object, the <strong>Security Reference Monitor</strong> (SRM) in the Windows kernel evaluates the DACL against the user's security token. Here's the exact algorithm.</p>
      <AclEvaluationDiagram />
      <SectionTitle icon="🧪">Evaluation Examples</SectionTitle>
      <ExpandCard id="eval-1" icon="📖" title="Example 1: HR Admin reads a user object" subtitle="Multiple Allow ACEs accumulate" color="#10b981">
        <p className="mb-2 text-xs"><strong>User:</strong> Sarah (member of HR-Admins, Domain Users)</p>
        <p className="mb-2 text-xs"><strong>Target:</strong> User object in OU=HR</p>
        <p className="mb-2 text-xs"><strong>DACL on user object:</strong></p>
        <div className="space-y-1 text-xs font-mono bg-slate-50 p-3 rounded-lg mb-2">
          <p className="text-red-600">1. [Deny]  Interns → Delete (Explicit)</p>
          <p className="text-green-600">2. [Allow] HR-Admins → Read, Write (Explicit)</p>
          <p className="text-green-500">3. [Allow] Domain Admins → Full Control (Inherited)</p>
          <p className="text-green-500">4. [Allow] Authenticated Users → Read (Inherited)</p>
        </div>
        <p className="text-xs"><strong>Result:</strong> ACE #1 — Sarah is not in Interns, skip. ACE #2 — Sarah IS in HR-Admins, accumulate Read+Write. Read permission satisfied → <strong className="text-green-700">ACCESS GRANTED</strong></p>
      </ExpandCard>
      <ExpandCard id="eval-2" icon="🚫" title="Example 2: Deny overrides Allow" subtitle="Explicit Deny on the same SID" color="#ef4444">
        <p className="mb-2 text-xs"><strong>User:</strong> Bob (member of Finance-Team, Contractors)</p>
        <p className="mb-2 text-xs"><strong>Requested:</strong> Write to OU=Finance</p>
        <div className="space-y-1 text-xs font-mono bg-slate-50 p-3 rounded-lg mb-2">
          <p className="text-red-600">1. [Deny]  Contractors → Write (Explicit)</p>
          <p className="text-green-600">2. [Allow] Finance-Team → Read, Write (Explicit)</p>
        </div>
        <p className="text-xs"><strong>Result:</strong> ACE #1 — Bob IS in Contractors, Deny Write matches → <strong className="text-red-700">ACCESS DENIED</strong> immediately. ACE #2 is never even checked.</p>
      </ExpandCard>
      <ExpandCard id="eval-3" icon="🔄" title="Example 3: Explicit Allow overrides Inherited Deny" subtitle="The nuanced case" color="#f59e0b">
        <p className="mb-2 text-xs"><strong>Scenario:</strong> Domain-level inherited Deny exists, but an Explicit Allow is set on the child OU.</p>
        <div className="space-y-1 text-xs font-mono bg-slate-50 p-3 rounded-lg mb-2">
          <p className="text-green-600">1. [Allow] Special-Admins → Write (Explicit on this OU)</p>
          <p className="text-red-500">2. [Deny]  Special-Admins → Write (Inherited from domain)</p>
        </div>
        <p className="text-xs"><strong>Result:</strong> ACE #1 — Explicit Allow is processed first (canonical order). Write bit accumulated. The inherited Deny in ACE #2 is checked but the requested permission is already fully granted → <strong className="text-green-700">ACCESS GRANTED</strong>.</p>
        <InfoBox title="This Is Why Order Matters">Explicit ACEs always come before inherited ones in canonical ordering. This allows child objects to override parent restrictions — a key delegation pattern.</InfoBox>
      </ExpandCard>
    </div>
  );

  /* ── DELEGATION ── */
  const renderDelegation = () => (
    <div>
      <SectionTitle icon="👥">Delegation of Control</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">Delegation is the practice of <strong>granting specific AD permissions to non-admin users</strong> so they can perform limited administrative tasks without full Domain Admin access. This is the foundation of the <strong>least-privilege</strong> model in AD.</p>
      <Analogy>Delegation is like a <strong>hotel giving the cleaning staff only the master key for rooms on their floor</strong>, not the master key for the entire building. The front desk manager gets key access to billing systems but not the server room.</Analogy>
      <SectionTitle icon="📋">Common Delegation Scenarios</SectionTitle>
      {[
        { title: "Help Desk: Reset Passwords", icon: "🔑", color: "#3b82f6", perm: "Reset Password + Read on user objects", scope: "OU=Employees", cmd: `$ou = "AD:OU=Employees,DC=corp,DC=example,DC=com"\n$group = "CORP\\\\HelpDesk"\n# Grant Reset Password extended right\ndsacls $ou /G "$group:CA;Reset Password;user"` },
        { title: "Help Desk: Unlock Accounts", icon: "🔓", color: "#10b981", perm: "Write lockoutTime attribute on user objects", scope: "OU=Employees", cmd: `# Grant write to lockoutTime (clears account lockout)\ndsacls $ou /G "$group:WP;lockoutTime;user"` },
        { title: "Group Managers: Manage Group Members", icon: "👥", color: "#8b5cf6", perm: "Write Member property on group objects", scope: "OU=Groups", cmd: `# Grant Write Member on group objects in the OU\n$ou = "AD:OU=Groups,DC=corp,DC=example,DC=com"\ndsacls $ou /G "CORP\\\\GroupManagers:WP;member;group"` },
        { title: "HR: Create User Accounts", icon: "➕", color: "#f59e0b", perm: "Create/Delete User objects", scope: "OU=NewHires", cmd: `# Grant create + delete child user objects\n$ou = "AD:OU=NewHires,DC=corp,DC=example,DC=com"\ndsacls $ou /G "CORP\\\\HR-Admins:CC;user"\ndsacls $ou /G "CORP\\\\HR-Admins:DC;user"` },
      ].map((d, i) => (
        <ExpandCard key={i} id={`del-${i}`} icon={d.icon} title={d.title} subtitle={`${d.perm} — Scope: ${d.scope}`} color={d.color}>
          <CodeBlock title="dsacls command">{d.cmd}</CodeBlock>
        </ExpandCard>
      ))}
      <Warning title="Delegation Gone Wrong — Common Attack Paths">
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>WriteDACL on Domain object</strong> → attacker can grant themselves any permission</li>
          <li><strong>WriteOwner on any object</strong> → take ownership → modify DACL → full control</li>
          <li><strong>GenericAll on user</strong> → reset password, set SPN (Kerberoast), write to any attribute</li>
          <li><strong>WriteMember on Domain Admins</strong> → add yourself → instant domain admin</li>
          <li>Tools like <strong>BloodHound</strong> map these attack paths automatically</li>
        </ul>
      </Warning>
    </div>
  );

  /* ── TOOLS & AUDIT ── */
  const renderTools = () => (
    <div>
      <SectionTitle icon="🛠️">Tools for Managing & Auditing ACLs</SectionTitle>
      {[
        { title: "Active Directory Users & Computers (ADUC)", icon: "🖥️", color: "#3b82f6", desc: "GUI tool — right-click any object → Properties → Security → Advanced. Shows ACEs, inheritance, and effective permissions. Enable 'Advanced Features' view for full access." },
        { title: "dsacls.exe", icon: "⌨️", color: "#10b981", desc: "Command-line tool for viewing and modifying ACLs on AD objects. Syntax: dsacls <DN> /G <trustee>:<perms>. Best for scripted delegation." },
        { title: "PowerShell (Get-Acl / Set-Acl)", icon: "🐚", color: "#8b5cf6", desc: "Use the AD: drive provider. Get-Acl 'AD:OU=...' returns the full security descriptor. Most flexible programmatic option." },
        { title: "BloodHound", icon: "🐺", color: "#ef4444", desc: "Open-source tool that maps AD ACL attack paths. Collects ACLs with SharpHound, builds a graph database, and shows shortest path to Domain Admin. Essential for security audits." },
        { title: "ADExplorer (Sysinternals)", icon: "🔍", color: "#f59e0b", desc: "Browse AD like a file explorer. Shows raw attributes including ntSecurityDescriptor. Can take snapshots for offline analysis." },
        { title: "PingCastle / Purple Knight", icon: "🏰", color: "#ec4899", desc: "AD security assessment tools that check for dangerous ACL misconfigurations: overly permissive delegations, AdminSDHolder mismatches, orphaned SIDs." },
      ].map((t, i) => (
        <ExpandCard key={i} id={`tool-${i}`} icon={t.icon} title={t.title} color={t.color}><p>{t.desc}</p></ExpandCard>
      ))}
      <SectionTitle icon="🔍">AdminSDHolder — The ACL Guardian</SectionTitle>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">The <strong>AdminSDHolder</strong> object (CN=AdminSDHolder,CN=System,DC=...) is a special container whose ACL is <strong>stamped onto all protected groups and their members every 60 minutes</strong> by the SDProp process.</p>
      <InfoBox title="How AdminSDHolder Works">
        <ul className="list-disc ml-4 space-y-1">
          <li>Protected groups: Domain Admins, Enterprise Admins, Schema Admins, Administrators, Account Operators, etc.</li>
          <li>Every 60 minutes, <strong>SDProp</strong> (running on the PDC Emulator) compares each protected object's ACL with AdminSDHolder</li>
          <li>If they differ, SDProp <strong>overwrites</strong> the object's ACL with AdminSDHolder's ACL</li>
          <li>This prevents someone from granting themselves access to admin accounts by modifying their ACLs</li>
          <li>Protected objects have <strong>inheritance disabled</strong> and the <code className="bg-white px-1 rounded text-xs">adminCount=1</code> attribute set</li>
        </ul>
      </InfoBox>
      <Warning title="AdminSDHolder Abuse">An attacker who can modify the AdminSDHolder ACL can grant themselves persistent access to ALL protected objects. This backdoor survives password resets and is very hard to detect without specialized tools.</Warning>
    </div>
  );

  /* ── QUIZ ── */
  const quiz = [
    { q: "What are the two types of ACLs in a Security Descriptor?", opts: ["DACL and SACL", "NTFS and Share", "Allow and Deny", "Read and Write"], c: 0 },
    { q: "What happens if an AD object has no DACL (null DACL)?", opts: ["No one can access it", "Everyone has full access", "Only the owner can access it", "Only Domain Admins can access it"], c: 1 },
    { q: "In what order are ACEs evaluated?", opts: ["Allow before Deny", "Inherited before Explicit", "Explicit Deny → Explicit Allow → Inherited Deny → Inherited Allow", "Random order"], c: 2 },
    { q: "What implicit permissions does the Owner of an AD object have?", opts: ["Full Control", "Read only", "READ_CONTROL + WRITE_DAC", "No permissions"], c: 2 },
    { q: "What extended right is required for a DCSync attack?", opts: ["Reset Password", "DS-Replication-Get-Changes-All", "Write Member", "Full Control"], c: 1 },
    { q: "What flag blocks ACL inheritance on an object?", opts: ["SE_DACL_PRESENT", "SE_DACL_PROTECTED", "SE_SACL_PRESENT", "SE_OWNER_DEFAULTED"], c: 1 },
    { q: "What does the AdminSDHolder object do?", opts: ["Creates admin accounts", "Stamps its ACL onto all protected groups every 60 minutes", "Blocks all inheritance in the domain", "Manages Group Policy"], c: 1 },
    { q: "If an Explicit Allow and an Inherited Deny conflict, which wins?", opts: ["Inherited Deny always wins", "Explicit Allow wins (processed first in canonical order)", "They cancel each other out", "The most recent one wins"], c: 1 },
    { q: "What tool maps AD ACL attack paths as a graph?", opts: ["ADUC", "dsacls", "BloodHound", "PowerShell"], c: 2 },
    { q: "What attribute stores the security descriptor on an AD object?", opts: ["userAccountControl", "ntSecurityDescriptor", "objectSid", "adminCount"], c: 1 },
  ];

  const renderQuiz = () => {
    const total = quiz.length;
    const answered = Object.keys(quizAns).length;
    const correct = showRes ? quiz.filter((q, i) => quizAns[i] === q.c).length : 0;
    return (
      <div>
        <SectionTitle icon="🧠">Knowledge Check</SectionTitle>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">Test your understanding of AD ACLs.</p>
        {showRes && (
          <div className={`rounded-xl p-4 mb-6 border-2 text-center ${correct >= 8 ? "bg-green-50 border-green-300" : correct >= 5 ? "bg-amber-50 border-amber-300" : "bg-red-50 border-red-300"}`}>
            <div className="text-3xl mb-2">{correct >= 8 ? "🏆" : correct >= 5 ? "👍" : "📚"}</div>
            <div className="font-bold text-lg">{correct} / {total}</div>
            <div className="text-sm text-slate-600 mt-1">{correct >= 8 ? "Excellent!" : correct >= 5 ? "Good job!" : "Keep studying!"}</div>
          </div>
        )}
        {quiz.map((q, qi) => (
          <div key={qi} className="mb-5 bg-gray-50 border rounded-xl p-4">
            <p className="font-bold text-sm mb-3">{qi + 1}. {q.q}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {q.opts.map((o, oi) => {
                const sel = quizAns[qi] === oi, ok = showRes && oi === q.c, bad = showRes && sel && oi !== q.c;
                return <button key={oi} onClick={() => !showRes && setQuizAns(p => ({ ...p, [qi]: oi }))} className={`text-left text-sm p-3 rounded-lg border-2 transition-all ${ok ? "bg-green-100 border-green-500 font-bold" : bad ? "bg-red-100 border-red-400" : sel ? "bg-blue-100 border-blue-400" : "bg-white border-gray-200 hover:border-blue-300"}`}>{o}</button>;
              })}
            </div>
          </div>
        ))}
        <div className="flex gap-3 mt-4">
          <button onClick={() => setShowRes(true)} disabled={answered < total} className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${answered < total ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"}`}>Check Answers ({answered}/{total})</button>
          {showRes && <button onClick={() => { setQuizAns({}); setShowRes(false); }} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">Reset Quiz</button>}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (active) {
      case "overview": return renderOverview();
      case "descriptor": return renderDescriptor();
      case "permissions": return renderPermissions();
      case "inheritance": return renderInheritance();
      case "evaluation": return renderEvaluation();
      case "delegation": return renderDelegation();
      case "tools": return renderTools();
      case "quiz": return renderQuiz();
      default: return null;
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 32 }}>🛡️</span>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>AD Access Control Lists</h1>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Security Descriptors, DACL, SACL, Inheritance & Delegation</p>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 5, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => { setActive(s.id); setExpanded(null); }} style={{ padding: "7px 12px", borderRadius: 8, border: "none", background: active === s.id ? s.color : "#fff", color: active === s.id ? "#fff" : "#475569", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", boxShadow: active === s.id ? `0 2px 8px ${s.color}40` : "0 1px 2px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}>
            <span style={{ fontSize: 13 }}>{s.icon}</span> {s.title}
          </button>
        ))}
      </div>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
        {renderContent()}
      </div>
    </div>
  );
}
