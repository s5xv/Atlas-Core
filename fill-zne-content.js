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
    ['How can I view property listings?', 'Listings are posted by authorized staff in the plots channel. Use **/my_listings** if you are an agent, or watch the listings channel for new properties.'],
    ['How do I buy or sell a plot?', 'All transactions are handled through tickets. Open a ticket via the Leasing Office support panel and pick **"Buy a Plot"** or **"Sell a Plot"** \u2014 an agent will handle the rest, including the signed contract PDF.'],
    ['How do I apply to become a Realty Agent?', 'Open the Leasing Office support panel, choose **"Apply for Agent"** and fill out the application. A Broker reviews it and gets back to you.'],
    ['How do I get general support?', 'Use the **"Support / Enquiry"** option in the support panel \u2014 a member of the team will pick up your ticket.'],
    ['What are the community guidelines?', 'All users must adhere to Discord TOS and Democracycraft TOS, avoid bug abuse, and maintain professional conduct at all times.']
  ],
'1534967617566146590': [
    ['Listings', [
      '**/post_listing**',
      'What it does — posts a property listing for sale.',
      'How to use — it asks for location, price, a nearby landmark, a short description and an image. It creates a listing embed plus a discussion thread in the plots channel, pings the New Listings role and logs to audit.',
      '',
      '**/sold**',
      'What it does — marks a listing as sold.',
      'How to use — give the listing message, deal type (solo/team), total price, buyer name and the signed contract ID. Mark plot_hunting if a plot hunt was involved. It greys the embed, locks the thread, calculates the 5% split and logs the payout.',
      '',
      '**/remove_listing**',
      'What it does — removes a listing from the market.',
      'How to use — point it at the listing message. The embed gets greyed out and the thread is archived.',
      '',
      '**/calc_commission**',
      'What it does — previews the pay on any price.',
      'How to use — type a price and it shows the 5% pool plus every split (solo, team, owner solo) and the plot hunting fee. Check this before quoting clients.'
    ].join('\n')],
    ['🔏 Contracts (/contract)', [
        'Contracts generate a legal PDF that both parties have to sign. The agent is auto-signed; the buyer or seller is mentioned and must click the Sign button.',
        '',
        '**≡ buy** — *PPA where Z&E buys from a seller*',
        'Fields: seller, seller_user, location, price, deposit, closing_date',
        '',
        '**≡ sell** — *PPA where Z&E sells to a buyer*',
        'Fields: buyer, buyer_user, location, price, deposit, closing_date',
        '',
        '**≡ ersla_sell** — *client lists their plot with Z&E*',
        'Fields: seller, seller_user, location, price, listing_period, commission',
        '',
        '**≡ ersla_find** — *client hires Z&E to hunt a plot*',
        'Fields: client, client_user, location, price, search_period, commission',
        '',
        '**/contract_void** *(Broker only)*',
        'What it does — voids a signed contract. Give the contract ID and a reason. Used when a deal falls through.'
    ].join('\n')],
    ['Commander Tools', [
        '**/payout_request**',
        'What it does — submits a payout request.',
        'How to use — attach an image as proof and it posts the request with the amount owed to the payouts channel for a Broker to review.',
        '',
        '**/my_listings** — lists all your active listings.',
        '**/stats** — your closed deals, commission earned, active listings and contracts signed.',
        '**/favorite** — add, remove or list plots on your personal watchlist (give location + price when adding).',
        '**/feedback** — rate an agent 1-5 and leave a review; it posts to the ratings channel.',
        '**/help** — opens the command guide with a dropdown menu.',
        '',
        '**Broker only**',
        '**/payout_history** — lists recent completed sales.',
        '**/payout_ledger** — shows how much each agent is owed, sorted.',
        '',
        '**Owner only**',
        '**/broadcast** — DMs every agent the same message.'
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