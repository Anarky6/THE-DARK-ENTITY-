const { WAConnection, MessageType, Mimetype } = require('@whiskeysockets/baileys');
const fs = require('fs');
const { color, bgcolor } = require('./lib/color');
const { start, info, success, close } = require('./lib/spinner');
const { nocache, uncache } = require('./lib/loader');
const { smsgify } = require('./lib/myfunc');

let xeon = new WAConnection();
global.db = JSON.parse(fs.readFileSync('./database/database.json'));
if (!fs.existsSync('./database/database.json')) {
  fs.writeFileSync('./database/database.json', JSON.stringify({ users: {}, sticker: {}, game: {}, others: {}, chats: {}, settings: {} }, null, 2));
}

xeon.logger.level = 'info';
xeon.on('qr', (qr) => {
  console.log(color('[QR]'), 'Scan the QR code to connect to WhatsApp!');
});

xeon.on('connecting', () => {
  start('connect', 'Connecting to WhatsApp...');
}

xeon.on('open', () => {
  success('connect', 'Connected to WhatsApp!');
});

xeon.on('close', ({ reason }) => {
  close('connect', `Disconnected: ${reason}`);
});

async function connectToWhatsApp() {
  await xeon.connect();
  console.log(color(figlet.textSync('The Dark Entity', { font: 'Ghost' }), 'cyan'));
  console.log(color('Bot by Anarky6', 'yellow'));
}

nocache('./XeonCheems8.js', (module) => {
  console.log(color(`[UPDATE] ${module} reloaded!`, 'cyan'));
});

xeon.on('chat-update', async (chat) => {
  if (!chat.hasNewMessage) {
    return;
  }
  const m = smsgify(xeon, chat.messages.all()[0], null);
  if (!m.message) {
    return;
  }
  require('./XeonCheems8')(xeon, m, chat, null);
});

connectToWhatsApp().catch((err) => console.log(color('[ERROR]', 'red'), err));
