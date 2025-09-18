import axios from 'axios';

const handler = async (m, { conn, text }) => {
  if (!text) {
    conn.reply(m.chat, `⚠️ Te faltó el texto para usar *MayCode*`, m);
    return;
  }

  try {
    const res = await axios.get(`https://nightapioficial.onrender.com/api/maycode?messsge=${encodeURIComponent(text)}`);
    const { User, MayCode, Code, Creator } = res.data;

    const respuesta = `💻 *_MayCode_* 💻

*Hey* ${User}

*_MayCode Respuesta Breve:_* ${MayCode}

*Código:* 
\`\`\`
${Code}
\`\`\`

> Usando NightAPI 🌃✨`;

    await conn.sendMessage(m.chat, { text: respuesta }, { quoted: m });

  } catch (error) {
    console.error(error);
    throw `❌ Ocurrió un error al conectar con *MayCode*. Intenta de nuevo más tarde.`;
  }
};

handler.help = ['maycode'];
handler.tags = ['tools'];
handler.command = ['maycode', 'codigo'];
handler.group = false;
handler.register = true;
handel.coin = 1;

export default handler;
