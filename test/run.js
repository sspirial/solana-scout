// Solana Scout v2 — Test Suite
import { analyzeWallet, PROGRAM_LABELS } from '../src/index.js';

const KNOWN_WALLET = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'; // Solana Foundation
const PROGRAM_ADDR = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const INVALID_ADDR = 'notavalidaddress123';

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}`);
    failed++;
  }
}

async function run() {
  console.log('\n  SOLANA SCOUT v2 — TEST SUITE\n  ════════════════════════════\n');

  // Test 1: Invalid address rejection
  console.log('  [1] Invalid address handling');
  try {
    await analyzeWallet(INVALID_ADDR);
    assert(false, 'Should have thrown for invalid address');
  } catch (e) {
    assert(e.message.includes('Invalid Solana address'), `Rejects invalid address: "${e.message}"`);
  }

  // Test 2: Off-curve address rejection (PDA / Vote program)
  console.log('\n  [2] Off-curve address handling');
  const OFF_CURVE = 'Vote111111111111111111111111111111111111111';
  try {
    await analyzeWallet(OFF_CURVE);
    assert(false, 'Should have thrown for off-curve address');
  } catch (e) {
    assert(e.message.includes('not a wallet'), `Rejects off-curve address: "${e.message}"`);
  }

  // Test 3: Valid wallet analysis
  console.log('\n  [3] Valid wallet analysis (mainnet)');
  try {
    const report = await analyzeWallet(KNOWN_WALLET);
    assert(report.version === '2.0.0', 'Report version is 2.0.0');
    assert(report.address === KNOWN_WALLET, 'Address matches input');
    assert(typeof report.balance.sol === 'number', 'Balance is numeric');
    assert(report.balance.sol >= 0, 'Balance is non-negative');
    assert(Array.isArray(report.tokens.holdings), 'Token holdings is array');
    assert(typeof report.risk.score === 'number', 'Risk score is numeric');
    assert(report.risk.score >= 0 && report.risk.score <= 100, 'Risk score in range 0-100');
    assert(typeof report.classification.type === 'string', 'Classification type exists');
    assert(Array.isArray(report.classification.tags), 'Classification tags is array');
    assert(report.meta.agent === 'solana-scout/2.0.0', 'Agent metadata present');
    assert(report.timestamp, 'Timestamp present');
  } catch (e) {
    assert(false, `Wallet analysis failed: ${e.message}`);
  }

  // Test 4: Program labels exist
  console.log('\n  [4] Program label database');
  assert(Object.keys(PROGRAM_LABELS).length > 20, `${Object.keys(PROGRAM_LABELS).length} known programs`);
  assert(PROGRAM_LABELS['JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4'] === 'Jupiter v6', 'Jupiter v6 labeled');

  console.log(`\n  ════════════════════════════`);
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log(`  ${failed === 0 ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

run();
