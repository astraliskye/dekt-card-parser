import { stringify } from "querystring";
import type { CardStat, SecondaryEffect } from "./types";

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