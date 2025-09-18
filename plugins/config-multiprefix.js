let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Permission Check
    const isOwner = global.owner.map(v => v[0] + '@s.whatsapp.net').includes(m.sender)
    const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat).catch(_ => {}) : {}
    const participants = m.isGroup ? groupMetadata.participants : []
    const user = m.isGroup ? participants.find(u => u.id === m.sender) : {}
    const isAdmin = user.admin === 'admin' || user.admin === 'superadmin' || isOwner

    if (!isAdmin) {
        return m.reply('Este comando solo puede ser usado por administradores del grupo o el dueño del bot.')
    }

    let chat = global.db.data.chats[m.chat]
    if (!chat) {
        global.db.data.chats[m.chat] = {}
        chat = global.db.data.chats[m.chat]
    }

    if (args[0] === 'on') {
        chat.multiprefix = true
        m.reply('El modo multiprefijo ha sido activado. El bot ahora responderá a los prefijos por defecto.')
    } else if (args[0] === 'off') {
        chat.multiprefix = false
        m.reply('El modo multiprefijo ha sido desactivado.')
    } else {
        m.reply(`Usa ${usedPrefix + command} on/off para activar o desactivar el modo multiprefijo.`)
    }
}

handler.help = ['multiprefix <on/off>']
handler.tags = ['config']
handler.command = ['multiprefix']
handler.group = true

export default handler
