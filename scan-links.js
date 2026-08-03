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
        console.log('\n== #' + ch.name + ' (' + guild.name + ') ==');
        for (const msg of msgs.values()) {
          const c1 = (msg.content || '').toLowerCase();
          const c2 = JSON.stringify(msg.embeds.map(e => ({ t: e.title || '', d: e.description || '', f: (e.fields || []).map(x => x.name + ' ' + x.value).join(' ') }))).toLowerCase();
          const has = c1.includes('hecate') || c1.includes('nemesis') || c2.includes('hecate') || c2.includes('nemesis');
          if (has) console.log('MSG ' + msg.id + ' | ' + msg.author.tag + ' (bot:' + msg.author.bot + ') | ' + (msg.content || '').slice(0, 80) + '\n   EMBEDS: ' + JSON.stringify(msg.embeds.map(e => e.title || e.description).slice(0, 2)));
        }
      }
    }
  }
  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);