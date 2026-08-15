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
    ['What is Z&E Realty?', 'Z&E Realty is a private realty company that assists players with property management, land inquiries, and real estate services \u2014 both on our website and in Discord.'],
    ['Where can I find the support panel?', 'You can access the Leasing Office support panel in <#1534967624440611006>.'],
    ['How can I view property listings?', 'Three ways: browse the marketplace at ze-realty.vercel.app/listings, watch the listings channel / forum in Discord, or use **/my_listings** if you are an agent. Sold builds are showcased on the Portfolio page.'],
    ['How do I buy or sell a plot?', 'All transactions are handled through tickets. Open a ticket via the Leasing Office support panel and pick **"Buy a Plot"** or **"Sell a Plot"** \u2014 an agent will handle the rest, including the signed contract PDF.'],
    ['Can I save plots or track prices on the site?', 'Yes \u2014 sign in with Discord (button in the top-right of the site) and use \u2605 Save on any property. Press "I\u2019m interested" and we DM you if that plot drops in price. You can also open a contract sign link from the portal with your Discord account.'],
    ['How do I apply to become a Realty Agent?', 'Open the Leasing Office support panel, choose **"Apply for Agent"** and fill out the application. A Broker reviews it and gets back to you.'],
    ['How do I apply as a Builder or Lead Builder?', 'Same place \u2014 open a ticket and choose the **Builder / Lead Builder** position. The Lead Builder assigns jobs and designs; builders get 50% of build profit (50% / 20% / 30% split when a Lead Builder assigns the job).'],
    ['How do I get general support?', 'Use the **"Support / Enquiry"** option in the support panel \u2014 a member of the team will pick up your ticket.'],
    ['What are the community guidelines?', 'All users must adhere to Discord TOS and Democracycraft TOS, avoid bug abuse, and maintain professional conduct at all times.']
  ],
  '1534967617566146590': [
    ['\u{1F3E0} Listings', [
      '**/post_listing**',
      'What it does \u2014 posts a property listing for sale.',
      'How to use \u2014 it asks for location, price, a nearby landmark, a short description, an image (required) and the city + plot type. It creates a thread in the plots forum with the right tags, pings the New Listings role and logs to audit.',
      '',
      '**/sold**',
      'What it does \u2014 marks a listing as sold.',
      'How to use \u2014 give the listing message, deal type, total price, buyer name, the signed contract ID and a screenshot proof (required). Mark plot_hunting if used. It applies the Sold tag, locks the thread and logs the payout.',
      '',
      '**/remove_listing**',
      'What it does \u2014 removes a listing from the market.',
      'How to use \u2014 point it at the listing message. The thread is archived and removed from the site.',
      '',
      '**/calc_commission**',
      'What it does \u2014 previews the pay on any price.',
      'How to use \u2014 type a price and it shows the 5% pool plus every split (solo, team, owner solo) and the plot hunting fee. Check this before quoting clients.',
      '',
      '**/my_listings** \u2014 lists all your active listings.'
    ].join('\n')],
    ['\u{1F50E} Looking For', [
      '**/looking**',
      'What it does \u2014 posts that the firm is looking for a plot.',
      'How to use \u2014 describe the plot, pick a city + type, optional budget and area. It creates a thread in the Looking For forum tagged with the city and type and pings the listings role.',
      '',
      '**/looking_close**',
      'What it does \u2014 marks a looking-for thread as no longer needed.',
      'How to use \u2014 give the thread link. It swaps the Looking tag for Not Needed and archives the thread.'
    ].join('\n')],
    ['\u{1F50F} Contracts (/contract)', [
      'Contracts generate a legal PDF that both parties have to sign. The agent is auto-signed; the buyer or seller is mentioned and must click the Sign button.',
      '',
      '**\u2261 buy** \u2014 *PPA where Z&E buys from a seller*',
      'Fields: seller, seller_user, location, price, deposit, closing_date',
      '',
      '**\u2261 sell** \u2014 *PPA where Z&E sells to a buyer*',
      'Fields: buyer, buyer_user, location, price, deposit, closing_date',
      '',
      '**\u2261 ersla_sell** \u2014 *client lists their plot with Z&E*',
      'Fields: seller, seller_user, location, price, listing_period, commission',
      '',
      '**\u2261 ersla_find** \u2014 *client hires Z&E to hunt a plot*',
      'Fields: client, client_user, location, price, search_period, commission',
      '',
      '**/contract_void** *(Broker only)*',
      'What it does \u2014 voids a signed contract. Give the contract ID and a reason. Used when a deal falls through.'
    ].join('\n')],
    ['\u{1F4B0} Commander Tools', [
      '**/payout**',
      'What it does \u2014 logs your weekly commission payout.',
      'How to use \u2014 give the commission earned (and optional hunting fees / sales volume). It records the payout and posts it for a Broker to review.',
      '',
      '**/payout_request** \u2014 submits a payout request with an image as proof; a Broker reviews it.',
      '',
      '**/profile** \u2014 your deals: contracts and listings tied to your Discord.',
      '**/faq** \u2014 quick answers on buying, contracts, commissions and tickets.',
      '**/leaderboard** \u2014 posts the top agents (this month or all time).',
      '**/stats** \u2014 your closed deals, commission earned, active listings, contracts signed.',
      '**/favorite** \u2014 add, remove or list plots on your personal watchlist (give location + price when adding).',
      '**/feedback** \u2014 rate an agent 1-5 and leave a review; it posts to the ratings channel and the site.',
      '**/help** \u2014 opens the command guide with a dropdown menu.',
      '',
      '**Broker only**',
      '**/payout_history** \u2014 lists recent completed sales.',
      '**/payout_ledger** \u2014 shows how much each agent is owed, sorted.',
      '',
      '**Owner only**',
      '**/broadcast** \u2014 DMs every agent the same message.'
    ].join('\n')],
    ['Rules', [
      'Only Realtors+ can use /post_listing, /sold, /remove_listing, /looking, /looking_close',
      'Contracts auto-sign the agent \u2014 the other party must click Sign',
      'PDF is generated when both parties sign',
      'All payouts require proof of completion (attach screenshots/logs)',
      'Brokers review payouts within 24 hours'
    ].join('\n')],
    ['Pay Structure', [
      '5% Commission Pool per sale',
      '\u2022 Solo Deal \u2192 Realtor 75% | Company 25%',
      '\u2022 Team Deal \u2192 Realtor 60% | Junior 15% | Company 25%',
      '\u2022 Owner Solo \u2192 Owner 100%',
      '\u2022 Plot Hunting Fee \u2192 $1,500 total, Realtor gets $750',
      '\u2022 Company-Owned Plot (not from a person) \u2192 Realtor 50% of profits | Company 50%',
      '\u2022 Junior handled most of the ticket \u2192 Junior 20% | Realtor 30% | Company 50%',
      'Broker bonuses: $2k\u2013$5k per management task',
      'Junior Realtors: find inventory, scout plots, respond to tickets'
    ].join('\n')],
    ['Build Jobs', [
      '\u2022 Builder does it alone \u2192 Builder 50% | Company 50%',
      '\u2022 Lead Builder assigned the job \u2192 Builder 50% | Lead Builder 20% | Company 30%',
      '\u2022 Lead Builder does it himself \u2192 Lead Builder 50% | Company 50%',
      'The Lead Builder assigns jobs, designs, and leads the build.'
    ].join('\n')]
  ],
  '1534967619466035421': [
    ['How It Works', [
      '\u2022 Track your deals with /contract and /sold',
      '\u2022 Use /payout to log your weekly commission (amounts owed are computed from your sales)',
      '\u2022 Posts a payout record with your owed amount for Broker review',
      '\u2022 A Broker approves it in the portal \u2014 a ledger entry is logged for your records',
      '\u2022 Approved payouts are paid via the company weekly check'
    ].join('\n')],
    ['Commission (5% Pool)', [
      '\u2022 Solo Deal \u2192 Realtor 75% | Company 25%',
      '\u2022 Team Deal \u2192 Realtor 60% | Junior 15% | Company 25%',
      '\u2022 Owner Solo \u2192 Owner 100%',
      '\u2022 Plot Hunting Fee \u2192 $1,500 total, Realtor keeps $750',
      '\u2022 Company-Owned Plot (not from a person) \u2192 Realtor 50% of profits | Company 50%',
      '\u2022 Junior handled most of the ticket \u2192 Junior 20% | Realtor 30% | Company 50%',
      'Broker management bonuses \u2192 $2k\u2013$5k per task'
    ].join('\n')],
    ['Build Payouts', [
      '\u2022 Builder does it alone \u2192 Builder 50% | Company 50%',
      '\u2022 Lead Builder assigned the job \u2192 Builder 50% | Lead Builder 20% | Company 30%',
      '\u2022 Lead Builder does it himself \u2192 Lead Builder 50% | Company 50%'
    ].join('\n')],
    ['Rules', [
      '\u2022 No payout without proof. No exceptions.',
      '\u2022 Only Realtors+ can submit payout requests',
      '\u2022 Builders log build payouts separately from sale commissions',
      '\u2022 Faking totals or transactions = blacklisted from the firm',
      '\u2022 Questions? Open a ticket'
    ].join('\n')]
  ],
  '1534967614713888788': [
    ['Leadership', [
      '\u2022 Principal Broker \u2014 top authority, final decisions',
      '\u2022 Managing Director \u2014 runs daily operations',
      '\u2022 Broker \u2014 management, hiring, payouts, disputes',
      '\u2022 Lead Builder \u2014 build design, job assignment and build oversight'
    ].join('\n')],
    ['Chain of Command', [
      'Sales: Principal Broker \u2192 Managing Director \u2192 Broker \u2192 Realtor \u2192 Junior Realtor',
      'Builds: Managing Director \u2192 Lead Builder \u2192 Builder'
    ].join('\n')],
    ['Operations', [
      '\u2022 All deals flow through tickets and bot contracts \u2014 no exceptions',
      '\u2022 Listings posted by Realtors+ only; looking-for threads posted the same way',
      '\u2022 Payouts reviewed by Broker management weekly',
      '\u2022 Active Deals live in the Active Tickets category until signed PDFs are produced',
      '\u2022 Build jobs are assigned by the Lead Builder; fees split per the firm pay structure'
    ].join('\n')],
    ['Reporting', [
      '\u2022 Weekly executive check-in in #\u{1F5A5}\uFE0F-executive-briefing',
      '\u2022 Audit logs are reviewed by leadership',
      '\u2022 Disputes escalate: Realtor \u2192 Broker \u2192 Managing Director \u2192 Principal Broker'
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