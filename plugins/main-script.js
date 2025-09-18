const handler = async (m, { conn }) => {
  const texto = `
🌸 _*${global.botname} Sc*_ 🌸

\`\`\`Repositorio OFC:\`\`\`
https://github.com/Wilsmac/Fantasy-Bot-MD

> 🌻 Deja tu estrellita ayudaría mucho :D

🔗 *Comunidad Oficial:* https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY
  `.trim()

  await conn.reply(m.chat, texto, m)
}

handler.help = ['script']
handler.tags = ['info']
handler.command = ['script']

export default handler
