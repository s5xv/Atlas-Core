require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds] });

const DST = '1534966276290646027';
const SRC = '1528809601674514502';

const REMAINING_DUP_CATS = ['1534968771603595374','1534968772912218252','1534968775911145502'];

c.on('ready', async () => {
  const dst = c.guilds.cache.get(DST);
  const src = c.guilds.cache.get(SRC);
  if (!dst || !src) { console.log('Missing'); process.exit(1); }

  for (const id of REMAINING_DUP_CATS) {
    const cat = dst.channels.cache.get(id);
    if (cat) { await cat.delete().catch(e => console.log('Cat FAIL ' + id)); console.log('Deleted dup category ' + id); }
  }

  const srcAvail = src.channels.cache.find(ch => ch.type === 0 && ch.name.includes('available-plots'));
  if (srcAvail) {
    console.log('Src avail overwrites:', JSON.stringify(srcAvail.permissionOverwrites.cache.toJSON().map(o => ({ id: o.id, type: o.type })), null, 0));
    const overwrites = [];
    for (const o of srcAvail.permissionOverwrites.cache.toJSON()) {
      if (o.type === 0) {
        overwrites.push({ id: o.id, allow: o.allow, deny: o.deny });
      } else if (o.type === 1) {
        console.log('SKIP member overwrite ' + o.id);
      }
    }
    const cat = dst.channels.cache.get('1534967591234175116');
    const created = await dst.channels.create({
      name: srcAvail.name, type: 0, topic: srcAvail.topic,
      permissionOverwrites: overwrites,
      parent: cat ? cat.id : undefined
    }).catch(e => console.log('avail FAIL ' + e.message));
    if (created) console.log('Created #📋-available-plots');
  }

  console.log('Done.');
  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);