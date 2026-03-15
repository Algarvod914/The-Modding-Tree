addLayer("od", {
    name: "Odyssey",
    symbol: "OD",
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
        // Add effects from upgrades, buyables as needed here
        return mult
    },
    gainExp() { return new Decimal(1) },

    // Disable ALL Odyssey reset/prestige
    canReset() { return false; },

    layerShown() { return true; },

    update(diff) {
        // Defensive fix: points should never be NaN or undefined, always sync
        if (!(player.od && player.od.points instanceof Decimal) || isNaN(player.od.points.mag) || !isFinite(player.od.points.mag)) player.od.points = new Decimal(10);
        if (!(player.points instanceof Decimal) || isNaN(player.points.mag) || !isFinite(player.points.mag)) player.points = new Decimal(player.od.points);
        player.points = player.od.points;
    },

    upgrades: {
        /* example: 
        11: {
            title: "Start Odyssey",
            description: "Gain +1 Odyssey Point per second.",
            cost: new Decimal(10)
        }
        */
    },

    buyables: {
        /* DON'T create any buyable with key "total"!
        ONLY ids like 11, 12, etc.
        Example:
        11: {
            title: "Test Buyable",
            cost(x) { return new Decimal(100).times(Decimal.pow(1.5, x)); },
            canAfford() { return player.od.points.gte(this.cost(getBuyableAmount('od', 11))) },
            buy() {
                let amt = getBuyableAmount('od', 11);
                player.od.points = player.od.points.sub(this.cost(amt));
                setBuyableAmount('od', 11, amt.plus(1));
            },
        }
        */
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
})

// Only for calculation, never save to player!
function totalBuyables() {
    let total = new Decimal(0);
    [11,12,13,21,22,23,31,32,33].forEach(id=> total = total.plus(getBuyableAmount("od", id)));
    return total;
}
