require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const NEW_DESC = [
  '1-Atlas Holdings(The Parent Company holding all my shares)',
  'https://discord.gg/FDjYNX5CwY',
  '2-Hermes Net(A Search Engine designed to contain all wiki pages and businesses on districtrp)',
  'https://discord.gg/jbfwTZyBuS',
  '3- Plutus Bank(A bank designed for your comfort)',
  'https://discord.gg/7eS39YwW9e',
  '4- Demeter Realty(A Realty Company helping you find your dream plot)',
  'https://discord.gg/pzj6kXkjg9'
].join('\n');

const MSG_IDS = {
  '1528793481273671832': ['1528903445820604567'],
  '1528796628457361449': ['1528903275993239643'],
  '1528804420383674559': ['1528903400677441587'],
  '1528809601674514502': ['1528903416363876373']
};

c.on('ready', async () => {
  for (const [gid, mids] of Object.entries(MSG_IDS)) {
    const guild = c.guilds.cache.get(gid);
    if (!guild) { console.log('Guild missing: ' + gid); continue; }
    for (const ch of guild.channels.cache.values()) {
      if (ch.type !== 0) continue;
      if (ch.name.toLowerCase().includes('link')) {
        for (const mid of mids) {
          const msg = await ch.messages.fetch(mid).catch(() => null);
          if (!msg || !msg.embeds.length) continue;
          const embed = EmbedBuilder.from(msg.embeds[0]).setDescription(NEW_DESC);
          await msg.edit({ embeds: [embed] }).catch(e => console.log('FAIL ' + gid + ': ' + e.message));
          console.log('Updated ' + guild.name + ' / ' + mid);
        }
      }
    }
  }
  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);