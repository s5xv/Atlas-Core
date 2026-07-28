require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds] });

const GUILDS = [
  { id: '1528793481273671832', name: 'Atlas Holdings' },
  { id: '1528807603197706332', name: 'Nemesis Security' },
  { id: '1528804420383674559', name: 'Plutus Banking' },
  { id: '1528800629701480468', name: 'Hecate Cards' },
  { id: '1528796628457361449', name: 'Hermes Net' },
  { id: '1528809601674514502', name: 'Demeter Realty' },
];

const PING_ROLES = [
  { name: 'Announcements', color: '#ff0000' },
  { name: 'Giveaways', color: '#ff69b4' },
  { name: 'Events', color: '#ffa500' },
  { name: 'Updates', color: '#3498db' },
  { name: 'Polls', color: '#9b59b6' },
];

const EXTRA_ROLES = {
  '1528793481273671832': [],  // Atlas already has Promotion
  '1528807603197706332': [{ name: 'Promotion', color: '#f1c40f' }, { name: 'Sponsor', color: '#e67e22' }],
  '1528804420383674559': [{ name: 'Promotion', color: '#f1c40f' }, { name: 'Sponsor', color: '#e67e22' }],
  '1528800629701480468': [{ name: 'Promotion', color: '#f1c40f' }],  // Hecate already has Sponser
  '1528796628457361449': [{ name: 'Promotion', color: '#f1c40f' }, { name: 'Sponsor', color: '#e67e22' }],
  '1528809601674514502': [{ name: 'Promotion', color: '#f1c40f' }, { name: 'Sponsor', color: '#e67e22' }],
};

c.once('ready', async () => {
  for (const g of GUILDS) {
    const guild = c.guilds.cache.get(g.id);
    if (!guild) { console.log('Skip', g.name); continue; }

    // Create ping roles
    for (const r of PING_ROLES) {
      const exists = guild.roles.cache.find(x => x.name === r.name);
      if (!exists) {
        await guild.roles.create({ name: r.name, color: r.color, reason: 'Ping role setup' }).catch(e => console.log('Fail', r.name, e.message));
        console.log('Created ping role', r.name, 'in', g.name);
      }
    }

    // Create extra roles
    const extra = EXTRA_ROLES[g.id] || [];
    for (const r of extra) {
      const exists = guild.roles.cache.find(x => x.name === r.name);
      if (!exists) {
        await guild.roles.create({ name: r.name, color: r.color, reason: 'Extra role setup' }).catch(e => console.log('Fail', r.name, e.message));
        console.log('Created role', r.name, 'in', g.name);
      }
    }
  }
  console.log('Done');
  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);
