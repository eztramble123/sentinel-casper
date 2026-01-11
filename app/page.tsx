"use client";

import { useCallback, useState } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";
import { Zap, Code, Layers, Play, Package, ExternalLink } from "lucide-react";

// Custom node styles
const nodeStyles = {
  core: {
    background: "#000",
    color: "#fff",
    border: "3px solid #000",
    padding: "16px 24px",
    fontWeight: 700,
    fontSize: "14px",
    textTransform: "uppercase" as const,
    minWidth: "180px",
    textAlign: "center" as const,
  },
  preset: {
    background: "#fff",
    color: "#000",
    border: "3px solid #000",
    boxShadow: "4px 4px 0 #000",
    padding: "12px 20px",
    fontWeight: 700,
    fontSize: "12px",
    textTransform: "uppercase" as const,
  },
  action: {
    background: "#fff",
    color: "#000",
    border: "3px solid #000",
    boxShadow: "4px 4px 0 #000",
    padding: "16px 24px",
    fontWeight: 700,
    fontSize: "14px",
    textTransform: "uppercase" as const,
  },
  output: {
    background: "#000",
    color: "#fff",
    border: "3px solid #fff",
    padding: "16px 24px",
    fontWeight: 700,
    fontSize: "14px",
    textTransform: "uppercase" as const,
  },
};

// Initial nodes for the flow
const initialNodes: Node[] = [
  {
    id: "install",
    position: { x: 50, y: 50 },
    data: { label: "1. Clone Template" },
    style: nodeStyles.core,
  },
  {
    id: "choose-tools",
    position: { x: 50, y: 180 },
    data: { label: "2. Choose Tool Presets" },
    style: nodeStyles.core,
  },
  {
    id: "preset-wallet",
    position: { x: 300, y: 120 },
    data: { label: "Wallet Tools" },
    style: nodeStyles.preset,
  },
  {
    id: "preset-transfer",
    position: { x: 450, y: 120 },
    data: { label: "Transfer Tools" },
    style: nodeStyles.preset,
  },
  {
    id: "preset-dex",
    position: { x: 300, y: 200 },
    data: { label: "DEX Tools" },
    style: nodeStyles.preset,
  },
  {
    id: "preset-staking",
    position: { x: 450, y: 200 },
    data: { label: "Staking Tools" },
    style: nodeStyles.preset,
  },
  {
    id: "preset-custom",
    position: { x: 600, y: 160 },
    data: { label: "+ Custom Tools" },
    style: { ...nodeStyles.preset, borderStyle: "dashed" },
  },
  {
    id: "configure-prompt",
    position: { x: 50, y: 320 },
    data: { label: "3. Configure Prompt" },
    style: nodeStyles.core,
  },
  {
    id: "prompt-defi",
    position: { x: 300, y: 300 },
    data: { label: "DeFi Prompt" },
    style: nodeStyles.preset,
  },
  {
    id: "prompt-minimal",
    position: { x: 450, y: 300 },
    data: { label: "Minimal Prompt" },
    style: nodeStyles.preset,
  },
  {
    id: "prompt-custom",
    position: { x: 600, y: 300 },
    data: { label: "+ Custom Prompt" },
    style: { ...nodeStyles.preset, borderStyle: "dashed" },
  },
  {
    id: "create-agent",
    position: { x: 50, y: 460 },
    data: { label: "4. Create Agent" },
    style: nodeStyles.core,
  },
  {
    id: "code-block",
    position: { x: 300, y: 420 },
    data: { label: "createAgent({ ... })" },
    style: {
      ...nodeStyles.action,
      fontFamily: "monospace",
      fontSize: "13px",
    },
  },
  {
    id: "connect-ai",
    position: { x: 50, y: 600 },
    data: { label: "5. Connect to AI SDK" },
    style: nodeStyles.core,
  },
  {
    id: "ai-anthropic",
    position: { x: 300, y: 560 },
    data: { label: "Anthropic Claude" },
    style: nodeStyles.preset,
  },
  {
    id: "ai-openai",
    position: { x: 450, y: 560 },
    data: { label: "OpenAI GPT" },
    style: nodeStyles.preset,
  },
  {
    id: "ai-other",
    position: { x: 600, y: 560 },
    data: { label: "Other Models" },
    style: { ...nodeStyles.preset, borderStyle: "dashed" },
  },
  {
    id: "deploy",
    position: { x: 50, y: 740 },
    data: { label: "6. Deploy Agent" },
    style: nodeStyles.core,
  },
  {
    id: "deploy-vercel",
    position: { x: 300, y: 700 },
    data: { label: "Vercel" },
    style: nodeStyles.preset,
  },
  {
    id: "deploy-docker",
    position: { x: 400, y: 700 },
    data: { label: "Docker" },
    style: nodeStyles.preset,
  },
  {
    id: "deploy-node",
    position: { x: 500, y: 700 },
    data: { label: "Node.js" },
    style: nodeStyles.preset,
  },
  {
    id: "live-agent",
    position: { x: 300, y: 800 },
    data: { label: "Your Live AI Agent" },
    style: { ...nodeStyles.output, minWidth: "200px", textAlign: "center" },
  },
];

// Edges connecting the nodes
const initialEdges: Edge[] = [
  {
    id: "e-install-tools",
    source: "install",
    target: "choose-tools",
    animated: true,
    style: { stroke: "#000", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-tools-prompt",
    source: "choose-tools",
    target: "configure-prompt",
    animated: true,
    style: { stroke: "#000", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-prompt-agent",
    source: "configure-prompt",
    target: "create-agent",
    animated: true,
    style: { stroke: "#000", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-agent-ai",
    source: "create-agent",
    target: "connect-ai",
    animated: true,
    style: { stroke: "#000", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-ai-deploy",
    source: "connect-ai",
    target: "deploy",
    animated: true,
    style: { stroke: "#000", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  { id: "e-tools-wallet", source: "choose-tools", target: "preset-wallet", style: { stroke: "#666" } },
  { id: "e-tools-transfer", source: "choose-tools", target: "preset-transfer", style: { stroke: "#666" } },
  { id: "e-tools-dex", source: "choose-tools", target: "preset-dex", style: { stroke: "#666" } },
  { id: "e-tools-staking", source: "choose-tools", target: "preset-staking", style: { stroke: "#666" } },
  { id: "e-tools-custom", source: "choose-tools", target: "preset-custom", style: { stroke: "#666", strokeDasharray: "5,5" } },
  { id: "e-prompt-defi", source: "configure-prompt", target: "prompt-defi", style: { stroke: "#666" } },
  { id: "e-prompt-minimal", source: "configure-prompt", target: "prompt-minimal", style: { stroke: "#666" } },
  { id: "e-prompt-custom", source: "configure-prompt", target: "prompt-custom", style: { stroke: "#666", strokeDasharray: "5,5" } },
  { id: "e-agent-code", source: "create-agent", target: "code-block", style: { stroke: "#666" } },
  { id: "e-ai-anthropic", source: "connect-ai", target: "ai-anthropic", style: { stroke: "#666" } },
  { id: "e-ai-openai", source: "connect-ai", target: "ai-openai", style: { stroke: "#666" } },
  { id: "e-ai-other", source: "connect-ai", target: "ai-other", style: { stroke: "#666", strokeDasharray: "5,5" } },
  { id: "e-deploy-vercel", source: "deploy", target: "deploy-vercel", style: { stroke: "#666" } },
  { id: "e-deploy-docker", source: "deploy", target: "deploy-docker", style: { stroke: "#666" } },
  { id: "e-deploy-node", source: "deploy", target: "deploy-node", style: { stroke: "#666" } },
  {
    id: "e-vercel-live",
    source: "deploy-vercel",
    target: "live-agent",
    style: { stroke: "#000", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-docker-live",
    source: "deploy-docker",
    target: "live-agent",
    style: { stroke: "#000", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-node-live",
    source: "deploy-node",
    target: "live-agent",
    style: { stroke: "#000", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

export default function HomePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedStep(node.id);
  }, []);

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="border-b-3 border-white bg-black p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <h1 className="text-white font-black text-xl uppercase tracking-tight">
                Casper Agent Framework
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="neo-btn px-4 py-2 text-xs flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              TRY DEMO
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn-sm flex items-center gap-2 text-xs"
            >
              <ExternalLink className="w-3 h-3" />
              GITHUB
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Flow diagram */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            attributionPosition="bottom-left"
            style={{ background: "#000" }}
          >
            <Background color="#333" gap={20} />
            <Controls
              style={{
                background: "#fff",
                border: "3px solid #000",
                boxShadow: "4px 4px 0 #000",
              }}
            />
            <MiniMap
              style={{
                background: "#fff",
                border: "3px solid #000",
                boxShadow: "4px 4px 0 #000",
              }}
              nodeColor={(node) => {
                if (node.id.startsWith("preset-") || node.id.startsWith("prompt-") || node.id.startsWith("ai-") || node.id.startsWith("deploy-")) {
                  return "#fff";
                }
                return "#000";
              }}
            />
            <Panel position="top-right" className="neo-card p-4 m-4">
              <h3 className="font-black text-sm uppercase mb-2 text-black">Legend</h3>
              <div className="space-y-2 text-xs text-black">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-black border-2 border-black"></div>
                  <span>Build Steps</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border-2 border-black shadow-brutal-xs"></div>
                  <span>Options</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border-2 border-black border-dashed"></div>
                  <span>Extensible</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Sidebar with details */}
        <aside className="w-96 border-l-3 border-white bg-black overflow-y-auto">
          <StepDetails selectedStep={selectedStep} />
        </aside>
      </div>
    </div>
  );
}

function StepDetails({ selectedStep }: { selectedStep: string | null }) {
  const steps: Record<string, { title: string; icon: React.ReactNode; content: React.ReactNode }> = {
    install: {
      title: "Clone Template",
      icon: <Package className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-white text-sm">Start by cloning the Casper Agent Framework template:</p>
          <pre className="bg-white text-black p-4 font-mono text-xs overflow-x-auto border-3 border-white">
{`git clone https://github.com/
  casper-agent-framework

cd casper-agent-framework
pnpm install`}
          </pre>
        </div>
      ),
    },
    "choose-tools": {
      title: "Choose Tool Presets",
      icon: <Layers className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-white text-sm">Select from pre-built tool presets:</p>
          <ul className="space-y-2 text-white text-sm">
            <li><strong>Wallet:</strong> Balance checks, address info</li>
            <li><strong>Transfer:</strong> Send CSPR tokens</li>
            <li><strong>DEX:</strong> Swap tokens, pool info</li>
            <li><strong>Staking:</strong> Validator queries</li>
          </ul>
          <pre className="bg-white text-black p-4 font-mono text-xs overflow-x-auto border-3 border-white">
{`import { presets } from "@/lib/framework";

const tools = {
  include: [
    presets.wallet,
    presets.dex
  ]
};`}
          </pre>
        </div>
      ),
    },
    "configure-prompt": {
      title: "Configure Prompt",
      icon: <Code className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-white text-sm">Customize your agent&apos;s personality and behavior:</p>
          <pre className="bg-white text-black p-4 font-mono text-xs overflow-x-auto border-3 border-white">
{`const prompt = {
  base: "defi",
  agentName: "MyBot",
  additions: \`
    You specialize in
    NFT trading...
  \`
};`}
          </pre>
        </div>
      ),
    },
    "create-agent": {
      title: "Create Agent",
      icon: <Zap className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-white text-sm">Combine tools and prompts into an agent:</p>
          <pre className="bg-white text-black p-4 font-mono text-xs overflow-x-auto border-3 border-white">
{`import { createAgent } from
  "@/lib/framework";

const agent = createAgent({
  name: "NFT Bot",
  description: "NFT trader",
  tools: {
    include: [presets.defi],
    custom: { mintNFT }
  },
  prompt: {
    base: "defi",
    agentName: "NFT Bot"
  }
});`}
          </pre>
        </div>
      ),
    },
    "connect-ai": {
      title: "Connect to AI SDK",
      icon: <Play className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-white text-sm">Use with Vercel AI SDK and any model:</p>
          <pre className="bg-white text-black p-4 font-mono text-xs overflow-x-auto border-3 border-white">
{`import { streamText } from "ai";
import { anthropic } from
  "@ai-sdk/anthropic";

const result = await streamText({
  model: anthropic("claude-sonnet-4-20250514"),
  system: agent.systemPrompt,
  tools: agent.tools,
  messages
});`}
          </pre>
        </div>
      ),
    },
    deploy: {
      title: "Deploy Agent",
      icon: <Package className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-white text-sm">Deploy to your favorite platform:</p>
          <div className="space-y-3">
            <div className="neo-card-sm p-3">
              <div className="font-bold text-xs uppercase text-black">Vercel</div>
              <div className="text-xs mt-1 text-black">One-click deploy with Edge Runtime</div>
            </div>
            <div className="neo-card-sm p-3">
              <div className="font-bold text-xs uppercase text-black">Docker</div>
              <div className="text-xs mt-1 text-black">Containerized deployment</div>
            </div>
            <div className="neo-card-sm p-3">
              <div className="font-bold text-xs uppercase text-black">Node.js</div>
              <div className="text-xs mt-1 text-black">Traditional server deployment</div>
            </div>
          </div>
        </div>
      ),
    },
  };

  if (!selectedStep || !steps[selectedStep]) {
    return (
      <div className="p-6">
        <h2 className="text-white font-black text-lg uppercase mb-4">
          Build AI Agents on Casper
        </h2>
        <p className="text-white text-sm opacity-75 mb-6">
          Click on any step in the flow diagram to see detailed instructions.
        </p>
        <div className="space-y-4">
          <div className="neo-card p-4">
            <h3 className="font-black text-sm uppercase mb-2 text-black">Quick Start</h3>
            <p className="text-xs text-black">
              Build AI agents on Casper Network in 6 simple steps. Each node represents a stage in the development process.
            </p>
          </div>
          <div className="neo-card p-4">
            <h3 className="font-black text-sm uppercase mb-2 text-black">Presets</h3>
            <p className="text-xs text-black">
              Use pre-built tool presets or add your own custom tools. Mix and match to create your perfect agent.
            </p>
          </div>
          <div className="neo-card p-4">
            <h3 className="font-black text-sm uppercase mb-2 text-black">Try the Demo</h3>
            <p className="text-xs mb-3 text-black">
              See Sentinel in action - a full DeFi agent built with this framework.
            </p>
            <Link href="/demo" className="neo-btn px-4 py-2 text-xs inline-flex items-center gap-2">
              <Play className="w-3 h-3" />
              VIEW DEMO
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const step = steps[selectedStep];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-white flex items-center justify-center border-3 border-white">
          {step.icon}
        </div>
        <h2 className="text-white font-black text-lg uppercase">{step.title}</h2>
      </div>
      {step.content}
    </div>
  );
}
