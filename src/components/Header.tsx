import { type Tab } from "@/App";

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isRunning: boolean;
  onToggleEconomy: () => void;
  onReset: () => void;
  economyState?: {
    totalVolume: number;
    totalTransactions: number;
    cycleCount: number;
    isRunning: boolean;
  } | null;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "marketplace", label: "Agents", icon: "🤖" },
  { id: "transactions", label: "Transactions", icon: "⛓️" },
  { id: "tasks", label: "Tasks", icon: "📋" },
  { id: "activity", label: "Activity", icon: "💬" },
  { id: "stack", label: "0G Stack", icon: "🔗" },
];

export default function Header({
  activeTab,
  setActiveTab,
  isRunning,
  onToggleEconomy,
  onReset,
  economyState,
}: HeaderProps) {
  return (
    <div className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      {/* Top bar */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-lg font-bold shadow-lg">
                ⚡
              </div>
              {isRunning && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent leading-none">
                AgentNexus
              </h1>
              <p className="text-xs text-muted-foreground">Autonomous Agent Economy on 0G</p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="hidden md:flex items-center gap-6">
            <StatBadge
              label="Volume"
              value={`${(economyState?.totalVolume ?? 0).toFixed(1)} OG`}
              color="text-purple-400"
            />
            <StatBadge
              label="Transactions"
              value={String(economyState?.totalTransactions ?? 0)}
              color="text-cyan-400"
            />
            <StatBadge
              label="Cycles"
              value={String(economyState?.cycleCount ?? 0)}
              color="text-green-400"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleEconomy}
              className={`
                px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2
                ${isRunning
                  ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                  : "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                }
              `}
            >
              {isRunning ? (
                <>
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  Stop Economy
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  Start Economy
                </>
              )}
            </button>
            <button
              onClick={onReset}
              className="px-3 py-2 rounded-lg text-sm text-muted-foreground border border-border hover:bg-muted/50 transition-colors"
              title="Reset Economy"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex gap-1 pb-0 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all
                ${activeTab === tab.id
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-sm font-bold font-mono ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
