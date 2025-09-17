import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  let chat = global.db.data.chats[m.chat];
  let welcomeText = chat.welcome || 'Disfruta tu estancia y sigue las reglas del grupo.';
  let byeText = chat.bye || 'Esperamos que vuelvas pronto.';
  let groupSize = participants.length;

  if (m.messageStubType == 27) groupSize++;
  else if (m.messageStubType == 28 || m.messageStubType == 32) groupSize--;

  const member = m.messageStubParameters[0]
  const memberName = `@${member.split`@`[0]}`

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `
╭━─━─━─≪ ✨ BIENVENIDO/A ✨ ≫─━─━─━╮
│
│ 🌟 ¡Hola, ${memberName}!
│
│ Te damos la bienvenida al grupo:
│ *${groupMetadata.subject}*
│
│ ${welcomeText}
│
│ Ahora somos *${groupSize}* miembros.
│
│ ¡Disfruta de tu estancia! 💖
│
╰━─━─━─━─━─━─━─━─━─━─━─━─━╯
`.trim();
    conn.sendMessage(m.chat, { text: bienvenida, mentions: [member] })
  }

  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let despedida = `
╭━─━─━─≪ 💔 ADIÓS 💔 ≫─━─━─━╮
│
│ ¡Hasta pronto, ${memberName}!
│
│ ${byeText}
│
│ Ahora somos *${groupSize}* miembros.
│
│ ¡Te extrañaremos! 👋
│
╰━─━─━─━─━─━─━─━─━─━╯
`.trim();
    conn.sendMessage(m.chat, { text: despedida, mentions: [member] })
  }
}
