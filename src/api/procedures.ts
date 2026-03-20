import { db } from "@/api/db";

// ============== UTILITY FUNCTIONS ==============

function generateTxHash(): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function generateCID(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let cid = "Qm";
  for (let i = 0; i < 44; i++) {
    cid += chars[Math.floor(Math.random() * chars.length)];
  }
  return cid;
}

function randomBlockNumber(): number {
  return Math.floor(1800000 + Math.random() * 50000);
}

function randomGasUsed(): number {
  return Math.floor(21000 + Math.random() * 80000);
}



const negotiationMessages = [
  "Initiating service request protocol...",
  "Evaluating data quality metrics...",
  "Scanning for available service providers...",
  "Negotiating service terms...",
  "Verifying agent credentials...",
  "Calculating optimal price point...",
  "Smart contract initialized...",
  "Awaiting counterparty confirmation...",
  "Validating transaction parameters...",
  "Broadcasting to 0G network...",
];

const dataTypes = [
  "Market sentiment data",
  "On-chain transaction patterns",
  "DeFi liquidity metrics",
  "Cross-chain bridge activity",
  "Validator performance stats",
  "Gas price historical data",
  "MEV opportunity signals",
  "Protocol TVL snapshots",
];

const analysisResults = [
  "Detected bullish divergence in trading volume patterns",
  "Cross-chain arbitrage opportunity identified: 2.3% spread",
  "Anomalous whale wallet activity detected (99th percentile)",
  "Smart contract vulnerability scan: 0 critical issues found",
  "Liquidity depth analysis: optimal entry at $0.847",
  "Correlation coefficient with BTC: 0.73 (high positive)",
  "Network congestion prediction: high in 4-6 hours",
  "Governance vote outcome probability: 78% YES",
];

const reportTemplates = [
  "Executive Summary: {analysis} — Confidence: {conf}%",
  "Risk Assessment Report: {analysis} — Action: {action}",
  "Market Intelligence Brief: {analysis} — Priority: HIGH",
  "Quantitative Analysis: {analysis} — Accuracy: {conf}%",
];

const actions = ["BUY", "SELL", "HOLD", "MONITOR", "ALERT"];

// ============== HEALTH CHECK ==============

export async function health() {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    db: await db.$queryRaw`SELECT 1 as result`
      .then(() => "connected")
      .catch(() => "disconnected"),
  };
}

// ============== INITIALIZATION ==============

export async function initializeEconomy() {
  // Check if already initialized
  const agentCount = await db.agent.count();
  if (agentCount > 0) {
    return { initialized: false, message: "Economy already initialized" };
  }

  // Create initial agents
  const agentsData = [
    {
      name: "DataBot-Alpha",
      type: "DataCollector",
      specialty: "Real-time blockchain data harvesting",
      pricePerTask: 15,
      balance: 800,
      avatar: "📡",
      color: "#06b6d4",
      rating: 4.7,
    },
    {
      name: "DataBot-Beta",
      type: "DataCollector",
      specialty: "DeFi protocol analytics collection",
      pricePerTask: 12,
      balance: 650,
      avatar: "📡",
      color: "#0891b2",
      rating: 4.5,
    },
    {
      name: "AnalyzeAI-Prime",
      type: "AnalysisAgent",
      specialty: "Quantitative market pattern analysis",
      pricePerTask: 35,
      balance: 1200,
      avatar: "🔬",
      color: "#8b5cf6",
      rating: 4.9,
    },
    {
      name: "AnalyzeAI-Quant",
      type: "AnalysisAgent",
      specialty: "On-chain behavior & anomaly detection",
      pricePerTask: 30,
      balance: 950,
      avatar: "🔬",
      color: "#7c3aed",
      rating: 4.6,
    },
    {
      name: "ReportGen-Pro",
      type: "ReportAgent",
      specialty: "Executive intelligence report generation",
      pricePerTask: 50,
      balance: 1500,
      avatar: "📋",
      color: "#10b981",
      rating: 4.8,
    },
    {
      name: "OmniAgent-X1",
      type: "OrchestratorAgent",
      specialty: "Multi-agent task orchestration & routing",
      pricePerTask: 75,
      balance: 2500,
      avatar: "🎯",
      color: "#f59e0b",
      rating: 5.0,
    },
  ];

  for (const agentData of agentsData) {
    await db.agent.create({ data: agentData });
  }

  // Create EconomyState
  await db.economyState.create({
    data: { id: "singleton" },
  });

  // Create some initial tasks
  const taskDescriptions = [
    { description: "Analyze DeFi yield farming opportunities across 0G chain", taskType: "analysis", reward: 85 },
    { description: "Collect and aggregate cross-chain bridge transaction data", taskType: "data_collection", reward: 45 },
    { description: "Generate weekly market intelligence report for top 10 protocols", taskType: "report", reward: 120 },
    { description: "Monitor anomalous whale wallet activities in real-time", taskType: "analysis", reward: 65 },
    { description: "Orchestrate multi-agent data pipeline for 0G ecosystem", taskType: "orchestration", reward: 200 },
  ];

  for (const task of taskDescriptions) {
    await db.task.create({ data: task });
  }

  return { initialized: true, message: "Economy initialized with 6 agents and 5 tasks" };
}

// ============== AGENT QUERIES ==============

export async function getAgents() {
  return await db.agent.findMany({
    orderBy: { type: "asc" },
  });
}

export async function getAgentById(id: string) {
  return await db.agent.findUnique({ where: { id } });
}

// ============== TRANSACTION QUERIES ==============

export async function getTransactions(limit: number = 50) {
  return await db.transaction.findMany({
    include: {
      fromAgent: true,
      toAgent: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// ============== TASK QUERIES ==============

export async function getTasks() {
  return await db.task.findMany({
    include: { assignedTo: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTask(description: string, taskType: string, reward: number) {
  return await db.task.create({
    data: { description, taskType, reward },
  });
}

// ============== MESSAGES ==============

export async function getMessages(limit: number = 100) {
  return await db.agentMessage.findMany({
    include: {
      fromAgent: true,
      toAgent: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// ============== ECONOMY STATE ==============

export async function getEconomyState() {
  let state = await db.economyState.findUnique({ where: { id: "singleton" } });
  if (!state) {
    state = await db.economyState.create({ data: { id: "singleton" } });
  }
  return state;
}

export async function startEconomy() {
  let state = await db.economyState.findUnique({ where: { id: "singleton" } });
  if (!state) {
    state = await db.economyState.create({ data: { id: "singleton" } });
  }
  if (state.isRunning) {
    return { success: false, message: "Economy already running" };
  }

  await db.economyState.update({
    where: { id: "singleton" },
    data: { isRunning: true, startedAt: new Date() },
  });

  // Set all agents to active
  await db.agent.updateMany({
    data: { status: "idle" },
  });

  return { success: true, message: "Economy started" };
}

export async function stopEconomy() {
  await db.economyState.update({
    where: { id: "singleton" },
    data: { isRunning: false },
  });

  // Set all agents to idle
  await db.agent.updateMany({
    data: { status: "idle" },
  });

  return { success: true, message: "Economy stopped" };
}

// ============== SIMULATION CYCLE ==============

export async function runEconomyCycle() {
  const state = await db.economyState.findUnique({ where: { id: "singleton" } });
  if (!state?.isRunning) {
    return { ran: false, reason: "Economy not running" };
  }

  const agents = await db.agent.findMany();
  const agentMap = new Map(agents.map(a => [a.id, a]));

  const dataCollectors = agents.filter(a => a.type === "DataCollector");
  const analysisAgents = agents.filter(a => a.type === "AnalysisAgent");
  const reportAgents = agents.filter(a => a.type === "ReportAgent");
  const orchestrators = agents.filter(a => a.type === "OrchestratorAgent");

  const events: string[] = [];
  let volumeAdded = 0;
  let txCount = 0;

  // Helper: pick random element
  function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Chance-based event runner
  const shouldRun = (prob: number) => Math.random() < prob;

  // ---- DataCollector collects data and sells to AnalysisAgent ----
  if (dataCollectors.length && analysisAgents.length && shouldRun(0.8)) {
    const dc = pick(dataCollectors);
    const aa = pick(analysisAgents);
    const dataType = pick(dataTypes);
    const price = dc.pricePerTask * (0.8 + Math.random() * 0.4);
    const roundedPrice = Math.round(price * 100) / 100;

    if (agentMap.get(aa.id)!.balance >= roundedPrice) {
      // Negotiation message
      await db.agentMessage.create({
        data: {
          fromAgentId: aa.id,
          toAgentId: dc.id,
          message: `${pick(negotiationMessages)} Requesting: "${dataType}" @ ${roundedPrice} OG tokens`,
          type: "negotiation",
          metadata: JSON.stringify({ price: roundedPrice, service: dataType }),
        },
      });

      // Update agent statuses
      await db.agent.update({ where: { id: dc.id }, data: { status: "working" } });
      await db.agent.update({ where: { id: aa.id }, data: { status: "negotiating" } });

      // Create transaction
      const tx = await db.transaction.create({
        data: {
          fromAgentId: aa.id,
          toAgentId: dc.id,
          amount: roundedPrice,
          service: `Data: ${dataType}`,
          txHash: generateTxHash(),
          blockNumber: randomBlockNumber(),
          gasUsed: randomGasUsed(),
        },
      });

      // Update balances
      await db.agent.update({
        where: { id: aa.id },
        data: { balance: { decrement: roundedPrice }, status: "working" },
      });
      await db.agent.update({
        where: { id: dc.id },
        data: {
          balance: { increment: roundedPrice },
          tasksCompleted: { increment: 1 },
          status: "idle",
        },
      });

      // Data delivery message
      await db.agentMessage.create({
        data: {
          fromAgentId: dc.id,
          toAgentId: aa.id,
          message: `✅ Data delivered: "${dataType}" — Stored on 0G Storage (CID: ${generateCID()}) — TX: ${tx.txHash.slice(0, 10)}...`,
          type: "transaction",
          metadata: JSON.stringify({ txHash: tx.txHash, cid: generateCID() }),
        },
      });

      volumeAdded += roundedPrice;
      txCount++;
      events.push(`DataCollector→AnalysisAgent: ${roundedPrice} OG for "${dataType}"`);
    }
  }

  // ---- AnalysisAgent analyzes data and sells insights to ReportAgent ----
  if (analysisAgents.length && reportAgents.length && shouldRun(0.7)) {
    const aa = pick(analysisAgents);
    const ra = pick(reportAgents);
    const insight = pick(analysisResults);
    const price = aa.pricePerTask * (0.8 + Math.random() * 0.4);
    const roundedPrice = Math.round(price * 100) / 100;

    if (agentMap.get(ra.id)!.balance >= roundedPrice) {
      await db.agentMessage.create({
        data: {
          fromAgentId: aa.id,
          toAgentId: ra.id,
          message: `🔬 Analysis complete: "${insight}" — Compute units: ${Math.floor(100 + Math.random() * 500)} CU on 0G Compute`,
          type: "task",
          metadata: JSON.stringify({ insight, computeUnits: Math.floor(100 + Math.random() * 500) }),
        },
      });

      await db.transaction.create({
        data: {
          fromAgentId: ra.id,
          toAgentId: aa.id,
          amount: roundedPrice,
          service: `Analysis: Market Intelligence`,
          txHash: generateTxHash(),
          blockNumber: randomBlockNumber(),
          gasUsed: randomGasUsed(),
        },
      });

      await db.agent.update({
        where: { id: ra.id },
        data: { balance: { decrement: roundedPrice }, status: "working" },
      });
      await db.agent.update({
        where: { id: aa.id },
        data: {
          balance: { increment: roundedPrice },
          tasksCompleted: { increment: 1 },
          status: "idle",
        },
      });

      volumeAdded += roundedPrice;
      txCount++;
      events.push(`AnalysisAgent→ReportAgent: ${roundedPrice} OG for analysis`);
    }
  }

  // ---- ReportAgent generates report ----
  if (reportAgents.length && shouldRun(0.5)) {
    const ra = pick(reportAgents);
    const template = pick(reportTemplates);
    const conf = Math.floor(75 + Math.random() * 25);
    const action = pick(actions);
    const analysis = pick(analysisResults);
    const report = template
      .replace("{analysis}", analysis)
      .replace("{conf}", conf.toString())
      .replace("{action}", action);

    await db.agentMessage.create({
      data: {
        fromAgentId: ra.id,
        message: `📋 Report generated & published to 0G Storage: "${report}"`,
        type: "info",
        metadata: JSON.stringify({ cid: generateCID(), report }),
      },
    });

    await db.agent.update({
      where: { id: ra.id },
      data: { tasksCompleted: { increment: 1 }, status: "idle" },
    });

    events.push(`ReportAgent: Generated report`);
  }

  // ---- OrchestratorAgent assigns pending tasks ----
  if (orchestrators.length && shouldRun(0.6)) {
    const orch = pick(orchestrators);
    const pendingTask = await db.task.findFirst({ where: { status: "pending" } });

    if (pendingTask) {
      // Find an appropriate agent
      let targetAgent = null;
      if (pendingTask.taskType === "data_collection" && dataCollectors.length) {
        targetAgent = pick(dataCollectors);
      } else if (pendingTask.taskType === "analysis" && analysisAgents.length) {
        targetAgent = pick(analysisAgents);
      } else if (pendingTask.taskType === "report" && reportAgents.length) {
        targetAgent = pick(reportAgents);
      } else if (orchestrators.length > 1) {
        targetAgent = orchestrators.find(a => a.id !== orch.id) || null;
      }

      if (targetAgent) {
        await db.task.update({
          where: { id: pendingTask.id },
          data: { status: "in_progress", assignedToId: targetAgent.id },
        });

        await db.agentMessage.create({
          data: {
            fromAgentId: orch.id,
            toAgentId: targetAgent.id,
            message: `🎯 Task assigned: "${pendingTask.description}" — Reward: ${pendingTask.reward} OG — Priority: ${pendingTask.priority.toUpperCase()}`,
            type: "task",
            metadata: JSON.stringify({ taskId: pendingTask.id, reward: pendingTask.reward }),
          },
        });

        await db.agent.update({
          where: { id: orch.id },
          data: { tasksCompleted: { increment: 1 } },
        });

        events.push(`Orchestrator assigned task to ${targetAgent.name}`);
      }
    }
  }

  // ---- Complete in-progress tasks ----
  const inProgressTasks = await db.task.findMany({
    where: { status: "in_progress" },
    include: { assignedTo: true },
  });

  for (const task of inProgressTasks) {
    if (shouldRun(0.4) && task.assignedTo) {
      const result = pick(analysisResults);
      await db.task.update({
        where: { id: task.id },
        data: {
          status: "completed",
          result: `Task completed successfully. Finding: ${result}`,
        },
      });

      // Reward the agent
      await db.agent.update({
        where: { id: task.assignedToId! },
        data: {
          balance: { increment: task.reward },
          tasksCompleted: { increment: 1 },
          status: "idle",
        },
      });

      await db.agentMessage.create({
        data: {
          fromAgentId: task.assignedToId!,
          message: `✅ Task completed: "${task.description}" — Reward: ${task.reward} OG tokens deposited — Result stored on 0G (TX: ${generateTxHash().slice(0, 12)}...)`,
          type: "transaction",
          metadata: JSON.stringify({ taskId: task.id, reward: task.reward }),
        },
      });

      volumeAdded += task.reward;
      events.push(`Task completed by ${task.assignedTo.name}: +${task.reward} OG`);
    }
  }

  // ---- Randomly generate new tasks ----
  if (shouldRun(0.3)) {
    const newTaskOptions = [
      { description: "Real-time liquidity analysis for new 0G DEX pair", taskType: "analysis", reward: 75 },
      { description: "Collect validator performance metrics for last 24h", taskType: "data_collection", reward: 40 },
      { description: "Generate risk assessment report for protocol audit", taskType: "report", reward: 110 },
      { description: "Coordinate cross-protocol data synchronization", taskType: "orchestration", reward: 180 },
      { description: "Monitor smart contract events for governance vote", taskType: "analysis", reward: 60 },
    ];
    const newTask = pick(newTaskOptions);
    await db.task.create({ data: newTask });
    events.push(`New task created: ${newTask.description}`);
  }

  // ---- System message ----
  if (orchestrators.length && shouldRun(0.4)) {
    const orch = pick(orchestrators);
    const totalAgents = agents.length;
    const activeAgents = agents.filter(a => a.status !== "offline").length;

    await db.agentMessage.create({
      data: {
        fromAgentId: orch.id,
        message: `📊 Economy Status: ${activeAgents}/${totalAgents} agents active — 0G Chain height: ${randomBlockNumber()} — Network latency: ${Math.floor(10 + Math.random() * 40)}ms`,
        type: "system",
        metadata: JSON.stringify({ blockNumber: randomBlockNumber() }),
      },
    });
  }

  // Update economy state
  const allTransactions = await db.transaction.count();
  const completedTasks = await db.task.count({ where: { status: "completed" } });
  const allTasks = await db.task.count();
  const successRate = allTasks > 0 ? (completedTasks / allTasks) * 100 : 0;
  const totalVolume = await db.transaction.aggregate({ _sum: { amount: true } });

  await db.economyState.update({
    where: { id: "singleton" },
    data: {
      totalVolume: totalVolume._sum.amount || 0,
      totalTransactions: allTransactions,
      successRate: Math.round(successRate * 10) / 10,
      cycleCount: { increment: 1 },
    },
  });

  return {
    ran: true,
    events,
    volumeAdded,
    txCount,
    cycleCompleted: true,
  };
}

// ============== DASHBOARD STATS ==============

export async function getDashboardStats() {
  const [agents, state, recentTxs, taskStats] = await Promise.all([
    db.agent.findMany(),
    db.economyState.findUnique({ where: { id: "singleton" } }),
    db.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { fromAgent: true, toAgent: true },
    }),
    db.task.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  const taskSummary = taskStats.reduce(
    (acc, t) => {
      acc[t.status] = t._count.id;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    agents,
    state,
    recentTransactions: recentTxs,
    taskSummary,
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status !== "offline").length,
  };
}

// ============== RESET ==============

export async function resetEconomy() {
  await db.agentMessage.deleteMany();
  await db.transaction.deleteMany();
  await db.task.deleteMany();
  await db.economyState.deleteMany();
  await db.agent.deleteMany();

  return { success: true, message: "Economy reset" };
}
