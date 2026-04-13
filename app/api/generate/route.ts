import { NextRequest, NextResponse } from "next/server";

// ─── Swap in your real API key here ──────────────────────────────────────────
// Option A: OpenAI
//   import OpenAI from "openai";
//   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//
// Option B: Anthropic
//   import Anthropic from "@anthropic-ai/sdk";
//   const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
// ─────────────────────────────────────────────────────────────────────────────

function mockGenerate(data: {
  projectName: string;
  apy: string;
  strategy: string;
  description: string;
}) {
  const { projectName, apy, strategy, description } = data;
  const apyStr = apy ? `${apy}% APY` : "industry-leading yields";
  const stratStr = strategy || "delta-neutral strategy";

  const twitterThread = [
    `🧵 Introducing ${projectName} — the future of passive yield on Solana. A thread on why this changes everything. 👇`,
    `The problem: Most DeFi yields are either fake, unsustainable, or locked behind complexity no normal person can navigate. ${projectName} fixes this.`,
    `${projectName} uses a ${stratStr} to generate ${apyStr} — market-neutral, real yield, and fully on-chain. No smoke and mirrors.`,
    `${description.slice(0, 200)}${description.length > 200 ? "..." : ""}`,
    `Why Solana? Speed. Cost. Ecosystem. Transactions settle in 400ms for less than $0.001. This is where DeFi actually works at scale.`,
    `The numbers: ${apyStr} net. 90-day rolling lock. USDC base asset. Verified on-chain. Every dollar is traceable on Solscan.`,
    `Who is ${projectName} for? → Builders who want yield without babysitting positions\n→ Funds who need verifiable on-chain returns\n→ Anyone tired of fake APY promises`,
    `Security first. Smart contract deployed on Solana devnet. Anchor framework. Every instruction is open-source and auditable. No black boxes.`,
    `We're early. The delta-neutral playbook is proven in TradFi. ${projectName} brings it on-chain, permissionlessly, for everyone.`,
    `This is just the beginning. Follow for updates, strategy breakdowns, and live yield data.\n\nJoin the ${projectName} community. 🟢\n\n${projectName}.xyz`,
  ];

  const launchPost =
    `🚀 ${projectName} is live.\n\n` +
    `${apyStr} · ${stratStr} · USDC base · Solana devnet\n\n` +
    `${description.slice(0, 180)}${description.length > 180 ? "..." : ""}\n\n` +
    `Real yield. On-chain. Verifiable.\n\n` +
    `→ Try it now and see your position grow in real time.\n\n` +
    `#Solana #DeFi #${projectName.replace(/\s+/g, "")} #YieldFarming`;

  const oneLiner = `${projectName}: ${apyStr} delta-neutral USDC yield on Solana, fully on-chain.`;

  const pitchSummary =
    `${projectName} is a delta-neutral USDC vault built on Solana that generates ${apyStr} through a ${stratStr}. ` +
    `Unlike traditional yield protocols, ${projectName} maintains market neutrality by simultaneously holding spot and perpetual positions, ` +
    `capturing funding rates as pure yield with minimal directional risk. ` +
    `Built with Anchor smart contracts and deployed on Solana devnet, every deposit, position, and yield event is fully verifiable on-chain — ` +
    `giving users the transparency and security that DeFi was always supposed to deliver.`;

  return { twitterThread, launchPost, oneLiner, pitchSummary };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectName, apy, strategy, description } = body;

    if (!projectName || !description) {
      return NextResponse.json(
        { error: "projectName and description are required." },
        { status: 400 }
      );
    }

    // ── Uncomment to use real AI ──────────────────────────────────────────
    // const prompt = `
    //   Generate launch content for a crypto project:
    //   Name: ${projectName}
    //   APY: ${apy}%
    //   Strategy: ${strategy}
    //   Description: ${description}
    //
    //   Return ONLY valid JSON with these keys:
    //   - twitterThread: array of 10 tweets (max 280 chars each)
    //   - launchPost: string (short, engaging launch announcement)
    //   - oneLiner: string (under 12 words)
    //   - pitchSummary: string (3-4 sentences)
    // `;
    //
    // OpenAI example:
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4o",
    //   messages: [{ role: "user", content: prompt }],
    //   response_format: { type: "json_object" },
    // });
    // const result = JSON.parse(completion.choices[0].message.content!);
    // return NextResponse.json(result);
    // ─────────────────────────────────────────────────────────────────────

    // Mock generation (works without API key)
    const result = mockGenerate({ projectName, apy, strategy, description });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
