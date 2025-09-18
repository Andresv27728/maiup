import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';
import { savetube } from '../lib/yt-savetube.js'
import { ogmp3 } from '../lib/youtubedl.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ytmp3, ytmp4 } = require("@hiudyy/ytdl");
const LimitAud = 725 * 1024 * 1024; // 725MB
const LimitVid = 425 * 1024 * 1024; // 425MB
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

async function search(query) {
  const results = await yts(query);
  return results.videos;
}

function secondString(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " día, " : " días, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " horas, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minuto, " : " minutos, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " segundo" : " segundos") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
    if (!text) return m.reply(`**˚₊· ͟͟͞͞➳❥ Y T ¸.☆.¸⁭ P L A Y*\n*Ingrese el nombre de la canción*\n\n*Ejemplo:*\n${usedPrefix + command} emilia 420`);
    const tipoDescarga = command === 'play' || command === 'musica' ? 'audio' : command === 'play2' ? 'video' : command === 'play3' ? 'audio (documento)' : command === 'play4' ? 'video (documento)' : '';

    const yt_play = await search(args.join(' '));
    if (!yt_play || yt_play.length === 0) {
        return m.reply('No se encontraron resultados para su búsqueda.');
    }

    await conn.sendMessage(m.chat, { text: `${yt_play[0].title}\n> [ YOUTUBE - PLAY ] \n-\n-*ੈ✰‧₊˚ /Duración ${secondString(yt_play[0].duration.seconds)}\n-*ੈ✰‧₊˚ Aguarde un momento en lo que envío su ${tipoDescarga}*`}, { quoted: m });

    const [input, qualityInput = command === 'play' || command === 'musica' || command === 'play3' ? '320' : '720'] = text.split(' ');
    const audioQualities = ['64', '96', '128', '192', '256', '320'];
    const videoQualities = ['240', '360', '480', '720', '1080'];
    const isAudioCommand = command === 'play' || command === 'musica' || command === 'play3';
    const selectedQuality = (isAudioCommand ? audioQualities : videoQualities).includes(qualityInput) ? qualityInput : (isAudioCommand ? '320' : '720');
    const isAudio = command.toLowerCase().includes('mp3') || command.toLowerCase().includes('audio')
    const format = isAudio ? 'mp3' : '720'

    const audioApis = [
    { url: () => fetchInvidious(yt_play[0].url, 'audio'), extract: (data) => ({ data, isDirect: true }) },
    { url: () => savetube.download(yt_play[0].url, format), extract: (data) => ({ data: data.result.download, isDirect: false }) },
    { url: () => ogmp3.download(yt_play[0].url, selectedQuality, 'audio'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
    { url: () => ytmp3(yt_play[0].url), extract: (data) => ({ data, isDirect: true }) },
    { url: () => fetch(`https://api.dorratz.com/v3/ytdl?url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => {
    const mp3 = data.medias.find(media => media.quality === "160kbps" && media.extension === "mp3");
    return { data: mp3.url, isDirect: false }}},
    { url: () => fetch(`${APIs.neoxr.url}/youtube?url=${yt_play[0].url}&type=audio&quality=128kbps&apikey=${APIs.neoxr.key}`).then(res => res.json()), extract: (data) => ({ data: data.data.url, isDirect: false }) },
    { url: () => fetch(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${yt_play[0].url}&apikey=${APIs.fgmods.url}`).then(res => res.json()), extract: (data) => ({ data: data.result.dl_url, isDirect: false }) },
    { url: () => fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => ({ data: data.dl, isDirect: false }) },
    { url: () => fetch(`${apis}/download/ytmp3?url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => ({ data: data.status ? data.data.download.url : null, isDirect: false }) },
    { url: () => fetch(`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => ({ data: data.result.download.url, isDirect: false }) },
    { url: () => fetch(`https://exonity.tech/api/dl/playmp3?query=${yt_play[0].title}`).then(res => res.json()), extract: (data) => ({ data: data.result.download, isDirect: false })
    }];

    const videoApis = [
    { url: () => fetchInvidious(yt_play[0].url, 'video'), extract: (data) => ({ data, isDirect: true }) },
    { url: () => savetube.download(yt_play[0].url, '720'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
    { url: () => ogmp3.download(yt_play[0].url, selectedQuality, 'video'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
    { url: () => ytmp4(yt_play[0].url), extract: (data) => ({ data, isDirect: true }) },
    { url: () => fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => ({ data: data.dl, isDirect: false }) },
    { url: () => fetch(`${APIs.neoxr.url}/youtube?url=${yt_play[0].url}&type=video&quality=720p&apikey=${APIs.neoxr.key}`).then(res => res.json()), extract: (data) => ({ data: data.data.url, isDirect: false }) },
    { url: () => fetch(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${yt_play[0].url}&apikey=${APIs.fgmods.key}`).then(res => res.json()), extract: (data) => ({ data: data.result.dl_url, isDirect: false }) },
    { url: () => fetch(`${apis}/download/ytmp4?url=${encodeURIComponent(yt_play[0].url)}`).then(res => res.json()), extract: (data) => ({ data: data.status ? data.data.download.url : null, isDirect: false }) },
    { url: () => fetch(`https://exonity.tech/api/dl/playmp4?query=${encodeURIComponent(yt_play[0].title)}`).then(res => res.json()), extract: (data) => ({ data: data.result.download, isDirect: false })
    }];

    const download = async (apis) => {
    let mediaData = null;
    let isDirect = false;
    for (const api of apis) {
    try {
    const data = await api.url();
    const { data: extractedData, isDirect: direct } = api.extract(data);
    if (extractedData) {
    const size = await getFileSize(extractedData);
    if (size >= 1024) {
    mediaData = extractedData;
    isDirect = direct;
    break;
    }}} catch (e) {
    console.log(`Error con API: ${e}`);
    continue;
    }}
    return { mediaData, isDirect };
    };

    if (command === 'play' || command === 'musica') {
    const { mediaData, isDirect } = await download(audioApis);
    if (mediaData) {
    const fileSize = await getFileSize(mediaData);
    if (fileSize > LimitAud) {
    await conn.sendMessage(m.chat, { document: isDirect ? mediaData : { url: mediaData }, mimetype: 'audio/mpeg', fileName: `${yt_play[0].title}.mp3` }, { quoted: m });
    } else {
    await conn.sendMessage(m.chat, { audio: isDirect ? mediaData : { url: mediaData }, mimetype: 'audio/mpeg' }, { quoted: m });
    }} else {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const dDisplay = d > 0 ? d + (d == 1 ? ' día, ' : ' días, ') : '';
    const hDisplay = h > 0 ? h + (h == 1 ? ' hora, ' : ' horas, ') : '';
    const mDisplay = m > 0 ? m + (m == 1 ? ' minuto, ' : ' minutos, ') : '';
    const sDisplay = s > 0 ? s + (s == 1 ? ' segundo' : ' segundos') : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
      }
    }
}
export default handler
