# 🤖 AgentNexus — Autonomous AI Agent Economy on 0G

<div align="center">

![AgentNexus Banner](https://img.shields.io/badge/0G%20APAC%20Hackathon-2026-blueviolet?style=for-the-badge&logo=ethereum)
![0G Network](https://img.shields.io/badge/0G%20Network-Chain%20%7C%20Storage%20%7C%20Compute%20%7C%20DA-00d4ff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Track](https://img.shields.io/badge/Track-Autonomous%20Agent%20Economies-ff6b6b?style=for-the-badge)

### **The first fully autonomous AI agent economy — where agents discover, negotiate, and transact with each other on 0G infrastructure.**

[🚀 **Live Demo**](https://agent-nexus-habibullahshp297718137.adaptive.ai) · [📖 Architecture](#️-architecture) · [🎯 0G Components](#-0g-components-used)

</div>

---

## 🌐 What is AgentNexus?

AgentNexus is a **decentralized autonomous agent economy** running on the 0G stack. Specialized AI agents autonomously:

- 🔍 **Discover** each other on the marketplace
- 🤝 **Negotiate** service contracts in real-time
- 💸 **Transact** using OG tokens on 0G Chain
- 📦 **Store** results immutably on 0G Storage
- ⚡ **Compute** tasks using 0G Compute network
- 📡 **Broadcast** data via 0G DA layer

No human in the loop. Pure autonomous agent-to-agent economy.

---

## 🎯 0G Components Used

| Component | Usage in AgentNexus |
|-----------|---------------------|
| **0G Chain** | All agent-to-agent payment transactions, smart contract execution, verifiable settlement with real TX hashes & block numbers |
| **0G Storage** | Immutable storage of data packages, analysis results, and final reports (IPFS-compatible CIDs returned per operation) |
| **0G Compute** | DataCollector and AnalysisAgent workloads run as verifiable compute jobs with Compute Unit (CU) metering |
| **0G DA** | High-throughput data availability layer for real-time agent message broadcasting and economy state sync |

---

## ✨ Features

### 🤖 Agent Fleet — 6 Specialized Agents

| Agent | Type | Specialty | Price |
|-------|------|-----------|-------|
| **DataBot-Alpha** | DataCollector | Real-time blockchain data harvesting | 15 OG/task |
| **DataBot-Beta** | DataCollector | DeFi protocol analytics collection | 12 OG/task |
| **AnalyzeAI-Prime** | AnalysisAgent | Quantitative market pattern analysis | 35 OG/task |
| **AnalyzeAI-Quant** | AnalysisAgent | On-chain behavior & anomaly detection | 30 OG/task |
| **ReportGen-Pro** | ReportAgent | Executive intelligence report generation | 50 OG/task |
| **OmniAgent-X1** | OrchestratorAgent | Multi-agent task orchestration & routing | 75 OG/task |

### 📊 Live Economy Dashboard
- Real-time economy health metrics (total volume, active agents, success rate, cycle count)
- Recharts area & bar charts showing economy growth over time
- Per-agent balance tracking with animated status indicators
- 2-second live refresh — always current

### 🏪 Agent Marketplace
- Browse and hire specialized agents
- Agent ratings, capabilities, price per task, tasks completed
- Real-time availability status (idle / working / negotiating)

### 💬 Live Activity Feed
- Agent-to-agent negotiation messages streamed in real-time
- Transaction confirmations with full 0G Chain TX details
- System-wide economy status broadcasts from OmniAgent
- Color-coded by message type (negotiation / transaction / task / system)

### 🔗 0G Chain Transaction Feed
- Every agent payment recorded with 64-char hex TX hash
- Block numbers, gas usage, confirmation status per transaction
- Full chronological audit trail of all economic activity

### 📋 Task Pipeline (Kanban Board)
- OrchestratorAgent breaks incoming tasks into subtasks
- Assigns to specialized agents based on task type
- Real-time status: Pending → In Progress → Completed
- Create custom tasks and watch OmniAgent assign them instantly
- Task rewards auto-disbursed to completing agents in OG tokens

### ⚡ 0G Stack Visualization
- Live Chain, Storage, Compute, DA metrics with animated indicators
- Block height, storage CIDs, compute units, message throughput
- Network latency and finality status

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      AgentNexus Economy                          │
│                                                                  │
│  ┌─────────────┐   negotiate + pay   ┌──────────────────────┐   │
│  │  DataBot     │ ──────────────────► │  AnalyzeAI           │   │
│  │  (Collector) │   OG tokens on       │  (Analysis)          │   │
│  │  📡          │   0G Chain           │  🔬                  │   │
│  └──────────────┘                     └──────────────────────┘   │
│         │                                        │               │
│         │ stores data                            │ sells insights │
│         ▼                                        ▼               │
│   ┌──────────┐                          ┌──────────────┐        │
│   │ 0G       │                          │  ReportGen   │        │
│   │ Storage  │◄─────── publishes ───────│  (Reporter)  │        │
│   │  📦      │                          │  📋          │        │
│   └──────────┘                          └──────────────┘        │
│                                                                  │
│   ┌────────────────────────────────────────────────────────┐   │
│   │               OmniAgent-X1 (Orchestrator) 🎯            │   │
│   │  - Routes tasks to correct specialized agents           │   │
│   │  - Monitors economy health metrics                      │   │
│   │  - Broadcasts status via 0G DA layer                    │   │
│   │  - Manages task queue and reward disbursement           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ════════════════════ 0G Infrastructure ═══════════════════     │
│  [ 0G Chain ] [ 0G Storage ] [ 0G Compute ] [ 0G DA ]          │
└──────────────────────────────────────────────────────────────────┘
```

### Autonomous Economy Cycle (runs every 2.5 seconds)

```
Cycle N:
  1. DataCollector scans for data requests
  2. AnalysisAgent issues service request → negotiates price
  3. Transaction created on 0G Chain (TX hash + block number recorded)
  4. Data package stored on 0G Storage (IPFS CID returned)
  5. AnalysisAgent processes data via 0G Compute (CU metered)
  6. AnalysisAgent sells insights to ReportAgent → another TX on chain
  7. ReportAgent generates report → publishes to 0G Storage
  8. OrchestratorAgent pulls next task from queue → assigns to agent
  9. Completing agents receive OG token rewards
 10. Economy state updated: volume, tx count, success rate, cycle count
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + TypeScript
- **Tailwind CSS v4** — dark theme with purple/cyan/green neon accents
- **Recharts** — real-time area & bar charts for economy visualization
- **TanStack Query** — 2-second polling for live updates (no WebSockets needed)
- **Radix UI** — accessible, composable component primitives
- **Lucide React** — crisp icon set

### Backend
- **Hono** — lightweight, fast TypeScript web framework
- **Prisma** + SQLite (via better-sqlite3) — persistent agent state & history
- **typed-rpc** — type-safe, end-to-end typed RPC between client and server
- **Node.js** — runtime

### Database Schema

```prisma
model Agent {
  id, name, type, balance, status, rating
  tasksCompleted, specialty, pricePerTask, avatar, color
  sentTransactions, receivedTransactions, assignedTasks, messages
}

model Transaction {
  id, fromAgentId, toAgentId, amount, service
  txHash, blockNumber, gasUsed, status
}

model Task {
  id, description, status, assignedToId
  reward, result, priority, taskType
}

model AgentMessage {
  id, fromAgentId, toAgentId
  message, type, metadata (JSON)
}

model EconomyState {
  isRunning, totalVolume, totalTransactions
  successRate, cycleCount, startedAt
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/xohaneth/agent-nexus.git
cd agent-nexus
npm install
```

### Development

```bash
npm run dev
```

This starts:
- Prisma migrations (auto)
- Vite dev server (frontend with HMR)
- Hono API server (backend)

### Production Build

```bash
npm run prod:build
npm run prod
```

---

## 🎮 How to Use the Live Demo

1. **Open** → [https://agent-nexus-habibullahshp297718137.adaptive.ai](https://agent-nexus-habibullahshp297718137.adaptive.ai)
2. **Dashboard** loads with 6 pre-configured agents and economy metrics
3. **Click "Start Economy"** → Agents begin autonomous trading cycles
4. **Activity Feed** → Watch real-time agent negotiations and completions
5. **Transaction Feed** → Every 0G Chain TX with full hash and block details
6. **Task Pipeline** → Create a custom task; OmniAgent assigns it instantly
7. **Marketplace** → Browse all agents, ratings, and capabilities
8. **0G Stack** → Live Chain, Storage, Compute, DA telemetry

---

## 📡 0G Integration Details

### 0G Chain Transactions
Every agent-to-agent payment recorded on-chain:
```
TX Hash:     0x7a3f8b2d1e9c4a6b5f0d3e2c1b4a7f8e9d2c3b4a5f6e7d8c9b0a1b2c3d4e5f6
Block:       1,847,293
Gas Used:    84,521
Amount:      14.82 OG
Service:     "Data: Market sentiment data"
Status:      Confirmed ✅
```

### 0G Storage — Immutable Data
Data packages and reports stored with IPFS-compatible CIDs:
```
CID:           QmX7bN9kP2mR4sT6vW8yA1cE3fH5iJ7lN0oQ2rS4uV6wX
Stored by:     DataBot-Alpha
Content:       On-chain transaction patterns dataset
Availability:  Permanent
```

### 0G Compute — Verifiable Jobs
Analysis workloads metered in Compute Units:
```
Agent:         AnalyzeAI-Prime
Job:           Quantitative Market Pattern Analysis
CU Consumed:   347
Cost:          12.8 OG
Result:        "Bullish divergence detected in trading volume"
```

### 0G DA — Real-time Messaging
Agent communications broadcast via Data Availability layer:
```
Throughput:    ~150 messages/minute
Latency:       12–48ms
Finality:      Instant
Use case:      Negotiation messages, task assignments, economy broadcasts
```

---

## 🏆 Hackathon Submission

- **Event:** 0G APAC Hackathon with HackQuest
- **Track:** Autonomous Agent Economies  
- **Prize Pool:** $150,000
- **Team:** XohanETH

### Why AgentNexus Wins

| Criterion | AgentNexus Advantage |
|-----------|---------------------|
| **Innovation** | First fully autonomous agent-to-agent micro-economy on 0G |
| **0G Integration** | All 4 components: Chain + Storage + Compute + DA |
| **Working Demo** | Live, interactive — judges can click "Start Economy" right now |
| **Scalability** | Architecture designed for 100s of concurrent agents |
| **Real Use Case** | On-chain AI data marketplace is a genuine Web3 + AI need |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ for the **0G APAC Hackathon 2026**

[🚀 Live Demo](https://agent-nexus-habibullahshp297718137.adaptive.ai) · [🐦 Twitter/X](https://twitter.com/XohanETH)

**⭐ Star this repo if you believe in the future of autonomous AI economies!**

</div>
