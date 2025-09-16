let handler = async (m, { conn }) => {
  let user = m.sender
  let name = conn.getName(user)
  let number = user.split('@')[0]

  let text = `
*Tu Información:*
*Nombre:* ${name}
*Número:* ${number}
`.trim()

  await conn.reply(m.chat, text, m)
}
handler.help = ['lid']
handler.tags = ['info']
handler.command = ['lid']

export default handler
