import images from '../lib/images.js'

let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    // Asegúrate de que 'moneda' esté definido en tu configuración global si es necesario para la sección de economía
    let moneda = global.db.data.settings[conn.user.jid].moneda || '¥enes'; // Moneda sin el $ aquí

    let txt = `
̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮

︶•︶°︶•︶°︶•︶°︶•︶°︶•︶°︶
> ᰔᩚ Hola! @${userId.split('@')[0]}, Soy *Miku*, Aquí tienes la lista de comandos.\n*(˶ᵔ ᵕ ᵔ˶)*

*╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ؕ͜─ׄ͜─֬͜─֟͜─֫͜─ׄ͜─ؕ͜─݊͜┈ࠦ͜┅ࠡ͜͜┈࠭͜͜۰۰͜۰*
│✧ *Modo* » ${conn.user.jid == global.conn.user.jid ? 'Bot Principal' : 'Sub-Bot'}
│✦ *Bot* » ${user.premium ? 'Prem Bot 🅑' : 'Free Bot'}
│ⴵ *Activada* » ${uptime}
│✰ *Usuarios* » ${totalreg}
│✐︎ *Plugins* » ${totalCommands}
│⚘ *Versión* » \`^2.3.0\`
│🜸 *Baileys* » Multi Device
*╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ  ⋮֔   ᩴ ⋰╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ*
> ✿ Crea un *Sub-Bot* con tu número utilizando *#qr* o *#code*
‧꒷︶꒷꒥꒷‧₊˚꒷︶꒷꒥꒷︶꒷˚₊‧꒷꒥꒷︶꒷‧

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴✧ *INFO* ✧╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ❀ *Comandos para ver estado e información de la Bot.*
✦ *#help • #menu*
> ⸙ Ver la lista de comandos de la Bot. ★
✦ *#uptime • #runtime*
> ⸙ Ver tiempo activo o en linea de la Bot. ⏱
✦ *#script*
> ⸙ enlace del repositorio oficial de la Bot □
✦ *#qr • #code*
> ⸙ Crea una sesión como Sub-Bot en tu número. ♥️
✦ *#bots • #sockets*
> ⸙ Ver la lista de Sub-Bots activos. ♦️
✦ *#creador*
> ⸙ Contacto del creador de la Bot. ★
✦ *#status • #estado*
> ⸙ Ver el estado actual de la Bot. 
✦ *#sug • #newcommand*
> ⸙ Sugiere un nuevo comando. ✎
✦ *#p • #ping*
> ⸙ Ver la velocidad de respuesta del Bot. ◆
✦ *#reporte • #reportar*
> ⸙ Reporta alguna falla o problema de la Bot. ✓
✦ *#sistema • #system*
> ⸙ Salud interna del Bot. ○
✦ *#speed • #speedtest*
> ⸙ Velocidad de respuesta. ▶️
✦ *#views • #usuarios*
> ⸙ Ver cuántos amigos tengo. ★
✦ *#funciones • #totalfunciones*
> ⸙ Todas las funciones. ◇
✦ *#ds • #fixmsgespera*
> ⸙ Ayuda a ordenar mensajes. ➜
✦ *#editautoresponder*
> ⸙ Enseñar a responder. ✍️
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴✧ *SEARCHS* ✧╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ❀ *Comandos para realizar búsquedas en distintas plataformas.*
✦ *#tiktoksearch • #tiktoks*
> ⸙ Buscador de videos de tiktok. ♪
✦ *#tweetposts*
> ⸙ ¿Qué dice Twitter/X? 🐦
✦ *#ytsearch • #yts*
> ⸙ Realiza búsquedas de Youtube. ▶️
✦ *#githubsearch*
> ⸙ Buscador de usuarios de GitHub. ⚙️
✦ *#cuevana • #cuevanasearch*
> ⸙ Buscador de películas/series por Cuevana. 🎬
✦ *#google*
> ⸙ Realiza búsquedas por Google. 🌐
✦ *#pin • #pinterest*
> ⸙ Buscador de imagenes de Pinterest. ✿
✦ *#image • #imagen*
> ⸙ Buscador de imagenes de Google. 🖼️
✦ *#animesearch • #animess*
> ⸙ Busca tu anime en Tioanime! 📺
✦ *#animei • #animeinfo*
> ⸙ Info de capítulos de anime! 📚
✦ *#infoanime*
> ⸙ Detalles de tu anime o manga! 📖
✦ *#hentaisearch • #searchhentai*
> ⸙ Buscador de animes hentai. (Solo +18) 🤫
✦ *#xnxxsearch • #xnxxs*
> ⸙ Buscador de vídeos de Xnxx. (Adultos, cuidado! 🔞)
✦ *#xvsearch • #xvideossearch*
> ⸙ Buscador de vídeos de Xvideos. (Adultos! 🔞)
✦ *#pornhub • #phub*
> ⸙ Buscador de videos de Pornhub. (Solo +18! 🔞)
✦ *#npmjs*
> ⸙ Buscandor de npmjs. 📦
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜✧ *DOWNLOAD* ✧╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ❀ *Comandos de descargas para varios archivos.*
✦ *#tiktok • #tt*
> ⸙ Descarga videos de TikTok. ↓♪
✦ *#mediafire • #mf*
> ⸙ Descargar un archivo de MediaFire. 💾
✦ *#mega • #mg* + [enlacé]
> ⸙ Descargar un archivo de MEGA. ↓💾
✦ *#play • #play2 • #playvideo • #playmp3 • #playmp4*
> ⸙ Descarga música y videos de YouTube por Nombre! ▶️↓
✦ *#ytmp3 • #ytmp4 • #ytvideo • #ytmp4doc*
> ⸙ Descarga música/video de YouTube mediante url. ↓★
✦ *#fb • #facebook*
> ⸙ Descarga videos de Facebook. ↓📱
✦ *#twitter • #x* + [Link]
> ⸙ Descargar un video de Twitter/X ↓🐦
✦ *#ig • #instagram*
> ⸙ Descarga contenido de Instagram. ↓📸
✦ *#tiktoksearch • #tiktoks* + [busqueda]
> ⸙ Buscar videos de tiktok para descargar. 🔎♪
✦ *#terabox • #tb* + [enlace]
> ⸙ Archivos de Terabox! ↓💾
✦ *#gdrive • #drive* + [enlace]
> ⸙ Archivos de Google Drive! ↓☁️
✦ *#ttimg • #ttmp3* + <url>
> ⸙ Descarga fotos/audios de tiktok. ↓🖼️🎧
✦ *#gitclone* + <url>
> ⸙ Descarga un repositorio de github. 💾⚙️
✦ *#xvideosdl*
> ⸙ Descarga videos porno de (Xvideos). (Solo +18! 🔞)
✦ *#xnxxdl*
> ⸙ Descarga videos porno de (xnxx). (Solo +18! 🔞)
✦ *#apk • #modapk*
> ⸙ Descarga un apk de Aptoide. 📱
✦ *#tiktokrandom • #ttrandom*
> ⸙ Descarga un video aleatorio de tiktok. ★♪
✦ *#npmdl • #npmdownloader*
> ⸙ Descarga paquetes de NPMJs. 📦↓
✦ *#animelinks • #animedl*
> ⸙ Links para descargar anime! 🎬↓
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴✧ *ECONOMY* ✧╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ❀ *Comandos de economía y rpg para ganar dinero y otros recursos.*
✦ *#w • #work • #trabajar*
> ⸙ Trabaja para ganar ${moneda}. 💪
✦ *#slut • #protituirse*
> ⸙ Trabaja como prostituta y gana ${moneda}. (Diferente) 🤫
✦ *#cf • #suerte*
> ⸙ Apuesta tus ${moneda} a cara o cruz. 🍀 moneda
✦ *#crime • #crimen*
> ⸙ Trabaja como ladrón para ganar ${moneda}. 😈
✦ *#ruleta • #roulette • #rt*
> ⸙ Apuesta ${moneda} al color rojo o negro. 🔴⚫🎡
✦ *#casino • #apostar*
> ⸙ Apuesta tus ${moneda} en el casino. 🎰★
✦ *#slot*
> ⸙ Apuesta tus ${moneda} en la ruleta y prueba tu suerte. 🎰♦️
✦ *#cartera • #wallet*
> ⸙ Ver tus ${moneda} en la cartera. 💸
✦ *#bal • #bank*
> ⸙ Ver tus ${moneda} en el banco. 🏦♥️
✦ *#deposit • #depositar • #d*
> ⸙ Deposita tus ${moneda} al banco. →🏦
✦ *#with • #retirar • #withdraw*
> ⸙ Retira tus ${moneda} del banco. 🏦→
✦ *#transfer • #pay*
> ⸙ Transfiere ${moneda} o XP a otros usuarios. ♥️
✦ *#miming • #minar • #mine*
> ⸙ Trabaja como minero y recolecta recursos. ⛏️💎
✦ *#buyall • #buy*
> ⸙ Compra ${moneda} con tu XP. ★
✦ *#daily • #diario*
> ⸙ Reclama tu recompensa diaria. 🎁☀
✦ *#cofre*
> ⸙ Reclama un cofre diario lleno de recursos. 💎📦
✦ *#weekly • #semanal*
> ⸙ Reclama tu regalo semanal. 🎉🗓️
✦ *#monthly • #mensual*
> ⸙ Reclama tu recompensa mensual. 🥳📅
✦ *#steal • #robar • #rob*
> ⸙ Intenta robarle ${moneda} a alguien. (cuidado)! 🏃‍♀️💨
✦ *#robarxp • #robxp*
> ⸙ Intenta robar XP a un usuario. 🤫★
✦ *#eboard • #baltop*
> ⸙ Ver el ranking de usuarios con más ${moneda}. 🏆
✦ *#aventura • #adventure*
> ⸙ Explora nuevos mundos conmigo! 🗺️★
✦ *#curar • #heal*
> ⸙ Recupera tu salud! ♥️🩹
✦ *#cazar • #hunt • #berburu*
> ⸙ Vamos a cazar! 🏹🐿️
✦ *#inv • #inventario*
> ⸙ ¿Qué tesoros tienes? 🎒💎
✦ *#mazmorra • #explorar*
> ⸙ Lugares misteriosos! 🦇🗝️
✦ *#halloween*
> ⸙ Reclama tu dulce o truco (Solo en Halloween). 🎃👻
✦ *#christmas • #navidad*
> ⸙ Reclama tu regalo navideño (Solo en Navidad). 🎄🎁
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴✧ *GACHA* ✧╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ❀ *Comandos de gacha para reclamar y colecciónar personajes.*
✦ *#rollwaifu • #rw • #roll*
> ⸙ Waifu o husbando aleatorio. 🥰♥️
✦ *#claim • #c • #reclamar*
> ⸙ Reclamar un personaje. ★
✦ *#harem • #waifus • #claims*
> ⸙ Ver tus personajes reclamados. ♥️♦️
✦ *#charimage • #waifuimage • #wimage*
> ⸙ Ver una imagen aleatoria de un personaje. 🖼️★
✦ *#charinfo • #winfo • #waifuinfo*
> ⸙ Ver información de un personaje. 📖✎
✦ *#givechar • #givewaifu • #regalar*
> ⸙ Regalar un personaje a otro usuario. 🤗🎁
✦ *#vote • #votar*
> ⸙ Votar por un personaje para subir su valor. 👍★
✦ *#waifusboard • #waifustop • #topwaifus*
> ⸙ Ver el top de personajes con mayor valor. ⭐🏆
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴✧ *STICKERS* ✧╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ❀ *Comandos para creaciones de stickers etc.*
✦ *#sticker • #s*
> ⸙ Crea stickers de (imagen/video) ★♥️
✦ *#setmeta*
> ⸙ Estable un pack y autor para los stickers. 🏷️♦️
✦ *#delmeta*
> ⸙ Elimina tu pack de stickers. 👋🗑️
✦ *#pfp • #getpic*
> ⸙ Obtén la foto de perfil de un usuario. 📸👀
✦ *#qc*
> ⸙ Crea stickers con texto o de un usuario. 💬★
✦ *#toimg • #img*
> ⸙ Convierte stickers en imagen. 🔄🖼️
✦ *#brat • #ttp • #attp*︎
> ⸙ Crea stickers con texto. ★✎
✦ *#emojimix*
> ⸙ Fuciona 2 emojis para crear un sticker. 🤩+🥰=♥️
✦ *#wm*
> ⸙ Cambia el nombre de los stickers. ✏️♦️
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴✧ *TOOLS* ✧╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ❀ *Comandos de herramientas con muchas funciones.*
✦ *#calcular • #cal*
> ⸙ Calcular todo tipo de ecuaciones. ➕➖➗✖️
✦ *#tiempo • #clima*
> ⸙ Ver el clima de un pais. ☀☁🌧️
✦ *#horario*
> ⸙ Ver el horario global de los países. ⏰🌎
✦ *#fake • #fakereply*
> ⸙ Crea un mensaje falso de un usuario. 😉😂
✦ *#enhance • #remini • #hd*
> ⸙ Mejora la calidad de una imagen. ★♥️
✦ *#letra*
> ⸙ Cambia la fuente de las letras. 🅰️🅱️
✦ *#read • #readviewonce • #ver*
> ⸙ Ver imágenes de una sola vista. 🤫📸
✦ *#whatmusic • #shazam*
> ⸙ ¿Qué canción está sonando? ♪🔎
✦ *#spamwa • #spam*
> ⸙ (¡Úsalo con responsabilidad! 😅)
✦ *#ss • #ssweb*
> ⸙ Ver el estado de una página web. 💻🌐
✦ *#length • #tamaño*
> ⸙ Cambia tamaño de imágenes/videos. 📏🖼️
✦ *#say • #decir* + [texto]
> ⸙ Repetir un mensaje. 🗣️★
✦ *#translate • #traducir • #trad*
> ⸙ Traduce palabras en otros idiomas. 🌍🗣️
✦ *#ia • #gemini*
> ⸙ Hazles preguntar a la ia. 🤔💬
✦ *#tourl • #catbox • #ibb*
> ⸙ Convierte imágen/video en urls. 🔗
✦ *#wiki • #wikipedia*
> ⸙ Investigar cualquier tema a través de Wikipedia. 📖🤓
✦ *#transcribir • #transcript*
> ⸙ Transcribe videos de YouTube. 📝▶️
✦ *#dalle • #flux*
> ⸙ Crea imágenes con texto mediante IA. 🖼️✍️
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴✧ *PROFILE* ✧╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ❀ *Comandos de perfil para ver, configurar y comprobar estados de tu perfil.*
✦ *#reg • #verificar • #register*
> ⸙ Registrarte para ser mi amigo oficial! ★🫂
✦ *#unreg*
> ⸙ Si cambias de opinión... 😥💔
✦ *#profile*
> ⸙ Muestra tu perfil de usuario. 😊♦️
✦ *#marry* [mension / etiquetar]
> ⸙ Propón matrimonio a otro usuario. 💍♥️
✦ *#divorce*
> ⸙ Divorciarte de tu pareja. 💔
✦ *#setgenre • #setgenero*
> ⸙ Establece tu género en el perfil del bot. 🏳️‍⚧️★
✦ *#delgenre • #delgenero*
> ⸙ Elimina tu género del perfil del bot.
✦ *#setbirth • #setnacimiento*
> ⸙ Establece tu fecha de nacimiento en el perfil del bot. 🎂🥳
✦ *#delbirth • #delnacimiento*
> ⸙ Elimina tu fecha de nacimiento del perfil del bot.
✦ *#setdescription • #setdesc*
> ⸙ Establece una descripción en tu perfil del bot. 📝♥️
✦ *#deldescription • #deldesc*
> ⸙ Elimina la descripción de tu perfil del bot.
✦ *#lb • #lboard* + <Paginá>
> ⸙ Top de usuarios con más (experiencia y nivel). 🏆★
✦ *#level • #lvl* + <@Mencion>
> ⸙ Ver tu nivel y experiencia actual. ★📈
✦ *#comprarpremium • #premium*
> ⸙ Ser un usuario super especial! ⭐♥️
✦ *#confesiones • #confesar*
> ⸙ Cuéntame tus secretos en anónimo! 🤫💌
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴✧ *GROUPS* ✧╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ❀ *Comandos de grupos para una mejor gestión de ellos.*
✦ *#config • #on*
> ⸙ ¡Mira las reglas de nuestro grupo! 📜♥️
✦ *#hidetag*
> ⸙ Envia un mensaje mencionando a todos los usuarios 🤫★
✦ *#gp • #infogrupo*
> ⸙ Ver la Informacion del grupo. ℹ️□
✦ *#linea • #listonline*
> ⸙ Ver la lista de los usuarios en linea. 👀★
✦ *#setwelcome*
> ⸙ Establecer un mensaje de bienvenida personalizado. 👋🥰
✦ *#setbye*
> ⸙ Establecer un mensaje de despedida personalizado. 👋😥
✦ *#link*
> ⸙ El bot envia el link del grupo. 🔗♥️
✦ *#admins • #admin*
> ⸙ Mencionar a los admins para solicitar ayuda. 👑⭐
✦ *#restablecer • #revoke*
> ⸙ Restablecer el enlace del grupo.
✦ *#open • #abrir*
> ⸙ Cambia ajustes del grupo para que todos los usuarios envien mensaje. 🔓🥳
✦ *#close • #cerrar*
> ⸙ Cambia ajustes del grupo para que solo los administradores envien mensaje. 🔒🌙
✦ *#kick* [número / mension]
> ⸙ Elimina un usuario de un grupo. 🥺
✦ *#add • #añadir • #agregar* [número]
> ⸙ Invita a un usuario a tu grupo. 🤗♥️
✦ *#promote* [mension / etiquetar]
> ⸙ El bot dara administrador al usuario mencionando. ⭐👑
✦ *#demote* [mension / etiquetar]
> ⸙ El bot quitara administrador al usuario mencionando.
✦ *#gpbanner • #groupimg*
> ⸙ Cambiar la imagen del grupo. 🏞️🖼️
✦ *#gpname • #groupname*
> ⸙ Cambiar el nombre del grupo. ✏️★
✦ *#gpdesc • #groupdesc*
> ⸙ Cambiar la descripción del grupo. 📝♥️
✦ *#setprimary*
> ⸙ Establecer un bot primario en un grupo.
✦ *#advertir • #warn • #warning*
> ⸙ Darle una advertencia aún usuario. ⚠️🥺
✦ ︎*#unwarn • #delwarn*
> ⸙ Quitar advertencias.
✦ *#advlist • #listadv*
> ⸙ Ver lista de usuarios advertidos. 📋🤔
✦ *#bot* [on / off]
> ⸙ Banear o desbanear el Bot en un chat o grupo. ★🌙
✦ *#mute* [mension / etiquetar]
> ⸙ El bot elimina los mensajes del usuario. 🤐😔
✦ *#unmute* [mension / etiquetar]
> ⸙ El bot deja de eliminar los mensajes del usuario. 😊🗣️
✦ *#encuesta • #poll*
> ⸙ Crea una encuesta. 📊★
✦ *#delete • #del*
> ⸙ Elimina mensaje de otros usuarios. 🗑️👋
✦ *#inactivos*
> ⸙ Ver lista de inactivos del grupo. 👻👀
✦ *#kickinactivos*
> ⸙ Elimina a los inactivos del grupo. 🚪😥
✦ *#invocar • #tagall • #todos*
> ⸙ Invoca a todos los usuarios de un grupo. 👋♥️
✦ *#setemoji • #setemo*
> ⸙ Cambia el emoji que se usa en la invitación de usuarios. ★♦️
✦ *#listnum • #kicknum*
> ⸙ Elimine a usuario por el prefijo de país.
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴✧ *ANIME REACTIONS* ✧╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ❀ *Comandos de reacciones de anime.*
✦ *#angry • #enojado* + <mencion>
> ⸙ Estar enojado 😠
✦ *#bite* + <mencion>
> ⸙ Muerde a alguien 😬🍏
✦ *#bleh* + <mencion>
> ⸙ Sacar la lengua 😝★
✦ *#blush* + <mencion>
> ⸙ Sonrojarte 😳♥️
✦ *#bored • #aburrido* + <mencion>
> ⸙ Estar aburrido 😴
✦ *#cry* + <mencion>
> ⸙ Llorar por algo o alguien 😭💧
✦ *#cuddle* + <mencion>
> ⸙ Acurrucarse 🤗♥️
✦ *#dance* + <mencion>
> ⸙ Sacate los pasitos prohíbidos 💃🕺✨
✦ *#drunk* + <mencion>
> ⸙ Estar borracho 🥴
✦ *#eat • #comer* + <mencion>
> ⸙ Comer algo delicioso 냠냠 🍔
✦ *#facepalm* + <mencion>
> ⸙ Darte una palmada en la cara 🤦‍♀️🤦‍♂️
✦ *#happy • #feliz* + <mencion>
> ⸙ Salta de felicidad 😄🥳
✦ *#hug* + <mencion>
> ⸙ Dar un abrazo 🤗★
✦ *#impregnate • #preg* + <mencion>
> ⸙ Embarazar a alguien (Juego) 🤭♥️
✦ *#kill* + <mencion>
> ⸙ Toma tu arma y mata a alguien (Juego, amigos!) 🔪☠️
✦ *#kiss • #besar* • #kiss2 + <mencion>
> ⸙ Dar un beso 😘💋
✦ *#laugh* + <mencion>
> ⸙ Reírte de algo o alguien 😂
✦ *#lick* + <mencion>
> ⸙ Lamer a alguien (Broma)! 😋😛
✦ *#love • #amor* + <mencion>
> ⸙ Sentirse enamorado 🥰♥️
✦ *#pat* + <mencion>
> ⸙ Acaricia a alguien 👋😊
✦ *#poke* + <mencion>
> ⸙ Picar a alguien 👉★
✦ *#pout* + <mencion>
> ⸙ Hacer pucheros 😠🥺
✦ *#punch* + <mencion>
> ⸙ Dar un puñetazo (Broma)! 👊💥
✦ *#run* + <mencion>
> ⸙ Correr 🏃‍♀️💨
✦ *#sad • #triste* + <mencion>
> ⸙ Expresar tristeza 😞💧
✦ *#scared* + <mencion>
> ⸙ Estar asustado 😨😱
✦ *#seduce* + <mencion>
> ⸙ Seducir a alguien 😉♥️
✦ *#shy • #timido* + <mencion>
> ⸙ Sentir timidez ☺️😳
✦ *#slap* + <mencion>
> ⸙ Dar una bofetada (Broma)! 👋😂
✦ *#dias • #days*
> ⸙ Darle los buenos días a alguien ☀👋
✦ *#noches • #nights*
> ⸙ Darle las buenas noches a alguien 🌙😴
✦ *#sleep* + <mencion>
> ⸙ Tumbarte a dormir 😴😇
✦ *#smoke* + <mencion>
> ⸙ Fumar 🚬💨
✦ *#think* + <mencion>
> ⸙ Pensar en algo 🤔💡
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴✧ *NSFW* ✧╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ❀ *Comandos NSFW (Contenido para adultos).*
✦ *#anal* + <mencion>
> ⸙ Hacer un anal 😉
✦ *#waifu*
> ⸙ Buscá una waifu aleatorio. 🔥♥️
✦ *#bath* + <mencion>
> ⸙ Bañarse 🛁💧
✦ *#blowjob • #mamada • #bj* + <mencion>
> ⸙ Dar una mamada 😉
✦ *#boobjob* + <mencion>
> ⸙ Hacer una rusa 😉
✦ *#cum* + <mencion>
> ⸙ Venirse en alguien. 😉
✦ *#fap* + <mencion>
> ⸙ Hacerse una paja 😉
✦ *#ppcouple • #ppcp*
> ⸙ Genera imagenes para amistades o parejas. 💕★
✦ *#footjob* + <mencion>
> ⸙ Hacer una paja con los pies 😉
✦ *#fuck • #coger • #fuck2* + <mencion>
> ⸙ Follarte a alguien 😉
✦ *#cafe • #coffe*
> ⸙ Tomate un cafecito con alguien ☕😊
ᰔᩚ *#violar • #perra + <mencion>
> ⸙ Viola a alguien (Solo juego! 😈☠️)
✦ *#grabboobs* + <mencion>
> ⸙ Agarrrar tetas 😉
✦ *#grop* + <mencion>
> ⸙ Manosear a alguien 😉
✦ *#lickpussy* + <mencion>
> ⸙ Lamer un coño 😉
✦ *#rule34 • #r34* + [Tags]
> ⸙ Buscar imagenes en Rule34 (+18! 🔞🖼️)
✦ *#sixnine • #69* + <mencion>
> ⸙ Haz un 69 con alguien 😉
✦ *#spank • #nalgada* + <mencion>
> ⸙ Dar una nalgada 😉
✦ *#suckboobs* + <mencion>
> ⸙ Chupar tetas 😉
✦ *#undress • #encuerar* + <mencion>
> ⸙ Desnudar a alguien 😉
✦ *#yuri • #tijeras* + <mencion>
> ⸙ Hacer tijeras. 😉
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴✧ *GAMES* ✧╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ❀ *Comandos de juegos para jugar con tus amigos.*
✦ *#amistad • #amigorandom*
> ⸙ ¡Haz un nuevo amigo al azar! 🥰🫂
✦ *#chaqueta • #jalamela*
> ⸙ Hacerte una chaqueta. (Juego divertido! 🤭😜)
✦ *#chiste*
> ⸙ ¡Te cuento el chiste más gracioso! 😂🎤
✦ *#consejo*
> ⸙ ¡Te doy un consejito para tu día! ★👍
✦ *#doxeo • #doxear* + <mencion>
> ⸙ Simular un doxeo falso. (Broma pesada! 😉😂)
✦ *#facto*
> ⸙ ¡Un dato curioso! 🤓💡
✦ *#formarpareja*
> ⸙ ¡Encuentra tu pareja perfecta! ♥️💑
✦ *#formarpareja5*
> ⸙ Forma 5 parejas diferentes. 😂♥️
✦ *#frase*
> ⸙ ¡Una frase linda! ♥️📝
✦ *#huevo*
> ⸙ (Juego divertido! 🥚🤣)
✦ *#chupalo* + <mencion>
> ⸙ (Juego divertido! 😜🤭)
✦ *#aplauso* + <mencion>
> ⸙ ¡Un aplauso para ti! 👏★
✦ *#marron* + <mencion>
> ⸙ (Broma de color 😉🎨)
✦ *#suicidar*
> ⸙ (Solo en juego, ¡ánimo! 😥☠️)
✦ *#iq • #iqtest* + <mencion>
> ⸙ ¡Calcula qué tan inteligente! 🤔🧠
✦ *#meme*
> ⸙ El bot te envía un meme aleatorio. 😂🖼️
✦ *#morse*
> ⸙ Escribir en código secreto. •-•• ---
✦ *#nombreninja*
> ⸙ ¡Descubre tu nombre ninja! 🥷★
✦ *#paja • #pajeame*
> ⸙ El bot te hace una paja. (Juego divertido! 🤭😜)
✦ *#personalidad* + <mencion>
> ⸙ La bot busca tu personalidad. ★😊
✦ *#piropo*
> ⸙ ¡Te digo algo bonito! 🥰♥️
✦ *#pregunta*
> ⸙ ¡Cualquier pregunta! ❓💡
✦ *#ship • #pareja*
> ⸙ La bot te da la probabilidad de enamorarte de una persona. 💕★
✦ *#sorteo*
> ⸙ Empieza un sorteo. 🎉🎁
✦ *#top*
> ⸙ Empieza un top de personas. 🏆★
✦ *#formartrio* + <mencion>
> ⸙ Forma un trío! 😉♥️
✦ *#ahorcado*
> ⸙ Diviertete con la bot jugando el juego ahorcado. 😬✍️
✦ *#genio*
> ⸙ ¡Pregúntale al Genio misterioso! ★🔮
✦ *#mates • #matematicas*
> ⸙ Responde las preguntas de matemáticas para ganar recompensas. 🔢🤓
✦ *#ppt*
> ⸙ Juega piedra papel o tijeras con la bot. ✊✋✌️
✦ *#sopa • #buscarpalabra*
> ⸙ Palabras escondidas. 🔎📜
✦ *#pvp • #suit* + <mencion>
> ⸙ Juega un pvp contra otro usuario. ⚔️🎮
✦ *#ttt*
> ⸙ Crea una sala de juego. ✗○Game
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

> *© Powered by ${global.author}*
`.trim()

  await conn.sendMessage(m.chat, {
  text: txt,
  contextInfo: {
    mentionedJid: [m.sender, userId],
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelRD.id, // Asegúrate de que channelRD esté definido
      newsletterName: channelRD.name, // Asegúrate de que channelRD esté definido
      serverMessageId: -1,
    },
    forwardingScore: 16,
    externalAdReply: {
      title: "♦ Mai ♦ World Of Cute", // Título del reply con símbolos
      body: "➤ Powered By Wirk ★", // Cuerpo del reply con símbolos
      thumbnailUrl: images.menu,
      sourceUrl: "https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY", // Asegúrate de que la URL sea correcta
      mediaType: 1, // Tipo de media (1 para imagen)
      showAdAttribution: true,
      renderLargerThumbnail: true
    }
  }
}, { quoted: m });

}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor((ms % 3600000) / 60000);
    let s = Math.floor((ms % 60000) / 1000);
    let parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);

    return parts.join(' ');
}
