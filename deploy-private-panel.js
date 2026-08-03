try {
  require('dotenv').config();
} catch (_) {}

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const PANEL_CHANNEL_ID = '1533904422558634106';

if (!token) {
  console.error('Missing DISCORD_TOKEN.');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once('ready', async () => {
  try {
    const channel = await client.channels.fetch(PANEL_CHANNEL_ID);

    if (!channel) {
      throw new Error('Private banking panel channel not found.');
    }

    const messages = await channel.messages
      .fetch({ limit: 50 })
      .catch(() => null);

    const existing = messages?.find(
      message =>
        message.author.id === client.user.id &&
        message.components?.some(row =>
          row.components?.some(
            component => component.customId === 'open_private_bank_ticket'
          )
        )
    );

    if (existing) {
      console.log('Private banking panel already exists:', existing.url);
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('🏦 Private Banking')
      .setDescription(
        [
          'Click the button below to open a private banking ticket.',
          '',
          'This ticket can only be opened by **Branch Managers**.',
          'The ticket will include Private Banking staff and an Accountant.',
        ].join('\n')
      )
      .setColor(0x57f287)
      .setFooter({ text: 'Plutus Banking • Private Banking' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open_private_bank_ticket')
        .setLabel('Open Private Banking Ticket')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🏦')
    );

    const message = await channel.send({
      embeds: [embed],
      components: [row],
    });

    console.log('✅ Private banking panel deployed:', message.url);
  } catch (error) {
    console.error('Panel deployment failed:', error);
    process.exitCode = 1;
  } finally {
    client.destroy();
  }
});

client.login(token).catch(error => {
  console.error('Login failed:', error);
  process.exit(1);
});
