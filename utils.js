const { PermissionsBitField, Collection, EmbedBuilder } = require('discord.js');
const config = require('./config');

const antispam = new Collection();
const tickets = new Collection();
const ticketTimeouts = new Collection();
const ticketPriority = new Collection();
const warnings = new Collection();
const warnCounters = new Collection();
const commandStats = new Collection();
const joinTimestamps = new Collection();
const raidMode = new Collection();
const countdowns = new Collection();
const claimedTickets = new Collection();
const pastes = new Collection();
const notes = new Collection();
const shadowbans = new Set();
const honeypots = new Collection();
const customPanels = new Collection();
const customForms = new Collection();

let pasteCounter = 0;

function getGuildConfig(guildId) {
  return config.guilds[guildId] || null;
}

const STAFF_PERMS = [
  PermissionsBitField.Flags.Administrator,
  PermissionsBitField.Flags.ManageGuild,
  PermissionsBitField.Flags.KickMembers,
  PermissionsBitField.Flags.BanMembers,
  PermissionsBitField.Flags.ModerateMembers,
  PermissionsBitField.Flags.ManageMessages,
  PermissionsBitField.Flags.ManageChannels,
  PermissionsBitField.Flags.ManageRoles
];

function hasStaffPermission(member, guildConfig) {
  if (!guildConfig || !member) return false;
  if (member.permissions.any(STAFF_PERMS)) return true;
  if (guildConfig.staff_role_id && typeof guildConfig.staff_role_id === 'string' && guildConfig.staff_role_id.length > 5) {
    if (member.roles.cache.has(guildConfig.staff_role_id)) return true;
  }
  return false;
}

function findStaffRoles(guild) {
  if (!guild) return [];
  const roles = [];
  guild.roles.cache.forEach(role => {
    if (role.permissions.any(STAFF_PERMS)) roles.push(role.id);
  });
  return roles;
}

async function respond(interaction, content) {
  if (interaction.deferred || interaction.replied) {
    return interaction.followUp({ content, ephemeral: true });
  }
  return interaction.reply({ content, ephemeral: true });
}

function parseDuration(str) {
  if (!str) return null;
  const m = str.match(/^(\d+)(s|m|h|d)$/i);
  if (!m) return null;
  const v = parseInt(m[1]);
  const u = m[2].toLowerCase();
  if (u === 's') return v * 1000;
  if (u === 'm') return v * 60000;
  if (u === 'h') return v * 3600000;
  if (u === 'd') return v * 86400000;
  return null;
}

function formatDuration(ms) {
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000) % 24;
  const d = Math.floor(ms / 86400000);
  let r = '';
  if (d) r += d + 'd ';
  if (h) r += h + 'h ';
  if (m) r += m + 'm ';
  if (s) r += s + 's';
  return r.trim() || '0s';
}

function trackCommand(name) {
  commandStats.set(name, (commandStats.get(name) || 0) + 1);
}

async function logAudit(guild, action, target, moderator, reason, extra) {
  const gc = getGuildConfig(guild.id);
  if (!gc?.audit_channel_id) return;
  const ch = guild.channels.cache.get(gc.audit_channel_id);
  if (!ch) return;
  const e = new EmbedBuilder()
    .setTitle(action)
    .setColor('#2F3136')
    .setDescription(
      'Target: ' + (target?.tag || target || 'None') +
      '\nModerator: ' + (moderator?.tag || moderator || 'None') +
      (reason ? '\nReason: ' + reason : '') +
      (extra ? '\n' + extra : '')
    )
    .setTimestamp();
  ch.send({ embeds: [e] }).catch(() => {});
}

const eightball = [
  'It is certain.', 'It is decidedly so.', 'Without a doubt.',
  'Yes definitely.', 'You may rely on it.', 'As I see it, yes.',
  'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.',
  'Reply hazy try again.', 'Ask again later.', 'Better not tell you now.',
  'Cannot predict now.', 'Concentrate and ask again.',
  'Dont count on it.', 'My reply is no.', 'My sources say no.',
  'Outlook not so good.', 'Very doubtful.'
];

const jokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs.',
  'What do you call a fake noodle? An impasta.',
  'Why did the scarecrow win an award? He was outstanding in his field.',
  'What do you call a bear with no teeth? A gummy bear.',
  'Why don skeletons fight each other? They dont have the guts.',
  'What did the ocean say to the beach? Nothing, it just waved.',
  'Why did the bicycle fall over? It was two tired.',
  'How does a penguin build its house? Igloos it together.',
  'Why did the golfer wear two pairs of pants? In case he got a hole in one.',
  'What do you call a fish with no eyes? A fsh.'
];

const trivia = [
  { q: 'What is the capital of France?', a: 'Paris' },
  { q: 'How many sides does a hexagon have?', a: '6' },
  { q: 'Who painted the Mona Lisa?', a: 'Leonardo da Vinci' },
  { q: 'What is the largest planet in our solar system?', a: 'Jupiter' },
  { q: 'What element has the chemical symbol O?', a: 'Oxygen' },
  { q: 'In what year did World War II end?', a: '1945' },
  { q: 'What is the smallest country in the world?', a: 'Vatican City' },
  { q: 'What language has the most native speakers?', a: 'Mandarin Chinese' },
  { q: 'What is the speed of light in km per second?', a: '299792' },
  { q: 'Who wrote Romeo and Juliet?', a: 'William Shakespeare' }
];

const asciiArts = [
  '```\n  ___  \n / _ \\ \n| | | |\n| |_| |\n \\___/ \n```',
  '```\n   /\\  \n  /  \\ \n / __ \\\n/_/  \\_\\\n```',
  '```\n  ___  \n / _ \\ \n| (_) |\n \\___/ \n```',
  '```\n  .--. \n /    \\\n|      |\n \\ __ / \n```',
  '```\n  __   \n / _|  \n| |_   \n|  _|  \n|_|    \n```'
];

const priorities = { low: '#57F287', medium: '#FEE75C', high: '#ED4245' };

const timezones = {
  'UTC': 0, 'GMT': 0, 'EST': -5, 'EDT': -4, 'CST': -6, 'CDT': -5,
  'MST': -7, 'MDT': -6, 'PST': -8, 'PDT': -7, 'CET': 1, 'CEST': 2,
  'EET': 2, 'EEST': 3, 'IST': 5.5, 'JST': 9, 'KST': 9, 'AEST': 10,
  'AEDT': 11, 'NZST': 12, 'NZDT': 13, 'BRT': -3, 'ART': -3,
  'WAT': 1, 'CAT': 2, 'EAT': 3, 'MSK': 3, 'PKT': 5, 'BST': 6,
  'ICT': 7, 'CST_CN': 8, 'HKT': 8, 'SGT': 8, 'AST': -4, 'AKST': -9,
  'AKDT': -8, 'HST': -10, 'CHST': 10, 'SST': 11, 'MART': -9.5,
  'MIT': -9.5, 'PST8PDT': -8, 'MST7MDT': -7, 'CST6CDT': -6, 'EST5EDT': -5
};

module.exports = {
  antispam, tickets, ticketTimeouts, ticketPriority, warnings, warnCounters,
  commandStats, joinTimestamps, raidMode, countdowns, claimedTickets,
  pastes, notes, shadowbans,   honeypots, customPanels, customForms, pasteCounter,
  getGuildConfig, hasStaffPermission, findStaffRoles, respond, parseDuration, formatDuration,
  trackCommand, logAudit, eightball, jokes, trivia, asciiArts, priorities, timezones
};
