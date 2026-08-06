require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds] });

const GID = '1534966276290646027';

c.on('ready', async () => {
  const g = c.guilds.cache.get(GID);
  if (!g) { console.log('Missing'); process.exit(1); }
  console.log('== ROLES ==');
  g.roles.cache.filter(r => r.name !== '@everyone').sort((a, b) => b.position - a.position)
    .forEach(r => console.log(r.name + ' | ' + r.id + ' | ' + (r.hexColor || 'none') + (r.managed ? ' [BOT]' : '')));
  console.log('\n== CATEGORIES ==');
  g.channels.cache.filter(ch => ch.type === 4).sort((a, b) => a.rawPosition - b.rawPosition)
    .forEach(ch => console.log(ch.name + ' | ' + ch.id));
  console.log('\n== CHANNELS ==');
  g.channels.cache.filter(ch => ch.type !== 4).sort((a, b) => (a.rawPosition - b.rawPosition) || ((a.parentId || '') < (b.parentId || '') ? -1 : 1))
    .forEach(ch => console.log('#' + ch.name + ' | ' + ch.id + ' | parent=' + (ch.parent?.name || '-') + ' (' + (ch.parentId || '-') + ')'));
  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);