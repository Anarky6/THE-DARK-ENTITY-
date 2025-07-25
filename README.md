The Dark Entity
A neon-charged WhatsApp chatbot by Anarky6, dripping with phonk vibes and graffiti flair. Built with Baileys and Node.js, The Dark Entity brings the heat with PUBG-inspired commands, mini-games, a lottery system, sticker packs, and a coin-based economy. Perfect for the Lazy Killers squad or anyone vibing with the Anaky_rules aesthetic.
Features

🎵 Phonk Vibes: Drop !phonk for phonk track recommendations or !mixtape for a 3-track playlist (requires Phonk Mixtape item).
🎮 PUBG Mode: Use !drop for random drop spots and !strat for squad tips.
🖌️ Graffiti Art: Type !anaky [standard/neon/chrome] for Anaky_rules graffiti-style ASCII art.
🖼️ Sticker Packs:
!sticker [anaky/lazy]: Convert a replied image/video into a sticker with optional graffiti text.
!pack: List available sticker packs (Anaky Graffiti, Phonk Vibes, PUBG Kills, or custom).
!pack <name>: Send a sticker pack.
!createpack <name>: Create a custom pack (20 coins).
!addtopack <name>: Add a sticker to a custom pack (5 coins, free with Sticker Blaster).


💰 Economy: Earn 50 daily coins with !daily, deposit to your bank with !deposit <amount>, and check with !balance.
🛒 Item Shop: Buy items with !buy <item> to protect your bank or enhance gameplay:
Neon Shield (100 coins): 50% bank protection.
Graffiti Vault (200 coins): 100% bank protection.
Phonk Mixtape (150 coins): Unlocks !mixtape.
Dark Sniper Scope (400 coins): Doubles mini-game rewards.
Sticker Blaster (250 coins): Free sticker/pack creation.


🎰 Lottery: Play with !lottery <tier> <color> (basic/pro/elite/jackpot, green/red/black/neon purple/chrome silver). Check !lottery stats for jackpot size.
🎲 Mini-Games:
!guess <1-10>: Guess the number, win 20 coins (40 with Dark Sniper Scope).
!rps <rock/paper/scissors>: Play for 15 coins (30 with Dark Sniper Scope).
!trivia: Answer PUBG questions, win 25 coins (50 with Dark Sniper Scope).


🏆 Leaderboard: See top coin holders with !leaderboard.
📜 Help: Run !help for all commands.

Setup for Deployment
Prerequisites

Node.js
Git
WhatsApp number for QR code authentication
Dependencies: ffmpeg, libwebp, imagemagick (for stickers and media)

Clone Repo & Install Dependencies
git clone https://github.com/Anarky6/The-Dark-Entity
cd The-Dark-Entity
npm install
npm install fluent-ffmpeg sharp

Install Additional Dependencies
For media features (stickers, images):
apt update
apt upgrade
apt install ffmpeg libwebp imagemagick -y

Run the Bot
npm start

Scan the QR code displayed in the terminal to authenticate with WhatsApp.
Deploy on Heroku

Fork or clone this repo.
Create a Heroku app and add these buildpacks:https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest
https://github.com/clhuang/heroku-buildpack-webp-binaries.git


Deploy via Heroku CLI or GitHub integration.
Set environment variables (e.g., for Spotify API if used).

Run 24/7 on Termux
npm i -g pm2
pm2 start index.js
pm2 save
pm2 logs

Run on VPS
apt install nodejs git ffmpeg libwebp imagemagick -y
git clone https://github.com/Anarky6/The-Dark-Entity
cd The-Dark-Entity
npm install
npm start

Customization

Phonk Integration: Add your Spotify API keys (from PhonkScope) to the phonkTracks logic in index.js for real track data.
Stickers: Add pre-made stickers to the stickers folder and update stickerPacks in index.js.
More Games: Extend index.js with new mini-games or items.
Database: Swap users.json and jackpot.json for SQLite/MongoDB for larger groups.

Contributing
Pull requests are welcome! Add new features, fix bugs, or enhance the neon-graffiti vibe. Star the repo if you’re feeling the Anaky_rules energy! 😎
License
MIT License © 2025 Anarky6
