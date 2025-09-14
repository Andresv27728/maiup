import { promises } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

let handler = async (m, { conn, usedPrefix: _p, args, command }) => {
  const anony = {
    "anonymous": "https://telegra.ph/file/c3f44feb24c7757360215.jpg",
  };

  const datas = global
  const items = {}
  const totalCommands = Object.values(global.plugins).filter(p => !p.disabled).length
  const defaultMenu = {
    before: `
╭─「 %me 」
│▸▸
│▸ *Version:* %version
│▸ *Usuarios:* %totalreg
│▸ *Tiempo Activo:* %uptime
│▸ *Comandos:* ${totalCommands}
│▸▸
╰─「 *By %author* 」

%readmore
`.trimStart(),
    header: '╭─「 %category 」',
    body: '│▸ %cmd %islimit %isPremium',
    footer: '╰────\n',
    after: ``,
  }

  let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
  let { exp, limit, level, role } = global.db.data.users[m.sender]
  let { min, xp, max } = xpRange(level, global.multiplier)
  let name = await conn.getName(m.sender)
  let d = new Date(new Date + 3600000)
  let locale = 'es'
  let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
  let week = d.toLocaleDateString(locale, { weekday: 'long' })
  let date = d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(d)
  let time = d.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  })
  let _uptime = process.uptime() * 1000
  let _muptime
  if (process.send) {
    process.send('uptime')
    _muptime = await new Promise(resolve => {
      process.once('message', resolve)
      setTimeout(resolve, 1000)
    }) * 1000
  }
  let muptime = clockString(_muptime)
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length
  let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
  let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
    return {
      help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      prefix: 'customPrefix' in plugin,
      limit: plugin.limit,
      premium: plugin.premium,
      enabled: !plugin.disabled,
    }
  })
  let groups = {}
  for (let plugin of help)
    if (plugin.tags && plugin.tags.length)
      for (let tag of plugin.tags)
        if (!(tag in groups))
          groups[tag] = []
  for (let plugin of help)
    if (plugin.tags && plugin.tags.length)
      for (let tag of plugin.tags)
        if (tag in groups)
          for (let help of plugin.help)
            if (help)
              groups[tag].push({
                help,
                ...plugin
              })
  let menu = Object.entries(groups).map(([tag, plugins]) => {
    return {
      tag,
      plugins: plugins.map(plugin => {
        return {
          ...plugin,
          help: plugin.help,
          prefix: plugin.prefix ? '(Sin prefijo)' : _p,
        }
      })
    }
  })

  let text = `*MENÚ DINÁMICO*\n\n` + menu.map(item => {
    return `*${item.tag.toUpperCase()}*\n` + item.plugins.map(plugin => {
      return `  - ${_p}${plugin.help}`
    }).join('\n')
  }).join('\n\n')

  const fkontak = {
    "key": {
      "participants": "0@s.whatsapp.net",
      "remoteJid": "status@broadcast",
      "fromMe": false,
      "id": "Halo"
    },
    "message": {
      "contactMessage": {
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:;${name};;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  }

  await conn.reply(m.chat, text, fkontak)
}

handler.help = ['menu2']
handler.tags = ['main']
handler.command = ['menu2', 'menú2']

export default handler

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function xpRange(level, multiplier) {
    if (level < 0) return { min: 0, max: 0 }
    let min = Math.round(Math.pow(level, 2) * multiplier)
    let max = Math.round(Math.pow(level + 1, 2) * multiplier)
    return { min, max }
}
