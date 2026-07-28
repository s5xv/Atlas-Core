require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cl = new Client({ intents: [GatewayIntentBits.Guilds] });

const NEMESIS = '1528807603197706332';
const PLUTUS = '1528804420383674559';
const HECATE = '1528800629701480468';
const HERMES = '1528796628457361449';

cl.once('ready', async () => {
  const moves = {
    [NEMESIS]: { '☕-lobby': '💬-Main Concurence', '📡-clips': '💬-Main Concurence', '🔧-changelog': '🏢-HQ Briefing Room' },
    [PLUTUS]: { '💰-vault': '💬-Main Lobby', '💳-card-talk': '💬-Main Lobby', '📈-stonks': '💬-Main Lobby' },
    [HECATE]: { '🃏-showcase': '🃏-Card & Go Hub', '🎨-art': '💬-Main Chat', '🎁-freebies': '💬-Main Chat', '🗳-polls': '💬-Main Chat', '📚-decks': '🃏-Card & Go Hub' },
    [HERMES]: { '📡-status': '🏢-Corporate Overview', '🔌-help': '📥-User Support', '🌐-chat': '💬-Main Index', '📅-sprints': '🗄-Database Operations', '📋-guide': '🏢-Corporate Overview', '🔐-staff-only': '🗄-Database Operations', '🤖-bots': '💬-Main Index' },
  };

  for (const [gid, chs] of Object.entries(moves)) {
    const g = cl.guilds.cache.get(gid);
    if (!g) continue;
    for (const [chName, catName] of Object.entries(chs)) {
      const ch = g.channels.cache.find(c => c.name === chName);
      const cat = g.channels.cache.find(c => c.name === catName && c.type === 4);
      if (ch && cat) {
        await ch.setParent(cat.id, { lockPermissions: false }).catch(e => console.log('Failed', chName, e.message));
        console.log('Moved: ' + chName + ' → ' + catName);
      } else {
        console.log('Skip: ' + chName + ' — ' + (ch ? 'no category' : 'no channel'));
      }
    }
  }

  // Delete duplicate 📋-rules in Atlas (keep old 📜-rules)
  const atlas = cl.guilds.cache.get('1528793481273671832');
  const dup = atlas.channels.cache.find(c => c.name === '📋-rules' && c.id !== '1528795598436962334');
  if (dup) { await dup.delete(); console.log('Deleted duplicate 📋-rules'); }

  console.log('Done');
  process.exit(0);
});
cl.login(process.env.DISCORD_TOKEN);