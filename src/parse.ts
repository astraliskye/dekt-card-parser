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
  switch (name) {
    case "AI Assistant Module":
      return "AIAssistModule.png";
    case "Experimental Stimulants":
      return "ExperimentalStims.png";
    case "Large Caliber Rounds":
      return "LargeCaliberAmmo.png";
    case "Magician's Apprentice":
      return "Magician.png";
    case "Suppressing Fire":
      return "SuppressiveFire.png";
    case "Wasteland Chef":
      return "ChefsKnife.png";
    case "Ugly Chachkies":
      return "QuickLearner.png";
    case "Stealthy Passage":
      return "Infiltrator.png";
    case "Soften Up":
      return "BatterUp.png";
    case "Ether Bomb":
      return "ShockAndAwe.png";
    case "Phosphorous Tipped":
      return "Overheat.png";
    case "Food Scavenger":
      return "LunchTime.png";
    case "Empowered Assault":
      return "ChainReaction.png";
    case "Sonic Disruptor":
      return "ConcussiveBlast.png";
    case "Defensive Maneuver":
      return "EvasiveAction.png";
    case "Belligerent":
      return "Flawless.png";
    case "Cleansing Fire":
      return "HotStuff.png";
    case "Drone Spotter":
      return "MotionSensor.png";
    default:
      return name
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
  }
}
