require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cl = new Client({ intents: [GatewayIntentBits.Guilds] });

const SPONSOR_CHANNELS = [
  { gid: '1528807603197706332', name: 'sponsor-or-promote', topic: 'Open a ticket at discord.gg/GWCgXS8D9q to sponsor or promote your business!' },
  { gid: '1528804420383674559', name: 'sponsor-or-promote', topic: 'Open a ticket at discord.gg/GWCgXS8D9q to sponsor or promote your business!' },
  { gid: '1528800629701480468', name: 'sponsor-or-promote', topic: 'Open a ticket at discord.gg/GWCgXS8D9q to sponsor or promote your business!' },
  { gid: '1528796628457361449', name: 'sponsor-or-promote', topic: 'Open a ticket at discord.gg/GWCgXS8D9q to sponsor or promote your business!' },
  { gid: '1528809601674514502', name: 'sponsor-or-promote', topic: 'Open a ticket at discord.gg/GWCgXS8D9q to sponsor or promote your business!' },
];

// Add sponsors category/channel to Welcome / Main Lobby / Main Index categories
const CATS = {
  '1528807603197706332': '1528808824977232085',
  '1528804420383674559': '1528807094864711700',
  '1528800629701480468': '1528802621324918935',
  '1528796628457361449': '1528799119433535599',
  '1528809601674514502': '1528840498372939787',
};

cl.once('ready', async () => {
  for (const sc of SPONSOR_CHANNELS) {
    const g = cl.guilds.cache.get(sc.gid);
    if (!g) continue;
    const exists = g.channels.cache.find(x => x.name === sc.name);
    if (exists) { console.log('Exists: sponsor-or-promote in', g.name); continue; }
    const ch = await g.channels.create({ name: sc.name, type: 0, topic: sc.topic, parent: CATS[sc.gid] || undefined });
    if (ch) console.log('Created sponsor-or-promote in', g.name);
  }
  console.log('Done');
  process.exit(0);
});
cl.login(process.env.DISCORD_TOKEN);
