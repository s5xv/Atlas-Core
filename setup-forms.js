require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, TextInputStyle } = require('discord.js');
const path = require('path');
const fs = require('fs');

const DATA_PATH = path.join(__dirname, 'data.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const ATLAS_ID = '1528793481273671832';
const NEMESIS_ID = '1528807603197706332';
const PLUTUS_ID = '1528804420383674559';
const HECATE_ID = '1528800629701480468';
const HERMES_ID = '1528796628457361449';

function S(label) { return { label, type: TextInputStyle.Short, required: true, customId: 'f_' + label.replace(/\s/g, '_') }; }
function P(label) { return { label, type: TextInputStyle.Paragraph, required: true, customId: 'f_' + label.replace(/\s/g, '_') }; }

function addForm(data, name, guildId, fields) {
  if (!data.customForms) data.customForms = {};
  data.customForms[name] = { guildId, fields };
}

function addPanel(data, name, guildId, title, description, buttons, color) {
  if (!data.customPanels) data.customPanels = {};
  data.customPanels[name] = { guildId, title, description, color: color || '#2F3136', buttons };
}

client.once('ready', async () => {
  console.log('Creating forms...');

  let data = {};
  try { data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')); } catch {}

  // ATLAS FORMS
  addForm(data, 'atlas-support', ATLAS_ID, [S('Department'), P('Describe the issue'), S('Urgency (low/med/high)'), S('Employee ID')]);
  addForm(data, 'atlas-hr', ATLAS_ID, [S('Issue type'), P('Describe the situation'), S('Who is involved'), S('When did it happen')]);
  addForm(data, 'atlas-it', ATLAS_ID, [S('Issue type'), P('Describe the problem'), S('Device/System'), S('Urgency')]);
  addPanel(data, 'atlas-tickets', ATLAS_ID, 'Support Center', 'Click a button below.', [
    { label: 'Support', style: 'Primary', formName: 'atlas-support' },
    { label: 'HR Issue', style: 'Danger', formName: 'atlas-hr' },
    { label: 'IT Request', style: 'Secondary', formName: 'atlas-it' },
  ], '#D4AF37');

  // NEMESIS FORMS
  addForm(data, 'nemesis-report', NEMESIS_ID, [S('Player username'), P('What rule did they break'), S('Evidence link')]);
  addForm(data, 'nemesis-help', NEMESIS_ID, [S('What do you need'), P('Describe the issue')]);
  addForm(data, 'nemesis-appeal', NEMESIS_ID, [S('Your username'), P('Why were you punished'), P('Why should it be removed')]);
  addPanel(data, 'nemesis-tickets', NEMESIS_ID, 'Security Desk', 'Open a ticket below.', [
    { label: 'Report', style: 'Danger', formName: 'nemesis-report' },
    { label: 'Help', style: 'Primary', formName: 'nemesis-help' },
    { label: 'Appeal', style: 'Secondary', formName: 'nemesis-appeal' },
  ], '#8B0000');

  // PLUTUS FORMS
  addForm(data, 'plutus-support', PLUTUS_ID, [S('Account ID'), S('Issue type'), P('Describe the issue')]);
  addForm(data, 'plutus-loan', PLUTUS_ID, [S('Amount needed'), P('Purpose of loan'), S('Repayment timeframe')]);
  addForm(data, 'plutus-dispute', PLUTUS_ID, [S('Transaction ID'), P('Describe the dispute'), S('Amount involved')]);
  addPanel(data, 'plutus-tickets', PLUTUS_ID, 'Banking Services', 'Select a service below.', [
    { label: 'Support', style: 'Primary', formName: 'plutus-support' },
    { label: 'Loan', style: 'Success', formName: 'plutus-loan' },
    { label: 'Dispute', style: 'Danger', formName: 'plutus-dispute' },
  ], '#1E4620');

  // HECATE FORMS
  addForm(data, 'hecate-trade', HECATE_ID, [S('Who are you trading with'), P('Cards involved'), P('Describe the issue')]);
  addForm(data, 'hecate-tournament', HECATE_ID, [S('In-game name'), S('Deck type'), S('Tournament name')]);
  addForm(data, 'hecate-support', HECATE_ID, [S('Issue type'), P('Describe your issue')]);
  addPanel(data, 'hecate-tickets', HECATE_ID, 'Help Center', 'How can we help?', [
    { label: 'Trade Dispute', style: 'Danger', formName: 'hecate-trade' },
    { label: 'Tournament', style: 'Success', formName: 'hecate-tournament' },
    { label: 'Support', style: 'Primary', formName: 'hecate-support' },
  ], '#8E44AD');

  // HERMES FORMS
  addForm(data, 'hermes-tech', HERMES_ID, [S('Service affected'), P('Describe the issue'), S('When did it start'), S('Error message')]);
  addForm(data, 'hermes-feature', HERMES_ID, [S('Feature name'), P('Describe the feature'), P('How would this help')]);
  addForm(data, 'hermes-billing', HERMES_ID, [S('Account/Invoice ID'), P('Describe the issue'), S('Amount')]);
  addPanel(data, 'hermes-tickets', HERMES_ID, 'Support Hub', 'How can we assist you?', [
    { label: 'Tech Support', style: 'Primary', formName: 'hermes-tech' },
    { label: 'Feature Request', style: 'Success', formName: 'hermes-feature' },
    { label: 'Billing', style: 'Danger', formName: 'hermes-billing' },
  ], '#2980B9');

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  console.log('Forms saved to data.json');

  // SEND WELCOME MESSAGES
  console.log('Sending welcome messages...');

  const guilds = {
    atlas: client.guilds.cache.get(ATLAS_ID),
    nemesis: client.guilds.cache.get(NEMESIS_ID),
    plutus: client.guilds.cache.get(PLUTUS_ID),
    hecate: client.guilds.cache.get(HECATE_ID),
    hermes: client.guilds.cache.get(HERMES_ID),
  };

  const msgs = {
    atlas: {
      '📋-rules': { embeds: [new EmbedBuilder().setTitle('Rules').setDescription('1. Be respectful\n2. No spamming\n3. Follow management\n4. Keep organized\n5. Have fun!').setColor('#D4AF37')] },
      '📊-reports': 'Report issues or share feedback here.',
      '🤝-chat': 'Welcome! Hang out and collaborate.',
      '📁-projects': 'Discuss projects and tasks.',
      '💡-ideas': 'Drop your bright ideas here!',
      '🎓-training': 'Training materials for new members.',
      '🔧-tech-help': 'Ask IT support here.',
    },
    nemesis: {
      '☕-lobby': { embeds: [new EmbedBuilder().setTitle('Welcome').setDescription('General chat — hang out!').setColor('#8B0000')] },
      '📡-clips': 'Share your best clips!',
      '🔧-changelog': { embeds: [new EmbedBuilder().setTitle('Changelog').setDescription('Latest updates posted here.').setColor('#8B0000')] },
    },
    plutus: {
      '💰-vault': { embeds: [new EmbedBuilder().setTitle('Vault').setDescription('Giveaways and exclusive offers.').setColor('#1E4620')] },
      '💳-card-talk': 'Chat about cards and payments.',
      '📈-stonks': { embeds: [new EmbedBuilder().setTitle('Stonks').setDescription('Market talk. Not financial advice.').setColor('#1E4620')] },
    },
    hecate: {
      '🃏-showcase': { embeds: [new EmbedBuilder().setTitle('Showcase').setDescription('Show off your cards!').setColor('#8E44AD')] },
      '🎨-art': 'Fan art and designs.',
      '🎁-freebies': 'Giveaways and free stuff!',
      '🗳️-polls': 'Community votes and polls.',
      '📚-decks': 'Deck building tips and strategies.',
    },
    hermes: {
      '📡-status': { embeds: [new EmbedBuilder().setTitle('Service Status').setDescription('Uptime and maintenance updates.').setColor('#2980B9')] },
      '🔌-help': 'Need help? Ask here.',
      '🌐-chat': 'Network discussions and general chat.',
      '📅-sprints': 'Sprint planning and dev updates.',
      '📋-guide': 'Docs and user guides.',
      '🔐-staff-only': { embeds: [new EmbedBuilder().setTitle('Staff Only').setDescription('Private staff channel.').setColor('#2980B9')] },
      '🤖-bots': 'Bot commands and automation.',
    },
  };

  for (const [key, channels] of Object.entries(msgs)) {
    const guild = guilds[key];
    if (!guild) continue;
    for (const [chName, content] of Object.entries(channels)) {
      const ch = guild.channels.cache.find(c => c.name === chName);
      if (!ch) continue;
      try {
        if (typeof content === 'string') await ch.send(content).catch(() => {});
        else if (content.embeds) await ch.send(content).catch(() => {});
        console.log('  Sent to', guild.name, '#', chName);
      } catch {}
    }
  }

  console.log('All done!');
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);
