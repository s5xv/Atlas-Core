const fs = require('fs');
const file = './commands.js';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /\/\/ --- EXTRA FEATURES START ---[\s\S]*?\/\/ --- EXTRA FEATURES END ---\n?/g,
  ''
);

code = code.replace(
  /\/\/ --- LOAN TICKET BUTTON HANDLER START ---[\s\S]*?\/\/ --- LOAN TICKET BUTTON HANDLER END ---\n?/g,
  ''
);

fs.writeFileSync(file, code);
console.log('✅ Removed old extra feature blocks.');
