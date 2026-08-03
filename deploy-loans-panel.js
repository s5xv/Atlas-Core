const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN || process.env.TOKEN;
const GUILD_ID = '1528804420383674559'; // Plutus Bank
const LOANS_CHANNEL_ID = '1533885991130235027';

if (!TOKEN) { console.error('Set DISCORD_TOKEN.'); process.exit(1); }

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const channel = await guild.channels.fetch(LOANS_CHANNEL_ID);
    
    if (!channel) { console.error('Loans channel not found!'); process.exit(1); }

    const embed = new EmbedBuilder()
      .setTitle('🏧 Loan Support')
      .setDescription('Click the button below to open a private loan ticket.\nThis ticket will be visible to **Loan Officer** and **Branch Manager** only.')
      .setColor(0x57f287)
      .setFooter({ text: 'Plutus Banking • Loans' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open_loan_ticket')
        .setLabel('Open Loan Ticket')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🏧')
    );

    await channel.send({ embeds: [embed], components: [row] });
    console.log('✅ Loan panel deployed to #🏧-loans!');
    process.exit(0);
  } catch (err) {
    console.error('Error deploying panel:', err);
    process.exit(1);
  }
});

client.login(TOKEN);
