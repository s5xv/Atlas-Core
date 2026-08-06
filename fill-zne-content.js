require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds] });

const ZE = '1534966276290646027';
const FAQ_CH = '1534967602684624906';
const WORKERS_CH = '1534967617566146590';

const FAQ = `**Z&E Realty | Frequently Asked Questions (FAQ)**
**Q: What is Z&E Realty?**
A: Z&E Realty is a private realty company that assists players with property management, land inquiries, and real estate services.
**Q: Where can I find the support panel?**
A: You can access the Leasing Office support panel in channel <#1534967624440611006>.
**Q: How can I view property listings?**
A: Property listings are posted by authorized staff using the /post command in the designated listings channel.
**Q: How do I buy or sell a plot?**
A: All transactions are processed via tickets. Open a ticket through the Leasing Office support panel and select "Buy a Plot" or "Sell a Plot".
**Q: How do I apply to become a Realty Agent?**
A: Open the Leasing Office support panel, select "Apply for Agent," and fill out the application form.
**Q: How do I get general support?**
A: Use the "Support / Enquiry" option in the support panel to speak with our team directly.
**Q: What are the community guidelines?**
A: All users must strictly adhere to Discord TOS and Democracycraft TOS, avoid bug abuse, and maintain professional conduct.`;

const GUIDE = `**Z&E Realty — Agent Guide**
━━━━ COMMANDS ━━━━
**/post_listing** — Post a property for sale
› location, price, near, description, image

**/contract buy** — Z&E buys from a seller
› seller (MC name), seller_user (@discord), location, price

**/contract sell** — Z&E sells to a buyer
› buyer (MC name), buyer_user (@discord), location, price

**/contract ersla_sell** — Client lists their plot with us
› seller, seller_user (@discord), location, price, listing_period

**/contract ersla_find** — Client hires us to find a plot
› client, client_user (@discord), location, price, search_period

**/sold** — Mark listing sold, calculates commission
› message (link), deal_type, total_price, plot_hunting?

**/calc_commission** — See 5% splits for any price
**/remove_listing** — Archive a listing
**/payout_request** — Submit proof for Broker review
**/payout_ledger** — (Broker) View amounts owed per agent
**/payout_history** — (Broker) View past payouts

━━━━ RULES ━━━━
• Only Realtors+ can use /post_listing, /sold, /remove_listing
• Contracts auto-sign the agent — the other party must click Sign
• PDF is generated when both parties sign
• All payouts require proof of completion (attach screenshots/logs)
• Brokers review payouts within 24 hours

━━━━ PAY STRUCTURE ━━━━
5% Commission Pool per sale

• Solo Deal → Realtor 75% | Company 25%
• Team Deal → Realtor 60% | Junior 15% | Company 25%
• Owner Solo → Owner 100%
• Plot Hunting Fee → $1,500 total, Realtor gets $750

Broker bonuses: $2k–$5k per management task
Junior Realtors: Find inventory, scout plots, respond to tickets`;

c.on('ready', async () => {
  const g = c.guilds.cache.get(ZE);
  if (!g) { console.log('Missing guild'); process.exit(1); }
  const f = g.channels.cache.get(FAQ_CH);
  const w = g.channels.cache.get(WORKERS_CH);
  await f.send(FAQ).then(() => console.log('FAQ posted')).catch(e => console.log('FAQ FAIL ' + e.message));
  await w.send(GUIDE).then(() => console.log('Guide posted')).catch(e => console.log('Guide FAIL ' + e.message));
  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);