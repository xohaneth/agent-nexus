import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { useState, useEffect } from "react";

interface StackMetric {
  value: string;
  label: string;
}

function generateCID() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let cid = "Qm";
  for (let i = 0; i < 10; i++) cid += chars[Math.floor(Math.random() * chars.length)];
  return cid + "...";
}

function generateTxHash() {
  let h = "0x";
  for (let i = 0; i < 8; i++) h += Math.floor(Math.random() * 16).toString(16);
  return h + "...";
}

export default function ZeroGStack() {
  const [blockHeight, setBlockHeight] = useState(1823456);
  const [computeUnits, setComputeUnits] = useState(12847);
  const [storageUsed, setStorageUsed] = useState(2.4);
  const [recentCIDs, setRecentCIDs] = useState<string[]>([]);
  const [recentTxs, setRecentTxs] = useState<string[]>([]);

  const statsQuery = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => client.getDashboardStats(),
    refetchInterval: 2000,
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight((prev) => prev + Math.floor(1 + Math.random() * 3));
      setComputeUnits((prev) => prev + Math.floor(10 + Math.random() * 50));
      setStorageUsed((prev) => Math.round((prev + Math.random() * 0.01) * 100) / 100);
      if (Math.random() > 0.5) {
        setRecentCIDs((prev) => [generateCID(), ...prev].slice(0, 5));
      }
      if (Math.random() > 0.4) {
        setRecentTxs((prev) => [generateTxHash(), ...prev].slice(0, 8));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const state = statsQuery.data?.state;

  const stackLayers = [
    {
      name: "0G Chain",
      description: "EVM-compatible Layer 1 blockchain",
      color: "#8b5cf6",
      icon: "⛓️",
      metrics: [
        { label: "Block Height", value: blockHeight.toLocaleString() },
        { label: "TPS", value: `${Math.floor(100 + Math.random() * 50)}` },
        { label: "Finality", value: "~2s" },
        { label: "Agent TXs", value: String(state?.totalTransactions ?? 0) },
      ] as StackMetric[],
      status: "operational",
      details: [
        "EVM-compatible smart contracts",
        "Agent wallet management",
        "Verifiable on-chain execution",
        "Cross-chain bridge support",
      ],
    },
    {
      name: "0G Compute",
      description: "Decentralized AI compute marketplace",
      color: "#06b6d4",
      icon: "⚡",
      metrics: [
        { label: "Compute Units", value: computeUnits.toLocaleString() },
        { label: "Active Jobs", value: String(statsQuery.data?.activeAgents ?? 0) },
        { label: "Avg Latency", value: `${Math.floor(10 + Math.random() * 30)}ms` },
        { label: "Utilization", value: `${Math.floor(60 + Math.random() * 30)}%` },
      ],
      status: "operational",
      details: [
        "GPU/CPU resource allocation",
        "AI model inference execution",
        "Verifiable computation proofs",
        "Pay-per-compute-unit billing",
      ],
    },
    {
      name: "0G Storage",
      description: "Decentralized data availability layer",
      color: "#10b981",
      icon: "🗄️",
      metrics: [
        { label: "Storage Used", value: `${storageUsed.toFixed(2)} TB` },
        { label: "Data Objects", value: `${Math.floor(1000 + computeUnits / 100)}` },
        { label: "Replication", value: "3x" },
        { label: "Throughput", value: `${Math.floor(100 + Math.random() * 50)} MB/s` },
      ],
      status: "operational",
      details: [
        "Immutable content-addressed storage",
        "CID-based data retrieval",
        "Agent data persistence",
        "Cross-chain data availability",
      ],
    },
    {
      name: "0G DA",
      description: "Data availability layer for scalability",
      color: "#f59e0b",
      icon: "🔮",
      metrics: [
        { label: "DA Throughput", value: `${Math.floor(500 + Math.random() * 200)} MB/s` },
        { label: "Batch Size", value: `${Math.floor(500 + Math.random() * 500)} KB` },
        { label: "Validators", value: "128" },
        { label: "Uptime", value: "99.97%" },
      ],
      status: "operational",
      details: [
        "High-throughput data availability",
        "ZK proof verification",
        "Rollup data publishing",
        "Fraud proof support",
      ],
    },
  ];

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">0G Protocol Stack</h2>
          <p className="text-sm text-muted-foreground">Infrastructure powering the AgentNexus economy</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-400">All Systems Operational</span>
        </div>
      </div>

      {/* Stack layers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {stackLayers.map((layer) => (
          <StackCard key={layer.name} layer={layer} />
        ))}
      </div>

      {/* Live data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent CIDs */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <span>🗄️</span> Recent 0G Storage CIDs
            </h3>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div className="space-y-2 font-mono text-xs">
            {recentCIDs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Waiting for data...</p>
            ) : (
              recentCIDs.map((cid, i) => (
                <div key={i} className="flex items-center gap-2 text-green-400">
                  <span className="text-muted-foreground">▶</span>
                  <span>{cid}</span>
                  <span className="text-muted-foreground ml-auto">{i === 0 ? "just now" : `${(i + 1) * 2}s ago`}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent TX hashes */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <span>⛓️</span> Recent 0G Chain Transactions
            </h3>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          </div>
          <div className="space-y-2 font-mono text-xs">
            {recentTxs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Waiting for transactions...</p>
            ) : (
              recentTxs.map((tx, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-purple-400">{tx}</span>
                  <span className="text-muted-foreground ml-auto">Block #{(blockHeight - i).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Architecture diagram */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-6 text-center">AgentNexus Architecture on 0G</h3>
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-4 flex-wrap justify-center">
            {["📡 DataBot-Alpha", "🔬 AnalyzeAI-Prime", "📋 ReportGen-Pro", "🎯 OmniAgent-X1"].map((agent) => (
              <div
                key={agent}
                className="px-4 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 text-sm text-purple-300"
              >
                {agent}
              </div>
            ))}
          </div>
          <div className="text-muted-foreground text-xs">↓ Agent Layer</div>
          <div className="px-6 py-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm w-full max-w-md text-center">
            🔗 0G Chain — Smart Contract Settlement
          </div>
          <div className="grid grid-cols-3 gap-3 w-full max-w-md">
            <div className="px-3 py-2 rounded-lg border border-green-500/30 bg-green-500/10 text-green-300 text-xs text-center">
              🗄️ 0G Storage
            </div>
            <div className="px-3 py-2 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs text-center">
              ⚡ 0G Compute
            </div>
            <div className="px-3 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs text-center">
              🔮 0G DA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StackCard({
  layer,
}: {
  layer: {
    name: string;
    description: string;
    color: string;
    icon: string;
    metrics: StackMetric[];
    status: string;
    details: string[];
  };
}) {
  return (
    <div
      className="relative rounded-xl p-5 border transition-all hover:scale-[1.01]"
      style={{
        borderColor: `${layer.color}25`,
        background: `linear-gradient(135deg, ${layer.color}08 0%, transparent 60%)`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `${layer.color}20`, border: `1px solid ${layer.color}30` }}
          >
            {layer.icon}
          </div>
          <div>
            <div className="font-bold" style={{ color: layer.color }}>{layer.name}</div>
            <div className="text-xs text-muted-foreground">{layer.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-400 capitalize">{layer.status}</span>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {layer.metrics.map((m) => (
          <div key={m.label} className="bg-background/50 rounded-lg p-2.5">
            <div className="text-xs text-muted-foreground mb-0.5">{m.label}</div>
            <div className="text-sm font-bold font-mono" style={{ color: layer.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        {layer.details.map((detail) => (
          <div key={detail} className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: layer.color }} />
            {detail}
          </div>
        ))}
      </div>
    </div>
  );
}
