require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const DST = '1534966276290646027';
const SRC = '1528809601674514502';

const SECOND_ROLES = [
  '1534968746203021332','1534968748124012746','1534968749390561302','1534968750657507388',
  '1534968751873589420','1534968753413165280','1534968754591629423','1534968755812040894',
  '1534968757254881401','1534968758483816580','1534968759779983451','1534968761243795526',
  '1534968763051540530','1534968764506832909','1534968765924774029','1534968767363416226',
  '1534968768340426794','1534968770161016923'];

const SECOND_CATS = [
  '1534968775728780397','1534968772912592714','1534968774694801551','1534968775911437105',
  '1534968777370763467','1534968778708750397'];

const SECOND_CHANNELS = [
  '1534968780147392674','1534968781929971972','1534968784073396234','1534968785809707191',
  '1534968788041203732','1534968789832040460','1534968791056912485','1534968792281645140',
  '1534968795792277824','1534968797201563770','1534968799613423676','1534968801119047803',
  '1534968802373144676','1534968803962781788','1534968805644566689','1534968807108382740',
  '1534968808463143123','1534968809780412647'];

c.on('ready', async () => {
  const dst = c.guilds.cache.get(DST);
  const src = c.guilds.cache.get(SRC);
  if (!dst || !src) { console.log('Missing'); process.exit(1); }

  for (const id of SECOND_ROLES) {
    const r = dst.roles.cache.get(id);
    if (r) { await r.delete().catch(e => console.log('Role FAIL ' + id)); console.log('Deleted role ' + id); }
  }
  for (const id of SECOND_CHANNELS) {
    const ch = dst.channels.cache.get(id);
    if (ch) { await ch.delete().catch(e => console.log('Ch FAIL ' + id)); console.log('Deleted channel ' + id); }
  }
  for (const id of SECOND_CATS) {
    const cat = dst.channels.cache.get(id);
    if (cat) { await cat.delete().catch(e => console.log('Cat FAIL ' + id)); console.log('Deleted category ' + id); }
  }

  const role = dst.roles.cache.get('1534967585611724313') || dst.roles.cache.get('1534967585601224714');
  if (role) { await role.setName('Z&E Realty').catch(e => console.log('rename FAIL ' + e.message)); console.log('Renamed Demeter Realty role ->' + role.name); }

  const srcAvail = src.channels.cache.find(ch => ch.type === 0 && ch.name.includes('available-plots'));
  if (srcAvail) {
    const overwrites = [];
    for (const o of srcAvail.permissionOverwrites.cache.toJSON()) {
      if (o.type === 0) {
        const mapped = {
          '1534967558896222400': '1534967558896222400',
          '1534967563346251968': '1534967563346251968'
        }[o.id] || o.id;
        overwrites.push({ id: mapped, allow: o.allow, deny: o.deny });
      } else if (o.type === 1) {
        const m = dst.members.cache.get(o.id);
        if (m) overwrites.push({ id: o.id, allow: o.allow, deny: o.deny });
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