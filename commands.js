const {
  EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder,
  StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
  ModalBuilder, TextInputBuilder, TextInputStyle,
  PermissionsBitField, ChannelType
} = require('discord.js');
const config = require('./config');
const u = require('./utils');

async function pd(channel, content, ttl) {
  const m = await channel.send(content);
  if (ttl) setTimeout(() => m.delete().catch(() => {}), ttl);
  return m;
}

async function runAutomod(message) {
  const gc = u.getGuildConfig(message.guild.id);
  if (!gc) return false;
  if (u.shadowbans.has(message.author.id + '-' + message.guild.id)) return false;
  const c = message.content, lc = c.toLowerCase();

  if (config.automod.blockedWords.some(w => lc.includes(w.toLowerCase()))) {
    await message.delete().catch(() => {});
    try { await message.author.send('Your message was removed due to prohibited content.'); } catch {}
    const log = message.guild.channels.cache.get(gc.log_channel_id);
    if (log) log.send('**Word Filter** | ' + message.author.tag + ' in ' + message.channel.name + '\n' + c).catch(() => {});
    return true;
  }
  if (config.automod.inviteFilter && /(discord\.(gg|com\/invite|me\/)\/)[a-zA-Z0-9]+/i.test(c)) {
    await message.delete().catch(() => {});
    const log = message.guild.channels.cache.get(gc.log_channel_id);
    if (log) log.send('**Invite Filter** | ' + message.author.tag + ' in ' + message.channel.name).catch(() => {});
    return true;
  }
  const letters = c.replace(/[^a-zA-Z]/g, '');
  const upper = c.replace(/[^A-Z]/g, '');
  if (letters.length > 5 && upper.length / letters.length > config.automod.capsThreshold) {
    await message.delete().catch(() => {});
    const log = message.guild.channels.cache.get(gc.log_channel_id);
    if (log) log.send('**Caps Filter** | ' + message.author.tag + ' in ' + message.channel.name + '\n' + c).catch(() => {});
    return true;
  }
  if (message.mentions.users.size + message.mentions.roles.size > config.automod.maxMentions) {
    await message.delete().catch(() => {});
    const log = message.guild.channels.cache.get(gc.log_channel_id);
    if (log) log.send('**Mention Filter** | ' + message.author.tag + ' in ' + message.channel.name).catch(() => {});
    return true;
  }
  const spoilerCount = (c.match(/\|\|/g) || []).length;
  if (spoilerCount > config.automod.maxSpoilers * 2) {
    await message.delete().catch(() => {});
    const log = message.guild.channels.cache.get(gc.log_channel_id);
    if (log) log.send('**Spoiler Filter** | ' + message.author.tag + ' in ' + message.channel.name).catch(() => {});
    return true;
  }
  const emojiMatch = c.match(/<a?:\w+:\d+>/g);
  if (emojiMatch && emojiMatch.length > config.automod.maxEmojis) {
    await message.delete().catch(() => {});
    const log = message.guild.channels.cache.get(gc.log_channel_id);
    if (log) log.send('**Emoji Filter** | ' + message.author.tag + ' in ' + message.channel.name).catch(() => {});
    return true;
  }
  const zalgo = /[\u0300-\u036f\u0483-\u0489\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u0901-\u0903\u093c\u093e-\u094d\u0951-\u0954\u0962\u0963\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0c01-\u0c03\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d02\u0d03\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f\u109a-\u109d]{3,}/;
  if (zalgo.test(c)) {
    await message.delete().catch(() => {});
    const log = message.guild.channels.cache.get(gc.log_channel_id);
    if (log) log.send('**Zalgo Filter** | ' + message.author.tag + ' in ' + message.channel.name).catch(() => {});
    return true;
  }
  if (config.automod.linkFilter) {
    const links = c.match(/https?:\/\/[^\s]+/gi);
    if (links) for (const link of links) {
      if (config.automod.linkBlacklist.some(b => link.includes(b)) || (config.automod.linkWhitelist.length && !config.automod.linkWhitelist.some(w => link.includes(w)))) {
        await message.delete().catch(() => {});
        const log = message.guild.channels.cache.get(gc.log_channel_id);
        if (log) log.send('**Link Filter** | ' + message.author.tag + ' in ' + message.channel.name).catch(() => {});
        return true;
      }
    }
  }
  const now = Date.now();
  const sk = message.author.id + '-' + message.guild.id;
  const prev = u.antispam.get(sk) || [];
  const recent = prev.filter(t => now - t < config.antispam.windowMs);
  recent.push(now);
  u.antispam.set(sk, recent);
  if (recent.length > config.antispam.maxMessages) {
    u.antispam.delete(sk);
    const m = message.guild.members.cache.get(message.author.id);
    if (m) {
      await m.timeout(config.antispam.timeoutDurationMs, 'Auto anti-spam').catch(() => {});
      const log = message.guild.channels.cache.get(gc.log_channel_id);
      if (log) log.send('**Anti-Spam** | ' + message.author.tag + ' timed out in ' + message.channel.name).catch(() => {});
    }
    return true;
  }
  return false;
}

async function sendVerifyPanel(channel, gc) {
  const e = new EmbedBuilder().setTitle('Verify Your Access').setDescription('Click the button below to gain access to the server.').setColor(gc.color);
  return channel.send({ embeds: [e], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('verify_user').setLabel('Verify').setStyle(ButtonStyle.Success))] });
}

async function sendTicketHub(channel, gc) {
  const e = new EmbedBuilder().setTitle(gc.name + ' Ticket Center').setDescription('Select an option below to open a ticket.').setColor(gc.color);
  const s = new StringSelectMenuBuilder().setCustomId('ticket_select').setPlaceholder('Choose a ticket type')
    .addOptions(
      new StringSelectMenuOptionBuilder().setLabel('General Support').setDescription('Open a general support ticket').setValue('general'),
      new StringSelectMenuOptionBuilder().setLabel('Report a Player').setDescription('File a report against a player').setValue('report'),
      new StringSelectMenuOptionBuilder().setLabel('Apply / Forms').setDescription('Submit an application').setValue('apply'));
  return channel.send({ embeds: [e], components: [new ActionRowBuilder().addComponents(s)] });
}

async function sendRolePanel(channel, gc) {
  const roles = gc.notification_roles || [];
  if (!roles.length) return channel.send('No notification roles configured.');
  const e = new EmbedBuilder().setTitle('Notification Roles').setDescription('Click a button to toggle that role on or off.').setColor(gc.color);
  const rows = []; let batch = [];
  for (let i = 0; i < roles.length; i++) {
    batch.push(new ButtonBuilder().setCustomId('role_' + i).setLabel(roles[i].label).setStyle(ButtonStyle.Secondary));
    if (batch.length === 5 || i === roles.length - 1) { rows.push(new ActionRowBuilder().addComponents(batch)); batch = []; }
  }
  return channel.send({ embeds: [e], components: rows });
}

async function createTicket(interaction, gc, info) {
  const uid = interaction.user.id;
  let count = 0;
  u.tickets.forEach((gid, cid) => {
    const ch = interaction.guild.channels.cache.get(cid);
    if (gid === interaction.guild.id && ch && ch.permissionsFor(uid)?.has(PermissionsBitField.Flags.ViewChannel)) count++;
  });
  if (count >= config.tickets.maxPerUser) throw new Error('You already have ' + count + ' open tickets.');
  const sanitized = interaction.user.username.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase().slice(0, 20);
  const ch = await interaction.guild.channels.create({
    name: 'ticket-' + sanitized, type: ChannelType.GuildText, parent: gc.category_id,
    permissionOverwrites: [
      { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
      { id: uid, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
      { id: gc.staff_role_id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
    ]
  });
  u.tickets.set(ch.id, interaction.guild.id);
  const embed = new EmbedBuilder().setColor(gc.color).setTitle('Ticket').setDescription(info || gc.ticket_text);
  const close = new ButtonBuilder().setCustomId('close_ticket').setLabel('Close').setStyle(ButtonStyle.Danger);
  const claim = new ButtonBuilder().setCustomId('claim_ticket').setLabel('Claim').setStyle(ButtonStyle.Primary);
  await ch.send({ content: '<@' + uid + '>', embeds: [embed], components: [new ActionRowBuilder().addComponents(claim, close)] });
  resetTicketAutoClose(ch.id, gc);
  return ch;
}

function resetTicketAutoClose(channelId, gc) {
  if (u.ticketTimeouts.has(channelId)) clearTimeout(u.ticketTimeouts.get(channelId));
  const t = setTimeout(async () => {
    const ch = globalClient?.channels.cache.get(channelId);
    if (!ch || !u.tickets.has(channelId)) return;
    const gConf = u.getGuildConfig(ch.guild.id);
    if (!gConf) return;
    const fetched = await ch.messages.fetch({ limit: 50 }).catch(() => null);
    const lines = [];
    if (fetched) [...fetched.values()].reverse().forEach(msg => {
      if (msg.content) lines.push('[' + msg.createdAt.toLocaleString() + '] ' + msg.author.tag + ': ' + msg.content);
      msg.attachments.forEach(a => lines.push('[' + msg.createdAt.toLocaleString() + '] ' + msg.author.tag + ': [Attachment] ' + a.url));
    });
    const logCh = ch.guild.channels.cache.get(gConf.log_channel_id);
    if (logCh && lines.length) logCh.send({ content: 'Ticket auto-closed (inactivity): #' + ch.name, files: [{ attachment: Buffer.from(lines.join('\n'), 'utf-8'), name: 'transcript-' + ch.name + '.txt' }] }).catch(() => {});
    u.tickets.delete(channelId); u.ticketTimeouts.delete(channelId); u.ticketPriority.delete(channelId);
    await ch.delete().catch(() => {});
  }, config.tickets.autoCloseHours * 3600000);
  u.ticketTimeouts.set(channelId, t);
}

let globalClient = null;

async function handlePrefix(message) {
  if (message.author.bot || !message.guild) return;
  const gc = u.getGuildConfig(message.guild.id);
  if (!gc) return;
  if (u.honeypots.has(message.channel.id) && !u.hasStaffPermission(message.member, gc)) {
    await message.delete().catch(() => {});
    u.logAudit(message.guild, 'Honeypot Triggered', message.author, null, 'Sent message in honeypot channel');
    const logCh = message.guild.channels.cache.get(gc.log_channel_id);
    if (logCh) logCh.send('**Honeypot** | ' + message.author.tag + ' in #' + message.channel.name).catch(() => {});
    return;
  }
  if (await runAutomod(message)) return;
  if (u.tickets.has(message.channel.id)) resetTicketAutoClose(message.channel.id, gc);
  if (!message.content.startsWith('!')) return;
  const args = message.content.slice(1).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  const STAFF = ['verify', 'ticket', 'roles', 'purge', 'msg', 'warn', 'mute', 'unmute', 'kick', 'ban', 'unban', 'tempban', 'slowmode', 'lock', 'unlock', 'hide', 'unhide', 'nick', 'voicekick', 'voicemove', 'note', 'shadowban', 'unshadowban', 'honeypot', 'reload', 'presence', 'shutdown', 'eval', 'sync'];
  if (STAFF.includes(cmd) && !u.hasStaffPermission(message.member, gc)) return message.reply('No permission.').then(r => setTimeout(() => r.delete().catch(() => {}), 4000)).catch(() => {});
  u.trackCommand(cmd);
  try {
    switch (cmd) {
      case 'verify': await message.delete().catch(() => {}); await sendVerifyPanel(message.channel, gc); break;
      case 'roles': await message.delete().catch(() => {}); await sendRolePanel(message.channel, gc); break;
      case 'ticket': await message.delete().catch(() => {}); await sendTicketHub(message.channel, gc); break;
      case 'purge': {
        const amt = parseInt(args[0]);
        if (!amt || amt < 1 || amt > 100) return pd(message.channel, 'Specify 1-100.', 5000);
        await message.delete().catch(() => {});
        const f = await message.channel.messages.fetch({ limit: amt });
        const d = await message.channel.bulkDelete(f, true).catch(() => {});
        pd(message.channel, 'Deleted ' + (d ? d.size : 0) + ' messages.', 3000);
        break;
      }
      case 'msg': {
        let u2 = message.mentions.users.first();
        if (!u2 && args[0]) u2 = await message.client.users.fetch(args[0]).catch(() => null);
        if (!u2) return pd(message.channel, 'Specify a valid user.', 5000);
        const mc = args.slice(1).join(' ');
        if (!mc) return pd(message.channel, 'Provide a message.', 5000);
        await u2.send('**' + gc.name + ' Management**\n\n' + mc);
        pd(message.channel, 'Sent to ' + u2.tag + '.', 5000);
        break;
      }
      case 'warn': {
        const sub = args.shift();
        if (sub === 'add') {
          const u2 = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
          if (!u2) return pd(message.channel, 'Specify a user.', 5000);
          const reason = args.slice(1).join(' ') || 'No reason.';
          const key = message.guild.id + '-' + u2.id;
          if (!u.warnCounters.has(key)) u.warnCounters.set(key, 1);
          const wid = u.warnCounters.get(key); u.warnCounters.set(key, wid + 1);
          const warns = u.warnings.get(key) || [];
          warns.push({ id: wid, reason, modId: message.author.id, time: Date.now() });
          u.warnings.set(key, warns);
          u.logAudit(message.guild, 'Warn', u2, message.author, reason, 'Warn #' + wid);
          pd(message.channel, 'Warned ' + u2.tag + ' (#' + wid + ').', 5000);
        } else if (sub === 'list') {
          const u2 = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
          if (!u2) return pd(message.channel, 'Specify a user.', 5000);
          const warns = u.warnings.get(message.guild.id + '-' + u2.id) || [];
          if (!warns.length) return pd(message.channel, u2.tag + ' has no warnings.', 5000);
          pd(message.channel, '**Warnings for ' + u2.tag + '**\n' + warns.map(w => '#' + w.id + ' | ' + w.reason + ' | <@' + w.modId + '>').join('\n'), 15000);
        } else if (sub === 'remove') {
          const u2 = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
          if (!u2) return pd(message.channel, 'Specify a user.', 5000);
          const id = parseInt(args[1]);
          const warns = u.warnings.get(message.guild.id + '-' + u2.id) || [];
          const idx = warns.findIndex(w => w.id === id);
          if (idx === -1) return pd(message.channel, 'Warning #' + id + ' not found.', 5000);
          warns.splice(idx, 1);
          if (warns.length) u.warnings.set(message.guild.id + '-' + u2.id, warns); else u.warnings.delete(message.guild.id + '-' + u2.id);
          pd(message.channel, 'Removed warning #' + id + '.', 5000);
        } else pd(message.channel, 'Subcommands: add, list, remove.', 5000);
        break;
      }
      case 'mute': {
        const u2 = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
        if (!u2) return pd(message.channel, 'Specify a user.', 5000);
        const dur = u.parseDuration(args[1]); if (!dur) return pd(message.channel, 'Invalid duration.', 5000);
        const reason = args.slice(2).join(' ') || 'No reason.';
        const m = message.guild.members.cache.get(u2.id);
        if (!m) return pd(message.channel, 'User not in server.', 5000);
        await m.timeout(dur, reason).catch(() => {});
        u.logAudit(message.guild, 'Mute', u2, message.author, reason, 'Duration: ' + u.formatDuration(dur));
        pd(message.channel, 'Muted ' + u2.tag + ' for ' + u.formatDuration(dur) + '.', 5000);
        break;
      }
      case 'unmute': {
        const u2 = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
        if (!u2) return pd(message.channel, 'Specify a user.', 5000);
        const m = message.guild.members.cache.get(u2.id);
        if (!m) return pd(message.channel, 'User not in server.', 5000);
        await m.timeout(null).catch(() => {});
        u.logAudit(message.guild, 'Unmute', u2, message.author);
        pd(message.channel, 'Unmuted ' + u2.tag + '.', 5000);
        break;
      }
      case 'kick': {
        const u2 = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
        if (!u2) return pd(message.channel, 'Specify a user.', 5000);
        const reason = args.slice(1).join(' ') || 'No reason.';
        const m = message.guild.members.cache.get(u2.id);
        if (!m) return pd(message.channel, 'User not in server.', 5000);
        await m.kick(reason).catch(() => {});
        u.logAudit(message.guild, 'Kick', u2, message.author, reason);
        pd(message.channel, 'Kicked ' + u2.tag + '.', 5000);
        break;
      }
      case 'ban': {
        const u2 = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
        if (!u2) return pd(message.channel, 'Specify a user.', 5000);
        const reason = args.slice(1).join(' ') || 'No reason.';
        await message.guild.members.ban(u2, { reason }).catch(() => {});
        u.logAudit(message.guild, 'Ban', u2, message.author, reason);
        pd(message.channel, 'Banned ' + u2.tag + '.', 5000);
        break;
      }
      case 'unban': {
        if (!args[0]) return pd(message.channel, 'Specify a user ID.', 5000);
        await message.guild.members.unban(args[0]).catch(() => {});
        u.logAudit(message.guild, 'Unban', args[0], message.author);
        pd(message.channel, 'Unbanned ' + args[0] + '.', 5000);
        break;
      }
      case 'tempban': {
        const u2 = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
        if (!u2) return pd(message.channel, 'Specify a user.', 5000);
        const dur = u.parseDuration(args[1]); if (!dur) return pd(message.channel, 'Invalid duration.', 5000);
        const reason = args.slice(2).join(' ') || 'Temp ban.';
        await message.guild.members.ban(u2, { reason }).catch(() => {});
        setTimeout(async () => { await message.guild.members.unban(u2.id).catch(() => {}); u.logAudit(message.guild, 'Tempban Expired', u2, null); }, dur);
        u.logAudit(message.guild, 'Tempban', u2, message.author, reason, 'Duration: ' + u.formatDuration(dur));
        pd(message.channel, 'Tempbanned ' + u2.tag + ' for ' + u.formatDuration(dur) + '.', 5000);
        break;
      }
      case 'slowmode': {
        const sec = parseInt(args[0]);
        if (isNaN(sec) || sec < 0 || sec > 21600) return pd(message.channel, 'Specify 0-21600.', 5000);
        await message.channel.setRateLimitPerUser(sec).catch(() => {});
        pd(message.channel, 'Slowmode set to ' + sec + 's.', 5000);
        break;
      }
      case 'lock': await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: false }).catch(() => {}); pd(message.channel, 'Channel locked.', 5000); break;
      case 'unlock': await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: null }).catch(() => {}); pd(message.channel, 'Channel unlocked.', 5000); break;
      case 'hide': await message.channel.permissionOverwrites.edit(message.guild.id, { ViewChannel: false }).catch(() => {}); pd(message.channel, 'Channel hidden.', 5000); break;
      case 'unhide': await message.channel.permissionOverwrites.edit(message.guild.id, { ViewChannel: null }).catch(() => {}); pd(message.channel, 'Channel unhidden.', 5000); break;
      case 'nick': {
        const u2 = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!u2) return pd(message.channel, 'Specify a user.', 5000);
        const nick = args.slice(1).join(' ') || '';
        await u2.setNickname(nick || null).catch(() => {});
        pd(message.channel, nick ? 'Nickname set.' : 'Nickname reset.', 5000);
        break;
      }
      case 'voicekick': {
        const u2 = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!u2?.voice.channel) return pd(message.channel, 'User not in voice.', 5000);
        await u2.voice.disconnect().catch(() => {});
        pd(message.channel, 'Disconnected ' + u2.user.tag + '.', 5000);
        break;
      }
      case 'voicemove': {
        const u2 = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!u2?.voice.channel) return pd(message.channel, 'User not in voice.', 5000);
        const tch = message.guild.channels.cache.get(args[1]);
        if (!tch || tch.type !== ChannelType.GuildVoice) return pd(message.channel, 'Invalid voice channel ID.', 5000);
        await u2.voice.setChannel(tch).catch(() => {});
        pd(message.channel, 'Moved ' + u2.user.tag + '.', 5000);
        break;
      }
      case '8ball': {
        const q = args.join(' '); if (!q) return pd(message.channel, 'Ask a question.', 5000);
        pd(message.channel, u.eightball[Math.floor(Math.random() * u.eightball.length)], 15000);
        break;
      }
      case 'coinflip': pd(message.channel, Math.random() < 0.5 ? 'Heads' : 'Tails', 10000); break;
      case 'dice': pd(message.channel, 'Rolled a ' + (Math.floor(Math.random() * 6) + 1) + '.', 10000); break;
      case 'rps': {
        const choices = ['rock', 'paper', 'scissors'];
        const uc = args[0]?.toLowerCase();
        if (!choices.includes(uc)) return pd(message.channel, 'Choose rock, paper, or scissors.', 5000);
        const bc = choices[Math.floor(Math.random() * 3)];
        const w = (uc === 'rock' && bc === 'scissors') || (uc === 'paper' && bc === 'rock') || (uc === 'scissors' && bc === 'paper');
        pd(message.channel, 'You: ' + uc + ' | Bot: ' + bc + ' | ' + (uc === bc ? 'Tie' : w ? 'You win' : 'Bot wins'), 15000);
        break;
      }
      case 'trivia': {
        const q = u.trivia[Math.floor(Math.random() * u.trivia.length)];
        pd(message.channel, '**Trivia**\n' + q.q, 15000);
        setTimeout(() => pd(message.channel, 'Answer: ||' + q.a + '||', 10000), 15000);
        break;
      }
      case 'joke': pd(message.channel, u.jokes[Math.floor(Math.random() * u.jokes.length)], 20000); break;
      case 'ascii': pd(message.channel, u.asciiArts[Math.floor(Math.random() * u.asciiArts.length)], 20000); break;
      case 'urban': {
        const term = args.join(' '); if (!term) return pd(message.channel, 'Specify a term.', 5000);
        try {
          const res = await fetch('https://api.urbandictionary.com/v0/define?term=' + encodeURIComponent(term));
          const data = await res.json();
          if (!data.list?.length) return pd(message.channel, 'No results.', 5000);
          const e = data.list[0];
          const embed = new EmbedBuilder().setTitle(e.word).setDescription(e.definition.slice(0, 2000)).setColor('#57F287').setFooter({ text: 'by ' + e.author });
          message.channel.send({ embeds: [embed] });
        } catch { pd(message.channel, 'Could not fetch.', 5000); }
        break;
      }
      case 'countdown': {
        const dur = u.parseDuration(args[0]); if (!dur) return pd(message.channel, 'Invalid duration.', 5000);
        const msg = args.slice(1).join(' ') || 'Countdown finished';
        pd(message.channel, 'Countdown set for ' + u.formatDuration(dur) + '.', 5000);
        setTimeout(() => { message.channel.send('Countdown finished: ' + msg); }, dur);
        break;
      }
      case 'uptime': pd(message.channel, 'Uptime: ' + u.formatDuration(process.uptime() * 1000), 15000); break;
      case 'suggest': {
        const txt = args.join(' '); if (!txt) return pd(message.channel, 'Provide suggestion text.', 5000);
        const sch = message.guild.channels.cache.get(gc.suggestion_channel_id);
        if (!sch) return pd(message.channel, 'Suggestion channel not configured.', 5000);
        const embed = new EmbedBuilder().setTitle('Suggestion').setDescription(txt).setColor('#57F287').setFooter({ text: message.author.tag }).setTimestamp();
        const up = new ButtonBuilder().setCustomId('suggest_up').setLabel('0').setStyle(ButtonStyle.Success).setEmoji('👍');
        const down = new ButtonBuilder().setCustomId('suggest_down').setLabel('0').setStyle(ButtonStyle.Danger).setEmoji('👎');
        const m = await sch.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(up, down)] });
        u.suggestions.set(m.id, { guildId: message.guild.id, authorId: message.author.id, text: txt, upvotes: 0, downvotes: 0, voters: [] });
        pd(message.channel, 'Suggestion posted in ' + sch.toString() + '.', 5000);
        break;
      }
      case 'paste': {
        const title = args[0];
        const content = args.slice(1).join(' ');
        if (!title || !content) return pd(message.channel, 'Usage: !paste <title> <content>', 5000);
        u.pasteCounter++;
        u.pastes.set(u.pasteCounter, { title, content, author: message.author.tag, time: Date.now() });
        pd(message.channel, 'Paste created. ID: ' + u.pasteCounter, 15000);
        break;
      }
      case 'paste-get': {
        const id = parseInt(args[0]); if (!id) return pd(message.channel, 'Specify a paste ID.', 5000);
        const p = u.pastes.get(id); if (!p) return pd(message.channel, 'Paste not found.', 5000);
        pd(message.channel, '**' + p.title + '** (by ' + p.author + ')\n```\n' + p.content.slice(0, 1900) + '\n```', 30000);
        break;
      }
      case 'timeconvert': {
        const t = args[0]; const f = args[1]?.toUpperCase(); const to = args[2]?.toUpperCase();
        if (!t || !f || !to || !u.timezones[f] === undefined || !u.timezones[to] === undefined) return pd(message.channel, 'Usage: !timeconvert HH:MM FROM TO (e.g. !timeconvert 14:30 EST IST)', 10000);
        const parts = t.split(':');
        const h = parseInt(parts[0]), mi = parseInt(parts[1]);
        if (isNaN(h) || isNaN(mi)) return pd(message.channel, 'Invalid time format.', 5000);
        const offset = u.timezones[to] - u.timezones[f];
        let nh = (h + offset + 24) % 24;
        pd(message.channel, t + ' ' + f + ' = ' + String(Math.floor(nh)).padStart(2, '0') + ':' + String(mi).padStart(2, '0') + ' ' + to, 15000);
        break;
      }
      case 'note': {
        const sub = args.shift();
        const u2 = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
        if (!u2) return pd(message.channel, 'Specify a user.', 5000);
        const nk = message.guild.id + '-' + u2.id;
        if (sub === 'add') {
          const text = args.slice(1).join(' '); if (!text) return pd(message.channel, 'Provide note text.', 5000);
          const ns = u.notes.get(nk) || [];
          ns.push({ text, modId: message.author.id, time: Date.now() });
          u.notes.set(nk, ns);
          pd(message.channel, 'Note added to ' + u2.tag + '.', 5000);
        } else if (sub === 'list') {
          const ns = u.notes.get(nk) || [];
          if (!ns.length) return pd(message.channel, 'No notes for ' + u2.tag + '.', 5000);
          const txt = ns.map((n, i) => '#' + (i + 1) + ' | ' + n.text + ' | <@' + n.modId + '>').join('\n');
          pd(message.channel, '**Notes for ' + u2.tag + '**\n' + txt.slice(0, 1900), 15000);
        } else pd(message.channel, 'Subcommands: add, list.', 5000);
        break;
      }
      case 'shadowban': {
        const u2 = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
        if (!u2) return pd(message.channel, 'Specify a user.', 5000);
        u.shadowbans.add(u2.id + '-' + message.guild.id);
        u.logAudit(message.guild, 'Shadowban', u2, message.author);
        pd(message.channel, 'Shadowbanned ' + u2.tag + '.', 5000);
        break;
      }
      case 'unshadowban': {
        const u2 = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
        if (!u2) return pd(message.channel, 'Specify a user.', 5000);
        u.shadowbans.delete(u2.id + '-' + message.guild.id);
        u.logAudit(message.guild, 'Unshadowban', u2, message.author);
        pd(message.channel, 'Removed shadowban from ' + u2.tag + '.', 5000);
        break;
      }
      case 'honeypot': {
        const sub = args.shift();
        if (sub === 'setup') {
          const existing = [...u.honeypots.keys()].find(cid => message.guild.channels.cache.get(cid));
          if (existing) return pd(message.channel, 'Honeypot already exists.', 5000);
          const ch = await message.guild.channels.create({ name: 'giveaway-prize', type: ChannelType.GuildText, parent: gc.category_id }).catch(() => null);
          if (!ch) return pd(message.channel, 'Could not create channel.', 5000);
          u.honeypots.set(ch.id, message.guild.id);
          await ch.send('Welcome! Type anything to claim your prize.').catch(() => {});
          pd(message.channel, 'Honeypot created: ' + ch.toString(), 10000);
        } else if (sub === 'remove') {
          const cid = [...u.honeypots.keys()].find(cid => message.guild.channels.cache.get(cid)?.guild?.id === message.guild.id);
          if (!cid) return pd(message.channel, 'No honeypot found.', 5000);
          u.honeypots.delete(cid);
          const ch = message.guild.channels.cache.get(cid);
          if (ch) await ch.delete().catch(() => {});
          pd(message.channel, 'Honeypot removed.', 5000);
        } else pd(message.channel, 'Subcommands: setup, remove.', 5000);
        break;
      }
      case 'reload': {
        delete require.cache[require.resolve('./config')];
        Object.assign(config, require('./config'));
        pd(message.channel, 'Config reloaded.', 5000);
        break;
      }
      case 'presence': {
        const type = parseInt(args[0]); const name = args.slice(1).join(' ');
        if (![0, 2, 3, 5].includes(type) || !name) return pd(message.channel, 'Usage: !presence <0|2|3|5> <text>', 5000);
        message.client.user.setActivity(name, { type });
        pd(message.channel, 'Presence updated.', 5000);
        break;
      }
      case 'shutdown': pd(message.channel, 'Shutting down.', 2000); setTimeout(() => process.exit(0), 2000); break;
      case 'eval': {
        if (message.author.id !== process.env.OWNER_ID) return pd(message.channel, 'Owner only.', 5000);
        const code = args.join(' ');
        try { let r = eval(code); if (typeof r !== 'string') r = require('util').inspect(r, { depth: 1 }); pd(message.channel, '```js\n' + String(r).slice(0, 1900) + '\n```', 30000); } catch (e) { pd(message.channel, '```\n' + String(e).slice(0, 1900) + '\n```', 30000); }
        break;
      }
      case 'stats': {
        const sorted = [...u.commandStats.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
        if (!sorted.length) return pd(message.channel, 'No stats yet.', 5000);
        pd(message.channel, '**Command Stats**\n' + sorted.map(([k, v]) => k + ': ' + v + ' uses').join('\n'), 15000);
        break;
      }
      case 'sync': pd(message.channel, 'Run npm run deploy to resync slash commands.', 10000); break;
    }
  } catch (e) { console.error('Prefix error:', e); }
}

async function handleSlash(interaction) {
  const gc = u.getGuildConfig(interaction.guildId);
  if (!gc) return u.respond(interaction, 'Not configured.');
  const cmd = interaction.commandName;
  const STAFF = ['verify', 'ticket', 'roles', 'purge', 'msg', 'warn', 'mute', 'unmute', 'kick', 'ban', 'unban', 'tempban', 'slowmode', 'lock', 'unlock', 'hide', 'unhide', 'nick', 'voicekick', 'voicemove', 'note', 'shadowban', 'unshadowban', 'honeypot', 'reload', 'presence', 'shutdown', 'eval', 'sync'];
  if (STAFF.includes(cmd) && !u.hasStaffPermission(interaction.member, gc)) return u.respond(interaction, 'No permission.');
  u.trackCommand(cmd);
  try {
    const ereply = { ephemeral: true };
    switch (cmd) {
      case 'verify': await interaction.deferReply(ereply); await sendVerifyPanel(interaction.channel, gc); return interaction.editReply({ content: 'Panel deployed.' });
      case 'roles': await interaction.deferReply(ereply); await sendRolePanel(interaction.channel, gc); return interaction.editReply({ content: 'Panel deployed.' });
      case 'ticket': {
        await interaction.deferReply(ereply);
        const sub = interaction.options.getSubcommand();
        if (sub === 'claim') {
          if (!u.tickets.has(interaction.channel.id)) return interaction.editReply({ content: 'Not a ticket channel.' });
          u.claimedTickets.set(interaction.channel.id, interaction.user.id);
          return interaction.editReply({ content: 'Claimed by ' + interaction.user.tag + '.' });
        }
        if (sub === 'add') { const user = interaction.options.getUser('user'); await interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true }).catch(() => {}); return interaction.editReply({ content: 'Added ' + user.tag + '.' }); }
        if (sub === 'remove') { const user = interaction.options.getUser('user'); await interaction.channel.permissionOverwrites.delete(user.id).catch(() => {}); return interaction.editReply({ content: 'Removed ' + user.tag + '.' }); }
        if (sub === 'rename') { const name = interaction.options.getString('name').replace(/[^a-z0-9-]/gi, '').toLowerCase().slice(0, 32); await interaction.channel.setName(name).catch(() => {}); return interaction.editReply({ content: 'Renamed to ' + name + '.' }); }
        if (sub === 'move') { const cat = interaction.options.getChannel('category'); if (cat.type !== ChannelType.GuildCategory) return interaction.editReply({ content: 'Not a category.' }); await interaction.channel.setParent(cat.id).catch(() => {}); return interaction.editReply({ content: 'Moved.' }); }
        if (sub === 'priority') {
          const level = interaction.options.getString('level');
          u.ticketPriority.set(interaction.channel.id, level);
          const existing = (await interaction.channel.messages.fetch({ limit: 10 })).find(m => m.embeds.length && m.embeds[0].title === 'Ticket');
          if (existing) { const embed = EmbedBuilder.from(existing.embeds[0]).setColor(u.priorities[level] || gc.color); await existing.edit({ embeds: [embed] }).catch(() => {}); }
          return interaction.editReply({ content: 'Priority: ' + level + '.' });
        }
        return interaction.editReply({ content: 'Unknown subcommand.' });
      }
      case 'purge': {
        const amount = interaction.options.getInteger('amount');
        await interaction.deferReply(ereply);
        const fetched = await interaction.channel.messages.fetch({ limit: amount });
        const deleted = await interaction.channel.bulkDelete(fetched, true).catch(() => {});
        await interaction.editReply({ content: 'Deleted ' + (deleted ? deleted.size : 0) + ' messages.' });
        setTimeout(() => interaction.deleteReply().catch(() => {}), 3000);
        break;
      }
      case 'msg': {
        const user = interaction.options.getUser('user'); const msg = interaction.options.getString('message');
        await interaction.deferReply(ereply);
        try { await user.send('**' + gc.name + ' Management**\n\n' + msg); await interaction.editReply({ content: 'Sent to ' + user.tag + '.' }); } catch { await interaction.editReply({ content: 'Could not DM.' }); }
        break;
      }
      case 'warn': {
        await interaction.deferReply(ereply);
        const sub = interaction.options.getSubcommand(); const u2 = interaction.options.getUser('user'); const key = interaction.guildId + '-' + u2.id;
        if (sub === 'add') {
          const reason = interaction.options.getString('reason');
          if (!u.warnCounters.has(key)) u.warnCounters.set(key, 1);
          const wid = u.warnCounters.get(key); u.warnCounters.set(key, wid + 1);
          const warns = u.warnings.get(key) || []; warns.push({ id: wid, reason, modId: interaction.user.id, time: Date.now() });
          u.warnings.set(key, warns);
          u.logAudit(interaction.guild, 'Warn', u2, interaction.user, reason, 'Warn #' + wid);
          await interaction.editReply({ content: 'Warned ' + u2.tag + ' (#' + wid + ').' });
        } else if (sub === 'list') {
          const warns = u.warnings.get(key) || [];
          if (!warns.length) return interaction.editReply({ content: 'No warnings.' });
          await interaction.editReply({ content: '**Warnings**\n' + warns.map(w => '#' + w.id + ' | ' + w.reason).join('\n').slice(0, 1900) });
        } else if (sub === 'remove') {
          const id = interaction.options.getInteger('id');
          const warns = u.warnings.get(key) || []; const idx = warns.findIndex(w => w.id === id);
          if (idx === -1) return interaction.editReply({ content: 'Warning #' + id + ' not found.' });
          warns.splice(idx, 1); if (warns.length) u.warnings.set(key, warns); else u.warnings.delete(key);
          await interaction.editReply({ content: 'Removed warning #' + id + '.' });
        }
        break;
      }
      case 'mute': {
        const user = interaction.options.getUser('user'); const dur = u.parseDuration(interaction.options.getString('duration'));
        if (!dur) return u.respond(interaction, 'Invalid duration.');
        const reason = interaction.options.getString('reason') || 'No reason.';
        await interaction.deferReply(ereply); const m = interaction.guild.members.cache.get(user.id);
        if (!m) return interaction.editReply({ content: 'Not in server.' });
        await m.timeout(dur, reason).catch(() => {});
        u.logAudit(interaction.guild, 'Mute', user, interaction.user, reason, 'Duration: ' + u.formatDuration(dur));
        await interaction.editReply({ content: 'Muted ' + user.tag + ' for ' + u.formatDuration(dur) + '.' });
        break;
      }
      case 'unmute': {
        const user = interaction.options.getUser('user'); await interaction.deferReply(ereply);
        const m = interaction.guild.members.cache.get(user.id); if (!m) return interaction.editReply({ content: 'Not in server.' });
        await m.timeout(null).catch(() => {}); u.logAudit(interaction.guild, 'Unmute', user, interaction.user);
        await interaction.editReply({ content: 'Unmuted.' }); break;
      }
      case 'kick': {
        const user = interaction.options.getUser('user'); const reason = interaction.options.getString('reason') || 'No reason.';
        await interaction.deferReply(ereply); const m = interaction.guild.members.cache.get(user.id);
        if (!m) return interaction.editReply({ content: 'Not in server.' }); await m.kick(reason).catch(() => {});
        u.logAudit(interaction.guild, 'Kick', user, interaction.user, reason);
        await interaction.editReply({ content: 'Kicked ' + user.tag + '.' }); break;
      }
      case 'ban': {
        const user = interaction.options.getUser('user'); const reason = interaction.options.getString('reason') || 'No reason.';
        await interaction.deferReply(ereply); await interaction.guild.members.ban(user, { reason }).catch(() => {});
        u.logAudit(interaction.guild, 'Ban', user, interaction.user, reason);
        await interaction.editReply({ content: 'Banned.' }); break;
      }
      case 'unban': {
        const uid = interaction.options.getString('user_id'); await interaction.deferReply(ereply);
        await interaction.guild.members.unban(uid).catch(() => {});
        u.logAudit(interaction.guild, 'Unban', uid, interaction.user);
        await interaction.editReply({ content: 'Unbanned.' }); break;
      }
      case 'tempban': {
        const user = interaction.options.getUser('user'); const dur = u.parseDuration(interaction.options.getString('duration'));
        if (!dur) return u.respond(interaction, 'Invalid duration.');
        const reason = interaction.options.getString('reason') || 'Temp ban.';
        await interaction.deferReply(ereply); await interaction.guild.members.ban(user, { reason }).catch(() => {});
        setTimeout(async () => { await interaction.guild.members.unban(user.id).catch(() => {}); u.logAudit(interaction.guild, 'Tempban Expired', user, null); }, dur);
        u.logAudit(interaction.guild, 'Tempban', user, interaction.user, reason, 'Duration: ' + u.formatDuration(dur));
        await interaction.editReply({ content: 'Tempbanned for ' + u.formatDuration(dur) + '.' }); break;
      }
      case 'slowmode': {
        const sec = interaction.options.getInteger('seconds'); await interaction.deferReply(ereply);
        await interaction.channel.setRateLimitPerUser(sec).catch(() => {}); await interaction.editReply({ content: 'Slowmode: ' + sec + 's.' }); break;
      }
      case 'lock': await interaction.deferReply(ereply); await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false }).catch(() => {}); await interaction.editReply({ content: 'Locked.' }); break;
      case 'unlock': await interaction.deferReply(ereply); await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: null }).catch(() => {}); await interaction.editReply({ content: 'Unlocked.' }); break;
      case 'hide': await interaction.deferReply(ereply); await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: false }).catch(() => {}); await interaction.editReply({ content: 'Hidden.' }); break;
      case 'unhide': await interaction.deferReply(ereply); await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: null }).catch(() => {}); await interaction.editReply({ content: 'Unhidden.' }); break;
      case 'nick': {
        const user = interaction.options.getUser('user'); const nick = interaction.options.getString('nickname') || '';
        await interaction.deferReply(ereply); const m = interaction.guild.members.cache.get(user.id);
        if (!m) return interaction.editReply({ content: 'Not in server.' }); await m.setNickname(nick || null).catch(() => {});
        await interaction.editReply({ content: nick ? 'Nickname set.' : 'Nickname reset.' }); break;
      }
      case 'voicekick': {
        const user = interaction.options.getUser('user'); await interaction.deferReply(ereply);
        const m = interaction.guild.members.cache.get(user.id); if (!m?.voice.channel) return interaction.editReply({ content: 'Not in voice.' });
        await m.voice.disconnect().catch(() => {}); await interaction.editReply({ content: 'Disconnected.' }); break;
      }
      case 'voicemove': {
        const user = interaction.options.getUser('user'); const ch = interaction.options.getChannel('channel');
        await interaction.deferReply(ereply); const m = interaction.guild.members.cache.get(user.id);
        if (!m?.voice.channel) return interaction.editReply({ content: 'Not in voice.' });
        if (ch.type !== ChannelType.GuildVoice) return interaction.editReply({ content: 'Not a voice channel.' });
        await m.voice.setChannel(ch).catch(() => {}); await interaction.editReply({ content: 'Moved.' }); break;
      }
      case '8ball': {
        const q = interaction.options.getString('question'); await interaction.deferReply(ereply);
        await interaction.editReply({ content: u.eightball[Math.floor(Math.random() * u.eightball.length)] }); break;
      }
      case 'coinflip': await interaction.reply({ content: Math.random() < 0.5 ? 'Heads' : 'Tails', ...ereply }); break;
      case 'dice': await interaction.reply({ content: 'Rolled a ' + (Math.floor(Math.random() * 6) + 1) + '.', ...ereply }); break;
      case 'rps': {
        const uc = interaction.options.getString('choice'); const bc = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
        const w = (uc === 'rock' && bc === 'scissors') || (uc === 'paper' && bc === 'rock') || (uc === 'scissors' && bc === 'paper');
        await interaction.reply({ content: 'You: ' + uc + ' | Bot: ' + bc + ' | ' + (uc === bc ? 'Tie' : w ? 'You win' : 'Bot wins'), ...ereply }); break;
      }
      case 'trivia': {
        const q = u.trivia[Math.floor(Math.random() * u.trivia.length)];
        await interaction.reply({ content: '**Trivia**\n' + q.q, ...ereply });
        setTimeout(() => interaction.followUp({ content: 'Answer: ||' + q.a + '||', ephemeral: true }), 15000);
        break;
      }
      case 'joke': await interaction.reply({ content: u.jokes[Math.floor(Math.random() * u.jokes.length)], ...ereply }); break;
      case 'ascii': await interaction.reply({ content: u.asciiArts[Math.floor(Math.random() * u.asciiArts.length)], ...ereply }); break;
      case 'urban': {
        const term = interaction.options.getString('term'); await interaction.deferReply(ereply);
        try { const res = await fetch('https://api.urbandictionary.com/v0/define?term=' + encodeURIComponent(term)); const data = await res.json(); if (!data.list?.length) return interaction.editReply({ content: 'No results.' }); const e = data.list[0]; interaction.editReply({ embeds: [new EmbedBuilder().setTitle(e.word).setDescription(e.definition.slice(0, 2000)).setColor('#57F287').setFooter({ text: 'by ' + e.author })] }); } catch { interaction.editReply({ content: 'Could not fetch.' }); }
        break;
      }
      case 'countdown': {
        const dur = u.parseDuration(interaction.options.getString('duration')); if (!dur) return u.respond(interaction, 'Invalid duration.');
        const msg = interaction.options.getString('message') || 'Countdown finished'; await interaction.deferReply(ereply);
        await interaction.editReply({ content: 'Countdown set for ' + u.formatDuration(dur) + '.' });
        setTimeout(() => { interaction.channel.send('Countdown finished: ' + msg); }, dur); break;
      }
      case 'uptime': await interaction.reply({ content: 'Uptime: ' + u.formatDuration(process.uptime() * 1000), ...ereply }); break;
      case 'suggest': {
        const txt = interaction.options.getString('text'); await interaction.deferReply(ereply);
        const sch = interaction.guild.channels.cache.get(gc.suggestion_channel_id);
        if (!sch) return interaction.editReply({ content: 'Suggestion channel not configured.' });
        const embed = new EmbedBuilder().setTitle('Suggestion').setDescription(txt).setColor('#57F287').setFooter({ text: interaction.user.tag }).setTimestamp();
        const up = new ButtonBuilder().setCustomId('suggest_up').setLabel('0').setStyle(ButtonStyle.Success).setEmoji('👍');
        const down = new ButtonBuilder().setCustomId('suggest_down').setLabel('0').setStyle(ButtonStyle.Danger).setEmoji('👎');
        const m = await sch.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(up, down)] });
        u.suggestions.set(m.id, { guildId: interaction.guild.id, authorId: interaction.user.id, text: txt, upvotes: 0, downvotes: 0, voters: [] });
        await interaction.editReply({ content: 'Suggestion posted in ' + sch.toString() + '.' }); break;
      }
      case 'paste': {
        const title = interaction.options.getString('title'); const content = interaction.options.getString('content');
        await interaction.deferReply(ereply); u.pasteCounter++;
        u.pastes.set(u.pasteCounter, { title, content, author: interaction.user.tag, time: Date.now() });
        await interaction.editReply({ content: 'Paste created. ID: ' + u.pasteCounter }); break;
      }
      case 'paste-get': {
        const id = interaction.options.getInteger('id'); await interaction.deferReply(ereply);
        const p = u.pastes.get(id); if (!p) return interaction.editReply({ content: 'Paste not found.' });
        await interaction.editReply({ content: '**' + p.title + '** (by ' + p.author + ')\n```\n' + p.content.slice(0, 1900) + '\n```' }); break;
      }
      case 'timeconvert': {
        const t = interaction.options.getString('time'); const f = interaction.options.getString('from').toUpperCase(); const to = interaction.options.getString('to').toUpperCase();
        await interaction.deferReply(ereply);
        if (u.timezones[f] === undefined || u.timezones[to] === undefined) return interaction.editReply({ content: 'Unknown timezone. Try: EST, UTC, PST, IST, JST, GMT, CET.' });
        const parts = t.split(':'); const h = parseInt(parts[0]), mi = parseInt(parts[1]);
        if (isNaN(h) || isNaN(mi)) return interaction.editReply({ content: 'Invalid time format (use HH:MM 24h).' });
        const offset = u.timezones[to] - u.timezones[f];
        let nh = (h + offset + 24) % 24;
        await interaction.editReply({ content: t + ' ' + f + ' = ' + String(Math.floor(nh)).padStart(2, '0') + ':' + String(mi).padStart(2, '0') + ' ' + to }); break;
      }
      case 'note': {
        await interaction.deferReply(ereply); const sub = interaction.options.getSubcommand(); const u2 = interaction.options.getUser('user'); const nk = interaction.guildId + '-' + u2.id;
        if (sub === 'add') {
          const text = interaction.options.getString('text');
          const ns = u.notes.get(nk) || []; ns.push({ text, modId: interaction.user.id, time: Date.now() }); u.notes.set(nk, ns);
          await interaction.editReply({ content: 'Note added.' });
        } else if (sub === 'list') {
          const ns = u.notes.get(nk) || [];
          if (!ns.length) return interaction.editReply({ content: 'No notes.' });
          await interaction.editReply({ content: '**Notes**\n' + ns.map((n, i) => '#' + (i + 1) + ' | ' + n.text).join('\n').slice(0, 1900) });
        }
        break;
      }
      case 'shadowban': {
        const user = interaction.options.getUser('user'); await interaction.deferReply(ereply);
        u.shadowbans.add(user.id + '-' + interaction.guild.id);
        u.logAudit(interaction.guild, 'Shadowban', user, interaction.user);
        await interaction.editReply({ content: 'Shadowbanned ' + user.tag + '.' }); break;
      }
      case 'unshadowban': {
        const user = interaction.options.getUser('user'); await interaction.deferReply(ereply);
        u.shadowbans.delete(user.id + '-' + interaction.guild.id);
        u.logAudit(interaction.guild, 'Unshadowban', user, interaction.user);
        await interaction.editReply({ content: 'Unshadowbanned ' + user.tag + '.' }); break;
      }
      case 'honeypot': {
        await interaction.deferReply(ereply); const sub = interaction.options.getSubcommand();
        if (sub === 'setup') {
          const existing = [...u.honeypots.keys()].find(cid => interaction.guild.channels.cache.get(cid));
          if (existing) return interaction.editReply({ content: 'Honeypot already exists.' });
          const ch = await interaction.guild.channels.create({ name: 'giveaway-prize', type: ChannelType.GuildText, parent: gc.category_id }).catch(() => null);
          if (!ch) return interaction.editReply({ content: 'Could not create channel.' });
          u.honeypots.set(ch.id, interaction.guild.id);
          await ch.send('Welcome! Type anything to claim your prize.').catch(() => {});
          await interaction.editReply({ content: 'Honeypot created: ' + ch.toString() });
        } else if (sub === 'remove') {
          const cid = [...u.honeypots.keys()].find(cid => interaction.guild.channels.cache.get(cid)?.guild?.id === interaction.guild.id);
          if (!cid) return interaction.editReply({ content: 'No honeypot found.' });
          u.honeypots.delete(cid); const ch = interaction.guild.channels.cache.get(cid); if (ch) await ch.delete().catch(() => {});
          await interaction.editReply({ content: 'Honeypot removed.' });
        }
        break;
      }
      case 'reload': await interaction.deferReply(ereply); delete require.cache[require.resolve('./config')]; Object.assign(config, require('./config')); await interaction.editReply({ content: 'Reloaded.' }); break;
      case 'presence': {
        const type = parseInt(interaction.options.getString('type')); const name = interaction.options.getString('name');
        await interaction.deferReply(ereply); interaction.client.user.setActivity(name, { type }); await interaction.editReply({ content: 'Presence updated.' }); break;
      }
      case 'shutdown': await interaction.deferReply(ereply); await interaction.editReply({ content: 'Shutting down.' }); setTimeout(() => process.exit(0), 2000); break;
      case 'eval': {
        await interaction.deferReply(ereply); if (interaction.user.id !== process.env.OWNER_ID) return interaction.editReply({ content: 'Owner only.' });
        const code = interaction.options.getString('code');
        try { let r = eval(code); if (typeof r !== 'string') r = require('util').inspect(r, { depth: 1 }); await interaction.editReply({ content: '```js\n' + String(r).slice(0, 1900) + '\n```' }); } catch (e) { await interaction.editReply({ content: '```\n' + String(e).slice(0, 1900) + '\n```' }); }
        break;
      }
      case 'stats': {
        await interaction.deferReply(ereply); const sorted = [...u.commandStats.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
        if (!sorted.length) return interaction.editReply({ content: 'No stats yet.' });
        await interaction.editReply({ content: '**Stats**\n' + sorted.map(([k, v]) => k + ': ' + v).join('\n') }); break;
      }
      case 'sync': await interaction.deferReply(ereply); await interaction.editReply({ content: 'Run npm run deploy to resync.' }); break;
    }
  } catch (e) { console.error('Slash error:', e); }
}

async function handleButton(interaction) {
  const gc = u.getGuildConfig(interaction.guildId);
  if (!gc) return u.respond(interaction, 'Not configured.');
  const id = interaction.customId;
  if (id === 'verify_user') {
    if (gc.member_role_id?.length > 5) await interaction.member.roles.add(gc.member_role_id).catch(() => {});
    if (gc.unverified_role_id?.length > 5) await interaction.member.roles.remove(gc.unverified_role_id).catch(() => {});
    return u.respond(interaction, 'Verified.');
  }
  if (id === 'close_ticket') {
    await interaction.deferReply({ ephemeral: true });
    const ch = interaction.channel; const fetched = await ch.messages.fetch({ limit: 100 }).catch(() => null);
    const lines = [];
    if (fetched) [...fetched.values()].reverse().forEach(msg => {
      if (msg.content) lines.push('[' + msg.createdAt.toLocaleString() + '] ' + msg.author.tag + ': ' + msg.content);
      msg.attachments.forEach(a => lines.push('[' + msg.createdAt.toLocaleString() + '] ' + msg.author.tag + ': [Attachment] ' + a.url));
    });
    const logCh = interaction.guild.channels.cache.get(gc.log_channel_id);
    if (logCh && lines.length) logCh.send({ content: 'Ticket closed: #' + ch.name, files: [{ attachment: Buffer.from(lines.join('\n'), 'utf-8'), name: 'transcript-' + ch.name + '.txt' }] }).catch(() => {});
    u.tickets.delete(ch.id); u.ticketTimeouts.delete(ch.id); u.ticketPriority.delete(ch.id);
    const uid = ch.permissionOverwrites.cache.find(o => o.type === 1 && o.id !== interaction.user.id && o.id !== gc.staff_role_id)?.id;
    await ch.delete().catch(() => {});
    if (uid) { try { const user = await interaction.client.users.fetch(uid); user.send('Your ticket in ' + gc.name + ' has been closed. Thank you.').catch(() => {}); } catch {} }
    try { await interaction.editReply({ content: 'Closed.' }); } catch {}
    return;
  }
  if (id === 'claim_ticket') {
    if (!u.tickets.has(interaction.channel.id)) return u.respond(interaction, 'Not a ticket.');
    u.claimedTickets.set(interaction.channel.id, interaction.user.id);
    return u.respond(interaction, 'Claimed by ' + interaction.user.tag + '.');
  }
  if (id.startsWith('role_')) {
    const idx = parseInt(id.split('_')[1]); const rd = (gc.notification_roles || [])[idx];
    if (!rd) return u.respond(interaction, 'Role not found.');
    const role = interaction.guild.roles.cache.get(rd.role_id);
    if (!role) return u.respond(interaction, 'Role not found on server.');
    if (interaction.member.roles.cache.has(role.id)) { await interaction.member.roles.remove(role).catch(() => {}); return u.respond(interaction, 'Removed ' + rd.label + '.'); }
    await interaction.member.roles.add(role).catch(() => {}); return u.respond(interaction, 'Added ' + rd.label + '.');
  }
  if (id === 'suggest_up' || id === 'suggest_down') {
    await interaction.deferReply({ ephemeral: true });
    const msg = interaction.message; const data = u.suggestions.get(msg.id);
    if (!data) return interaction.editReply({ content: 'Suggestion data not found.' });
    if (data.voters.includes(interaction.user.id)) return interaction.editReply({ content: 'You already voted.' });
    data.voters.push(interaction.user.id);
    if (id === 'suggest_up') data.upvotes++; else data.downvotes++;
    u.suggestions.set(msg.id, data);
    const embed = EmbedBuilder.from(msg.embeds[0]).setFooter({ text: interaction.message.embeds[0]?.footer?.text || '' });
    const up = ButtonBuilder.from(msg.components[0].components[0]).setLabel(String(data.upvotes));
    const down = ButtonBuilder.from(msg.components[0].components[1]).setLabel(String(data.downvotes));
    await msg.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(up, down)] }).catch(() => {});
    if (data.upvotes >= config.suggestions.voteThreshold) {
      const sch = interaction.guild.channels.cache.get(gc.suggestion_channel_id);
      if (sch) sch.send('Suggestion reached ' + data.upvotes + ' upvotes! Threshold met.').catch(() => {});
    }
    return interaction.editReply({ content: 'Vote recorded.' });
  }
}

async function handleSelectMenu(interaction) {
  const gc = u.getGuildConfig(interaction.guildId);
  if (!gc || interaction.customId !== 'ticket_select') return u.respond(interaction, 'Not configured.');
  const val = interaction.values[0];
  if (val === 'general') {
    await interaction.deferReply({ ephemeral: true }); const ch = await createTicket(interaction, gc, null).catch(e => { interaction.editReply({ content: e.message }); return null; });
    if (ch) await interaction.editReply({ content: 'Ticket created: ' + ch.toString() }); return;
  }
  if (val === 'report') {
    const m = new ModalBuilder().setCustomId('report_modal').setTitle('Report a Player');
    m.addComponents(
      new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('player_name').setLabel('Player Name').setStyle(TextInputStyle.Short).setRequired(true)),
      new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('reason').setLabel('Reason for Report').setStyle(TextInputStyle.Paragraph).setRequired(true)),
      new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('evidence').setLabel('Evidence').setStyle(TextInputStyle.Paragraph).setRequired(false)));
    return interaction.showModal(m);
  }
  if (val === 'apply') {
    const m = new ModalBuilder().setCustomId('apply_modal').setTitle('Application Form');
    m.addComponents(
      new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('position').setLabel('Position / Form Type').setStyle(TextInputStyle.Short).setRequired(true)),
      new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('experience').setLabel('Your Experience').setStyle(TextInputStyle.Paragraph).setRequired(true)),
      new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('why').setLabel('Why do you want this?').setStyle(TextInputStyle.Paragraph).setRequired(true)));
    return interaction.showModal(m);
  }
}

async function handleModal(interaction) {
  const gc = u.getGuildConfig(interaction.guildId);
  if (!gc) return u.respond(interaction, 'Not configured.');
  await interaction.deferReply({ ephemeral: true });
  if (interaction.customId === 'report_modal') {
    const name = interaction.fields.getTextInputValue('player_name'); const reason = interaction.fields.getTextInputValue('reason');
    const evidence = interaction.fields.getTextInputValue('evidence');
    const info = '**Report a Player**\nPlayer: ' + name + '\nReason: ' + reason + (evidence ? '\nEvidence: ' + evidence : '');
    const ch = await createTicket(interaction, gc, info).catch(e => { interaction.editReply({ content: e.message }); return null; });
    if (ch) await interaction.editReply({ content: 'Ticket created: ' + ch.toString() }); return;
  }
  if (interaction.customId === 'apply_modal') {
    const pos = interaction.fields.getTextInputValue('position'); const exp = interaction.fields.getTextInputValue('experience');
    const why = interaction.fields.getTextInputValue('why');
    const info = '**Application**\nPosition: ' + pos + '\nExperience: ' + exp + '\nWhy: ' + why;
    const ch = await createTicket(interaction, gc, info).catch(e => { interaction.editReply({ content: e.message }); return null; });
    if (ch) await interaction.editReply({ content: 'Ticket created: ' + ch.toString() }); return;
  }
}

async function handleMessageCreate(client, message) {
  if (message.author.bot || !message.guild) return;
  if (config.serverBlacklist.includes(message.guild.id)) return;
  if (u.shadowbans.has(message.author.id + '-' + message.guild.id)) return message.delete().catch(() => {});
  await handlePrefix(message);
}

async function handleInteractionCreate(client, interaction) {
  if (config.serverBlacklist.includes(interaction.guildId)) return;
  try {
    if (interaction.isChatInputCommand()) await handleSlash(interaction);
    else if (interaction.isButton()) await handleButton(interaction);
    else if (interaction.isStringSelectMenu()) await handleSelectMenu(interaction);
    else if (interaction.isModalSubmit()) await handleModal(interaction);
  } catch (e) {
    console.error('Interaction error:', e);
    try { if (!interaction.replied && !interaction.deferred) await interaction.reply({ content: 'An error occurred.', ephemeral: true }).catch(() => {}); } catch {}
  }
}

function handleGuildMemberAdd(client, member) {
  const gc = u.getGuildConfig(member.guild.id);
  if (!gc) return;
  const now = Date.now(); const jk = member.guild.id;
  const ts = u.joinTimestamps.get(jk) || [];
  const recent = ts.filter(t => now - t < config.automod.raidWindowMs);
  recent.push(now); u.joinTimestamps.set(jk, recent);
  if (recent.length >= config.automod.raidJoinThreshold && !u.raidMode.has(jk)) {
    u.raidMode.set(jk, true);
    member.guild.channels.cache.forEach(ch => { if (ch.type === ChannelType.GuildText) ch.permissionOverwrites.edit(member.guild.id, { SendMessages: false }).catch(() => {}); });
    const logCh = member.guild.channels.cache.get(gc.log_channel_id);
    if (logCh) logCh.send('**Raid Detection** | Channels locked.').catch(() => {});
  }
}

function handleReady(client) {
  globalClient = client;
  console.log('Atlas Core logged in as ' + client.user.tag);
  client.user.setActivity('across ' + Object.keys(config.guilds).length + ' servers', { type: 3 });
  setInterval(() => {
    const now = Date.now();
    u.countdowns.forEach((v, k) => { if (now >= v.end) { const ch = client.channels.cache.get(v.channelId); if (ch) ch.send('Countdown finished: ' + v.msg).catch(() => {}); u.countdowns.delete(k); } });
  }, 5000);
}

module.exports = { handleMessageCreate, handleInteractionCreate, handleGuildMemberAdd, handleReady };
