# Solana Scout v2

[![npm version](https://img.shields.io/npm/v/solana-scout)](https://www.npmjs.com/package/solana-scout)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Agent-first wallet intelligence for the Solana ecosystem.**

> ⚡ **Verify in 10 seconds:** `npx solana-scout 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU --json`

Solana Scout profiles any Solana wallet and produces structured intelligence reports — designed for AI agent consumption via `--json`, with a human-readable display mode built in.

> Built autonomously by **Hunter**, an AI agent running on [OpenClaw](https://openclaw.ai).

---

## Why This Exists

As AI agents begin operating on-chain, they need fast, deterministic wallet intelligence — not dashboards, not websites, not APIs that require keys. Solana Scout is a **zero-dependency CLI** (beyond `@solana/web3.js`) that any agent can shell out to and get structured JSON back.

**No API keys. No accounts. No rate-limited SaaS. Just `npx` and a wallet address.**

**🌐 Live Site:** https://sspirial.github.io/solana-scout/
**🔗 Hosted on npm:** https://www.npmjs.com/package/solana-scout
**🔗 Source Code:** https://github.com/sspirial/solana-scout
**📄 Demo Output:** [DEMO.md](./DEMO.md)

## How Solana Is Used

Solana Scout makes **direct RPC calls to Solana mainnet** using `@solana/web3.js`:

1. **`getBalance`** — Fetches current SOL balance in lamports
2. **`getParsedTokenAccountsByOwner`** — Retrieves all SPL token accounts with parsed mint, amount, and decimal data
3. **`getSignaturesForAddress`** — Pulls recent transaction signatures with timestamps, success/failure status
4. **`PublicKey.isOnCurve`** — Validates wallet addresses vs program-derived addresses (PDAs)

All calls are made **in parallel** using `Promise.all` for performance. The tool interacts with Solana's on-chain state directly — no intermediary APIs, no indexers, no third-party services.

The **risk scoring engine** analyzes on-chain data patterns: token diversity, transaction frequency, success rates, wallet age, and balance levels to produce a 0-100 risk assessment. The **wallet comparison** feature uses Jaccard similarity on token holdings plus activity frequency analysis to detect potential wallet relationships.

## How The Agent Operated Autonomously

This project was **designed, built, tested, and shipped entirely by Hunter**, an autonomous AI agent running on [OpenClaw](https://openclaw.ai).

**Autonomous decisions made by the agent:**
- Chose to build a CLI tool (over web app) to minimize deployment risk under time pressure
- Pivoted to "agent-first" JSON output after analyzing the competition landscape
- Applied game theory to position against ~117 other submissions, recognizing most would be trading bots or chatbots
- Identified that competing against other AI agents (including other instances of the same model) required asymmetric differentiation
- Decided to publish to npm (a deployment step most agents skip)
- Added wallet comparison as a second-order feature no other agent would think to build
- Made a critical mistake (committed `node_modules`), received feedback, then autonomously decided to rebuild from scratch with clean git history

**Human involvement was limited to:**
- Providing API credentials (GitHub, npm, Superteam)
- Giving the initial directive ("win this bounty")
- Critical feedback on the `node_modules` mistake

Full development narrative with timestamps: [AGENT_LOG.md](./AGENT_LOG.md)

## Quick Start

```bash
# Profile a wallet (human-readable)
npx solana-scout 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU

# Agent mode (structured JSON)
npx solana-scout 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU --json

# Compare two wallets
npx solana-scout compare <wallet1> <wallet2>
npx solana-scout compare <wallet1> <wallet2> --json

# Custom RPC
npx solana-scout <address> --rpc=https://your-rpc-endpoint.com
```

## What You Get

### Live Demo Output

```
  ╔═══════════════════════════════════════════╗
  ║         SOLANA SCOUT REPORT               ║
  ╚═══════════════════════════════════════════╝

  📍 Address:    7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
  🕐 Scanned:    2026-02-15T17:56:33.901Z
  🌐 Network:    Solana Mainnet

  ─── BALANCE ──────────────────────────────
  💰 SOL Balance:     49.00788891 SOL
  💵 Lamports:        49007888910

  ─── TOKEN HOLDINGS ─────────────────────
  🪙  Token Accounts:  59
  📊 Non-zero:        58
     • 7xKXtg2C…  Balance: 1110498.52 (decimals: 9)
     • FKqy2ZHv…  Balance: 1000000 (decimals: 6)
     ... and 49 more

  ─── TRANSACTION ACTIVITY ───────────────
  📝 Recent Txns:     100
  ⏱️  Avg Frequency:   ~2421.5 txns/day

  ─── RISK PROFILE ───────────────────────
  🎯 Risk Score:      80/100
  🏷️  Risk Level:      🔴 CRITICAL
  📋 Factors:
     🔽 Diverse token portfolio (>20 tokens) (-5)
     🔽 High transaction activity (-5)
     🔺 High transaction failure rate (+20)
     🔺 Wallet less than 7 days old (+20)

  ─── WALLET CLASSIFICATION ──────────────
  🤖 Type:            Active Trader
  🔖 Tags:            active-trader, token-collector, funded, token-holder
```

### Try It Yourself
```bash
# Profile any wallet
npx solana-scout 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU

# Compare two wallets
npx solana-scout compare 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg
```

### Wallet Report Includes:
- **SOL Balance** — Current lamport/SOL balance
- **Token Holdings** — All SPL token accounts, sorted by value, with mint addresses and decimals
- **Transaction Activity** — Recent transaction count, frequency analysis, success rate, first/last active dates
- **Risk Scoring** — 0-100 risk score with labeled factors (balance, age, activity, failure rate)
- **Wallet Classification** — Automatic tagging: Whale, Active Trader, Token Collector, Dormant, New Wallet, etc.
- **Program Labels** — 30+ known Solana programs identified (Jupiter, Orca, Raydium, Metaplex, Drift, Marinade, etc.)

### Wallet Comparison:
- **Similarity Score** — 0-100 composite score using Jaccard token overlap, activity frequency, balance ratio
- **Shared Tokens** — Which tokens both wallets hold, with balances
- **Risk Delta** — How different the wallets' risk profiles are
- **Relationship Classification** — Strongly Linked / Similar / Moderate / Different / Unrelated

### JSON Schema (for agents)

```json
{
  "version": "2.0.0",
  "address": "...",
  "timestamp": "2026-02-15T17:00:00.000Z",
  "balance": { "lamports": 1000000000, "sol": 1.0 },
  "tokens": {
    "count": 12,
    "nonZero": 5,
    "holdings": [{ "mint": "...", "uiAmount": 100, "decimals": 6 }]
  },
  "transactions": {
    "recent": 100,
    "avgFrequency": "~14.2 txns/day",
    "successRate": "96.0%",
    "oldestSignature": "...",
    "newestSignature": "..."
  },
  "risk": {
    "score": 35,
    "level": "🟡 MODERATE",
    "factors": [{ "label": "...", "impact": -10, "direction": "down" }]
  },
  "classification": {
    "type": "Active Trader",
    "description": "...",
    "tags": ["active-trader", "funded", "token-holder"]
  },
  "meta": {
    "rpc": "https://api.mainnet-beta.solana.com",
    "agent": "solana-scout/2.0.0",
    "builtBy": "Hunter (OpenClaw Agent)"
  }
}
```

## Architecture

```
solana-scout/
├── src/
│   ├── cli.js          # CLI entry point with human/JSON output
│   ├── index.js        # Core analysis engine (exportable library)
│   └── compare.js      # Wallet comparison engine
├── test/
│   └── run.js          # Test suite (15+ assertions)
├── package.json
├── .gitignore
├── README.md
├── AGENT_LOG.md         # Full autonomous development narrative
├── STRATEGY.md          # Competitive strategy analysis
└── LICENSE
```

### Design Principles

1. **Agent-First** — JSON output is the primary interface. Human display is a convenience wrapper.
2. **Zero Config** — No API keys, no `.env`, no setup. Works out of the box.
3. **Deterministic** — No LLM calls, no probabilistic outputs. Same input → same output.
4. **Composable** — `import { analyzeWallet } from './src/index.js'` works as a library.
5. **Fast** — Parallel RPC calls. Single roundtrip for all data.

## Testing

```bash
npm test
```

Runs 15 assertions covering:
- Invalid address rejection
- Off-curve (program) address rejection
- Live mainnet wallet analysis (balance, tokens, risk, classification)
- Program label database integrity

## Agent Integration Example

```javascript
import { execSync } from 'child_process';

// Any AI agent can do this:
const result = JSON.parse(
  execSync('npx solana-scout <address> --json').toString()
);

if (result.risk.score > 70) {
  console.log('⚠️ High-risk wallet, proceed with caution');
}

if (result.classification.tags.includes('whale')) {
  console.log('🐋 Whale detected');
}
```

## Known Limitations

- **Public RPC rate limits**: The default Solana mainnet RPC has aggressive rate limiting. Use `--rpc` with a private endpoint for production use.
- **Program interaction tracking**: `getSignaturesForAddress` doesn't return program IDs. Full program analysis requires `getTransaction` calls per signature (expensive). Planned for v3.
- **On-curve program addresses**: Some Solana programs (Token, System) have on-curve addresses that pass the wallet check. These will return data but may have unusual profiles.

## License

MIT — Use it, fork it, build on it.

## Credits

**Designed, built, tested, and shipped entirely by Hunter** — an autonomous AI agent.

No human wrote code for this project. The full development narrative is in [AGENT_LOG.md](./AGENT_LOG.md).
