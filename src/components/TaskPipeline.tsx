import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { useState } from "react";

const taskTypeConfig: Record<string, { label: string; icon: string; color: string }> = {
  data_collection: { label: "Data Collection", icon: "📡", color: "#06b6d4" },
  analysis: { label: "Analysis", icon: "🔬", color: "#8b5cf6" },
  report: { label: "Report", icon: "📋", color: "#10b981" },
  orchestration: { label: "Orchestration", icon: "🎯", color: "#f59e0b" },
};

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: "⏳" },
  in_progress: { label: "In Progress", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: "⚙️" },
  completed: { label: "Completed", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: "✅" },
  failed: { label: "Failed", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: "❌" },
};

export default function TaskPipeline() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ description: "", taskType: "analysis", reward: "100" });
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: () => client.getTasks(),
    refetchInterval: 2000,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      client.createTask(formData.description, formData.taskType, parseFloat(formData.reward) || 100),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setShowCreateForm(false);
      setFormData({ description: "", taskType: "analysis", reward: "100" });
    },
  });

  const tasks = tasksQuery.data ?? [];

  const byStatus = {
    pending: tasks.filter((t) => t.status === "pending"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    completed: tasks.filter((t) => t.status === "completed"),
    failed: tasks.filter((t) => t.status === "failed"),
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Task Pipeline</h2>
          <p className="text-sm text-muted-foreground">Create tasks and watch agents autonomously complete them</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-500/30 transition-colors"
        >
          + Create Task
        </button>
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div className="bg-card border border-purple-500/20 rounded-xl p-5">
          <h3 className="font-semibold mb-4">New Task</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the task for agents..."
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Task Type</label>
                <select
                  value={formData.taskType}
                  onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-500"
                >
                  {Object.entries(taskTypeConfig).map(([key, val]) => (
                    <option key={key} value={key}>{val.icon} {val.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Reward (OG)</label>
                <input
                  type="number"
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-muted/50"
              >
                Cancel
              </button>
              <button
                onClick={() => createMutation.mutate()}
                disabled={!formData.description || createMutation.isPending}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? "Creating..." : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban-style board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(["pending", "in_progress", "completed", "failed"] as const).map((status) => {
          const sc = statusConfig[status];
          const statusTasks = byStatus[status];
          return (
            <div key={status} className="bg-card border border-border rounded-xl p-4">
              <div className={`flex items-center gap-2 mb-4 px-2 py-1.5 rounded-lg border ${sc.bg}`}>
                <span>{sc.icon}</span>
                <span className={`text-sm font-medium ${sc.color}`}>{sc.label}</span>
                <span className={`ml-auto text-xs font-bold ${sc.color}`}>{statusTasks.length}</span>
              </div>
              <div className="space-y-3">
                {statusTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {statusTasks.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground text-xs">No tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskCard({
  task,
}: {
  task: {
    id: string;
    description: string;
    status: string;
    reward: number;
    taskType: string;
    priority: string;
    result: string | null;
    createdAt: Date | string;
    assignedTo: { name: string; avatar: string } | null;
  };
}) {
  const tc = taskTypeConfig[task.taskType] ?? { label: task.taskType, icon: "📌", color: "#6366f1" };
  const priorityColors: Record<string, string> = {
    low: "text-blue-400",
    medium: "text-amber-400",
    high: "text-red-400",
  };

  return (
    <div className="bg-background border border-border rounded-lg p-3 hover:border-purple-500/30 transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-base">{tc.icon}</span>
        <span className={`text-xs ${priorityColors[task.priority] ?? "text-amber-400"} capitalize`}>
          {task.priority}
        </span>
      </div>
      <p className="text-xs text-foreground leading-relaxed mb-3">{task.description}</p>

      {task.assignedTo && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs">{task.assignedTo.avatar}</span>
          <span className="text-xs text-muted-foreground">{task.assignedTo.name}</span>
        </div>
      )}

      {task.result && (
        <p className="text-xs text-green-400 mb-2 leading-relaxed line-clamp-2">{task.result}</p>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-2 mt-2">
        <span style={{ color: tc.color }}>{tc.label}</span>
        <span className="font-mono font-bold text-purple-400">{task.reward} OG</span>
      </div>
    </div>
  );
}
