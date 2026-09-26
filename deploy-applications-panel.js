const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN || process.env.TOKEN;
const CHANNEL_ID = '1553389315793485824'; // 🍎-applications

if (!TOKEN) { console.error('Set DISCORD_TOKEN.'); process.exit(1); }

const { sendApplicationsPanel } = require('./commands');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    const channel = client.channels.cache.get(CHANNEL_ID) || await client.channels.fetch(CHANNEL_ID);
    if (!channel) { console.error('Applications channel not found!'); process.exit(1); }

    const msg = await sendApplicationsPanel(channel);
    console.log('Applications panel deployed -> ' + msg.url);
    process.exit(0);
  } catch (err) {
    console.error('Error deploying panel:', err);
    process.exit(1);
  }
});

client.login(TOKEN);
