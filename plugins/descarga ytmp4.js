import fetch from "node-fetch";
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `❀ Ejemplo de uso: ${usedPrefix + command} https://youtube.com/watch?v=Hx920thF8X4`, m);
    }

    if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) {
      return m.reply(`⚠️ Enlace inválido. Asegúrate de usar un link de YouTube válido.`);
    }

    m.react('💖');

    let json = await ytdl(args[0]);
    let limit = 10485760;
    let size = await getSize(json.url);

    const cap = `╭⋟───────────────╮
│ 🌷  𝙑𝙞𝙙𝙚𝙤 𝙡𝙞𝙨𝙩𝙤 𝙥𝙖𝙧𝙖 𝙩𝙞 🌷
╰⋞───────────────╯

🍡 *Título:* ${json.title}
🍥 *Tamaño:* ${await formatSize(size) || "Desconocido"}
🪷 *Enlace:* ${args[0]}

💮 Enviado por *Mai* 💛`;

    await conn.sendFile(
      m.chat,
      await (await fetch(json.url)).buffer(),
      `${json.title}.mp4`,
      cap,
      m,
      null,
      {
        mimetype: "video/mp4",
        contextInfo: {
          externalAdReply: {
            title: "☕︎︎ 𝘔𝘢𝘪 • 𝑊𝑜𝑟𝑙𝑑 𝑂𝑓 𝐶𝑢𝑡𝑒🐤",
            body: "✐ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖡𝗒 𝖶𝗂𝗋𝗄 💛",
            mediaUrl: "https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY",
            mediaType: 1,
            showAdAttribution: true,
            renderLargerThumbnail: true
          }
        }
      }
    );

    m.react('☑️');
  } catch (e) {
    m.reply(`❌ Ocurrió un error:\n${e}`);
  }
};

handler.help = ['ytmp4'];
handler.command = ['ytv2', 'ytmp4', 'ytv'];
handler.tags = ['dl'];
handler.diamond = true;

export default handler;

async function ytdl(url) {
  const headers = {
    "accept": "*/*",
    "accept-language": "es-ES,es;q=0.9",
    "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://id.ytmp3.mobi/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };

  const initial = await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers });
  const init = await initial.json();
  const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^&?/]+)/)?.[1];
  const convertURL = `${init.convertURL}&v=${id}&f=mp4&_=${Math.random()}`;

  const converts = await fetch(convertURL, { headers });
  const convert = await converts.json();

  let info = {};
  for (let i = 0; i < 3; i++) {
    const progressResponse = await fetch(convert.progressURL, { headers });
    info = await progressResponse.json();
    if (info.progress === 3) break;
  }

  return {
    url: convert.downloadURL,
    title: info.title
  };
}

async function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  bytes = Number(bytes);

  if (isNaN(bytes)) return 'Tamaño inválido';

  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }

  return `${bytes.toFixed(2)} ${units[i]}`;
}

async function getSize(url) {
  try {
    const response = await axios.head(url);
    const contentLength = response.headers['content-length'];
    return contentLength ? parseInt(contentLength, 10) : null;
  } catch (error) {
    return null;
  }
}
