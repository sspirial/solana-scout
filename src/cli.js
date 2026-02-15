#!/usr/bin/env node
// Solana Scout v2 — Agent-First Wallet Intelligence CLI
// Built autonomously by Hunter (OpenClaw Agent)

import { analyzeWallet } from './index.js';
import { compareWallets } from './compare.js';

const args = process.argv.slice(2);
const flags = {};
const positional = [];

for (const arg of args) {
  if (arg === '--json') flags.json = true;
  else if (arg === '--help' || arg === '-h') flags.help = true;
  else if (arg === 'compare') flags.compare = true;
  else if (arg.startsWith('--rpc=')) flags.rpc = arg.split('=')[1];
  else positional.push(arg);
}

if (flags.help || positional.length === 0) {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║         SOLANA SCOUT v2.0                 ║
  ║   Agent-First Wallet Intelligence         ║
  ╚═══════════════════════════════════════════╝

  Usage:
    solana-scout <wallet-address> [options]
    solana-scout compare <wallet1> <wallet2> [options]

  Commands:
    (default)     Profile a single wallet
    compare       Compare two wallets (shared tokens, similarity, trust)

  Options:
    --json        Output structured JSON (for agent consumption)
    --rpc=<url>   Custom RPC endpoint
    -h, --help    Show this help

  Examples:
    solana-scout 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
    solana-scout 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU --json
    solana-scout compare <wallet1> <wallet2> --json
  `);
  process.exit(0);
}

// Route to compare mode
if (flags.compare) {
  if (positional.length < 2) {
    console.error('\n  ❌ Compare mode requires two wallet addresses.\n');
    process.exit(1);
  }
  const rpcUrl = flags.rpc || 'https://api.mainnet-beta.solana.com';
  try {
    const report = await compareWallets(positional[0], positional[1], rpcUrl);
    if (flags.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      printCompareReport(report);
    }
  } catch (err) {
    if (flags.json) {
      console.log(JSON.stringify({ error: err.message, timestamp: new Date().toISOString() }));
    } else {
      console.error(`\n  ❌ Error: ${err.message}\n`);
    }
    process.exit(1);
  }
  process.exit(0);
}

const address = positional[0];
const rpcUrl = flags.rpc || 'https://api.mainnet-beta.solana.com';

try {
  const report = await analyzeWallet(address, rpcUrl);

  if (flags.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printHumanReport(report);
  }
} catch (err) {
  if (flags.json) {
    console.log(JSON.stringify({ error: err.message, address, timestamp: new Date().toISOString() }));
  } else {
    console.error(`\n  ❌ Error: ${err.message}\n`);
  }
  process.exit(1);
}

function printHumanReport(r) {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║         SOLANA SCOUT REPORT               ║
  ╚═══════════════════════════════════════════╝

  📍 Address:    ${r.address}
  🕐 Scanned:    ${r.timestamp}
  🌐 Network:    Solana Mainnet

  ─── BALANCE ──────────────────────────────
  💰 SOL Balance:     ${r.balance.sol} SOL
  💵 Lamports:        ${r.balance.lamports}

  ─── TOKEN HOLDINGS ─────────────────────
  🪙  Token Accounts:  ${r.tokens.count}
  📊 Non-zero:        ${r.tokens.nonZero}
${r.tokens.holdings.slice(0, 10).map(t =>
  `     • ${t.mint.slice(0, 8)}…  Balance: ${t.uiAmount} (decimals: ${t.decimals})`
).join('\n')}
${r.tokens.count > 10 ? `     ... and ${r.tokens.count - 10} more` : ''}

  ─── TRANSACTION ACTIVITY ───────────────
  📝 Recent Txns:     ${r.transactions.recent}
  📅 First Seen:      ${r.transactions.oldestSignature || 'N/A'}
  📅 Last Active:     ${r.transactions.newestSignature || 'N/A'}
  ⏱️  Avg Frequency:   ${r.transactions.avgFrequency}

  ─── PROGRAMS USED ──────────────────────
${r.programs.list.slice(0, 10).map(p =>
  `     • ${p.id.slice(0, 16)}…  (${p.count} interactions) ${p.label || ''}`
).join('\n')}

  ─── RISK PROFILE ───────────────────────
  🎯 Risk Score:      ${r.risk.score}/100
  🏷️  Risk Level:      ${r.risk.level}
  📋 Factors:
${r.risk.factors.map(f => `     ${f.direction === 'up' ? '🔺' : '🔽'} ${f.label} (${f.impact > 0 ? '+' : ''}${f.impact})`).join('\n')}

  ─── WALLET CLASSIFICATION ──────────────
  🤖 Type:            ${r.classification.type}
  📝 Description:     ${r.classification.description}
  🔖 Tags:            ${r.classification.tags.join(', ')}
  `);
}

function printCompareReport(r) {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║       SOLANA SCOUT — WALLET COMPARE       ║
  ╚═══════════════════════════════════════════╝

  🕐 Scanned:    ${r.timestamp}

  ─── WALLETS ────────────────────────────
  Wallet A: ${r.wallets.wallet1.address}
     Type: ${r.wallets.wallet1.classification}  Risk: ${r.wallets.wallet1.risk}

  Wallet B: ${r.wallets.wallet2.address}
     Type: ${r.wallets.wallet2.classification}  Risk: ${r.wallets.wallet2.risk}

  ─── SIMILARITY SCORE ───────────────────
  🎯 Score:           ${r.similarity.score}/100
  📋 Verdict:         ${r.similarity.relationship}

  Breakdown:
     🪙  Token Overlap:       ${r.similarity.breakdown.tokenOverlap}%
     📈 Activity Similarity: ${r.similarity.breakdown.activitySimilarity}%
     💰 Balance Ratio:       ${r.similarity.breakdown.balanceRatio}%
     🏷️  Same Classification:  ${r.similarity.breakdown.classificationMatch ? 'Yes' : 'No'}
     🔖 Shared Tags:         ${r.similarity.breakdown.sharedTags.join(', ') || 'None'}

  ─── SHARED TOKENS ──────────────────────
  🪙  Shared: ${r.sharedTokens.count} tokens
${r.sharedTokens.tokens.slice(0, 10).map(t =>
  `     • ${t.mint.slice(0, 8)}…  A: ${t.wallet1Balance}  B: ${t.wallet2Balance}`
).join('\n')}

  ─── BALANCE ────────────────────────────
  Wallet A: ${r.balanceComparison.wallet1.sol} SOL
  Wallet B: ${r.balanceComparison.wallet2.sol} SOL
  Ratio:    ${r.balanceComparison.ratio}

  ─── RISK ───────────────────────────────
  Wallet A: ${r.riskComparison.wallet1.score}/100 (${r.riskComparison.wallet1.level})
  Wallet B: ${r.riskComparison.wallet2.score}/100 (${r.riskComparison.wallet2.level})
  Delta:    ${r.riskComparison.delta} points
  `);
}
