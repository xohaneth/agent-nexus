import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { useState } from "react";

const agentTypeColors: Record<string, string> = {
  DataCollector: "#06b6d4",
  AnalysisAgent: "#8b5cf6",
  ReportAgent: "#10b981",
  OrchestratorAgent: "#f59e0b",
};

const agentTypeLabels: Record<string, string> = {
  DataCollector: "Data Collector",
  AnalysisAgent: "Analysis Agent",
  ReportAgent: "Report Agent",
  OrchestratorAgent: "Orchestrator",
};

const agentCapabilities: Record<string, string[]> = {
  DataCollector: ["Real-time data harvesting", "0G Storage integration", "Cross-chain data feeds", "Low latency streams"],
  AnalysisAgent: ["Quantitative modeling", "Pattern recognition", "Anomaly detection", "0G Compute optimized"],
  ReportAgent: ["Natural language generation", "Executive summaries", "Risk assessment", "0G Storage publishing"],
  OrchestratorAgent: ["Multi-agent routing", "Task decomposition", "Reward distribution", "Economy optimization"],
};

export default function AgentMarketplace() {
  const [selectedType, setSelectedType] = useState<string>("all");

  const agentsQuery = useQuery({
    queryKey: ["agents"],
    queryFn: () => client.getAgents(),
    refetchInterval: 2000,
  });

  const agents = agentsQuery.data ?? [];
  const filtered = selectedType === "all" ? agents : agents.filter((a) => a.type === selectedType);

  const types = ["all", "DataCollector", "AnalysisAgent", "ReportAgent", "OrchestratorAgent"];

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Agent Marketplace</h2>
          <p className="text-sm text-muted-foreground">Browse and monitor deployed autonomous agents</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="text-purple-400 font-bold">{agents.length}</span> agents deployed
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedType === type
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {type === "all" ? "All Agents" : agentTypeLabels[type] ?? type}
          </button>
        ))}
      </div>

      {/* Agent cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((agent) => {
          const color = agentTypeColors[agent.type] ?? "#6366f1";
          const caps = agentCapabilities[agent.type] ?? [];
          return (
            <AgentDetailCard key={agent.id} agent={agent} color={color} capabilities={caps} />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-4xl mb-3">🤖</div>
          <p>No agents found. Initialize the economy first.</p>
        </div>
      )}
    </div>
  );
}

function AgentDetailCard({
  agent,
  color,
  capabilities,
}: {
  agent: {
    id: string;
    name: string;
    type: string;
    balance: number;
    status: string;
    rating: number;
    tasksCompleted: number;
    avatar: string;
    specialty: string;
    pricePerTask: number;
  };
  color: string;
  capabilities: string[];
}) {
  const statusConfig: Record<string, { label: string; dot: string; text: string }> = {
    idle: { label: "Idle", dot: "bg-green-400", text: "text-green-400" },
    working: { label: "Working", dot: "bg-blue-400 animate-pulse", text: "text-blue-400" },
    negotiating: { label: "Negotiating", dot: "bg-amber-400 animate-pulse", text: "text-amber-400" },
    offline: { label: "Offline", dot: "bg-red-400", text: "text-red-400" },
  };

  const sc = statusConfig[agent.status] ?? statusConfig.idle;

  return (
    <div
      className="relative rounded-xl p-5 border transition-all duration-300 hover:scale-[1.01] group"
      style={{
        borderColor: `${color}25`,
        background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`,
      }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 30px ${color}10` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: `${color}20`, border: `1px solid ${color}30` }}
          >
            {agent.avatar}
          </div>
          <div>
            <div className="font-bold">{agent.name}</div>
            <div className="text-xs" style={{ color }}>
              {agentTypeLabels[agent.type] ?? agent.type}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${sc.dot}`} />
          <span className={`text-xs ${sc.text}`}>{sc.label}</span>
        </div>
      </div>

      {/* Specialty */}
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{agent.specialty}</p>

      {/* Capabilities */}
      <div className="flex flex-wrap gap-1 mb-4">
        {capabilities.map((cap) => (
          <span
            key={cap}
            className="text-xs px-2 py-0.5 rounded-full border"
            style={{ borderColor: `${color}30`, color, background: `${color}10` }}
          >
            {cap}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t" style={{ borderColor: `${color}20` }}>
        <div className="text-center">
          <div className="text-sm font-bold font-mono" style={{ color }}>
            {agent.balance.toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground">OG Balance</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-amber-400">⭐ {agent.rating.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">Rating</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-green-400">{agent.tasksCompleted}</div>
          <div className="text-xs text-muted-foreground">Tasks Done</div>
        </div>
      </div>

      {/* Price */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Price per task</span>
        <span className="text-sm font-bold font-mono" style={{ color }}>
          {agent.pricePerTask} OG
        </span>
      </div>
    </div>
  );
}
