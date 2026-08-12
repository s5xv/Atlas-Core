require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds] });

const INFO_CH = '1531954224768876704';

const messages = [
`📋 **Atlas Holdings - Job Roles & Pay**

Atlas Holdings is the central company running everything. Pay is per-task at these rates.

**Board of Directors** — 2,000-5,000 per task
Top leadership. Owns and governs the whole network. Makes major decisions.

**Executive Management** — 2,000-4,000 per task
Senior management. Runs day-to-day operations across all servers.

**Operations Team** — 1,000-2,500 per task
Mid-level staff. Handles logistics, execution, and coordination.

**Project Manager** — 1,000-2,000 per task
Leads specific projects. Plans scope, assigns work, and delivers results.

**IT Support** — 400-800 per task
Fixes technical issues, configures plugins, maintains infrastructure.

**Safety Officer** — 500-1,000 per task
Monitors rule-breaking, enforces policy, handles reports.

**Quality Assurance** — 400-800 per task
Checks work quality, tests builds/plugins, reports issues.

**Mentor** — 400-800 per task
Trains and guides new members through onboarding.

**Company Employee** — 300-600 per task
General worker. Does whatever is needed.

**Contractor** — 300-600 per task
External or part-time worker on specific projects.

**Intern** — 100-250 per task
New hire in training. Learning the ropes.

**Partner** — collaboration-based
Business alliance partner. Mutual cross-promotion.

**Promotion** — per-agreement
Promotes Atlas on their platform for agreed compensation.`,

`📋 **Plutus Banking - Job Roles & Pay**

Plutus Banking handles loans, accounts, investments, and financial services. Pay is per-transaction or per-task.

**Bank Director** — 2,000-5,000 per task
Bank leadership. Sets financial policy and oversees all operations.

**Branch Manager** — 1,000-2,500 per task
Manages daily branch operations and staff.

**Loan Officer** — 500-1,200 per loan
Processes and approves loans. Verifies collateral.

**Account Holder** — N/A (customer role)
Standard customer or account holder.

**Teller** — 200-500 per task
Handles customer transactions and deposits.

**Accountant** — 400-800 per task
Manages accounts, tracks balances, and prepares reports.

**Auditor** — 600-1,200 per audit
Checks financial records for accuracy and compliance.

**Financial Advisor** — 500-1,000 per session
Gives investment and financial planning advice.

**Partner** — collaboration-based
Mutual financial collaboration.

**Promotion** — per-agreement
Promotes Plutus externally.

**Sponsor** — per-agreement
Financially supports Plutus.`,

`📋 **Demeter Realty - Job Roles & Pay**

Demeter Realty handles property sales, leases, and land management. Pay is commission-based from a 5% pool.

👑 **Broker (Management)** — per-deal cut + 2,000-5,000 per task
Hires, promotes, tracks payouts, audits transcripts, handles disputes.

🦅 **Realtor (Licensed Sales Agent)** — commission split
Closes deals, claims tickets, negotiates, runs listings/auctions, executes transfers.
🤝 Solo: 75% of 5% commission | 👥 Team: 60% of 5% commission

💼 **Junior Realtor (Apprentice)** — commission split
Finds inventory, scouts inactive plots, responds to tickets, does walkthroughs.
👥 Team: 15% of 5% commission (when working with a Realtor)

👑 **Owner Solo Deal** — 100% of 5% commission
When the owner closes directly.

📊 **Commission Splits (5% pool per sale)**
🤝 Solo: Realtor 75% / Company 25%
👥 Team: Realtor 60% / Junior 15% / Company 25%
👑 Owner: Owner 100%

⚠️ **Plot Hunting Fee**
$1,500 extra ($500 retainer + $1,000 final)
Realtor keeps 50% ($750) added to weekly check.`,

`🔹 **How Pay Works**

All payments are processed per completed task unless otherwise specified.

**To request payment:**
Open a ticket and provide proof of completion (screenshots, logs, witnesses).
Management reviews and pays within 24 hours.

**General rules:**
- No pay for incomplete or rejected work
- Disputes go to server leadership for final decision
- Rates may be adjusted based on server economy
- Always agree on price before starting a task`];

c.on('ready', async () => {
  const ch = c.channels.cache.get(INFO_CH);
  if (!ch) { console.log('Info channel not found'); process.exit(1); }
  for (const msg of messages) {
    await ch.send(msg);
    console.log('Sent section');
  }
  console.log('All job info sent');
  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);