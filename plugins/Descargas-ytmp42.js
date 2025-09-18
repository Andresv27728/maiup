import axios from 'axios';
import { getStream } from 'node-web-streams';

let handler = async (m, { conn, text, args }) => {
  try {
    if (!text) return conn.reply(m.chat, `❀ Ejemplo: .ytv https://youtube.com/watch?v=Hx920thF8X4`, m);

    if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) {
      return m.reply(`Enlace inválido`);
    }

    m.react('⏱️');

    let json = await ytdl(args[0]);
    let size = await getSize(json.url);
    let maxSize = 1_073_741_824;

    if (size && size > maxSize) {
      return m.reply(`El video pesa más de 1 GB (${await formatSize(size)}). Usa otro más ligero.`);
    }

    const caption = `*「✦」 : ${json.title}*
\n> ❒ Peso: ${await formatSize(size)}\n> 🜸 URL: ${args[0]}\n> ⨶ ⍴r᥆᥎і᥎ᥱძ ᑲᥡ mᥲі ッ`;

    const { data: stream } = await axios.get(json.url, { responseType: 'stream' });

    await conn.sendMessage(m.chat, {
      document: stream,
      fileName: `${json.title}.mp4`,
      mimetype: 'video/mp4',
      caption
    }, { quoted: m });

    m.react('☑️');
  } catch (e) {
    m.reply(`Error: ${e}`);
  }
};
handler.help = ['ytmp4doc'];
handler.command = ['ytvdoc', 'ytmp4doc'];
handler.tags = ['downloader'];
handler.diamond = true;

export default handler;

// ytdl, formatSize y getSize iguales al mensaje anterior
