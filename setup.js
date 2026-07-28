require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const config = require('./config');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const ATLAS_ID = '1528793481273671832';
const NEMESIS_ID = '1528807603197706332';
const PLUTUS_ID = '1528804420383674559';
const HECATE_ID = '1528800629701480468';
const HERMES_ID = '1528796628457361449';

const VIEW = PermissionsBitField.Flags.ViewChannel;
const SEND = PermissionsBitField.Flags.SendMessages;
const READ = PermissionsBitField.Flags.ReadMessageHistory;
const CONNECT = PermissionsBitField.Flags.Connect;
const ATTACH = PermissionsBitField.Flags.AttachFiles;

client.once('ready', async () => {
  console.log('Setup bot ready. Starting configuration...');

  const atlas = client.guilds.cache.get(ATLAS_ID);
  const nemesis = client.guilds.cache.get(NEMESIS_ID);
  const plutus = client.guilds.cache.get(PLUTUS_ID);
  const hecate = client.guilds.cache.get(HECATE_ID);
  const hermes = client.guilds.cache.get(HERMES_ID);

  if (!atlas || !nemesis || !plutus || !hecate || !hermes) {
    console.error('Could not find all guilds');
    return process.exit(1);
  }

  // ─── ATLAS HOLDINGS ───
  console.log('--- ATLAS HOLDINGS ---');

  // Rename existing channels
  const atlasChannels = atlas.channels.cache;
  const aRename = {
    '🖥️-hq-briefing': '🖥️-briefing',
    '📜-company-policy': '📜-rules',
    '📈-market-trends': '📈-trends',
    '🤖-automated-systems': '🤖-bots',
    '☕-water-cooler': '☕-chill',
  };
  for (const [id, ch] of atlasChannels) {
    const newName = aRename[ch.name];
    if (newName) { await ch.setName(newName).catch(() => {}); console.log('  Renamed', ch.name, '→', newName); }
  }

  // Create new roles (Atlas)
  const aRoles = [
    { name: 'Verified Employee', color: '#2ecc71' },
    { name: 'Intern', color: '#95a5a6' },
    { name: 'Promotion', color: '#f1c40f' },
    { name: 'Partner', color: '#9b59b6' },
    { name: 'Mentor', color: '#1abc9c' },
    { name: 'Quality Assurance', color: '#e67e22' },
    { name: 'Project Manager', color: '#2c3e50' },
    { name: 'IT Support', color: '#3498db' },
    { name: 'Safety Officer', color: '#e74c3c' },
  ];
  const aCreated = {};
  for (const r of aRoles) {
    const role = await atlas.roles.create({ name: r.name, color: r.color, reason: 'Setup' }).catch(e => { console.error('  Failed role', r.name, e.message); return null; });
    if (role) { aCreated[r.name] = role; console.log('  Role:', r.name); }
  }

  // Create channels (Atlas)
  const aCatId = config.guilds[ATLAS_ID].category_id;
  const aChs = [
    { name: '📋-rules', topic: 'Server rules — know them, follow them.' },
    { name: '📊-reports', topic: 'Report issues or share feedback here.' },
    { name: '🤝-chat', topic: 'General hangout and collaboration.' },
    { name: '📁-projects', topic: 'Discuss ongoing projects and tasks.' },
    { name: '💡-ideas', topic: 'Got a bright idea? Drop it here.' },
    { name: '🎓-training', topic: 'Training materials and guides for new members.' },
    { name: '🔧-tech-help', topic: 'Tech issues? Ask here.' },
  ];
  for (const ch of aChs) {
    const created = await atlas.channels.create({ name: ch.name, type: 0, topic: ch.topic, parent: aCatId || undefined }).catch(e => { console.error('  Failed channel', ch.name, e.message); return null; });
    if (created) console.log('  Channel:', ch.name);
  }

  // ─── NEMESIS SECURITY ───
  console.log('--- NEMESIS SECURITY ---');

  // Rename existing channels
  const nemChannels = nemesis.channels.cache;
  const nRename = {
    '📢-clearance-updates': '📢-updates',
    '🖥️-command-center': '🖥️-hq',
    '📜-code-of-conduct': '📜-rules',
    '💬-officers-mess': '💬-staff',
    '🪵-black-box-logs': '🪵-logs',
  };
  for (const [id, ch] of nemChannels) {
    const newName = nRename[ch.name];
    if (newName) { await ch.setName(newName).catch(() => {}); console.log('  Renamed', ch.name, '→', newName); }
  }

  // New roles (Nemesis)
  const nRoles = [
    { name: 'Crewmate', color: '#00e5ff' },
    { name: 'Ghost', color: '#ffffff' },
    { name: 'Imposter', color: '#e74c3c' },
  ];
  for (const r of nRoles) {
    const role = await nemesis.roles.create({ name: r.name, color: r.color, reason: 'Setup' }).catch(e => { console.error('  Failed', r.name, e.message); return null; });
    if (role) console.log('  Role:', r.name);
  }

  // New channels (Nemesis) — replaced repair with changelog
  const nCatId = config.guilds[NEMESIS_ID].category_id;
  const nChs = [
    { name: '☕-lobby', topic: 'General chat — hang out.' },
    { name: '📡-clips', topic: 'Share your best clips and moments.' },
    { name: '🔧-changelog', topic: 'Latest updates and patch notes.' },
  ];
  for (const ch of nChs) {
    const created = await nemesis.channels.create({ name: ch.name, type: 0, topic: ch.topic, parent: nCatId || undefined }).catch(e => { console.error('  Failed', ch.name, e.message); return null; });
    if (created) console.log('  Channel:', ch.name);
  }

  // ─── PLUTUS BANKING ───
  console.log('--- PLUTUS BANKING ---');

  // Rename existing channels
  const plChannels = plutus.channels.cache;
  const pRename = {
    '📜-banking-policy': '📜-rules',
    '📊-market-media': '📊-media',
    '🔧-changelog': '🔧-updates',
    '🖥️-manager-feed': '🖥️-feed',
    '☕-lobby-chat': '☕-lobby',
    '🪵-audit-logs': '🪵-logs',
    '🤖-system-commands': '🤖-commands',
  };
  for (const [id, ch] of plChannels) {
    const newName = pRename[ch.name];
    if (newName) { await ch.setName(newName).catch(() => {}); console.log('  Renamed', ch.name, '→', newName); }
  }

  // New roles (Plutus)
  const pRoles = [
    { name: 'Teller', color: '#3498db' },
    { name: 'Auditor', color: '#c0392b' },
    { name: 'Financial Advisor', color: '#27ae60' },
    { name: 'Accountant', color: '#1abc9c' },
  ];
  for (const r of pRoles) {
    const role = await plutus.roles.create({ name: r.name, color: r.color, reason: 'Setup' }).catch(e => { console.error('  Failed', r.name, e.message); return null; });
    if (role) console.log('  Role:', r.name);
  }

  // New channels (Plutus)
  const pCatId = config.guilds[PLUTUS_ID].category_id;
  const pChs = [
    { name: '💰-vault', topic: 'Giveaways, promos, and exclusive offers.' },
    { name: '💳-card-talk', topic: 'Chat about cards, payments, and transactions.' },
    { name: '📈-stonks', topic: 'Investments, stocks, and market talk.' },
  ];
  for (const ch of pChs) {
    const created = await plutus.channels.create({ name: ch.name, type: 0, topic: ch.topic, parent: pCatId || undefined }).catch(e => { console.error('  Failed', ch.name, e.message); return null; });
    if (created) console.log('  Channel:', ch.name);
  }

  // ─── HECATE CARDS ───
  console.log('--- HECATE CARDS ---');

  // Rename existing channels
  const heChannels = hecate.channels.cache;
  const hRename = {
    '☕-general-chat': '☕-chat',
    '📜-server-rules': '📜-rules',
    '🃏-card-trading': '🃏-trading',
    '🖥️-staff-announcements': '🖥️-staff-news',
    '📡-pokemon-go': '📡-pokemon',
    '🗣️-staff-chat': '💬-staff',
    '🏦-founders-voting': '🏦-voting',
    '🪵-mod-logs': '🪵-logs',
    '💎-investors-submission': '💎-investors',
    '🤖-bot-commands': '🤖-bots',
    '⚔️-battle-arena': '⚔️-arena',
    '🏆-leaderboard': '🏆-top',
    '🔧-changelog': '🔧-updates',
    '📦-flex-zone': '📦-flex',
    '📒-how-to-play': '📒-guide',
  };
  for (const [id, ch] of heChannels) {
    const newName = hRename[ch.name];
    if (newName) { await ch.setName(newName).catch(() => {}); console.log('  Renamed', ch.name, '→', newName); }
  }

  // New roles (Hecate)
  const heRoles = [
    { name: 'Trade Mediator', color: '#1abc9c' },
    { name: 'Tournament Organizer', color: '#e67e22' },
    { name: 'Card Designer', color: '#f1c40f' },
    { name: 'Booster Opener', color: '#e91e63' },
    { name: 'Giveaway Host', color: '#2ecc71' },
  ];
  for (const r of heRoles) {
    const role = await hecate.roles.create({ name: r.name, color: r.color, reason: 'Setup' }).catch(e => { console.error('  Failed', r.name, e.message); return null; });
    if (role) console.log('  Role:', r.name);
  }

  // New channels (Hecate)
  const heCatId = config.guilds[HECATE_ID].category_id;
  const heChs = [
    { name: '🃏-showcase', topic: 'Show off your best cards!' },
    { name: '🎨-art', topic: 'Fan art and card designs.' },
    { name: '🎁-freebies', topic: 'Giveaways and free stuff.' },
    { name: '🗳️-polls', topic: 'Community votes and polls.' },
    { name: '📚-decks', topic: 'Deck building discussions and tips.' },
  ];
  for (const ch of heChs) {
    const created = await hecate.channels.create({ name: ch.name, type: 0, topic: ch.topic, parent: heCatId || undefined }).catch(e => { console.error('  Failed', ch.name, e.message); return null; });
    if (created) console.log('  Channel:', ch.name);
  }

  // ─── HERMES NET ───
  console.log('--- HERMES NET ---');

  // Rename existing channels
  const herChannels = hermes.channels.cache;
  const herRename = {
    '📈-recent-search-trends': '📈-trends',
    '🖥️-operations-feed': '🖥️-feed',
    '📊-traffic-and-analytics': '📊-analytics',
    '🤖-terminal-commands': '🤖-terminal',
    '🪵-system-logs': '🪵-logs',
    '📜-terms-of-service': '📜-tos',
    '💬-staff-lounge': '💬-staff',
    '💡-suggestions': '💡-ideas',
    '🔧-changelog': '🔧-updates',
    '📺-advertising': '📺-ads',
    '☕-lobby': '☕-chat',
  };
  for (const [id, ch] of herChannels) {
    const newName = herRename[ch.name];
    if (newName) { await ch.setName(newName).catch(() => {}); console.log('  Renamed', ch.name, '→', newName); }
  }

  // New roles (Hermes)
  const herRoles = [
    { name: 'Support Agent', color: '#3498db' },
    { name: 'Developer', color: '#1e8449' },
    { name: 'Project Lead', color: '#8e44ad' },
    { name: 'Privacy Officer', color: '#c0392b' },
    { name: 'Infrastructure Engineer', color: '#2c3e50' },
    { name: 'QA Tester', color: '#e67e22' },
  ];
  for (const r of herRoles) {
    const role = await hermes.roles.create({ name: r.name, color: r.color, reason: 'Setup' }).catch(e => { console.error('  Failed', r.name, e.message); return null; });
    if (role) console.log('  Role:', r.name);
  }

  // New channels (Hermes)
  const herCatId = config.guilds[HERMES_ID].category_id;
  const herChs = [
    { name: '📡-status', topic: 'Service status and uptime updates.' },
    { name: '🔌-help', topic: 'Need help? Ask here.' },
    { name: '🌐-chat', topic: 'Network discussions and general chat.' },
    { name: '📅-sprints', topic: 'Sprint planning and dev updates.' },
    { name: '📋-guide', topic: 'Documentation and user guides.' },
    { name: '🔐-staff-only', topic: 'Private staff discussions.' },
    { name: '🤖-bots', topic: 'Bot commands and automation.' },
  ];
  for (const ch of herChs) {
    const created = await hermes.channels.create({ name: ch.name, type: 0, topic: ch.topic, parent: herCatId || undefined }).catch(e => { console.error('  Failed', ch.name, e.message); return null; });
    if (created) console.log('  Channel:', ch.name);
  }

  console.log('Done!');
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);