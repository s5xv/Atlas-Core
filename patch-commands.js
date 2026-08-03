const fs = require('fs');
const file = './commands.js';
let code = fs.readFileSync(file, 'utf8');

const injection = `
  // --- CONDITIONAL TICKET PERMISSIONS START ---
  const sourceChannelId = interaction.channelId;
  overwrites.length = 0; // Clear existing to enforce routing
  overwrites.push(
    { id: interaction.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
    { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.EmbedLinks] },
    { id: interaction.client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageMessages] }
  );

  if (sourceChannelId === '1533885991130235027') { // #🏧-loans
    overwrites.push(
      { id: '1528804776933064905', allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }, // Loan Officer
      { id: '1528804643474509996', allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }  // Branch Manager
    );
  } else if (sourceChannelId === '1528807330433597451') { // #🎫-open-a-ticket
    overwrites.push(
      { id: '1531770145473560596', allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] } // Teller
    );
  } else {
    if (gc.staff_role_id) overwrites.push({ id: gc.staff_role_id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] });
  }
  // --- CONDITIONAL TICKET PERMISSIONS END ---
`;

if (!code.includes('// --- CONDITIONAL TICKET PERMISSIONS START ---')) {
  code = code.replace(
    /const chOpts = \{ name: 'ticket-'/,
    injection + '\n  const chOpts = { name: \'ticket-\''
  );
  fs.writeFileSync(file, code);
  console.log('✅ Patched createTicket permissions.');
} else {
  console.log('ℹ️ Permissions already patched.');
}
