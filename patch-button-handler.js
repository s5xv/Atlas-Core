const fs = require('fs');
const file = './commands.js';
let code = fs.readFileSync(file, 'utf8');

const handlerInjection = `
  // --- LOAN TICKET BUTTON HANDLER START ---
  if (id === 'open_loan_ticket') {
    const gc = config.guilds.find(g => g.id === interaction.guild.id) || config.guilds[2]; // Fallback to Plutus Bank config
    await interaction.deferReply({ ephemeral: true });
    const ch = await createTicket(interaction, gc, 'Loan Support Ticket').catch(e => { interaction.editReply({ content: e.message }); return null; });
    return;
  }
  // --- LOAN TICKET BUTTON HANDLER END ---
`;

if (!code.includes('// --- LOAN TICKET BUTTON HANDLER START ---')) {
  code = code.replace(
    /if \(id === 'close_ticket'\) \{/,
    handlerInjection + '\n  if (id === \'close_ticket\') {'
  );
  fs.writeFileSync(file, code);
  console.log('✅ Patched loan button handler.');
} else {
  console.log('ℹ️ Button handler already patched.');
}
