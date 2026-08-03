require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

c.on('ready', async () => {
  for (const guild of c.guilds.cache.values()) {
    for (const [cid, ch] of guild.channels.cache) {
      if (ch.type !== 0) continue;
      if (ch.name.toLowerCase().includes('link')) {
        const msgs = await ch.messages.fetch({ limit: 100 }).catch(() => null);
        if (!msgs) continue;
        for (const msg of msgs.values()) {
          if (msg.embeds.length) {
            console.log('\n== ' + guild.name + ' | MSG ' + msg.id + ' ==');
            console.log(JSON.stringify(msg.embeds, null, 2));
          }
        }
      }
    }
  }
  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);