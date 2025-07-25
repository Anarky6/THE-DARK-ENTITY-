const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const { Buffer, proto } = require('@whiskeysockets/baileys');

function smsg(conn, m, store) {
  if (!m) return m;
  let M = proto.WebMessageInfo;
  if (m.key) {
    m.id = m.key.id;
    m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
    m.chat = m.key.remoteJid;
    m.fromMe = m.key.fromMe;
    m.isGroup = m.chat.endsWith('@g.us');
    m.sender = conn.decodeJid(m.fromMe && conn.user.id || m.key.participant || m.key.remoteJid || m.chat);
  }
  if (m.message) {
    m.mtype = Object.keys(m.message)[0];
    m.msg = m.message[m.mtype];
    if (m.mtype === 'ephemeralMessage') {
      m.mtype = Object.keys(m.msg)[0];
      m.msg = m.msg[m.mtype];
    }
    if (m.mtype === 'viewOnceMessage') {
      m.mtype = Object.keys(m.msg)[0];
      m.msg = m.msg[m.mtype];
    }
    m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype === 'listResponseMessage' && m.msg.singleSelectReply.selectedRowId) || (m.mtype === 'buttonsResponseMessage' && m.msg.selectedButtonId) || '';
  }
  return m;
}

async function getBuffer(url, options) {
  try {
    options ? options : {};
    const res = await axios({
      method: "get",
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1
      },
      ...options,
      responseType: 'arraybuffer'
    });
    return res.data;
  } catch (e) {
    console.log(`Error : ${e}`);
  }
}

const isUrl = (url) => {
  return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
};

async function fetchJson(url, options) {
  try {
    options ? options : {};
    const res = await axios({
      method: 'GET',
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
      },
      ...options
    });
    return res.data;
  } catch (err) {
    return err;
  }
}

function generateMessageTag(prefix) {
  let id = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 12; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length)));
  }
  return `${prefix}${id}`;
}

async function getSizeMedia(media) {
  if (Buffer.isBuffer(media)) {
    return media.length;
  }
  if (/^data:.*?\/.*?;base64,/i.test(media)) {
    return Buffer.from(media.split(',')[1], 'base64').length;
  }
  if (/^https?:\/\//.test(media)) {
    const { headers } = await axios.head(media);
    return parseInt(headers['content-length']);
  }
  if (fs.existsSync(media)) {
    return fs.statSync(media).size;
  }
  return 0;
}

async function reSize(buffer, ukur1, ukur2) {
  return new Promise((resolve, reject) => {
    require('sharp')(buffer)
      .resize(ukur1, ukur2)
      .toBuffer()
      .then(resolve)
      .catch(reject);
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  smsg,
  getBuffer,
  isUrl,
  fetchJson,
  generateMessageTag,
  getSizeMedia,
  reSize,
  sleep
};
