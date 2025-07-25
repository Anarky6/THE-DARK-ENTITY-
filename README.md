The Dark Entity WhatsApp Bot
A neon-charged WhatsApp bot with sticker packs, economy system, lottery, mini-games, and PUBG/phonk-themed commands. Built by Anarky6 with a graffiti-inspired vibe. 😈
Features

Sticker Packs: Create and send custom stickers with neon effects (!sticker, !pack, !createpack, !addtopack).
Economy: Earn coins via daily rewards and mini-games, deposit to bank, and buy items (!daily, !deposit, !shop, !buy, !balance).
Lottery: Play tiered lotteries with increasing jackpots (!lottery, !lottery stats).
Mini-Games: Play Guess the Number, Rock-Paper-Scissors, and PUBG Trivia (!guess, !rps, !trivia).
Leaderboard: Check top coin holders (!leaderboard).
Phonk Vibes: Get phonk track recommendations and playlists (!phonk, !mixtape).
PUBG Commands: Random drop spots and strategies (!drop, !strat).
Graffiti Art: Generate "Anaky_rules" in neon or chrome styles (!anaky).

Prerequisites

Node.js (v14+)
WhatsApp Account (for scanning QR code)
FFmpeg (for sticker creation)
Git

Setup

Clone the Repo:git clone https://github.com/Anarky6/THE-DARK-ENTITY-.git
cd THE-DARK-ENTITY-


Install Dependencies:npm install


Install FFmpeg:
Ubuntu: sudo apt-get install ffmpeg
Windows/Mac: Download from FFmpeg website


Add Stickers:
Place .webp stickers in stickers/anaky graffiti/, stickers/phonk vibes/, and stickers/pubg kills/.
Ensure stickers are 512x512 pixels and <300KB.


Update Owner:
Edit database/owner.json with your WhatsApp number (format: "your_number@s.whatsapp.net").


Run the Bot:npm start


Scan the QR code with your WhatsApp app to authenticate.



Commands
Run !help in WhatsApp for a full command list.
Deployment

Local: Run npm start on a VPS or local machine.
Heroku:
Create a Heroku app: heroku create your-app-name.
Add FFmpeg buildpack: heroku buildpacks:add https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git.
Push to Heroku: git push heroku main.
Scale dyno: heroku ps:scale web=1.


Replit:
Import repo to Replit.
Install FFmpeg via Replit’s package manager.
Run npm start.



Testing

Test core commands (!help, !phonk, !drop, !anaky).
Test sticker commands (!sticker, !pack) with images/videos.
Test economy (!daily, !deposit, !shop, !buy, !balance).
Test lottery (!lottery basic green, !lottery stats).
Test mini-games (!guess 5, !rps rock, !trivia).
Test leaderboard (!leaderboard).

Contributing

Fork the repo, create a branch, and submit a pull request.
Add new commands or sticker packs to XeonCheems8.js.

License
MIT License © Anarky6
