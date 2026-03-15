let modInfo = {
	name: "Interstellar Exploration Report: USS Odyssey",
	id: "uss_odyssey_v1399",
	author: "Algarvod914",
	pointsName: "Potential Energy",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(10), // Start with a bit of juice for the sensors
	offlineLimit: 1,  // Hours to keep offline production
}

// Set your game variables
let doDebug = false

// Use this to determine the point generation
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)

	// --- ROW 0 EFFECTS ---
	if (hasUpgrade("nav", 11)) gain = gain.times(upgradeEffect("nav", 11))
	if (hasUpgrade("nav", 12)) gain = gain.times(upgradeEffect("nav", 12))

	// --- ROW 1 EFFECTS ---
	// Note: We use .pow() for stars because they are "Titans of Fusion"
	if (hasUpgrade("starA", 11)) gain = gain.pow(upgradeEffect("starA", 11))
	if (getBuyableAmount("starB", 11).gte(1)) gain = gain.pow(buyableEffect("starB", 11))

	// --- ROW 2 EFFECTS (The Encounter) ---
	if (hasUpgrade("worm", 11)) gain = gain.pow(upgradeEffect("worm", 11))
	if (hasUpgrade("worm", 12)) gain = gain.times(upgradeEffect("worm", 12)) // Massive static boost
	if (getBuyableAmount("blackout", 11).gte(1)) gain = gain.pow(buyableEffect("blackout", 11))
	if (hasUpgrade("science", 11)) gain = gain.pow(upgradeEffect("science", 11))

	// --- ROW 3 EFFECTS (The Logs) ---
	if (hasUpgrade("log", 11)) gain = gain.pow(upgradeEffect("log", 11))
	if (hasUpgrade("log", 12)) gain = gain.pow(upgradeEffect("log", 12))
	if (getBuyableAmount("eval", 11).gte(1)) gain = gain.pow(buyableEffect("eval", 11))

	// --- ROW 4 EFFECTS (The End Game) ---
	if (getBuyableAmount("end", 11).gte(1)) gain = gain.pow(buyableEffect("end", 11))

	return gain
}

// Win condition: 10^15,000,000,000
function winCondition() {
	return player.points.gte(new Decimal("1e15000000000"))
}

// Custom display in the "Things" section
var displayThings = [
	() => {
		if (player.points.gt("1e1000000")) return "Status: Ship under tow by USS Hera"
		if (player.points.gt("1e1000")) return "Status: SOP Updates in progress"
		if (player.points.gt("1e100")) return "Status: Recovering from Total Blackout"
		if (player.points.gt("1e10")) return "Status: Entity 'Double Star Worm' attached to hull"
		return "Status: Spectroscopic survey of V1399 Ophiuchi in progress"
	},
	"Current Sector: Sector 7-G, Ophiuchus Constellation"
]

// Determine when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("1e15000000000"))
}

// --- DO NOT EDIT BELOW ---

function canGenPoints(){
	return true
}

function gainMult() {
	return new Decimal(1)
}

function gainExp() {
	return new Decimal(1)
}

function update(diff) {
}

function addedPlayerData() { return {
}}

function backgroundStyle() {
	return {
		"background-color": "#00050a" // Deep space blue/black
	}
}
