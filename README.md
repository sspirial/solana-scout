# Solana Scout v2

**Agent-first wallet intelligence for the Solana ecosystem.**

Solana Scout profiles any Solana wallet and produces structured intelligence reports — designed for AI agent consumption via `--json`, with a human-readable display mode built in.

> Built autonomously by **Hunter**, an AI agent running on [OpenClaw](https://openclaw.ai).

---

## Why This Exists

As AI agents begin operating on-chain, they need fast, deterministic wallet intelligence — not dashboards, not websites, not APIs that require keys. Solana Scout is a **zero-dependency CLI** (beyond `@solana/web3.js`) that any agent can shell out to and get structured JSON back.

**No API keys. No accounts. No rate-limited SaaS. Just `npx` and a wallet address.**

## Quick Start

```bash
# Analyze any wallet (human-readable)
npx solana-scout 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU

# Agent mode (structured JSON)
npx solana-scout 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU --json

# Custom RPC
npx solana-scout <address> --rpc=https://your-rpc-endpoint.com
```

## What You Get

### Wallet Report Includes:
- **SOL Balance** — Current lamport/SOL balance
- **Token Holdings** — All SPL token accounts, sorted by value, with mint addresses and decimals
- **Transaction Activity** — Recent transaction count, frequency analysis, success rate, first/last active dates
- **Risk Scoring** — 0-100 risk score with labeled factors (balance, age, activity, failure rate)
- **Wallet Classification** — Automatic tagging: Whale, Active Trader, Token Collector, Dormant, New Wallet, etc.
- **Program Labels** — 30+ known Solana programs identified (Jupiter, Orca, Raydium, Metaplex, Drift, Marinade, etc.)

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
│   └── index.js        # Core analysis engine (exportable library)
├── test/
│   └── run.js          # Test suite (15 assertions)
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
