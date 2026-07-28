require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cl = new Client({ intents: [GatewayIntentBits.Guilds] });
const NEMESIS = '1528807603197706332';
const names = ['📋-rules','📊-reports','🤝-chat','📁-projects','💡-ideas','🎓-training','🔧-tech-help'];

cl.once('ready', async () => {
  const g = cl.guilds.cache.get(NEMESIS);
  for (const n of names) {
    const chs = g.channels.cache.filter(c => c.name === n);
    chs.forEach(c => console.log('FOUND ' + n + ' id=' + c.id + ' parent=' + (c.parent?.name || 'none') + ' deletable=' + c.deletable));
  }
  process.exit(0);
});
cl.login(process.env.DISCORD_TOKEN);
