import fetch from 'node-fetch';

// Manteniendo estos nombres como "Mai"
const newsletterJid  = '120363403880016910@newsletter'; // ID de canal actual
const newsletterName = 'miku';
const packname       = 'miku';

// Nombre de la bot
const botName = 'miku';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🔎';

  if (!args[0]) {
    // Este mensaje no tiene externalAdReply, así que no necesita la miniatura de la búsqueda aún.
    return conn.reply(
      m.chat,
      `🌸 Holii! Soy ${botName} 🎀 ¿Qué musiquita quieres buscar en YouTube? Dime dime~ ✨\n\n💖 Ejemplo:\n\`${usedPrefix + command} Goku conoce a Bills\``,
      m,
      { quoted: m } // Quité contextInfo aquí ya que no hay preview en este mensaje
    );
  }

  try {
    // Este mensaje de "Buscando" tampoco necesita la miniatura específica aún.
    await conn.reply(
      m.chat,
      `💖 ${botName} está buscando tu cancioncita "${args.join(' ')}"... ¡Un momentito, por favor! 🎧✨`,
      m,
      { quoted: m } // Quité contextInfo aquí
    );

    const query   = encodeURIComponent(args.join(' '));
    const apiUrl  = `https://api.vreden.my.id/api/ytplaymp3?query=${query}`;
    const res     = await fetch(apiUrl);
    const json    = await res.json();

    if (json.status !== 200 || !json.result?.download?.url) {
      // Este mensaje de error tampoco necesita la miniatura específica.
      return conn.reply(
        m.chat,
        `😿 Oh, nooo... ${botName} no pudo encontrar ni descargar eso. Gomen ne~`,
        m,
        { quoted: m } // Quité contextInfo aquí
      );
    }

    // Metadata
    const meta = json.result.metadata;
    const title       = meta.title;
    const description = meta.description;
    const timestamp   = meta.timestamp;
    const views       = meta.views.toLocaleString();
    const ago         = meta.ago;
    const authorName  = meta.author?.name || 'Desconocido';
    // Asumimos que meta.image contiene la URL de la miniatura
    const thumbnailUrlValue = meta.image; // Usamos meta.image
    const downloadURL = json.result.download.url;
    const quality     = json.result.download.quality;
    const filename    = json.result.download.filename;

    // Creamos el contextInfo JUSTO ANTES de enviar el audio
    const contextInfo = {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid,
        newsletterName,
        serverMessageId: -1
      },
      externalAdReply: {
        // Guiándonos por el snippet proporcionado:
        title: "☕︎︎ miku • 𝑊𝑜𝑟𝑙𝑑 𝑂𝑓 𝐶𝑢𝑡𝑒 🍁", // Usamos el título del snippet
        body: "✐ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖡𝗒 𝖸𝖮 𝖲𝖮𝖸 𝖸𝖮 🌵", // Usamos el cuerpo del snippet
        thumbnailUrl: thumbnailUrlValue, // Usamos la miniatura de la búsqueda
        mediaUrl: "https://whatsapp.com/channel/0029VbBGSpEGehEJK1e3Cu2L", // El enlace de invitación
        mediaType: 2, // Tipo de media 2
        showAdAttribution: true, // Mostrar atribución
        renderLargerThumbnail: true // Renderizar miniatura más grande
        // sourceUrl ya no es necesario aquí si mediaUrl se usa para el enlace
      }
    };


    const audioRes    = await fetch(downloadURL);
    const audioBuffer = await audioRes.buffer();

    const caption = `
🌸 Tadaa! ✨ Aquí tienes la musiquita que buscaste con ${botName} 🎀🎶

📌 *Título:* ${title}
👤 *Autor:* ${authorName}
⏱️ *Duración:* ${timestamp}
📅 *Publicado:* ${ago}
👁️ *Vistas:* ${views}
🎧 *Calidad:* ${quality}
📝 *Descripción:*
${description}

Espero que te guste muchooo! 🥰
`.trim();

    await conn.sendMessage(
      m.chat,
      {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        fileName: filename,
        ptt: false,
        caption
      },
      { contextInfo, quoted: m } // Enviamos el contextInfo con el audio
    );

  } catch (e) {
    console.error(e);
     // Este mensaje de error tampoco necesita la miniatura específica.
    await conn.reply(
      m.chat,
      `😭 Ahh! Algo salió mal...... ${botName} encontró un error feo feo... 💔\n\`\`\`${e.message}\`\`\``,
      m,
      { quoted: m } // Quité contextInfo aquí
    );
  }
};

handler.help = ['play', 'ytplay'].map(v => v + ' <texto>');
handler.tags = ['descargas'];
handler.command = ['ytplay', 'playaudio'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;
