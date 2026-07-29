require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds] });

const GIDS = ['1528793481273671832','1528807603197706332','1528804420383674559','1528800629701480468','1528796628457361449','1528809601674514502'];

c.on('ready', async () => {
  let out = '';
  for (const id of GIDS) {
    const g = c.guilds.cache.get(id);
    if (!g) continue;
    out += '\n=== ' + g.name + ' (' + g.id + ') ===\n\n--CATEGORIES--\n';
    const cats = g.channels.cache.filter(x => x.type === 4).sort((a,b) => a.position - b.position);
    for (const cat of cats.values()) {
      out += '  [' + cat.name + '] (' + cat.id + ')\n';
      const chs = g.channels.cache.filter(x => x.parentId === cat.id).sort((a,b) => a.position - b.position);
      for (const ch of chs.values()) out += '    #' + ch.name + ' (' + ch.id + ')\n';
    }
    out += '\n--UNCATEGORIZED--\n';
    g.channels.cache.filter(x => !x.parentId && x.type !== 4).forEach(ch => out += '  #' + ch.name + ' (' + ch.id + ')\n');
    out += '\n--ROLES--\n';
    g.roles.cache.filter(r => r.name !== '@everyone').sort((a,b) => b.position - a.position).forEach(r => out += '  ' + r.name + ' (' + r.id + ')\n');
  }
  fs.writeFileSync('/app/export.txt', out);
  console.log('Exported');

  const atlas = c.guilds.cache.get('1528793481273671832');
  const cat = await atlas.channels.create({ name: 'Workers', type: 4 });
  const chat = await atlas.channels.create({ name: 'workers-chat', type: 0, topic: 'General discussion for workers across all Atlas Holdings companies.', parent: cat.id });
  const report = await atlas.channels.create({ name: 'workers-report', type: 0, topic: 'Report workplace issues or share feedback.', parent: cat.id });
  const info = await atlas.channels.create({ name: 'workers-info', type: 0, topic: 'Job role descriptions and company information.', parent: cat.id });
  console.log('Workers cat:', cat.id, 'chat:', chat.id, 'report:', report.id, 'info:', info.id);

  const otherServers = ['1528807603197706332','1528804420383674559','1528800629701480468','1528796628457361449','1528809601674514502'];
  for (const id of otherServers) {
    const g = c.guilds.cache.get(id);
    if (!g) continue;
    const overview = g.channels.cache.find(x => (x.name.includes('Corporate Overview') || x.name.includes('HQ Briefing')) && x.type === 4);
    const ch = await g.channels.create({ name: 'how-to-apply', type: 0, topic: 'Apply via tickets in this server first. Once accepted, join Atlas Holdings for cross-server coordination.', parent: overview?.id || undefined });
    console.log('how-to-apply in', g.name, ch.id);
  }

  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);