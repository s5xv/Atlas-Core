require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds] });

const INFO_CH = '1531954224768876704';

const roleData = {
  '1528793481273671832': {
    name: 'Atlas Holdings',
    color: 0xD4AF37,
    desc: 'The central holding company overseeing all operations. All workers across every server are part of the Atlas Holdings workforce.',
    groups: [
      { title: 'Management', roles: [
        'Board of Directors - Top leadership. Owns and governs the company.',
        'Executive Management - Senior management. Runs day-to-day operations.',
        'Operations Team - Mid-level staff. Handles logistics and execution.',
      ]},
      { title: 'Staff', roles: [
        'Company Employee - General employee rank.',
        'Contractor - External or part-time worker.',
        'Verified Employee - Confirmed and trusted employee.',
        'Intern - New hire in training.',
      ]},
      { title: 'Specialized', roles: [
        'Project Manager - Leads specific projects and initiatives.',
        'IT Support - Handles technical issues.',
        'Safety Officer - Monitors rule-breaking and enforces policy.',
        'Quality Assurance - Checks work quality and reports issues.',
        'Mentor - Trains and guides new members.',
      ]},
      { title: 'Partnership', roles: [
        'Partner - Business alliance partner. Mutual collaboration.',
        'Promotion - Promotes/advertises Atlas on their platform.',
      ]},
    ],
  },
  '1528807603197706332': {
    name: 'Nemesis Security',
    color: 0x8B0000,
    desc: 'The security and enforcement arm of Atlas Holdings. Provides protection, patrol, and threat response.',
    groups: [
      { title: 'Command', roles: [
        'Director - Top command. Oversees all security operations.',
        'Security Chief - Head of field operations. Leads agents.',
        'Field Agent - Active operative. Executes missions.',
      ]},
      { title: 'Operatives', roles: [
        'Member - Standard security member.',
        'Crewmate - Trusted operative.',
        'Ghost - Special status operative.',
        'Imposter - Infiltrator or undercover role.',
      ]},
      { title: 'Partnership', roles: [
        'Partner - Mutual security collaboration.',
        'Promotion - Promotes Nemesis externally.',
        'Sponsor - Financially supports Nemesis.',
      ]},
    ],
  },
  '1528804420383674559': {
    name: 'Plutus Banking',
    color: 0x1E4620,
    desc: 'The financial division. Handles loans, accounts, investments, and financial services.',
    groups: [
      { title: 'Leadership', roles: [
        'Bank Director - Bank leadership. Sets financial policy.',
        'Branch Manager - Manages daily branch operations.',
        'Loan Officer - Processes and approves loans.',
      ]},
      { title: 'Staff', roles: [
        'Account Holder - Standard member or customer.',
        'Teller - Handles customer transactions.',
        'Accountant - Manages accounts and books.',
      ]},
      { title: 'Specialized', roles: [
        'Auditor - Checks financial records and compliance.',
        'Financial Advisor - Gives investment and financial advice.',
      ]},
      { title: 'Partnership', roles: [
        'Partner - Mutual financial collaboration.',
        'Promotion - Promotes Plutus externally.',
        'Sponsor - Financially supports Plutus.',
      ]},
    ],
  },
  '1528800629701480468': {
    name: 'Hecate Cards',
    color: 0x8E44AD,
    desc: 'The gaming and entertainment division. Runs card trading, tournaments, and community events.',
    groups: [
      { title: 'Management', roles: [
        'Managing Director - Casino boss. Heads Hecate Cards.',
        'Logistics Manager - Handles inventory and supply.',
        'Inventory Specialist - Tracks card stock.',
      ]},
      { title: 'Patrons', roles: [
        'Member - Standard patron.',
        'Backers - Crowdfunding supporter.',
        'Card Collector - Collects cards.',
        'Rare Collector - Rare card collecting tier.',
        'Epic Collector - Epic card collecting tier.',
        'Legendary Collector - Legendary card collecting tier.',
      ]},
      { title: 'Event Staff', roles: [
        'Event Host - Runs events and tournaments.',
        'Tournament Organizer - Organizes card tournaments.',
        'Giveaway Host - Hosts giveaways.',
      ]},
      { title: 'Specialized', roles: [
        'Trade Mediator - Resolves card trade disputes.',
        'Card Designer - Creates card designs.',
        'Booster Opener - Opens card packs on stream or in chat.',
      ]},
      { title: 'Support', roles: [
        'Supporter - General supporter rank.',
        'Sponser - Sponsors Hecate.',
        'Partner - Partnership rank.',
        'Investor - Invested in Hecate.',
        'Founder - Founding member.',
        'Promotion - Promotes Hecate externally.',
      ]},
      { title: 'Licenses', roles: [
        'Basic License - Basic access tier.',
        'Shop License - Shop access tier.',
        'Business License - Business access tier.',
      ]},
    ],
  },
  '1528796628457361449': {
    name: 'Hermes Net',
    color: 0x2980B9,
    desc: 'The technology and data division. Manages infrastructure, development, and network operations.',
    groups: [
      { title: 'Leadership', roles: [
        'System Administrator - Top tech admin. Manages infrastructure.',
        'Trust and Safety Inspector - Monitors platform safety and conduct.',
        'Data Director - Manages data and analytics.',
      ]},
      { title: 'Engineering', roles: [
        'Platform Engineer - Builds and maintains the platform.',
        'Infrastructure Engineer - Maintains servers and network infra.',
        'Developer - Codes bots, features, and tools.',
        'QA Tester - Tests features before launch.',
      ]},
      { title: 'Staff', roles: [
        'Network Member - Standard member.',
        'Support Agent - Handles user tickets and support.',
        'Project Lead - Leads development projects.',
        'Privacy Officer - Handles data privacy and compliance.',
        'Ad Manager - Manages advertisements.',
      ]},
      { title: 'Partnership', roles: [
        'Partner - Mutual tech collaboration.',
        'Promotion - Promotes Hermes externally.',
        'Sponsor - Financially supports Hermes.',
      ]},
    ],
  },
  '1528809601674514502': {
    name: 'Demeter Realty',
    color: 0x78281F,
    desc: 'The real estate division. Handles property sales, leases, and land management.',
    groups: [
      { title: 'Leadership', roles: [
        'Principal Broker - Top real estate authority.',
        'Managing Director - Runs daily operations.',
        'Broker - Licensed broker.',
      ]},
      { title: 'Agents', roles: [
        'Realtor - Sells properties.',
        'Junior Realtor - Trainee agent.',
        'Leasing Agent - Handles leases.',
      ]},
      { title: 'General', roles: [
        'Member - Standard member.',
      ]},
      { title: 'Partnership', roles: [
        'Partner - Mutual real estate collaboration.',
        'Promotion - Promotes Demeter externally.',
        'Sponsor - Financially supports Demeter.',
      ]},
    ],
  },
};

c.on('ready', async () => {
  const ch = c.channels.cache.get(INFO_CH);
  if (!ch) { console.log('Info channel not found'); process.exit(1); }

  for (const [gid, data] of Object.entries(roleData)) {
    const e = new EmbedBuilder()
      .setTitle(data.name + ' - Job Roles')
      .setColor(data.color)
      .setDescription(data.desc);
    for (const group of data.groups) {
      e.addFields({ name: group.title, value: group.roles.join('\n'), inline: false });
    }
    await ch.send({ embeds: [e] });
    console.log('Sent', data.name);
  }

  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);