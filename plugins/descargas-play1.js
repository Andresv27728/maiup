import fetch from "node-fetch"; 
import yts from 'yt-search'; 
import axios from "axios";

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav']; 
const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

const ddownr = { 
  download: async (url, format) => { 
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) { 
      throw new Error('Formato no soportado, verifica la lista de formatos disponibles.'); 
    }

    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    try {
      const response = await axios.request(config);

      if (response.data && response.data.success) {
        const { id, title, info } = response.data;
        const { image } = info;
        const downloadUrl = await ddownr.cekProgress(id);

        return {
          id: id,
          image: image,
          title: title,
          downloadUrl: downloadUrl
        };
      } else {
        throw new Error('Fallo al obtener los detalles del video.');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }, 

  cekProgress: async (id) => { 
    const config = { 
      method: 'GET', 
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`, 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/91.0.4472.124 Safari/537.36' 
      } 
    };

    try {
      while (true) {
        const response = await axios.request(config);

        if (response.data && response.data.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  } 
};

const handler = async (m, { conn, text, usedPrefix, command }) => { 
  try { 
    if (!text.trim()) { 
      return conn.reply(m.chat, '✎ Ingresa el nombre de la música a descargar.', m); 
    }

    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('No se encontraron resultados para tu búsqueda.');
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const vistas = formatViews(views);
    
    const infoMessage = `
╭˚₊· ͟͟͞͞➳❥ 𝖨𝗇𝖿𝗈 𝖽𝖾𝗅 𝖵𝗂𝖽𝖾𝗂𝗍𝗈 ꒰⑅ᵕ༚ᵕ꒱˖♡
│ ˗ˏˋ ✦ 𝖳𝗂́𝗍𝗎𝗅𝗈: *${title}*
│ ˗ˏˋ ✦ 𝖢𝖺𝗇𝖺𝗅: *${videoInfo.author.name || '𝖣𝖾𝗌𝖼𝗈𝗇𝗈𝖼𝗂𝖽𝗈'}*
│ ˗ˏˋ ✦ 𝖵𝗂𝗌𝗍𝖺𝗌: *${vistas}*
│ ˗ˏˋ ✦ 𝖣𝗎𝗋𝖺𝖼𝗂𝗈́𝗇: *${timestamp}*
│ ˗ˏˋ ✦ 𝖯𝗎𝖻𝗅𝗂𝖼𝖺𝖽𝗈: *${ago}*
│ ˗ˏˋ ✦ 𝖤𝗇𝗅𝖺𝖼𝖾: ${url}
╰─♡̷̷̷̷ ༘*.ﾟ⋆
꒰₊✧ By ${global.botname} 🌺 ˚.༄
`.trim();

    const thumb = (await conn.getFile(thumbnail))?.data;

    await conn.reply(m.chat, infoMessage, m, { 
      contextInfo: { 
        externalAdReply: { 
          title: packname, 
          body: dev, 
          mediaType: 1, 
          previewType: 0, 
          mediaUrl: "https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY", 
          sourceUrl: url, 
          thumbnail: thumb, 
          renderLargerThumbnail: true, 
        }, 
      }, 
    });

    if (command === 'play' || command === 'yta' || command === 'mp3') {
      const api = await ddownr.download(url, 'mp3');
      const result = api.downloadUrl;
      await conn.sendMessage(m.chat, { audio: { url: result }, mimetype: "audio/mpeg" }, { quoted: m });

    } else if (command === 'playvideo' || command === 'ytv' || command === 'mp4') {
      let sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let success = false;
      for (let source of sources) {
        try {
          const res = await fetch(source);
          const { data, result, downloads } = await res.json();
          let downloadUrl = data?.dl || result?.download?.url || downloads?.url || data?.download?.url;

          if (downloadUrl) {
            success = true;
            await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              fileName: `${title}.mp4`,
              mimetype: 'video/mp4',
              caption: `\`🪴 Titulo:\` *${title}*`,
              thumbnail: thumb
            }, { quoted: m });
            break;
          }
        } catch (e) {
          console.error(`Error con la fuente ${source}:`, e.message);
        }
      }

      if (!success) {
        return m.reply(`✱ *No se pudo descargar el video:* No se encontró un enlace de descarga válido.`);
      }
    } else {
      throw "Comando no reconocido.";
    }

  } catch (error) { 
    return m.reply(`❀ *Error:* ${error.message}`); 
  } 
};

handler.command = handler.help = ['playvideo', 'mp4', 'ytv']; 
handler.tags = ['downloader'];

export default handler;

function formatViews(views) { 
  if (views >= 1000) { 
    return (views / 1000).toFixed(1) + 'k (' + views.toLocaleString() + ')'; 
  } else { 
    return views.toString(); 
  } 
}
