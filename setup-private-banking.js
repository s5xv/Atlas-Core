const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN || process.env.TOKEN;
const GUILD_ID = '1528804420383674559'; // Plutus Bank Guild ID
const PLUTUS_ROLE_ID = '1528804420383674559'; // The ID you provided for the role

if (!TOKEN) { console.error('Set DISCORD_TOKEN in your .env file or environment.'); process.exit(1); }

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    console.log(`Connected to ${guild.name}. Setting up Private Banking...`);

    if (GUILD_ID === PLUTUS_ROLE_ID) {
      console.warn('⚠️ WARNING: The Role ID provided is identical to the Guild ID (@everyone). Ensure this is correct, otherwise edit PLUTUS_ROLE_ID in this script!');
    }

    const overwrites = [
      { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      { id: PLUTUS_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
      { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages] }
    ];

    let category = guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === '🏦 Private Banking');
    if (!category) {
      category = await guild.channels.create({ name: '🏦 Private Banking', type: ChannelType.GuildCategory, permissionOverwrites: overwrites });
      console.log('Created category: 🏦 Private Banking');
    } else {
      await category.permissionOverwrites.set(overwrites);
      console.log('Updated category permissions.');
    }

    const channelsToCreate = ['💬-private-chat', '🎫-private-tickets', '📢-announcements'];
    for (const name of channelsToCreate) {
      if (!guild.channels.cache.find(c => c.name === name && c.parentId === category.id)) {
        await guild.channels.create({ name, type: ChannelType.GuildText, parent: category.id });
        console.log(`Created channel: ${name}`);
      } else {
        console.log(`Channel ${name} already exists, syncing permissions.`);
        const ch = guild.channels.cache.find(c => c.name === name && c.parentId === category.id);
        await ch.lockPermissions();
      }
    }

    console.log('✅ Private Banking setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error during setup:', err);
    process.exit(1);
  }
});

client.login(TOKEN);
