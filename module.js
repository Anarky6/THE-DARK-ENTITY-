const { WAConnection, MessageType, Mimetype } = require('@whiskeysockets/baileys');
const fs = require('fs');
const chalk = require('chalk');
const figlet = require('figlet');
const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');
const path = require('path');

module.exports = {
  modul: {
    fs,
    chalk,
    figlet,
    ffmpeg,
    sharp,
    path
  }
};
