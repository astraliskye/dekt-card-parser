import { readFile, writeFile } from "fs/promises";
import { getCardImageFileName, parseCells, parseStats } from "./parse";

enum Column {
  DeckCategory,
  Type,
  Affinity,
  TeamEffects,
  Name,
  EffectDescription,
  SupplyLine,
}

async function main() {
  const fileContents = (await readFile("./assets/card-compendium.csv")).toString();

  const result = JSON.stringify(
    {
      cards: parseCells(fileContents, ",")
        .filter(
          // Select all campaign cards, filter out stat cards
          (row) =>
            row[Column.DeckCategory].toLowerCase().trim() === "campaign" &&
            row[Column.Type].toLowerCase().trim() !== "stat"
        )
        .map((row) => ({
          // Select the columns we're interested in (the Column enum becomes useless after this)
          name: row[Column.Name],
          type: row[Column.Type],
          affinity: row[Column.Affinity],
          effects: row[Column.EffectDescription],
        }))
        .map((card) => {
          // Remove alternate card names
          const index = card.name.indexOf("(");
          if (index !== -1) card.name = card.name.substring(0, index).trim();
          return card;
        })
        .filter((card) => {
          // Filter out cards users can't use in decks
          switch (card.name) {
            case "Emergency Transfusion":
            case "Explosive Boils":
            case "Heads, You Lose":
            case "Smells Like Victory":
            case "Unnatural Healing":
            case "Team Support Slot":
            case "Team Stamina":
            case "Team Support Item Upgrade":
            case "Team Quick Slot":
            case "Team Quick Item Upgrade":
            case "Team Offensive Slot":
            case "Team Offensive Item Upgrade":
            case "Team Health":
            case "Team Ammo":
            case "Stamina":
            case "Health":
            case "Fortune":
            case "Ammo":
              return false;
            default:
              return true;
          }
        })
        .map((card) => {
          // For now, this only serves to exclude effects, until I can find a reliable way to parse
          let result = {
            name: card.name,
            type: card.type,
            affinity: card.affinity,
            image: getCardImageFileName(card.name),
            stats: parseStats(card.effects),
          };

          return result;
        }),
    },
    null,
    2
  );

  await writeFile("./output.json", result);
}

main();
