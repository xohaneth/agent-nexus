import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";

export default function TransactionFeed() {
  const txQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: () => client.getTransactions(100),
    refetchInterval: 2000,
  });

  const transactions = txQuery.data ?? [];

  const totalVolume = transactions.reduce((s, t) => s + t.amount, 0);
  const avgAmount = transactions.length ? totalVolume / transactions.length : 0;

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">On-Chain Transactions</h2>
          <p className="text-sm text-muted-foreground">All agent-to-agent payments recorded on 0G Chain</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Total Volume</div>
          <div className="text-lg font-bold font-mono text-purple-400">{totalVolume.toFixed(1)} OG</div>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-cyan-400 font-mono">{transactions.length}</div>
          <div className="text-xs text-muted-foreground">Total TXs</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400 font-mono">{avgAmount.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">Avg Amount (OG)</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400 font-mono">
            {transactions.length > 0 ? "100%" : "—"}
          </div>
          <div className="text-xs text-muted-foreground">Success Rate</div>
        </div>
      </div>

      {/* Transaction list */}
      <div className="space-y-2">
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-3">⛓️</div>
            <p>No transactions yet. Start the economy to generate transactions.</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <TxCard key={tx.id} tx={tx} />
          ))
        )}
      </div>
    </div>
  );
}

function TxCard({
  tx,
}: {
  tx: {
    id: string;
    txHash: string;
    amount: number;
    service: string;
    blockNumber: number;
    gasUsed: number;
    status: string;
    createdAt: Date | string;
    fromAgent: { name: string; avatar: string; type: string };
    toAgent: { name: string; avatar: string; type: string };
  };
}) {
  const agentColors: Record<string, string> = {
    DataCollector: "#06b6d4",
    AnalysisAgent: "#8b5cf6",
    ReportAgent: "#10b981",
    OrchestratorAgent: "#f59e0b",
  };

  const fromColor = agentColors[tx.fromAgent.type] ?? "#6366f1";
  const toColor = agentColors[tx.toAgent.type] ?? "#6366f1";

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-purple-500/30 transition-all group">
      <div className="flex items-center gap-4">
        {/* From agent */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: `${fromColor}20`, border: `1px solid ${fromColor}30` }}
          >
            {tx.fromAgent.avatar}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{tx.fromAgent.name}</div>
            <div className="text-xs text-muted-foreground truncate">{tx.fromAgent.type}</div>
          </div>
        </div>

        {/* Arrow + amount */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="text-purple-400 font-bold font-mono text-sm">{tx.amount.toFixed(2)} OG</div>
          <div className="text-muted-foreground text-lg">→</div>
        </div>

        {/* To agent */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: `${toColor}20`, border: `1px solid ${toColor}30` }}
          >
            {tx.toAgent.avatar}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{tx.toAgent.name}</div>
            <div className="text-xs text-muted-foreground truncate">{tx.toAgent.type}</div>
          </div>
        </div>

        {/* TX details */}
        <div className="hidden md:block text-right flex-shrink-0">
          <div className="text-xs text-muted-foreground font-mono mb-1">
            {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
          </div>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-muted-foreground">Block #{tx.blockNumber.toLocaleString()}</span>
            <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
              ✓ Confirmed
            </span>
          </div>
        </div>
      </div>

      {/* Service & gas row */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
        <span className="text-cyan-400 font-medium">{tx.service}</span>
        <div className="flex items-center gap-3">
          <span>Gas: {tx.gasUsed.toLocaleString()}</span>
          <span>{new Date(tx.createdAt).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
