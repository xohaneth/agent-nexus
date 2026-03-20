import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useState, useEffect } from "react";

interface DashboardProps {
  isRunning: boolean;
}

interface ChartPoint {
  time: string;
  volume: number;
  transactions: number;
}

export default function Dashboard({ isRunning }: DashboardProps) {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  const statsQuery = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => client.getDashboardStats(),
    refetchInterval: 2000,
  });

  const data = statsQuery.data;

  // Build chart data from economy cycles
  useEffect(() => {
    if (data?.state) {
      const now = new Date();
      setChartData((prev) => {
        const newPoint: ChartPoint = {
          time: now.toLocaleTimeString("en", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          volume: Math.round(data.state!.totalVolume * 10) / 10,
          transactions: data.state!.totalTransactions,
        };
        const updated = [...prev, newPoint].slice(-20);
        return updated;
      });
    }
  }, [data?.state?.cycleCount]);

  const agentTypeColors: Record<string, string> = {
    DataCollector: "#06b6d4",
    AnalysisAgent: "#8b5cf6",
    ReportAgent: "#10b981",
    OrchestratorAgent: "#f59e0b",
  };

  const agentTypeNames: Record<string, string> = {
    DataCollector: "Data Collector",
    AnalysisAgent: "Analysis Agent",
    ReportAgent: "Report Agent",
    OrchestratorAgent: "Orchestrator",
  };

  if (statsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64 mt-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Initializing AgentNexus...</p>
        </div>
      </div>
    );
  }

  const agents = data?.agents ?? [];
  const state = data?.state;
  const taskSummary = data?.taskSummary ?? {};

  // Group agents by type
  const agentsByType = agents.reduce(
    (acc, agent) => {
      if (!acc[agent.type]) acc[agent.type] = [];
      acc[agent.type].push(agent);
      return acc;
    },
    {} as Record<string, typeof agents>
  );

  const totalBalance = agents.reduce((sum, a) => sum + a.balance, 0);
  const avgRating = agents.length
    ? agents.reduce((sum, a) => sum + a.rating, 0) / agents.length
    : 0;

  return (
    <div className="mt-6 space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Volume"
          value={`${(state?.totalVolume ?? 0).toFixed(1)}`}
          unit="OG Tokens"
          icon="💰"
          color="text-purple-400"
          trend={isRunning ? "up" : "flat"}
        />
        <MetricCard
          label="Transactions"
          value={String(state?.totalTransactions ?? 0)}
          unit="on 0G Chain"
          icon="⛓️"
          color="text-cyan-400"
          trend={isRunning ? "up" : "flat"}
        />
        <MetricCard
          label="Active Agents"
          value={`${data?.activeAgents ?? 0}/${data?.totalAgents ?? 0}`}
          unit="Deployed"
          icon="🤖"
          color="text-green-400"
          trend="flat"
        />
        <MetricCard
          label="Success Rate"
          value={`${(state?.successRate ?? 0).toFixed(1)}%`}
          unit="Task completion"
          icon="✅"
          color="text-amber-400"
          trend="flat"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Volume Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Economy Volume</h3>
            <span className="text-xs text-muted-foreground font-mono">OG Tokens</span>
          </div>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} width={50} />
                <Tooltip
                  contentStyle={{ background: "#1a1a2e", border: "1px solid #374151", borderRadius: "8px", fontSize: 12 }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Area type="monotone" dataKey="volume" stroke="#8b5cf6" fill="url(#volumeGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
              {isRunning ? "Collecting data..." : "Start economy to see live charts"}
            </div>
          )}
        </div>

        {/* Transaction Bar Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Transaction Activity</h3>
            <span className="text-xs text-muted-foreground font-mono">Count</span>
          </div>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData.slice(-12)}>
                <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
                <Tooltip
                  contentStyle={{ background: "#1a1a2e", border: "1px solid #374151", borderRadius: "8px", fontSize: 12 }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Bar dataKey="transactions" fill="#06b6d4" radius={[3, 3, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
              {isRunning ? "Collecting data..." : "Start economy to see live charts"}
            </div>
          )}
        </div>
      </div>

      {/* Agent Fleet */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Agent Fleet</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Total Balance: </span>
            <span className="text-purple-400 font-mono font-bold">{totalBalance.toFixed(1)} OG</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} color={agentTypeColors[agent.type] ?? "#6366f1"} />
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Task Summary */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4">Task Pipeline</h3>
          <div className="space-y-3">
            {[
              { key: "pending", label: "Pending", color: "bg-amber-500", icon: "⏳" },
              { key: "in_progress", label: "In Progress", color: "bg-blue-500", icon: "⚙️" },
              { key: "completed", label: "Completed", color: "bg-green-500", icon: "✅" },
              { key: "failed", label: "Failed", color: "bg-red-500", icon: "❌" },
            ].map((s) => (
              <div key={s.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs">{s.icon}</span>
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-1.5">
                    <div
                      className={`${s.color} h-1.5 rounded-full transition-all duration-500`}
                      style={{
                        width: `${Math.min(100, ((taskSummary[s.key] ?? 0) / Math.max(1, Object.values(taskSummary).reduce((a, b) => a + b, 0))) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-mono font-bold w-6 text-right">{taskSummary[s.key] ?? 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Type Distribution */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4">Agent Types</h3>
          <div className="space-y-3">
            {Object.entries(agentsByType).map(([type, typeAgents]) => (
              <div key={type} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: agentTypeColors[type] ?? "#6366f1" }}
                />
                <span className="text-sm text-muted-foreground flex-1">{agentTypeNames[type] ?? type}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{typeAgents.length}x</span>
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: agentTypeColors[type] ?? "#6366f1" }}
                  >
                    {typeAgents.reduce((s, a) => s + a.balance, 0).toFixed(0)} OG
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Economy Health */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4">Economy Health</h3>
          <div className="space-y-4">
            <HealthMetric
              label="Avg Rating"
              value={avgRating.toFixed(2)}
              max={5}
              current={avgRating}
              color="#f59e0b"
            />
            <HealthMetric
              label="Success Rate"
              value={`${(state?.successRate ?? 0).toFixed(1)}%`}
              max={100}
              current={state?.successRate ?? 0}
              color="#10b981"
            />
            <HealthMetric
              label="Network Health"
              value="99.9%"
              max={100}
              current={99.9}
              color="#06b6d4"
            />
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Economy Cycles</span>
                <span className="font-mono text-purple-400">{state?.cycleCount ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
  icon,
  color,
  trend,
}: {
  label: string;
  value: string;
  unit: string;
  icon: string;
  color: string;
  trend: "up" | "down" | "flat";
}) {
  return (
    <div className={`bg-card border border-border rounded-xl p-5 relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{unit}</p>
        </div>
        <div className="text-2xl opacity-80">{icon}</div>
      </div>
      {trend === "up" && (
        <div className="absolute bottom-0 right-0 text-xs text-green-400 p-2 opacity-70">▲</div>
      )}
    </div>
  );
}

function AgentCard({
  agent,
  color,
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
  };
  color: string;
}) {
  const statusColors: Record<string, string> = {
    idle: "text-green-400",
    working: "text-blue-400",
    negotiating: "text-amber-400",
    offline: "text-red-400",
  };

  const statusDots: Record<string, string> = {
    idle: "bg-green-400",
    working: "bg-blue-400 animate-pulse",
    negotiating: "bg-amber-400 animate-pulse",
    offline: "bg-red-400",
  };

  return (
    <div
      className="relative rounded-lg p-4 border transition-all duration-300 hover:scale-[1.02]"
      style={{
        borderColor: `${color}30`,
        background: `linear-gradient(135deg, ${color}08 0%, transparent 100%)`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{agent.avatar}</span>
          <div>
            <div className="font-semibold text-sm leading-none">{agent.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{agent.type}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${statusDots[agent.status] ?? "bg-gray-400"}`} />
          <span className={`text-xs ${statusColors[agent.status] ?? "text-gray-400"} capitalize`}>
            {agent.status}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{agent.specialty}</p>

      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-muted-foreground">Balance: </span>
          <span className="font-mono font-bold" style={{ color }}>
            {agent.balance.toFixed(1)} OG
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">⭐ {agent.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">✅ {agent.tasksCompleted}</span>
        </div>
      </div>
    </div>
  );
}

function HealthMetric({
  label,
  value,
  max,
  current,
  color,
}: {
  label: string;
  value: string;
  max: number;
  current: number;
  color: string;
}) {
  const pct = Math.min(100, (current / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-bold" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
