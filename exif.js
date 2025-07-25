const fs = require('fs');
const { BufferJSON, WA_DEFAULT_EPHEMERAL, proto } = require('@whiskeysockets/baileys');
const { getBuffer } = require('./myfunc');

const imageToWebp = async (media) => {
  const tmpFileOut = `./stickers/${Math.random().toString(36)}.webp`;
  const tmpFileIn = `./stickers/${Math.random().toString(36)}.jpg`;
  fs.writeFileSync(tmpFileIn, media);
  await new Promise((resolve, reject) => {
    require('fluent-ffmpeg')(tmpFileIn)
      .toFormat('webp')
      .save(tmpFileOut)
      .on('end', resolve)
      .on('error', reject);
  });
  const buff = fs.readFileSync(tmpFileOut);
  fs.unlinkSync(tmpFileIn);
  fs.unlinkSync(tmpFileOut);
  return buff;
};

const videoToWebp = async (media) => {
  const tmpFileOut = `./stickers/${Math.random().toString(36)}.webp`;
  const tmpFileIn = `./stickers/${Math.random().toString(36)}.mp4`;
  fs.writeFileSync(tmpFileIn, media);
  await new Promise((resolve, reject) => {
    require('fluent-ffmpeg')(tmpFileIn)
      .toFormat('webp')
      .save(tmpFileOut)
      .on('end', resolve)
      .on('error', reject);
  });
  const buff = fs.readFileSync(tmpFileOut);
  fs.unlinkSync(tmpFileIn);
  fs.unlinkSync(tmpFileOut);
  return buff;
};

const writeExifImg = async (media, metadata) => {
  let wMedia = await imageToWebp(media);
  const tmpFileIn = `./stickers/${Math.random().toString(36)}.webp`;
  const tmpFileOut = `./stickers/${Math.random().toString(36)}.webp`;
  fs.writeFileSync(tmpFileIn, wMedia);
  const img = await require('sharp')(tmpFileIn).metadata();
  const exif = Buffer.from([
    0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41,
    0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00
  ]);
  const exifData = {
    packname: metadata.packname || 'The Dark Entity',
    author: metadata.author || 'Anaky_rules'
  };
  const json = JSON.stringify(exifData);
  const exifBuffer = Buffer.concat([exif, Buffer.from(json)]);
  fs.writeFileSync(tmpFileOut, exifBuffer);
  const buff = fs.readFileSync(tmpFileOut);
  fs.unlinkSync(tmpFileIn);
  fs.unlinkSync(tmpFileOut);
  return buff;
};

const writeExifVid = async (media, metadata) => {
  let wMedia = await videoToWebp(media);
  const tmpFileIn = `./stickers/${Math.random().toString(36)}.webp`;
  const tmpFileOut = `./stickers/${Math.random().toString(36)}\webp`;
  fs.writeFileSync(tmpFileIn, wMedia);
  const vid = await require('sharp')(tmpFileIn).metadata();
  const exif = Buffer.from([
    0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41,
    0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00
  ]);
  const exifData = {
    packname: metadata.packname || 'The Dark Entity',
    author: metadata.author || 'Anaky_rules'
  };
  const json = JSON.stringify(exifData);
  const exifBuffer = Buffer.concat([exif, Buffer.from(json)]);
  fs.writeFileSync(tmpFileOut, exifBuffer);
  const buff = fs.readFileSync(tmpFileOut);
  fs.unlinkSync(tmpFileIn);
  fs.unlinkSync(tmpFileOut);
  return buff;
};

module.exports = { imageToWebp, videoToWebp, writeExifImg, writeExifVid };
