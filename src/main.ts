import { readFile, writeFile } from "fs/promises";
import { parseCells, parseCardStats } from "./parse";

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
  const fileContents = (
    await readFile("./assets/card-compendium.csv")
  ).toString();

  const result = JSON.stringify(
    parseCells(fileContents, ",")
      .filter((row) => row[Column.DeckCategory] === "Campaign")
      .map((row) => ({
        name: row[Column.Name],
        type: row[Column.Type],
        affinity: row[Column.Affinity],
        effects: row[Column.EffectDescription],
      }))
      .map((card) => {
        const index = card.name.indexOf("(");
        if (index !== -1) card.name = card.name.substring(0, index).trim();
        return card;
      })
      .map((card) => ({
        name: card.name,
        type: card.type,
        affinty: card.affinity,
        effects: parseCardStats(card.effects),
      })),
    null,
    2
  );

  await writeFile("./output.json", result);
}

main();
