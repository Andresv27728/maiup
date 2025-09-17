import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, command, args }) => {
  if (!text.trim() && !args[0]) {
    return conn.reply(m.chat, '🔎 Ingresa el nombre o URL del video.', m);
  }

  const input = text.trim() || args[0];
  let youtubeUrl = input;

  if (!/^https?:\/\//i.test(youtubeUrl)) {
    try {
      const search = await yts(youtubeUrl);
      if (!search.videos.length) {
        return conn.reply(m.chat, '❌ No se encontraron resultados.', m);
      }
      youtubeUrl = search.videos[0].url;
    } catch (e) {
      console.error(e);
      return conn.reply(m.chat, '❌ Error en la búsqueda.', m);
    }
  }

  try {
    await conn.sendMessage(m.chat, {
      react: {
        text: '⏳',
        key: m.key,
      }
    });

    const apiUrl = `https://myapiadonix.casacam.net/download/yt?apikey=AdonixKeyvomkuv5056&url=${encodeURIComponent(youtubeUrl)}&format=video`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (json.status !== "true") {
      // Assuming the API sends a message on failure
      return conn.reply(m.chat, `❌ Error: ${json.message || 'No se pudo obtener la información del video.'}`, m);
    }

    const { title, url: videoUrl, thumbnail, quality } = json.data;

    const caption = `*${title}*\n*Calidad:* ${quality}`;

    await conn.sendFile(m.chat, videoUrl, `${title}.mp4`, caption, m);

    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key,
      }
    });

  } catch (err) {
    console.error('Error al contactar la API:', err);
    conn.reply(m.chat, `❌ Error al contactar la API: ${err.message}`, m);
  }
};

handler.command = ['play2', 'playmp4'];
handler.help = ['play2 <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;
