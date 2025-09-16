import { promises } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

let handler = async (m, { conn, usedPrefix: _p, args, command }) => {
  let userId = m.sender
  let user = global.db.data.users[userId]
  let name = conn.getName(userId)
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length
  let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

  const decorations = [
    { header: '╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴✧ *%category* ✧╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜', footer: '╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ' },
    { header: '╭─┅──┅──┅──┅──┅──┅─╮\n│-ˋˏ *%category* ˎˊ-', footer: '╰─┅──┅──┅──┅──┅──┅─╯' },
    { header: '╔═══*.·:·.☽✧    ✦    ✧☾.·:·.*═══╗\n\n            *%category*', footer: '╚═══*.·:·.☽✧    ✦    ✧☾.·:·.*═══╝' },
    { header: '╭───────────\n│-> *%category*', footer: '╰───────────' },
    { header: '┏━━◨ *%category* ◧━━┓', footer: '┗━━◨ - - - - - - ◧━━┛' },
    { header: '✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧\n\n           *%category*', footer: '✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧' },
    { header: '┌─── · 。ﾟ☆: *.☽ .* :☆ﾟ. ───┐\n\n              *%category*', footer: '└─── · 。ﾟ☆: *.☽ .* :☆ﾟ. ───┘' },
    { header: '╔════ ≪ •❈• ≫ ════╗\n\n            *%category*', footer: '╚════ ≪ •❈• ≫ ════╝' },
    { header: '╔.★. .════════════════. .★.╗\n\n                 *%category*', footer: '╚.★. .════════════════. .★.╝' },
    { header: '»»-----------► *%category* ◄-----------««', footer: '»»-----------► - - - - - ◄-----------««' }
  ];

  let help = Object.values(global.plugins)
    .filter(plugin => !plugin.disabled && plugin.help && plugin.tags)
    .map(plugin => {
    return {
      help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
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

  let menu = Object.entries(groups)
    .map(([tag, plugins]) => {
      return {
        tag: tag,
        plugins: plugins.map(plugin => {
          return {
            ...plugin,
            help: plugin.help,
            prefix: plugin.prefix ? '(Sin prefijo)' : _p,
          }
        }),
      }
    })
    .filter(menu => menu.tag !== 'main' && menu.tag !== 'owner')

  let txt = `
̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮

︶•︶°︶•︶°︶•︶°︶•︶°︶•︶°︶
> ᰔᩚ Hola! @${userId.split('@')[0]}, Soy *Mai*, Aquí tienes la lista de comandos.\n*(˶ᵔ ᵕ ᵔ˶)*

*╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ؕ͜─ׄ͜─֬͜─֟͜─֫͜─ׄ͜─ؕ͜─݊͜┈ࠦ͜┅ࠡ͜͜┈࠭͜͜۰۰͜۰*
│✧ *Modo* » ${conn.user.jid == global.conn.user.jid ? 'Bot Principal' : 'Sub-Bot'}
│✦ *Bot* » ${user.premium ? 'Prem Bot 🅑' : 'Free Bot'}
│ⴵ *Activada* » ${uptime}
│✰ *Usuarios* » ${totalreg}
│✐︎ *Plugins* » ${totalCommands}
│⚘ *Versión* » \`^2.3.0\`
│🜸 *Baileys* » Multi Device
*╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ  ⋮֔   ᩴ ⋰╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ*
> ✿ Crea un *Sub-Bot* con tu número utilizando *#qr* o *#code*
‧꒷︶꒷꒥꒷‧₊˚꒷︶꒷꒥꒷︶꒷˚₊‧꒷꒥꒷︶꒷‧
`

  for (let item of menu) {
    const randomDecoration = decorations[Math.floor(Math.random() * decorations.length)];
    txt += `\n${randomDecoration.header.replace('%category', item.tag.toUpperCase())}\n`
    for (let plugin of item.plugins) {
      txt += `✦ *${plugin.prefix}${plugin.help}*\n`
    }
    txt += `${randomDecoration.footer}\n`
  }

  txt += `\n> *© ⍴᥆ᥕᥱrᥱძ ᑲᥡ wirksito*`

  await conn.sendMessage(m.chat, {
    text: txt.trim(),
    contextInfo: {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363371008200788@newsletter',
        newsletterName: 'The Kantu Bot ⚡',
        serverMessageId: -1,
      },
      forwardingScore: 16,
      externalAdReply: {
        title: "♦ Mai ♦ World Of Cute",
        body: "➤ Powered By Wirk ★",
        thumbnailUrl: "https://files.catbox.moe/36xbc8.jpg",
        sourceUrl: "https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY",
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
}

handler.help = ['menu2']
handler.tags = ['main']
handler.command = ['menu2', 'menú2']

export default handler

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor((ms % 3600000) / 60000);
    let s = Math.floor((ms % 60000) / 1000);
    let parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);

    return parts.join(' ');
}
