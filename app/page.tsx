"use client";

import { useState } from "react";

interface FormData {
  projectName: string;
  apy: string;
  strategy: string;
  description: string;
}

interface GeneratedContent {
  twitterThread: string[];
  launchPost: string;
  oneLiner: string;
  pitchSummary: string;
}

type Tab = "thread" | "launch" | "oneliner" | "pitch";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "thread",   label: "Twitter Thread", emoji: "🧵" },
  { id: "launch",   label: "Launch Post",    emoji: "🚀" },
  { id: "oneliner", label: "One-Liner",      emoji: "⚡" },
  { id: "pitch",    label: "Pitch Summary",  emoji: "💼" },
];

async function generateContent(form: FormData): Promise<GeneratedContent> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  if (!res.ok) throw new Error("Generation failed");
  return res.json();
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="copy-btn">
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

export default function Home() {
  const [form, setForm] = useState<FormData>({
    projectName: "",
    apy: "",
    strategy: "",
    description: "",
  });
  const [output, setOutput]   = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("thread");

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleGenerate() {
    if (!form.projectName || !form.description) {
      setError("Project name and description are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generateContent(form);
      setOutput(result);
      setActiveTab("thread");
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const tabContent: Record<Tab, string> = {
    thread:   output?.twitterThread.join("\n\n") ?? "",
    launch:   output?.launchPost ?? "",
    oneliner: output?.oneLiner ?? "",
    pitch:    output?.pitchSummary ?? "",
  };

  return (
    <>
      <div className="grain" />
      <div className="app">

        {/* Header */}
        <header className="header">
          <div className="header-inner">
            <div className="logo">
              <span className="logo-dot" />
              SolNeutral
              <span className="logo-tag">Launch Kit</span>
            </div>
            <p className="header-tagline">
              Turn your crypto idea into launch-ready content
            </p>
          </div>
        </header>

        {/* Main split layout */}
        <main className="main">

          {/* LEFT — Input form */}
          <section className="panel panel-left">
            <div className="panel-header">
              <h2 className="panel-title">Your Project</h2>
              <p className="panel-sub">Fill in the details below</p>
            </div>

            <div className="form">
              <div className="field">
                <label className="label">Project Name <span className="req">*</span></label>
                <input
                  className="input"
                  placeholder="e.g. SolNeutral"
                  value={form.projectName}
                  onChange={set("projectName")}
                />
              </div>

              <div className="field">
                <label className="label">APY <span className="hint">(optional)</span></label>
                <div className="input-wrap">
                  <input
                    className="input input-with-suffix"
                    placeholder="e.g. 14.81"
                    type="number"
                    value={form.apy}
                    onChange={set("apy")}
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>

              <div className="field">
                <label className="label">Strategy <span className="hint">(optional)</span></label>
                <input
                  className="input"
                  placeholder="e.g. Delta-neutral, funding rate arbitrage"
                  value={form.strategy}
                  onChange={set("strategy")}
                />
              </div>

              <div className="field">
                <label className="label">Description <span className="req">*</span></label>
                <textarea
                  className="input textarea"
                  placeholder="What does your project do? Who is it for? What problem does it solve?"
                  rows={5}
                  value={form.description}
                  onChange={set("description")}
                />
              </div>

              {error && <p className="error-msg">{error}</p>}

              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner" />
                    Generating...
                  </span>
                ) : (
                  <>
                    <span className="btn-icon">✦</span>
                    Generate Content
                  </>
                )}
              </button>

              <p className="form-note">
                Powered by AI · Built from SolNeutral experience
              </p>
            </div>
          </section>

          {/* RIGHT — Output */}
          <section className="panel panel-right">
            <div className="panel-header">
              <h2 className="panel-title">Generated Output</h2>
              <p className="panel-sub">
                {output ? "Your launch-ready content" : "Fill the form and click generate"}
              </p>
            </div>

            {!output ? (
              <div className="empty-state">
                <div className="empty-icon">✦</div>
                <p className="empty-title">Ready to generate</p>
                <p className="empty-sub">
                  Enter your project details on the left and click{" "}
                  <strong>Generate Content</strong> to get your launch kit.
                </p>
                <div className="empty-previews">
                  {["Twitter Thread", "Launch Post", "One-Liner", "Pitch Summary"].map((l) => (
                    <div key={l} className="empty-preview-item">{l}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="output">
                {/* Tabs */}
                <div className="tabs">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      className={`tab ${activeTab === t.id ? "tab-active" : ""}`}
                      onClick={() => setActiveTab(t.id)}
                    >
                      <span className="tab-emoji">{t.emoji}</span>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Content area */}
                <div className="output-content">
                  <div className="output-toolbar">
                    <span className="output-label">
                      {TABS.find((t) => t.id === activeTab)?.emoji}{" "}
                      {TABS.find((t) => t.id === activeTab)?.label}
                    </span>
                    <CopyButton text={tabContent[activeTab]} />
                  </div>

                  {activeTab === "thread" && (
                    <div className="thread-list">
                      {output.twitterThread.map((tweet, i) => (
                        <div key={i} className="tweet">
                          <div className="tweet-num">{i + 1}/{output.twitterThread.length}</div>
                          <p className="tweet-text">{tweet}</p>
                          <div className="tweet-chars">
                            <span className={tweet.length > 240 ? "chars-warn" : "chars-ok"}>
                              {tweet.length}/280
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "launch" && (
                    <div className="text-output">
                      <p>{output.launchPost}</p>
                    </div>
                  )}

                  {activeTab === "oneliner" && (
                    <div className="oneliner-output">
                      <p className="oneliner-text">{output.oneLiner}</p>
                      <p className="oneliner-count">
                        {output.oneLiner.split(" ").length} words
                      </p>
                    </div>
                  )}

                  {activeTab === "pitch" && (
                    <div className="text-output">
                      <p>{output.pitchSummary}</p>
                    </div>
                  )}
                </div>

                <button
                  className="regenerate-btn"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? "Regenerating..." : "↺ Regenerate"}
                </button>
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="footer">
          <span>Built from SolNeutral experience</span>
          <span className="footer-dot">·</span>
          <a href="https://solneutral-vault.vercel.app" target="_blank" rel="noopener noreferrer">
            solneutral-vault.vercel.app
          </a>
        </footer>
      </div>
    </>
  );
}
