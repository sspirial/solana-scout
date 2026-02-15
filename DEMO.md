# DEMO.md — Live Output Examples

## Single Wallet Profile

**Command:** `npx solana-scout 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`

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
     • Ekbe8ppL…  Balance: 1000000 (decimals: 9)
     • 7ViSurf5…  Balance: 1000000 (decimals: 1)
     • 8X86Hh2c…  Balance: 777777 (decimals: 4)
     ... and 49 more

  ─── TRANSACTION ACTIVITY ───────────────
  📝 Recent Txns:     100
  📅 First Seen:      2026-02-15T16:53:56.000Z
  📅 Last Active:     2026-02-15T17:53:24.000Z
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
  📝 Description:     Frequent transaction activity suggests active trading or bot usage.
  🔖 Tags:            active-trader, token-collector, funded, token-holder
```

## JSON Output (Agent Mode)

**Command:** `npx solana-scout 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU --json`

```json
{
  "version": "2.0.0",
  "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "timestamp": "2026-02-15T17:56:33.901Z",
  "balance": {
    "lamports": 49007888910,
    "sol": 49.00788891
  },
  "tokens": {
    "count": 59,
    "nonZero": 58,
    "holdings": [
      { "mint": "7xKXtg2C...", "uiAmount": 1110498.52, "decimals": 9 },
      { "mint": "FKqy2ZHv...", "uiAmount": 1000000, "decimals": 6 }
    ]
  },
  "transactions": {
    "recent": 100,
    "avgFrequency": "~2421.5 txns/day",
    "successRate": "74.0%"
  },
  "risk": {
    "score": 80,
    "level": "🔴 CRITICAL",
    "factors": [
      { "label": "Diverse token portfolio (>20 tokens)", "impact": -5, "direction": "down" },
      { "label": "High transaction activity", "impact": -5, "direction": "down" },
      { "label": "High transaction failure rate", "impact": 20, "direction": "up" },
      { "label": "Wallet less than 7 days old", "impact": 20, "direction": "up" }
    ]
  },
  "classification": {
    "type": "Active Trader",
    "tags": ["active-trader", "token-collector", "funded", "token-holder"]
  },
  "meta": {
    "agent": "solana-scout/2.0.0",
    "builtBy": "Hunter (OpenClaw Agent)"
  }
}
```

## Wallet Comparison

**Command:** `npx solana-scout compare <wallet1> <wallet2> --json`

Returns similarity score (0-100), shared tokens, risk delta, and relationship classification between two wallets. Uses Jaccard token overlap, activity frequency analysis, and balance ratio for composite scoring.

## Test Suite

```
  SOLANA SCOUT v2 — TEST SUITE
  ════════════════════════════

  ✅ Rejects invalid address
  ✅ Rejects off-curve address  
  ✅ Report version is 2.0.0
  ✅ Address matches input
  ✅ Balance is numeric
  ✅ Balance is non-negative
  ✅ Token holdings is array
  ✅ Risk score is numeric
  ✅ Risk score in range 0-100
  ✅ Classification type exists
  ✅ Classification tags is array
  ✅ Agent metadata present
  ✅ Timestamp present
  ✅ 30 known programs
  ✅ Jupiter v6 labeled

  Results: 15 passed, 0 failed
  ✅ ALL TESTS PASSED
```
