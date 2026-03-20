import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";

const messageTypeStyles: Record<string, { bg: string; border: string; icon: string; color: string }> = {
  negotiation: { bg: "bg-amber-500/5", border: "border-amber-500/20", icon: "🤝", color: "text-amber-400" },
  transaction: { bg: "bg-green-500/5", border: "border-green-500/20", icon: "💸", color: "text-green-400" },
  task: { bg: "bg-blue-500/5", border: "border-blue-500/20", icon: "📋", color: "text-blue-400" },
  info: { bg: "bg-purple-500/5", border: "border-purple-500/20", icon: "💬", color: "text-purple-400" },
  system: { bg: "bg-cyan-500/5", border: "border-cyan-500/20", icon: "🖥️", color: "text-cyan-400" },
};

const agentTypeColors: Record<string, string> = {
  DataCollector: "#06b6d4",
  AnalysisAgent: "#8b5cf6",
  ReportAgent: "#10b981",
  OrchestratorAgent: "#f59e0b",
};

export default function ActivityFeed() {
  const messagesQuery = useQuery({
    queryKey: ["messages"],
    queryFn: () => client.getMessages(100),
    refetchInterval: 2000,
  });

  const messages = messagesQuery.data ?? [];

  // Count by type
  const typeCounts = messages.reduce(
    (acc, m) => {
      acc[m.type] = (acc[m.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Activity Feed</h2>
          <p className="text-sm text-muted-foreground">Real-time agent communications and events</p>
        </div>
        <div className="text-sm">
          <span className="text-purple-400 font-bold">{messages.length}</span>
          <span className="text-muted-foreground"> events recorded</span>
        </div>
      </div>

      {/* Type summary */}
      <div className="flex gap-3 flex-wrap">
        {Object.entries(messageTypeStyles).map(([type, style]) => (
          <div key={type} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${style.bg} ${style.border}`}>
            <span className="text-sm">{style.icon}</span>
            <span className={`text-xs font-medium ${style.color} capitalize`}>{type}</span>
            <span className={`text-xs font-bold ${style.color}`}>{typeCounts[type] ?? 0}</span>
          </div>
        ))}
      </div>

      {/* Messages */}
      <div className="space-y-2">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-3">💬</div>
            <p>No activity yet. Start the economy to see agent communications.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const style = messageTypeStyles[msg.type] ?? messageTypeStyles.info;
            const fromColor = agentTypeColors[msg.fromAgent.type] ?? "#6366f1";

            return (
              <div
                key={msg.id}
                className={`rounded-xl p-4 border transition-all hover:scale-[1.005] ${style.bg} ${style.border}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">{style.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <div
                        className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: `${fromColor}20`, color: fromColor, border: `1px solid ${fromColor}30` }}
                      >
                        <span>{msg.fromAgent.avatar}</span>
                        <span>{msg.fromAgent.name}</span>
                      </div>
                      {msg.toAgent && (
                        <>
                          <span className="text-muted-foreground text-xs">→</span>
                          <div
                            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              background: `${agentTypeColors[msg.toAgent.type] ?? "#6366f1"}20`,
                              color: agentTypeColors[msg.toAgent.type] ?? "#6366f1",
                              border: `1px solid ${agentTypeColors[msg.toAgent.type] ?? "#6366f1"}30`,
                            }}
                          >
                            <span>{msg.toAgent.avatar}</span>
                            <span>{msg.toAgent.name}</span>
                          </div>
                        </>
                      )}
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${style.color} capitalize`}>
                        {msg.type}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{msg.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
