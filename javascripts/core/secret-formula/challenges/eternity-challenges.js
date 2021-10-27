"use strict";

GameDatabase.challenges.eternity = [
  {
    id: 1,
    description: "Time Dimensions are disabled.",
    goal: new Decimal("1e1800"),
    goalIncrease: new Decimal("1e200"),
    reward: {
      description: "Time Dimension multiplier based on time spent this Eternity",
      effect: completions =>
        Decimal.pow(Math.max(player.records.thisEternity.time / 10, 0.9), 0.3 + (completions * 0.05)),
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 2,
    description: "Infinity Dimensions are disabled.",
    goal: new Decimal("1e975"),
    goalIncrease: new Decimal("1e175"),
    reward: {
      description: "1st Infinity Dimension multiplier based on Infinity Power",
      effect: completions => Currency.infinityPower.value.pow(1.5 / (700 - completions * 100)).clampMin(1),
      cap: new Decimal("1e100"),
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 3,
    description: "Antimatter Dimensions 5-8 don't produce anything. Dimensional Sacrifice is disabled.",
    goal: new Decimal("1e600"),
    goalIncrease: new Decimal("1e75"),
    reward: {
      description: () => `Increase the multiplier for buying ${formatInt(10)} Antimatter Dimensions`,
      effect: completions => completions * 0.72,
      formatEffect: value => `+${format(value, 2, 2)}`
    }
  },
  {
    id: 4,
    description: "All Infinity multipliers and generators are disabled.",
    goal: new Decimal("1e2750"),
    goalIncrease: new Decimal("1e550"),
    restriction: completions => Math.max(16 - 4 * completions, 0),
    checkRestriction: restriction => Currency.infinities.lte(restriction),
    formatRestriction: restriction => `in ${quantifyInt("Infinity", restriction)} or less`,
    failedRestriction: "(Too many Infinities for more)",
    reward: {
      description: "Infinity Dimension multiplier based on unspent Infinity Points",
      effect: completions => Currency.infinityPoints.value.pow(0.003 + completions * 0.002),
      cap: new Decimal("1e200"),
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 5,
    description: () => `Antimatter Galaxy cost increase scaling starts immediately (normally at ${formatInt(100)}
      Galaxies). Dimension Boost costs scaling is massively increased.`,
    goal: new Decimal("1e750"),
    goalIncrease: new Decimal("1e400"),
    reward: {
      description: "Distant Galaxy cost scaling starts later",
      effect: completions => completions * 5,
      formatEffect: value => `${quantifyInt("Antimatter Galaxy", value)} later`
    }
  },
  {
    id: 6,
    description: () => {
      if (Enslaved.isRunning) {
        return Notations.current === Notation.shi
          ? "Y̶o̶u̶ ̶c̶a̶n̶'̶t̶ ̶g̶a̶i̶n̶ ̶A̶n̶t̶i̶m̶a̶t̶t̶e̶r̶ ̶G̶a̶l̶a̶x̶i̶e̶s̶ ̶n̶o̶r̶m̶a̶l̶l̶y̶,̶ ̶b̶u̶t̶ ̶the " +
            " cost of upgrading your max Replicanti Galaxies is massively reduced."
          : "You c㏰'퐚 gai鸭 Ant꟢matterﻪﶓa⁍axie㮾랜䂇rma㦂l the cost of upgrading your max Replicanti" +
            " Galaxies is massively reduced";
      }
      return "You can't gain Antimatter Galaxies normally, but the cost of upgrading your max Replicanti" +
              " Galaxies is massively reduced.";
    },
    goal: new Decimal("1e850"),
    goalIncrease: new Decimal("1e250"),
    reward: {
      description: "Further reduce Antimatter Dimension cost multiplier growth",
      effect: completions => completions * 0.2,
      formatEffect: value => {
        const total = Math.round(Player.dimensionMultDecrease + Effects.sum(EternityChallenge(6).reward)) - value;
        return `-${format(value, 2, 1)} (${formatX(total, 2, 1)} total)`;
      }
    }
  },
  {
    id: 7,
    description:
      "1st Time Dimension produces 8th Infinity Dimensions, and 1st Infinity Dimension produces " +
      "7th Antimatter Dimensions. Tickspeed also directly applies to Infinity and Time Dimensions.",
    goal: new Decimal("1e2000"),
    goalIncrease: new Decimal("1e530"),
    effect: () => TimeDimension(1).productionPerSecond,
    reward: {
      description: "1st Time Dimension produces 8th Infinity Dimensions",
      effect: completions => TimeDimension(1).productionPerSecond.pow(completions * 0.2).minus(1).clampMin(0),
      formatEffect: value => `${format(value, 2, 1)} per second`
    }
  },
  {
    id: 8,
    description: () => `You can only upgrade Infinity Dimensions ${formatInt(50)} times and Replicanti
      upgrades ${formatInt(40)} times. Infinity Dimension and Replicanti upgrade autobuyers are disabled.`,
    goal: new Decimal("1e1300"),
    goalIncrease: new Decimal("1e900"),
    reward: {
      description: "Infinity Power strengthens Replicanti Galaxies",
      effect: completions => {
        const infinityPower = Math.log10(Currency.infinityPower.value.pLog10() + 1);
        return Math.max(0, Math.pow(infinityPower, 0.03 * completions) - 1);
      },
      formatEffect: value => formatPercents(value, 2)
    }
  },
  {
    id: 9,
    description:
      `You can't buy Tickspeed upgrades. Infinity Power instead multiplies
      Time Dimensions with greatly reduced effect.`,
    goal: new Decimal("1e1750"),
    goalIncrease: new Decimal("1e250"),
    reward: {
      description: "Infinity Dimension multiplier based on Time Shards",
      effect: completions => Currency.timeShards.value.pow(completions * 0.1).clampMin(1),
      cap: new Decimal("1e400"),
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 10,
    description: () => {
      let description = `Time Dimensions and Infinity Dimensions are disabled. You gain an immense boost from
        Infinities to Antimatter Dimensions (Infinities${formatPow(950)}).`;
      EternityChallenge(10).applyEffect(v => description += ` Currently: ${formatX(v, 2, 1)}`);
      return description;
    },
    goal: new Decimal("1e3000"),
    goalIncrease: new Decimal("1e300"),
    effect: () => Decimal.pow(Currency.infinitiesTotal.value, 950).clampMin(1).pow(TimeStudy(31).effectOrDefault(1)),
    reward: {
      description: "Time Dimension multiplier based on Infinities",
      effect: completions => {
        const mult = Currency.infinitiesTotal.value.times(2.783e-6).pow(0.4 + 0.1 * completions).clampMin(1);
        return mult.powEffectOf(TimeStudy(31));
      },
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 11,
    description:
      `All dimension multipliers and powers are disabled except for the multipliers from
      Infinity Power and Dimension Boosts (to Antimatter Dimensions).`,
    goal: new Decimal("1e500"),
    goalIncrease: new Decimal("1e200"),
    reward: {
      description: "Further reduce Tickspeed cost multiplier growth",
      effect: completions => completions * 0.07,
      formatEffect: value => {
        const total = Math.round(Player.tickSpeedMultDecrease + Effects.sum(EternityChallenge(11).reward)) - value;
        return `-${format(value, 2, 2)} (${formatX(total, 2, 2)} total)`;
      }
    }
  },
  {
    id: 12,
    description: () => (PlayerProgress.realityUnlocked()
      ? `The game runs ×${formatInt(1000)} slower; all other gamespeed effects are disabled.`
      : `The game runs ×${formatInt(1000)} slower.`),
    goal: new Decimal("1e110000"),
    goalIncrease: new Decimal("1e12000"),
    restriction: completions => Math.max(10 - 2 * completions, 1) / 10,
    checkRestriction: restriction => Time.thisEternity.totalSeconds < restriction,
    formatRestriction: restriction => `in ${quantify("in-game second", restriction, 0, 1)} or less.`,
    failedRestriction: "(Too slow for more)",
    reward: {
      description: "Infinity Dimension cost multipliers are reduced",
      effect: completions => 1 - completions * 0.008,
      formatEffect: value => `x${formatPow(value, 3, 3)}`
    }
  }
];
