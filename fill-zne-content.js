require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const ZE = '1534966276290646027';
const FAILED = '\u274C';
const targets = {
  '1534967602684624906': { title: 'FAQ', color: 0x78281F, icon: '\u2753' },
  '1534967617566146590': { title: 'Worker Info', color: 0x78281F, icon: '\u{1F4CB}' },
  '1534967619466035421': { title: 'Payouts', color: 0x78281F, icon: '\u{1F4B0}' },
  '1534967614713888788': { title: 'Executive Briefing', color: 0x78281F, icon: '\u{1F5C2}\uFE0F' },
  '1534967627070439594': { title: 'Help Desk', color: 0x78281F, icon: '\u2753' }
};

const blocks = {
  '1534967602684624906': [
    ['What is Z&E Realty?', 'Z&E Realty is a private realty company that assists players with property management, land inquiries, and real estate services.'],
    ['Where can I find the support panel?', 'You can access the Leasing Office support panel in <#1534967624440611006>.'],
    ['How can I view property listings?', 'Property listings are posted by authorized staff using the /post command in the designated listings channel.'],
    ['How do I buy or sell a plot?', 'All transactions are processed via tickets. Open a ticket through the Leasing Office support panel and select "Buy a Plot" or "Sell a Plot".'],
    ['How do I apply to become a Realty Agent?', 'Open the Leasing Office support panel, select "Apply for Agent," and fill out the application form.'],
    ['How do I get general support?', 'Use the "Support / Enquiry" option in the support panel to speak with our team directly.'],
    ['What are the community guidelines?', 'All users must strictly adhere to Discord TOS and Democracycraft TOS, avoid bug abuse, and maintain professional conduct.']
  ],
  '1534967617566146590': [
    ['Commands', [
      '**/post_listing** — Post a listing embed + thread in the plots channel (location, price, near, description, image) \u2014 pings New Listings, logs to audit',
      '**/contract** — 4 subcommands, legal contracts. Agent auto-signs, other party clicks Sign',
      '\u203A **buy** \u2014 seller, seller_user, location, price, deposit, closing_date \u2014 PPA where Z&E buys from a seller',
      '\u203A **sell** \u2014 buyer, buyer_user, location, price, deposit, closing_date \u2014 PPA where Z&E sells to a buyer',
      '\u203A **ersla_sell** \u2014 seller, seller_user, location, price, listing_period, commission \u2014 client lists their plot with Z&E',
      '\u203A **ersla_find** \u2014 client, client_user, location, price, search_period, commission \u2014 client hires Z&E to find a plot',
      '**/sold** — message, deal_type, total_price, buyer_name, contract_id, plot_hunting \u2014 marks sold (needs signed contract), greys embed, locks thread, calculates 5% split, logs it',
      '**/remove_listing** — message \u2014 marks removed, greys embed, archives thread',
      '**/calc_commission** — price \u2014 shows 5% pool and split options (solo/team/owner solo) + plot hunting fee',
      '**/payout_request** — proof (image) \u2014 posts payout request with owed amount',
      '**/payout_history** \u2014 (Broker) recent completed sales',
      '**/payout_ledger** \u2014 (Broker) amount owed per agent, sorted',
      '**/my_listings** \u2014 all your active listings',
      '**/stats** \u2014 closed deals, commission earned, active listings, contracts signed',
      '**/favorite** \u2014 add/remove/list + location/price \u2014 personal watchlist',
      '**/feedback** \u2014 agent, rating (1-5), review \u2014 posts to ratings channel',
      '**/help** \u2014 command categories via dropdown',
      '**/contract_void** \u2014 contract_id, reason \u2014 (Broker) voids a signed contract',
      '**/broadcast** \u2014 message \u2014 (Owner) DMs every agent'
    ].join('\n')],
    ['Rules', [
      'Only Realtors+ can use /post_listing, /sold, /remove_listing',
      'Contracts auto-sign the agent \u2014 the other party must click Sign',
      'PDF is generated when both parties sign',
      'All payouts require proof of completion (attach screenshots/logs)',
      'Brokers review payouts within 24 hours'
    ].join('\n')],
    ['Pay Structure', [
      '5% Commission Pool per sale',
      '• Solo Deal \u2192 Realtor 75% | Company 25%',
      '• Team Deal \u2192 Realtor 60% | Junior 15% | Company 25%',
      '• Owner Solo \u2192 Owner 100%',
      '• Plot Hunting Fee \u2192 $1,500 total, Realtor gets $750',
      'Broker bonuses: $2k\u2013$5k per management task',
      'Junior Realtors: find inventory, scout plots, respond to tickets'
    ].join('\n')]
  ],
  '1534967619466035421': [
    ['How It Works', [
      '• Track your deals with /contract and /sold',
      '• Use /payout_request and attach proof (image)',
      '• Posts a payout request with your owed amount for Broker review',
      '• A Broker reviews your payout within 24 hours',
      '• Approved payouts are paid via the company weekly check',
      '• A ledger entry is logged for your records'
    ].join('\n')],
    ['Commission (5% Pool)', [
      '• Solo Deal \u2192 Realtor 75% | Company 25%',
      '• Team Deal \u2192 Realtor 60% | Junior 15% | Company 25%',
      '• Owner Solo \u2192 Owner 100%',
      'Plot Hunting Fee \u2192 $1,500 total, Realtor keeps $750',
      'Broker management bonuses \u2192 $2k\u2013$5k per task'
    ].join('\n')],
    ['Rules', [
      '• No payout without proof. No exceptions.',
      '• Only Realtors+ can submit payout requests',
      '• Faking totals or transactions = blacklisted from the firm',
      '• Questions? Open a ticket'
    ].join('\n')]
  ],
  '1534967614713888788': [
    ['Leadership', [
      '• Principal Broker \u2014 top authority, final decisions',
      '• Managing Director \u2014 runs daily operations',
      '• Broker \u2014 management, hiring, payouts, disputes'
    ].join('\n')],
    ['Chain of Command', 'Principal Broker \u2192 Managing Director \u2192 Broker \u2192 Realtor \u2192 Junior Realtor'],
    ['Operations', [
      '• All deals flow through tickets and bot contracts \u2014 no exceptions',
      '• Listings posted by Realtors+ only',
      '• Payouts reviewed by Broker management weekly',
      '• Active Deals live in the Active Tickets category until signed PDFs are produced'
    ].join('\n')],
    ['Reporting', [
      '• Weekly executive check-in in #🖥-executive-briefing',
      '• Audit logs are reviewed by leadership',
      '• Disputes escalate: Realtor \u2192 Broker \u2192 Managing Director \u2192 Principal Broker'
    ].join('\n')]
  ]
};

c.on('ready', async () => {
  const g = c.guilds.cache.get(ZE);
  if (!g) { console.log('Missing guild'); process.exit(1); }
  for (const [cid, t] of Object.entries(targets)) {
    const ch = g.channels.cache.get(cid);
    if (!ch) continue;
    const msgs = await ch.messages.fetch({ limit: 20 }).catch(() => null);
    if (msgs) msgs.filter(m => m.author.id === c.user.id).forEach(m => m.delete().catch(() => {}));
    const e = new EmbedBuilder().setTitle(t.icon + ' ' + t.title).setColor(t.color).setFooter({ text: 'Z&E Realty' });
    const content = blocks[cid] || [];
    for (const [name, value] of content) e.addFields({ name, value, inline: false });
    await ch.send({ embeds: [e] }).catch(err => console.log('FAIL ' + cid + ': ' + err.message));
    console.log('Posted embed to ' + t.title);
  }
  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);