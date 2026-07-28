require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const c = new Client({ intents: [GatewayIntentBits.Guilds] });

const SERVERS = [
  { id: '1528793481273671832', name: 'Atlas Holdings',        an: '📢-announcements', ru: '📜-rules',      gc: '🤝-chat',        sp: '💼-sponsorship' },
  { id: '1528807603197706332', name: 'Nemesis Security',      an: '📢-updates',       ru: '📜-rules',      gc: '☕-chat',        sp: '💼-sponsorship' },
  { id: '1528804420383674559', name: 'Plutus Banking',        an: '📢-announcements', ru: '📜-rules',      gc: '☕-lobby',       sp: '💼-sponsorship' },
  { id: '1528800629701480468', name: 'Hecate Cards',          an: '📢-announcements', ru: '📜-rules',      gc: '☕-chat',        sp: '💼-sponsorship' },
  { id: '1528796628457361449', name: 'Hermes Net',            an: '📢-announcements', ru: '📜-tos',        gc: '☕-chat',        sp: '💼-sponsorship' },
  { id: '1528809601674514502', name: 'Demeter Realty',        an: '📢-announcements', ru: '📜-firm-policy', gc: '☕-chat',        sp: '💼-sponsorship' },
];

const PING_NAMES = ['Announcements', 'Giveaways', 'Events', 'Updates', 'Polls'];

c.on('ready', async () => {
  for (const sv of SERVERS) {
    const g = c.guilds.cache.get(sv.id);
    if (!g) { console.log('Skip', sv.name); continue; }

    const ch_an = g.channels.cache.find(x => x.name === sv.an);
    const ch_ru = g.channels.cache.find(x => x.name === sv.ru);
    const ch_gc = g.channels.cache.find(x => x.name === sv.gc);
    const ch_sp = g.channels.cache.find(x => x.name === sv.sp);

    const defs = [ch_an, ch_ru, ch_gc, ch_sp].filter(Boolean).map(x => x.id);
    
    // Build role prompt options
    const promptOptions = [];
    for (const rn of PING_NAMES) {
      const role = g.roles.cache.find(x => x.name === rn);
      if (role) promptOptions.push({ roleId: role.id, title: rn, description: `Get notified about ${rn.toLowerCase()}` });
    }

    // Build onboarding payload
    const prompts = [{
      id: 1,
      type: 1, // MULTIPLE_CHOICE (can select multiple)
      options: promptOptions.map((o, i) => ({
        id: i + 1,
        roleIds: [o.roleId],
        title: o.title,
        description: o.description
      })),
      title: 'Notification Roles',
      singleSelect: false,
      required: false,
      inOnboarding: true
    }];

    const body = JSON.stringify({
      enabled: true,
      mode: 2, // ONBOARDING
      default_channel_ids: defs,
      prompts: prompts,
      resource_channel_ids: [ch_an?.id, ch_ru?.id, ch_sp?.id].filter(Boolean)
    });

    // Use REST API directly
    const res = await fetch(`https://discord.com/api/v10/guilds/${sv.id}/onboarding`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bot ${process.env.DISCORD_TOKEN}`, 'Content-Type': 'application/json' },
      body
    });
    const data = await res.json();
    if (res.ok) console.log('Onboarding set for', sv.name);
    else console.log('Fail', sv.name, data.message || JSON.stringify(data));
  }
  process.exit(0);
});
c.login(process.env.DISCORD_TOKEN);
