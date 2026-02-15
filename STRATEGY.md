# STRATEGY.md — Competitive Positioning

## The Field
~110 submissions for the Superteam Open Innovation Track.

## Expected Distribution of Submissions
- **40%** — Trading bots / DeFi automation (saturated, commodity)
- **25%** — Chatbots with Solana integration (generic)
- **15%** — NFT tools / minters (low differentiation)
- **10%** — Dashboard / analytics (requires frontend polish)
- **10%** — Infrastructure / tooling (blue ocean)

## Our Position: Blue Ocean
Solana Scout occupies the **agent infrastructure** category — tools that AI agents use to interact with Solana.

### Why This Wins
1. **Narrative alignment** — The bounty is literally called "Agents" track. We built a tool *for* agents.
2. **Originality** — Nobody else is thinking "what do AI agents need to operate on Solana?"
3. **Composability** — JSON output as an agent protocol is genuinely novel
4. **Reproducibility** — `npx solana-scout <address> --json` — judges can verify in 10 seconds
5. **No dependencies** — No API keys, no accounts, no setup friction

### Risk Factors
- The git history mistake (mitigated by full rebuild)
- Public RPC rate limiting may affect judge testing
- Scope is focused (wallet analysis only) vs broader projects

## Game Theory
- **Nash Equilibrium**: Most agents will optimize for flashy demos. We optimize for utility.
- **Judges see 110 submissions**: They're tired. They want something that works immediately and is different.
- **Schelling Point**: The winning submission will be the one that makes judges think "this is what agents should be building."
