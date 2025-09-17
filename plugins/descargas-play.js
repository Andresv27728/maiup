import fetch from 'node-fetch';
import yts from 'yt-search';

let handler = async (m, { conn: star, args, usedPrefix, command }) => {
  if (!args || !args[0]) {
    return star.reply(
      m.chat,
      `✦ *¡Ingresa el texto o enlace del vídeo de YouTube!*\n\n» *Ejemplo:*\n> *${usedPrefix + command}* Canción de ejemplo`,
      m
    );
  }

  await m.react('🕓');

  try {
    let query = args.join(' ');
    let isUrl = query.match(/youtu/gi);

    let video;
    if (isUrl) {
      let ytres = await yts({ videoId: query.split('v=')[1] });
      video = ytres.videos[0];
    } else {
      let ytres = await yts(query);
      video = ytres.videos[0];
      if (!video) {
        return star.reply(m.chat, '✦ *Video no encontrado.*', m).then(() => m.react('✖️'));
      }
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = video;

    const apiUrl = `https://myapiadonix.casacam.net/download/yt?apikey=AdonixKeyvomkuv5056&url=${encodeURIComponent(url)}&format=audio`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (json.status !== "true") {
      return star.reply(m.chat, `❌ Error: ${json.message || 'No se pudo obtener la información del audio.'}`, m);
    }

    const { url: downloadUrl, quality } = json.data;

    let txt = `➪ Descargando › *${title}*\n\n`;
    txt += `> ✩ Canal › *${author.name}*\n`;
    txt += `> ⴵ Duración › *${timestamp}*\n`;
    txt += `> ☄︎ Vistas › *${views}*\n`;
    txt += `> ☁︎ Publicado › *${ago}*\n`;
    txt += `> ❑ Enlace › *${url}*\n`;

    await star.sendFile(m.chat, thumbnail, 'thumbnail.jpg', txt, m);

    await star.sendFile(m.chat, downloadUrl, `${title}.mp3`, '', m);

    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('✖️');
    star.reply(m.chat, '✦ *Ocurrió un error al procesar tu solicitud. Intenta nuevamente más tarde.*', m);
  }
};

handler.command = ['play', 'play.1'];
handler.help = ['play <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;
