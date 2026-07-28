require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const guilds = ['1528807603197706332','1528804420383674559','1528800629701480468','1528796628457361449'];
const names = ['📋-rules','📊-reports','🤝-chat','📁-projects','💡-ideas','🎓-training','🔧-tech-help'];

client.once('ready', async () => {
  for (const gid of guilds) {
    const g = client.guilds.cache.get(gid);
    if (!g) continue;
    for (const n of names) {
      const ch = g.channels.cache.find(c => c.name === n);
      if (ch) { await ch.delete().catch(() => {}); console.log('Deleted ' + n + ' in ' + g.name); }
    }
  }
  console.log('Done');
  process.exit(0);
});
client.login(process.env.DISCORD_TOKEN);