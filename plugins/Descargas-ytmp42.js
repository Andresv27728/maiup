import fetch from 'node-fetch';
import axios from 'axios';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    if (!text) return conn.reply(m.chat, `❀ Ejemplo: ${usedPrefix + command} https://youtube.com/watch?v=Hx920thF8X4`, m);

    if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) {
      return m.reply(`Enlace inválido`);
    }

    m.react('⏳');

    const apiUrl = `https://myapiadonix.casacam.net/download/yt?apikey=AdonixKeyvomkuv5056&url=${encodeURIComponent(args[0])}&format=video`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (json.status !== "true") {
      return conn.reply(m.chat, `❌ Error: ${json.message || 'No se pudo obtener la información del video.'}`, m);
    }

    const { title, url: videoUrl, quality } = json.data;

    const caption = `*${title}*\n*Calidad:* ${quality}`;

    await conn.sendMessage(m.chat, {
      document: { url: videoUrl },
      fileName: `${title}.mp4`,
      mimetype: 'video/mp4',
      caption: caption
    }, { quoted: m });

    m.react('✅');
  } catch (e) {
    m.reply(`Error: ${e.message || e}`);
  }
};
handler.help = ['ytmp4doc'];
handler.command = ['ytvdoc', 'ytmp4doc'];
handler.tags = ['downloader'];
handler.diamond = true;

export default handler;
