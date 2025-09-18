let handler = async (m, { conn, args, usedPrefix, command }) => {
    const isOwner = global.owner.map(v => v[0] + '@s.whatsapp.net').includes(m.sender)
    const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat).catch(_ => {}) : {}
    const participants = m.isGroup ? groupMetadata.participants : []
    const user = m.isGroup ? participants.find(u => u.id === m.sender) : {}
    const isAdmin = user.admin === 'admin' || user.admin === 'superadmin' || isOwner

    if (!isAdmin) {
        return m.reply('Este comando solo puede ser usado por administradores del grupo o el dueño del bot.')
    }

    if (!args[0]) {
        return m.reply(`Debes proporcionar un prefijo. Ejemplo: ${usedPrefix + command} !`)
    }

    let chat = global.db.data.chats[m.chat]
    if (!chat) {
        global.db.data.chats[m.chat] = {}
        chat = global.db.data.chats[m.chat]
    }

    chat.prefix = args[0]
    chat.usePrefix = true

    m.reply(`El prefijo para este chat ha sido cambiado a: *${args[0]}*\nEl modo "sin prefijo" ha sido desactivado.`)
}

handler.help = ['setprefix <prefijo>']
handler.tags = ['config']
handler.command = ['setprefix']
handler.group = true

export default handler
