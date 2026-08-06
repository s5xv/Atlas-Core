require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds] });

const SRC = '1528809601674514502';
const DST = '1534966276290646027';

c.on('ready', async () => {
  const src = c.guilds.cache.get(SRC);
  const dst = c.guilds.cache.get(DST);
  if (!src || !dst) { console.log('Guild missing'); process.exit(1); }

  const roleMap = {};
  const skippedRoles = [];

  const srcRoles = src.roles.cache.filter(r => r.name !== '@everyone')
    .sort((a, b) => b.position - a.position);

  for (const role of srcRoles.values()) {
    const perms = new PermissionsBitField(role.permissions.bitfield & ~PermissionsBitField.Flags.Administrator).toArray();
    const permsMap = { permissions: perms.length ? perms : [] };
    if (!perms.length) delete permsMap.permissions;
    const created = await dst.roles.create({
      name: role.name,
      color: role.hexColor || null,
      hoist: role.hoist || false,
      mentionable: role.mentionable || false,
      ...permsMap
    }).catch(e => { console.log('Role FAIL ' + role.name + ': ' + e.message); return null; });
    if (created) {
      roleMap[role.id] = created.id;
      console.log('Role: ' + role.name + ' -> ' + created.id);
    } else {
      skippedRoles.push(role.id);
    }
  }

  const idMap = (oldId) => {
    if (oldId === src.id) return dst.id;
    return roleMap[oldId] || null;
  };

  const mapOverwrites = (overwrites) => {
    const out = [];
    for (const o of overwrites) {
      if (o.type === 0) {
        const nid = idMap(o.id);
        if (!nid) continue;
        out.push({ id: nid, allow: o.allow, deny: o.deny });
      } else if (o.type === 1) {
        out.push({ id: o.id, allow: o.allow, deny: o.deny });
      }
    }
    return out;
  };

  const catMap = {};
  const sorted = src.channels.cache.filter(ch => ch.parentId === null || ch.parentId !== null)
    .sort((a, b) => (a.rawPosition - b.rawPosition) || ((a.parentId || '') < (b.parentId || '') ? -1 : 1));

  const cats = src.channels.cache.filter(ch => ch.type === 4).sort((a, b) => a.rawPosition - b.rawPosition);

  for (const cat of cats.values()) {
    const created = await dst.channels.create({
      name: cat.name,
      type: 4,
      permissionOverwrites: mapOverwrites(cat.permissionOverwrites.cache.toJSON())
    }).catch(e => { console.log('Cat FAIL ' + cat.name + ': ' + e.message); return null; });
    if (created) {
      catMap[cat.id] = created.id;
      console.log('Category: ' + cat.name);
    }
  }

  const nonCats = src.channels.cache.filter(ch => ch.type !== 4).sort((a, b) => {
    const ap = a.parentId ? cats.findKey(x => x.id === a.parentId) || 0 : -1;
    return 0;
  });

  const channels = src.channels.cache.filter(ch => ch.type !== 4).sort((a, b) => {
    if (a.parentId !== b.parentId) {
      const ap = cats.findKey(x => x.id === a.parentId);
      const bp = cats.findKey(x => x.id === b.parentId);
      return (ap === undefined ? -1 : ap) - (bp === undefined ? -1 : bp);
    }
    return a.rawPosition - b.rawPosition;
  });

  for (const ch of channels.values()) {
    const opts = {
      name: ch.name,
      type: ch.type,
      topic: ch.topic || undefined,
      nsfw: ch.nsfw || false,
      permissionOverwrites: mapOverwrites(ch.permissionOverwrites.cache.toJSON())
    };
    if (ch.type === 2) {
      opts.bitrate = ch.bitrate;
      opts.userLimit = ch.userLimit || 0;
    }
    if (ch.parentId && catMap[ch.parentId]) opts.parent = catMap[ch.parentId];
    Object.keys(opts).forEach(k => opts[k] === undefined && delete opts[k]);
    const created = await dst.channels.create(opts).catch(e => { console.log('Channel FAIL #' + ch.name + ': ' + e.message); return null; });
    if (created) console.log('Channel: #' + ch.name);
  }

  console.log('\nDone. Roles: ' + Object.keys(roleMap).length + ' | Categories: ' + Object.keys(catMap).length);
  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);