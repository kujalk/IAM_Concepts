import { useState } from "react";

const COLORS = {
  bg: "#0a0f1a",
  card: "#111827",
  cardHover: "#1a2332",
  border: "#1e293b",
  accent: "#22d3ee",
  accentDim: "#0e7490",
  green: "#34d399",
  amber: "#fbbf24",
  red: "#f87171",
  purple: "#a78bfa",
  pink: "#f472b6",
  blue: "#60a5fa",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textMuted: "#64748b",
};

const keyTypes = [
  {
    id: "gmek",
    name: "GMEK",
    fullName: "Google-Managed Encryption Keys",
    color: COLORS.green,
    icon: "🔒",
    control: "Google",
    tagline: "Default — zero config, zero cost",
    summary:
      "Every byte stored in GCP is encrypted at rest automatically using AES-256, with no action required from you. Google owns, rotates, and manages the entire key hierarchy.",
    howItWorks: [
      "Each data chunk gets a unique Data Encryption Key (DEK)",
      "DEKs are wrapped by Key Encryption Keys (KEKs) managed by Google",
      "KEKs are stored in Google's central KMS infrastructure",
      "Automatic key rotation — no customer intervention needed",
      "Even two chunks of the same object get different DEKs",
      "Re-encryption happens on every data update with a fresh key",
    ],
    services: "All GCP services — Cloud Storage, Compute Engine, BigQuery, Cloud SQL, Spanner, GKE, and every other service",
    pros: ["Zero configuration required", "No additional cost", "Automatic rotation", "Cannot be accidentally deleted by customer", "Covers all GCP services universally"],
    cons: ["No customer control over key lifecycle", "Cannot audit key usage independently", "Cannot revoke access via key destruction (crypto-shredding)", "May not satisfy strict compliance frameworks (HIPAA, PCI-DSS, etc.)"],
    bestFor: "Dev/test environments, non-regulated workloads, teams that want security without operational overhead",
  },
  {
    id: "cmek",
    name: "CMEK",
    fullName: "Customer-Managed Encryption Keys",
    color: COLORS.accent,
    icon: "🔑",
    control: "Customer (via Cloud KMS)",
    tagline: "You own the keys, Google does the crypto",
    summary:
      "You create and manage encryption keys in Cloud KMS. Google services use your keys to encrypt/decrypt data transparently. You control rotation, access policies, and can destroy keys to make data permanently unreadable (crypto-shredding).",
    howItWorks: [
      "You create a Key Ring and CryptoKey in Cloud KMS",
      "Grant the service agent (e.g., GCS, BigQuery) the Encrypter/Decrypter IAM role",
      "The service generates a DEK, encrypts your data, then wraps the DEK with your KEK",
      "On read, the service calls Cloud KMS to unwrap the DEK, then decrypts data",
      "All key operations are logged in Cloud Audit Logs",
      "You control rotation schedule, region, and access policies",
    ],
    services: "Cloud Storage, BigQuery, Cloud SQL, Cloud Spanner, GKE, Compute Engine disks, Dataproc, Cloud Functions, Pub/Sub, and 30+ more services",
    pros: [
      "Full control over key lifecycle (create, rotate, disable, destroy)",
      "Crypto-shredding — destroy the key, data is gone forever",
      "Audit trail for every key operation via Cloud Audit Logs",
      "Key-data location alignment (key region must match data region)",
      "Autokey feature simplifies provisioning",
      "Supports importing your own key material",
    ],
    cons: [
      "Costs: per key version + per cryptographic operation",
      "Operational responsibility — disabling/deleting a key = data loss",
      "Key ring region must match bucket/resource region",
      "Cannot change encryption type after resource creation (e.g., Cloud SQL)",
      "Requires IAM setup for each service agent",
    ],
    bestFor: "Regulated industries (finance, healthcare), organizations needing audit trails, compliance with HIPAA/PCI-DSS/SOC2, data sovereignty requirements",
  },
  {
    id: "csek",
    name: "CSEK",
    fullName: "Customer-Supplied Encryption Keys",
    color: COLORS.amber,
    icon: "🗝️",
    control: "Customer (fully external)",
    tagline: "You bring the key to every single operation",
    summary:
      "You generate and store AES-256 keys entirely outside of Google. You supply the raw key on every API call. Google uses it in-memory, never stores it. If you lose the key, your data is gone forever — Google cannot help you recover it.",
    howItWorks: [
      "You generate a Base64-encoded AES-256 key externally",
      "On every upload/download, you pass the key in the API request header",
      "Google uses the key in-memory to encrypt/decrypt, then discards it",
      "A SHA-256 hash of the key is stored as object metadata for verification",
      "The hash cannot be reversed — it only confirms you have the right key",
      "Rotation requires rewriting every object with the new key manually",
    ],
    services: "Cloud Storage (object-level only, not bucket-level) and Compute Engine persistent disks only",
    pros: [
      "Maximum control — Google never stores your key material",
      "Keys never persist in Google infrastructure",
      "Satisfies strictest compliance: you are sole custodian",
      "No Cloud KMS costs",
    ],
    cons: [
      "Extremely high operational burden — key on every API call",
      "Cannot use Google Cloud Console for uploads/downloads",
      "Only CLI (gsutil) or API access",
      "No automated rotation — must rewrite all objects manually",
      "Lose the key = permanent, irrecoverable data loss",
      "Not available in India and Brazil GCP projects",
      "Only 2 services supported (GCS and Compute Engine)",
    ],
    bestFor: "Strict regulatory mandates requiring customer-held key material, air-gapped security models, organizations with mature key management infrastructure",
  },
  {
    id: "ekm",
    name: "EKM",
    fullName: "External Key Manager",
    color: COLORS.purple,
    icon: "🏛️",
    control: "Customer (3rd-party KMS outside GCP)",
    tagline: "Keys never touch Google — ultimate separation",
    summary:
      "Your encryption keys live in a third-party KMS (Thales, Fortanix, etc.) outside Google's infrastructure entirely. Cloud KMS references the external key via a URI but never stores the key material. Combined with Key Access Justifications, you can approve/deny every decryption request.",
    howItWorks: [
      "Deploy an external KMS (Fortanix DSM, Thales CipherTrust, etc.)",
      "Create a Cloud EKM key in Cloud KMS that references the external key URI",
      "When GCP needs to decrypt, it calls your external KMS in real-time",
      "The external key material never enters Google's infrastructure",
      "Key Access Justifications show WHY Google is requesting decryption",
      "You can revoke access instantly from your external KMS (kill switch)",
    ],
    services: "BigQuery, Compute Engine persistent disks, Cloud Storage, GKE, and 20+ CMEK-integrated services via Cloud KMS",
    pros: [
      "Complete separation of data and keys",
      "Keys never stored or cached in Google Cloud",
      "Kill switch — revoke access instantly",
      "Key Access Justifications for full visibility",
      "Satisfies Schrems II, GDPR, and sovereign data requirements",
      "Protects against government compulsion (Cloud Act concerns)",
    ],
    cons: [
      "Latency — every crypto operation calls external KMS",
      "Availability dependency — if external KMS is down, data is inaccessible",
      "Complex setup and ongoing management",
      "Requires network connectivity between GCP and external KMS",
      "Higher cost (external KMS licensing + Cloud KMS fees)",
      "Disaster recovery complexity — losing external KMS = losing data",
    ],
    bestFor: "European data sovereignty (Schrems II), government/defense, financial institutions with regulatory mandates, organizations that cannot trust any cloud provider with key material",
  },
  {
    id: "cc",
    name: "Confidential Computing",
    fullName: "Encryption In-Use (Confidential VMs + EKM UDE)",
    color: COLORS.pink,
    icon: "🛡️",
    control: "Hardware TEE + Customer",
    tagline: "Data encrypted even while being processed",
    summary:
      "Confidential Computing protects data while it's being processed in memory using hardware-based Trusted Execution Environments (TEEs). Combined with EKM UDE (Ubiquitous Data Encryption), you can ensure that only attested Confidential VMs can unwrap your keys.",
    howItWorks: [
      "Confidential VMs use AMD SEV or Intel TDX to encrypt memory in hardware",
      "The hypervisor and host OS cannot read the VM's memory",
      "EKM UDE extends this: external KMS wraps DEKs so only attested Confidential VMs can unwrap them",
      "Attestation verifies the VM's runtime environment before granting key access",
      "Four modes: encrypt + decrypt in CVM, encrypt in CVM/decrypt anywhere, encrypt anywhere/decrypt in CVM, or no CVM requirement",
      "Provides data-at-rest + data-in-transit + data-in-use protection",
    ],
    services: "Compute Engine (Confidential VMs), GKE (Confidential Nodes), Dataproc, Dataflow, and expanding",
    pros: [
      "Protects data in memory — the last frontier of encryption",
      "Hardware-enforced isolation (not just software)",
      "Independently verifiable attestation",
      "Combined with EKM, creates zero-trust compute",
      "Protects against insider threats and compromised hosts",
    ],
    cons: [
      "Performance overhead from memory encryption",
      "Limited to specific VM types and machine families",
      "Higher compute costs",
      "Complex architecture with EKM UDE",
      "Relatively new — not all services supported yet",
    ],
    bestFor: "Multi-party computation, processing sensitive healthcare/financial data, zero-trust architectures, regulated ML/AI workloads with sensitive training data",
  },
];

const envelopeSteps = [
  { label: "Plaintext Data", desc: "Your raw data (file, DB row, disk block)", color: COLORS.blue, icon: "📄" },
  { label: "DEK Generated", desc: "A unique AES-256 Data Encryption Key is created per chunk", color: COLORS.green, icon: "🔐" },
  { label: "Data Encrypted", desc: "DEK encrypts the data → ciphertext stored on disk", color: COLORS.accent, icon: "🔒" },
  { label: "DEK Wrapped", desc: "The DEK itself is encrypted by a Key Encryption Key (KEK)", color: COLORS.purple, icon: "🗝️" },
  { label: "KEK Secured", desc: "KEK is stored in Cloud KMS, HSM, or external KMS depending on your strategy", color: COLORS.pink, icon: "🏛️" },
];

const comparisonMatrix = [
  { feature: "Who holds the key?", gmek: "Google", cmek: "You (in Cloud KMS)", csek: "You (outside GCP)", ekm: "You (3rd-party KMS)" },
  { feature: "Key stored in GCP?", gmek: "Yes", cmek: "Yes (Cloud KMS)", csek: "No (in-memory only)", ekm: "No (never)" },
  { feature: "Crypto-shredding?", gmek: "No", cmek: "Yes", csek: "Yes (delete your key)", ekm: "Yes (revoke in ext. KMS)" },
  { feature: "Audit logging?", gmek: "Limited", cmek: "Full (Cloud Audit)", csek: "Client-side only", ekm: "Full (both sides)" },
  { feature: "Auto key rotation?", gmek: "Yes", cmek: "Configurable", csek: "Manual only", ekm: "Via external KMS" },
  { feature: "Service breadth", gmek: "All services", cmek: "30+ services", csek: "2 services", ekm: "20+ services" },
  { feature: "Console support?", gmek: "Full", cmek: "Full", csek: "No (CLI/API only)", ekm: "Partial" },
  { feature: "Additional cost?", gmek: "None", cmek: "KMS fees", csek: "None (GCP side)", ekm: "KMS + external KMS" },
  { feature: "Compliance level", gmek: "Basic", cmek: "High", csek: "Highest", ekm: "Highest" },
  { feature: "Operational burden", gmek: "None", cmek: "Low–Medium", csek: "Very High", ekm: "High" },
];

const transitMethods = [
  { name: "TLS/HTTPS", desc: "All GCP APIs enforce TLS 1.2+ by default. Data between your browser/app and Google Front End is always encrypted.", icon: "🌐" },
  { name: "ALTS", desc: "Application Layer Transport Security — Google's internal mutual-auth protocol for service-to-service communication within data centers.", icon: "🔄" },
  { name: "VPN / Interconnect", desc: "Cloud VPN (IPsec) and Dedicated/Partner Interconnect encrypt data between on-prem and GCP over private or public networks.", icon: "🔗" },
  { name: "mTLS & Service Mesh", desc: "Istio/Anthos Service Mesh enables mutual TLS between microservices in GKE for zero-trust networking.", icon: "🕸️" },
];

function Badge({ children, color }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.05em",
        background: color + "22",
        color: color,
        border: `1px solid ${color}44`,
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: COLORS.text,
          margin: 0,
          letterSpacing: "-0.02em",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: COLORS.textDim, fontSize: 14, margin: "6px 0 20px", lineHeight: 1.5 }}>
          {subtitle}
        </p>
      )}
      {!subtitle && <div style={{ height: 16 }} />}
      {children}
    </div>
  );
}

function EnvelopeAnimation() {
  const [step, setStep] = useState(0);
  return (
    <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 28, marginBottom: 8 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {envelopeSteps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: `1px solid ${i === step ? s.color : COLORS.border}`,
              background: i === step ? s.color + "18" : "transparent",
              color: i === step ? s.color : COLORS.textDim,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              transition: "all 0.2s",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: 24,
          background: envelopeSteps[step].color + "08",
          borderRadius: 12,
          border: `1px solid ${envelopeSteps[step].color}33`,
          transition: "all 0.3s",
        }}
      >
        <div style={{ fontSize: 40, flexShrink: 0 }}>{envelopeSteps[step].icon}</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: envelopeSteps[step].color, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
            Step {step + 1}: {envelopeSteps[step].label}
          </div>
          <div style={{ fontSize: 14, color: COLORS.textDim, lineHeight: 1.6 }}>{envelopeSteps[step].desc}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
            background: "transparent",
            color: step === 0 ? COLORS.textMuted : COLORS.text,
            cursor: step === 0 ? "default" : "pointer",
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          ← Previous
        </button>
        <button
          onClick={() => setStep(Math.min(envelopeSteps.length - 1, step + 1))}
          disabled={step === envelopeSteps.length - 1}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            border: `1px solid ${COLORS.accent}44`,
            background: step === envelopeSteps.length - 1 ? "transparent" : COLORS.accent + "18",
            color: step === envelopeSteps.length - 1 ? COLORS.textMuted : COLORS.accent,
            cursor: step === envelopeSteps.length - 1 ? "default" : "pointer",
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function KeyTypeCard({ keyType, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "16px 20px",
        borderRadius: 14,
        border: `1.5px solid ${isSelected ? keyType.color : COLORS.border}`,
        background: isSelected ? keyType.color + "10" : COLORS.card,
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.25s",
        width: "100%",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>{keyType.icon}</span>
        <span style={{ fontSize: 18, fontWeight: 800, color: isSelected ? keyType.color : COLORS.text }}>{keyType.name}</span>
        <Badge color={keyType.color}>{keyType.control}</Badge>
      </div>
      <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.5 }}>{keyType.tagline}</div>
    </button>
  );
}

function KeyDetail({ keyType }) {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "how", label: "How It Works" },
    { id: "pros", label: "Pros & Cons" },
  ];

  return (
    <div
      style={{
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${keyType.color}33`,
        overflow: "hidden",
        transition: "all 0.3s",
      }}
    >
      <div style={{ padding: "24px 28px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 28 }}>{keyType.icon}</span>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: keyType.color, fontFamily: "'DM Sans', sans-serif" }}>
              {keyType.fullName}
            </h3>
          </div>
        </div>
        <p style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.65, margin: "12px 0 16px" }}>{keyType.summary}</p>
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${COLORS.border}` }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "10px 18px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${tab === t.id ? keyType.color : "transparent"}`,
                color: tab === t.id ? keyType.color : COLORS.textMuted,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 28px 24px" }}>
        {tab === "overview" && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                Supported Services
              </div>
              <div style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.6, background: COLORS.bg, padding: "12px 16px", borderRadius: 10 }}>
                {keyType.services}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                Best For
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: keyType.color,
                  lineHeight: 1.6,
                  background: keyType.color + "0a",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: `1px solid ${keyType.color}22`,
                }}
              >
                {keyType.bestFor}
              </div>
            </div>
          </div>
        )}

        {tab === "how" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {keyType.howItWorks.map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: "10px 14px",
                  background: COLORS.bg,
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    background: keyType.color + "22",
                    color: keyType.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 800,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.55 }}>{step}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "pros" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.green, marginBottom: 10 }}>ADVANTAGES</div>
              {keyType.pros.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                  <span style={{ color: COLORS.green, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 12.5, color: COLORS.textDim, lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.red, marginBottom: 10 }}>TRADE-OFFS</div>
              {keyType.cons.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                  <span style={{ color: COLORS.red, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✗</span>
                  <span style={{ fontSize: 12.5, color: COLORS.textDim, lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ComparisonTable() {
  const cols = [
    { key: "gmek", label: "GMEK", color: COLORS.green },
    { key: "cmek", label: "CMEK", color: COLORS.accent },
    { key: "csek", label: "CSEK", color: COLORS.amber },
    { key: "ekm", label: "EKM", color: COLORS.purple },
  ];

  return (
    <div style={{ overflowX: "auto", borderRadius: 14, border: `1px solid ${COLORS.border}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: COLORS.card }}>
            <th style={{ padding: "14px 16px", textAlign: "left", color: COLORS.textMuted, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${COLORS.border}` }}>
              Feature
            </th>
            {cols.map((c) => (
              <th
                key={c.key}
                style={{
                  padding: "14px 12px",
                  textAlign: "center",
                  color: c.color,
                  fontWeight: 700,
                  fontSize: 13,
                  borderBottom: `1px solid ${COLORS.border}`,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonMatrix.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? COLORS.bg : COLORS.card }}>
              <td style={{ padding: "12px 16px", color: COLORS.text, fontWeight: 600, fontSize: 12.5, borderBottom: `1px solid ${COLORS.border}` }}>
                {row.feature}
              </td>
              {cols.map((c) => (
                <td
                  key={c.key}
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    color: COLORS.textDim,
                    fontSize: 12,
                    borderBottom: `1px solid ${COLORS.border}`,
                  }}
                >
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DecisionHelper() {
  const [answers, setAnswers] = useState({});
  const questions = [
    {
      id: "compliance",
      q: "Do you have regulatory compliance requirements (HIPAA, PCI-DSS, GDPR, Schrems II)?",
      options: ["No", "Yes, standard", "Yes, strict sovereignty"],
    },
    {
      id: "control",
      q: "How much control do you need over encryption keys?",
      options: ["None — trust Google", "Control rotation & access", "Keys must never touch GCP"],
    },
    {
      id: "ops",
      q: "What's your team's operational capacity for key management?",
      options: ["Minimal — keep it simple", "Moderate — can manage Cloud KMS", "Advanced — external KMS team"],
    },
  ];

  function getRecommendation() {
    const { compliance, control, ops } = answers;
    if (!compliance || !control || !ops) return null;

    if (control === "Keys must never touch GCP" || compliance === "Yes, strict sovereignty") {
      return {
        primary: "ekm",
        reason:
          "Your sovereignty and control requirements demand that key material stays entirely outside Google's infrastructure. EKM with Key Access Justifications gives you a kill switch and full visibility.",
        alt: "Consider adding Confidential Computing if you also need data-in-use protection.",
      };
    }
    if (compliance === "Yes, standard" || control === "Control rotation & access") {
      return {
        primary: "cmek",
        reason:
          "CMEK gives you the right balance: you own the keys in Cloud KMS, get full audit trails, and can crypto-shred if needed — without the operational overhead of external key management.",
        alt: "If you need per-object external keys for a subset of data, CSEK can complement CMEK.",
      };
    }
    if (ops === "Minimal — keep it simple" && compliance === "No") {
      return {
        primary: "gmek",
        reason:
          "Google's default encryption covers all services with zero configuration. For non-regulated workloads, this is the most practical and cost-effective option.",
        alt: "Consider upgrading to CMEK later if compliance requirements change.",
      };
    }
    return {
      primary: "cmek",
      reason: "CMEK is the recommended default for organizations that want key control without excessive operational complexity.",
      alt: "Use Cloud KMS Autokey to simplify key provisioning across projects.",
    };
  }

  const rec = getRecommendation();
  const recType = rec ? keyTypes.find((k) => k.id === rec.primary) : null;

  return (
    <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 28 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {questions.map((q) => (
          <div key={q.id}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 10 }}>{q.q}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: `1px solid ${answers[q.id] === opt ? COLORS.accent : COLORS.border}`,
                    background: answers[q.id] === opt ? COLORS.accent + "15" : "transparent",
                    color: answers[q.id] === opt ? COLORS.accent : COLORS.textDim,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 500,
                    transition: "all 0.2s",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {rec && recType && (
        <div
          style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 12,
            background: recType.color + "0c",
            border: `1px solid ${recType.color}33`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 24 }}>{recType.icon}</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: recType.color, fontFamily: "'DM Sans', sans-serif" }}>
              Recommended: {recType.name}
            </span>
          </div>
          <p style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.6, margin: "0 0 8px" }}>{rec.reason}</p>
          <p style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>{rec.alt}</p>
        </div>
      )}
    </div>
  );
}

export default function GCPEncryptionGuide() {
  const [selectedKey, setSelectedKey] = useState("cmek");
  const activeKey = keyTypes.find((k) => k.id === selectedKey);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div
        style={{
          padding: "48px 32px 40px",
          borderBottom: `1px solid ${COLORS.border}`,
          background: `linear-gradient(180deg, ${COLORS.accent}06 0%, transparent 100%)`,
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.accent, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Interactive Deep Dive
            </span>
          </div>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 900,
              margin: 0,
              letterSpacing: "-0.03em",
              background: `linear-gradient(135deg, ${COLORS.text} 0%, ${COLORS.accent} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.15,
            }}
          >
            GCP Encryption
            <br />
            Strategies & Keys
          </h1>
          <p style={{ color: COLORS.textDim, fontSize: 15, margin: "14px 0 0", lineHeight: 1.6, maxWidth: 560 }}>
            From default encryption to external key managers and confidential computing — understand every layer of how Google Cloud protects your data.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px 80px" }}>
        {/* Envelope Encryption */}
        <Section
          title="The Foundation: Envelope Encryption"
          subtitle="Every GCP encryption strategy is built on envelope encryption — a layered system where keys encrypt other keys. Step through each layer below."
        >
          <EnvelopeAnimation />
        </Section>

        {/* Key Strategies Deep Dive */}
        <Section
          title="Encryption Key Strategies"
          subtitle="GCP offers a spectrum from fully managed to fully external. Select a strategy to explore it in depth."
        >
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {keyTypes.map((kt) => (
                <KeyTypeCard key={kt.id} keyType={kt} isSelected={selectedKey === kt.id} onClick={() => setSelectedKey(kt.id)} />
              ))}
            </div>
            <KeyDetail keyType={activeKey} />
          </div>
        </Section>

        {/* Comparison Matrix */}
        <Section title="Side-by-Side Comparison" subtitle="How the four key management strategies stack up across critical dimensions.">
          <ComparisonTable />
        </Section>

        {/* Encryption in Transit */}
        <Section title="Encryption in Transit" subtitle="Data moving between systems gets a different set of protections.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {transitMethods.map((m) => (
              <div
                key={m.name}
                style={{
                  background: COLORS.card,
                  borderRadius: 14,
                  border: `1px solid ${COLORS.border}`,
                  padding: "20px 22px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>{m.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>{m.name}</span>
                </div>
                <p style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Decision Helper */}
        <Section title="Which Strategy Is Right for You?" subtitle="Answer three questions and get a tailored recommendation.">
          <DecisionHelper />
        </Section>

        {/* Three States Footer */}
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 14,
          }}
        >
          {[
            { state: "At Rest", desc: "GMEK / CMEK / CSEK / EKM protect stored data", color: COLORS.green, icon: "💾" },
            { state: "In Transit", desc: "TLS, ALTS, VPN, mTLS protect moving data", color: COLORS.blue, icon: "🔄" },
            { state: "In Use", desc: "Confidential Computing protects processed data", color: COLORS.pink, icon: "⚡" },
          ].map((s) => (
            <div
              key={s.state}
              style={{
                background: s.color + "08",
                borderRadius: 14,
                border: `1px solid ${s.color}22`,
                padding: "20px 22px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: s.color, marginBottom: 4 }}>Data {s.state}</div>
              <div style={{ fontSize: 12, color: COLORS.textDim }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
