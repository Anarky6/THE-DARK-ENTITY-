const { modul } = require('./module');
const { fs, figlet, ffmpeg, sharp, path } = modul;

// Mock Spotify data (replace with PhonkScope Spotify API if available)
const phonkTracks = [
  { title: "Midnight Drift", artist: "DJ PhonkMaster", url: "https://spotify.com/track1" },
  { title: "Neon Glow", artist: "LazyKillerBeats", url: "https://spotify.com/track2" },
  { title: "Vaporwave Vibes", artist: "AnakyRules", url: "https://spotify.com/track3" }
];

// PUBG data
const pubgDrops = ['Hot Springs', 'Pochinki', 'Erangel', 'Yasnaya', 'Georgopol'];
const pubgStrats = [
  'Land hot, grab a gun, and push the squad!',
  'Play sneaky, camp the edges, and third-party fights.',
  'Loot fast, rotate to zone, and hold a compound.'
];
const triviaQuestions = [
  { question: "What’s the max squad size in PUBG?", answer: "4", reward: 25 },
  { question: "Which map has Hot Springs?", answer: "Vikendi", reward: 20 },
  { question: "What’s the main rifle in PUBG’s starting island?", answer: "M416", reward: 30 }
];

// Pre-made sticker packs
const stickerPacks = {
  'anaky graffiti': ['anaky graffiti/sticker1.webp', 'anaky graffiti/sticker2.webp'],
  'phonk vibes': ['phonk vibes/sticker3.webp', 'phonk vibes/sticker4.webp'],
  'pubg kills': ['pubg kills/sticker5.webp', 'pubg kills/sticker6.webp']
};

// Jackpot storage
let jackpot = { amount: 100, lastReset: new Date() };
if (fs.existsSync('./database/jackpot.json')) {
  jackpot = JSON.parse(fs.readFileSync('./database/jackpot.json'));
}

// Save jackpot
function saveJackpot() {
  fs.writeFileSync('./database/jackpot.json', JSON.stringify(jackpot, null, 2));
}

// Reset jackpot daily
function resetJackpotIfNeeded() {
  const now = new Date();
  if (now - new Date(jackpot.lastReset) > 24 * 60 * 60 * 1000) {
    jackpot.amount = 100;
    jackpot.lastReset = now;
    saveJackpot();
  }
}

// Create stickers folder
if (!fs.existsSync('./stickers')) {
  fs.mkdirSync('./stickers');
}

// Convert image/video to sticker with optional text overlay
async function createSticker(XeonBotInc, inputPath, outputPath, textOverlay) {
  return new Promise((resolve, reject) => {
    if (textOverlay) {
      sharp(inputPath)
        .resize(512, 512)
        .composite([{ input: Buffer.from(`<svg><text x="10" y="50" font-size="30" fill="#00ffcc">${textOverlay}</text></svg>`), gravity: 'southwest' }])
        .toFile('temp.png', (err) => {
          if (err) return reject(err);
          ffmpeg('temp.png')
            .outputOptions(['-vcodec', 'libwebp', '-vf', 'scale=512:512'])
            .toFormat('webp')
            .save(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', reject);
        });
    } else {
      ffmpeg(inputPath)
        .outputOptions(['-vcodec', 'libwebp', '-vf', 'scale=512:512'])
        .toFormat('webp')
        .save(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject);
    }
  });
}

module.exports = async (XeonBotInc, m, chatUpdate, store) => {
  try {
    const body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype === 'imageMessage') ? m.message.imageMessage.caption : (m.mtype === 'videoMessage') ? m.message.videoMessage.caption : '';
    const budy = (typeof m.text === 'string') ? m.text : '';
    const prefix = '';
    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
    const args = body.trim().split(/ +/).slice(1);
    const text = args.join(' ');
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || '';
    const from = m.chat;
    const sender = m.sender;

    // Initialize user in global.db
    if (!global.db.users[sender]) {
      global.db.users[sender] = {
        coins: 100,
        bank: 0,
        items: [],
        lastDaily: null,
        lotteryWins: 0,
        customPacks: {}
      };
      fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
    }

    // Reset jackpot
    resetJackpotIfNeeded();

    // Commands
    switch (command) {
      case 'phonk':
        const track = phonkTracks[Math.floor(Math.random() * phonkTracks.length)];
        await XeonBotInc.sendText(from, `🎵 Yo, vibe with *${track.title}* by ${track.artist} - ${track.url}`, m);
        break;

      case 'mixtape':
        if (!global.db.users[sender].items.includes('Phonk Mixtape')) {
          await XeonBotInc.sendText(from, `❌ Need Phonk Mixtape from shop to use !mixtape, bruv!`, m);
          break;
        }
        const tracks = phonkTracks.sort(() => 0.5 - Math.random()).slice(0, 3);
        const mixtape = tracks.map(t => `*${t.title}* by ${t.artist} - ${t.url}`).join('\n');
        await XeonBotInc.sendText(from, `🎵 *Dark Entity Mixtape* 🎵\n${mixtape}`, m);
        break;

      case 'drop':
        const drop = pubgDrops[Math.floor(Math.random() * pubgDrops.length)];
        await XeonBotInc.sendText(from, `🎮 Yo, Dark Entity squad! Drop at *${drop}*! 😈`, m);
        break;

      case 'strat':
        const strat = pubgStrats[Math.floor(Math.random() * pubgStrats.length)];
        await XeonBotInc.sendText(from, `🎮 Dark Entity strat: *${strat}*`, m);
        break;

      case 'anaky':
        const style = args[0] || 'standard';
        const font = style === 'neon' ? 'Ghost' : style === 'chrome' ? 'Chrome' : 'Standard';
        figlet.text('Anaky_rules', { font }, (err, data) => {
          if (!err) XeonBotInc.sendText(from, data, m);
          else XeonBotInc.sendText(from, `❌ Error, bruv! Use !anaky [standard/neon/chrome]`, m);
        });
        break;

      case 'sticker':
        const cost = global.db.users[sender].items.includes('Sticker Blaster') ? 0 : 5;
        if (global.db.users[sender].coins < cost) {
          await XeonBotInc.sendText(from, `❌ Need ${cost} coins to create a sticker, bruv!`, m);
          break;
        }

        const effect = args[0] || null;
        const textOverlay = effect === 'anaky' ? 'Anaky_rules' : effect === 'lazy' ? 'Lazy Killers' : null;

        if (m.mtype === 'imageMessage' || m.mtype === 'videoMessage') {
          const buffer = await XeonBotInc.downloadMediaMessage(quoted);
          const inputPath = `./stickers/temp_${Date.now()}.${mime.split('/')[1]}`;
          const outputPath = `./stickers/sticker_${Date.now()}.webp`;

          fs.writeFileSync(inputPath, buffer);
          try {
            global.db.users[sender].coins -= cost;
            if (textOverlay) {
              await createSticker(XeonBotInc, inputPath, outputPath, textOverlay);
              await XeonBotInc.sendMessage(from, { sticker: fs.readFileSync(outputPath) }, { quoted: m });
              fs.unlinkSync(outputPath);
            } else {
              await XeonBotInc.sendImageAsSticker(from, buffer, m, { packname: 'The Dark Entity', author: 'Anaky_rules' });
            }
            fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
            fs.unlinkSync(inputPath);
            await XeonBotInc.sendText(from, `🖼️ Sticker created${cost > 0 ? ` (-${cost} coins)` : ''}!`, m);
          } catch (err) {
            await XeonBotInc.sendText(from, `❌ Error creating sticker, bruv!`, m);
            fs.unlinkSync(inputPath);
          }
        } else {
          await XeonBotInc.sendText(from, `📸 Reply to an image or video with !sticker [anaky/lazy]`, m);
        }
        break;

      case 'pack':
        if (!args[0]) {
          const packs = Object.keys(stickerPacks).map(p => `- ${p}`).join('\n');
          await XeonBotInc.sendText(from, `🖼️ *Sticker Packs* 🖼️\n${packs}\nCustom Packs: ${Object.keys(global.db.users[sender].customPacks).join(', ') || 'None'}\nUse !pack <name> to send a pack!`, m);
          break;
        }
        const packName = args[0].toLowerCase();
        const pack = stickerPacks[packName] || global.db.users[sender].customPacks[packName];
        if (pack) {
          for (const sticker of pack) {
            if (fs.existsSync(`./stickers/${sticker}`)) {
              await XeonBotInc.sendMessage(from, { sticker: fs.readFileSync(`./stickers/${sticker}`) }, { quoted: m });
            }
          }
        } else {
          await XeonBotInc.sendText(from, `❌ No pack named "${packName}", bruv! Use !pack to see available packs.`, m);
        }
        break;

      case 'createpack':
        if (global.db.users[sender].coins < 20) {
          await XeonBotInc.sendText(from, `❌ Need 20 coins to create a sticker pack, bruv!`, m);
          break;
        }

        const newPackName = args.join(' ').toLowerCase();
        if (!newPackName) {
          await XeonBotInc.sendText(from, `❌ Specify a pack name, bruv! Example: !createpack mypack`, m);
          break;
        }
        if (stickerPacks[newPackName] || global.db.users[sender].customPacks[newPackName]) {
          await XeonBotInc.sendText(from, `❌ Pack name "${newPackName}" already exists, bruv!`, m);
          break;
        }

        global.db.users[sender].customPacks[newPackName] = [];
        global.db.users[sender].coins -= 20;
        fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
        await XeonBotInc.sendText(from, `🖼️ Created pack "${newPackName}" (-20 coins)! Reply to images/videos with !addtopack ${newPackName} to add stickers.`, m);
        break;

      case 'addtopack':
        const addCost = global.db.users[sender].items.includes('Sticker Blaster') ? 0 : 5;
        if (global.db.users[sender].coins < addCost) {
          await XeonBotInc.sendText(from, `❌ Need ${addCost} coins to add a sticker, bruv!`, m);
          break;
        }

        const addPackName = args.join(' ').toLowerCase();
        if (!addPackName || !global.db.users[sender].customPacks[addPackName]) {
          await XeonBotInc.sendText(from, `❌ No pack named "${addPackName}", bruv! Create one with !createpack ${addPackName}`, m);
          break;
        }

        if (m.mtype === 'imageMessage' || m.mtype === 'videoMessage') {
          const buffer = await XeonBotInc.downloadMediaMessage(quoted);
          const inputPath = `./stickers/temp_${Date.now()}.${mime.split('/')[1]}`;
          const outputPath = `./stickers/${addPackName}/sticker_${Date.now()}.webp`;

          fs.mkdirSync(`./stickers/${addPackName}`, { recursive: true });
          fs.writeFileSync(inputPath, buffer);
          try {
            global.db.users[sender].coins -= addCost;
            await createSticker(XeonBotInc, inputPath, outputPath, 'Anaky_rules');
            global.db.users[sender].customPacks[addPackName].push(`${addPackName}/sticker_${Date.now()}.webp`);
            fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
            await XeonBotInc.sendMessage(from, { sticker: fs.readFileSync(outputPath) }, { quoted: m });
            await XeonBotInc.sendText(from, `🖼️ Added sticker to "${addPackName}"${addCost > 0 ? ` (-${addCost} coins)` : ''}!`, m);
            fs.unlinkSync(inputPath);
          } catch (err) {
            await XeonBotInc.sendText(from, `❌ Error adding sticker, bruv!`, m);
            fs.unlinkSync(inputPath);
          }
        } else {
          await XeonBotInc.sendText(from, `📸 Reply to an image or video with !addtopack ${addPackName}`, m);
        }
        break;

      case 'daily':
        const now = new Date();
        const lastDaily = global.db.users[sender].lastDaily ? new Date(global.db.users[sender].lastDaily) : null;
        if (!lastDaily || now - lastDaily > 24 * 60 * 60 * 1000) {
          global.db.users[sender].coins += 50;
          global.db.users[sender].lastDaily = now;
          fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
          await XeonBotInc.sendText(from, `💰 Claimed 50 daily coins from The Dark Entity! Total: ${global.db.users[sender].coins}`, m);
        } else {
          await XeonBotInc.sendText(from, `⏳ Already claimed today, bruv! Try again tomorrow.`, m);
        }
        break;

      case 'shop':
        const shop = `🛒 *Dark Entity's Neon Shop* 🛒
🌌 Neon Shield - 100 coins (🛡️ 50% bank protection from game losses)
🎨 Graffiti Vault - 200 coins (🔲 100% bank protection from game losses)
🎵 Phonk Mixtape - 150 coins (📼 Unlocks !mixtape for 3-track phonk playlists)
🔭 Dark Sniper Scope - 400 coins (🎯 Doubles mini-game coin rewards)
🖼️ Sticker Blaster - 250 coins (💥 Free sticker/pack creation)
Use !buy <item> to purchase.`;
        await XeonBotInc.sendText(from, shop, m);
        break;

      case 'buy':
        const item = text.toLowerCase();
        const items = {
          'neon shield': { cost: 100, name: 'Neon Shield', message: '🛡️ Bought Neon Shield! 50% bank protection activated.' },
          'graffiti vault': { cost: 200, name: 'Graffiti Vault', message: '🔲 Bought Graffiti Vault! 100% bank protection activated.' },
          'phonk mixtape': { cost: 150, name: 'Phonk Mixtape', message: '📼 Bought Phonk Mixtape! Use !mixtape for playlists.' },
          'dark sniper scope': { cost: 400, name: 'Dark Sniper Scope', message: '🎯 Bought Dark Sniper Scope! Double mini-game rewards activated.' },
          'sticker blaster': { cost: 250, name: 'Sticker Blaster', message: '💥 Bought Sticker Blaster! Free sticker/pack creation activated.' }
        };
        const selectedItem = items[item];
        if (selectedItem && global.db.users[sender].coins >= selectedItem.cost && !global.db.users[sender].items.includes(selectedItem.name)) {
          global.db.users[sender].coins -= selectedItem.cost;
          global.db.users[sender].items.push(selectedItem.name);
          fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
          await XeonBotInc.sendText(from, selectedItem.message, m);
        } else {
          await XeonBotInc.sendText(from, `❌ Not enough coins or already own this item, bruv!`, m);
        }
        break;

      case 'deposit':
        const amount = parseInt(args[0]);
        if (amount > 0 && global.db.users[sender].coins >= amount) {
          global.db.users[sender].coins -= amount;
          global.db.users[sender].bank += amount;
          fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
          await XeonBotInc.sendText(from, `💸 Deposited ${amount} coins to bank. Total: ${global.db.users[sender].bank}`, m);
        } else {
          await XeonBotInc.sendText(from, `❌ Not enough coins, bruv!`, m);
        }
        break;

      case 'balance':
        await XeonBotInc.sendText(from, `💰 Coins: ${global.db.users[sender].coins}\n🏦 Bank: ${global.db.users[sender].bank}\n🛠️ Items: ${global.db.users[sender].items.join(', ') || 'none'}`, m);
        break;

      case 'lottery':
        const [tier, ...colorArgs] = args;
        const color = colorArgs.join(' ').toLowerCase();
        const validColors = ['green', 'red', 'black', 'neon purple', 'silver chrome'];
        if (!tier || !color || !validColors.includes(color)) {
          await XeonBotInc.sendText(from, `🎲 *Dark Entity Lotto* 🎲
Pick a tier and color: !lottery <tier> <color>
- Basic (10 coins, 50-coin prize): Green (20%), Red (15%), Black (12%), Neon Purple (5%), Silver Chrome (2%)
- Pro (25 coins, 150-coin prize): Green (15%), Red (10%), Black (7%), Neon Purple (3%), Silver Chrome (1%)
- Elite (50 coins, 500-coin prize): Green (10%), Red (5%), Black (3%), Neon Purple (1%), Silver Chrome (0.5%)
- Jackpot (100 coins, ${jackpot.amount}-coin prize): Green (5%), Red (3%), Black (1%), Neon Purple (0.5%), Silver Chrome (0.1%)
Example: !lottery basic green`, m);
          break;
        }

        let cost, baseWinChance, prize;
        if (tier.toLowerCase() === 'basic') {
          cost = 10; prize = 50;
          baseWinChance = color === 'green' ? 0.20 : color === 'red' ? 0.15 : color === 'black' ? 0.12 : color === 'neon purple' ? 0.05 : 0.02;
        } else if (tier.toLowerCase() === 'pro') {
          cost = 25; prize = 150;
          baseWinChance = color === 'green' ? 0.15 : color === 'red' ? 0.10 : color === 'black' ? 0.07 : color === 'neon purple' ? 0.03 : 0.01;
        } else if (tier.toLowerCase() === 'elite') {
          cost = 50; prize = 500;
          baseWinChance = color === 'green' ? 0.10 : color === 'red' ? 0.05 : color === 'black' ? 0.03 : color === 'neon purple' ? 0.01 : 0.005;
        } else if (tier.toLowerCase() === 'jackpot') {
          cost = 100; prize = jackpot.amount;
          baseWinChance = color === 'green' ? 0.05 : color === 'red' ? 0.03 : color === 'black' ? 0.01 : color === 'neon purple' ? 0.005 : 0.001;
        } else {
          await XeonBotInc.sendText(from, `❌ Invalid tier, bruv! Choose basic, pro, elite, or jackpot.`, m);
          break;
        }

        if (global.db.users[sender].coins < cost) {
          await XeonBotInc.sendText(from, `❌ Need ${cost} coins to play ${tier} lottery, bruv!`, m);
          break;
        }

        global.db.users[sender].coins -= cost;
        if (tier.toLowerCase() === 'jackpot') jackpot.amount += cost * 0.5;
        const win = Math.random() < baseWinChance;
        if (win) {
          global.db.users[sender].bank += prize;
          global.db.users[sender].lotteryWins += 1;
          if (tier.toLowerCase() === 'jackpot') jackpot.amount = 100;
          fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
          saveJackpot();
          await XeonBotInc.sendText(from, `🎉 *Jackpot!* The Dark Entity grants ${prize} coins for ${tier} (${color})! Deposited to bank.`, m);
        } else {
          fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
          saveJackpot();
          await XeonBotInc.sendText(from, `😔 No luck on ${tier} (${color}), bruv. Try again!`, m);
        }
        break;

      case 'lottery stats':
        await XeonBotInc.sendText(from, `🎲 *Lotto Stats* 🎲
Current Jackpot: ${jackpot.amount} coins
Your Wins: ${global.db.users[sender].lotteryWins}
Play with !lottery <tier> <color>`, m);
        break;

      case 'guess':
        const guess = parseInt(args[0]);
        const number = Math.floor(Math.random() * 10) + 1;
        const reward = global.db.users[sender].items.includes('Dark Sniper Scope') ? 40 : 20;
        if (guess >= 1 && guess <= 10) {
          if (guess === number) {
            global.db.users[sender].coins += reward;
            fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
            await XeonBotInc.sendText(from, `🎯 Nailed it! The number was ${number}. You win ${reward} coins!`, m);
          } else {
            const loss = global.db.users[sender].items.includes('Graffiti Vault') ? 0 : global.db.users[sender].items.includes('Neon Shield') ? 5 : 10;
            global.db.users[sender].bank = Math.max(0, global.db.users[sender].bank - loss);
            fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
            await XeonBotInc.sendText(from, `❌ Wrong! The number was ${number}. Lost ${loss} bank coins.`, m);
          }
        } else {
          await XeonBotInc.sendText(from, `🤔 Guess a number between 1 and 10, bruv!`, m);
        }
        break;

      case 'rps':
        const choices = ['rock', 'paper', 'scissors'];
        const userChoice = args.join(' ').toLowerCase();
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        const rpsReward = global.db.users[sender].items.includes('Dark Sniper Scope') ? 30 : 15;
        if (!choices.includes(userChoice)) {
          await XeonBotInc.sendText(from, `✊✋✌ Pick rock, paper, or scissors, bruv!`, m);
          break;
        }
        if (userChoice === botChoice) {
          await XeonBotInc.sendText(from, `🤝 Tie! You picked ${userChoice}, The Dark Entity picked ${botChoice}.`, m);
        } else if (
          (userChoice === 'rock' && botChoice === 'scissors') ||
          (userChoice === 'paper' && botChoice === 'rock') ||
          (userChoice === 'scissors' && botChoice === 'paper')
        ) {
          global.db.users[sender].coins += rpsReward;
          fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
          await XeonBotInc.sendText(from, `🏆 You win! You picked ${userChoice}, The Dark Entity picked ${botChoice}. +${rpsReward} coins!`, m);
        } else {
          const loss = global.db.users[sender].items.includes('Graffiti Vault') ? 0 : global.db.users[sender].items.includes('Neon Shield') ? 3 : 5;
          global.db.users[sender].bank = Math.max(0, global.db.users[sender].bank - loss);
          fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
          await XeonBotInc.sendText(from, `😔 The Dark Entity wins! You picked ${userChoice}, bot picked ${botChoice}. Lost ${loss} bank coins.`, m);
        }
        break;

      case 'trivia':
        const q = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
        const triviaReward = global.db.users[sender].items.includes('Dark Sniper Scope') ? q.reward * 2 : q.reward;
        if (!args[0]) {
          global.db.users[sender].currentTrivia = q;
          fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
          await XeonBotInc.sendText(from, `🎮 *PUBG Trivia* 🎮\n${q.question}\nReply with !trivia <answer>`, m);
        } else {
          const answer = args.join(' ').toLowerCase();
          if (!global.db.users[sender].currentTrivia) {
            await XeonBotInc.sendText(from, `❌ No trivia active, bruv! Start with !trivia`, m);
            break;
          }
          if (answer === global.db.users[sender].currentTrivia.answer.toLowerCase()) {
            global.db.users[sender].coins += triviaReward;
            fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
            await XeonBotInc.sendText(from, `🏆 Correct! You win ${triviaReward} coins!`, m);
          } else {
            const loss = global.db.users[sender].items.includes('Graffiti Vault') ? 0 : global.db.users[sender].items.includes('Neon Shield') ? 3 : 5;
            global.db.users[sender].bank = Math.max(0, global.db.users[sender].bank - loss);
            fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
            await XeonBotInc.sendText(from, `❌ Wrong! The answer was ${global.db.users[sender].currentTrivia.answer}. Lost ${loss} bank coins.`, m);
          }
          delete global.db.users[sender].currentTrivia;
          fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2));
        }
        break;

      case 'leaderboard':
        const sortedUsers = Object.entries(global.db.users)
          .map(([id, data]) => ({ id, total: data.coins + data.bank }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);
        const leaderboard = sortedUsers.map((u, i) => `${i + 1}. ${u.id.split('@')[0]}: ${u.total} coins`).join('\n');
        await XeonBotInc.sendText(from, `🏆 *Dark Entity Leaderboard* 🏆\n${leaderboard}`, m);
        break;

      case 'help':
        const help = `🔥 *The Dark Entity* by Anaky_rules 🔥
!phonk - Get a phonk vibe
!mixtape - 3-track phonk playlist (needs Phonk Mixtape)
!drop - Random PUBG drop spot
!strat - PUBG squad strat
!anaky [standard/neon/chrome] - Graffiti-style Anaky_rules art
!sticker [anaky/lazy] - Make a sticker from image/video (5 coins)
!pack - List sticker packs
!pack <name> - Send a sticker pack
!createpack <name> - Create custom sticker pack (20 coins)
!addtopack <name> - Add sticker to custom pack (5 coins)
!daily - Claim 50 daily coins
!shop - Check out the item shop
!buy <item> - Buy Neon Shield, Graffiti Vault, Phonk Mixtape, Dark Sniper Scope, or Sticker Blaster
!deposit <amount> - Stash coins in bank
!balance - Check coins, bank, and items
!lottery <tier> <color> - Play lottery (basic/pro/elite/jackpot, green/red/black/neon purple/silver chrome)
!lottery stats - Check jackpot and wins
!guess <1-10> - Guess a number, win 20 coins (40 with Dark Sniper Scope)
!rps <rock/paper/scissors> - Play for 15 coins (30 with Dark Sniper Scope)
!trivia - Start PUBG trivia, win 20-30 coins (40-60 with Dark Sniper Scope)
!leaderboard - Top 5 coin holders`;
        await XeonBotInc.sendText(from, help, m);
        break;

      default:
        if (isCmd) {
          await XeonBotInc.sendText(from, `❌ Unknown command: ${command}. Use !help for commands.`, m);
        }
    }
  } catch (err) {
    console.log(err);
    await XeonBotInc.sendText(m.chat, `❌ Error: ${err.message}`, m);
  }
};
