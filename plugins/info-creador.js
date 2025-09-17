import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
    await m.react('👑');

    let owners = global.owner.filter(([_, name, isCreator]) => isCreator);
    if (!owners.length) {
        return conn.reply(m.chat, 'No se han configurado los creadores del bot.', m);
    }

    let ownerList = owners.map(([number, name]) => {
        return {
            displayName: `${name} - Creador de ${global.botname}`,
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name} - Bot Developer\nitem1.TEL;waid=${number}:${number}\nitem1.X-ABLabel:Número\nEND:VCARD`
        };
    });

    const imageUrl = 'https://qu.ax/VnCGk.jpg'; // This can be customized
    let ownerText = `╭───────❀\n│ *Contacto de los creadores*\n╰───────❀\n\n`;

    owners.forEach(([number, name]) => {
        ownerText += `• *Nombre:* ${name}\n`;
        ownerText += `• *Número:* https://wa.me/${number}\n`;
        ownerText += `• *Creador de:* ${global.botname}\n\n`;
    });

    ownerText += `_“El código es temporal, pero la creatividad... esa es eterna.”_\n\nPuedes contactarlos si tienes ideas, bugs o quieres apoyar el proyecto.`;

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: `${ownerList.length} Creador(es)`,
            contacts: ownerList
        },
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: `${global.botname}`,
                body: `Creador: ${global.author}`,
                thumbnailUrl: imageUrl,
                sourceUrl: 'https.github.com/Wilsmac/Fantasy-Bot-MD', // You can change this
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { text: ownerText }, { quoted: m });
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
