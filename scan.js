require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cl = new Client({ intents: [GatewayIntentBits.Guilds] });

const gids = ['1528793481273671832','1528807603197706332','1528804420383674559','1528800629701480468','1528796628457361449'];

cl.once('ready', async () => {
  for (const gid of gids) {
    const g = cl.guilds.cache.get(gid);
    if (!g) { console.log(gid + ' NOT FOUND'); continue; }
    console.log('\n=== ' + g.name + ' ===');

    console.log('CATEGORIES:');
    g.channels.cache.filter(c => c.type === 4).forEach(c => console.log('  ' + c.name + ' (' + c.id + ')'));

    console.log('CHANNELS:');
    g.channels.cache.filter(c => c.type !== 4).forEach(c => console.log('  ' + c.name + ' (' + c.id + ') → ' + (c.parent?.name || 'no category')));

    console.log('ROLES:');
    g.roles.cache.filter(r => r.name !== '@everyone').forEach(r => console.log('  ' + r.name + ' (' + r.id + ') ' + r.hexColor));
  }
  process.exit(0);
});
cl.login(process.env.DISCORD_TOKEN);