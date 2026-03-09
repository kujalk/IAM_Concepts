import { useState } from "react";

/* ─── Palette (light theme) ─── */
const C = {
  bg: "#f8fafc", panel: "#ffffff", panelBorder: "#e2e8f0", panelAlt: "#f1f5f9",
  text: "#1e293b", textDim: "#475569", textMuted: "#94a3b8", line: "#cbd5e1",
  purple: "#7c3aed", blue: "#0284c7", k8s: "#326ce5", green: "#059669",
  red: "#dc2626", amber: "#d97706", orange: "#ea580c", cyan: "#0891b2",
  aws: "#f59e0b", codeBg: "#1e293b", codeText: "#a3e635",
};

/* ─── Shared primitives ─── */
const Tag = ({ children, color = C.purple }) => (
  <span style={{
    padding: "2px 10px", borderRadius: 20,
    background: `${color}18`, border: `1px solid ${color}35`,
    color, fontSize: 11.5, fontWeight: 600,
    display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
  }}>{children}</span>
);

const InfoRow = ({ icon, title, desc, color = C.blue }) => (
  <div style={{
    display: "flex", gap: 12, padding: "10px 14px",
    background: C.panelAlt, borderRadius: 8,
    border: `1px solid ${C.panelBorder}`, marginBottom: 8,
  }}>
    <span style={{ fontSize: 17, flexShrink: 0, marginTop: 2 }}>{icon}</span>
    <div>
      <div style={{ fontWeight: 600, color, fontSize: 13, marginBottom: 2 }}>{title}</div>
      <div style={{ color: C.textDim, fontSize: 12.5, lineHeight: 1.65 }}>{desc}</div>
    </div>
  </div>
);

const CodeBlock = ({ children }) => (
  <pre style={{
    background: C.codeBg, color: C.codeText,
    border: `1px solid ${C.green}40`,
    borderRadius: 8, padding: "12px 16px",
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5,
    lineHeight: 1.7, overflowX: "auto", margin: "8px 0",
  }}>{children}</pre>
);

/* ════════════════════════════════════════
   MIND MAP DATA
════════════════════════════════════════ */
const CX = 410, CY = 260;

const BRANCHES = [
  {
    id: "microservices",
    label: "Microservices",
    icon: "⬡",
    color: C.blue,
    bx: 410, by: 80,
    desc: "Spinnaker is a distributed system of ~9 independent microservices. Each owns a single responsibility and communicates with others via REST APIs.",
    children: [
      { name: "Deck", note: "React SPA — the browser UI" },
      { name: "Gate", note: "API Gateway — single entry point for all clients" },
      { name: "Orca", note: "Pipeline Orchestrator — executes stages" },
      { name: "Clouddriver", note: "Cloud Abstraction — talks to K8s, AWS, GCP" },
      { name: "Igor", note: "CI Bridge — polls Jenkins / GitHub Actions" },
      { name: "Echo", note: "Event Bus — triggers & notifications" },
      { name: "Rosco", note: "Image Bakery — builds AMIs via Packer" },
      { name: "Front50", note: "Persistence — stores pipeline & app definitions" },
      { name: "Fiat", note: "Authorization — RBAC for users & service accounts" },
    ],
    detail: [
      { icon: "🖥", title: "Deck (UI)", text: "React SPA. Talks exclusively to Gate. Provides pipeline editor, live cluster view, and deploy controls." },
      { icon: "🔀", title: "Gate (API Gateway)", text: "The single entry point for all external clients: Deck, the 'spin' CLI, and CI systems. Routes requests to Orca, Clouddriver, Front50, and Fiat." },
      { icon: "⚙", title: "Orca (Orchestrator)", text: "The brain. Receives pipeline execution requests from Gate, reads stage definitions from Front50, and coordinates all services to run each stage in order (or in parallel)." },
      { icon: "☁", title: "Clouddriver (Cloud Provider)", text: "Abstracts ALL cloud providers. Continuously watches K8s clusters and AWS accounts, caches resource state, and performs all cloud mutations (deploy, destroy, resize)." },
      { icon: "🔗", title: "Igor (CI Integration)", text: "Polls Jenkins, Travis CI, GitHub Actions, etc. When a build succeeds, Igor notifies Echo which triggers the appropriate pipeline." },
      { icon: "📣", title: "Echo (Events)", text: "The event backbone. Receives events from Orca and external webhooks. Routes to pipeline triggers and notification channels (Slack, PagerDuty, email)." },
      { icon: "🍞", title: "Rosco (Bakery)", text: "Calls Packer to build AMIs (AWS) or VM images (GCP) before a deploy. Skipped entirely for container/K8s pipelines." },
      { icon: "💾", title: "Front50 (Storage)", text: "Stores pipeline definitions, application metadata, and project configs. Backends: Redis, S3, GCS, or SQL." },
      { icon: "🔐", title: "Fiat (AuthZ)", text: "Enforces RBAC. Controls which users or service accounts can read, execute, or write which pipelines and applications." },
    ],
  },
  {
    id: "kubernetes",
    label: "Kubernetes",
    icon: "☸",
    color: C.k8s,
    bx: 566, by: 170,
    desc: "Spinnaker's Kubernetes V2 provider uses manifest-based deploys. Clouddriver watches cluster state via the K8s watch API and bridges Orca pipeline stages to the Kubernetes API.",
    children: [
      { name: "Apply Manifests", note: "Clouddriver applies YAML via kubectl" },
      { name: "Multi-Cluster", note: "Each K8s cluster = one Spinnaker 'account'" },
      { name: "Resource Watch", note: "Real-time cache of pods, deployments, services" },
      { name: "Artifact Binding", note: "Docker tags injected into manifests at deploy time" },
      { name: "Namespace Targeting", note: "Each deploy stage targets a specific namespace" },
    ],
    detail: [
      { icon: "📄", title: "Manifest-Based (V2)", text: "You supply raw YAML manifests (or Helm charts). Spinnaker does NOT abstract K8s resources — it applies your manifests as-is via Clouddriver → kubectl." },
      { icon: "🔑", title: "Accounts = Clusters", text: "Each cluster is one Spinnaker 'account'. Clouddriver authenticates using a kubeconfig or in-cluster service account token with appropriate RBAC." },
      { icon: "👁", title: "Live Resource Cache", text: "Clouddriver uses the K8s watch API to cache all resources (Pods, Deployments, Services) in near-real-time. Deck shows live cluster state from this cache — not the K8s API directly." },
      { icon: "📦", title: "Artifact System", text: "Docker images, Helm charts, and ConfigMaps are tracked as Spinnaker 'artifacts'. CI passes a new Docker tag → artifact injected into the deploy manifest → Clouddriver applies it." },
      { icon: "🔄", title: "Deploy Flow", text: "CI builds image → Igor/Echo fires pipeline → Orca runs 'Deploy Manifest' stage → Clouddriver calls K8s API → monitors rollout → Deck shows live status." },
    ],
  },
  {
    id: "aws",
    label: "AWS",
    icon: "☁",
    color: C.aws,
    bx: 566, by: 350,
    desc: "Spinnaker's AWS provider uses the AWS SDK via Clouddriver. It manages EC2 Auto Scaling Groups, ECS, Lambda, and Load Balancers across multiple accounts using IAM role assumption.",
    children: [
      { name: "EC2 / ASG", note: "Deploy to Auto Scaling Groups — classic Spinnaker" },
      { name: "ECS", note: "Register task definitions, update ECS services" },
      { name: "Lambda", note: "Deploy & invoke Lambda functions" },
      { name: "Load Balancers", note: "Create/manage ALB/NLB, target groups" },
      { name: "Multi-Account", note: "STS AssumeRole per AWS account" },
    ],
    detail: [
      { icon: "🔑", title: "Multi-Account via STS", text: "Clouddriver assumes an IAM role in each AWS account via STS AssumeRole. No long-lived credentials. Each account = one Spinnaker 'account' with fine-grained isolation." },
      { icon: "🖥", title: "EC2 / ASG Flow", text: "Rosco bakes an AMI → 'Bake' stage emits AMI ID → 'Deploy' stage creates Launch Template + new ASG → Clouddriver registers it with the Load Balancer → old ASG disabled or destroyed." },
      { icon: "📦", title: "ECS", text: "Spinnaker registers a new ECS task definition revision with the updated container image, then updates the ECS service. Clouddriver monitors ECS service stability via the AWS SDK." },
      { icon: "⚡", title: "Lambda", text: "Deploy a function ZIP from S3, update code, publish a new version, and manage aliases (e.g., shift 10% traffic to a new version via weighted alias)." },
      { icon: "⚖", title: "Load Balancers", text: "Clouddriver can create ALBs, NLBs, target groups, and listener rules. For Red/Black, it shifts all traffic to the new ASG target group and deregisters the old one." },
    ],
  },
  {
    id: "strategies",
    label: "Deploy Strategies",
    icon: "⇄",
    color: C.green,
    bx: 410, by: 440,
    desc: "Deployment strategies control how a new server group version replaces the old one. Spinnaker supports multiple strategies natively for both EC2 and Kubernetes.",
    children: [
      { name: "Red/Black", note: "Create new group, shift all traffic, disable old" },
      { name: "Canary", note: "Route small % to new version, compare metrics" },
      { name: "Rolling", note: "Replace instances in batches within same group" },
      { name: "Highlander", note: "Deploy new, destroy ALL older versions" },
      { name: "None", note: "Deploy without automated traffic management" },
    ],
    detail: [
      { icon: "🔴⚫", title: "Red/Black (Blue/Green)", text: "Creates a NEW server group. Once instances pass health checks, ALL traffic shifts to the new group. Old group is disabled (kept for rollback) or destroyed. Zero-downtime, trivial rollback." },
      { icon: "🕯", title: "Canary Analysis", text: "A small 'canary' server group receives a configurable % of production traffic. Spinnaker (via Kayenta) compares metrics (latency p99, error rate) between canary and baseline. Fail → canary destroyed. Pass → full rollout." },
      { icon: "🔄", title: "Rolling", text: "Replaces instances in the SAME server group in batches (e.g., 25% at a time). Lower resource cost than Red/Black but harder to roll back quickly." },
      { icon: "👑", title: "Highlander", text: "'There can be only one.' After the new server group is healthy, ALL previous server groups in the cluster are destroyed. Good for stateless batch jobs." },
    ],
  },
  {
    id: "pipeline",
    label: "Pipeline Stages",
    icon: "▶",
    color: C.red,
    bx: 254, by: 350,
    desc: "A Pipeline is an ordered list of Stages that Orca executes. Stages can run serially or in parallel. Each stage performs one atomic action: bake, deploy, test, approve, notify, or wait.",
    children: [
      { name: "Bake", note: "Build an AMI using Rosco/Packer" },
      { name: "Deploy", note: "Deploy a server group or K8s manifest" },
      { name: "Manual Judgment", note: "Pause, wait for human approval" },
      { name: "Webhook", note: "Call an external HTTP endpoint and poll" },
      { name: "Run Job (K8s)", note: "Run a one-off Kubernetes Job to completion" },
    ],
    detail: [
      { icon: "🍞", title: "Bake", text: "Calls Rosco → runs Packer → builds an AMI. The AMI ID is passed as an artifact to downstream Deploy stages. Skipped entirely for container-based K8s pipelines." },
      { icon: "🚀", title: "Deploy", text: "The core stage. Creates a new server group (ASG for EC2, Deployment for K8s). Supports all deployment strategies. You configure cluster, region, account, capacity, and load balancer." },
      { icon: "🤚", title: "Manual Judgment", text: "Pauses the pipeline indefinitely. Operators approve or reject via Deck UI, the Gate API, or Slack (via Echo integration). The classic production gate — human sign-off required before continuing." },
      { icon: "🔗", title: "Webhook", text: "POSTs a payload to any HTTP endpoint and polls until it returns a success status. Use this to trigger external test suites (Selenium, Gatling) and wait for their results before proceeding." },
      { icon: "🐳", title: "Run Job (K8s)", text: "Deploys a Kubernetes Job manifest and waits for it to complete (exit 0). Ideal for DB migrations, smoke tests, or data seeding before the main Deploy stage." },
      { icon: "⏱", title: "Wait", text: "Sleeps for N seconds. Useful after a deploy to allow metrics to stabilize before running Canary analysis or a health check." },
    ],
  },
  {
    id: "triggers",
    label: "CI Triggers",
    icon: "⚡",
    color: C.amber,
    bx: 254, by: 170,
    desc: "Pipelines are event-driven. They start automatically when a trigger fires — from CI builds, source control events, schedules, message queues, or other Spinnaker pipelines.",
    children: [
      { name: "Jenkins", note: "Igor polls Jenkins, triggers on job completion" },
      { name: "GitHub / GitLab", note: "Webhook on push, tag, or PR merge" },
      { name: "Pub/Sub", note: "GCP Pub/Sub or AWS SNS/SQS" },
      { name: "Cron", note: "Standard cron expression schedule" },
      { name: "Pipeline", note: "One pipeline triggers another on completion" },
    ],
    detail: [
      { icon: "🔧", title: "Jenkins", text: "Igor continuously polls Jenkins for job status. When a configured job succeeds, Igor notifies Echo, which triggers the pipeline and passes the build artifact (AMI ID, Docker tag) through." },
      { icon: "🐙", title: "GitHub / GitLab", text: "Configure a webhook in your repo to POST to Gate on push, PR merge, or tag creation. Echo extracts the branch/tag and artifact info and triggers matching pipelines." },
      { icon: "📨", title: "Pub/Sub", text: "Ideal for GCP (Cloud Build → Pub/Sub) or AWS (CodeBuild → SNS). Spinnaker subscribes to a topic and extracts Docker image metadata from the message payload." },
      { icon: "⏰", title: "Cron", text: "Standard 5-field cron expressions. Useful for scheduled deployments (e.g., push to prod every Tuesday at 2am) or periodic cleanup pipelines." },
      { icon: "🔗", title: "Pipeline Trigger", text: "After Pipeline A finishes, it automatically triggers Pipeline B. Enables multi-stage promotion: dev-pipeline → staging-pipeline → (manual approval) → prod-pipeline." },
    ],
  },
];

/* ════════════════════════════════════════
   MIND MAP SVG
════════════════════════════════════════ */
function MindMap({ selected, onSelect }) {
  const [hovered, setHovered] = useState(null);
  const W = 820, H = 520;
  const RW = 120, RH = 46;

  return (
    <div style={{ background: C.panelAlt, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.panelBorder}` }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <defs>
          <radialGradient id="spkCenterGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9f67ff" />
            <stop offset="100%" stopColor={C.purple} />
          </radialGradient>
          <filter id="spkGlow">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="spkGlowSm">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={W} height={H} fill={C.panelAlt} />

        {/* Connection lines */}
        {BRANCHES.map((b) => {
          const isActive = selected === b.id || hovered === b.id;
          return (
            <line key={b.id}
              x1={CX} y1={CY} x2={b.bx} y2={b.by}
              stroke={isActive ? b.color : C.line}
              strokeWidth={isActive ? 2.5 : 1.5}
              strokeDasharray={isActive ? "none" : "6,4"}
              style={{ transition: "all 0.2s" }}
            />
          );
        })}

        {/* Center node */}
        <circle cx={CX} cy={CY} r={54} fill="url(#spkCenterGrad)" filter="url(#spkGlow)" />
        <circle cx={CX} cy={CY} r={54} fill="none" stroke="#ffffff25" strokeWidth={2} />
        <text x={CX} y={CY - 11} textAnchor="middle" fill="#fff" fontSize={22} dominantBaseline="middle">⚙</text>
        <text x={CX} y={CY + 8} textAnchor="middle" fill="#fff" fontSize={12.5} fontWeight={700} fontFamily="'JetBrains Mono', monospace">Spinnaker</text>
        <text x={CX} y={CY + 24} textAnchor="middle" fill="#ffffff80" fontSize={9.5} fontFamily="'JetBrains Mono', monospace">CD Platform</text>

        {/* Branch nodes */}
        {BRANCHES.map((b) => {
          const isSel = selected === b.id;
          const isHov = hovered === b.id;
          return (
            <g key={b.id}
              onClick={() => onSelect(selected === b.id ? null : b.id)}
              onMouseEnter={() => setHovered(b.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Glow halo on hover/select */}
              {(isSel || isHov) && (
                <rect
                  x={b.bx - RW / 2 - 5} y={b.by - RH / 2 - 5}
                  width={RW + 10} height={RH + 10} rx={11}
                  fill={`${b.color}18`} stroke={b.color}
                  strokeWidth={isSel ? 2 : 1}
                  filter={isSel ? "url(#spkGlowSm)" : "none"}
                  style={{ transition: "all 0.15s" }}
                />
              )}
              {/* Main rect */}
              <rect
                x={b.bx - RW / 2} y={b.by - RH / 2}
                width={RW} height={RH} rx={8}
                fill={isSel ? `${b.color}12` : C.panel}
                stroke={isSel ? b.color : isHov ? `${b.color}80` : C.panelBorder}
                strokeWidth={isSel ? 2 : 1.5}
                style={{ transition: "all 0.15s" }}
              />
              {/* Icon */}
              <text x={b.bx - 22} y={b.by - 7} textAnchor="middle"
                fill={isSel || isHov ? b.color : C.textMuted}
                fontSize={16} dominantBaseline="middle">
                {b.icon}
              </text>
              {/* Label line 1 */}
              <text x={b.bx + 8} y={b.by - 6} textAnchor="middle"
                fill={isSel || isHov ? b.color : C.text}
                fontSize={10.5} fontWeight={isSel || isHov ? 700 : 600}
                fontFamily="'JetBrains Mono', monospace"
                dominantBaseline="middle">
                {b.label.split(" ")[0]}
              </text>
              <text x={b.bx + 8} y={b.by + 9} textAnchor="middle"
                fill={isSel || isHov ? b.color : C.textMuted}
                fontSize={9.5} fontFamily="'JetBrains Mono', monospace"
                dominantBaseline="middle">
                {b.label.split(" ").slice(1).join(" ")}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════
   DETAIL PANEL (below mind map)
════════════════════════════════════════ */
function DetailPanel({ branchId }) {
  const [childSel, setChildSel] = useState(null);
  const b = BRANCHES.find(x => x.id === branchId);

  if (!b) {
    return (
      <div style={{
        minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center",
        color: C.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
        background: C.panel, border: `1px solid ${C.panelBorder}`,
        borderRadius: "0 0 12px 12px", marginTop: -1,
      }}>
        ↑ Click any node in the mind map to explore it
      </div>
    );
  }

  return (
    <div style={{
      background: C.panel, border: `1px solid ${C.panelBorder}`,
      borderTop: `3px solid ${b.color}`,
      borderRadius: "0 0 12px 12px", marginTop: -1,
      padding: "20px 24px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 22 }}>{b.icon}</span>
        <div>
          <div style={{ fontWeight: 700, color: b.color, fontSize: 16 }}>{b.label}</div>
          <div style={{ color: C.textDim, fontSize: 12.5, lineHeight: 1.5 }}>{b.desc}</div>
        </div>
      </div>

      {/* Child pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {b.children.map((ch) => (
          <button key={ch.name}
            onClick={() => setChildSel(childSel === ch.name ? null : ch.name)}
            style={{
              padding: "4px 12px", borderRadius: 20, cursor: "pointer",
              background: childSel === ch.name ? `${b.color}20` : C.panelAlt,
              border: `1px solid ${childSel === ch.name ? b.color : C.panelBorder}`,
              color: childSel === ch.name ? b.color : C.text,
              fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {ch.name}
          </button>
        ))}
      </div>

      {/* Selected child note */}
      {childSel && (() => {
        const ch = b.children.find(x => x.name === childSel);
        return ch ? (
          <div style={{
            background: `${b.color}0e`, border: `1px solid ${b.color}30`,
            borderRadius: 8, padding: "10px 14px", marginBottom: 14,
            color: C.text, fontSize: 13, lineHeight: 1.6,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <strong style={{ color: b.color }}>{ch.name}:</strong> {ch.note}
          </div>
        ) : null;
      })()}

      {/* Detail items */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 8 }}>
        {b.detail.map((d, i) => (
          <div key={i} style={{
            background: C.panelAlt, borderRadius: 8,
            border: `1px solid ${C.panelBorder}`, padding: "10px 14px",
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{d.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: b.color, fontSize: 12.5, marginBottom: 3 }}>{d.title}</div>
                <div style={{ color: C.textDim, fontSize: 12, lineHeight: 1.6 }}>{d.text}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TAB 1 — MIND MAP
════════════════════════════════════════ */
function TabMindMap() {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      {/* Intro */}
      <div style={{
        background: `${C.purple}0c`, border: `1px solid ${C.purple}25`,
        borderRadius: 10, padding: "14px 18px", marginBottom: 20,
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>⚙</span>
        <div>
          <div style={{ fontWeight: 700, color: C.purple, fontSize: 14, marginBottom: 4 }}>
            What is Spinnaker?
          </div>
          <div style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7 }}>
            Spinnaker is an open-source, multi-cloud <strong>Continuous Delivery</strong> platform originally built by Netflix.
            It is NOT a CI tool — it does not compile or test code. Instead, it takes artifacts produced by CI (Docker images, AMIs)
            and safely deploys them to cloud targets using advanced strategies like Red/Black and Canary.
            It supports Kubernetes, AWS, GCP, Azure, and more through pluggable cloud provider adapters.
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Tag color={C.purple}>CD (not CI)</Tag>
            <Tag color={C.k8s}>Kubernetes</Tag>
            <Tag color={C.aws}>AWS</Tag>
            <Tag color={C.green}>Multi-Cloud</Tag>
            <Tag color={C.blue}>Netflix OSS</Tag>
          </div>
        </div>
      </div>

      {/* Mind Map + Detail Panel */}
      <MindMap selected={selected} onSelect={setSelected} />
      <DetailPanel branchId={selected} />
    </div>
  );
}

/* ════════════════════════════════════════
   TAB 2 — KUBERNETES INTEGRATION
════════════════════════════════════════ */
function TabKubernetes() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Flow diagram */}
      <div>
        <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 14, borderLeft: `3px solid ${C.k8s}`, paddingLeft: 10 }}>
          End-to-End Deploy Flow
        </h3>
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "flex", alignItems: "stretch", gap: 0, minWidth: 720 }}>
            {[
              { icon: "🔧", label: "CI System", sub: "Jenkins / GitHub Actions", color: C.amber },
              { icon: "→", label: "", sub: "artifact", color: C.line, arrow: true },
              { icon: "🔗", label: "Igor / Echo", sub: "detects build, triggers pipeline", color: C.orange },
              { icon: "→", label: "", sub: "start", color: C.line, arrow: true },
              { icon: "⚙", label: "Orca", sub: "orchestrates stages", color: C.blue },
              { icon: "→", label: "", sub: "deploy cmd", color: C.line, arrow: true },
              { icon: "☁", label: "Clouddriver", sub: "calls K8s API", color: C.k8s },
              { icon: "→", label: "", sub: "manifest", color: C.line, arrow: true },
              { icon: "☸", label: "Kubernetes", sub: "creates pods, rollout", color: C.green },
            ].map((item, i) => (
              item.arrow ? (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                  <span style={{ fontSize: 18, color: C.textMuted }}>→</span>
                  <span style={{ fontSize: 9.5, color: C.textMuted, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>{item.sub}</span>
                </div>
              ) : (
                <div key={i} style={{ flex: 1, background: `${item.color}10`, border: `1.5px solid ${item.color}40`, borderRadius: 8, padding: "10px 12px", textAlign: "center", minWidth: 90 }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, color: item.color, fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</div>
                  <div style={{ color: C.textMuted, fontSize: 10, lineHeight: 1.4, marginTop: 3 }}>{item.sub}</div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Account setup */}
      <div>
        <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 12, borderLeft: `3px solid ${C.k8s}`, paddingLeft: 10 }}>
          Account Configuration
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <InfoRow icon="🔑" title="kubeconfig Authentication" color={C.k8s}
            desc="Each K8s cluster is registered as a Spinnaker account. Clouddriver reads a kubeconfig file (or uses an in-cluster service account token) to authenticate against the API server." />
          <InfoRow icon="🏷" title="One Account per Cluster" color={C.k8s}
            desc="Prod cluster, staging cluster, and dev cluster are three separate Spinnaker accounts. Pipelines target a specific account + namespace combination." />
          <InfoRow icon="🔐" title="K8s RBAC Required" color={C.k8s}
            desc="The Clouddriver service account needs RBAC permissions: get/list/watch on all resource types it needs to cache, plus create/update/delete for deploy targets." />
          <InfoRow icon="📡" title="Watch API for Live State" color={C.k8s}
            desc="Clouddriver establishes a long-lived watch connection to the K8s API server. Changes to pods, deployments, and services update the cache in near-real-time and appear in the Deck UI." />
        </div>
      </div>

      {/* Manifest pipeline example */}
      <div>
        <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 10, borderLeft: `3px solid ${C.k8s}`, paddingLeft: 10 }}>
          Example Pipeline YAML (simplified)
        </h3>
        <CodeBlock>{`stages:
  - type: deployManifest          # Stage 1: Deploy
    name: "Deploy to Staging"
    account: "staging-k8s"        # Spinnaker K8s account
    namespace: "app-staging"
    manifests:
      - apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: my-app
        spec:
          replicas: 3
          template:
            spec:
              containers:
                - name: app
                  image: "\${ #stage('Find Image').context.image }"

  - type: manualJudgment           # Stage 2: Wait for approval
    name: "Approve prod deploy?"

  - type: deployManifest           # Stage 3: Deploy to prod
    name: "Deploy to Prod"
    account: "prod-k8s"
    namespace: "app-prod"`}</CodeBlock>
      </div>

      {/* Red/Black for K8s */}
      <div>
        <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 12, borderLeft: `3px solid ${C.k8s}`, paddingLeft: 10 }}>
          Red/Black on Kubernetes
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { step: "1", label: "New ReplicaSet Created", desc: "Spinnaker creates a new Deployment/ReplicaSet with the updated image. Both old and new pods co-exist briefly.", color: C.blue },
            { step: "2", label: "Health Check", desc: "Clouddriver polls the K8s rollout status. Waits until all new pods are Ready before proceeding.", color: C.amber },
            { step: "3", label: "Old RS Scaled to 0", desc: "Once new pods are healthy, Spinnaker scales the OLD ReplicaSet to 0 replicas (disabled, not deleted — kept for rollback).", color: C.green },
          ].map((s) => (
            <div key={s.step} style={{
              background: `${s.color}0c`, border: `1px solid ${s.color}30`,
              borderRadius: 8, padding: "12px 14px",
            }}>
              <div style={{ fontWeight: 700, color: s.color, fontSize: 22, marginBottom: 6 }}>{s.step}</div>
              <div style={{ fontWeight: 700, color: C.text, fontSize: 12.5, marginBottom: 5 }}>{s.label}</div>
              <div style={{ color: C.textDim, fontSize: 12, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TAB 3 — AWS INTEGRATION
════════════════════════════════════════ */
function TabAWS() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Multi-account model */}
      <div>
        <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 12, borderLeft: `3px solid ${C.aws}`, paddingLeft: 10 }}>
          Multi-Account Architecture
        </h3>
        <div style={{ background: C.panelAlt, border: `1px solid ${C.panelBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", flexWrap: "wrap", gap: 12 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ background: `${C.purple}15`, border: `2px solid ${C.purple}`, borderRadius: 8, padding: "10px 16px", marginBottom: 6 }}>
                <div style={{ fontSize: 18 }}>☁</div>
                <div style={{ fontWeight: 700, color: C.purple, fontSize: 12 }}>Clouddriver</div>
                <div style={{ color: C.textMuted, fontSize: 10 }}>Spinnaker service</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Dev Account", color: C.green, id: "123456" },
                { label: "Staging Account", color: C.amber, id: "234567" },
                { label: "Prod Account", color: C.red, id: "345678" },
              ].map((acc) => (
                <div key={acc.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: C.textMuted, fontSize: 12 }}>STS AssumeRole →</span>
                  <div style={{
                    background: `${acc.color}10`, border: `1.5px solid ${acc.color}40`,
                    borderRadius: 6, padding: "6px 12px", minWidth: 140,
                  }}>
                    <div style={{ fontWeight: 700, color: acc.color, fontSize: 11.5 }}>{acc.label}</div>
                    <div style={{ color: C.textMuted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>AWS {acc.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ color: C.textDim, fontSize: 12, marginTop: 12, lineHeight: 1.6 }}>
            Clouddriver assumes a separate IAM role in each AWS account. No long-lived access keys needed.
            Each account is a Spinnaker "account" — pipelines target a specific account + region.
          </div>
        </div>
      </div>

      {/* EC2 deploy flow */}
      <div>
        <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 12, borderLeft: `3px solid ${C.aws}`, paddingLeft: 10 }}>
          Classic EC2 Deploy Flow (Red/Black)
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { n: 1, icon: "🍞", label: "Bake AMI", desc: "Rosco calls Packer to build an AMI with the new application artifact baked in. The AMI ID is stored as a pipeline artifact." },
            { n: 2, icon: "📋", label: "Create Launch Template", desc: "Clouddriver creates a new EC2 Launch Template using the baked AMI ID. The template defines instance type, IAM role, user-data, and security groups." },
            { n: 3, icon: "🖥", label: "Create New ASG", desc: "Clouddriver creates a new Auto Scaling Group using the Launch Template. It waits until the configured number of instances pass all health checks (EC2 + ELB)." },
            { n: 4, icon: "⚖", label: "Register with Load Balancer", desc: "Clouddriver registers the new ASG's instances with the target group. The Load Balancer starts routing traffic to new instances." },
            { n: 5, icon: "🔴", label: "Disable Old ASG", desc: "Once new instances are healthy, the old ASG is deregistered from the Load Balancer. It is left at scale (for rollback) or destroyed, depending on strategy config." },
          ].map((s) => (
            <div key={s.n} style={{
              display: "flex", gap: 14, background: C.panelAlt,
              border: `1px solid ${C.panelBorder}`, borderRadius: 8, padding: "12px 16px",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: `${C.aws}20`, border: `2px solid ${C.aws}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, color: C.aws, fontSize: 12, flexShrink: 0,
              }}>{s.n}</div>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                  <span>{s.icon}</span>
                  <span style={{ fontWeight: 700, color: C.text, fontSize: 13 }}>{s.label}</span>
                </div>
                <div style={{ color: C.textDim, fontSize: 12.5, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ECS + Lambda quick cards */}
      <div>
        <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 12, borderLeft: `3px solid ${C.aws}`, paddingLeft: 10 }}>
          ECS & Lambda
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: `${C.blue}08`, border: `1px solid ${C.blue}25`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontWeight: 700, color: C.blue, fontSize: 13.5, marginBottom: 8 }}>📦 ECS Flow</div>
            {["1. New task definition revision registered", "2. ECS Service updated to new revision", "3. ECS performs rolling replacement of tasks", "4. Clouddriver monitors service stability", "5. Old task definition revision kept (rollback)"].map((s, i) => (
              <div key={i} style={{ color: C.textDim, fontSize: 12, lineHeight: 1.7 }}>• {s}</div>
            ))}
          </div>
          <div style={{ background: `${C.amber}08`, border: `1px solid ${C.amber}25`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontWeight: 700, color: C.amber, fontSize: 13.5, marginBottom: 8 }}>⚡ Lambda Flow</div>
            {["1. Function code ZIP uploaded to S3", "2. Spinnaker calls UpdateFunctionCode", "3. New function version published", "4. Alias updated to point at new version", "5. Traffic shifting via weighted alias (canary)"].map((s, i) => (
              <div key={i} style={{ color: C.textDim, fontSize: 12, lineHeight: 1.7 }}>• {s}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TAB 4 — PIPELINES & STRATEGIES
════════════════════════════════════════ */
function TabPipelines() {
  const [stratSel, setStratSel] = useState("redblack");

  const STRATS = {
    redblack: {
      label: "Red/Black (Blue/Green)",
      color: C.red,
      steps: [
        { label: "Create new server group", desc: "New ASG or K8s Deployment with updated version. Old group still live and serving traffic." },
        { label: "Health check", desc: "Wait until all new instances/pods pass health checks. No traffic yet." },
        { label: "Shift all traffic", desc: "Load Balancer target group updated to point entirely at new server group." },
        { label: "Disable old", desc: "Old server group deregistered (kept at scale for instant rollback, or destroyed)." },
      ],
      pros: "Zero downtime. Instant rollback (just re-enable old group). Simple to reason about.",
      cons: "Requires 2× capacity during the switch. No gradual traffic shifting.",
    },
    canary: {
      label: "Canary Analysis",
      color: C.amber,
      steps: [
        { label: "Deploy canary group", desc: "A small server group (1-5% of capacity) is deployed with the new version." },
        { label: "Route canary traffic", desc: "A small percentage of production traffic is directed to the canary group." },
        { label: "Metric comparison", desc: "Kayenta compares key metrics (latency, error rate) between canary and baseline over a configured window." },
        { label: "Auto decision", desc: "Pass: full rollout continues. Fail: canary destroyed, old version stays. No human needed." },
      ],
      pros: "Automated safety net. Real production traffic validates the new version before full rollout.",
      cons: "Requires metric infrastructure (Prometheus, Datadog, Stackdriver). Some users see degraded experience during canary.",
    },
    rolling: {
      label: "Rolling Update",
      color: C.green,
      steps: [
        { label: "Select batch size", desc: "Configure what % of instances to replace at once (e.g., 25%)." },
        { label: "Replace first batch", desc: "N instances terminated, replaced with new version. Traffic served by remaining old instances." },
        { label: "Repeat", desc: "Next batch replaced once previous batch is healthy. Continues until all instances updated." },
        { label: "Complete", desc: "All instances running new version. Old version gone entirely." },
      ],
      pros: "Lower resource cost (no 2× capacity). Gradual rollout.",
      cons: "Both versions serve traffic simultaneously. Rollback requires another full rolling update (slow).",
    },
    highlander: {
      label: "Highlander",
      color: C.purple,
      steps: [
        { label: "Deploy new group", desc: "New server group created with new version. Old groups still live." },
        { label: "Health check", desc: "New group must be fully healthy before proceeding." },
        { label: "Destroy ALL old groups", desc: "Every previous server group in the cluster is destroyed — not just disabled. There can be only one." },
      ],
      pros: "Clean state. No orphaned old versions accumulating. Good for batch jobs or crons.",
      cons: "No built-in rollback path. Irreversible without a new deploy.",
    },
  };

  const s = STRATS[stratSel];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Pipeline anatomy */}
      <div>
        <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 12, borderLeft: `3px solid ${C.purple}`, paddingLeft: 10 }}>
          Pipeline Anatomy
        </h3>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", overflowX: "auto", paddingBottom: 8 }}>
          {[
            { icon: "⚡", label: "Trigger", sub: "Jenkins / Git / Cron / Webhook", color: C.amber },
            { sep: true },
            { icon: "🍞", label: "Bake", sub: "Build AMI (EC2 only)", color: C.orange },
            { sep: true },
            { icon: "🚀", label: "Deploy", sub: "Create server group", color: C.blue },
            { sep: true },
            { icon: "🤚", label: "Judgment", sub: "Human approval gate", color: C.red },
            { sep: true },
            { icon: "🚀", label: "Deploy Prod", sub: "Production target", color: C.k8s },
            { sep: true },
            { icon: "📣", label: "Notify", sub: "Slack / PagerDuty", color: C.green },
          ].map((item, i) =>
            item.sep ? (
              <div key={i} style={{ display: "flex", alignItems: "center", paddingTop: 14 }}>
                <span style={{ color: C.textMuted, fontSize: 20 }}>→</span>
              </div>
            ) : (
              <div key={i} style={{
                background: `${item.color}10`, border: `1.5px solid ${item.color}40`,
                borderRadius: 8, padding: "10px 12px", textAlign: "center", minWidth: 90, flexShrink: 0,
              }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, color: item.color, fontSize: 11 }}>{item.label}</div>
                <div style={{ color: C.textMuted, fontSize: 9.5, marginTop: 2 }}>{item.sub}</div>
              </div>
            )
          )}
        </div>
        <div style={{ color: C.textMuted, fontSize: 11.5, marginTop: 6, fontStyle: "italic" }}>
          Stages can run in parallel. Orca uses a DAG to resolve dependencies between stages.
        </div>
      </div>

      {/* Strategy selector */}
      <div>
        <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 12, borderLeft: `3px solid ${C.green}`, paddingLeft: 10 }}>
          Deployment Strategies
        </h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {Object.entries(STRATS).map(([id, st]) => (
            <button key={id}
              onClick={() => setStratSel(id)}
              style={{
                padding: "6px 16px", borderRadius: 20, cursor: "pointer",
                background: stratSel === id ? `${st.color}20` : C.panelAlt,
                border: `1.5px solid ${stratSel === id ? st.color : C.panelBorder}`,
                color: stratSel === id ? st.color : C.textDim,
                fontSize: 12.5, fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Strategy detail */}
        <div style={{ border: `1.5px solid ${s.color}30`, borderTop: `3px solid ${s.color}`, borderRadius: "0 8px 8px 8px", padding: "16px 18px", background: C.panel }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            {s.steps.map((st, i) => (
              <div key={i} style={{
                background: `${s.color}08`, border: `1px solid ${s.color}20`,
                borderRadius: 7, padding: "10px 13px",
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: `${s.color}20`, border: `1.5px solid ${s.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, color: s.color, fontSize: 11, flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ fontWeight: 700, color: C.text, fontSize: 12.5 }}>{st.label}</span>
                </div>
                <div style={{ color: C.textDim, fontSize: 12, lineHeight: 1.6, paddingLeft: 30 }}>{st.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: `${C.green}0c`, border: `1px solid ${C.green}25`, borderRadius: 7, padding: "10px 13px" }}>
              <div style={{ fontWeight: 700, color: C.green, fontSize: 12, marginBottom: 4 }}>✓ Pros</div>
              <div style={{ color: C.textDim, fontSize: 12, lineHeight: 1.6 }}>{s.pros}</div>
            </div>
            <div style={{ background: `${C.red}0c`, border: `1px solid ${C.red}25`, borderRadius: 7, padding: "10px 13px" }}>
              <div style={{ fontWeight: 700, color: C.red, fontSize: 12, marginBottom: 4 }}>✗ Cons</div>
              <div style={{ color: C.textDim, fontSize: 12, lineHeight: 1.6 }}>{s.cons}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key stage reference */}
      <div>
        <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 12, borderLeft: `3px solid ${C.blue}`, paddingLeft: 10 }}>
          Key Stage Reference
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
          {[
            { icon: "🍞", name: "Bake", color: C.orange, desc: "Calls Rosco → Packer to build an AMI. Emits AMI ID as artifact for downstream Deploy stages. K8s pipelines skip this." },
            { icon: "🚀", name: "Deploy", color: C.blue, desc: "Creates a server group (ASG or K8s Deployment). The strategy (Red/Black, Canary, Rolling) is configured per-stage." },
            { icon: "🤚", name: "Manual Judgment", color: C.red, desc: "Pauses the pipeline. Operators approve via Deck UI, Gate API, or Slack. Classic production gate." },
            { icon: "🔗", name: "Webhook", color: C.cyan, desc: "POSTs to an HTTP endpoint and polls for success. Trigger external tests, wait for results." },
            { icon: "🐳", name: "Run Job (K8s)", color: C.k8s, desc: "Deploys a K8s Job and waits for completion. DB migrations, smoke tests, data seeding." },
            { icon: "🔍", name: "Find Artifact", color: C.purple, desc: "Queries a registry (ECR, GCR) for the latest Docker tag matching a pattern. Chains into Deploy." },
            { icon: "⏱", name: "Wait", color: C.textMuted, desc: "Sleep N seconds. Lets metrics stabilize before Canary analysis or a follow-up health check." },
            { icon: "🔀", name: "Pipeline Stage", color: C.green, desc: "Trigger another Spinnaker pipeline and optionally wait for it to complete. Enables promotion flows." },
          ].map((st) => (
            <div key={st.name} style={{
              background: C.panelAlt, border: `1px solid ${C.panelBorder}`,
              borderLeft: `3px solid ${st.color}`, borderRadius: "0 8px 8px 0",
              padding: "10px 14px",
            }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{st.icon}</span>
                <span style={{ fontWeight: 700, color: st.color, fontSize: 13 }}>{st.name}</span>
              </div>
              <div style={{ color: C.textDim, fontSize: 12, lineHeight: 1.6 }}>{st.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   ROOT COMPONENT
════════════════════════════════════════ */
const TABS = [
  { id: "mindmap", label: "Mind Map", icon: "◉" },
  { id: "kubernetes", label: "Kubernetes", icon: "☸" },
  { id: "aws", label: "AWS", icon: "☁" },
  { id: "pipelines", label: "Pipelines", icon: "▶" },
];

export default function SpinnakerGuide() {
  const [tab, setTab] = useState("mindmap");

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>🔱</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.text }}>Spinnaker</h1>
              <div style={{ color: C.textDim, fontSize: 14, marginTop: 2 }}>
                Multi-Cloud Continuous Delivery Platform — Architecture, Kubernetes & AWS Integration
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Tag color={C.purple}>CD Platform</Tag>
            <Tag color={C.k8s}>Kubernetes</Tag>
            <Tag color={C.aws}>AWS</Tag>
            <Tag color={C.blue}>9 Microservices</Tag>
            <Tag color={C.green}>Multi-Cloud</Tag>
          </div>
        </div>

        {/* Tab nav */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `2px solid ${C.panelBorder}` }}>
          {TABS.map((t) => (
            <button key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "8px 18px", border: "none", cursor: "pointer",
                background: "transparent",
                borderBottom: tab === t.id ? `2px solid ${C.purple}` : "2px solid transparent",
                color: tab === t.id ? C.purple : C.textDim,
                fontWeight: tab === t.id ? 700 : 500,
                fontSize: 13.5, marginBottom: -2,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "mindmap" && <TabMindMap />}
        {tab === "kubernetes" && <TabKubernetes />}
        {tab === "aws" && <TabAWS />}
        {tab === "pipelines" && <TabPipelines />}
      </div>
    </div>
  );
}
