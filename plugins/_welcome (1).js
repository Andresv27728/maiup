import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  const fkontak = {
    "key": {
      "participants": "0@s.whatsapp.net",
      "remoteJid": "status@broadcast",
      "fromMe": false,
      "id": "Halo"
    },
    "message": {
      "contactMessage": {
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:Mai\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  };

  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg');
  let img = await (await fetch(`${pp}`)).buffer();

  let chat = global.db.data.chats[m.chat];
  let welcomeText = chat.welcome || 'Bienvenid@ a nuestro grupo';
  let byeText = chat.bye || 'Adiós Te esperamos pronto.';
  let groupSize = participants.length;

  if (m.messageStubType == 27) groupSize++;
  else if (m.messageStubType == 28 || m.messageStubType == 32) groupSize--;

  const dev = '『 Mai 🌻 』';
  const redes = '©️ Mai By Wirk';

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `❀ *Bienvenido* a ${groupMetadata.subject}\n✰ @${m.messageStubParameters[0].split`@`[0]}\n${welcomeText}\n✦ Ahora somos ${groupSize} Miembros.\n•(=^●ω●^=)• Disfruta tu estadía en el grupo!\n> ✐ Usa *#help* para ver lo que Mai puede hacer por ti.\n> 🪴 *Puedes editar la bienvenida con .setwelcome* `;
    await conn.sendMini(m.chat, 'ゲ◜៹ New Member ៹◞ゲ', dev, bienvenida, img, img, redes, fkontak);
  }

  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let despedida = `❀ *Adiós* de ${groupMetadata.subject}\n✰ @${m.messageStubParameters[0].split`@`[0]}\n${byeText}\n✦ Ahora somos ${groupSize} Miembros.\n•(=^●ω●^=)• ¡Te esperamos pronto!\n> ✐ Usa *#help* para ver lo que Mai puede hacer por ti.\n> ☕ *Puedes editar la despedida con .setbye*`;
    await conn.sendMini(m.chat, 'ゲ◜៹ Bye Member ៹◞ゲ', dev, despedida, img, img, redes, fkontak);
  }
}
