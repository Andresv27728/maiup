import fs from 'fs';
import path from 'path';
// Import necessary modules from your bot framework if needed
// import pkg from '@whiskeysockets/baileys';
// const { generateWAMessageFromContent, proto } = pkg;
// import fetch from 'node-fetch'; // If your environment supports it

// --- Define the path to the database file ---
const DATABASE_FILE = path.join('./src/database', 'database.json');

// --- Constants ---
const STARTING_CREDITS = 500;
const STARTING_FUEL = 100;
const STARTING_HULL = 100;
const STARTING_CARGO = 50; // Starting cargo capacity

const FUEL_COST_PER_JUMP = 20;
const REPAIR_COST_PER_HULL = 5; // Credits per hull point repaired
const FUEL_PER_FUEL_CELL = 10; // Fuel gained per Fuel Cell used

const COOLDOWN_EXPLORE = 2 * 60 * 1000; // 2 minutes
const COOLDOWN_MINE = 1 * 60 * 1000; // 1 minute
const COOLDOWN_SCAN = 30 * 1000; // 30 seconds
const COOLDOWN_COMBAT = 5 * 60 * 1000; // 5 minutes

// Resource values (for selling)
const RESOURCE_VALUES = {
    'minerales': 10,
    'aleaciones': 25,
    'celulasdecombustible': 50,
    'chatarra': 5
};

// --- Database Handling ---

// Ensure the database directory and file exist
const ensureDatabase = () => {
    const dbDir = path.dirname(DATABASE_FILE);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log(`Created database directory: ${dbDir}`);
    }
    if (!fs.existsSync(DATABASE_FILE)) {
        fs.writeFileSync(DATABASE_FILE, JSON.stringify({ spaceUsers: {} }, null, 4)); // Use spaceUsers key
        console.log(`Created empty database file: ${DATABASE_FILE}`);
    }
};

// Load the entire database from the JSON file
const loadDatabase = () => {
    ensureDatabase();
    try {
        const data = fs.readFileSync(DATABASE_FILE, 'utf8');
        const db = JSON.parse(data);
        if (!db.spaceUsers) db.spaceUsers = {}; // Ensure spaceUsers key exists
        return db;
    } catch (e) {
        console.error(`Error loading database from ${DATABASE_FILE}:`, e);
        return { spaceUsers: {} }; // Return empty structure on error
    }
};

// Save the entire database to the JSON file
const saveDatabase = (db) => {
    ensureDatabase();
    try {
        fs.writeFileSync(DATABASE_FILE, JSON.stringify(db, null, 4), 'utf8');
        // console.log("Database saved successfully."); // Optional: log save success
    } catch (e) {
        console.error(`Error saving database to ${DATABASE_FILE}:`, e);
    }
};

// --- Player Data Structure ---

const getDefaultUserData = (userId, userName) => {
    return {
        name: userName,
        shipName: `Explorador de ${userName}`, // Default ship name in Spanish
        credits: STARTING_CREDITS,
        hull: STARTING_HULL,
        maxHull: STARTING_HULL,
        shields: 0, // Start with no shields
        maxShields: 0,
        fuel: STARTING_FUEL,
        maxFuel: STARTING_FUEL,
        cargoCapacity: STARTING_CARGO,
        cargo: { // Resources carried - keys in Spanish for easier access with RESOURCE_VALUES
            minerales: 0,
            aleaciones: 0,
            celulasdecombustible: 0,
            chatarra: 0,
            // Add other potential items here
        },
        location: 'Sector 001', // Starting sector
        pilotRank: 1, // Starting rank
        // Timestamps for cooldowns
        lastExplore: 0,
        lastMine: 0,
        lastScan: 0,
        lastCombat: 0,
        // Equipment levels (simple representation)
        miningLaserLevel: 1,
        weaponLevel: 1,
        shieldGeneratorLevel: 0,
        cargoPodLevel: 0, // Increases cargo capacity
        // Combat stats
        kills: 0,
        deaths: 0,
    };
};

// --- Helper Functions ---

const getSpaceUser = (db, userId, userName) => {
    if (!db.spaceUsers[userId]) {
        db.spaceUsers[userId] = getDefaultUserData(userId, userName);
        console.log(`Created new space user data for: ${userName} (${userId})`);
    }
    return db.spaceUsers[userId];
};

const formatCooldownTime = (msLeft) => {
    const seconds = Math.ceil(msLeft / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds} segundo${remainingSeconds > 1 ? 's' : ''}`);

    return parts.join(' y ');
};

const getCurrentCargoWeight = (cargo) => {
    let weight = 0;
    for (const item in cargo) {
        // Assuming each unit of resource/item takes 1 unit of cargo space
        weight += cargo[item];
    }
    return weight;
};


// --- Space RPG Command Handler ---

// This is the main function you will call from your bot's message handler
const handler = async (m, { conn, args, usedPrefix, command }) => {

    const db = loadDatabase();
    const user = getSpaceUser(db, m.sender, conn.getName(m.sender) || 'Piloto'); // Get or create user data, provide default name
    const currentTime = Date.now(); // Get current timestamp

    // --- Command Parsing ---
    // Ensure the command matches the expected 'space' command with the correct prefix
    // The 'command' variable from the bot framework should already be the command without the prefix
    // So we check if the message starts with the usedPrefix + 'space'
    const fullCommand = m.text.toLowerCase().split(' ')[0];
    if (fullCommand !== usedPrefix + 'space') {
        // If the command doesn't match, this handler should not process it further
        // This is important if multiple handlers are registered
        return;
    }

    // Get the subcommand (the word after "!space" or ".space")
    let subCommand = args[0]?.toLowerCase(); // Use optional chaining in case args is empty

    // --- Help Message / Main Menu ---
    // Show help if no subcommand is given, or if the subcommand is 'help' or 'ayuda'
    if (!subCommand || subCommand === 'help' || subCommand === 'ayuda') {
        const helpText = `
🚀 *Comandos del Space RPG* 🚀

¡Bienvenido, Piloto! Tu aventura en el cosmos te espera.

*Nave y Piloto:*
➤ ${usedPrefix}space start - Comienza tu viaje (crea un nuevo perfil).
➤ ${usedPrefix}space profile - Ve las estadísticas de tu nave y piloto.
➤ ${usedPrefix}space inventory - Revisa tu carga y recursos.
➤ ${usedPrefix}space repair - Repara el casco de tu nave (cuesta créditos).
➤ ${usedPrefix}space refuel - Usa Células de Combustible para repostar tu nave.
➤ ${usedPrefix}space upgrade [sistema] - Mejora los sistemas de la nave (ej: casco, carga, arma, escudo, mineria).

*Exploración y Recolección:*
➤ ${usedPrefix}space explore - Aventúrate en lo desconocido (cuesta combustible, encuentra recursos/eventos).
➤ ${usedPrefix}space jump [sector] - Salta a un sector diferente (cuesta combustible).
➤ ${usedPrefix}space mine - Mina asteroides en tu sector actual (requiere Láser de Minería).
➤ ${usedPrefix}space scan - Escanea el área en busca de recursos o anomalías.

*Economía:*
➤ ${usedPrefix}space trade [comprar/vender] [articulo] [cantidad] - Compra o vende recursos/artículos.
➤ ${usedPrefix}space prices - Ve los precios actuales del mercado (simulados).

*Combate:*
➤ ${usedPrefix}space attack [@usuario] - Desafía a otro piloto a un combate simulado.

*Info:*
➤ ${usedPrefix}space help - Muestra este mensaje de ayuda.

¡Embárca en tu búsqueda cósmica!
`;
        await conn.reply(m.chat, helpText, m);
        // Save database before returning, as getSpaceUser might have created a new user
        saveDatabase(db);
        return;
    }

    // --- Command Processing (based on subCommand) ---
    switch (subCommand) {
        case 'start':
        case 'iniciar':
             // Check if user already has a profile
             if (db.spaceUsers[m.sender] && db.spaceUsers[m.sender].hull > 0) {
                 await conn.reply(m.chat, `😅 Ya tienes un perfil de piloto activo. Usa ${usedPrefix}space profile para ver tus estadísticas.`, m);
                 // Save database before returning
                 saveDatabase(db);
                 return;
             }
             // Create a new profile (getSpaceUser already does this if not exists, but this is for explicit start)
             // The user is already created by getSpaceUser at the top, just need to confirm and reply
             await conn.reply(m.chat, `🚀 ¡Bienvenido al espacio, ${user.name}! Tu nave, la '${user.shipName}', está lista para explorar. Usa ${usedPrefix}space profile para ver tus estadísticas iniciales.`, m);
             break; // Break after successful start

        case 'profile':
        case 'perfil':
            const profileText = `
👤 *Piloto:* ${user.name}
🚀 *Nave:* '${user.shipName}' (Rango Piloto ${user.pilotRank})

*Estado de la Nave:*
❤️ Casco: ${user.hull}/${user.maxHull}
🛡️ Escudos: ${user.shields}/${user.maxShields}
⛽ Combustible: ${user.fuel}/${user.maxFuel}
📦 Carga: ${getCurrentCargoWeight(user.cargo)}/${user.cargoCapacity}

*Recursos:*
💰 Créditos: ${user.credits}
⚙️ Láser de Minería: Nivel ${user.miningLaserLevel}
🗡️ Arma: Nivel ${user.weaponLevel}
🛡️ Generador de Escudos: Nivel ${user.shieldGeneratorLevel}
📦 Cápsulas de Carga: Nivel ${user.cargoPodLevel}

*Ubicación:*
📍 Sector Actual: ${user.location}

*Estadísticas de Combate (Simulado):*
Eliminaciones: ${user.kills}, Muertes: ${user.deaths}
`;
            await conn.reply(m.chat, profileText, m);
            break;

        case 'inventory':
        case 'inventario':
            let inventoryText = `📦 *Carga de la Nave '${user.shipName}':*\n\n`;
            const cargoItems = Object.entries(user.cargo).filter(([item, amount]) => amount > 0);

            if (cargoItems.length === 0) {
                inventoryText += "Tu bodega de carga está vacía.";
            } else {
                inventoryText += cargoItems.map(([item, amount]) => `• ${item.charAt(0).toUpperCase() + item.slice(1)}: ${amount}`).join('\n');
            }
            inventoryText += `\n\nCapacidad: ${getCurrentCargoWeight(user.cargo)}/${user.cargoCapacity}`;

            await conn.reply(m.chat, inventoryText, m);
            break;

        case 'explore':
        case 'explorar':
            if (currentTime - user.lastExplore < COOLDOWN_EXPLORE) {
                const timeLeft = COOLDOWN_EXPLORE - (currentTime - user.lastExplore);
                await conn.reply(m.chat, `⏱️ Tu nave aún está escaneando el sector. Puedes explorar de nuevo en ${formatCooldownTime(timeLeft)}.`, m);
                // Save database before returning
                saveDatabase(db);
                return;
            }
            if (user.fuel < 5) { // Small fuel cost for exploring
                 await conn.reply(m.chat, `⛽ Necesitas al menos 5 de combustible para explorar el sector.`, m);
                 // Save database before returning
                 saveDatabase(db);
                 return;
            }

            user.fuel -= 5;
            user.lastExplore = currentTime;

            const explorationEvent = Math.random();
            let exploreResult = `🚀 Explorando el sector ${user.location}...\n\n`;
            const cargoWeight = getCurrentCargoWeight(user.cargo);

            if (explorationEvent < 0.1) {
                // Find valuable resources
                exploreResult += `✨ ¡Has descubierto un rico campo de asteroides!`;
                const mineralsFound = Math.floor(Math.random() * 20) + 10;
                const alloysFound = Math.floor(Math.random() * 10) + 5;
                const totalFound = mineralsFound + alloysFound;

                if (cargoWeight + totalFound <= user.cargoCapacity) {
                    user.cargo.minerales += mineralsFound;
                    user.cargo.aleaciones += alloysFound;
                    exploreResult += `\nRecogiste ${mineralsFound} Minerales y ${alloysFound} Aleaciones.`;
                } else {
                    const canTake = user.cargoCapacity - cargoWeight;
                    if (canTake > 0) {
                        // Simple distribution if cargo is limited
                        const takeMinerals = Math.min(mineralsFound, Math.floor(canTake / 2));
                        const takeAlloys = Math.min(alloysFound, canTake - takeMinerals);
                        user.cargo.minerales += takeMinerals;
                        user.cargo.aleaciones += takeAlloys;
                        exploreResult += `\nTu carga está casi llena. Solo pudiste recoger ${takeMinerals} Minerales y ${takeAlloys} Aleaciones.`;
                    } else {
                        exploreResult += `\nTu bodega de carga está llena. No pudiste recoger nada.`;
                    }
                }

            } else if (explorationEvent < 0.3) {
                // Encounter derelict ship
                exploreResult += ` salvageable.`;
                const scrapFound = Math.floor(Math.random() * 15) + 5;
                const fuelCellsFound = Math.floor(Math.random() * 3) + 1;
                 const totalFound = scrapFound + fuelCellsFound;

                 if (cargoWeight + totalFound <= user.cargoCapacity) {
                     user.cargo.chatarra += scrapFound;
                     user.cargo.celulasdecombustible += fuelCellsFound;
                     exploreResult += `\nRecogiste ${scrapFound} Chatarra y ${fuelCellsFound} Células de Combustible.`;
                 } else {
                     const canTake = user.cargoCapacity - cargoWeight;
                     if (canTake > 0) {
                         const takeScrap = Math.min(scrapFound, Math.floor(canTake / 2));
                         const takeFuelCells = Math.min(fuelCellsFound, canTake - takeScrap);
                         user.cargo.chatarra += takeScrap;
                         user.cargo.celulasdecombustible += takeFuelCells;
                         exploreResult += `\nTu carga está casi llena. Solo pudiste recoger ${takeScrap} Chatarra y ${takeFuelCells} Células de Combustible.`;
                     } else {
                         exploreResult += `\nTu bodega de carga está llena. No pudiste recoger nada.`;
                     }
                 }

            } else if (explorationEvent < 0.6) {
                // Minor hazard
                exploreResult += `💥 ¡Peligro menor! Navegaste a través de un campo de escombros y sufriste daños leves.`;
                const damage = Math.floor(Math.random() * 10) + 5;
                user.hull -= damage;
                if (user.hull < 0) user.hull = 0;
                exploreResult += `\nTu casco actual es ${user.hull}/${user.maxHull}.`;
                 if (user.hull === 0) exploreResult += `\n⚠️ ¡Tu nave está críticamente dañada! Repara inmediatamente.`;

            } else {
                // Uneventful exploration
                exploreResult += `🌌 El sector parece tranquilo. No encontraste nada de interés.`;
            }

            await conn.reply(m.chat, exploreResult, m);
            break;

        case 'mine':
        case 'minar':
            if (currentTime - user.lastMine < COOLDOWN_MINE) {
                const timeLeft = COOLDOWN_MINE - (currentTime - user.lastMine);
                await conn.reply(m.chat, `⏱️ Tu láser de minería aún se está recargando. Puedes minar de nuevo en ${formatCooldownTime(timeLeft)}.`, m);
                 // Save database before returning
                 saveDatabase(db);
                return;
            }
            if (user.miningLaserLevel < 1) {
                 await conn.reply(m.chat, `🛠️ Necesitas un Láser de Minería para extraer recursos.`, m); // Assuming starting with level 1
                  // Save database before returning
                  saveDatabase(db);
                 return;
            }
             if (user.fuel < 2) { // Small fuel cost for mining
                 await conn.reply(m.chat, `⛽ Necesitas al menos 2 de combustible para operar el láser de minería.`, m);
                  // Save database before returning
                  saveDatabase(db);
                 return;
             }
             const cargoWeight = getCurrentCargoWeight(user.cargo);
             if (cargoWeight >= user.cargoCapacity) {
                 await conn.reply(m.chat, `📦 Tu bodega de carga está llena. Vende o usa recursos antes de minar.`, m);
                  // Save database before returning
                  saveDatabase(db);
                 return;
             }


            user.fuel -= 2;
            user.lastMine = currentTime;

            const miningYield = Math.floor(Math.random() * 10 * user.miningLaserLevel) + 5; // Yield based on laser level
            const resourceType = Math.random() > 0.3 ? 'minerales' : (Math.random() > 0.5 ? 'aleaciones' : 'chatarra'); // More minerals, less alloys/scrap - using Spanish keys

            const amountMined = Math.min(miningYield, user.cargoCapacity - cargoWeight); // Don't exceed cargo capacity

            if (amountMined > 0) {
                 user.cargo[resourceType] += amountMined;
                 await conn.reply(m.chat, `⛏️ Minaste ${amountMined} unidades de ${resourceType} en el sector ${user.location}.`, m);
            } else {
                 await conn.reply(m.chat, `⛏️ Minaste en el sector ${user.location}, pero no encontraste recursos o tu bodega está llena.`, m);
            }
            break;

        case 'scan':
        case 'escanear':
            if (currentTime - user.lastScan < COOLDOWN_SCAN) {
                const timeLeft = COOLDOWN_SCAN - (currentTime - user.lastScan);
                await conn.reply(m.chat, `⏱️ Tu escáner aún está procesando datos. Puedes escanear de nuevo en ${formatCooldownTime(timeLeft)}.`, m);
                 // Save database before returning
                 saveDatabase(db);
                return;
            }
             // Assuming players start with a basic scanner or it's part of the ship
            user.lastScan = currentTime;

            const scanResult = Math.random();
            let scanText = `📡 Escaneando el sector ${user.location}...\n\n`;

            if (scanResult < 0.2) {
                scanText += `✨ Detectado un campo de recursos rico en minerales y aleaciones.`;
            } else if (scanResult < 0.4) {
                scanText += `💥 Señales de actividad hostil detectadas. Procede con precaución.`;
            } else if (scanResult < 0.6) {
                scanText += `📦 Señal de una nave abandonada cercana. Posible chatarra o combustible.`;
            } else {
                scanText += `🌌 El escaneo no detecta nada fuera de lo común en este momento.`;
            }

            await conn.reply(m.chat, scanText, m);
            break;

        case 'repair':
        case 'reparar':
            const repairNeeded = user.maxHull - user.hull;
            if (repairNeeded <= 0) {
                await conn.reply(m.chat, `🛠️ Tu casco está en perfecto estado (${user.hull}/${user.maxHull}). No necesitas reparaciones.`, m);
                 // Save database before returning
                 saveDatabase(db);
                return;
            }
            const repairCost = repairNeeded * REPAIR_COST_PER_HULL;
            if (user.credits < repairCost) {
                await conn.reply(m.chat, `💰 Necesitas ${repairCost} créditos para reparar completamente tu nave. Solo tienes ${user.credits}.`, m);
                 // Save database before returning
                 saveDatabase(db);
                return;
            }

            user.credits -= repairCost;
            user.hull = user.maxHull;

            await conn.reply(m.chat, `🛠️ Tu nave ha sido reparada completamente por ${repairCost} créditos. Casco: ${user.hull}/${user.maxHull}.`, m);
            break;

        case 'refuel':
        case 'repostar':
            const fuelNeeded = user.maxFuel - user.fuel;
            if (fuelNeeded <= 0) {
                await conn.reply(m.chat, `⛽ Tu tanque de combustible está lleno (${user.fuel}/${user.maxFuel}). No necesitas repostar.`, m);
                 // Save database before returning
                 saveDatabase(db);
                return;
            }
            // Use the Spanish key for fuel cells
            if (user.cargo.celulasdecombustible === undefined || user.cargo.celulasdecombustible < 1) {
                await conn.reply(m.chat, `⛽ No tienes Células de Combustible en tu carga para repostar. Consigue algunas explorando o comerciando.`, m);
                 // Save database before returning
                 saveDatabase(db);
                return;
            }

            const fuelToUse = Math.min(user.cargo.celulasdecombustible, Math.floor(fuelNeeded / FUEL_PER_FUEL_CELL)); // Each fuel cell gives FUEL_PER_FUEL_CELL fuel
             if (fuelToUse < 1) {
                 await conn.reply(m.chat, `⛽ Necesitas al menos 1 Célula de Combustible para repostar.`, m);
                  // Save database before returning
                  saveDatabase(db);
                 return;
             }

            user.cargo.celulasdecombustible -= fuelToUse;
            user.fuel += fuelToUse * FUEL_PER_FUEL_CELL; // Add fuel based on cells used
             if (user.fuel > user.maxFuel) user.fuel = user.maxFuel; // Cap at max fuel

            await conn.reply(m.chat, `⛽ Usaste ${fuelToUse} Células de Combustible para repostar. Tu combustible actual es ${user.fuel}/${user.maxFuel}.`, m);
            break;

        case 'upgrade':
        case 'mejorar':
            if (args.length < 2) {
                await conn.reply(m.chat, `🛠️ Debes especificar qué sistema quieres mejorar: casco, carga, arma, escudo, mineria.\n\nEjemplo: ${usedPrefix}space upgrade casco`, m);
                 // Save database before returning
                 saveDatabase(db);
                return;
            }
            const systemToUpgrade = args[1].toLowerCase();
            let upgradeCost = 0;
            let currentLevel = 0;
            // upgradeMessage is not used after reply, can remove or keep for clarity
            // let upgradeMessage = "";

            switch (systemToUpgrade) {
                case 'casco':
                    currentLevel = user.maxHull; // Using maxHull as level indicator
                    upgradeCost = Math.floor(currentLevel * 10 + 1000); // Cost increases with current max hull
                    // upgradeMessage = `Mejorando casco. Costo: ${upgradeCost} créditos. Aumenta Max Casco en 20.`;
                    if (user.credits < upgradeCost) {
                        await conn.reply(m.chat, `💰 Necesitas ${upgradeCost} créditos para mejorar el casco. Tienes ${user.credits}.`, m);
                         // Save database before returning
                         saveDatabase(db);
                        return;
                    }
                    user.credits -= upgradeCost;
                    user.maxHull += 20;
                    user.hull += 20; // Also increase current hull
                    await conn.reply(m.chat, `✅ Casco mejorado. Tu Max Casco ahora es ${user.maxHull}. Tu casco actual es ${user.hull}.`, m);
                    break;
                case 'carga':
                    currentLevel = user.cargoPodLevel;
                    upgradeCost = Math.floor((currentLevel + 1) * 800); // Cost increases with cargo pod level
                    // upgradeMessage = `Mejorando bodega de carga. Costo: ${upgradeCost} créditos. Aumenta Capacidad de Carga en 20.`;
                     if (user.credits < upgradeCost) {
                        await conn.reply(m.chat, `💰 Necesitas ${upgradeCost} créditos para mejorar la bodega de carga. Tienes ${user.credits}.`, m);
                         // Save database before returning
                         saveDatabase(db);
                        return;
                    }
                    user.credits -= upgradeCost;
                    user.cargoPodLevel += 1;
                    user.cargoCapacity += 20;
                    await conn.reply(m.chat, `✅ Bodega de carga mejorada al Nivel ${user.cargoPodLevel}. Tu Capacidad de Carga ahora es ${user.cargoCapacity}.`, m);
                    break;
                case 'arma':
                    currentLevel = user.weaponLevel;
                    upgradeCost = Math.floor((currentLevel + 1) * 1200);
                    // upgradeMessage = `Mejorando sistema de armas. Costo: ${upgradeCost} créditos. Aumenta Nivel de Arma en 1.`;
                     if (user.credits < upgradeCost) {
                        await conn.reply(m.chat, `💰 Necesitas ${upgradeCost} créditos para mejorar el sistema de armas. Tienes ${user.credits}.`, m);
                         // Save database before returning
                         saveDatabase(db);
                        return;
                    }
                    user.credits -= upgradeCost;
                    user.weaponLevel += 1;
                    await conn.reply(m.chat, `✅ Sistema de armas mejorado al Nivel ${user.weaponLevel}.`, m);
                    break;
                case 'escudo':
                    currentLevel = user.shieldGeneratorLevel;
                    upgradeCost = Math.floor((currentLevel + 1) * 1500);
                    // upgradeMessage = `Instalando/Mejorando generador de escudos. Costo: ${upgradeCost} créditos. Aumenta Max Escudos en 50.`;
                     if (user.credits < upgradeCost) {
                        await conn.reply(m.chat, `💰 Necesitas ${upgradeCost} créditos para mejorar el generador de escudos. Tienes ${user.credits}.`, m);
                         // Save database before returning
                         saveDatabase(db);
                        return;
                    }
                    user.credits -= upgradeCost;
                    user.shieldGeneratorLevel += 1;
                    user.maxShields += 50;
                    user.shields = user.maxShields; // Fully charge shields on upgrade
                    await conn.reply(m.chat, `✅ Generador de escudos mejorado al Nivel ${user.shieldGeneratorLevel}. Tu Max Escudos ahora es ${user.maxShields}. Escudos cargados: ${user.shields}.`, m);
                    break;
                case 'mineria':
                    currentLevel = user.miningLaserLevel;
                    upgradeCost = Math.floor((currentLevel + 1) * 700);
                    // upgradeMessage = `Mejorando láser de minería. Costo: ${upgradeCost} créditos. Aumenta Nivel de Minería en 1.`;
                     if (user.credits < upgradeCost) {
                        await conn.reply(m.chat, `💰 Necesitas ${upgradeCost} créditos para mejorar el láser de minería. Tienes ${user.credits}.`, m);
                         // Save database before returning
                         saveDatabase(db);
                        return;
                    }
                    user.credits -= upgradeCost;
                    user.miningLaserLevel += 1;
                    await conn.reply(m.chat, `✅ Láser de minería mejorado al Nivel ${user.miningLaserLevel}.`, m);
                    break;
                default:
                    await conn.reply(m.chat, `🛠️ Sistema no reconocido para mejorar. Opciones: casco, carga, arma, escudo, mineria.`, m);
                     // Save database before returning
                     saveDatabase(db);
                    return; // Don't save if command is invalid
            }
            break; // Break after successful upgrade

        case 'trade':
        case 'comerciar':
            if (args.length < 4) {
                 await conn.reply(m.chat, `💰 Uso correcto: ${usedPrefix}space trade [comprar/vender] [articulo] [cantidad]\n\nEjemplo: ${usedPrefix}space trade vender minerales 50`, m);
                  // Save database before returning
                  saveDatabase(db);
                 return;
            }
            const tradeAction = args[1].toLowerCase();
            const tradeItem = args[2].toLowerCase();
            const tradeAmount = parseInt(args[3]);

            if (isNaN(tradeAmount) || tradeAmount < 1) {
                 await conn.reply(m.chat, `📊 La cantidad debe ser un número válido mayor o igual a 1.`, m);
                  // Save database before returning
                  saveDatabase(db);
                 return;
            }
            if (!RESOURCE_VALUES[tradeItem]) {
                 await conn.reply(m.chat, `🛒 Artículo '${tradeItem}' no válido para comerciar. Artículos comerciables: ${Object.keys(RESOURCE_VALUES).join(', ')}.`, m);
                  // Save database before returning
                  saveDatabase(db);
                 return;
            }

            const itemValue = RESOURCE_VALUES[tradeItem];

            if (tradeAction === 'sell' || tradeAction === 'vender') {
                // Use the Spanish key for cargo access
                if (user.cargo[tradeItem] === undefined || user.cargo[tradeItem] < tradeAmount) {
                     await conn.reply(m.chat, `📊 No tienes suficiente ${tradeItem} para vender. Solo tienes ${user.cargo[tradeItem] || 0}.`, m);
                      // Save database before returning
                      saveDatabase(db);
                     return;
                }
                const goldEarned = itemValue * tradeAmount;
                user.cargo[tradeItem] -= tradeAmount;
                user.credits += goldEarned;
                await conn.reply(m.chat, `💰 Vendiste ${tradeAmount} unidades de ${tradeItem} por ${goldEarned} créditos.`, m);

            } else if (tradeAction === 'buy' || tradeAction === 'comprar') {
                const totalCost = itemValue * tradeAmount;
                 if (user.credits < totalCost) {
                     await conn.reply(m.chat, `💰 No tienes suficientes créditos para comprar ${tradeAmount} unidades de ${tradeItem}. Necesitas ${totalCost}. Tienes ${user.credits}.`, m);
                      // Save database before returning
                      saveDatabase(db);
                     return;
                 }
                 const cargoWeight = getCurrentCargoWeight(user.cargo);
                 if (cargoWeight + tradeAmount > user.cargoCapacity) {
                     const canBuy = user.cargoCapacity - cargoWeight;
                     await conn.reply(m.chat, `📦 No tienes suficiente espacio de carga para comprar ${tradeAmount} unidades de ${tradeItem}. Solo puedes llevar ${canBuy} unidades más.`, m);
                      // Save database before returning
                      saveDatabase(db);
                     return;
                 }

                user.credits -= totalCost;
                // Use the Spanish key for cargo access
                user.cargo[tradeItem] = (user.cargo[tradeItem] || 0) + tradeAmount; // Add to cargo, initialize if needed
                await conn.reply(m.chat, `🛍️ Compraste ${tradeAmount} unidades de ${tradeItem} por ${totalCost} créditos.`, m);

            } else {
                 await conn.reply(m.chat, `💰 Acción de comercio no válida. Usa 'comprar' o 'vender'.`, m);
                  // Save database before returning
                  saveDatabase(db);
                 return; // Don't save if invalid action
            }
            break; // Break after successful trade

        case 'prices':
        case 'precios':
             let pricesText = "🛒 *Precios Actuales del Mercado (Compra/Venta):*\n\n";
             // Iterate through RESOURCE_VALUES which has Spanish keys
             for (const item in RESOURCE_VALUES) {
                 const value = RESOURCE_VALUES[item];
                 pricesText += `• ${item.charAt(0).toUpperCase() + item.slice(1)}: ${value} créditos\n`;
             }
             pricesText += "\n(Estos precios son fijos en esta simulación)";
             await conn.reply(m.chat, pricesText, m);
             break;


        case 'jump':
        case 'saltar':
             if (user.fuel < FUEL_COST_PER_JUMP) {
                 await conn.reply(m.chat, `⛽ Necesitas ${FUEL_COST_PER_JUMP} de combustible para realizar un salto espacial. Tienes ${user.fuel}.`, m);
                  // Save database before returning
                  saveDatabase(db);
                 return;
             }
             if (args.length < 2) {
                 await conn.reply(m.chat, `🌌 Debes especificar el sector al que quieres saltar.\n\nEjemplo: ${usedPrefix}space jump Sector 002\n(En esta simulación, puedes saltar a cualquier nombre de sector que elijas)`, m);
                  // Save database before returning
                  saveDatabase(db);
                 return;
             }
             const targetSector = args.slice(1).join(' ');
             if (targetSector === user.location) {
                 await conn.reply(m.chat, `😅 Ya estás en el sector ${targetSector}.`, m);
                  // Save database before returning
                  saveDatabase(db);
                 return;
             }

             user.fuel -= FUEL_COST_PER_JUMP;
             user.location = targetSector;
             await conn.reply(m.chat, `🌌 Realizando salto espacial... ¡Llegaste al sector ${user.location}!`, m);
             break;

         case 'attack':
         case 'atacar':
            if (!m.mentionedJid || m.mentionedJid.length === 0) {
                await conn.reply(m.chat, `⚔️ Debes especificar a quién quieres atacar.\n\nEjemplo: ${usedPrefix}space attack @usuario`, m);
                 // Save database before returning
                 saveDatabase(db);
                return;
            }
            if (currentTime - user.lastCombat < COOLDOWN_COMBAT) {
                const timeLeft = COOLDOWN_COMBAT - (currentTime - user.lastCombat);
                await conn.reply(m.chat, `⏱️ Tu nave necesita recargar armas y sistemas. Puedes atacar de nuevo en ${formatCooldownTime(timeLeft)}.`, m);
                 // Save database before returning
                 saveDatabase(db);
                return;
            }

            const targetPilotJid = m.mentionedJid[0];
            if (targetPilotJid === m.sender) {
                await conn.reply(m.chat, `😅 No puedes atacarte a ti mismo.`, m);
                 // Save database before returning
                 saveDatabase(db);
                return;
            }

             // Ensure target exists in DB (create if not, though attacking non-existent user is weird)
             if (!db.spaceUsers[targetPilotJid]) {
                 db.spaceUsers[targetPilotJid] = getDefaultUserData(targetPilotJid, conn.getName(targetPilotJid) || `Piloto_${targetPilotJid.split('@')[0]}`);
             }
             const targetPilot = db.spaceUsers[targetPilotJid];

             // Simple combat simulation
             let combatLog = `⚔️ *¡Combate Espacial Iniciado!* ⚔️\n\n`;
             combatLog += `🚀 '${user.shipName}' (Casco: ${user.hull}, Escudos: ${user.shields}) vs 🚀 '${targetPilot.shipName}' (Casco: ${targetPilot.hull}, Escudos: ${targetPilot.shields})\n\n`;

             const attackerDamage = Math.floor(Math.random() * (user.weaponLevel * 10)) + 10;
             // Use a simple evasion based on a random factor
             const targetEvasion = Math.random() * 20; // Max 20 evasion

             if (attackerDamage > targetEvasion) {
                 let damageDealt = attackerDamage - Math.floor(targetPilot.shields * 0.5); // Shields absorb some damage
                 if (damageDealt < 0) damageDealt = 0;

                 targetPilot.shields -= damageDealt;
                 if (targetPilot.shields < 0) {
                     const hullDamage = Math.abs(targetPilot.shields);
                     targetPilot.shields = 0;
                     targetPilot.hull -= hullDamage;
                     combatLog += `💥 '${user.shipName}' impactó a '${targetPilot.shipName}' por ${damageDealt} daño, rompiendo sus escudos y dañando el casco en ${hullDamage}.`;
                 } else {
                     combatLog += `🛡️ '${user.shipName}' impactó los escudos de '${targetPilot.shipName}' por ${damageDealt} daño. Escudos restantes: ${targetPilot.shields}.`;
                 }
             } else {
                 combatLog += `💨 '${user.shipName}' atacó, pero '${targetPilot.shipName}' evadió el disparo.`;
             }

             combatLog += `\n\n❤️ Casco de '${targetPilot.shipName}': ${targetPilot.hull}/${targetPilot.maxHull}`;

             if (targetPilot.hull <= 0) {
                 targetPilot.hull = 0;
                 combatLog += `\n\n✅ ¡Victoria! Derrotaste a '${targetPilot.shipName}'.`;
                 user.kills = (user.kills || 0) + 1;
                 targetPilot.deaths = (targetPilot.deaths || 0) + 1;
                 // Add potential rewards (scrap, credits)
                 const scrapReward = Math.floor(Math.random() * 10) + 5;
                 const creditReward = Math.floor(Math.random() * 100) + 50;
                 user.cargo.chatarra = (user.cargo.chatarra || 0) + scrapReward; // Use Spanish key
                 user.credits += creditReward;
                 combatLog += `\nRecogiste ${scrapReward} Chatarra y ${creditReward} créditos de los restos.`;

             } else {
                 // Simple counter-attack simulation
                 const targetDamage = Math.floor(Math.random() * (targetPilot.weaponLevel * 8)) + 8;
                 const attackerEvasion = Math.random() * 20; // Max 20 evasion

                 if (targetDamage > attackerEvasion) {
                      let damageDealt = targetDamage - Math.floor(user.shields * 0.5);
                      if (damageDealt < 0) damageDealt = 0;

                      user.shields -= damageDealt;
                      if (user.shields < 0) {
                          const hullDamage = Math.abs(user.shields);
                          user.shields = 0;
                          user.hull -= hullDamage;
                          combatLog += `\n💥 '${targetPilot.shipName}' contraatacó a '${user.shipName}' por ${damageDealt} daño, rompiendo tus escudos y dañando el casco en ${hullDamage}.`;
                      } else {
                          combatLog += `\n🛡️ '${targetPilot.shipName}' contraatacó los escudos de '${user.shipName}' por ${damageDealt} daño. Escudos restantes: ${user.shields}.`;
                      }
                 } else {
                     combatLog += `\n💨 '${targetPilot.shipName}' contraatacó, pero '${user.shipName}' evadió el disparo.`;
                 }
                 combatLog += `\n\n❤️ Tu Casco: ${user.hull}/${user.maxHull}`;

                 if (user.hull <= 0) {
                     user.hull = 0;
                     combatLog += `\n\n❌ ¡Derrotado! Tu nave ha sido destruida.`;
                     user.deaths = (user.deaths || 0) + 1;
                     targetPilot.kills = (targetPilot.kills || 0) + 1;
                     // Add penalty (lose resources, credits, etc.)
                     const penaltyCredits = Math.floor(user.credits * 0.1);
                     user.credits -= penaltyCredits;
                      if (user.credits < 0) user.credits = 0;
                     combatLog += `\nPerdiste ${penaltyCredits} créditos.`;
                 }
             }

             user.lastCombat = currentTime; // Apply cooldown
             await conn.reply(m.chat, combatLog, m, { mentions: [m.sender, targetPilotJid] }); // Mention both users

            break;


        // --- Unrecognized Space Sub-command ---
        default:
            // If a subcommand was provided but not recognized
            const defaultText = `Comando espacial '${subCommand}' no reconocido. Usa ${usedPrefix}space help para ver los comandos disponibles.`;
            await conn.reply(m.chat, defaultText, m);
    }

    // --- Save Database after processing a command ---
    saveDatabase(db);
};

// --- Export the handler function ---
// This assumes your bot framework expects a default export for command handlers
export default handler;

// --- Add handler properties (adjust based on your framework) ---
handler.help = ['space', 'space <comando>'];
handler.tags = ['rpg', 'game']; // Or your relevant tags
handler.command = ['space']; // The main command to trigger this handler

