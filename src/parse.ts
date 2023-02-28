import type { CardStat } from "./types";

export function parseCells(contents: string, delimiter: string): string[][] {
  const rows = contents.split("\r\n");
  const result: string[][] = new Array();

  for (const row of rows) {
    let current: string[] = new Array();
    let enclosed: [string, boolean] = ['"', false];

    result.push(new Array());

    for (let i = 0; i < row.length; i++) {
      if (!enclosed[1] && row.charAt(i) === delimiter) {
        result[result.length - 1].push(current.join("").trim());
        current = new Array();
      } else if (!enclosed[1] && row.charAt(i) === '"') {
        enclosed = [row.charAt(i), true];
      } else if (enclosed && row.charAt(i) === enclosed[0]) {
        enclosed[1] = false;
      } else {
        current.push(row.charAt(i));
      }
    }
  }

  return result;
}

export function parseCardStats(effects: string): number[] {
  const result: number[] = [];
  const parts = effects.split("Team Effects");
  const nonTeam = parts[0]?.split(" ") || [];
  const team = parts[1]?.split(" ") || [];

  for (let i = 0; i < nonTeam.length; i++) {
    if (nonTeam[i].charAt(0) === "+" || nonTeam[i].charAt(0) === "-") {
      const amount = parseInt(nonTeam[i]);
    }
  }

  return result;
}
