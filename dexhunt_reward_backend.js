// DexHunt Reward System – Skill-Based JSON Leaderboard, Claim Route + Tournament Entry Fee Routing
const express = require("express");
const app = express();
app.use(express.json());

// DexHunt treasury wallet to receive tournament entry fees
const DEXHUNT_WALLET = "CU2AznX2UgZxcxwBjLYW87BpKyCcFX56Nb37w1UwMm4F";

// Mock leaderboard scores (to simulate real player results)
const leaderboard = [
  { wallet: "9XaBz123eYt", score: 22, reactionTime: 310 },
  { wallet: "4NDJ4RZ12q", score: 27, reactionTime: 278 },
  { wallet: "6YuTzP9Qaf", score: 19, reactionTime: 295 },
  { wallet: "2Aa77xKjwR", score: 18, reactionTime: 410 },
  { wallet: "7YeFzLKsT8", score: 24, reactionTime: 299 }
];

const claims = new Set(); // Track claimed wallets
const registrations = new Set(); // Track paid registrants

function calculateRewards(entry) {
  let reward = 0;
  if (entry.score >= 25) reward += 5;
  else if (entry.score >= 20) reward += 3;

  if (entry.reactionTime < 300) reward += 2;
  else if (entry.reactionTime < 350) reward += 1;

  return reward;
}

app.get("/rewards/daily", (req, res) => {
  const rewardData = leaderboard.map(entry => ({
    ...entry,
    reward: \`\${calculateRewards(entry)} SALOONA\`
  }));

  res.json({
    date: new Date().toISOString().split("T")[0],
    top_players: rewardData,
    claim_window: "24h"
  });
});

// ✅ Mock claim route
app.post("/claim", (req, res) => {
  const { wallet } = req.body;
  if (!wallet) return res.status(400).json({ error: "Wallet required" });
  if (claims.has(wallet)) return res.status(403).json({ error: "Reward already claimed today" });

  const player = leaderboard.find(p => p.wallet === wallet);
  if (!player) return res.status(404).json({ error: "Player not found" });

  const reward = calculateRewards(player);
  if (reward === 0) return res.status(403).json({ error: "Not eligible for reward" });

  claims.add(wallet);
  res.json({ success: true, reward: \`\${reward} SALOONA\`, message: "Mock reward granted" });
});

// ✅ Mock tournament entry fee route (tracking only)
app.post("/tournament/register", (req, res) => {
  const { wallet } = req.body;
  if (!wallet) return res.status(400).json({ error: "Wallet address is required." });
  if (registrations.has(wallet)) return res.status(403).json({ error: "Already registered." });

  registrations.add(wallet);
  res.json({
    success: true,
    message: \`Registered for tournament. Please send 0.1 SOL to: \${DEXHUNT_WALLET}\`
  });
});

// Server init
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`🎯 DexHunt reward loop + tournament registry live at http://localhost:\${PORT}\`);
});
