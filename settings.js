import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'

// ✿━━━━━━✿•°:°•✿━━━━━━✿ XD

global.botNumber = ''

global.owner = [
  ['50493732693', '♡ Wirk ♡', true],
  ['573133374132', 'yo soy yo', true],
  ['529721211672', 'miku', false],
  ['', '', false],
  ['', '', false],
  ['', '', false],
  ['', '', false],
  ['', '', false],
  ['', '', false],
  ['', '', false],
  ['', '', false],
  ['', '', false]
]

global.mods = []
global.suittag = ['']
global.prems = []

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16'
global.languaje = 'Español'
global.vs = '2.2.0'
global.nameqr = 'MaiBot-MD'
global.namebot = 'HATSUNE MIKU'
global.sessions = 'Sessions'
global.jadi = 'JadiBots'
global.yukiJadibts = true

global.packname = '🌸 Mᴀɪ • Bᴏᴛ 🌸'
global.botname = 'HATSUNE MIKU'
global.wm = '💫 ᴘʀᴏᴄᴇssᴇᴅ ʙʏ MIKU-ʙᴏᴛ💫'
global.author = 'MIKU'
global.dev = 'YO SOY YO'
global.textbot = '💖 MIKU-Bᴏᴛ'
global.etiqueta = 'HATSUNE MIKU'

global.moneda = 'MimiCoins🫦'
global.welcom1 = '⌗ Usa *setwelcome* para editar este mensaje'
global.welcom2 = '⌗ Usa *setbye* para editar este mensaje'
global.banner = 'https://files.catbox.moe/36xbc8.jpg'
global.avatar = 'https://qu.ax/oBByS.jpg'

global.gp1 = 'https://chat.whatsapp.com/GBcSWbfm3JO1HhmbdbnrsH'
global.comunidad1 = 'https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY'
global.channel = 'https://whatsapp.com/channel/0029Vb5UfTC4CrfeKSamhp1f'
global.channel2 = global.channel
global.md = ''
global.correo = ''
global.cn = global.channel

global.catalogo = fs.readFileSync('./src/catalogo.jpg')
global.estilo = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net',
    ...(false ? { remoteJid: '5219992095479-1625305606@g.us' } : {})
  },
  message: {
    orderMessage: {
      itemCount: -999999999,
      status: 1,
      surface: 1,
      message: global.packname,
      orderTitle: 'MaiBot',
      thumbnail: global.catalogo,
      sellerJid: '0@s.whatsapp.net'
    }
  }
}
global.ch = {
  ch1: '120363402846939411@newsletter'
}

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment

global.rpg = {
  emoticon(string) {
    string = string.toLowerCase()
    const emot = {
      level: '🌟 Nivel',
      coin: '💸 Coin',
      exp: '🌻 Exp',
      bank: '🏦 Banco',
      diamond: '💎 Diamante',
      health: '❤️ Salud',
      kyubi: '🌀 Magia',
      joincount: '💰 Token',
      emerald: '♦️ Esmeralda',
      stamina: '⚡ Energía',
      role: '⚜️ Rango',
      premium: '🎟️ Premium',
      pointxp: '📧 Puntos Exp',
      gold: '👑 Oro',
      iron: '⛓️ Hierro',
      coal: '🌑 Carbón',
      stone: '🪨 Piedra',
      potion: '🥤 Poción'
    }
    const results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
    return results.length ? emot[results[0][0]] : ''
  }
}

global.rpgg = {
  emoticon(string) {
    string = string.toLowerCase()
    const emott = {
      level: '🌟',
      coin: '💸',
      exp: '✨',
      bank: '🏦',
      diamond: '💎',
      health: '❤️',
      kyubi: '🌀',
      joincount: '💰',
      emerald: '♦️',
      stamina: '⚡',
      role: '⚜️',
      premium: '🎟️',
      pointxp: '📧',
      gold: '👑',
      iron: '⛓️',
      coal: '🌑',
      stone: '🪨',
      potion: '🥤'
    }
    const results = Object.keys(emott).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
    return results.length ? emott[results[0][0]] : ''
  }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("✿ Archivo 'settings.js' actualizado ✿"))
  import(`${file}?update=${Date.now()}`)
})
