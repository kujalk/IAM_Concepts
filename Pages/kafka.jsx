import { useState } from "react";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: "◈" },
  { id: "producers-consumers", label: "Producers & Consumers", icon: "⇄" },
  { id: "ingestion", label: "HTTP/WebSocket Ingestion", icon: "⌁" },
  { id: "topics-partitions", label: "Topics & Partitions", icon: "▦" },
  { id: "architecture", label: "Brokers & Architecture", icon: "⬡" },
  { id: "storage", label: "Data Storage", icon: "▤" },
  { id: "replication", label: "Replication & Redundancy", icon: "⟐" },
  { id: "retention", label: "Reading & Retention", icon: "↻" },
  { id: "ksql", label: "ksqlDB & Streams", icon: "⎔" },
  { id: "whats-new", label: "What's New (4.0+)", icon: "★" },
  { id: "message-flow", label: "Message Flow", icon: "⟶" },
];

const palette = {
  bg: "#0a0c10",
  surface: "#12151c",
  surfaceAlt: "#181c26",
  border: "#1e2433",
  borderActive: "#f97316",
  accent: "#f97316",
  accentDim: "#c2410c",
  accentGlow: "rgba(249,115,22,0.12)",
  text: "#e2e8f0",
  textDim: "#8892a4",
  textMuted: "#5a6478",
  green: "#22c55e",
  blue: "#3b82f6",
  purple: "#a855f7",
  cyan: "#06b6d4",
  red: "#ef4444",
  yellow: "#eab308",
};

/* ─────── ANIMATED DIAGRAM COMPONENTS ─────── */

const PulseDot = ({ color = palette.accent, delay = 0, size = 6 }) => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      boxShadow: `0 0 8px ${color}`,
      animation: `pulse 2s ease-in-out ${delay}s infinite`,
    }}
  />
);

const FlowArrow = ({ direction = "right", color = palette.accent }) => {
  const arrows = { right: "→", left: "←", down: "↓", up: "↑", both: "⇄" };
  return (
    <span
      style={{
        color,
        fontSize: 20,
        fontWeight: 700,
        animation: "flowBounce 1.5s ease-in-out infinite",
        display: "inline-block",
      }}
    >
      {arrows[direction]}
    </span>
  );
};

const DiagramBox = ({ children, color = palette.border, bg = palette.surface, glow = false, style = {} }) => (
  <div
    style={{
      border: `1.5px solid ${color}`,
      borderRadius: 8,
      padding: "10px 16px",
      background: bg,
      boxShadow: glow ? `0 0 20px ${color}40` : "none",
      textAlign: "center",
      fontSize: 13,
      lineHeight: 1.5,
      ...style,
    }}
  >
    {children}
  </div>
);

/* ─────── SECTION CONTENT ─────── */

const OverviewSection = () => (
  <div>
    <p style={{ color: palette.textDim, lineHeight: 1.8, marginBottom: 24 }}>
      Apache Kafka is a <strong style={{ color: palette.accent }}>distributed event streaming platform</strong> originally
      developed at LinkedIn and open-sourced through the Apache Software Foundation. It's designed for high-throughput,
      fault-tolerant, publish-subscribe messaging. Think of it as a massive, durable, distributed commit log that multiple
      systems can write to and read from simultaneously — at millions of messages per second.
    </p>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
      {[
        { label: "Throughput", value: "Millions msg/sec", icon: "⚡" },
        { label: "Latency", value: "Single-digit ms", icon: "⏱" },
        { label: "Storage", value: "Durable & distributed", icon: "💾" },
        { label: "Scale", value: "Horizontally infinite", icon: "📈" },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            background: palette.surfaceAlt,
            border: `1px solid ${palette.border}`,
            borderRadius: 10,
            padding: 20,
            textAlign: "center",
            animation: `fadeSlideUp 0.5s ease ${i * 0.1}s both`,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
          <div style={{ color: palette.accent, fontWeight: 700, fontSize: 15, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
          <div style={{ color: palette.textMuted, fontSize: 12, marginTop: 4 }}>{s.label}</div>
        </div>
      ))}
    </div>

    <div style={{ background: palette.surfaceAlt, border: `1px solid ${palette.border}`, borderRadius: 10, padding: 20 }}>
      <div style={{ color: palette.text, fontWeight: 600, marginBottom: 12 }}>Core Use Cases</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {["Real-time Analytics", "Event Sourcing", "Log Aggregation", "Stream Processing", "CDC (Change Data Capture)", "Microservices Communication", "IoT Data Pipelines", "Activity Tracking"].map((u, i) => (
          <span
            key={i}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              background: `${palette.accent}15`,
              border: `1px solid ${palette.accent}30`,
              color: palette.accent,
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {u}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const ProducersConsumersSection = () => {
  const [activeTab, setActiveTab] = useState("producer");
  return (
    <div>
      <p style={{ color: palette.textDim, lineHeight: 1.8, marginBottom: 20 }}>
        Kafka follows a <strong style={{ color: palette.text }}>publish-subscribe</strong> model with two main actors:
        <strong style={{ color: palette.green }}> Producers</strong> push data in, and
        <strong style={{ color: palette.blue }}> Consumers</strong> pull data out. They are fully decoupled — producers don't
        know who will read the data, and consumers don't know who wrote it.
      </p>

      {/* Interactive Diagram */}
      <div
        style={{
          background: palette.surfaceAlt,
          border: `1px solid ${palette.border}`,
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          overflow: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <DiagramBox color={palette.green} glow>
            <div style={{ color: palette.green, fontWeight: 700 }}>Producer A</div>
            <div style={{ color: palette.textMuted, fontSize: 11 }}>Web App</div>
          </DiagramBox>
          <FlowArrow color={palette.green} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <DiagramBox color={palette.accent} bg={`${palette.accent}10`} glow>
              <div style={{ color: palette.accent, fontWeight: 700, fontSize: 14 }}>Kafka Topic</div>
              <div style={{ display: "flex", gap: 4, marginTop: 6, justifyContent: "center" }}>
                {[0, 1, 2].map((p) => (
                  <span key={p} style={{ padding: "2px 10px", borderRadius: 4, background: `${palette.accent}20`, color: palette.accent, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
                    P{p}
                  </span>
                ))}
              </div>
            </DiagramBox>
          </div>
          <FlowArrow color={palette.blue} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <DiagramBox color={palette.blue} glow>
              <div style={{ color: palette.blue, fontWeight: 700 }}>Consumer 1</div>
              <div style={{ color: palette.textMuted, fontSize: 11 }}>Analytics</div>
            </DiagramBox>
            <DiagramBox color={palette.cyan} glow>
              <div style={{ color: palette.cyan, fontWeight: 700 }}>Consumer 2</div>
              <div style={{ color: palette.textMuted, fontSize: 11 }}>DB Sink</div>
            </DiagramBox>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { id: "producer", label: "Producers", color: palette.green },
          { id: "consumer", label: "Consumers", color: palette.blue },
          { id: "groups", label: "Consumer Groups", color: palette.purple },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: `1.5px solid ${activeTab === t.id ? t.color : palette.border}`,
              background: activeTab === t.id ? `${t.color}15` : "transparent",
              color: activeTab === t.id ? t.color : palette.textMuted,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ background: palette.surfaceAlt, borderRadius: 10, padding: 20, border: `1px solid ${palette.border}`, lineHeight: 1.8 }}>
        {activeTab === "producer" && (
          <div style={{ color: palette.textDim }}>
            <strong style={{ color: palette.green }}>Producers</strong> are client applications that publish (write) events/records to Kafka topics.
            They serialize data into bytes (using serializers like JSON, Avro, or Protobuf) and send it with an optional <strong style={{ color: palette.text }}>key</strong>.
            <br /><br />
            <strong style={{ color: palette.text }}>Key Behaviors:</strong><br />
            • If a key is provided, Kafka hashes it to deterministically route to a specific partition (key-based ordering).<br />
            • If no key is set, records are distributed round-robin across partitions for load balancing.<br />
            • Producers can choose acknowledgement levels: <code style={{ color: palette.accent, background: `${palette.accent}15`, padding: "2px 6px", borderRadius: 4 }}>acks=0</code> (fire-and-forget),
            <code style={{ color: palette.accent, background: `${palette.accent}15`, padding: "2px 6px", borderRadius: 4 }}>acks=1</code> (leader acknowledges),
            <code style={{ color: palette.accent, background: `${palette.accent}15`, padding: "2px 6px", borderRadius: 4 }}>acks=all</code> (all in-sync replicas acknowledge).<br />
            • Producers batch records before sending for throughput optimization.
          </div>
        )}
        {activeTab === "consumer" && (
          <div style={{ color: palette.textDim }}>
            <strong style={{ color: palette.blue }}>Consumers</strong> subscribe to topics and <strong style={{ color: palette.text }}>pull</strong> records.
            Unlike traditional queues, Kafka consumers control their own read position (called an <strong style={{ color: palette.accent }}>offset</strong>).
            <br /><br />
            <strong style={{ color: palette.text }}>Key Behaviors:</strong><br />
            • Consumers track their position per partition via committed offsets.<br />
            • Multiple consumers can independently read the same data — Kafka doesn't delete data after consumption.<br />
            • A consumer can "rewind" to re-read old data by resetting its offset.<br />
            • Consumers poll Kafka for new records — this pull-based model lets each consumer control its own pace.
          </div>
        )}
        {activeTab === "groups" && (
          <div style={{ color: palette.textDim }}>
            <strong style={{ color: palette.purple }}>Consumer Groups</strong> are the key to Kafka's scalable consumption model.
            Each consumer in a group reads from a <em>unique subset of partitions</em> — ensuring each record is processed once per group.
            <br /><br />
            <strong style={{ color: palette.text }}>How it works:</strong><br />
            • If you have 6 partitions and 3 consumers in a group → each gets 2 partitions.<br />
            • If a consumer fails, its partitions are reassigned to surviving members (rebalance).<br />
            • Multiple consumer groups can each independently read all data — enabling fan-out patterns.<br />
            • Kafka 4.0 introduces a <strong style={{ color: palette.accent }}>new consumer rebalance protocol</strong> (KIP-848) that eliminates stop-the-world rebalances, allowing incremental partition assignment.
          </div>
        )}
      </div>
    </div>
  );
};

const IngestionSection = () => (
  <div>
    <p style={{ color: palette.textDim, lineHeight: 1.8, marginBottom: 20 }}>
      Kafka's native protocol is a custom TCP binary protocol — it does <strong style={{ color: palette.red }}>not</strong> natively support HTTP or WebSocket.
      However, there are several production-grade ways to bridge HTTP/WebSocket traffic into Kafka topics.
    </p>

    <div style={{ display: "grid", gap: 16, marginBottom: 20 }}>
      {[
        {
          title: "Kafka REST Proxy",
          color: palette.green,
          desc: "Confluent's REST Proxy exposes a full RESTful HTTP API for producing and consuming messages. You POST JSON to an endpoint and it's written to a Kafka topic. Great for languages without a native Kafka client.",
          code: `POST /topics/my-topic HTTP/1.1\nContent-Type: application/vnd.kafka.json.v2+json\n\n{"records":[{"value":{"name":"event1"}}]}`,
        },
        {
          title: "Kafka HTTP Source Connector",
          color: palette.blue,
          desc: "A Kafka Connect source connector that polls HTTP endpoints and ingests responses into topics. Useful for pulling from external REST APIs on a schedule.",
          code: `connector.class=HttpSourceConnector\nhttp.url=https://api.example.com/data\nkafka.topic=ingested-data\npoll.interval.ms=60000`,
        },
        {
          title: "Custom WebSocket Gateway",
          color: palette.purple,
          desc: "Build a lightweight service (e.g., Node.js, Go, Spring) that accepts WebSocket connections and internally uses a Kafka producer client to forward messages. This is the most common pattern for real-time bidirectional use cases.",
          code: `// Node.js example\nws.on('message', (data) => {\n  kafkaProducer.send({\n    topic: 'ws-events',\n    messages: [{ value: data }]\n  });\n});`,
        },
        {
          title: "API Gateway + Lambda/Function",
          color: palette.cyan,
          desc: "Cloud-native approach: Use an API Gateway (AWS, GCP, Azure) to accept HTTPS requests, trigger a serverless function, which then produces to Kafka (e.g., via Amazon MSK, Confluent Cloud).",
          code: `HTTPS Request → API Gateway → Lambda → MSK/Kafka Topic`,
        },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            background: palette.surfaceAlt,
            border: `1px solid ${palette.border}`,
            borderLeft: `3px solid ${item.color}`,
            borderRadius: 10,
            padding: 20,
            animation: `fadeSlideUp 0.4s ease ${i * 0.1}s both`,
          }}
        >
          <div style={{ color: item.color, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{item.title}</div>
          <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{item.desc}</div>
          <pre
            style={{
              background: palette.bg,
              border: `1px solid ${palette.border}`,
              borderRadius: 8,
              padding: 14,
              color: palette.text,
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              overflowX: "auto",
              margin: 0,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {item.code}
          </pre>
        </div>
      ))}
    </div>

    <div style={{ background: `${palette.yellow}10`, border: `1px solid ${palette.yellow}30`, borderRadius: 10, padding: 16 }}>
      <div style={{ color: palette.yellow, fontWeight: 600, fontSize: 13, marginBottom: 6 }}>⚠ Key Takeaway</div>
      <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.7 }}>
        Kafka itself only speaks its own TCP protocol. Any HTTP or WebSocket ingestion requires an intermediary layer. For most teams, the REST Proxy or a thin custom gateway service is the pragmatic choice.
      </div>
    </div>
  </div>
);

const TopicsPartitionsSection = () => {
  const [selectedPartition, setSelectedPartition] = useState(null);
  return (
    <div>
      <p style={{ color: palette.textDim, lineHeight: 1.8, marginBottom: 20 }}>
        <strong style={{ color: palette.accent }}>Topics</strong> and <strong style={{ color: palette.blue }}>Partitions</strong> are
        Kafka's fundamental organizational units. Understanding their relationship is critical to mastering Kafka.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: palette.surfaceAlt, border: `1px solid ${palette.accent}40`, borderRadius: 12, padding: 20 }}>
          <div style={{ color: palette.accent, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>📁 Topic</div>
          <ul style={{ color: palette.textDim, fontSize: 13, lineHeight: 2, listStyle: "none", padding: 0, margin: 0 }}>
            <li>• A named category or feed of records</li>
            <li>• Analogous to a database table or a folder</li>
            <li>• Can have multiple partitions</li>
            <li>• Multi-subscriber: many consumer groups</li>
            <li>• Configurable retention policy</li>
            <li>• Example: <code style={{ color: palette.accent }}>"user-clicks"</code>, <code style={{ color: palette.accent }}>"orders"</code></li>
          </ul>
        </div>
        <div style={{ background: palette.surfaceAlt, border: `1px solid ${palette.blue}40`, borderRadius: 12, padding: 20 }}>
          <div style={{ color: palette.blue, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>▤ Partition</div>
          <ul style={{ color: palette.textDim, fontSize: 13, lineHeight: 2, listStyle: "none", padding: 0, margin: 0 }}>
            <li>• An ordered, immutable log of records</li>
            <li>• The unit of parallelism in Kafka</li>
            <li>• Each partition is an append-only sequence</li>
            <li>• Records within a partition have a unique <strong style={{ color: palette.text }}>offset</strong></li>
            <li>• Ordering guaranteed only <em>within</em> a partition</li>
            <li>• Spread across different brokers</li>
          </ul>
        </div>
      </div>

      {/* Interactive partition visualization */}
      <div style={{ background: palette.surfaceAlt, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 24 }}>
        <div style={{ color: palette.text, fontWeight: 600, marginBottom: 16 }}>
          Interactive: Topic "orders" with 3 partitions
          <span style={{ color: palette.textMuted, fontWeight: 400, fontSize: 12, marginLeft: 8 }}>(click a partition)</span>
        </div>
        {[0, 1, 2].map((p) => (
          <div
            key={p}
            onClick={() => setSelectedPartition(selectedPartition === p ? null : p)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
              cursor: "pointer",
              padding: 10,
              borderRadius: 8,
              border: `1.5px solid ${selectedPartition === p ? palette.accent : palette.border}`,
              background: selectedPartition === p ? `${palette.accent}08` : "transparent",
              transition: "all 0.2s",
            }}
          >
            <span style={{ color: palette.accent, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, minWidth: 28 }}>
              P{p}
            </span>
            <div style={{ display: "flex", gap: 3, flex: 1, overflow: "hidden" }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    flex: "0 0 auto",
                    width: 36,
                    height: 28,
                    borderRadius: 4,
                    background: `${[palette.green, palette.blue, palette.purple][p]}${i === 7 ? "40" : "20"}`,
                    border: `1px solid ${[palette.green, palette.blue, palette.purple][p]}${i === 7 ? "80" : "30"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: [palette.green, palette.blue, palette.purple][p],
                  }}
                >
                  {i}
                </div>
              ))}
              <span style={{ color: palette.textMuted, fontSize: 11, alignSelf: "center", marginLeft: 4 }}>→</span>
            </div>
          </div>
        ))}
        {selectedPartition !== null && (
          <div
            style={{
              marginTop: 12,
              padding: 14,
              background: palette.bg,
              borderRadius: 8,
              border: `1px solid ${palette.border}`,
              color: palette.textDim,
              fontSize: 13,
              lineHeight: 1.7,
              animation: "fadeSlideUp 0.3s ease both",
            }}
          >
            <strong style={{ color: [palette.green, palette.blue, palette.purple][selectedPartition] }}>
              Partition {selectedPartition}
            </strong>{" "}
            — Each cell is a record at a specific offset. Offsets are sequential and immutable.
            New records always append to the right (end). A consumer reading this partition tracks its own
            offset position independently. Records with the same key always land in the same partition.
          </div>
        )}
      </div>
    </div>
  );
};

const ArchitectureSection = () => {
  const [hoveredBroker, setHoveredBroker] = useState(null);
  return (
    <div>
      <p style={{ color: palette.textDim, lineHeight: 1.8, marginBottom: 20 }}>
        A Kafka <strong style={{ color: palette.text }}>cluster</strong> consists of multiple <strong style={{ color: palette.accent }}>brokers</strong> (servers)
        working together, coordinated by a <strong style={{ color: palette.purple }}>controller</strong>. Since Kafka 4.0,
        all metadata management uses <strong style={{ color: palette.green }}>KRaft</strong> (Kafka Raft) — ZooKeeper has been completely removed.
      </p>

      {/* Architecture Diagram */}
      <div style={{ background: palette.surfaceAlt, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <div style={{ color: palette.text, fontWeight: 600, marginBottom: 20, textAlign: "center" }}>Kafka Cluster Architecture (KRaft Mode)</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {[
            { id: 0, label: "Broker 0", role: "Controller (Leader)", color: palette.accent, isLeader: true },
            { id: 1, label: "Broker 1", role: "Controller (Follower)", color: palette.blue, isLeader: false },
            { id: 2, label: "Broker 2", role: "Controller (Follower)", color: palette.blue, isLeader: false },
            { id: 3, label: "Broker 3", role: "Broker Only", color: palette.textMuted, isLeader: false },
          ].map((b) => (
            <div
              key={b.id}
              onMouseEnter={() => setHoveredBroker(b.id)}
              onMouseLeave={() => setHoveredBroker(null)}
              style={{
                width: 150,
                border: `2px solid ${hoveredBroker === b.id ? b.color : palette.border}`,
                borderRadius: 12,
                padding: 16,
                textAlign: "center",
                background: hoveredBroker === b.id ? `${b.color}10` : palette.bg,
                transition: "all 0.3s",
                cursor: "default",
                position: "relative",
              }}
            >
              {b.isLeader && (
                <div style={{
                  position: "absolute", top: -10, right: -10,
                  background: palette.accent, color: palette.bg,
                  borderRadius: 12, padding: "2px 8px", fontSize: 10, fontWeight: 700,
                }}>
                  LEADER
                </div>
              )}
              <div style={{ fontSize: 28, marginBottom: 6 }}>🖥</div>
              <div style={{ color: b.color, fontWeight: 700, fontSize: 14 }}>{b.label}</div>
              <div style={{ color: palette.textMuted, fontSize: 11, marginTop: 4 }}>{b.role}</div>
              <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 10 }}>
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} style={{ width: 8, height: 20, borderRadius: 2, background: `${b.color}40` }} />
                ))}
              </div>
              <div style={{ color: palette.textMuted, fontSize: 10, marginTop: 4 }}>partitions</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <span style={{ color: palette.textMuted, fontSize: 12 }}>
            ← KRaft consensus protocol keeps controllers in sync →
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: palette.surfaceAlt, borderRadius: 10, padding: 20, border: `1px solid ${palette.border}` }}>
          <div style={{ color: palette.accent, fontWeight: 700, marginBottom: 10 }}>🏗 Broker</div>
          <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.8 }}>
            A broker is a single Kafka server. It stores data on disk, serves client requests (produce & fetch),
            and replicates data to other brokers. Each broker handles hundreds of thousands of partitions and millions of messages per second.
          </div>
        </div>
        <div style={{ background: palette.surfaceAlt, borderRadius: 10, padding: 20, border: `1px solid ${palette.border}` }}>
          <div style={{ color: palette.purple, fontWeight: 700, marginBottom: 10 }}>👑 Controller</div>
          <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.8 }}>
            In KRaft mode, a subset of brokers serve as <strong style={{ color: palette.text }}>controllers</strong>. One is elected
            the <strong style={{ color: palette.accent }}>active controller</strong> (leader). It manages partition leader elections,
            broker registration, topic creation, and config changes. If it fails, a follower controller takes over via Raft consensus.
          </div>
        </div>
        <div style={{ background: palette.surfaceAlt, borderRadius: 10, padding: 20, border: `1px solid ${palette.border}`, gridColumn: "1 / -1" }}>
          <div style={{ color: palette.green, fontWeight: 700, marginBottom: 10 }}>⚡ Partition Leaders</div>
          <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.8 }}>
            Every partition has one <strong style={{ color: palette.text }}>leader replica</strong> and zero or more
            <strong style={{ color: palette.text }}> follower replicas</strong>. <em>All</em> reads and writes for a partition go through
            its leader. The leader is hosted on a specific broker, and Kafka distributes leaders across brokers for load balancing.
            If a leader broker dies, a follower in the <strong style={{ color: palette.accent }}>ISR</strong> (In-Sync Replica set) is elected as the new leader.
          </div>
        </div>
      </div>
    </div>
  );
};

const StorageSection = () => (
  <div>
    <p style={{ color: palette.textDim, lineHeight: 1.8, marginBottom: 20 }}>
      Kafka's storage model is one of its key innovations — it stores everything as an <strong style={{ color: palette.accent }}>append-only, immutable commit log</strong> on disk,
      and cleverly leverages the OS page cache and sequential I/O for extraordinary performance.
    </p>

    {/* Storage Hierarchy */}
    <div style={{ background: palette.surfaceAlt, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
      <div style={{ color: palette.text, fontWeight: 600, marginBottom: 16 }}>Storage Hierarchy on Disk</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: palette.textDim, lineHeight: 2.2 }}>
        <div><span style={{ color: palette.accent }}>📂 kafka-logs/</span></div>
        <div style={{ paddingLeft: 24 }}><span style={{ color: palette.green }}>📂 orders-0/</span> <span style={{ color: palette.textMuted }}>← Partition 0</span></div>
        <div style={{ paddingLeft: 48 }}><span style={{ color: palette.text }}>📄 00000000000000000000.log</span> <span style={{ color: palette.textMuted }}>← Segment file (records)</span></div>
        <div style={{ paddingLeft: 48 }}><span style={{ color: palette.blue }}>📄 00000000000000000000.index</span> <span style={{ color: palette.textMuted }}>← Offset index</span></div>
        <div style={{ paddingLeft: 48 }}><span style={{ color: palette.purple }}>📄 00000000000000000000.timeindex</span> <span style={{ color: palette.textMuted }}>← Time index</span></div>
        <div style={{ paddingLeft: 48 }}><span style={{ color: palette.text }}>📄 00000000000052428800.log</span> <span style={{ color: palette.textMuted }}>← Next segment</span></div>
        <div style={{ paddingLeft: 24 }}><span style={{ color: palette.green }}>📂 orders-1/</span> <span style={{ color: palette.textMuted }}>← Partition 1</span></div>
        <div style={{ paddingLeft: 24 }}><span style={{ color: palette.green }}>📂 orders-2/</span> <span style={{ color: palette.textMuted }}>← Partition 2</span></div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ background: palette.surfaceAlt, borderRadius: 10, padding: 20, border: `1px solid ${palette.border}` }}>
        <div style={{ color: palette.accent, fontWeight: 700, marginBottom: 10 }}>📝 Segments</div>
        <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.8 }}>
          Each partition is broken into <strong style={{ color: palette.text }}>segments</strong> (default 1GB each).
          Only the latest segment is "active" (writable). Older segments are read-only and eligible for cleanup.
          The segment filename is the base offset it starts from.
        </div>
      </div>
      <div style={{ background: palette.surfaceAlt, borderRadius: 10, padding: 20, border: `1px solid ${palette.border}` }}>
        <div style={{ color: palette.blue, fontWeight: 700, marginBottom: 10 }}>🗂 Indexes</div>
        <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.8 }}>
          Each segment has an <strong style={{ color: palette.text }}>offset index</strong> (offset → physical position) and a
          <strong style={{ color: palette.text }}> time index</strong> (timestamp → offset). These are sparse indexes — Kafka binary-searches
          them for fast lookups without scanning the whole log.
        </div>
      </div>
      <div style={{ background: palette.surfaceAlt, borderRadius: 10, padding: 20, border: `1px solid ${palette.border}` }}>
        <div style={{ color: palette.green, fontWeight: 700, marginBottom: 10 }}>🔀 How Partitions Spread Across Servers</div>
        <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.8 }}>
          Kafka distributes partition replicas across brokers using a rack-aware algorithm. If topic "orders" has 6 partitions with
          replication factor 3 across 3 brokers, each broker stores ~6 partition replicas. Leaders are balanced so no single broker is a bottleneck.
        </div>
      </div>
      <div style={{ background: palette.surfaceAlt, borderRadius: 10, padding: 20, border: `1px solid ${palette.border}` }}>
        <div style={{ color: palette.purple, fontWeight: 700, marginBottom: 10 }}>⚡ Zero-Copy & Page Cache</div>
        <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.8 }}>
          Kafka uses <strong style={{ color: palette.text }}>zero-copy transfer</strong> (sendfile syscall) to send data from disk to network
          without copying through user space. The OS page cache keeps hot data in memory — so most reads never touch disk at all.
        </div>
      </div>
    </div>
  </div>
);

const ReplicationSection = () => (
  <div>
    <p style={{ color: palette.textDim, lineHeight: 1.8, marginBottom: 20 }}>
      Redundancy and replication are core to Kafka's fault-tolerance guarantee.
      Kafka replicates every partition across multiple brokers, ensuring data survives broker failures.
    </p>

    {/* Replication Diagram */}
    <div style={{ background: palette.surfaceAlt, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
      <div style={{ color: palette.text, fontWeight: 600, marginBottom: 16, textAlign: "center" }}>
        Replication: Topic "orders" Partition 0 (Replication Factor = 3)
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
        {[
          { broker: "Broker 0", role: "Leader", color: palette.accent },
          { broker: "Broker 1", role: "Follower (ISR)", color: palette.blue },
          { broker: "Broker 2", role: "Follower (ISR)", color: palette.blue },
        ].map((b, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <DiagramBox color={b.color} glow={i === 0} style={{ width: 140, marginBottom: 8 }}>
              <div style={{ color: b.color, fontWeight: 700 }}>{b.broker}</div>
              <div style={{ color: palette.textMuted, fontSize: 11 }}>{b.role}</div>
              <div style={{
                marginTop: 8, padding: "4px 8px",
                background: `${b.color}15`, borderRadius: 4,
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: b.color,
              }}>
                P0: [0,1,2,3,4,5]
              </div>
            </DiagramBox>
            {i === 0 && (
              <div style={{ color: palette.textMuted, fontSize: 11 }}>
                ↓ All writes here<br />↓ Replicates to followers
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    <div style={{ display: "grid", gap: 16 }}>
      {[
        {
          title: "ISR (In-Sync Replicas)",
          color: palette.green,
          content: "The ISR set contains all replicas that are fully caught up with the leader. Only ISR members are eligible for leader election. If a follower falls behind (configurable threshold), it's removed from ISR. When it catches up, it rejoins. The setting min.insync.replicas controls the minimum ISR size required before a producer with acks=all can write."
        },
        {
          title: "Replication Protocol",
          color: palette.blue,
          content: "Followers continuously fetch data from the leader (just like consumers). The leader tracks each follower's fetch offset. Once all ISR followers have fetched up to an offset, that offset is 'committed' and becomes visible to consumers. This is called the High Watermark (HW)."
        },
        {
          title: "Leader Election",
          color: palette.accent,
          content: "When a leader broker fails, the controller selects a new leader from the ISR. With Kafka 4.0's Eligible Leader Replicas (ELR - KIP-966), there's a new safety mechanism: ELR tracks replicas that are guaranteed to have all committed data, preventing data loss during elections. KRaft's Pre-Vote (KIP-996) also reduces unnecessary elections."
        },
        {
          title: "Unclean Leader Election",
          color: palette.red,
          content: "If ALL ISR replicas are down, Kafka can either wait (safe but unavailable) or elect an out-of-sync replica (available but may lose data). This is controlled by unclean.leader.election.enable — defaults to false for safety. In production, this should almost always remain disabled."
        },
      ].map((item, i) => (
        <div key={i} style={{ background: palette.surfaceAlt, borderLeft: `3px solid ${item.color}`, borderRadius: 10, padding: 20, border: `1px solid ${palette.border}`, borderLeftColor: item.color, borderLeftWidth: 3 }}>
          <div style={{ color: item.color, fontWeight: 700, marginBottom: 8 }}>{item.title}</div>
          <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.8 }}>{item.content}</div>
        </div>
      ))}
    </div>
  </div>
);

const RetentionSection = () => (
  <div>
    <p style={{ color: palette.textDim, lineHeight: 1.8, marginBottom: 20 }}>
      Kafka decouples reading from deletion — data is <strong style={{ color: palette.accent }}>retained based on policy</strong>,
      not consumption. Consumers don't "take" messages; they read at their own pace from a durable log.
    </p>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
      <div style={{ background: palette.surfaceAlt, borderRadius: 10, padding: 20, border: `1px solid ${palette.border}` }}>
        <div style={{ color: palette.blue, fontWeight: 700, marginBottom: 12 }}>📖 How Reading Works</div>
        <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.8 }}>
          Consumers send <strong style={{ color: palette.text }}>fetch requests</strong> to the partition leader specifying their current offset.
          The broker returns a batch of records starting from that offset. The consumer processes them and commits the new offset.
          <br /><br />
          <strong style={{ color: palette.text }}>Offset management:</strong> Consumers commit offsets to a special internal topic
          <code style={{ color: palette.accent, background: `${palette.accent}15`, padding: "2px 6px", borderRadius: 4 }}>__consumer_offsets</code>.
          On restart, they resume from the last committed offset.
        </div>
      </div>
      <div style={{ background: palette.surfaceAlt, borderRadius: 10, padding: 20, border: `1px solid ${palette.border}` }}>
        <div style={{ color: palette.green, fontWeight: 700, marginBottom: 12 }}>🕰 Retention Policies</div>
        <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.8 }}>
          Kafka supports two retention modes:<br /><br />
          <strong style={{ color: palette.accent }}>Time-based:</strong> <code style={{ color: palette.accent, background: `${palette.accent}15`, padding: "2px 6px", borderRadius: 4 }}>retention.ms</code> — Default 7 days. Records older than this are deleted.<br /><br />
          <strong style={{ color: palette.accent }}>Size-based:</strong> <code style={{ color: palette.accent, background: `${palette.accent}15`, padding: "2px 6px", borderRadius: 4 }}>retention.bytes</code> — Delete oldest segments when partition exceeds this size.<br /><br />
          Set <code style={{ color: palette.accent, background: `${palette.accent}15`, padding: "2px 6px", borderRadius: 4 }}>retention.ms=-1</code> for infinite retention.
        </div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ background: palette.surfaceAlt, borderRadius: 10, padding: 20, border: `1px solid ${palette.border}` }}>
        <div style={{ color: palette.purple, fontWeight: 700, marginBottom: 10 }}>🗜 Log Compaction</div>
        <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.8 }}>
          An alternative to deletion: <code style={{ color: palette.accent, background: `${palette.accent}15`, padding: "2px 6px", borderRadius: 4 }}>cleanup.policy=compact</code>.
          Kafka keeps only the <strong style={{ color: palette.text }}>latest value for each key</strong>, discarding older duplicates. Perfect for
          changelogs, state stores, and database snapshots. The topic becomes an always-up-to-date key-value snapshot.
        </div>
      </div>
      <div style={{ background: palette.surfaceAlt, borderRadius: 10, padding: 20, border: `1px solid ${palette.border}` }}>
        <div style={{ color: palette.cyan, fontWeight: 700, marginBottom: 10 }}>📐 Tiered Storage</div>
        <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.8 }}>
          Kafka now supports <strong style={{ color: palette.text }}>tiered storage</strong> — hot data stays on local broker disks,
          while older data is offloaded to cheaper remote storage (S3, HDFS, etc.). This decouples storage capacity from broker
          compute, enabling cost-effective infinite retention without scaling broker hardware.
        </div>
      </div>
    </div>
  </div>
);

const KsqlSection = () => (
  <div>
    <p style={{ color: palette.textDim, lineHeight: 1.8, marginBottom: 20 }}>
      <strong style={{ color: palette.accent }}>ksqlDB</strong> is a streaming database built on top of Kafka Streams.
      It lets you query, filter, aggregate, and join streaming data using a SQL-like syntax — without writing Java or Scala code.
    </p>

    {/* Architecture position diagram */}
    <div style={{ background: palette.surfaceAlt, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
      <div style={{ color: palette.text, fontWeight: 600, marginBottom: 16, textAlign: "center" }}>Where ksqlDB Sits in the Kafka Ecosystem</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        <DiagramBox color={palette.green}><span style={{ color: palette.green, fontWeight: 600 }}>Producers</span></DiagramBox>
        <FlowArrow color={palette.textMuted} />
        <DiagramBox color={palette.accent} glow><span style={{ color: palette.accent, fontWeight: 600 }}>Kafka Brokers</span><br /><span style={{ color: palette.textMuted, fontSize: 11 }}>(Topics & Partitions)</span></DiagramBox>
        <FlowArrow color={palette.textMuted} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <DiagramBox color={palette.purple} glow>
            <span style={{ color: palette.purple, fontWeight: 600 }}>ksqlDB</span><br />
            <span style={{ color: palette.textMuted, fontSize: 11 }}>SQL layer on Kafka Streams</span>
          </DiagramBox>
          <DiagramBox color={palette.cyan}>
            <span style={{ color: palette.cyan, fontWeight: 600 }}>Kafka Streams</span><br />
            <span style={{ color: palette.textMuted, fontSize: 11 }}>Java/Scala DSL</span>
          </DiagramBox>
          <DiagramBox color={palette.blue}>
            <span style={{ color: palette.blue, fontWeight: 600 }}>Kafka Connect</span><br />
            <span style={{ color: palette.textMuted, fontSize: 11 }}>Source & Sink connectors</span>
          </DiagramBox>
        </div>
      </div>
    </div>

    <div style={{ display: "grid", gap: 16, marginBottom: 20 }}>
      {[
        {
          title: "Streams vs Tables",
          color: palette.cyan,
          content: "ksqlDB has two core abstractions: A STREAM is an unbounded sequence of events (like a Kafka topic). A TABLE is a materialized, continuously-updated view that represents the latest value per key (backed by a compacted changelog).",
          code: `CREATE STREAM clicks AS\n  SELECT * FROM raw_clicks\n  WHERE region = 'APAC';\n\nCREATE TABLE user_counts AS\n  SELECT user_id, COUNT(*) as cnt\n  FROM clicks\n  GROUP BY user_id;`,
        },
        {
          title: "Push & Pull Queries",
          color: palette.purple,
          content: "Push queries (SELECT ... EMIT CHANGES) continuously stream results as new data arrives. Pull queries (standard SELECT) fetch the current state of a materialized table — perfect for request/response APIs.",
          code: `-- Push: continuous stream\nSELECT * FROM clicks EMIT CHANGES;\n\n-- Pull: point-in-time lookup\nSELECT cnt FROM user_counts\n  WHERE user_id = 'alice';`,
        },
        {
          title: "Kafka Streams (Library)",
          color: palette.blue,
          content: "ksqlDB is powered by Kafka Streams, a Java client library for building stream processing apps. Unlike Flink or Spark, Kafka Streams runs as a regular JVM application — no separate cluster needed. It handles state management, fault tolerance, and exactly-once processing. ksqlDB simply wraps it with SQL.",
          code: `// Java Kafka Streams DSL\nStreamsBuilder builder = new StreamsBuilder();\nbuilder.stream("orders")\n  .filter((k,v) -> v.getAmount() > 100)\n  .groupByKey()\n  .count()\n  .toStream()\n  .to("high-value-orders");`,
        },
      ].map((item, i) => (
        <div key={i} style={{ background: palette.surfaceAlt, border: `1px solid ${palette.border}`, borderLeft: `3px solid ${item.color}`, borderRadius: 10, padding: 20 }}>
          <div style={{ color: item.color, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{item.title}</div>
          <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{item.content}</div>
          <pre style={{
            background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 8,
            padding: 14, color: palette.text, fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
            overflowX: "auto", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap",
          }}>
            {item.code}
          </pre>
        </div>
      ))}
    </div>
  </div>
);

const WhatsNewSection = () => (
  <div>
    <p style={{ color: palette.textDim, lineHeight: 1.8, marginBottom: 20 }}>
      Apache Kafka has seen massive evolution. Version <strong style={{ color: palette.accent }}>4.0</strong> (released March 2025) was
      a landmark release, and <strong style={{ color: palette.accent }}>4.1</strong> followed in September 2025, with 4.2 in development.
    </p>

    <div style={{ display: "grid", gap: 16 }}>
      {[
        {
          version: "4.0",
          date: "March 2025",
          color: palette.accent,
          headline: "Goodbye ZooKeeper, Hello KRaft",
          items: [
            "Complete removal of ZooKeeper — KRaft is now the only metadata management mode",
            "New consumer group rebalance protocol (KIP-848) — eliminates stop-the-world rebalances for dramatically better performance",
            "Queues for Kafka (KIP-932) in Early Access — share groups enable cooperative consumption from the same partition, like traditional message queues",
            "Eligible Leader Replicas (ELR, KIP-966) — safer leader elections preventing data loss",
            "Pre-Vote mechanism (KIP-996) — reduces unnecessary KRaft leader elections",
            "Java 17 required for brokers; Java 11 minimum for clients",
            "Old API protocol versions dropped — baseline is now Kafka 2.1",
          ],
        },
        {
          version: "4.1",
          date: "September 2025",
          color: palette.blue,
          headline: "Queues mature, Streams improve",
          items: [
            "Queues for Kafka (KIP-932) moves to Preview status",
            "KRaft dynamic voter set functionality",
            "Client plugins can register custom metrics via Monitorable interface (KIP-877)",
            "Improved transaction API error handling",
            "Debezium 3.4 adds support for Kafka 4.1",
          ],
        },
        {
          version: "4.2",
          date: "In Progress (2026)",
          color: palette.purple,
          headline: "Tiered storage & beyond",
          items: [
            "Consumer support for remote tiered storage fetch (KIP-1254)",
            "Configurable KRaft fetch and snapshot byte sizes (KIP-1219)",
            "Continued maturation of Queue semantics",
            "New website built with Hugo/Markdown (KIP-1133) — easier community contributions",
            "Over 137 KIPs submitted in 2025 alone",
          ],
        },
      ].map((v, i) => (
        <div
          key={i}
          style={{
            background: palette.surfaceAlt,
            border: `1px solid ${palette.border}`,
            borderRadius: 12,
            padding: 24,
            animation: `fadeSlideUp 0.4s ease ${i * 0.1}s both`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{
              background: `${v.color}20`, color: v.color, fontWeight: 800,
              padding: "6px 14px", borderRadius: 8, fontSize: 18,
              fontFamily: "'JetBrains Mono', monospace", border: `1.5px solid ${v.color}40`,
            }}>
              v{v.version}
            </span>
            <div>
              <div style={{ color: v.color, fontWeight: 700, fontSize: 15 }}>{v.headline}</div>
              <div style={{ color: palette.textMuted, fontSize: 12 }}>{v.date}</div>
            </div>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {v.items.map((item, j) => (
              <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: v.color, fontSize: 10, marginTop: 5, flexShrink: 0 }}>●</span>
                <span style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.7 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div style={{ marginTop: 20, background: `${palette.green}10`, border: `1px solid ${palette.green}30`, borderRadius: 10, padding: 16 }}>
      <div style={{ color: palette.green, fontWeight: 600, fontSize: 13, marginBottom: 6 }}>🔮 The Big Picture</div>
      <div style={{ color: palette.textDim, fontSize: 13, lineHeight: 1.7 }}>
        Kafka is evolving from a pure pub-sub system into a unified streaming platform that also supports queue semantics,
        SQL-based stream processing, and tiered storage. The removal of ZooKeeper was a multi-year effort culminating in 4.0 — simplifying
        operations dramatically. Confluent, Red Hat (Strimzi), and the broader community continue pushing Kafka
        as the central nervous system of modern data architectures.
      </div>
    </div>
  </div>
);

/* ─────── MESSAGE FLOW SEQUENCE DIAGRAM ─────── */

const MessageFlowSection = () => {
  const p = palette;
  const actors = [
    { label: "Producer",         sub: "App / Service",       x: 88,  color: p.accent  },
    { label: "Broker Leader",    sub: "Node 1  :9092",        x: 268, color: p.blue    },
    { label: "Partition Log",    sub: "topic 'orders'  P0",   x: 452, color: p.green   },
    { label: "Follower Replica", sub: "Node 2  (ISR)",        x: 632, color: p.purple  },
    { label: "Consumer",         sub: "Group 'analytics'",    x: 820, color: p.cyan    },
  ];
  const LS = 74, LE = 668;
  const steps = [
    { from:0, to:1, y:115, label:"1. Metadata Request",      sub:"Which broker leads topic 'orders'?",     color:p.accent,  dashed:false },
    { from:1, to:0, y:158, label:"2. Metadata Response",     sub:"P0 leader → Broker 1:9092",              color:p.green,   dashed:true  },
    { from:0, to:1, y:200, label:"3. ProduceRequest",        sub:"batch [key, value, headers], acks=all",  color:p.accent,  dashed:false },
    { from:1, to:2, y:243, label:"4. Append to commit log",  sub:"write at log offset N",                  color:p.blue,    dashed:false },
    { from:2, to:1, y:288, label:"5. Write confirmed",       sub:"offset N, bytes written",                color:p.blue,    dashed:true  },
    { from:1, to:3, y:330, label:"6. Replicate records",     sub:"ISR fetch-based replication",            color:p.purple,  dashed:false },
    { from:3, to:1, y:374, label:"7. ISR ACK",               sub:"high-watermark advanced to N+1",         color:p.purple,  dashed:true  },
    { from:1, to:0, y:415, label:"8. ProduceResponse",       sub:"offset: N, acks=all \u2713",              color:p.green,   dashed:true  },
    { from:4, to:1, y:477, label:"9. FetchRequest",          sub:"P0, offset: N, maxBytes: 1 MB",          color:p.cyan,    dashed:false },
    { from:1, to:2, y:518, label:"10. Read from offset N",   sub:"sequential disk read",                   color:p.blue,    dashed:false },
    { from:2, to:1, y:562, label:"11. Record batch",         sub:"records [N \u2026 N+k\u22121]",           color:p.blue,    dashed:true  },
    { from:1, to:4, y:601, label:"12. FetchResponse",        sub:"records, high-watermark: N+1",           color:p.cyan,    dashed:true  },
    { from:4, to:1, y:641, label:"13. OffsetCommit",         sub:"group 'analytics', P0 \u2192 offset N+k", color:p.cyan,   dashed:false },
  ];
  return (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: p.text, marginBottom: 6 }}>
        &#x27F6; End-to-End Message Flow
      </h2>
      <p style={{ fontSize: 13, color: p.textDim, marginBottom: 16, lineHeight: 1.6 }}>
        Complete sequence from producer publishing a record to consumer reading it &mdash; metadata negotiation,
        partition write, ISR replication, acknowledgement, consumer fetch, and offset commit.
      </p>
      <svg
        viewBox="0 0 960 710"
        style={{ width: "100%", display: "block", background: "#0c0f16", borderRadius: 10, border: `1px solid ${p.border}` }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Phase highlight rectangles */}
        <rect x="22" y="93" width="916" height="342" rx="5"
          fill={p.accent} fillOpacity="0.035" stroke={p.accent} strokeOpacity="0.17" strokeWidth="1" strokeDasharray="4,3"/>
        <text x="934" y="108" textAnchor="end" fill={p.accent} fillOpacity="0.6" fontSize="9" fontWeight="700"
          fontFamily="'IBM Plex Sans',sans-serif" letterSpacing="1.5">PRODUCE PHASE</text>

        <rect x="22" y="452" width="916" height="220" rx="5"
          fill={p.cyan} fillOpacity="0.035" stroke={p.cyan} strokeOpacity="0.17" strokeWidth="1" strokeDasharray="4,3"/>
        <text x="934" y="467" textAnchor="end" fill={p.cyan} fillOpacity="0.6" fontSize="9" fontWeight="700"
          fontFamily="'IBM Plex Sans',sans-serif" letterSpacing="1.5">CONSUME PHASE</text>

        {/* Lifelines */}
        {actors.map((a, i) => (
          <line key={i} x1={a.x} y1={LS} x2={a.x} y2={LE}
            stroke={a.color} strokeWidth="1.5" strokeDasharray="5,4" strokeOpacity="0.3"/>
        ))}

        {/* Top actor boxes */}
        {actors.map((a, i) => (
          <g key={i}>
            <rect x={a.x - 57} y="13" width="114" height="50" rx="6"
              fill={p.surfaceAlt} stroke={a.color} strokeWidth="1.5"/>
            <text x={a.x} y="33" textAnchor="middle" fill={a.color} fontSize="11" fontWeight="700"
              fontFamily="'IBM Plex Sans',sans-serif">{a.label}</text>
            <text x={a.x} y="51" textAnchor="middle" fill={p.textMuted} fontSize="9"
              fontFamily="'IBM Plex Sans',sans-serif">{a.sub}</text>
          </g>
        ))}

        {/* Message arrows */}
        {steps.map((s, i) => {
          const x1 = actors[s.from].x;
          const x2 = actors[s.to].x;
          const right = x2 > x1;
          const mx = (x1 + x2) / 2;
          const lx2 = right ? x2 - 7 : x2 + 7;
          return (
            <g key={i}>
              <line x1={x1} y1={s.y} x2={lx2} y2={s.y}
                stroke={s.color} strokeWidth="1.8"
                strokeDasharray={s.dashed ? "6,3" : "none"}/>
              {right
                ? <polygon points={`${x2},${s.y} ${x2 - 10},${s.y - 5} ${x2 - 10},${s.y + 5}`} fill={s.color}/>
                : <polygon points={`${x2},${s.y} ${x2 + 10},${s.y - 5} ${x2 + 10},${s.y + 5}`} fill={s.color}/>
              }
              <text x={mx} y={s.y - 11} textAnchor="middle" fill={s.color} fontSize="10.5" fontWeight="600"
                fontFamily="'IBM Plex Sans',sans-serif">{s.label}</text>
              <text x={mx} y={s.y + 16} textAnchor="middle" fill={p.textMuted} fontSize="8.5" fontStyle="italic"
                fontFamily="'IBM Plex Sans',sans-serif">{s.sub}</text>
            </g>
          );
        })}

        {/* Bottom actor boxes (close lifelines) */}
        {actors.map((a, i) => (
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
          { c: p.accent,  l: "Producer request",  dash: false },
          { c: p.blue,    l: "Broker \u2194 Partition", dash: false },
          { c: p.purple,  l: "ISR Replication",   dash: false },
          { c: p.cyan,    l: "Consumer flow",      dash: false },
          { c: p.green,   l: "Response / ACK",     dash: true  },
        ].map(({ c, l, dash }) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="26" height="10" style={{ display: "block", flexShrink: 0 }}>
              <line x1="0" y1="5" x2="26" y2="5" stroke={c} strokeWidth="2"
                strokeDasharray={dash ? "5,2" : "none"}/>
              {!dash && <polygon points="26,5 17,1 17,9" fill={c}/>}
            </svg>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
};

const sectionComponents = {
  "overview": OverviewSection,
  "producers-consumers": ProducersConsumersSection,
  "ingestion": IngestionSection,
  "topics-partitions": TopicsPartitionsSection,
  "architecture": ArchitectureSection,
  "storage": StorageSection,
  "replication": ReplicationSection,
  "retention": RetentionSection,
  "ksql": KsqlSection,
  "whats-new": WhatsNewSection,
  "message-flow": MessageFlowSection,
};

/* ─────── MAIN APP ─────── */

export default function KafkaDeepDive() {
  const [activeSection, setActiveSection] = useState("overview");

  const ActiveComponent = sectionComponents[activeSection];

  const navigate = (id) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px", fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif", color: palette.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes flowBounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } }
        code { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 32 }}>◈</span>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: palette.text, margin: 0 }}>Apache Kafka</h1>
            <p style={{ fontSize: 13, color: palette.textDim, margin: 0 }}>Deep Dive — Distributed Event Streaming Platform</p>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ display: "flex", gap: 5, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate(s.id)}
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              border: "none",
              background: activeSection === s.id ? palette.accent : palette.surface,
              color: activeSection === s.id ? "#fff" : palette.textDim,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: activeSection === s.id ? `0 2px 8px ${palette.accent}40` : "0 1px 2px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: "all 0.15s",
              fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: 13 }}>{s.icon}</span> {s.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 24 }}>
        <div key={activeSection} style={{ animation: "fadeSlideUp 0.4s ease both" }}>
          <ActiveComponent />
        </div>

        {/* Prev/Next navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 20, borderTop: `1px solid ${palette.border}` }}>
          {(() => {
            const idx = SECTIONS.findIndex((s) => s.id === activeSection);
            const prev = idx > 0 ? SECTIONS[idx - 1] : null;
            const next = idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;
            return (
              <>
                {prev ? (
                  <button onClick={() => navigate(prev.id)} style={{
                    background: "transparent", border: `1px solid ${palette.border}`, borderRadius: 8,
                    padding: "10px 20px", color: palette.textDim, cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                  }}>
                    ← {prev.label}
                  </button>
                ) : <div />}
                {next && (
                  <button onClick={() => navigate(next.id)} style={{
                    background: `${palette.accent}15`, border: `1px solid ${palette.accent}40`, borderRadius: 8,
                    padding: "10px 20px", color: palette.accent, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                  }}>
                    {next.label} →
                  </button>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}