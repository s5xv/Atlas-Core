require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const ATLAS_ID = '1528793481273671832';
const NEMESIS_ID = '1528807603197706332';
const PLUTUS_ID = '1528804420383674559';
const HECATE_ID = '1528800629701480468';
const HERMES_ID = '1528796628457361449';

// Channels that were wrongly created (some may have been renames, not new)
const toDelete = {
  [ATLAS_ID]: ['📋-rules', '📊-reports', '🤝-chat', '📁-projects', '💡-ideas', '🎓-training', '🔧-tech-help'],
  [NEMESIS_ID]: ['☕-lobby', '📡-clips', '🔧-changelog'],
  [PLUTUS_ID]: ['💰-vault', '💳-card-talk', '📈-stonks'],
  [HECATE_ID]: ['🃏-showcase', '🎨-art', '🎁-freebies', '🗳-polls', '📚-decks'],
  [HERMES_ID]: ['📡-status', '🔌-help', '🌐-chat', '📅-sprints', '📋-guide', '🔐-staff-only', '🤖-bots'],
};

// Reference channel to find the right category (use announcements or chat)
const refChannels = {
  [ATLAS_ID]: '📢-announcements',
  [NEMESIS_ID]: '📢-updates',
  [PLUTUS_ID]: '📢-announcements',
  [HECATE_ID]: '📢-announcements',
  [HERMES_ID]: '📢-announcements',
};

client.once('ready', async () => {
  for (const [guildId, names] of Object.entries(toDelete)) {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) { console.log('Guild not found', guildId); continue; }

    // Find parent category from a reference channel
    const refCh = guild.channels.cache.find(c => c.name === refChannels[guildId]);
    const parentId = refCh?.parentId;
    console.log(guild.name, '→ using category:', refCh?.parent?.name || 'none', '(' + parentId + ')');

    // Delete duplicate channels
    for (const name of names) {
      const chs = guild.channels.cache.filter(c => c.name === name);
      if (chs.size > 1) {
        // Keep the one in the right category (or the first one if none match), delete the rest
        let kept = false;
        for (const [id, ch] of chs) {
          if (!kept && ch.parentId === parentId) { kept = true; continue; }
          if (!kept && !chs.find(c => c.parentId === parentId)) { kept = true; continue; }
          await ch.delete().catch(() => {});
          console.log('  Deleted', name, '(wrong category)');
        }
      }
    }

    // Create channels that don't exist yet, in the right category
    const newChs = [
      { name: '📋-rules', topic: 'Server rules — know them, follow them.' },
      { name: '📊-reports', topic: 'Report issues or share feedback here.' },
      { name: '🤝-chat', topic: 'General hangout and collaboration.' },
      { name: '📁-projects', topic: 'Discuss ongoing projects and tasks.' },
      { name: '💡-ideas', topic: 'Got a bright idea? Drop it here.' },
      { name: '🎓-training', topic: 'Training materials and guides for new members.' },
      { name: '🔧-tech-help', topic: 'Tech issues? Ask here.' },
    ];
    for (const ch of newChs) {
      if (guild.channels.cache.find(c => c.name === ch.name && c.parentId === parentId)) continue;
      if (guild.channels.cache.find(c => c.name === ch.name)) {
        // Move it to the right category instead of recreating
        const existing = guild.channels.cache.find(c => c.name === ch.name);
        await existing.setParent(parentId, { lockPermissions: false }).catch(() => {});
        console.log('  Moved', ch.name, 'to correct category');
        continue;
      }
      await guild.channels.create({ name: ch.name, type: 0, topic: ch.topic, parent: parentId || undefined }).catch(e => console.error('  Failed', ch.name, e.message));
      console.log('  Created', ch.name);
    }
  }

  console.log('Done!');
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);