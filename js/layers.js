// USS ODYSSEY: FEDERATION STARFLEET EXPLORATION REPORT
// End Game: 1e15000000000 Points

// ==========================================
// ROW 0: 1 Layer (Pre-Encounter Navigational Data)
// ==========================================
addLayer("nav", {
    name: "Pre-Encounter",
    symbol: "N",
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10),
    resource: "Navigational Scans",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.5,
    row: 0,
    hotkeys: [{key: "n", description: "N: Reset for Navigational Scans", onPress(){if (canReset(this.layer)) doReset(this.layer)}}],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Clear the Oort Cloud",
            description: "Begin long-range spectroscopic surveys. Multiplies point gain by 5.",
            cost: new Decimal(1),
        },
        12: {
            title: "Subspace Distortion",
            description: "The gravity well of the binary system boosts point gain based on Nav Scans.",
            cost: new Decimal(5),
            effect() {
                return player[this.layer].points.add(1).pow(0.5);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "Enter V1399 Ophiuchi",
            description: "Unlock the Binary Stars.",
            cost: new Decimal(25),
        },
    },
});

// ==========================================
// ROW 1: 2 Layers (Ophiuchi A and Ophiuchi B)
// ==========================================
addLayer("starA", {
    name: "V1399 Ophiuchi A",
    symbol: "A",
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#FFD700",
    requires: new Decimal(100),
    resource: "Solar Mass",
    baseResource: "Navigational Scans",
    baseAmount() { return player.nav.points },
    type: "static",
    exponent: 1.2,
    row: 1,
    layerShown(){return hasUpgrade("nav", 13) || player[this.layer].unlocked},
    branches: ["nav"],
    upgrades: {
        11: {
            title: "G7IIIa Yellow Giant",
            description: "A titan of fusion. 6.82x solar mass. Squares point generation.",
            cost: new Decimal(1),
        },
        12: {
            title: "Magnitude 7.2 Earthquake",
            description: "2,335 times the luminosity of Sol. Exponentially boosts Nav Scans.",
            cost: new Decimal(3),
        }
    }
});

addLayer("starB", {
    name: "V1399 Ophiuchi B",
    symbol: "B",
    position: 1,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#00BFFF",
    requires: new Decimal(100),
    resource: "UV Radiation",
    baseResource: "Navigational Scans",
    baseAmount() { return player.nav.points },
    type: "normal",
    exponent: 0.8,
    row: 1,
    layerShown(){return hasUpgrade("nav", 13) || player[this.layer].unlocked},
    branches: ["nav"],
    buyables: {
        11: {
            title: "B8V Main-Sequence Heat",
            cost(x) { return new Decimal(10).pow(x.pow(1.5)) },
            display() { return "11,698 Kelvin surface temperature.\nCost: " + format(this.cost()) + " UV Radiation\nEffect: Points generation ^" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { return new Decimal(1.1).pow(x) }
        }
    }
});

// ==========================================
// ROW 2: 3 Layers (Worm, Blackout, Science)
// ==========================================
addLayer("worm", {
    name: "Macro-Biological Entity",
    symbol: "W",
    position: 0,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#8A2BE2",
    requires: new Decimal(1e6),
    resource: "Electromagnetic Wakes",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.25,
    row: 2,
    layerShown(){return (hasUpgrade("starA", 12) && getBuyableAmount("starB", 11).gte(2)) || player[this.layer].unlocked},
    branches: ["starA"],
    upgrades: {
        11: {
            title: "Crystalline Scales",
            description: "Organic solar panels absorb pure potential. Point gain is raised to the power of 1.5.",
            cost: new Decimal(100),
        },
        12: {
            title: "Target Acquired",
            description: "It senses the M/ARA signature. Automates Row 1 layers.",
            cost: new Decimal(5000),
        }
    }
});

addLayer("blackout", {
    name: "Total Blackout",
    symbol: "BLK",
    position: 1,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#111111",
    requires: new Decimal(1e10),
    resource: "Stolen Energy",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "static",
    exponent: 2,
    row: 2,
    layerShown(){return player.worm.unlocked || player[this.layer].unlocked},
    branches: ["starA", "starB"],
    buyables: {
        11: {
            title: "Phase Reversal",
            cost(x) { return new Decimal(1).add(x) },
            display() { return "The Worm drinks the ship's EPS grid.\nCost: " + format(this.cost()) + " Stolen Energy\nEffect: Point gain exponentiated by ^" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { return new Decimal(2).pow(x) } // Massive exponential growth jump
        }
    }
});

addLayer("science", {
    name: "Biological Obs.",
    symbol: "SCI",
    position: 2,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#00FF7F",
    requires: new Decimal(1e8),
    resource: "Data Packets",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.2,
    row: 2,
    layerShown(){return player.worm.unlocked || player[this.layer].unlocked},
    branches: ["starB"],
    upgrades: {
        11: {
            title: "Harmonic Matching (60Hz)",
            description: "Electric intelligence matches Odyssey's frequency. Points ^2.",
            cost: new Decimal(1000),
        },
        12: {
            title: "0.5% Capacity Detachment",
            description: "The worm lets go, drifting to the B-type star. Unlocks Row 3.",
            cost: new Decimal(1e6),
        }
    }
});

// ==========================================
// ROW 3: 2 Layers (Logs, Evaluation)
// ==========================================
addLayer("log", {
    name: "Exploration Log",
    symbol: "L",
    position: 0,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#F5DEB3",
    requires: new Decimal("1e100"),
    resource: "Chronological Ticks",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.05,
    row: 3,
    layerShown(){return hasUpgrade("science", 12) || player[this.layer].unlocked},
    branches: ["worm", "blackout"],
    upgrades: {
        11: {
            title: "0400-0800: Survey",
            description: "High-res mapping. Points ^5.",
            cost: new Decimal(10),
        },
        12: {
            title: "1043-1057: The Silent Period",
            description: "Bioluminescence in the dark. Points ^10.",
            cost: new Decimal(100),
        }
    }
});

addLayer("eval", {
    name: "Mission Evaluation",
    symbol: "E",
    position: 1,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#DC143C",
    requires: new Decimal("1e150"),
    resource: "SOP Updates",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "static",
    exponent: 5,
    row: 3,
    layerShown(){return hasUpgrade("science", 12) || player[this.layer].unlocked},
    branches: ["blackout", "science"],
    buyables: {
        11: {
            title: "Run 'Cold' Protocols",
            cost(x) { return new Decimal(1).add(x) },
            display() { return "Minimize emissions. Exponential Point Boost.\nCost: " + format(this.cost()) + " SOP Updates\nEffect: Points ^" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { return new Decimal(10).pow(x) } 
        }
    }
});

// ==========================================
// ROW 4: 1 Layer (Starbase 42 Recalibration - End Game)
// ==========================================
addLayer("end", {
    name: "Starbase 42",
    symbol: "SB42",
    position: 0,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#FFFFFF",
    requires: new Decimal("1e1000"),
    resource: "Recalibration Matrices",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.001,
    row: 4,
    layerShown(){return (hasUpgrade("log", 12) && getBuyableAmount("eval", 11).gte(1)) || player[this.layer].unlocked},
    branches: ["log", "eval"],
    buyables: {
        11: {
            title: "USS Hera Towing Protocol",
            cost(x) { return new Decimal(1).add(x) },
            display() { return "We found life where we thought only fire existed. Pushing to 1e15,000,000,000.\nCost: " + format(this.cost()) + " Matrices\nEffect: Points ^" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { return new Decimal("1e100").pow(x) } // Ridiculous growth to hit the 1e15,000,000,000 mark
        }
    },
    upgrades: {
        11: {
            title: "End of Report",
            description: "Signed, Captain [REDACTED]. Reach 1e15,000,000,000 points to finish the game.",
            cost: new Decimal(100),
            effect() {
                // Win Condition Trigger
                if (player.points.gte(new Decimal("1e15000000000"))) {
                    // TMT win condition hook could go here
                }
            }
        }
    }
});

// Update standard point generation to dynamically scale with the massive exponents
addNode("mod", {
    getPointGen() {
        if(!canGenPoints()) return new Decimal(0);
        let gain = new Decimal(1);
        
        // Multipliers
        if (hasUpgrade("nav", 11)) gain = gain.times(5);
        if (hasUpgrade("nav", 12)) gain = gain.times(upgradeEffect("nav", 12));
        
        // Exponents (This is what allows you to reach 1e15,000,000,000)
        if (hasUpgrade("starA", 11)) gain = gain.pow(2);
        if (getBuyableAmount("starB", 11).gte(1)) gain = gain.pow(buyableEffect("starB", 11));
        if (hasUpgrade("worm", 11)) gain = gain.pow(1.5);
        if (getBuyableAmount("blackout", 11).gte(1)) gain = gain.pow(buyableEffect("blackout", 11));
        if (hasUpgrade("science", 11)) gain = gain.pow(2);
        if (hasUpgrade("log", 11)) gain = gain.pow(5);
        if (hasUpgrade("log", 12)) gain = gain.pow(10);
        if (getBuyableAmount("eval", 11).gte(1)) gain = gain.pow(buyableEffect("eval", 11));
        if (getBuyableAmount("end", 11).gte(1)) gain = gain.pow(buyableEffect("end", 11));

        return gain;
    }
});
