import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import Dashboard from "@/components/Dashboard";
import AgentMarketplace from "@/components/AgentMarketplace";
import TransactionFeed from "@/components/TransactionFeed";
import TaskPipeline from "@/components/TaskPipeline";
import ActivityFeed from "@/components/ActivityFeed";
import ZeroGStack from "@/components/ZeroGStack";
import Header from "@/components/Header";

export type Tab = "dashboard" | "marketplace" | "transactions" | "tasks" | "activity" | "stack";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const queryClient = useQueryClient();

  // Initialize economy on load
  const initQuery = useMutation({
    mutationFn: () => client.initializeEconomy(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      queryClient.invalidateQueries({ queryKey: ["economyState"] });
    },
  });

  useEffect(() => {
    initQuery.mutate();
  }, []);

  // Economy state
  const economyQuery = useQuery({
    queryKey: ["economyState"],
    queryFn: () => client.getEconomyState(),
    refetchInterval: 2000,
  });

  // Run economy cycle
  const cycleMutation = useMutation({
    mutationFn: () => client.runEconomyCycle(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["economyState"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });

  // Auto-run cycles when economy is running
  useEffect(() => {
    if (!economyQuery.data?.isRunning) return;
    const interval = setInterval(() => {
      cycleMutation.mutate();
    }, 2500);
    return () => clearInterval(interval);
  }, [economyQuery.data?.isRunning]);

  const startMutation = useMutation({
    mutationFn: () => client.startEconomy(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["economyState"] });
    },
  });

  const stopMutation = useMutation({
    mutationFn: () => client.stopEconomy(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["economyState"] });
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      await client.stopEconomy();
      await client.resetEconomy();
      await client.initializeEconomy();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const isRunning = economyQuery.data?.isRunning ?? false;

  const handleToggleEconomy = () => {
    if (isRunning) {
      stopMutation.mutate();
    } else {
      startMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg text-foreground">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRunning={isRunning}
        onToggleEconomy={handleToggleEconomy}
        onReset={() => resetMutation.mutate()}
        economyState={economyQuery.data}
      />

      <main className="container mx-auto px-4 pb-8 max-w-7xl">
        {activeTab === "dashboard" && <Dashboard isRunning={isRunning} />}
        {activeTab === "marketplace" && <AgentMarketplace />}
        {activeTab === "transactions" && <TransactionFeed />}
        {activeTab === "tasks" && <TaskPipeline />}
        {activeTab === "activity" && <ActivityFeed />}
        {activeTab === "stack" && <ZeroGStack />}
      </main>
    </div>
  );
}

export default App;
