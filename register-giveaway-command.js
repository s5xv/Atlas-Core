try {
  require('dotenv').config();
} catch (_) {}

const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
} = require('discord.js');

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('Missing DISCORD_TOKEN.');
  process.exit(1);
}

const command = new SlashCommandBuilder()
  .setName('giveaway')
  .setDescription('Create a giveaway. Owner only.')
  .setDMPermission(false)
  .addStringOption(option =>
    option
      .setName('prize')
      .setDescription('What are you giving away?')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('duration')
      .setDescription('Example: 30s, 5m, 2h, 1d')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option
      .setName('winners')
      .setDescription('Number of winners')
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(20)
  );

async function upsertCommand(manager) {
  const existing = (await manager.fetch()).find(c => c.name === command.name);

  if (existing) {
    await manager.edit(existing.id, command.toJSON());
  } else {
    await manager.create(command.toJSON());
  }
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once('ready', async () => {
  try {
    if (process.env.GUILD_ID) {
      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      await upsertCommand(guild.commands);
      console.log(`Registered /giveaway in guild: ${guild.name}`);
    } else {
      const guilds = await client.guilds.fetch();

      for (const [, guild] of guilds) {
        try {
          await upsertCommand(guild.commands);
          console.log(`Registered /giveaway in guild: ${guild.name}`);
        } catch (error) {
          console.error(`Failed in guild ${guild.name}:`, error.message);
        }
      }
    }

    console.log('✅ Giveaway command registration complete.');
  } catch (error) {
    console.error('Registration failed:', error);
    process.exitCode = 1;
  } finally {
    client.destroy();
  }
});

client.login(token).catch(error => {
  console.error('Login failed:', error);
  process.exit(1);
});
