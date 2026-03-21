import { useState } from "react";
import { Link } from "react-router-dom";
import GCPLoadBalancingGuide from '@pages/gcp-load-balancing-guide.jsx';

/* ── Palette ── */
const p = {
  bg: "#0a0c10",
  surface: "#12151c",
  surfaceAlt: "#181c26",
  border: "#1e2433",
  accent: "#4285f4",
  text: "#e2e8f0",
  textDim: "#8892a4",
  textMuted: "#5a6478",
  green: "#34a853",
  red: "#ea4335",
  yellow: "#fbbc04",
  blue: "#4285f4",
  purple: "#a855f7",
  cyan: "#06b6d4",
  orange: "#f97316",
  aws: "#ff9900",
};

/* ── Shared UI primitives ── */

const Card = ({ children, color = p.border, bg = p.surfaceAlt, glow = false, style = {} }) => (
  <div style={{
    border: `1.5px solid ${color}`,
    borderRadius: 10,
    padding: "14px 18px",
    background: bg,
    boxShadow: glow ? `0 0 20px ${color}30` : "none",
    ...style,
  }}>
    {children}
  </div>
);

const Tag = ({ children, color = p.accent }) => (
  <span style={{
    padding: "3px 10px", borderRadius: 20,
    background: `${color}18`, border: `1px solid ${color}35`,
    color, fontSize: 11, fontWeight: 600,
    display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
  }}>{children}</span>
);

const Code = ({ children }) => (
  <code style={{
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: p.cyan,
    background: `${p.cyan}12`, padding: "1px 6px", borderRadius: 4,
  }}>
    {children}
  </code>
);

const InfoBox = ({ children, color = p.blue, icon = "ℹ" }) => (
  <div style={{
    background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 8,
    padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start", marginTop: 12,
  }}>
    <span style={{ color, fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
    <div style={{ color: p.textDim, fontSize: 13, lineHeight: 1.7 }}>{children}</div>
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 style={{ color: p.text, fontWeight: 700, fontSize: 15, marginBottom: 12, marginTop: 28, display: "flex", alignItems: "center", gap: 8 }}>
    {children}
  </h3>
);

/* ═══════════════════════════════════════════════
   TAB 1 — ROLES & POLICY BINDING
═══════════════════════════════════════════════ */

const ROLE_TYPES = [
  {
    id: "basic", label: "Basic Roles", color: p.red, icon: "⚠", tag: "Legacy",
    desc: "Coarse-grained roles that predate GCP IAM. Apply to all services across a project simultaneously.",
    warning: "Avoid in production — too permissive. Owner grants full control over all resources.",
    examples: [
      { role: "roles/viewer", perms: "Read-only access to all resources" },
      { role: "roles/editor", perms: "Read + write (excludes IAM & billing changes)" },
      { role: "roles/owner", perms: "Full control + manage IAM, billing, delete project" },
    ],
  },
  {
    id: "predefined", label: "Predefined Roles", color: p.green, icon: "✓", tag: "Recommended",
    desc: "Curated by Google for each service. Fine-grained and maintained automatically when new features launch.",
    examples: [
      { role: "roles/storage.objectViewer", perms: "Read GCS objects only" },
      { role: "roles/compute.instanceAdmin", perms: "Manage Compute Engine VMs" },
      { role: "roles/run.invoker", perms: "Invoke Cloud Run services" },
      { role: "roles/cloudsql.client", perms: "Connect to Cloud SQL instances" },
    ],
  },
  {
    id: "custom", label: "Custom Roles", color: p.purple, icon: "◈", tag: "Fine-grained",
    desc: "Build your own role by selecting individual permissions. Useful when predefined roles grant too many permissions.",
    examples: [
      { role: "storage.objects.get", perms: "Read a specific GCS object" },
      { role: "pubsub.topics.publish", perms: "Publish messages to a topic" },
      { role: "bigquery.jobs.create", perms: "Run BigQuery queries" },
    ],
  },
];

const PRINCIPAL_TYPES = [
  { prefix: "user:", example: "user:alice@corp.com", color: p.blue, label: "Google Account", desc: "Individual Google/Workspace user" },
  { prefix: "serviceAccount:", example: "serviceAccount:api@proj.iam.gserviceaccount.com", color: p.green, label: "Service Account", desc: "Machine identity for workloads & apps" },
  { prefix: "group:", example: "group:devs@corp.com", color: p.purple, label: "Google Group", desc: "Collection of users and/or service accounts" },
  { prefix: "domain:", example: "domain:corp.com", color: p.yellow, label: "Workspace/Cloud Identity Domain", desc: "All users in a Cloud Identity domain" },
  { prefix: "allUsers", example: "allUsers", color: p.red, label: "Public (unauthenticated)", desc: "Anyone on the internet — no auth required." },
  { prefix: "allAuthenticatedUsers", example: "allAuthenticatedUsers", color: p.orange, label: "All Authenticated Google Accounts", desc: "Any user signed in with a Google account (not just your org)" },
];

const HIERARCHY_NODES = [
  {
    id: "org", label: "Organization", icon: "🏢", color: p.blue,
    bindings: [
      { role: "roles/resourcemanager.organizationAdmin", members: ["user:admin@corp.com"] },
      { role: "roles/billing.admin", members: ["group:billing-team@corp.com"] },
    ],
    note: "Bindings here cascade down to ALL folders, projects and resources.",
  },
  {
    id: "folder", label: "Folder (Production)", icon: "📁", color: p.purple,
    bindings: [
      { role: "roles/resourcemanager.folderAdmin", members: ["user:platform@corp.com"] },
      { role: "roles/logging.viewer", members: ["group:sre@corp.com"] },
    ],
    note: "Bindings cascade to all projects inside this folder.",
  },
  {
    id: "project", label: "Project (my-app-prod)", icon: "📦", color: p.green,
    bindings: [
      { role: "roles/compute.viewer", members: ["group:devs@corp.com"] },
      { role: "roles/storage.objectAdmin", members: ["serviceAccount:api@my-app-prod.iam.gserviceaccount.com"] },
    ],
    note: "Most IAM bindings live at project level.",
  },
  {
    id: "resource", label: "Resource (GCS Bucket)", icon: "🪣", color: p.cyan,
    bindings: [
      { role: "roles/storage.objectViewer", members: ["allUsers"] },
    ],
    note: "Resource-level bindings are most restrictive in scope — only affect this resource.",
  },
];

const PolicyBindingDiagram = () => {
  const [selected, setSelected] = useState("project");
  const node = HIERARCHY_NODES.find(n => n.id === selected);
  return (
    <div>
      <p style={{ color: p.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
        Click a level in the resource hierarchy to see its IAM policy bindings. Policies{" "}
        <strong style={{ color: p.text }}>inherit downward</strong> — a binding at Org level applies to every resource inside it.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 20 }}>
        {HIERARCHY_NODES.map((n, i) => (
          <div key={n.id} style={{ display: "flex", alignItems: "stretch" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0 }}>
              <div style={{ width: 2, height: i === 0 ? 20 : 10, background: i === 0 ? "transparent" : p.border }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: n.color, flexShrink: 0 }} />
              <div style={{ width: 2, flex: 1, background: i === HIERARCHY_NODES.length - 1 ? "transparent" : p.border }} />
            </div>
            <button onClick={() => setSelected(n.id)} style={{
              flex: 1, textAlign: "left", margin: "4px 0", padding: "10px 14px", borderRadius: 8,
              border: `1.5px solid ${selected === n.id ? n.color : p.border}`,
              background: selected === n.id ? `${n.color}12` : p.surfaceAlt,
              color: selected === n.id ? n.color : p.textDim,
              cursor: "pointer", fontFamily: "inherit", fontSize: 13,
              fontWeight: selected === n.id ? 700 : 400,
              display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
            }}>
              <span>{n.icon}</span>
              <span>{n.label}</span>
              {selected === n.id && (
                <span style={{ marginLeft: "auto", fontSize: 11, padding: "2px 8px", borderRadius: 10, background: `${n.color}25`, color: n.color }}>
                  selected
                </span>
              )}
            </button>
          </div>
        ))}
      </div>
      {node && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card color={node.color} bg={p.bg}>
            <div style={{ color: node.color, fontSize: 12, fontWeight: 700, marginBottom: 10, fontFamily: "'JetBrains Mono', monospace" }}>
              IAM Policy — {node.label}
            </div>
            <pre style={{ margin: 0, fontSize: 11, lineHeight: 1.7, fontFamily: "'JetBrains Mono', monospace", overflowX: "auto" }}>
              {JSON.stringify({ bindings: node.bindings }, null, 2).split("\n").map((line, i) => {
                const isRole = line.includes('"role"');
                const isMember = line.trim().startsWith('"') && !line.includes(':') && !line.includes('"bindings"') && !line.includes('"members"');
                return (
                  <span key={i} style={{ color: isRole ? node.color : isMember ? p.cyan : p.textDim }}>
                    {line + "\n"}
                  </span>
                );
              })}
            </pre>
          </Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {node.bindings.map((b, i) => (
              <Card key={i} color={node.color} style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: node.color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>{b.role}</div>
                <div style={{ fontSize: 11, color: p.textMuted, marginBottom: 6 }}>granted to:</div>
                {b.members.map((m, j) => (
                  <div key={j} style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: p.cyan, background: `${p.cyan}10`, borderRadius: 4, padding: "3px 8px", marginBottom: 4 }}>
                    {m}
                  </div>
                ))}
              </Card>
            ))}
            <InfoBox color={node.color} icon="⬇">
              <strong style={{ color: node.color }}>Inheritance:</strong> {node.note}
            </InfoBox>
          </div>
        </div>
      )}
    </div>
  );
};

const AWSComparisonPanel = () => {
  const [view, setView] = useState("table");
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { id: "gcp", label: "GCP Model", color: p.blue },
          { id: "aws", label: "AWS Model", color: p.aws },
          { id: "table", label: "Side-by-side", color: p.purple },
        ].map(tab => (
          <button key={tab.id} onClick={() => setView(tab.id)} style={{
            padding: "7px 18px", borderRadius: 8, border: `1.5px solid ${view === tab.id ? tab.color : p.border}`,
            background: view === tab.id ? `${tab.color}15` : "transparent",
            color: view === tab.id ? tab.color : p.textMuted,
            cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
          }}>{tab.label}</button>
        ))}
      </div>
      {view === "gcp" && (
        <div>
          <div style={{ color: p.textDim, fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>
            GCP IAM has one mental model: <strong style={{ color: p.text }}>"Who has what role on which resource?"</strong> The policy is always attached to the resource.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            {[
              { label: "Principal", value: "user:alice@corp.com", color: p.green },
              { label: "+", value: null, color: p.textMuted },
              { label: "Role", value: "roles/storage.objectViewer", color: p.blue },
              { label: "+", value: null, color: p.textMuted },
              { label: "Resource", value: "gs://my-bucket", color: p.cyan },
            ].map((item, i) => item.value ? (
              <Card key={i} color={item.color} style={{ padding: "8px 14px", textAlign: "center", minWidth: 140 }}>
                <div style={{ fontSize: 10, color: p.textMuted, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: item.color, fontFamily: "'JetBrains Mono', monospace", wordBreak: "break-all" }}>{item.value}</div>
              </Card>
            ) : <span key={i} style={{ fontSize: 20, color: item.color, fontWeight: 700 }}>{item.label}</span>)}
          </div>
          <InfoBox color={p.blue} icon="✓">
            Policy is attached to the resource. No inline policies. No permission boundaries. Default is deny-all — no binding = no access.
          </InfoBox>
        </div>
      )}
      {view === "aws" && (
        <div>
          <div style={{ color: p.textDim, fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>
            AWS IAM has multiple overlapping policy types that all interact during evaluation.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
            {[
              { label: "Identity-based Policy", color: p.aws, desc: "Attached to user/role. Controls what it can do." },
              { label: "Resource-based Policy", color: p.orange, desc: "Attached to resource (S3, KMS...). Controls who can access." },
              { label: "Permission Boundary", color: p.red, desc: "Max-permission guardrail on an identity." },
              { label: "Service Control Policy", color: p.purple, desc: "Org-level max permissions on member accounts." },
              { label: "Session Policy", color: p.cyan, desc: "Further restrict an assumed-role session." },
            ].map((item, i) => (
              <Card key={i} color={item.color} style={{ padding: "10px 12px" }}>
                <div style={{ color: item.color, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{item.label}</div>
                <div style={{ color: p.textMuted, fontSize: 11, lineHeight: 1.5 }}>{item.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {view === "table" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 14px", textAlign: "left", color: p.textMuted, borderBottom: `1px solid ${p.border}`, width: "30%" }}>Concept</th>
                <th style={{ padding: "10px 14px", textAlign: "left", color: p.blue, borderBottom: `1px solid ${p.border}` }}>GCP IAM</th>
                <th style={{ padding: "10px 14px", textAlign: "left", color: p.aws, borderBottom: `1px solid ${p.border}` }}>AWS IAM</th>
              </tr>
            </thead>
            <tbody>
              {[
                { concept: "Permission unit", gcp: "Role (bundle of permissions)", aws: "Policy (collection of Allow/Deny statements)" },
                { concept: "Policy location", gcp: "Always attached to the resource", aws: "Identity OR resource (or both simultaneously)" },
                { concept: "Default", gcp: "Deny-all (no bindings = no access)", aws: "Implicit deny-all" },
                { concept: "Org guardrails", gcp: "Org Policy Constraints (separate service)", aws: "Service Control Policies (SCPs)" },
                { concept: "Max-permission cap", gcp: "Not built-in (use Org Policies)", aws: "Permission Boundaries" },
                { concept: "Cross-account access", gcp: "Resource-level bindings or SA impersonation", aws: "Resource-based policies + Role Assumption" },
                { concept: "Inline policies", gcp: "Not supported", aws: "Supported (but not recommended)" },
                { concept: "Federated access", gcp: "Workload / Workforce Identity Federation", aws: "OIDC / SAML Identity Providers + STS AssumeRoleWithWebIdentity" },
                { concept: "Complexity", gcp: "Lower — single consistent model", aws: "Higher — multiple policy types interact via complex evaluation logic" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? p.surfaceAlt : "transparent" }}>
                  <td style={{ padding: "9px 14px", color: p.textDim, borderBottom: `1px solid ${p.border}` }}>{row.concept}</td>
                  <td style={{ padding: "9px 14px", color: p.text, borderBottom: `1px solid ${p.border}` }}>{row.gcp}</td>
                  <td style={{ padding: "9px 14px", color: p.text, borderBottom: `1px solid ${p.border}` }}>{row.aws}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const RolesBindingsSection = () => {
  const [activeRole, setActiveRole] = useState("predefined");
  return (
    <div>
      <p style={{ color: p.textDim, lineHeight: 1.8, marginBottom: 24 }}>
        GCP IAM answers one question: <strong style={{ color: p.text }}>"Who can do what on which resource?"</strong>{" "}
        It does this through <strong style={{ color: p.accent }}>policy bindings</strong> — associations between a{" "}
        <strong style={{ color: p.green }}>principal</strong>, a <strong style={{ color: p.blue }}>role</strong>, and a{" "}
        <strong style={{ color: p.cyan }}>resource</strong>.
      </p>

      <SectionTitle>Role Types</SectionTitle>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {ROLE_TYPES.map(rt => (
          <button key={rt.id} onClick={() => setActiveRole(rt.id)} style={{
            padding: "8px 18px", borderRadius: 8,
            border: `1.5px solid ${activeRole === rt.id ? rt.color : p.border}`,
            background: activeRole === rt.id ? `${rt.color}15` : "transparent",
            color: activeRole === rt.id ? rt.color : p.textMuted,
            cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span>{rt.icon}</span> {rt.label}
          </button>
        ))}
      </div>
      {(() => {
        const rt = ROLE_TYPES.find(r => r.id === activeRole);
        return (
          <Card color={rt.color} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{rt.icon}</span>
              <div>
                <div style={{ color: rt.color, fontWeight: 700, fontSize: 14 }}>{rt.label}</div>
                <Tag color={rt.color}>{rt.tag}</Tag>
              </div>
            </div>
            <p style={{ color: p.textDim, fontSize: 13, lineHeight: 1.7, margin: "0 0 12px" }}>{rt.desc}</p>
            {rt.warning && (
              <div style={{ background: `${p.red}12`, border: `1px solid ${p.red}30`, borderRadius: 6, padding: "8px 12px", color: p.red, fontSize: 12, marginBottom: 12 }}>
                ⚠ {rt.warning}
              </div>
            )}
            <div style={{ fontSize: 12, color: p.textMuted, marginBottom: 8 }}>Examples:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {rt.examples.map((ex, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Code>{ex.role}</Code>
                  <span style={{ color: p.textMuted, fontSize: 12, lineHeight: 1.5 }}>{ex.perms}</span>
                </div>
              ))}
            </div>
          </Card>
        );
      })()}

      <SectionTitle>Principal (Identity) Types</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10, marginBottom: 24 }}>
        {PRINCIPAL_TYPES.map((pt, i) => (
          <Card key={i} color={pt.color} style={{ padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Tag color={pt.color}>{pt.prefix}</Tag>
              <span style={{ color: pt.color, fontSize: 12, fontWeight: 600 }}>{pt.label}</span>
            </div>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: p.textMuted, marginBottom: 6 }}>{pt.example}</div>
            <div style={{ fontSize: 12, color: p.textDim }}>{pt.desc}</div>
          </Card>
        ))}
      </div>

      <SectionTitle>Interactive Policy Binding — Resource Hierarchy</SectionTitle>
      <Card color={p.border} style={{ marginBottom: 24 }}>
        <PolicyBindingDiagram />
      </Card>

      <SectionTitle>GCP vs AWS — IAM Mental Models</SectionTitle>
      <Card color={p.border}>
        <AWSComparisonPanel />
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   TAB 2 — CLOUD IDENTITY vs GCP IAM
═══════════════════════════════════════════════ */

const CloudIdentityIAMSection = () => {
  const [view, setView] = useState("overview");
  return (
    <div>
      <p style={{ color: p.textDim, lineHeight: 1.8, marginBottom: 20 }}>
        These two solve <em>different problems</em> that work together.{" "}
        <strong style={{ color: p.blue }}>Google Cloud Identity</strong> is an <strong style={{ color: p.text }}>Identity Provider</strong> — it manages who your users are.{" "}
        <strong style={{ color: p.green }}>GCP IAM</strong> is an <strong style={{ color: p.text }}>Authorization engine</strong> — it decides what those users can do.
      </p>
      <div style={{ display: "flex", alignItems: "stretch", gap: 0, marginBottom: 24, borderRadius: 12, overflow: "hidden", border: `1px solid ${p.border}` }}>
        <div style={{ flex: 1, background: `${p.blue}12`, padding: 20, borderRight: `1px solid ${p.border}` }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🪪</div>
          <div style={{ color: p.blue, fontWeight: 800, fontSize: 15, marginBottom: 6 }}>Google Cloud Identity</div>
          <div style={{ color: p.textMuted, fontSize: 11, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Identity Provider (IdP)</div>
          <ul style={{ color: p.textDim, fontSize: 12, lineHeight: 2, paddingLeft: 16, margin: 0 }}>
            <li>Manages users &amp; groups</li>
            <li>Handles authentication (login)</li>
            <li>SSO to GCP + external apps</li>
            <li>Enforces MFA policies</li>
            <li>Device management</li>
            <li>User lifecycle management</li>
          </ul>
          <div style={{ marginTop: 12 }}><Tag color={p.blue}>Authentication = who are you?</Tag></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "0 12px", background: p.surfaceAlt, fontSize: 22 }}>→</div>
        <div style={{ flex: 1, background: `${p.green}12`, padding: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔑</div>
          <div style={{ color: p.green, fontWeight: 800, fontSize: 15, marginBottom: 6 }}>GCP IAM</div>
          <div style={{ color: p.textMuted, fontSize: 11, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Authorization Engine</div>
          <ul style={{ color: p.textDim, fontSize: 12, lineHeight: 2, paddingLeft: 16, margin: 0 }}>
            <li>Manages role bindings</li>
            <li>Controls resource access</li>
            <li>Enforces least privilege</li>
            <li>Evaluates policies at runtime</li>
            <li>Logs all access decisions</li>
            <li>Works with any Google identity</li>
          </ul>
          <div style={{ marginTop: 12 }}><Tag color={p.green}>Authorization = what can you do?</Tag></div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { id: "overview", label: "How They Work Together" },
          { id: "cloud-identity", label: "Cloud Identity Deep-Dive" },
          { id: "gcp-iam", label: "GCP IAM Deep-Dive" },
          { id: "decision", label: "Do I Need Cloud Identity?" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setView(tab.id)} style={{
            padding: "7px 16px", borderRadius: 8,
            border: `1.5px solid ${view === tab.id ? p.accent : p.border}`,
            background: view === tab.id ? `${p.accent}15` : "transparent",
            color: view === tab.id ? p.accent : p.textMuted,
            cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
          }}>{tab.label}</button>
        ))}
      </div>
      {view === "overview" && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, padding: "20px 0" }}>
            {[
              { step: "1", icon: "👤", label: "User attempts to access a GCP resource", color: p.textDim },
              { step: "2", icon: "🪪", label: "Cloud Identity (or external IdP) authenticates the user", color: p.blue },
              { step: "3", icon: "🎟", label: "Google issues an identity token (JWT)", color: p.cyan },
              { step: "4", icon: "🔑", label: "GCP IAM evaluates token against resource's policy bindings", color: p.green },
              { step: "5", icon: "✅", label: "Access granted or denied based on role bindings", color: p.green },
            ].map((s, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${s.color}20`, border: `2px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: s.color, fontWeight: 700 }}>{s.step}</div>
                  {i < arr.length - 1 && <div style={{ width: 2, height: 32, background: p.border }} />}
                </div>
                <div style={{ paddingTop: 6, paddingBottom: i < arr.length - 1 ? 24 : 0 }}>
                  <span style={{ fontSize: 18, marginRight: 8 }}>{s.icon}</span>
                  <span style={{ color: p.text, fontSize: 13 }}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
          <InfoBox color={p.purple} icon="💡">
            GCP IAM doesn't care <em>how</em> you authenticated. It only checks whether your identity token's <Code>email</Code> or <Code>sub</Code> claim matches a policy binding on the requested resource.
          </InfoBox>
        </div>
      )}
      {view === "cloud-identity" && (
        <div>
          <p style={{ color: p.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
            Google Cloud Identity is essentially <strong style={{ color: p.text }}>Google Workspace minus productivity apps</strong> (Docs, Sheets, Meet). It provides a Google-managed directory and IdP for your organization.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { tier: "Cloud Identity Free", color: p.blue, features: ["Up to 2,000 users", "User & group management", "SSO (SAML 2.0)", "Basic security policies", "Google Admin Console"] },
              { tier: "Cloud Identity Premium", color: p.purple, features: ["Unlimited users", "All Free tier features", "Advanced device management", "App access control (CASB)", "Security alerts & reports", "Automated provisioning (SCIM)"] },
            ].map((tier, i) => (
              <Card key={i} color={tier.color}>
                <div style={{ color: tier.color, fontWeight: 700, marginBottom: 10 }}>{tier.tier}</div>
                <ul style={{ paddingLeft: 16, margin: 0, color: p.textDim, fontSize: 12, lineHeight: 2 }}>
                  {tier.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
              </Card>
            ))}
          </div>
          <InfoBox color={p.yellow} icon="⚠">
            If your org already uses <strong>Google Workspace</strong>, Cloud Identity is already included. Cloud Identity Free/Premium is for organizations wanting Google identities without Workspace productivity apps.
          </InfoBox>
        </div>
      )}
      {view === "gcp-iam" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { label: "Deny by Default", icon: "🛡", desc: "No binding = no access. Every request must be explicitly authorized.", color: p.green },
              { label: "Additive Permissions", icon: "➕", desc: "Multiple bindings add up. Most permissive wins (Deny Policies are the exception).", color: p.blue },
              { label: "Inheritance", icon: "⬇", desc: "Org → Folder → Project → Resource. Higher-level bindings cascade down.", color: p.purple },
              { label: "Audit Logging", icon: "📋", desc: "All IAM changes and data access logged to Cloud Audit Logs automatically.", color: p.cyan },
            ].map((item, i) => (
              <Card key={i} color={item.color} style={{ padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ color: item.color, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{item.label}</div>
                <div style={{ color: p.textDim, fontSize: 11, lineHeight: 1.6 }}>{item.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {view === "decision" && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { question: "Are these human users?", yes: "Consider Cloud Identity or Workforce Identity Federation", no: "Use Service Accounts + Workload Identity Federation" },
              { question: "Do users already have Google/Workspace accounts?", yes: "No Cloud Identity needed — bind existing accounts in IAM directly", no: "Need Cloud Identity or Workforce Identity Federation" },
              { question: "Do you want Google-managed lifecycle (provisioning, MFA, SSO)?", yes: "Use Cloud Identity (Free or Premium)", no: "Use Workforce Identity Federation with your existing IdP (Okta, Azure AD)" },
              { question: "Do users need Google Workspace apps (Gmail, Docs)?", yes: "Use Google Workspace (Cloud Identity included)", no: "Cloud Identity Free/Premium is sufficient" },
            ].map((item, i) => (
              <Card key={i} color={p.border} style={{ padding: "14px 16px" }}>
                <div style={{ color: p.text, fontWeight: 600, fontSize: 13, marginBottom: 10 }}>❓ {item.question}</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}><span style={{ color: p.green, fontSize: 11, fontWeight: 700 }}>YES → </span><span style={{ color: p.textDim, fontSize: 12 }}>{item.yes}</span></div>
                  <div style={{ flex: 1 }}><span style={{ color: p.red, fontSize: 11, fontWeight: 700 }}>NO → </span><span style={{ color: p.textDim, fontSize: 12 }}>{item.no}</span></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   TAB 3 — WORKLOAD IDENTITY FEDERATION
═══════════════════════════════════════════════ */

const WIF_PROVIDERS = [
  {
    name: "GitHub Actions", icon: "🐙", color: p.purple,
    issuerUri: "https://token.actions.githubusercontent.com",
    audience: "//iam.googleapis.com/projects/PROJECT_NUM/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID",
    audienceNote: "You pass this full provider resource name as the audience when calling the auth action. GitHub embeds it in the OIDC token's aud claim.",
    keyClaims: "repository, ref, job_workflow_ref, sub",
  },
  {
    name: "AWS (EC2/Lambda/ECS)", icon: "☁", color: p.aws,
    issuerUri: "N/A — uses AWS STS GetCallerIdentity API",
    audience: "gcp-PROJECT_NUMBER (by convention) or custom string configured in pool provider",
    audienceNote: "AWS WIF uses the STS GetCallerIdentity signed request, not a standard OIDC token. The audience is the sts:audience claim.",
    keyClaims: "aws:arn, aws:userid, aws:account",
  },
  {
    name: "Azure Managed Identity", icon: "🔷", color: p.blue,
    issuerUri: "https://login.microsoftonline.com/TENANT_ID/v2.0",
    audience: "api://AzureADTokenExchange (configured in Azure federated credential)",
    audienceNote: "Azure issues an OIDC token with aud=api://AzureADTokenExchange. GCP WIF pool provider must list this as an allowed audience.",
    keyClaims: "sub (object ID of managed identity), azp, oid",
  },
  {
    name: "Kubernetes (GKE/EKS/AKS)", icon: "☸", color: p.cyan,
    issuerUri: "https://<cluster-issuer-url> (configurable per cluster)",
    audience: "Configurable — often the provider resource name or a custom string",
    audienceNote: "K8s ServiceAccount tokens include the configured audience. Set this to match the WIF pool provider's allowed audience list.",
    keyClaims: "sub, kubernetes.io/serviceaccount/name, kubernetes.io/namespace",
  },
  {
    name: "GitLab CI", icon: "🦊", color: p.orange,
    issuerUri: "https://gitlab.com (or your self-hosted GitLab URL)",
    audience: "//iam.googleapis.com/projects/PROJECT_NUM/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID",
    audienceNote: "Set the id_tokens audience in your .gitlab-ci.yml to match the GCP provider resource name.",
    keyClaims: "project_id, ref, environment, namespace_path",
  },
];

const WorkloadFederationSection = () => {
  const [activeProvider, setActiveProvider] = useState(null);
  const [flowStep, setFlowStep] = useState(-1);

  const FLOW_STEPS = [
    { icon: "⚙", label: "External workload starts", detail: "A GitHub Actions runner, AWS Lambda, GKE Pod, etc. begins execution in its native environment.", color: p.textDim },
    { icon: "🎟", label: "Gets external identity token", detail: "The workload requests its native identity credential:\n• GitHub → OIDC JWT (iss: token.actions.githubusercontent.com)\n• AWS → STS signed request (GetCallerIdentity)\n• GKE → Kubernetes ServiceAccount JWT\n• Azure → OIDC JWT from Azure AD", color: p.cyan },
    { icon: "🔄", label: "Exchanges token at GCP STS", detail: "POST to: sts.googleapis.com/v1/token\nGCP STS validates the token against the Workload Identity Pool Provider config:\n• Verifies token signature using provider's JWKS URI\n• Checks issuer (iss) matches configured issuer URI\n• Checks audience (aud) matches allowed audiences\n• Evaluates attribute conditions (e.g. attribute.repository == 'my-org/my-repo')", color: p.blue },
    { icon: "🎫", label: "Receives short-lived federated token", detail: "GCP STS returns a short-lived (1-hour max) STS token.\nThis is a Google federated token — NOT a service account token yet.\nThe principal is: principalSet://iam.googleapis.com/projects/.../workloadIdentityPools/...", color: p.purple },
    { icon: "🎭", label: "Impersonates a Service Account (optional)", detail: "The federated token calls:\niamcredentials.googleapis.com/v1/projects/-/serviceAccounts/SA@PROJECT.iam.gserviceaccount.com:generateAccessToken\n\nRequired IAM binding on the SA:\nroles/iam.workloadIdentityUser granted to the federated principal.", color: p.green },
    { icon: "✅", label: "Calls GCP APIs as Service Account", detail: "The workload now holds a short-lived SA access token and can call any GCP API the SA has been granted access to.\n\nNo JSON key file was used at any point. The entire credential chain is ephemeral.", color: p.green },
  ];

  return (
    <div>
      <p style={{ color: p.textDim, lineHeight: 1.8, marginBottom: 20 }}>
        Workload Identity Federation (WIF) solves the <strong style={{ color: p.red }}>service account key problem</strong>.
        External workloads exchange their native identity tokens for short-lived Google credentials — no JSON key files required.
      </p>

      {/* Issuer vs Audience clarification — important! */}
      <div style={{ background: `${p.yellow}10`, border: `1.5px solid ${p.yellow}40`, borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ color: p.yellow, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>⚠ Issuer URI vs Audience — Key Distinction</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 12 }}>
          <div>
            <div style={{ color: p.text, fontWeight: 600, marginBottom: 4 }}>Issuer URI (<Code>iss</Code> claim)</div>
            <div style={{ color: p.textDim, lineHeight: 1.7 }}>
              Identifies <em>who issued</em> the external token. You configure this in the GCP WIF Pool Provider so GCP knows which IdP to trust and where to fetch JWKS keys.<br />
              Example: <Code>https://token.actions.githubusercontent.com</Code>
            </div>
          </div>
          <div>
            <div style={{ color: p.text, fontWeight: 600, marginBottom: 4 }}>Audience (<Code>aud</Code> claim)</div>
            <div style={{ color: p.textDim, lineHeight: 1.7 }}>
              Identifies <em>who the token is intended for</em>. For GCP WIF this is typically the full <strong>provider resource name</strong>:<br />
              <Code style={{ fontSize: 10, wordBreak: "break-all" }}>{"//iam.googleapis.com/projects/PROJECT_NUM/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID"}</Code><br />
              You configure allowed audiences in the WIF pool provider, and the external token's <Code>aud</Code> must match.
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <Card color={p.red}>
          <div style={{ color: p.red, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>❌ SA Key Files</div>
          <ul style={{ paddingLeft: 16, margin: 0, color: p.textDim, fontSize: 12, lineHeight: 2 }}>
            <li>JSON keys are <strong style={{ color: p.text }}>long-lived</strong> (no expiry by default)</li>
            <li>Must be securely distributed to workloads</li>
            <li>Stored in CI/CD secrets, ENV vars, k8s secrets</li>
            <li>If leaked → full SA access until manually revoked</li>
            <li>Hard to rotate without breaking deployments</li>
          </ul>
        </Card>
        <Card color={p.green}>
          <div style={{ color: p.green, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>✓ Workload Identity Federation</div>
          <ul style={{ paddingLeft: 16, margin: 0, color: p.textDim, fontSize: 12, lineHeight: 2 }}>
            <li><strong style={{ color: p.text }}>Keyless</strong> — zero JSON key files</li>
            <li>Short-lived tokens (max 1 hour)</li>
            <li>Tokens scoped to specific workload identity</li>
            <li>Attribute conditions restrict to specific repo/branch</li>
            <li>Automatic rotation — each job gets a fresh token</li>
          </ul>
        </Card>
      </div>

      <SectionTitle>Token Exchange Flow (Click each step)</SectionTitle>
      <Card color={p.border} style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 0, marginBottom: 16, alignItems: "center" }}>
          {FLOW_STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <button onClick={() => setFlowStep(flowStep === i ? -1 : i)} style={{
                width: 50, height: 50, borderRadius: "50%",
                border: `2px solid ${flowStep === i ? s.color : p.border}`,
                background: flowStep === i ? `${s.color}20` : p.surfaceAlt,
                color: flowStep === i ? s.color : p.textMuted,
                fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.15s",
              }} title={s.label}>{s.icon}</button>
              {i < FLOW_STEPS.length - 1 && <div style={{ width: 20, height: 2, background: p.border, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
        {flowStep >= 0 ? (
          <div style={{ background: `${FLOW_STEPS[flowStep].color}12`, border: `1px solid ${FLOW_STEPS[flowStep].color}35`, borderRadius: 8, padding: "14px 16px", animation: "fadeSlideUp 0.3s ease both" }}>
            <div style={{ color: FLOW_STEPS[flowStep].color, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
              Step {flowStep + 1}: {FLOW_STEPS[flowStep].label}
            </div>
            <div style={{ color: p.textDim, fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {FLOW_STEPS[flowStep].detail}
            </div>
          </div>
        ) : (
          <div style={{ color: p.textMuted, fontSize: 12 }}>← Click a circle above to see details</div>
        )}
      </Card>

      <SectionTitle>Supported External Providers</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {WIF_PROVIDERS.map((prov, i) => (
          <button key={i} onClick={() => setActiveProvider(activeProvider === i ? null : i)} style={{
            textAlign: "left", cursor: "pointer", fontFamily: "inherit",
            background: activeProvider === i ? `${prov.color}12` : p.surfaceAlt,
            border: `1.5px solid ${activeProvider === i ? prov.color : p.border}`,
            borderRadius: 10, padding: "12px 16px", transition: "all 0.15s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{prov.icon}</span>
              <span style={{ color: activeProvider === i ? prov.color : p.text, fontWeight: 600, fontSize: 13 }}>{prov.name}</span>
              <span style={{ marginLeft: "auto", color: p.textMuted, fontSize: 11 }}>{activeProvider === i ? "▲ collapse" : "▼ expand"}</span>
            </div>
            {activeProvider === i && (
              <div style={{ animation: "fadeSlideUp 0.25s ease both", marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: p.textMuted, marginBottom: 3 }}>Issuer URI (iss) — configured in GCP WIF provider:</div>
                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: p.cyan, background: `${p.cyan}10`, borderRadius: 4, padding: "4px 8px", wordBreak: "break-all" }}>{prov.issuerUri}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: p.textMuted, marginBottom: 3 }}>Audience (aud) — in the external token:</div>
                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: prov.color, background: `${prov.color}10`, borderRadius: 4, padding: "4px 8px", wordBreak: "break-all" }}>{prov.audience}</div>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: 11, color: p.textMuted, marginBottom: 3 }}>Key token claims:</div>
                  <div style={{ fontSize: 11, color: p.textDim }}>{prov.keyClaims}</div>
                </div>
                <div style={{ gridColumn: "1 / -1", background: `${prov.color}08`, border: `1px solid ${prov.color}25`, borderRadius: 6, padding: "8px 10px", fontSize: 11, color: p.textDim }}>
                  💡 {prov.audienceNote}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   TAB 4 — WORKFORCE IDENTITY FEDERATION
═══════════════════════════════════════════════ */

const WorkforceFederationSection = () => {
  const [view, setView] = useState("overview");
  return (
    <div>
      <p style={{ color: p.textDim, lineHeight: 1.8, marginBottom: 20 }}>
        <strong style={{ color: p.accent }}>Workforce Identity Federation</strong> lets employees, contractors, and partners
        from your corporate IdP (Okta, Azure AD, ADFS) access GCP without a Google or Cloud Identity account.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <Card color={p.red}>
          <div style={{ color: p.red, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>❌ Before</div>
          <ul style={{ paddingLeft: 16, margin: 0, color: p.textDim, fontSize: 12, lineHeight: 2 }}>
            <li>Every human GCP user needed a Google account</li>
            <li>Required Cloud Identity provisioning for all users</li>
            <li>Two identity systems to manage</li>
            <li>Offboarding needed action in both systems</li>
          </ul>
        </Card>
        <Card color={p.green}>
          <div style={{ color: p.green, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>✓ Workforce Identity Federation</div>
          <ul style={{ paddingLeft: 16, margin: 0, color: p.textDim, fontSize: 12, lineHeight: 2 }}>
            <li>Users authenticate with corporate IdP</li>
            <li>No Google account required</li>
            <li>Single source of truth for user lifecycle</li>
            <li>Offboard from Okta → access revoked in GCP</li>
          </ul>
        </Card>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { id: "overview", label: "How It Works" },
          { id: "concepts", label: "Key Concepts" },
          { id: "access", label: "Access Methods" },
          { id: "comparison", label: "vs Cloud Identity" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setView(tab.id)} style={{
            padding: "7px 16px", borderRadius: 8,
            border: `1.5px solid ${view === tab.id ? p.accent : p.border}`,
            background: view === tab.id ? `${p.accent}15` : "transparent",
            color: view === tab.id ? p.accent : p.textMuted,
            cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
          }}>{tab.label}</button>
        ))}
      </div>
      {view === "overview" && (
        <div>
          <Card color={p.border} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: p.textMuted, fontWeight: 600, marginBottom: 16, textAlign: "center" }}>Workforce Identity Federation — Authentication Flow</div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {[
                { icon: "👤", label: "Employee /\nContractor", color: p.textDim },
                { arrow: true },
                { icon: "🔐", label: "Corporate IdP\n(Okta / Azure AD)", color: p.purple },
                { arrow: true },
                { icon: "📜", label: "OIDC / SAML\nAssertion", color: p.cyan },
                { arrow: true },
                { icon: "🔄", label: "GCP STS\n(token exchange)", color: p.blue },
                { arrow: true },
                { icon: "🎫", label: "Short-lived\nGoogle Token", color: p.green },
                { arrow: true },
                { icon: "☁", label: "GCP Resource\n(Console / API)", color: p.accent },
              ].map((item, i) => item.arrow ? (
                <span key={i} style={{ color: p.textMuted, fontSize: 20 }}>→</span>
              ) : (
                <div key={i} style={{ textAlign: "center", minWidth: 80 }}>
                  <div style={{ fontSize: 26, marginBottom: 4 }}>{item.icon}</div>
                  <div style={{ fontSize: 10, color: item.color, lineHeight: 1.4, whiteSpace: "pre-line", fontWeight: 500 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </Card>
          <InfoBox color={p.blue} icon="ℹ">
            Workforce Identity Pools are an <strong>org-level</strong> construct (unlike Workload Identity Pools which are project-level). A single pool can be used across all projects in your organization.
          </InfoBox>
        </div>
      )}
      {view === "concepts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { term: "Workforce Identity Pool", color: p.blue, desc: "An org-level container for your external human identities. Created at the Organization level, shared across projects.", example: "gcloud iam workforce-pools create my-corp-pool --organization=ORG_ID --location=global" },
            { term: "Pool Provider", color: p.purple, desc: "Configures the external IdP. Supports OIDC and SAML 2.0. Defines attribute mapping and conditions.", example: 'gcloud iam workforce-pools providers create-oidc my-okta \\\n  --workforce-pool=my-corp-pool --location=global \\\n  --issuer-uri=https://my-company.okta.com \\\n  --attribute-mapping="google.subject=assertion.sub,attribute.dept=assertion.department"' },
            { term: "Attribute Mapping", color: p.cyan, desc: "Maps IdP token claims → Google attributes. google.subject is required. google.email enables email-based IAM bindings.", example: "google.subject = assertion.sub\ngoogle.email = assertion.email\nattribute.department = assertion.idp_department" },
            { term: "IAM Binding with WIF Principal", color: p.accent, desc: "Bind roles to external users via their workforce pool identity. No Google account needed.", example: 'gcloud projects add-iam-policy-binding PROJECT_ID \\\n  --role="roles/storage.objectViewer" \\\n  --member="principalSet://iam.googleapis.com/locations/global/workforcePools/my-corp-pool/attribute.department/engineering"' },
          ].map((c, i) => (
            <Card key={i} color={c.color} style={{ padding: "14px 16px" }}>
              <div style={{ color: c.color, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{c.term}</div>
              <div style={{ color: p.textDim, fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>{c.desc}</div>
              <pre style={{ margin: 0, fontSize: 11, color: p.cyan, fontFamily: "'JetBrains Mono', monospace", background: p.bg, borderRadius: 6, padding: "8px 12px", overflowX: "auto", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{c.example}</pre>
            </Card>
          ))}
        </div>
      )}
      {view === "access" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {[
            { method: "Google Cloud Console", icon: "🌐", color: p.blue, desc: "Use the federated login URL. Auth happens via your IdP's SSO flow.", note: "Standard SSO login experience for users." },
            { method: "gcloud CLI", icon: "💻", color: p.green, desc: "gcloud auth login --workforce-pool-user\nOpens browser-based IdP login.", note: "Requires gcloud 392.0.0+" },
            { method: "Client Libraries", icon: "⚙", color: p.purple, desc: "Use Application Default Credentials with the External Account credentials JSON config file.", note: "Supported by all Google Cloud client libraries." },
            { method: "Credential Config File", icon: "📄", color: p.cyan, desc: "A JSON file pointing to the WIF pool/provider and how to get the external token. Set via GOOGLE_APPLICATION_CREDENTIALS.", note: "Not a secret — contains no credentials." },
          ].map((m, i) => (
            <Card key={i} color={m.color} style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{m.icon}</div>
              <div style={{ color: m.color, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{m.method}</div>
              <pre style={{ margin: "0 0 8px", fontSize: 11, color: p.textDim, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{m.desc}</pre>
              <div style={{ fontSize: 11, color: p.textMuted, fontStyle: "italic" }}>{m.note}</div>
            </Card>
          ))}
        </div>
      )}
      {view === "comparison" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 14px", textAlign: "left", color: p.textMuted, borderBottom: `1px solid ${p.border}` }}>Feature</th>
                <th style={{ padding: "10px 14px", textAlign: "left", color: p.blue, borderBottom: `1px solid ${p.border}` }}>Cloud Identity</th>
                <th style={{ padding: "10px 14px", textAlign: "left", color: p.green, borderBottom: `1px solid ${p.border}` }}>Workforce Identity Federation</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Identity source", ci: "Google-managed directory", wif: "External IdP (Okta, Azure AD, ADFS)" },
                { feature: "Google account required", ci: "Yes", wif: "No" },
                { feature: "MFA enforcement", ci: "Via Cloud Identity policies", wif: "Via existing IdP" },
                { feature: "Access to Google Workspace", ci: "Yes", wif: "No" },
                { feature: "User provisioning (SCIM)", ci: "Yes (CI Premium)", wif: "No — manage in IdP" },
                { feature: "IAM binding syntax", ci: "user:alice@corp.com", wif: "principal://...workforcePools/POOL/subject/alice" },
                { feature: "Setup complexity", ci: "Lower for Google-centric orgs", wif: "Medium — pool/provider config required" },
                { feature: "Cost", ci: "Free (up to 2000) / Premium", wif: "Free (no additional IAM charge)" },
                { feature: "Best for", ci: "Orgs going all-in on Google ecosystem", wif: "Enterprises with existing Okta/AAD/ADFS" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? p.surfaceAlt : "transparent" }}>
                  <td style={{ padding: "9px 14px", color: p.textDim, borderBottom: `1px solid ${p.border}`, fontWeight: 500 }}>{row.feature}</td>
                  <td style={{ padding: "9px 14px", color: p.text, borderBottom: `1px solid ${p.border}` }}>{row.ci}</td>
                  <td style={{ padding: "9px 14px", color: p.text, borderBottom: `1px solid ${p.border}` }}>{row.wif}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <InfoBox color={p.purple} icon="💡">
            Use <strong>Cloud Identity</strong> if your org is adopting the Google ecosystem. Use <strong>Workforce Identity Federation</strong> if you already have a mature Okta/Azure AD/ADFS setup and don't want to duplicate user management in Google.
          </InfoBox>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   TAB 5 — CLOUD LOGGING → PUB/SUB → SIEM
═══════════════════════════════════════════════ */

const LOG_SINK_ACTORS = [
  { label: "Admin",         sub: "GCP Project Admin",    x: 75,  color: "#fbbc04" },
  { label: "Cloud Logging", sub: "Source Project",       x: 230, color: "#4285f4" },
  { label: "Pub/Sub Topic", sub: "SIEM Project",         x: 445, color: "#f97316" },
  { label: "Subscription",  sub: "SIEM Project",         x: 625, color: "#06b6d4" },
  { label: "SIEM Tool",     sub: "Splunk / Chronicle",   x: 810, color: "#34a853" },
];

const LOG_SINK_SEQ = [
  { from:0, to:1, y:110, label:"1. Create Log Sink",           sub:"sink name, filter expression, destination Pub/Sub URI",    color:"#fbbc04", dashed:false },
  { from:1, to:2, y:155, label:"2. Grant pubsub.publisher",    sub:"to auto-created sink SA: p-12345@gcp-sa-logging.iam...",   color:"#4285f4", dashed:false },
  { from:2, to:1, y:206, label:"3. IAM confirmed — sink live", sub:"sink service account now authorised to publish",           color:"#f97316", dashed:true  },
  { from:0, to:1, y:282, label:"4. Log entry generated",       sub:"[GKE pod / Cloud Run / VM / Cloud SQL / Firewall...]",     color:"#fbbc04", dashed:false },
  { from:1, to:2, y:328, label:"5. Publish matching LogEntry", sub:"JSON payload after filter evaluation — sent to topic",     color:"#4285f4", dashed:false },
  { from:2, to:3, y:373, label:"6. Message delivery",          sub:"at-least-once — messages retained up to 7 days",           color:"#f97316", dashed:false },
  { from:3, to:4, y:418, label:"7. Push / Pull ingestion",     sub:"HTTPS push endpoint or subscriber pull API",               color:"#06b6d4", dashed:false },
  { from:4, to:0, y:462, label:"8. Alert / indexed",           sub:"log searchable · triggers · dashboards in SIEM",           color:"#34a853", dashed:true  },
];

const LogSinkSIEMSection = () => {
  const [tab, setTab] = useState("architecture");
  const LS = 75, LE = 540;

  const tabBtn = (id, icon, label) => (
    <button key={id} onClick={() => setTab(id)} style={{
      padding: "7px 14px", borderRadius: 8,
      border: `1.5px solid ${tab === id ? "#fbbc04" : p.border}`,
      background: tab === id ? "#fbbc0418" : "transparent",
      color: tab === id ? "#fbbc04" : p.textMuted,
      fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
      display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
    }}><span>{icon}</span> {label}</button>
  );

  return (
    <div style={{ animation: "fadeSlideUp 0.4s ease both" }}>
      <p style={{ color: p.textDim, lineHeight: 1.8, marginBottom: 20 }}>
        <strong style={{ color: "#fbbc04" }}>Cloud Logging Log Sinks</strong> route log entries from any GCP
        project, folder, or organisation to an external destination. The standard SIEM integration pattern
        exports logs via <strong style={{ color: "#f97316" }}>Pub/Sub</strong> to a dedicated security project,
        where a SIEM tool (Splunk, Google Chronicle, Elastic) ingests and analyses them in real time.
      </p>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {tabBtn("architecture", "⬡", "Architecture")}
        {tabBtn("sink-config",  "⚙", "Sink Configuration")}
        {tabBtn("sequence",     "⟶", "Sequence Diagram")}
        {tabBtn("iam-setup",    "🔑", "IAM & Setup")}
      </div>

      {/* ── Architecture Tab ── */}
      {tab === "architecture" && (
        <div>
          <SectionTitle>⬡ Cross-Project Architecture</SectionTitle>
          <p style={{ color: p.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
            Log sinks can export to destinations in <strong style={{ color: p.text }}>different GCP projects</strong>.
            The recommended security architecture isolates the Pub/Sub topic and SIEM consumers in a
            dedicated <em>Security / SIEM project</em>, fully separated from source workload projects.
          </p>

          <svg viewBox="0 0 880 340" style={{ width: "100%", display: "block", background: "#0c0f16", borderRadius: 10, border: `1px solid ${p.border}`, marginBottom: 16 }}>
            {/* Source Project box */}
            <rect x="10" y="15" width="375" height="310" rx="8" fill="#4285f408" stroke="#4285f440" strokeWidth="1.5"/>
            <text x="22" y="38" fill="#4285f4" fontSize="11" fontWeight="700" fontFamily="'IBM Plex Sans',sans-serif">SOURCE PROJECT</text>
            <text x="22" y="53" fill="#5a6478" fontSize="9" fontFamily="'IBM Plex Sans',sans-serif">e.g. my-app-production</text>

            {/* Cloud Resources row */}
            {["GKE","Cloud Run","VM","App Engine"].map((r, i) => (
              <g key={r}>
                <rect x={22 + i*85} y="62" width="75" height="28" rx="5" fill="#4285f415" stroke="#4285f430" strokeWidth="1"/>
                <text x={22 + i*85 + 37} y="80" textAnchor="middle" fill="#4285f4" fontSize="9.5" fontWeight="600" fontFamily="'IBM Plex Sans',sans-serif">{r}</text>
              </g>
            ))}

            {/* Arrow: resources → Cloud Logging */}
            <line x1="195" y1="90" x2="195" y2="115" stroke="#4285f440" strokeWidth="1.5" strokeDasharray="3,2"/>
            <polygon points="195,119 191,110 199,110" fill="#4285f440"/>

            {/* Cloud Logging box */}
            <rect x="65" y="122" width="260" height="50" rx="7" fill="#4285f418" stroke="#4285f450" strokeWidth="1.5"/>
            <text x="195" y="142" textAnchor="middle" fill="#4285f4" fontSize="11.5" fontWeight="700" fontFamily="'IBM Plex Sans',sans-serif">☁ Cloud Logging</text>
            <text x="195" y="159" textAnchor="middle" fill="#5a6478" fontSize="9" fontFamily="'IBM Plex Sans',sans-serif">Log Router · Ingestion · Storage</text>

            {/* Arrow: Cloud Logging → Log Sink */}
            <line x1="195" y1="172" x2="195" y2="197" stroke="#fbbc0450" strokeWidth="1.5" strokeDasharray="3,2"/>
            <polygon points="195,201 191,192 199,192" fill="#fbbc0450"/>

            {/* Log Sink box */}
            <rect x="52" y="204" width="286" height="82" rx="7" fill="#fbbc0412" stroke="#fbbc0445" strokeWidth="1.5"/>
            <text x="195" y="225" textAnchor="middle" fill="#fbbc04" fontSize="11.5" fontWeight="700" fontFamily="'IBM Plex Sans',sans-serif">⬡ Log Sink</text>
            <text x="195" y="242" textAnchor="middle" fill="#8892a4" fontSize="9" fontFamily="'IBM Plex Sans',sans-serif">filter: severity &gt;= WARNING</text>
            <text x="195" y="257" textAnchor="middle" fill="#8892a4" fontSize="9" fontFamily="'IBM Plex Sans',sans-serif">destination: pubsub://siem-proj/topics/gcp-logs</text>
            <text x="195" y="273" textAnchor="middle" fill="#5a6478" fontSize="8" fontFamily="'IBM Plex Sans',sans-serif">writerIdentity: p-12345@gcp-sa-logging.iam.gserviceaccount.com</text>

            {/* Cross-project bezier arrow */}
            <path d="M 338 245 C 415 245 415 100 495 100" fill="none" stroke="#fbbc04" strokeWidth="2" strokeDasharray="6,3"/>
            <polygon points="495,100 484,95 484,105" fill="#fbbc04"/>
            <text x="418" y="184" textAnchor="middle" fill="#fbbc04" fontSize="9.5" fontWeight="700" fontFamily="'IBM Plex Sans',sans-serif">cross-project</text>
            <text x="418" y="197" textAnchor="middle" fill="#5a6478" fontSize="8.5" fontFamily="'IBM Plex Sans',sans-serif">log export</text>

            {/* SIEM Project box */}
            <rect x="495" y="15" width="375" height="310" rx="8" fill="#a855f708" stroke="#a855f740" strokeWidth="1.5"/>
            <text x="507" y="38" fill="#a855f7" fontSize="11" fontWeight="700" fontFamily="'IBM Plex Sans',sans-serif">SIEM PROJECT</text>
            <text x="507" y="53" fill="#5a6478" fontSize="9" fontFamily="'IBM Plex Sans',sans-serif">e.g. central-security-siem</text>

            {/* Pub/Sub Topic */}
            <rect x="565" y="62" width="240" height="52" rx="7" fill="#f9731618" stroke="#f9731645" strokeWidth="1.5"/>
            <text x="685" y="83" textAnchor="middle" fill="#f97316" fontSize="11.5" fontWeight="700" fontFamily="'IBM Plex Sans',sans-serif">◈ Pub/Sub Topic</text>
            <text x="685" y="101" textAnchor="middle" fill="#5a6478" fontSize="9" fontFamily="'IBM Plex Sans',sans-serif">gcp-logs · 7-day retention</text>

            {/* Arrow */}
            <line x1="685" y1="114" x2="685" y2="141" stroke="#f9731640" strokeWidth="1.5" strokeDasharray="3,2"/>
            <polygon points="685,145 681,136 689,136" fill="#f9731640"/>

            {/* Subscription */}
            <rect x="565" y="148" width="240" height="50" rx="7" fill="#06b6d418" stroke="#06b6d445" strokeWidth="1.5"/>
            <text x="685" y="168" textAnchor="middle" fill="#06b6d4" fontSize="11.5" fontWeight="700" fontFamily="'IBM Plex Sans',sans-serif">⇄ Subscription</text>
            <text x="685" y="186" textAnchor="middle" fill="#5a6478" fontSize="9" fontFamily="'IBM Plex Sans',sans-serif">push (HTTPS) or pull</text>

            {/* Arrow */}
            <line x1="685" y1="198" x2="685" y2="227" stroke="#34a85340" strokeWidth="1.5" strokeDasharray="3,2"/>
            <polygon points="685,231 681,222 689,222" fill="#34a85340"/>

            {/* SIEM Tool */}
            <rect x="538" y="234" width="294" height="70" rx="7" fill="#34a85318" stroke="#34a85345" strokeWidth="1.5"/>
            <text x="685" y="256" textAnchor="middle" fill="#34a853" fontSize="11.5" fontWeight="700" fontFamily="'IBM Plex Sans',sans-serif">&#x1F6E1; SIEM Tool</text>
            <text x="685" y="274" textAnchor="middle" fill="#8892a4" fontSize="9" fontFamily="'IBM Plex Sans',sans-serif">Splunk · Google Chronicle · Elastic</text>
            <text x="685" y="291" textAnchor="middle" fill="#5a6478" fontSize="9" fontFamily="'IBM Plex Sans',sans-serif">ingest · index · alert · dashboard</text>
          </svg>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { c:"#4285f4", icon:"📥", title:"Log Sources",     text:"Every GCP service writes to Cloud Logging automatically: GKE, Cloud Run, Compute Engine, Cloud SQL, Firewall logs, Admin Activity, Data Access, VPC Flow logs and more." },
              { c:"#fbbc04", icon:"⬡",  title:"Log Sink",        text:"A routing rule inside Cloud Logging. Defines what to export (filter expression) and where to send it (destination URI). Multiple sinks can target different destinations simultaneously." },
              { c:"#f97316", icon:"◈",  title:"Pub/Sub Bridge",  text:"Pub/Sub decouples log production from SIEM consumption. The SIEM does not need to be always-on — messages are retained for up to 7 days so no data is lost during maintenance windows." },
              { c:"#34a853", icon:"🛡", title:"SIEM Isolation",  text:"Placing the Pub/Sub topic in a separate project limits blast radius. The source project's sink SA only needs pubsub.publisher on that specific topic, not broad project access." },
            ].map(({ c, icon, title, text }) => (
              <div key={title} style={{ background: p.surfaceAlt, border: `1px solid ${p.border}`, borderLeft: `3px solid ${c}`, borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ color: c, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{icon} {title}</div>
                <div style={{ color: p.textDim, fontSize: 12, lineHeight: 1.7 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Sink Configuration Tab ── */}
      {tab === "sink-config" && (
        <div>
          <SectionTitle>⚙ What is a Log Sink?</SectionTitle>
          <p style={{ color: p.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
            A <strong style={{ color: "#fbbc04" }}>Log Sink</strong> (logging export sink) is a resource inside
            Cloud Logging that defines <strong style={{ color: p.text }}>what logs to export</strong> and{" "}
            <strong style={{ color: p.text }}>where to send them</strong>. Sinks can be scoped to a project,
            folder, or organisation.
          </p>

          {/* Sink anatomy */}
          <div style={{ background: p.surfaceAlt, border: `1px solid #fbbc0430`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div style={{ color: "#fbbc04", fontWeight: 700, marginBottom: 14 }}>Sink Resource Fields</div>
            <div style={{ display: "grid", gap: 11 }}>
              {[
                { field:"name",           type:"string", ex:"security-export-sink",                                    desc:"Unique sink name within the project" },
                { field:"destination",    type:"URI",    ex:"pubsub.googleapis.com/projects/siem-proj/topics/gcp-logs", desc:"Fully qualified resource URI for the export target" },
                { field:"filter",         type:"string", ex:`severity >= WARNING`,                                      desc:"Log filter expression — only matching entries are exported. Empty = export everything." },
                { field:"writerIdentity", type:"SA",     ex:"serviceAccount:p-12345@gcp-sa-logging.iam.gserviceaccount.com", desc:"Auto-created SA used to write to destination. Must be granted permission on the destination manually." },
                { field:"includeChildren",type:"bool",   ex:"true (folder / org sinks only)",                          desc:"Export logs from all child projects/folders when scoped to a folder or organisation." },
                { field:"disabled",       type:"bool",   ex:"false",                                                   desc:"Pause export without deleting the sink. Useful during SIEM maintenance." },
              ].map(({ field, type, ex, desc }) => (
                <div key={field} style={{ display: "grid", gridTemplateColumns: "150px 55px 1fr", gap: 10, alignItems: "start", fontSize: 12, borderBottom: `1px solid ${p.border}`, paddingBottom: 10 }}>
                  <Code>{field}</Code>
                  <Tag color={p.textMuted}>{type}</Tag>
                  <div>
                    <div style={{ color: p.textDim, lineHeight: 1.5 }}>{desc}</div>
                    <div style={{ color: p.cyan, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, marginTop: 4, opacity: 0.85 }}>{ex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Destination types */}
          <SectionTitle>Supported Destinations</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { dest:"Pub/Sub Topic",  color:"#f97316", badge:"Best for SIEM",       desc:"Real-time streaming export. Supports cross-project. SIEM can be down without losing logs — messages buffer up to 7 days." },
              { dest:"Cloud Storage",  color:"#4285f4", badge:"Long-term archive",    desc:"Stores logs as JSON/Avro files in GCS buckets. Cost-effective for compliance retention and infrequent querying." },
              { dest:"BigQuery",       color:"#34a853", badge:"SQL analytics",        desc:"Exports to a BQ dataset for ad-hoc SQL queries. Schema auto-detected. Great for investigation and trend analysis." },
              { dest:"Logging Bucket", color:"#a855f7", badge:"Centralised logging",  desc:"Route logs to a _Default or custom log bucket in another project. Enables a single pane of glass for multi-project log viewing." },
            ].map(({ dest, color, badge, desc }) => (
              <div key={dest} style={{ background: p.surfaceAlt, border: `1px solid ${p.border}`, borderRadius: 8, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ color, fontWeight: 700, fontSize: 13 }}>{dest}</span>
                  <Tag color={color}>{badge}</Tag>
                </div>
                <div style={{ color: p.textDim, fontSize: 12, lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>

          <SectionTitle>Common Filter Patterns</SectionTitle>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              { label:"All warnings and above",           filter:`severity >= WARNING` },
              { label:"Admin Activity audit logs only",   filter:`logName:"cloudaudit.googleapis.com/activity"` },
              { label:"GKE pod logs from a namespace",    filter:`resource.type="k8s_container"\nresource.labels.namespace_name="production"` },
              { label:"Security Command Center findings", filter:`logName:"securitycenter.googleapis.com"` },
              { label:"VPC firewall deny logs",           filter:`resource.type="gce_subnetwork"\nlog_id("compute.googleapis.com/firewall")` },
              { label:"Exclude a noisy project",          filter:`severity >= WARNING\nNOT resource.labels.project_id="noisy-dev-project"` },
            ].map(({ label, filter }) => (
              <div key={label} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 8, padding: 14 }}>
                <div style={{ color: p.textDim, fontSize: 12, marginBottom: 8 }}>{label}</div>
                <pre style={{ margin: 0, color: p.cyan, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.6 }}>{filter}</pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Sequence Diagram Tab ── */}
      {tab === "sequence" && (
        <div>
          <SectionTitle>⟶ End-to-End Sequence</SectionTitle>
          <p style={{ color: p.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
            Two phases: <strong style={{ color: "#fbbc04" }}>Setup</strong> (one-time admin configuration) and{" "}
            <strong style={{ color: "#4285f4" }}>Runtime</strong> (continuous log streaming to SIEM).
          </p>

          <svg viewBox="0 0 940 590" style={{ width: "100%", display: "block", background: "#0c0f16", borderRadius: 10, border: `1px solid ${p.border}` }}>
            {/* Project background regions */}
            <rect x="14" y="8" width="298" height="570" rx="6" fill="#4285f406" stroke="#4285f420" strokeWidth="1"/>
            <text x="22" y="24" fill="#4285f4" fontSize="8.5" fontWeight="700" fontFamily="'IBM Plex Sans',sans-serif" opacity="0.55">SOURCE PROJECT</text>
            <rect x="388" y="8" width="540" height="570" rx="6" fill="#a855f706" stroke="#a855f720" strokeWidth="1"/>
            <text x="396" y="24" fill="#a855f7" fontSize="8.5" fontWeight="700" fontFamily="'IBM Plex Sans',sans-serif" opacity="0.55">SIEM PROJECT</text>

            {/* Phase highlight boxes */}
            <rect x="26" y="87" width="900" height="152" rx="5"
              fill="#fbbc04" fillOpacity="0.035" stroke="#fbbc04" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="4,3"/>
            <text x="922" y="102" textAnchor="end" fill="#fbbc04" fillOpacity="0.65" fontSize="9" fontWeight="700"
              fontFamily="'IBM Plex Sans',sans-serif" letterSpacing="1.5">SETUP PHASE</text>

            <rect x="26" y="258" width="900" height="240" rx="5"
              fill="#4285f4" fillOpacity="0.035" stroke="#4285f4" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="4,3"/>
            <text x="922" y="273" textAnchor="end" fill="#4285f4" fillOpacity="0.65" fontSize="9" fontWeight="700"
              fontFamily="'IBM Plex Sans',sans-serif" letterSpacing="1.5">RUNTIME PHASE</text>

            {/* Lifelines */}
            {LOG_SINK_ACTORS.map((a, i) => (
              <line key={i} x1={a.x} y1={LS} x2={a.x} y2={LE}
                stroke={a.color} strokeWidth="1.5" strokeDasharray="5,4" strokeOpacity="0.3"/>
            ))}

            {/* Top actor boxes */}
            {LOG_SINK_ACTORS.map((a, i) => (
              <g key={i}>
                <rect x={a.x - 57} y="13" width="114" height="50" rx="6"
                  fill={p.surfaceAlt} stroke={a.color} strokeWidth="1.5"/>
                <text x={a.x} y="34" textAnchor="middle" fill={a.color} fontSize="10.5" fontWeight="700"
                  fontFamily="'IBM Plex Sans',sans-serif">{a.label}</text>
                <text x={a.x} y="52" textAnchor="middle" fill={p.textMuted} fontSize="8.5"
                  fontFamily="'IBM Plex Sans',sans-serif">{a.sub}</text>
              </g>
            ))}

            {/* Message arrows */}
            {LOG_SINK_SEQ.map((s, i) => {
              const x1 = LOG_SINK_ACTORS[s.from].x;
              const x2 = LOG_SINK_ACTORS[s.to].x;
              const right = x2 > x1;
              const mx = (x1 + x2) / 2;
              const lx2 = right ? x2 - 7 : x2 + 7;
              return (
                <g key={i}>
                  <line x1={x1} y1={s.y} x2={lx2} y2={s.y}
                    stroke={s.color} strokeWidth="1.8"
                    strokeDasharray={s.dashed ? "6,3" : "none"}/>
                  {right
                    ? <polygon points={`${x2},${s.y} ${x2-10},${s.y-5} ${x2-10},${s.y+5}`} fill={s.color}/>
                    : <polygon points={`${x2},${s.y} ${x2+10},${s.y-5} ${x2+10},${s.y+5}`} fill={s.color}/>
                  }
                  <text x={mx} y={s.y - 11} textAnchor="middle" fill={s.color} fontSize="10.5" fontWeight="600"
                    fontFamily="'IBM Plex Sans',sans-serif">{s.label}</text>
                  <text x={mx} y={s.y + 16} textAnchor="middle" fill={p.textMuted} fontSize="8.5" fontStyle="italic"
                    fontFamily="'IBM Plex Sans',sans-serif">{s.sub}</text>
                </g>
              );
            })}

            {/* Bottom actor boxes */}
            {LOG_SINK_ACTORS.map((a, i) => (
              <g key={i}>
                <rect x={a.x - 57} y={LE} width="114" height="32" rx="6"
                  fill={p.surfaceAlt} stroke={a.color} strokeWidth="1.5" strokeOpacity="0.6"/>
                <text x={a.x} y={LE + 21} textAnchor="middle" fill={a.color} fontSize="10" fontWeight="600"
                  fontFamily="'IBM Plex Sans',sans-serif" opacity="0.75">{a.label}</text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div style={{ display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap", fontSize: 12, color: p.textDim }}>
            {[
              { c:"#fbbc04", l:"Admin action",     dash:false },
              { c:"#4285f4", l:"Cloud Logging",    dash:false },
              { c:"#f97316", l:"Pub/Sub",          dash:false },
              { c:"#06b6d4", l:"Subscription",     dash:false },
              { c:"#34a853", l:"SIEM response",    dash:true  },
            ].map(({ c, l, dash }) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="26" height="10" style={{ display: "block", flexShrink: 0 }}>
                  <line x1="0" y1="5" x2="26" y2="5" stroke={c} strokeWidth="2" strokeDasharray={dash ? "5,2" : "none"}/>
                  {!dash && <polygon points="26,5 17,1 17,9" fill={c}/>}
                </svg>
                {l}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── IAM & Setup Tab ── */}
      {tab === "iam-setup" && (
        <div>
          <SectionTitle>🔑 Step-by-Step Setup</SectionTitle>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              {
                step:"1", color:"#fbbc04", title:"Create Pub/Sub Topic in SIEM project",
                desc:"Create the destination topic and subscription in your SIEM project (run as SIEM project admin):",
                code:`# In SIEM project\ngcloud pubsub topics create gcp-logs \\\n  --project=central-security-siem\n\n# Create a pull subscription (SIEM pulls messages)\ngcloud pubsub subscriptions create gcp-logs-sub \\\n  --topic=gcp-logs \\\n  --project=central-security-siem \\\n  --ack-deadline=60`,
              },
              {
                step:"2", color:"#4285f4", title:"Create the Log Sink in Source project",
                desc:"Create the sink in the source project. Note the writerIdentity from the output — you need it for step 3:",
                code:`# Project-level sink\ngcloud logging sinks create security-export-sink \\\n  pubsub.googleapis.com/projects/central-security-siem/topics/gcp-logs \\\n  --log-filter='severity >= WARNING' \\\n  --project=my-app-production\n\n# Folder-level sink (includes all child projects)\ngcloud logging sinks create org-security-sink \\\n  pubsub.googleapis.com/projects/central-security-siem/topics/gcp-logs \\\n  --log-filter='severity >= WARNING' \\\n  --folder=FOLDER_ID \\\n  --include-children`,
              },
              {
                step:"3", color:"#f97316", title:"Grant sink SA pubsub.publisher on the topic",
                desc:"Retrieve the auto-created writerIdentity service account and grant it publisher rights on the SIEM project's topic:",
                code:`# Get the sink's writerIdentity\nSINK_SA=$(gcloud logging sinks describe security-export-sink \\\n  --project=my-app-production \\\n  --format='value(writerIdentity)')\n\necho "Sink SA: $SINK_SA"\n# Output: serviceAccount:p-12345@gcp-sa-logging.iam.gserviceaccount.com\n\n# Grant pubsub.publisher on the SIEM project topic\ngcloud pubsub topics add-iam-policy-binding gcp-logs \\\n  --project=central-security-siem \\\n  --member="$SINK_SA" \\\n  --role="roles/pubsub.publisher"`,
              },
              {
                step:"4", color:"#34a853", title:"Verify end-to-end flow",
                desc:"Write a test log and confirm it arrives in the Pub/Sub subscription:",
                code:`# Write a WARNING test log in source project\ngcloud logging write test-log "SIEM export test — severity WARNING" \\\n  --severity=WARNING \\\n  --project=my-app-production\n\n# Pull one message from SIEM subscription to verify delivery\ngcloud pubsub subscriptions pull gcp-logs-sub \\\n  --project=central-security-siem \\\n  --limit=1 \\\n  --auto-ack`,
              },
            ].map(({ step, color, title, desc, code }) => (
              <div key={step} style={{ background: p.surfaceAlt, border: `1px solid ${p.border}`, borderRadius: 10, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ background: `${color}20`, color, border: `1.5px solid ${color}40`, borderRadius: 8, padding: "4px 12px", fontWeight: 800, fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>
                    {step}
                  </span>
                  <span style={{ color, fontWeight: 700, fontSize: 14 }}>{title}</span>
                </div>
                <div style={{ color: p.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{desc}</div>
                <pre style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 8, padding: 14, margin: 0, color: p.text, fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", overflowX: "auto", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{code}</pre>
              </div>
            ))}
          </div>

          <SectionTitle>Required IAM Roles</SectionTitle>
          <div style={{ background: p.surfaceAlt, border: `1px solid ${p.border}`, borderRadius: 10, padding: 20 }}>
            <div style={{ display: "grid", gap: 11 }}>
              {[
                { who:"Admin creating the sink",  role:"roles/logging.configWriter",   proj:"Source project",  desc:"Create, update, delete sinks" },
                { who:"Sink service account",     role:"roles/pubsub.publisher",        proj:"SIEM project",    desc:"Publish log entries to the Pub/Sub topic — must be granted manually after sink creation" },
                { who:"SIEM subscriber SA / tool",role:"roles/pubsub.subscriber",       proj:"SIEM project",    desc:"Pull/ack messages from the Pub/Sub subscription" },
                { who:"SIEM subscriber SA / tool",role:"roles/pubsub.viewer",           proj:"SIEM project",    desc:"View subscription metadata and topic details" },
              ].map(({ who, role, proj, desc }) => (
                <div key={role + who} style={{ display: "grid", gridTemplateColumns: "160px 220px 1fr", gap: 10, alignItems: "start", borderBottom: `1px solid ${p.border}`, paddingBottom: 10, fontSize: 12 }}>
                  <div style={{ color: p.textDim }}>{who}</div>
                  <Code>{role}</Code>
                  <div>
                    <Tag color={p.blue}>{proj}</Tag>
                    <div style={{ color: p.textMuted, marginTop: 4 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <InfoBox color="#fbbc04" icon="⚠">
            <strong>Critical:</strong> GCP auto-creates the sink&apos;s <Code>writerIdentity</Code> service
            account, but you <strong>must manually grant</strong> it <Code>roles/pubsub.publisher</Code> on
            the SIEM project&apos;s Pub/Sub topic. Until this grant is made the sink silently drops all
            exported log entries with no error visible in the source project.
          </InfoBox>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   GCP SUBPAGES REGISTRY
═══════════════════════════════════════════════ */

const GCP_SUBPAGES = [
  { id: "iam-roles", label: "IAM Roles & Policy Binding", icon: "🔑", component: RolesBindingsSection },
  { id: "cloud-identity", label: "Cloud Identity vs IAM", icon: "🪪", component: CloudIdentityIAMSection },
  { id: "workload-federation", label: "Workload Identity Federation", icon: "⚙", component: WorkloadFederationSection },
  { id: "workforce-federation", label: "Workforce Identity Federation", icon: "👥", component: WorkforceFederationSection },
  { id: "log-sink-siem", label: "Cloud Logging → SIEM", icon: "⬡", component: LogSinkSIEMSection },
  { id: "load-balancing", label: "GCP Load Balancing", icon: "⚖", component: GCPLoadBalancingGuide },
];

/* ═══════════════════════════════════════════════
   MAIN EXPORT — HUB LAYOUT WITH GCP SIDEBAR
═══════════════════════════════════════════════ */

export default function GCPSecurityGuide() {
  const [active, setActive] = useState("iam-roles");
  const ActiveComp = GCP_SUBPAGES.find(sp => sp.id === active).component;

  const select = (id) => {
    setActive(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: p.bg, fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif", color: p.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── GCP Sub-sidebar ── */}
      <aside style={{
        width: 228,
        flexShrink: 0,
        borderRight: `1px solid ${p.border}`,
        background: p.surface,
        display: "flex",
        flexDirection: "column",
        padding: "16px 0",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}>
        {/* Back to main home */}
        <Link to="/" style={{
          display: "flex", alignItems: "center", gap: 6,
          margin: "0 10px 12px",
          padding: "7px 12px",
          borderRadius: 7,
          border: `1px solid ${p.border}`,
          color: p.textMuted,
          textDecoration: "none",
          fontSize: 12,
          transition: "all 0.15s",
        }}>
          ← Main Home
        </Link>

        {/* GCP brand */}
        <div style={{ padding: "10px 16px 14px", borderBottom: `1px solid ${p.border}`, marginBottom: 10 }}>
          <div style={{ height: 3, borderRadius: 2, background: `linear-gradient(90deg, #4285f4, #ea4335, #fbbc04, #34a853)`, marginBottom: 10 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>☁</span>
            <div>
              <div style={{ color: p.text, fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Google Cloud</div>
              <div style={{ color: p.textMuted, fontSize: 11 }}>Security Guide</div>
            </div>
          </div>
        </div>

        {/* Subtopic nav links */}
        <div style={{ padding: "0 8px", flex: 1 }}>
          <div style={{ fontSize: 10, color: p.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 8px 8px" }}>Topics</div>
          {GCP_SUBPAGES.map(sp => (
            <button key={sp.id} onClick={() => select(sp.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 9,
              padding: "10px 12px", margin: "2px 0", borderRadius: 8,
              border: `1.5px solid ${active === sp.id ? p.accent : "transparent"}`,
              background: active === sp.id ? `${p.accent}15` : "transparent",
              color: active === sp.id ? p.accent : p.textDim,
              cursor: "pointer", fontFamily: "inherit", fontSize: 12,
              fontWeight: active === sp.id ? 700 : 400,
              textAlign: "left", transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>{sp.icon}</span>
              <span style={{ lineHeight: 1.3 }}>{sp.label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${p.border}`, marginTop: 8 }}>
          <div style={{ fontSize: 10, color: p.textMuted }}>GCP Professional Security Exam Prep</div>
        </div>
      </aside>

      {/* ── Content area ── */}
      <main style={{ flex: 1, minWidth: 0, padding: 28, overflowY: "auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${p.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>{GCP_SUBPAGES.find(sp => sp.id === active).icon}</span>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: p.text, margin: 0 }}>
              {GCP_SUBPAGES.find(sp => sp.id === active).label}
            </h1>
          </div>
        </div>

        <div key={active} style={{ animation: "fadeSlideUp 0.35s ease both" }}>
          <ActiveComp />
        </div>

        {/* Prev / Next */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 20, borderTop: `1px solid ${p.border}` }}>
          {(() => {
            const idx = GCP_SUBPAGES.findIndex(sp => sp.id === active);
            const prev = idx > 0 ? GCP_SUBPAGES[idx - 1] : null;
            const next = idx < GCP_SUBPAGES.length - 1 ? GCP_SUBPAGES[idx + 1] : null;
            return (
              <>
                {prev ? (
                  <button onClick={() => select(prev.id)} style={{
                    background: "transparent", border: `1px solid ${p.border}`, borderRadius: 8,
                    padding: "10px 18px", color: p.textDim, cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                  }}>← {prev.label}</button>
                ) : <div />}
                {next && (
                  <button onClick={() => select(next.id)} style={{
                    background: `${p.accent}15`, border: `1px solid ${p.accent}40`, borderRadius: 8,
                    padding: "10px 18px", color: p.accent, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                  }}>{next.label} →</button>
                )}
              </>
            );
          })()}
        </div>
      </main>
    </div>
  );
}
