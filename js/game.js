// USS ODYSSEY: MISSION CONTROL ENGINE (game.js)
// VERSION: V0.1

var player;
var needNilAndEmpty = false;
var fps = 60;

// The main loop that drives the Odyssey's systems
function setIntervals() {
	setInterval(function () {
		gameLoop();
	}, 1000 / fps);
}

function gameLoop() {
	if (player === undefined) return;
	let now = Date.now();
	let diff = (now - player.lastUpdate) / 1000;
	if (diff < 0) diff = 0;
	if (player.offTime.remaining > 0) {
		let max = player.offTime.remaining;
		diff += Math.min(max, diff);
		player.offTime.remaining -= Math.min(max, diff);
	}
	player.lastUpdate = now;

	if (isNaN(diff) || diff < 0) diff = 0;

	// Point Production Logic
	if (canGenPoints()) {
		player.points = player.points.add(getPointGen().times(diff));
	}

	// Update all 9 exploration layers
	for (let layer in layers) {
		if (layers[layer].update) layers[layer].update(diff);
	}

	// Check for the 1e15,000,000,000 Win Condition
	if (isEndgame() && !player.keepGoing) {
		alert("MISSION SUCCESS: USS Odyssey has reached Starbase 42. Report Uploaded.");
		player.keepGoing = true;
	}
}

// Ensure the browser tab reflects the exploration status
function updateTabTitle() {
	document.title = "USS Odyssey - " + format(player.points) + " Potential";
}

setInterval(updateTabTitle, 500);
