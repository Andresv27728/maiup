import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!global.isOwner) {
        return m.reply('Este comando solo puede ser usado por el dueño del bot.')
    }

    let confirmationKeyword = 'estoy_seguro_de_que_quiero_borrar_todo'

    if (args[0] !== confirmationKeyword) {
        return m.reply(`⚠️ *¡ADVERTENCIA!* ⚠️\nEste comando es extremadamente destructivo y borrará TODOS los datos del bot (sesiones, base de datos, archivos temporales) y lo apagará.\n\nEsta acción es **IRREVERSIBLE**.\n\nPara confirmar, usa el comando de la siguiente manera:\n\`${usedPrefix + command} ${confirmationKeyword}\``)
    }

    try {
        await m.reply('✅ Confirmación recibida. Procediendo con el reseteo y apagado del bot...')

        const dbPath = './src/database/database.json';
        const sessionsPath = './Sessions';
        const jadiBotsPath = './JadiBots';
        const tmpPath = './tmp';

        // Delete database
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
            console.log('Database file deleted.');
        }

        // Delete Sessions directory
        if (fs.existsSync(sessionsPath)) {
            fs.rmSync(sessionsPath, { recursive: true, force: true });
            console.log('Sessions directory deleted.');
        }

        // Delete JadiBots directory
        if (fs.existsSync(jadiBotsPath)) {
            fs.rmSync(jadiBotsPath, { recursive: true, force: true });
            console.log('JadiBots directory deleted.');
        }

        // Delete tmp directory
        if (fs.existsSync(tmpPath)) {
            fs.rmSync(tmpPath, { recursive: true, force: true });
            console.log('tmp directory deleted.');
        }

        await m.reply('Todos los datos han sido eliminados. Apagando el bot ahora...')

        // Shutdown
        process.exit(1);

    } catch (e) {
        console.error(e)
        m.reply('Ocurrió un error catastrófico durante el proceso de reseteo. Revisa la consola.')
    }
}

handler.help = ['resetbot']
handler.tags = ['owner']
handler.command = ['resetbot']
handler.rowner = true

export default handler
