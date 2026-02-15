// Solana Scout v2 — Wallet Comparison Engine
// Compare two wallets: shared tokens, activity overlap, trust scoring

import { analyzeWallet } from './index.js';

/**
 * Compare two Solana wallets and produce a structured comparison report.
 * @param {string} address1 - First wallet address
 * @param {string} address2 - Second wallet address
 * @param {string} rpcUrl - RPC endpoint
 * @returns {Promise<Object>} Comparison report
 */
export async function compareWallets(address1, address2, rpcUrl = 'https://api.mainnet-beta.solana.com') {
  // Analyze both wallets in parallel
  const [wallet1, wallet2] = await Promise.all([
    analyzeWallet(address1, rpcUrl),
    analyzeWallet(address2, rpcUrl),
  ]);

  // Find shared tokens
  const mints1 = new Set(wallet1.tokens.holdings.map(t => t.mint));
  const mints2 = new Set(wallet2.tokens.holdings.map(t => t.mint));
  const sharedMints = [...mints1].filter(m => mints2.has(m));

  const sharedTokens = sharedMints.map(mint => {
    const t1 = wallet1.tokens.holdings.find(t => t.mint === mint);
    const t2 = wallet2.tokens.holdings.find(t => t.mint === mint);
    return {
      mint,
      wallet1Balance: t1.uiAmount,
      wallet2Balance: t2.uiAmount,
    };
  });

  // Token overlap score (Jaccard index)
  const allMints = new Set([...mints1, ...mints2]);
  const tokenOverlap = allMints.size > 0
    ? (sharedMints.length / allMints.size)
    : 0;

  // Activity similarity
  const activitySimilarity = computeActivitySimilarity(wallet1, wallet2);

  // Balance comparison
  const balanceRatio = computeBalanceRatio(wallet1.balance.sol, wallet2.balance.sol);

  // Classification match
  const classMatch = wallet1.classification.type === wallet2.classification.type;
  const sharedTags = wallet1.classification.tags.filter(t => wallet2.classification.tags.includes(t));

  // Trust / similarity composite score (0-100)
  const similarityScore = Math.round(
    (tokenOverlap * 35) +
    (activitySimilarity * 30) +
    (balanceRatio * 15) +
    (classMatch ? 10 : 0) +
    (Math.min(sharedTags.length / 3, 1) * 10)
  );

  let relationship;
  if (similarityScore >= 80) relationship = '🔗 STRONGLY LINKED — High probability of same owner or coordinated wallets';
  else if (similarityScore >= 60) relationship = '🤝 SIMILAR — Significant overlap in behavior and holdings';
  else if (similarityScore >= 40) relationship = '📊 MODERATE — Some shared characteristics';
  else if (similarityScore >= 20) relationship = '🔀 DIFFERENT — Minimal overlap';
  else relationship = '⚡ UNRELATED — No meaningful connection detected';

  return {
    version: '2.0.0',
    type: 'comparison',
    timestamp: new Date().toISOString(),
    wallets: {
      wallet1: { address: address1, classification: wallet1.classification.type, risk: wallet1.risk.level },
      wallet2: { address: address2, classification: wallet2.classification.type, risk: wallet2.risk.level },
    },
    similarity: {
      score: similarityScore,
      relationship,
      breakdown: {
        tokenOverlap: Math.round(tokenOverlap * 100),
        activitySimilarity: Math.round(activitySimilarity * 100),
        balanceRatio: Math.round(balanceRatio * 100),
        classificationMatch: classMatch,
        sharedTags,
      },
    },
    sharedTokens: {
      count: sharedTokens.length,
      tokens: sharedTokens,
    },
    balanceComparison: {
      wallet1: { sol: wallet1.balance.sol },
      wallet2: { sol: wallet2.balance.sol },
      ratio: wallet1.balance.sol > 0 && wallet2.balance.sol > 0
        ? (Math.max(wallet1.balance.sol, wallet2.balance.sol) / Math.min(wallet1.balance.sol, wallet2.balance.sol)).toFixed(2) + 'x'
        : 'N/A',
    },
    riskComparison: {
      wallet1: { score: wallet1.risk.score, level: wallet1.risk.level },
      wallet2: { score: wallet2.risk.score, level: wallet2.risk.level },
      delta: Math.abs(wallet1.risk.score - wallet2.risk.score),
    },
    meta: {
      rpc: rpcUrl,
      agent: 'solana-scout/2.0.0',
      builtBy: 'Hunter (OpenClaw Agent)',
    },
  };
}

function computeActivitySimilarity(w1, w2) {
  // Compare transaction frequency patterns
  const freq1 = parseFrequency(w1.transactions.avgFrequency);
  const freq2 = parseFrequency(w2.transactions.avgFrequency);

  if (freq1 === 0 && freq2 === 0) return 1;
  if (freq1 === 0 || freq2 === 0) return 0;

  const ratio = Math.min(freq1, freq2) / Math.max(freq1, freq2);

  // Compare success rates
  const sr1 = parseFloat(w1.transactions.successRate || '0');
  const sr2 = parseFloat(w2.transactions.successRate || '0');
  const srSimilarity = 1 - Math.abs(sr1 - sr2) / 100;

  return (ratio * 0.6) + (srSimilarity * 0.4);
}

function parseFrequency(freq) {
  if (!freq || freq === 'N/A') return 0;
  const match = freq.match(/~([\d.]+)\s+txns\/(day|week)/);
  if (!match) return 0;
  const val = parseFloat(match[1]);
  return match[2] === 'week' ? val / 7 : val;
}

function computeBalanceRatio(bal1, bal2) {
  if (bal1 === 0 && bal2 === 0) return 1;
  if (bal1 === 0 || bal2 === 0) return 0;
  return Math.min(bal1, bal2) / Math.max(bal1, bal2);
}
