require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds] });
c.on('ready', async () => {
  console.log('Bot sees ' + c.guilds.cache.size + ' guilds:');
  c.guilds.cache.forEach(g => console.log(g.id + ' | ' + g.name));
  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);