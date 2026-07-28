require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds] });

const CFG = {
  '1528793481273671832': { memberRole: '1528794225414770898', newRoles: ['1531770103140585663','1531770104092557424','1531770105678008500','1531770106386845900','1531770107796390180','1531770109574516846','1531770110686269703','1531770111826858248','1531770113353580606'] },
  '1528807603197706332': { memberRole: '1528808532135383191', newRoles: ['1531770129652645900','1531770131338891354','1531770132672807134'] },
  '1528804420383674559': { memberRole: '1528804886597206243', newRoles: ['1531770145473560596','1531770147159806085','1531770147986215165','1531770149084860667'] },
  '1528800629701480468': { memberRole: '1528801416917946520', newRoles: ['1531770168991289464','1531770170161369228','1531770171725975803','1531770173760078058','1531770175089672223'] },
  '1528796628457361449': { memberRole: '1528798225480286370', newRoles: ['1531770194639323228','1531770196308529343','1531770197709688992','1531770198875570236','1531770199810904066','1531770201228705804'] },
};

c.on('ready', async () => {
  for (const [gid, cfg] of Object.entries(CFG)) {
    const g = c.guilds.cache.get(gid);
    if (!g) { console.log('Skip guild', gid); continue; }

    for (const ch of g.channels.cache.filter(x => x.parentId && x.type === 0).values()) {
      if (ch.permissionsLocked === false) {
        await ch.lockPermissions().catch(e => console.log('Perm sync fail', ch.name, e.message));
        console.log('Synced perms:', ch.name, 'in', g.name);
      }
    }

    const memberRole = g.roles.cache.get(cfg.memberRole);
    if (!memberRole) { console.log('No member role in', g.name); continue; }
    const targetPos = memberRole.position;
    const roles = cfg.newRoles.map(id => g.roles.cache.get(id)).filter(Boolean);
    roles.sort((a, b) => a.position - b.position);
    for (let i = 0; i < roles.length; i++) {
      const pos = targetPos + i;
      if (roles[i].position !== pos) {
        await roles[i].setPosition(pos).catch(e => console.log('Reorder fail', roles[i].name, e.message));
        console.log('Moved role', roles[i].name, 'to pos', pos, 'in', g.name);
      }
    }
  }
  console.log('Done');
  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);