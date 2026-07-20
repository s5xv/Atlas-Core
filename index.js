require('dotenv').config();
const http = require('http');
const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const config = require('./config');
const bot = require('./commands');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

const port = process.env.PORT || 3000;
http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('OK'); }).listen(port, () => {
  console.log('Keep-alive server on port ' + port);
});

client.once(Events.ClientReady, (c) => bot.handleReady(c));
client.on(Events.MessageCreate, (m) => bot.handleMessageCreate(client, m));
client.on(Events.InteractionCreate, (i) => bot.handleInteractionCreate(client, i));
client.on(Events.GuildMemberAdd, (m) => bot.handleGuildMemberAdd(client, m));

client.login(process.env.DISCORD_TOKEN);
