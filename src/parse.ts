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

export function getCardImageFileName(name: string) {
  let image;

  switch (name) {
    case "AI Assistant Module":
      image = "AIAssistModule";
    case "Experimental Stimulants":
      image = "ExperimentalStims";
    case "Large Caliber Rounds":
      image = "LargeCaliberAmmo";
    case "Magician's Apprentice":
      image = "Magician";
    case "Suppressing Fire":
      image = "SuppressiveFire";
    case "Wasteland Chef":
      image = "ChefsKnife";
    case "Ugly Chachkies":
      image = "QuickLearner";
    case "Stealthy Passage":
      image = "Infiltrator";
    case "Soften Up":
      image = "BatterUp";
    case "Ether Bomb":
      image = "ShockAndAwe";
    case "Phosphorous Tipped":
      image = "Overheat";
    case "Food Scavenger":
      image = "LunchTime";
    case "Empowered Assault":
      image = "ChainReaction";
    case "Sonic Disruptor":
      image = "ConcussiveBlast";
    case "Defensive Maneuver":
      image = "EvasiveAction";
    case "Belligerent":
      image = "Flawless";
    case "Cleansing Fire":
      image = "HotStuff";
    case "Drone Spotter":
      image = "MotionSensor.png";
    default:
      image = name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .map((word) => {
          const result: string[] = [];

          for (const c of word) {
            if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || (c >= "0" && c <= "9")) {
              result.push(c);
            }
          }

          return result.join("");
        })
        .join("")
        .concat(".png");

      return image;
  }
}
