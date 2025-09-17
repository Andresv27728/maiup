import { cpus as _cpus, totalmem, freemem, platform, hostname } from 'os';
import speed from 'performance-now';
import { sizeFormatter } from 'human-readable';

let format = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
});

let handler = async (m, { conn, usedPrefix }) => {
    const totalStats = Object.values(global.db.data.stats).reduce((total, stat) => total + stat.total, 0);
    const totalPlugins = Object.values(global.plugins).filter(p => p.help && p.tags).length;
    const uptime = process.uptime() * 1000;
    const uptimeString = new Date(uptime).toISOString().substr(11, 8);

    let info = `
╭━━〔 *INFO DEL BOT* 〕━━⬣
┃
┃ *Bot Name:* ${global.botname}
┃ *Creator:* ${global.author}
┃ *Prefix:* [ ${usedPrefix} ]
┃ *Plugins:* ${totalPlugins}
┃ *Uptime:* ${uptimeString}
┃ *Commands Executed:* ${toNum(totalStats)}
┃
┣━━〔 *SERVER INFO* 〕━━⬣
┃
┃ *Platform:* ${platform()}
┃ *Hostname:* ${hostname()}
┃ *RAM Usage:* ${format(totalmem() - freemem())} / ${format(totalmem())}
┃ *Free RAM:* ${format(freemem())}
┃
┣━━〔 *NODE.JS MEMORY* 〕━━⬣
┃
${Object.keys(process.memoryUsage()).map(key => `┃ *${key}:* ${format(process.memoryUsage()[key])}`).join('\n')}
┃
╰━━━━━━━━━━━━━━━━⬣
    `.trim();

    await conn.reply(m.chat, info, m, {
        contextInfo: {
            mentionedJid: [global.owner[0][0] + '@s.whatsapp.net']
        }
    });
};

handler.help = ['botinfo'];
handler.tags = ['info'];
handler.command = ['info', 'botinfo', 'infobot'];

export default handler;

function toNum(number) {
    if (number >= 1000000) return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (number >= 1000) return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return number.toString();
}
