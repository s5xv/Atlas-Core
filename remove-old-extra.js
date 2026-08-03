const fs = require('fs');
const file = './commands.js';
let code = fs.readFileSync(file, 'utf8');

// Remove old extra features block
code = code.replace(
  /\/\/ --- EXTRA FEATURES START ---[\s\S]*?\/\/ --- EXTRA FEATURES END ---\n?/g,
  ''
);

// Remove old loan button handler block if it exists
code = code.replace(
  /\/\/ --- LOAN TICKET BUTTON HANDLER START ---[\s\S]*?\/\/ --- LOAN TICKET BUTTON HANDLER END ---\n?/g,
  ''
);

fs.writeFileSync(file, code);
console.log('✅ Removed old extra feature blocks from commands.js');
