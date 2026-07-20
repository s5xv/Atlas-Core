# Atlas Core v3

Discord bot with 50+ commands across 6 servers.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env`, fill in DISCORD_TOKEN, CLIENT_ID, OWNER_ID
3. Edit `config.js` - replace all placeholder IDs with real Discord IDs
4. `npm run deploy` to register slash commands
5. `npm start`

## All Commands (Slash + Prefix !)

**Verification:** /verify
**Tickets:** /ticket (claim, add, remove, rename, move, priority)
**Roles:** /roles
**Moderation:** /purge, /msg, /warn (add, list, remove), /mute, /unmute, /kick, /ban, /unban, /tempban, /slowmode, /lock, /unlock, /hide, /unhide, /nick, /voicekick, /voicemove, /shadowban, /unshadowban, /honeypot (setup, remove), /note (add, list)
**Fun:** /8ball, /coinflip, /dice, /rps, /trivia, /joke, /ascii, /urban
**Utility:** /suggest, /paste, /paste-get, /timeconvert, /countdown, /uptime
**Admin:** /reload, /presence, /shutdown, /eval, /stats, /sync

## New Features
- Audit log channel for all moderation actions
- Shadowban (silently delete user messages)
- Honeypot trap channel (logs anyone who messages in it)
- Suggestion box with upvote/downvote buttons and vote threshold
- Pastebin (in-memory text storage with IDs)
- Timezone converter (EST, UTC, PST, IST, JST, etc.)
- Staff note system per user
- Ephemeral responses for all slash commands
- Keep-alive HTTP server for UptimeRobot

## Render Deploy
1. Push to GitHub
2. Web Service -> Node -> Free
3. Build: `npm install`, Start: `node index.js`
4. Env vars: DISCORD_TOKEN, CLIENT_ID, OWNER_ID
5. UptimeRobot: ping `https://your-app.onrender.com` every 5 min
