import ytdl from 'ytdl-core';
import yts from 'yt-search';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TMP_FOLDER = path.resolve(__dirname, '../tmp');
if (!fs.existsSync(TMP_FOLDER)) fs.mkdirSync(TMP_FOLDER, { recursive: true });

const handler = async (m, { conn, text, command, args }) => {
  if (!text.trim() && !args[0]) {
    return conn.reply(m.chat, '🔎 Por favor, ingresa el nombre o la URL del video de YouTube.', m);
  }

  const query = text.trim() || args[0];
  let youtubeUrl;

  if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(query)) {
    youtubeUrl = query;
  } else {
    try {
      const search = await yts(query);
      if (!search.videos.length) {
        return conn.reply(m.chat, '❌ No se encontraron resultados para tu búsqueda.', m);
      }
      youtubeUrl = search.videos[0].url;
    } catch (error) {
      console.error('Error al buscar el video:', error);
      return conn.reply(m.chat, `❌ Error al buscar el video: ${error.message}`, m);
    }
  }

  try {
    const info = await ytdl.getInfo(youtubeUrl);
    const video = info.videoDetails;
    const safeTitle = video.title.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '').slice(0, 100);
    const outPath = path.join(TMP_FOLDER, `${Date.now()}-${safeTitle}.mp4`);

    await conn.reply(m.chat, `🎥 Descargando video *${video.title}*...`, m);

    await new Promise((resolve, reject) => {
      const stream = ytdl(youtubeUrl, { quality: 18 }) // 360p mp4
        .pipe(fs.createWriteStream(outPath));

      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    await conn.sendMessage(m.chat, {
      video: { url: outPath },
      mimetype: 'video/mp4',
      fileName: `${safeTitle}.mp4`
    }, { quoted: m });

    fs.unlinkSync(outPath); // limpiar

  } catch (err) {
    console.error('Error al descargar el video:', err);
    conn.reply(m.chat, `❌ Error al descargar el video: ${err.message}`, m);
  }
};

handler.command = ['play8'];
handler.help = ['play8 <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;
