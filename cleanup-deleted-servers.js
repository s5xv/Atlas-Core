require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const TARGETS = ['hecate', 'nemesis'];

c.on('ready', async () => {
  for (const guild of c.guilds.cache.values()) {
    console.log('\n== ' + guild.name + ' ==');
    for (const [cid, ch] of guild.channels.cache) {
      if (ch.type !== 0) continue;
      if (ch.name.toLowerCase().includes('link') || ch.name.toLowerCase().includes('sponsor') || ch.name.toLowerCase().includes('worker')) {
        let found = false;
        try {
          const msgs = await ch.messages.fetch({ limit: 100 });
          for (const msg of msgs.values()) {
            if (msg.author.bot && msg.content && TARGETS.some(t => msg.content.toLowerCase().includes(t))) {
              console.log('DELETE #' + ch.name + ' | ' + msg.author.tag + ' | ' + msg.content.slice(0, 60));
              await msg.delete().catch(() => {});
              found = true;
            }
          }
        } catch (e) { console.log('skip #' + ch.name); }
        if (!found) console.log('OK #' + ch.name);
      }
    }
  }
  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);