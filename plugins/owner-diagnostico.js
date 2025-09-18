import { performance } from 'perf_hooks'

let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) {
        return m.reply('Este comando solo puede ser usado por el dueño del bot.')
    }

    await m.reply('Iniciando diagnóstico... Esto puede tardar un momento.')

    let results = []
    const plugins = Object.entries(global.plugins).filter(([name, plugin]) => plugin.command && !plugin.disabled)

    for (const [name, plugin] of plugins) {
        const command = Array.isArray(plugin.command) ? plugin.command[0] : plugin.command
        if (!command || command === 'diagnostico') continue

        const mock_m = {
            chat: m.chat,
            sender: conn.user.jid,
            isGroup: m.isGroup,
            fromMe: true,
            reply: () => {},
            react: () => {}
        }

        const mock_extra = {
            command: command,
            text: '',
            args: [],
            usedPrefix: '.',
            conn: conn,
            participants: [],
            groupMetadata: {},
            user: {},
            bot: {},
            isROwner: true,
            isOwner: true,
            isAdmin: true,
            isBotAdmin: true,
            isPrems: true,
            chatUpdate: {}
        }

        try {
            const startTime = performance.now()
            await plugin.call(conn, mock_m, mock_extra)
            const endTime = performance.now()
            const timeTaken = (endTime - startTime).toFixed(2)
            results.push(`✅ *${command}* - ${timeTaken} ms`)
        } catch (e) {
            results.push(`❌ *${command}* - ERROR: ${e.message}`)
        }
    }

    let report = `*--- Reporte de Diagnóstico ---*\n\n`
    report += results.join('\n')

    m.reply(report)
}

handler.help = ['diagnostico']
handler.tags = ['owner']
handler.command = ['diagnostico']
handler.rowner = true

export default handler
