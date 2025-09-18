let handler = async (m, { conn, usedPrefix, command }) => {
    // Permission Check
    const isOwner = global.owner.map(v => v[0] + '@s.whatsapp.net').includes(m.sender)
    const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat).catch(_ => {}) : {}
    const participants = m.isGroup ? groupMetadata.participants : []
    const user = m.isGroup ? participants.find(u => u.id === m.sender) : {}
    const isAdmin = user.admin === 'admin' || user.admin === 'superadmin' || isOwner

    if (!isAdmin) {
        return m.reply('Este comando solo puede ser usado por administradores del grupo o el dueño del bot.')
    }

    // Logic
    let chat = global.db.data.chats[m.chat]
    if (chat && chat.usePrefix) {
        chat.usePrefix = false
        chat.prefix = '' // Reset prefix
        m.reply('El prefijo ha sido eliminado. El bot ahora responderá a comandos sin prefijo.')
    } else {
        m.reply('El modo sin prefijo ya está activado. No hay un prefijo personalizado que eliminar.')
    }
}

handler.help = ['delprefix']
handler.tags = ['config']
handler.command = ['delprefix']
handler.group = true

export default handler
