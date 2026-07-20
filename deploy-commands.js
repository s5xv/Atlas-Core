require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder().setName('verify').setDescription('Deploy the verification panel'),

  new SlashCommandBuilder().setName('ticket').setDescription('Ticket management')
    .addSubcommand(s => s.setName('claim').setDescription('Claim this ticket'))
    .addSubcommand(s => s.setName('add').setDescription('Add a user to the ticket')
      .addUserOption(o => o.setName('user').setDescription('User to add').setRequired(true)))
    .addSubcommand(s => s.setName('remove').setDescription('Remove a user from the ticket')
      .addUserOption(o => o.setName('user').setDescription('User to remove').setRequired(true)))
    .addSubcommand(s => s.setName('rename').setDescription('Rename the ticket channel')
      .addStringOption(o => o.setName('name').setDescription('New channel name').setRequired(true)))
    .addSubcommand(s => s.setName('move').setDescription('Move ticket to another category')
      .addChannelOption(o => o.setName('category').setDescription('Target category').setRequired(true)))
    .addSubcommand(s => s.setName('priority').setDescription('Set ticket priority')
      .addStringOption(o => o.setName('level').setDescription('Priority level')
        .addChoices({ name: 'Low', value: 'low' }, { name: 'Medium', value: 'medium' }, { name: 'High', value: 'high' })
        .setRequired(true))),

  new SlashCommandBuilder().setName('roles').setDescription('Deploy the role selection panel'),

  new SlashCommandBuilder().setName('purge').setDescription('Delete a specified number of messages')
    .addIntegerOption(o => o.setName('amount').setDescription('Number to delete (1-100)').setMinValue(1).setMaxValue(100).setRequired(true)),

  new SlashCommandBuilder().setName('msg').setDescription('Send a DM to a user')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption(o => o.setName('message').setDescription('Message content').setRequired(true)),

  new SlashCommandBuilder().setName('warn').setDescription('Warning system')
    .addSubcommand(s => s.setName('add').setDescription('Warn a user')
      .addUserOption(o => o.setName('user').setDescription('User to warn').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Reason for warning').setRequired(true)))
    .addSubcommand(s => s.setName('list').setDescription('List warnings for a user')
      .addUserOption(o => o.setName('user').setDescription('User to check').setRequired(true)))
    .addSubcommand(s => s.setName('remove').setDescription('Remove a warning')
      .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
      .addIntegerOption(o => o.setName('id').setDescription('Warning ID').setRequired(true))),

  new SlashCommandBuilder().setName('mute').setDescription('Timeout a user')
    .addUserOption(o => o.setName('user').setDescription('User to mute').setRequired(true))
    .addStringOption(o => o.setName('duration').setDescription('Duration (e.g. 10m, 2h, 1d)').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(false)),

  new SlashCommandBuilder().setName('unmute').setDescription('Remove timeout from a user')
    .addUserOption(o => o.setName('user').setDescription('User to unmute').setRequired(true)),

  new SlashCommandBuilder().setName('kick').setDescription('Kick a user')
    .addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(false)),

  new SlashCommandBuilder().setName('ban').setDescription('Ban a user')
    .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(false))
    .addIntegerOption(o => o.setName('delete_days').setDescription('Days of messages to delete').setMinValue(0).setMaxValue(7)),

  new SlashCommandBuilder().setName('unban').setDescription('Unban a user by ID')
    .addStringOption(o => o.setName('user_id').setDescription('User ID to unban').setRequired(true)),

  new SlashCommandBuilder().setName('tempban').setDescription('Temporarily ban a user')
    .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(o => o.setName('duration').setDescription('Duration (e.g. 1h, 2d, 7d)').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(false)),

  new SlashCommandBuilder().setName('slowmode').setDescription('Set channel slowmode')
    .addIntegerOption(o => o.setName('seconds').setDescription('Slowmode in seconds (0 to disable)').setMinValue(0).setMaxValue(21600).setRequired(true)),

  new SlashCommandBuilder().setName('lock').setDescription('Lock this channel'),
  new SlashCommandBuilder().setName('unlock').setDescription('Unlock this channel'),
  new SlashCommandBuilder().setName('hide').setDescription('Hide this channel'),
  new SlashCommandBuilder().setName('unhide').setDescription('Unhide this channel'),

  new SlashCommandBuilder().setName('nick').setDescription('Change a user nickname')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption(o => o.setName('nickname').setDescription('New nickname').setRequired(false)),

  new SlashCommandBuilder().setName('voicekick').setDescription('Disconnect a user from voice')
    .addUserOption(o => o.setName('user').setDescription('User to disconnect').setRequired(true)),

  new SlashCommandBuilder().setName('voicemove').setDescription('Move user to another voice channel')
    .addUserOption(o => o.setName('user').setDescription('User to move').setRequired(true))
    .addChannelOption(o => o.setName('channel').setDescription('Target voice channel').setRequired(true)),

  new SlashCommandBuilder().setName('8ball').setDescription('Ask the magic 8ball a question')
    .addStringOption(o => o.setName('question').setDescription('Your question').setRequired(true)),

  new SlashCommandBuilder().setName('coinflip').setDescription('Flip a coin'),
  new SlashCommandBuilder().setName('dice').setDescription('Roll a six-sided die'),

  new SlashCommandBuilder().setName('rps').setDescription('Play rock paper scissors')
    .addStringOption(o => o.setName('choice').setDescription('Your choice')
      .addChoices({ name: 'Rock', value: 'rock' }, { name: 'Paper', value: 'paper' }, { name: 'Scissors', value: 'scissors' })
      .setRequired(true)),

  new SlashCommandBuilder().setName('trivia').setDescription('Answer a trivia question'),
  new SlashCommandBuilder().setName('joke').setDescription('Get a random joke'),
  new SlashCommandBuilder().setName('ascii').setDescription('Display ASCII art'),

  new SlashCommandBuilder().setName('urban').setDescription('Look up a term on Urban Dictionary')
    .addStringOption(o => o.setName('term').setDescription('Term to search').setRequired(true)),

  new SlashCommandBuilder().setName('countdown').setDescription('Start a countdown timer')
    .addStringOption(o => o.setName('duration').setDescription('Duration (e.g. 30s, 5m, 1h)').setRequired(true))
    .addStringOption(o => o.setName('message').setDescription('Optional message').setRequired(false)),

  new SlashCommandBuilder().setName('uptime').setDescription('Show bot uptime'),

  new SlashCommandBuilder().setName('suggest').setDescription('Submit a suggestion')
    .addStringOption(o => o.setName('text').setDescription('Your suggestion').setRequired(true)),

  new SlashCommandBuilder().setName('paste').setDescription('Create a paste')
    .addStringOption(o => o.setName('title').setDescription('Title').setRequired(true))
    .addStringOption(o => o.setName('content').setDescription('Content').setRequired(true)),

  new SlashCommandBuilder().setName('paste-get').setDescription('Retrieve a paste by ID')
    .addIntegerOption(o => o.setName('id').setDescription('Paste ID').setRequired(true)),

  new SlashCommandBuilder().setName('timeconvert').setDescription('Convert time between timezones')
    .addStringOption(o => o.setName('time').setDescription('Time in HH:MM format (24h)').setRequired(true))
    .addStringOption(o => o.setName('from').setDescription('Source timezone (e.g. EST, UTC, PST)').setRequired(true))
    .addStringOption(o => o.setName('to').setDescription('Target timezone (e.g. IST, JST, GMT)').setRequired(true)),

  new SlashCommandBuilder().setName('note').setDescription('Staff note system')
    .addSubcommand(s => s.setName('add').setDescription('Add a note to a user')
      .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
      .addStringOption(o => o.setName('text').setDescription('Note content').setRequired(true)))
    .addSubcommand(s => s.setName('list').setDescription('List notes for a user')
      .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))),

  new SlashCommandBuilder().setName('shadowban').setDescription('Shadowban a user (silently delete their messages)')
    .addUserOption(o => o.setName('user').setDescription('User to shadowban').setRequired(true)),

  new SlashCommandBuilder().setName('unshadowban').setDescription('Remove shadowban from a user')
    .addUserOption(o => o.setName('user').setDescription('User to unshadowban').setRequired(true)),

  new SlashCommandBuilder().setName('honeypot').setDescription('Deploy or remove a honeypot channel')
    .addSubcommand(s => s.setName('setup').setDescription('Create a honeypot channel'))
    .addSubcommand(s => s.setName('remove').setDescription('Remove the honeypot channel')),

  new SlashCommandBuilder().setName('reload').setDescription('Reload bot configuration'),
  new SlashCommandBuilder().setName('presence').setDescription('Set bot presence')
    .addStringOption(o => o.setName('type').setDescription('Activity type')
      .addChoices({ name: 'Playing', value: '0' }, { name: 'Listening', value: '2' }, { name: 'Watching', value: '3' }, { name: 'Competing', value: '5' })
      .setRequired(true))
    .addStringOption(o => o.setName('name').setDescription('Text to display').setRequired(true)),

  new SlashCommandBuilder().setName('shutdown').setDescription('Shutdown the bot'),
  new SlashCommandBuilder().setName('eval').setDescription('Execute JavaScript code')
    .addStringOption(o => o.setName('code').setDescription('Code to run').setRequired(true)),
  new SlashCommandBuilder().setName('stats').setDescription('Show command usage stats'),
  new SlashCommandBuilder().setName('sync').setDescription('Resync all slash commands')
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering ' + commands.length + ' slash commands...');
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('Done.');
  } catch (e) {
    console.error(e);
  }
})();
