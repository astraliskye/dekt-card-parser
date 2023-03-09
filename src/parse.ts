import { CardStat } from "./types";

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

export function parseStats(effectString: string): CardStat[] {
  let parts = effectString.split("Team Effect");
  let parsingStat: boolean = false;
  let parsingAmount: boolean = false;
  let currentAmount: string[] = [];
  let currentAttribute: string[] = [];
  let result: CardStat[] = [];

  for (let i = 0; i < parts.length; i++) {
    for (let j = 0; j < parts[i].length; j++) {
      if (parts[i].charAt(j) === "-" || parts[i].charAt(j) === "+") {
        parsingStat = true;
        parsingAmount = true;
      }

      if (!parsingStat) continue;

      if (parsingAmount) {
        if (parts[i].charAt(j) === " ") {
          parsingAmount = false;
        } else {
          currentAmount.push(parts[i].charAt(j));
        }
      } else {
        if (parts[i].charAt(j) === "," || parts[i].charAt(j) === ".") {
          result.push({
            effect: currentAttribute.join("").toLowerCase(),
            amount: currentAmount.join(""),
            team: i === 0 ? false : true,
          });
          currentAttribute = [];
          currentAmount = [];
          parsingStat = false;
        } else {
          currentAttribute.push(parts[i].charAt(j));
        }
      }
    }
  }

  if (parsingStat && currentAmount.length !== 0 && currentAttribute.length !== 0) {
    result.push({
      effect: currentAttribute.join("").toLowerCase(),
      amount: currentAmount.join(""),
      team: parts.length === 1 ? false : true,
    });
  }

  return result;
}

export function getCardImageFileName(name: string) {
  let image = "";

  switch (name) {
    case "AI Assistant Module":
      image = "AIAssistModule";
      break;
    case "Experimental Stimulants":
      image = "ExperimentalStims";
      break;
    case "Large Caliber Rounds":
      image = "LargeCaliberAmmo";
      break;
    case "Magician's Apprentice":
      image = "Magician";
      break;
    case "Suppressing Fire":
      image = "SuppressiveFire";
      break;
    case "Wasteland Chef":
      image = "ChefsKnife";
      break;
    case "Ugly Chachkies":
      image = "QuickLearner";
      break;
    case "Stealthy Passage":
      image = "Infiltrator";
      break;
    case "Soften Up":
      image = "BatterUp";
      break;
    case "Ether Bomb":
      image = "ShockAndAwe";
      break;
    case "Phosphorous Tipped":
      image = "Overheat";
      break;
    case "Food Scavenger":
      image = "LunchTime";
      break;
    case "Empowered Assault":
      image = "ChainReaction";
      break;
    case "Sonic Disruptor":
      image = "ConcussiveBlast";
      break;
    case "Defensive Maneuver":
      image = "EvasiveAction";
      break;
    case "Belligerent":
      image = "Flawless";
      break;
    case "Cleansing Fire":
      image = "HotStuff";
      break;
    case "Drone Spotter":
      image = "MotionSensor";
      break;
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
        .join("");
      break;
  }

  return image ? image.concat(".webp") : "";
}
