// USS ODYSSEY: MISSION ARCHITECTURE
// Structure: 1-2-3-2-1 (The Diamond Convergence)

var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,
    treeLayout: ""
};

// This defines the visual grid of the Starfleet Exploration Report
addNode("tree-tab", {
    layers: [
        // ROW 0: Arrival
        ["nav"], 

        // ROW 1: The Binary Stars
        ["starA", "starB"], 

        // ROW 2: The Core Encounter (3 Layers)
        ["worm", "blackout", "science"], 

        // ROW 3: Post-Encounter Processing
        ["log", "eval"], 

        // ROW 4: Final Evaluation & Recovery
        ["end"] 
    ]
});

// Optional: Customizing the Tree's look to match a Starfleet Terminal
// This adds a technical 'HUD' feel to the background connections
function getTreeStyle() {
    return {
        "background-color": "#00050a", // Deep space black
        "border": "2px solid #333",    // Subtle framing
    };
}

// These are the 'links' between layers. 
// TMT usually handles these via the 'branches' property in layers.js, 
// but you can add custom logic here if needed.
