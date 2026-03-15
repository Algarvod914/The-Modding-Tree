addLayer("od", {
    name: "Odyssey",
    symbol: "OD",
    position: 1.5,
    row: 0,
    color: "#3252a8",
    resource: "Odyssey Points",
    baseResource: "Odyssey Points",
    baseAmount() { return player.od.points },
    requires: new Decimal(0),
    type: "normal",
    exponent: 0.5,
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(10),
        }
    },
    gainMult() {
        let mult = new Decimal(1)
        for (let i = 12; i <= 15; i++) {
            if (hasUpgrade('od', i)) mult = mult.times(upgradeEffect('od', i))
        }
        mult = mult.times(getBuyableAmount('od', 11).times(0.02).plus(1));
        mult = mult.times(getBuyableAmount('od', 31).times(0.01).plus(1));
        return mult
    },
    gainExp() { return new Decimal(1) },

    autoPrestige: false,
    canReset() { return player.od.points.gte("1e15000") },

    doReset(resettingLayer) {
        if (resettingLayer === "od") {
            player.prestigeGainBoost = (player.prestigeGainBoost || 1) + 1;
        }
    },

    layerShown() { return true; },

    update(diff) {
        // NaN defense and synchronizing player.points == player.od.points
        if (!(player.od && player.od.points instanceof Decimal) || isNaN(player.od.points.mag) || !isFinite(player.od.points.mag)) {
            player.od.points = new Decimal(10);
        }
        if (!(player.points instanceof Decimal) || isNaN(player.points.mag) || !isFinite(player.points.mag)) {
            player.points = new Decimal(player.od.points);
        }
        // Always keep points in sync (OD is points!)
        player.points = player.od.points;
    },

    passiveGeneration() {
        let gen = new Decimal(0);
        if (hasUpgrade('od', 11)) gen = gen.plus(1);
        if (hasUpgrade('od', 22)) gen = gen.plus(getBuyableAmount('od', 22).times(0.5));
        return gen;
    },

    upgrades: {
        rows: 4,
        cols: 5,
        11: {
            title: "Stardust Initiation",
            description: "Begin the Odyssey. Generates 1 Odyssey Point per second.",
            cost: new Decimal(10),
        },
        12: {
            title: "Cosmic Charting",
            description: "Multiply Odyssey Point gain by 3.",
            cost: new Decimal(50),
            effect() { return new Decimal(3); }
        },
        13: {
            title: "Nebula Navigators",
            description: "Multiply Odyssey Point gain by 5.",
            cost: new Decimal(200),
            effect() { return new Decimal(5); }
        },
        14: {
            title: "Stellar Computation",
            description: "Multiply Odyssey Point gain by 8.",
            cost: new Decimal(1000),
            effect() { return new Decimal(8); }
        },
        15: {
            title: "Galactic Synergy",
            description: "Multiply Odyssey Point gain by 12.",
            cost: new Decimal(7500),
            effect() { return new Decimal(12); }
        },
        16: {
            title: "Automated Propulsion",
            description: "Automates Cosmic Thrusters buyable.",
            cost: new Decimal(40000),
            unlocked() { return hasUpgrade('od', 15); }
        },
        17: {
            title: "Dark Matter Sails",
            description: "Automates Astropulse buyable.",
            cost: new Decimal(120000),
            unlocked() { return hasUpgrade('od', 16); }
        },
        18: {
            title: "Harmonic Sensors",
            description: "Automates Quantum Sensors buyable.",
            cost: new Decimal(400000),
            unlocked() { return hasUpgrade('od', 17); }
        },
        19: {
            title: "Gravity Modulators",
            description: "Automates Wormhole Engineers buyable.",
            cost: new Decimal(1500000),
            unlocked() { return hasUpgrade('od', 18); }
        },
        20: {
            title: "Interstellar Markets",
            description: "Automates Space Markets buyable.",
            cost: new Decimal(6000000),
            unlocked() { return hasUpgrade('od', 19); }
        },
        21: {
            title: "Exotic Data Streams",
            description: "Boost all Odyssey buyables' effect by 25%.",
            cost: new Decimal(2.5e7),
            unlocked() { return hasUpgrade('od', 20); }
        },
        22: {
            title: "Wormhole Sync",
            description: "Unlock Odyssey buyable synergy (buyables boost each other).",
            cost: new Decimal(1.5e8),
            unlocked() { return hasUpgrade('od', 21); }
        },
        23: {
            title: "Intergalactic Diplomacy",
            description: "Upgrade and buyable costs are reduced by 25%.",
            cost: new Decimal(9e8),
            unlocked() { return hasUpgrade('od', 22); }
        },
        24: {
            title: "Paradox Shields",
            description: "Keep passive Odyssey generation on reset.",
            cost: new Decimal(6e9),
            unlocked() { return hasUpgrade('od', 23); }
        },
        25: {
            title: "Voyager Memories",
            description: "Milestones are kept on reset.",
            cost: new Decimal(4e10),
            unlocked() { return hasUpgrade('od', 24); }
        },
        26: {
            title: "Singularity Step",
            description: "Unlock new minigame features.",
            cost: new Decimal(2.5e11),
            unlocked() { return hasUpgrade('od', 25); }
        },
        27: {
            title: "Relativity Rigs",
            description: "Further multiply Odyssey gain based on buyables owned.",
            cost: new Decimal(1.7e12),
            unlocked() { return hasUpgrade('od', 26); },
            effect() {
                let amt = totalBuyables()
                return new Decimal(1.05).pow(amt);
            },
            effectDisplay() {
                return `Currently ×${format(this.effect())}`
            }
        },
        28: {
            title: "Transcendental Charts",
            description: "Boosts the effect of all upgrades.",
            cost: new Decimal(1.3e13),
            unlocked() { return hasUpgrade('od', 27); }
        },
        29: {
            title: "Universal Synergy",
            description: "All buyables and upgrades are 10% stronger.",
            cost: new Decimal(8e13),
            unlocked() { return hasUpgrade('od', 28); }
        },
        30: {
            title: "Odyssey Ascension",
            description: "Reach for the Odyssey's end: 10^15,000 Odyssey Points.",
            cost: new Decimal(6e14),
            unlocked() { return hasUpgrade('od', 29); }
        },
    },

    buyables: {
        rows: 3,
        cols: 3,
        11: {
            title: "Cosmic Thrusters",
            cost(x) {
                let base = new Decimal(250);
                if (hasUpgrade('od', 23)) base = base.times(0.75);
                return base.times(Decimal.pow(2, x));
            },
            display() {
                let amt = getBuyableAmount("od", 11);
                return `Increase Odyssey gain by +2% per level<br>
                        Amount: ${amt}<br>
                        Cost: ${format(this.cost(amt))} OD<br>
                        Effect: ×${format(this.effect())}`;
            },
            canAfford() { return player.od.points.gte(this.cost(getBuyableAmount("od", 11))) },
            buy() {
                let amt = getBuyableAmount("od", 11);
                player.od.points = player.od.points.sub(this.cost(amt));
                setBuyableAmount("od", 11, amt.plus(1));
            },
            effect() {
                let amt = getBuyableAmount("od", 11);
                let boost = Decimal.pow(1.02, amt);
                if (hasUpgrade('od', 21)) boost = boost.times(1.25);
                if (hasUpgrade('od', 29)) boost = boost.times(1.1);
                return boost;
            }
        },
        12: {
            title: "Astropulse Collectors",
            cost(x) {
                let base = new Decimal(700);
                if (hasUpgrade('od', 23)) base = base.times(0.75);
                return base.times(Decimal.pow(2.15, x));
            },
            display() {
                let amt = getBuyableAmount("od", 12);
                return `Automate upgrades at certain milestones<br>
                        Amount: ${amt}<br>
                        Cost: ${format(this.cost(amt))} OD<br>
                        Effect: +${amt * 1.5}% Odyssey gain`;
            },
            canAfford() { return player.od.points.gte(this.cost(getBuyableAmount("od", 12))) },
            buy() {
                let amt = getBuyableAmount("od", 12);
                player.od.points = player.od.points.sub(this.cost(amt));
                setBuyableAmount("od", 12, amt.plus(1));
            },
            effect() {
                let amt = getBuyableAmount("od", 12);
                let boost = amt * 1.5;
                if (hasUpgrade('od', 21)) boost *= 1.25;
                if (hasUpgrade('od', 29)) boost *= 1.1;
                return boost;
            }
        },
        13: {
            title: "Quantum Sensors",
            cost(x) {
                let base = new Decimal(2000);
                if (hasUpgrade('od', 23)) base = base.times(0.75);
                return base.times(Decimal.pow(2.32, x));
            },
            display() {
                let amt = getBuyableAmount("od", 13);
                return `Increase Odyssey gain by +1% per level<br>
                        Amount: ${amt}<br>
                        Cost: ${format(this.cost(amt))} OD<br>
                        Effect: +${amt}% Odyssey gain`;
            },
            canAfford() { return player.od.points.gte(this.cost(getBuyableAmount("od", 13))) },
            buy() {
                let amt = getBuyableAmount("od", 13);
                player.od.points = player.od.points.sub(this.cost(amt));
                setBuyableAmount("od", 13, amt.plus(1));
            },
            effect() {
                let amt = getBuyableAmount("od", 13);
                let boost = amt;
                if (hasUpgrade('od', 21)) boost *= 1.25;
                if (hasUpgrade('od', 29)) boost *= 1.1;
                return boost;
            }
        },
        21: {
            title: "Gravity Modulators",
            cost(x) {
                let base = new Decimal(6000);
                if (hasUpgrade('od', 23)) base = base.times(0.75);
                return base.times(Decimal.pow(2.5, x));
            },
            display() {
                let amt = getBuyableAmount("od", 21);
                return `Reduce other buyable costs by 1% per level<br>
                        Amount: ${amt}<br>
                        (applies on purchase)<br>
                        Effect: -${amt}% buyable cost`;
            },
            canAfford() { return player.od.points.gte(this.cost(getBuyableAmount("od", 21))) },
            buy() {
                let amt = getBuyableAmount("od", 21);
                player.od.points = player.od.points.sub(this.cost(amt));
                setBuyableAmount("od", 21, amt.plus(1));
            },
            effect() {
                let amt = getBuyableAmount("od", 21);
                let red = amt;
                if (hasUpgrade('od', 21)) red *= 1.25;
                if (hasUpgrade('od', 29)) red *= 1.1;
                return red;
            }
        },
        22: {
            title: "Wormhole Engineers",
            cost(x) {
                let base = new Decimal(30000);
                if (hasUpgrade('od', 23)) base = base.times(0.75);
                return base.times(Decimal.pow(2.7, x));
            },
            display() {
                let amt = getBuyableAmount("od", 22);
                return `Boosts Odyssey passive gain by +0.5/s each<br>
                        Amount: ${amt}<br>
                        Cost: ${format(this.cost(amt))} OD<br>
                        Effect: +${amt * 0.5} OD/s`;
            },
            canAfford() { return player.od.points.gte(this.cost(getBuyableAmount("od", 22))) },
            buy() {
                let amt = getBuyableAmount("od", 22);
                player.od.points = player.od.points.sub(this.cost(amt));
                setBuyableAmount("od", 22, amt.plus(1));
            },
            effect() {
                let amt = getBuyableAmount("od", 22);
                let out = amt * 0.5;
                if (hasUpgrade('od', 21)) out *= 1.25;
                if (hasUpgrade('od', 29)) out *= 1.1;
                return out;
            }
        },
        23: {
            title: "Space Markets",
            cost(x) {
                let base = new Decimal(90000);
                if (hasUpgrade('od', 23)) base = base.times(0.75);
                return base.times(Decimal.pow(2.78, x));
            },
            display() {
                let amt = getBuyableAmount("od", 23);
                return `Increase max Odyssey Points by 3% per level<br>
                        Amount: ${amt}<br>
                        Cost: ${format(this.cost(amt))} OD<br>
                        Effect: +${amt * 3}% max OD`;
            },
            canAfford() { return player.od.points.gte(this.cost(getBuyableAmount("od", 23))) },
            buy() {
                let amt = getBuyableAmount("od", 23);
                player.od.points = player.od.points.sub(this.cost(amt));
                setBuyableAmount("od", 23, amt.plus(1));
            },
            effect() {
                let amt = getBuyableAmount("od", 23);
                let out = amt * 3;
                if (hasUpgrade('od', 21)) out *= 1.25;
                if (hasUpgrade('od', 29)) out *= 1.1;
                return out;
            }
        },
        31: {
            title: "Quantum Navigators",
            cost(x) {
                let base = new Decimal(300000);
                if (hasUpgrade('od', 23)) base = base.times(0.75);
                return base.times(Decimal.pow(2.9, x));
            },
            display() {
                let amt = getBuyableAmount("od", 31);
                return `Multiply all Odyssey upgrade effects by +1% per level<br>
                        Amount: ${amt}<br>
                        Cost: ${format(this.cost(amt))} OD<br>
                        Effect: +${amt}% all upgrades`;
            },
            canAfford() { return player.od.points.gte(this.cost(getBuyableAmount("od", 31))) },
            buy() {
                let amt = getBuyableAmount("od", 31);
                player.od.points = player.od.points.sub(this.cost(amt));
                setBuyableAmount("od", 31, amt.plus(1));
            },
            effect() {
                let amt = getBuyableAmount("od", 31);
                let out = amt;
                if (hasUpgrade('od', 21)) out *= 1.25;
                if (hasUpgrade('od', 29)) out *= 1.1;
                return out;
            }
        },
        32: {
            title: "Synergy Relays",
            cost(x) {
                let base = new Decimal(1e6);
                if (hasUpgrade('od', 23)) base = base.times(0.75);
                return base.times(Decimal.pow(2.98, x));
            },
            display() {
                let amt = getBuyableAmount("od", 32);
                return `Multiply all buyables' effects by 1% per level<br>
                        Amount: ${amt}<br>
                        Cost: ${format(this.cost(amt))} OD<br>
                        Effect: +${amt}% all buyables effect`;
            },
            canAfford() { return player.od.points.gte(this.cost(getBuyableAmount("od", 32))) },
            buy() {
                let amt = getBuyableAmount("od", 32);
                player.od.points = player.od.points.sub(this.cost(amt));
                setBuyableAmount("od", 32, amt.plus(1));
            },
            effect() {
                let amt = getBuyableAmount("od", 32);
                let out = amt;
                if (hasUpgrade('od', 21)) out *= 1.25;
                if (hasUpgrade('od', 29)) out *= 1.1;
                return out;
            }
        },
        33: {
            title: "Temporal Conflux",
            cost(x) {
                let base = new Decimal(2.5e6);
                if (hasUpgrade('od', 23)) base = base.times(0.75);
                return base.times(Decimal.pow(3.02, x));
            },
            display() {
                let amt = getBuyableAmount("od", 33);
                return `Chance to double Odyssey gain (+0.2% per level)<br>
                        Amount: ${amt}<br>
                        Cost: ${format(this.cost(amt))} OD<br>
                        Effect: +${(amt * 0.2).toFixed(2)}% double gain`;
            },
            canAfford() { return player.od.points.gte(this.cost(getBuyableAmount("od", 33))) },
            buy() {
                let amt = getBuyableAmount("od", 33);
                player.od.points = player.od.points.sub(this.cost(amt));
                setBuyableAmount("od", 33, amt.plus(1));
            },
            effect() {
                let amt = getBuyableAmount("od", 33);
                let out = amt * 0.2;
                if (hasUpgrade('od', 21)) out *= 1.25;
                if (hasUpgrade('od', 29)) out *= 1.1;
                return out;
            }
        },
    },

    milestones: {
        0: {
            requirementDescription: "Reach 10^15,000 Odyssey Points",
            effectDescription: "You have completed the Interstellar Space Odyssey.",
            done() { return player.od.points.gte("1e15000"); }
        }
    },

    tabFormat: [
        "main-display",
        ["display-text", "Welcome to the Interstellar Space Odyssey. Earn Odyssey Points by exploring upgrades and buyables themed after cosmic wonders!"],
        "prestige-button",
        "milestones",
        "upgrades",
        "buyables",
        ["infobox", "about"]
    ],

    infoboxes: {
        about: {
            title: "Layer Lore",
            body:
                `The Odyssey layer is inspired by <b>Interstellar Space Odyssey</b>. 
                <br>Progress through cosmic upgrades and buyables, uncovering mysteries of space and time.
                <br>This mini-game permanently boosts your progression with every Odyssey reset.
                <br><a href="https://github.com/Algarvod914/HD-158729-odyssey-protocol" target="_blank">HD 158729 Odyssey Protocol on GitHub</a>`
        }
    }
});

// Helper for total buyables
function totalBuyables() {
    let total = new Decimal(0);
    [11,12,13,21,22,23,31,32,33].forEach(id => {
        total = total.plus(getBuyableAmount("od", id));
    });
    return total;
}
