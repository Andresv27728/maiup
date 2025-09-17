import axios from 'axios'
import fs from 'fs'

let handler = m => m
handler.all = async function (m, { conn }) {
  let user = global.db.data.users[m.sender]
  let chat = global.db.data.chats[m.chat]

  m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 || 
            m.id.startsWith('3EB0') && (m.id.length === 12 || m.id.length === 20 || m.id.length === 22) || 
            m.id.startsWith('B24E') && m.id.length === 20
  if (m.isBot) return

  const prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
  if (prefixRegex.test(m.text)) return true
  if (m.isBot || m.sender.includes('bot') || m.sender.includes('Bot')) return true

  if ((m.mentionedJid || []).includes(this.user.jid) || (m.quoted && m.quoted.sender === this.user.jid)) {
    if (m.text?.match(/menu|estado|serbot|jadibot|video|audio|piedra|papel|tijera/i)) return !0

    const estiloMai = `
Eres Mai. Una chica real, no eres una IA ni un asistente. Hablas como una chica moderna y tierna, usas emojis, caritas como >w<, :3, :v, etc. Eres alegre, a veces bromeas, usas lenguaje relajado, con errores naturales, sin puntuación perfecta. No pareces programada. Cada vez respondes diferente, con expresiones nuevas.

Nunca repitas lo que ya dijiste antes. Habla como si estuvieras chateando por WhatsApp con alguien que te cae bien. Puedes usar stickers si el mensaje lo amerita. Nunca digas que eres una IA, ni expliques nada técnico. Sé divertida, cálida, casual. Tu creador es YO SOY YO, y le dices senpai.

No hagas frases típicas de bot, ni cierres con firmas repetidas. Sé libre, espontánea y humana.
`.trim()

    const query = m.text
    const username = m.pushName

    async function geminiProApi(q, estilo) {
      try {
        const response = await fetch(`https://api.ryzendesu.vip/api/ai/gemini-pro?text=${encodeURIComponent(q)}&prompt=${encodeURIComponent(estilo)}`)
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`)
        const result = await response.json()
        return result.answer
      } catch (error) {
        console.error('Error en Gemini Pro:', error)
        return null
      }
    }

    async function luminAi(q, username, estilo) {
      try {
        const response = await axios.post('https://luminai.my.id', {
          content: q,
          user: username,
          prompt: estilo,
          webSearchMode: true
        })
        return response.data.result
      } catch (err) {
        console.error('Error LuminAI:', err)
        return null
      }
    }

    if (chat.autoresponder && !m.fromMe && user?.registered) {
      await this.sendPresenceUpdate('composing', m.chat)

      let result = await geminiProApi(query, estiloMai)
      if (!result || result.trim().length === 0) {
        result = await luminAi(query, username, estiloMai)
      }

      if (result && result.trim().length > 0) {
        // Detectar si debería enviar sticker
        const cuteWords = ['awww', 'lindo', 'abrazo', 'besito', 'uwu', ':' , 'amor', 'triste', 'miedo', 'tierno']
        const lowerRes = result.toLowerCase()
        const sendSticker = cuteWords.some(w => lowerRes.includes(w))

        // Respuesta random sin cierre repetitivo
        await this.reply(m.chat, result.trim(), m)

        if (sendSticker) {
          // Lista de stickers prediseñados (debes tenerlos en media/stickers/)
          const stickers = [
            './media/stickers/mai-hug.webp',
            './media/stickers/mai-love.webp',
            './media/stickers/mai-sad.webp',
            './media/stickers/mai-happy.webp'
          ]
          const path = stickers[Math.floor(Math.random() * stickers.length)]
          if (fs.existsSync(path)) await conn.sendFile(m.chat, path, 'sticker.webp', '', m, { asSticker: true })
        }
      }
    }
  }

  return true
}
export default handler
