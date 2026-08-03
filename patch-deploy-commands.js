const fs = require('fs');
const file = './deploy-commands.js';
let code = fs.readFileSync(file, 'utf8');

if (code.includes("setName('giveaway')")) {
  console.log('ℹ️ /giveaway already exists in deploy-commands.js');
  process.exit(0);
}

const snippet = `  new SlashCommandBuilder()
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
    )`;

const idx = code.lastIndexOf('];');

if (idx === -1) {
  console.error('❌ Could not find ]; in deploy-commands.js');
  console.error('You may need to manually add the giveaway command.');
  process.exit(1);
}

const before = code.slice(0, idx).replace(/\s+$/, '');
const after = code.slice(idx);

const needsComma = !before.endsWith(',') && !before.endsWith('[');

code =
  before +
  (needsComma ? ',\n' : '\n') +
  snippet +
  '\n' +
  after;

fs.writeFileSync(file, code);
console.log('✅ Patched deploy-commands.js with /giveaway');
