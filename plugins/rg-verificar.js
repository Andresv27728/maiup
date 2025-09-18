import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'
import fetch from 'node-fetch'
import moment from 'moment-timezone'

const Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  const who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender)
  const mentionedJid = [who]

  const pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://files.catbox.moe/xr2m6u.jpg')
  const user = global.db.data.users[m.sender]
  const name2 = conn.getName(m.sender)

  if (user.registered) {
    return m.reply(`『✦』Ya estás registrado.\n\n¿Quieres volver a registrarte?\nUsa *${usedPrefix}unreg* para borrar tu registro.`)
  }

  if (!Reg.test(text)) {
    return m.reply(`『✦』Formato incorrecto.\n\nUso: *${usedPrefix + command} nombre.edad*\nEjemplo: *${usedPrefix + command} ${name2}.18*`)
  }

  let [_, name, __, age] = text.match(Reg)
  if (!name) return m.reply('『✦』El nombre no puede estar vacío.')
  if (!age) return m.reply('『✦』La edad no puede estar vacía.')
  if (name.length >= 100) return m.reply('『✦』El nombre es demasiado largo.')

  age = parseInt(age)
  if (age > 1000) return m.reply('『✦』Wow, el abuelo quiere jugar con el bot.')
  if (age < 5) return m.reply('『✦』Hay un abuelo bebé jasjajajs')

  // Registro
  user.name = `${name}✓`.trim()
  user.age = age
  user.regTime = +new Date()
  user.registered = true

  user.coin += 46
  user.exp += 310
  user.joincount += 25

  const sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

  const regbot = `
╭───❍ *Registro 🌸* ❍───╮
│ ✦ 𝙐𝙨𝙪𝙖𝙧𝙞𝙤 𝙑𝙖𝙡𝙞𝙙𝙖𝙙𝙤 ✦
│
│ ᰔᩚ *Nombre:* ${name}
│ ✎ *Edad:* ${age} años
│ 🆔 *ID:* ${sn}
│
├─ 🎁 *Recompensas Recibidas:*
│ ⛁ *Monedas:* +46
│ ✰ *Experiencia:* +310
│ ❖ *Tokens:* +25
│
├─ 📢 *Verifica Tu Registro Aqui:*
│ https://chat.whatsapp.com/GHhOeix2sTY32wIO85pNgd
│
╰────────•••────────╯
> Creador: @${global.owner[0][0]}
`.trim()

  await m.react('📩')

  await conn.sendMessage(m.chat, {
    text: regbot,
    contextInfo: {
      externalAdReply: {
        title: '✧ Registro Completado ✧',
        body: 'https://chat.whatsapp.com/GHhOeix2sTY32wIO85pNgd',
        thumbnailUrl: pp,
        sourceUrl: 'https://chat.whatsapp.com/GHhOeix2sTY32wIO85pNgd',
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })

  // Enviar notificación al grupo desde el bot principal
  const grupoNotificacion = '120363399440277900@g.us'
  const mensajeNotificacion = `
╭───❍ *Nuevo Registro* ❍───╮
│ ᰔᩚ *Nombre:* ${name}
│ ✎ *Edad:* ${age} años
│ 🆔 *ID:* ${sn}
│
├─ 🎁 *Recompensas:*
│ ⛁ Monedas: +46
│ ✰ Experiencia: +310
│ ❖ Tokens: +25
│
📅 *Fecha:* ${moment().format('YYYY-MM-DD HH:mm:ss')}
╰──────────•••─────────╯`

  try {
    if (global.conn?.sendMessage) {
      const ppGroup = await conn.profilePictureUrl(who, 'image').catch(() => null)
      await global.conn.sendMessage(grupoNotificacion, {
        image: { url: ppGroup || pp },
        caption: mensajeNotificacion
      })
    }
  } catch (e) {
    console.error('Error al enviar notificación al grupo desde el bot principal:', e)
  }
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler
