const fs = require('fs');
const file = './commands.js';
let code = fs.readFileSync(file, 'utf8');

// The exact broken line we injected earlier
const target = "const gc = config.guilds.find(g => g.id === interaction.guild.id) || config.guilds[2];";
// The corrected line using Object lookup
const replacement = "const gc = config.guilds[interaction.guild.id] || config.guilds['1528804420383674559'] || Object.values(config.guilds)[0];";

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync(file, code);
  console.log('✅ Fixed the config.guilds.find error!');
} else {
  console.log('⚠️ Could not find the exact string. Searching with regex...');
  const regex = /const gc = config\.guilds\.find.*?;(\s*\/\/ Fallback to Plutus Bank config)?/;
  if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync(file, code);
    console.log('✅ Fixed the config.guilds.find error with regex!');
  } else {
    console.log('❌ Failed to find the broken line to patch.');
  }
}
