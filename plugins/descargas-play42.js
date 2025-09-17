import fetch from 'node-fetch';
import yts from 'yt-search';
import axios from 'axios';

const LimitAud = 725 * 1024 * 1024; // 725MB
const LimitVid = 425 * 1024 * 1024; // 425MB
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

// Helper functions that were missing or misplaced
async function search(query) {
  const results = await yts(query);
  return results.videos;
}

function secondString(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " día, " : " días, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " horas, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minuto, " : " minutos, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " segundo" : " segundos") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

async function getFileSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return parseInt(response.headers.get('content-length') || 0);
  } catch {
    return 0; // Si falla, asumimos 0
  }
}

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
    if (!text) return m.reply(`**˚₊· ͟͟͞͞➳❥ Y T ¸.☆.¸⁭ P L A Y*\n*Ingrese el nombre de la canción*\n\n*Ejemplo:*\n${usedPrefix + command} emilia 420`);

    try {
        const tipoDescarga = command === 'play' || command === 'musica' ? 'audio' : command === 'play2' ? 'video' : command === 'play3' ? 'audio (documento)' : command === 'play4' ? 'video (documento)' : '';
        const yt_play = await search(args.join(' '));
        if (!yt_play.length) return m.reply('No se encontraron resultados para tu búsqueda.');

        const videoInfo = yt_play[0];

        await conn.sendMessage(m.chat, { text: `${videoInfo.title}\n> [ YOUTUBE - PLAY ] \n\n*ੈ✰‧₊˚ /Duración ${secondString(videoInfo.duration.seconds)}\n*ੈ✰‧₊˚ Aguarde un momento en lo que envío su ${tipoDescarga}*`});

        const isAudio = command === 'play' || command === 'musica' || command === 'play3';
        const format = isAudio ? 'audio' : 'video';

        const apiUrl = `https://myapiadonix.casacam.net/download/yt?apikey=AdonixKeyvomkuv5056&url=${encodeURIComponent(videoInfo.url)}&format=${format}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || data.status !== "true") {
             return m.reply('No se pudo obtener el enlace de descarga.');
        }

        const mediaData = data.data.url;

        if (mediaData) {
            const fileSize = await getFileSize(mediaData);
            const isDoc = command.includes('3') || command.includes('4');

            if (isAudio) {
                if (fileSize > LimitAud || isDoc) {
                    await conn.sendMessage(m.chat, { document: { url: mediaData }, mimetype: 'audio/mpeg', fileName: `${videoInfo.title}.mp3` }, { quoted: m });
                } else {
                    await conn.sendMessage(m.chat, { audio: { url: mediaData }, mimetype: 'audio/mpeg' }, { quoted: m });
                }
            } else { // It's video
                if (fileSize > LimitVid || isDoc) {
                    await conn.sendMessage(m.chat, { document: { url: mediaData }, mimetype: 'video/mp4', fileName: `${videoInfo.title}.mp4` }, { quoted: m });
                } else {
                    await conn.sendMessage(m.chat, { video: { url: mediaData }, mimetype: 'video/mp4', caption: videoInfo.title }, { quoted: m });
                }
            }
        } else {
            m.reply('No se pudo descargar el archivo. La API no devolvió un enlace.');
        }
    } catch (e) {
        console.error(e);
        m.reply(`Ocurrió un error al procesar la solicitud: ${e.message}`);
    }
};

handler.help = ['play', 'play2', 'play3', 'play4', 'musica'];
handler.tags = ['descargas'];
handler.command = /^(play|play2|play3|play4e|musica)$/i;
handler.register = true;

export default handler;
