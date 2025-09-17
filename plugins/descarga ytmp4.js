import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `❀ Ejemplo de uso: ${usedPrefix + command} https://youtube.com/watch?v=Hx920thF8X4`, m);
    }

    if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) {
      return m.reply(`⚠️ Enlace inválido. Asegúrate de usar un link de YouTube válido.`);
    }

    m.react('⏳');

    const apiUrl = `https://myapiadonix.casacam.net/download/yt?apikey=AdonixKeyvomkuv5056&url=${encodeURIComponent(args[0])}&format=video`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (json.status !== "true") {
      return conn.reply(m.chat, `❌ Error: ${json.message || 'No se pudo obtener la información del video.'}`, m);
    }

    const { title, url: videoUrl, quality } = json.data;

    const cap = `*${title}*\n*Calidad:* ${quality}`;

    await conn.sendFile(m.chat, videoUrl, `${title}.mp4`, cap, m);

    m.react('✅');
  } catch (e) {
    m.reply(`❌ Ocurrió un error:\n${e}`);
  }
};

handler.help = ['ytmp4'];
handler.command = ['ytv2', 'ytmp4', 'ytv'];
handler.tags = ['dl'];
handler.diamond = true;

export default handler;
