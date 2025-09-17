import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `❀ Por favor, ingresa el nombre de la música a descargar.`, m)
    }
  
    let videoIdToFind = text.match(youtubeRegexID) || null
    let yt_search_result = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])
    let videoInfo = yt_search_result.videos[0]

    if (!videoInfo) {
      return m.reply('✧ No se encontraron resultados para tu búsqueda.')
    }
    
    let { title, thumbnail, timestamp, views, ago, url, author } = videoInfo

    const vistas = formatViews(views)
    const canal = author.name ? author.name : 'Desconocido'

    const infoMessage = `
╭♡༉✧˚ ༘⋆˚❀｡──♡───╮
 ʚ🌸ɞ URL 𝖣𝖾𝗌𝖼𝖺𝗋𝗀𝖺𝗌 🌴
╰♡༉✧˚ ༘⋆｡˚❀──♡───╯

*🍡 Título:* ${title}
*🍥 Canal:* ${canal}
*🌟 Vistas:* ${vistas}
*⏰ Duración:* ${timestamp}
*🗓️ Publicado:* ${ago}
*🔗 Enlace:* ${url}

⌜ ♡ 𝑬𝒔𝒑𝒆𝒓𝒂 𝒖𝒏 𝒑𝒐𝒒𝒖𝒊𝒕𝒐... ♡ ⌟
`

    const thumb = (await conn.getFile(thumbnail))?.data

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: 'miku ☕',
          body: 'By miku 👻',
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    }

    await conn.reply(m.chat, infoMessage, m, JT)

    const isAudio = command === 'play' || command === 'yta' || command === 'ytmp3' || command === 'playaudio'
    const format = isAudio ? 'audio' : 'video'

    const apiUrl = `https://myapiadonix.casacam.net/download/yt?apikey=AdonixKeyvomkuv5056&url=${encodeURIComponent(url)}&format=${format}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || data.status !== "true") {
        return m.reply('⚠︎ No se pudo obtener el enlace de descarga. La API falló.');
    }

    const downloadUrl = data.data.url;

    if (isAudio) {
        await conn.sendMessage(m.chat, { audio: { url: downloadUrl }, fileName: `${title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
    } else {
        await conn.sendFile(m.chat, downloadUrl, `${title}.mp4`, title, m)
    }

  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error.message || error}`)
  }
}

handler.command = handler.help = ['yta', 'ytmp3', 'playvid', 'ytv', 'ytmp4', 'mp4']
handler.tags = ['descargas']
handler.group = true

export default handler

function formatViews(views) {
  if (views === undefined) {
    return "No disponible"
  }

  if (views >= 1_000_000_000) {
    return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  } else if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  } else if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  }
  return views.toString()
}
