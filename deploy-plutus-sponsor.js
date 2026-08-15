const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const GUILD_ID = '1528804420383674559';
const TICKET_CHANNEL_ID = '1528807330433597451';

const options = [
  { label: 'Support / Enquiry', value: 'plutus_support' },
  { label: 'Apply for a Job', value: 'plutus_teller' },
  { label: 'Sponsor / Partner', value: 'plutus_sponsor' }
];

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', async () => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const ticketCh = guild.channels.cache.get(TICKET_CHANNEL_ID);

    const sponsorCh = guild.channels.cache.find(ch => ch.name.includes('sponsor') || ch.name.includes('💼'));
    if (sponsorCh) {
      await sponsorCh.setTopic('Want to sponsor or partner with Plutus Banking? Open a ticket in ' + (ticketCh ? '<#' + TICKET_CHANNEL_ID + '>' : '#tickets') + ' and pick "Sponsor / Partner".');

      const msgs = await sponsorCh.messages.fetch({ limit: 30 }).catch(() => null);
      if (msgs) msgs.filter(m => m.author.id === client.user.id).forEach(m => m.delete().catch(() => {}));

      const e = new EmbedBuilder()
        .setTitle('💼 Sponsorship & Partnerships')
        .setColor(0x1E4620)
        .setDescription('Plutus Banking is open to sponsors and partners. To apply, open a ticket in ' + (ticketCh ? '<#' + TICKET_CHANNEL_ID + '>' : '#tickets') + ' and choose **Sponsor / Partner**.')
        .addFields(
          { name: '🤝 Sponsorship — what you get in return', value: [
            '• Your business advertised in Plutus channels and announcements',
            '• A shoutout in our weekly banking briefing',
            '• Preferred rates on Plutus services (loans, accounts, transfers)',
            '• Official recognition as a Plutus sponsor',
            '• First pick on event sponsorship slots'
          ].join('\n') },
          { name: '📋 What we expect from you', value: [
            '• The agreed sponsorship amount, paid upfront',
            '• Professional conduct — our customers come first',
            '• Compliance with Discord TOS and DistrictRP TOS',
            '• A clean reputation — no scams, no shady deals'
          ].join('\n') },
          { name: '🤖 Partnership — what you get', value: [
            '• Mutual referral system — we send clients your way, you send them ours',
            '• Cross-promotion in both of our servers',
            '• Revenue share on referred business',
            '• Joint events, giveaways and promotions',
            '• Direct line to bank management for custom deals'
          ].join('\n') }
        )
        .setFooter({ text: 'All users must adhere to Discord TOS and DistrictRP TOS.' });
      await sponsorCh.send({ embeds: [e] });
      console.log('Sponsorship channel updated.');
    } else {
      console.log('Sponsorship channel not found.');
    }

    const ch = await guild.channels.fetch(TICKET_CHANNEL_ID);
    const messages = await ch.messages.fetch({ limit: 50 }).catch(() => null);
    if (messages) {
      const old = messages.filter(m => m.author.id === client.user.id && m.components.some(r => r.components.some(c => c.customId === 'sp_' + GUILD_ID)));
      for (const m of old.values()) await m.delete();
    }
    const e2 = new EmbedBuilder()
      .setTitle('Plutus Bank Customer Support')
      .setDescription('Please choose the correct option below and fill out the form accurately. A member of our team will review your submission and assist you as soon as possible.')
      .setColor(0x1E4620)
      .setFooter({ text: 'All users must adhere to Discord TOS and DistrictRP TOS.' });
    const select = new StringSelectMenuBuilder().setCustomId('sp_' + GUILD_ID).setPlaceholder('Choose an option');
    options.forEach(o => select.addOptions(new StringSelectMenuOptionBuilder().setLabel(o.label).setDescription(o.label).setValue(o.value)));
    await ch.send({ embeds: [e2], components: [new ActionRowBuilder().addComponents(select)] });
    console.log('Plutus panel redeployed with Sponsor / Partner.');
  } catch (err) { console.error(err); } finally { client.destroy(); process.exit(0); }
});

client.login(token);