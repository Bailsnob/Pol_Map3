import { stat } from "fs";
import csvUtilities, {
  syncArrayToCsv,
  arrayToCsv,
  convertNumbersInArray,
  csvToArray,
  stripQuotesInArray,
} from "./utilities/csv.mjs";

csvToArray("csvbad.csv").then((totals) => {
  stripQuotesInArray(totals);
  convertNumbersInArray(totals);
  for (let i = 0; i < totals.length; ++i) {
    let newRow = [totals[i][0]];
    // console.log(totals[i][1], totals[i][3], totals[i][5]);
    if (Math.max(totals[i][2], totals[i][4], totals[i][6]) == totals[i][2]) {
      newRow.push("Franklin D Roosevelt");
      newRow.push("Democrat");
      newRow.push(totals[i][2]);
    } else if (
      Math.max(totals[i][2], totals[i][4], totals[i][6]) == totals[i][3]
    ) {
      newRow.push("Herbert Hoover");
      newRow.push("Republican");
      newRow.push(totals[i][4]);
    } else {
      newRow.push("Other");
      newRow.push("Independent/Third Party");
      newRow.push(Math.max(totals[i][2], totals[i][4], totals[i][6]));
    }
    totals[i] = newRow;
  }
  console.log(totals);
  syncArrayToCsv(totals, "../db/Presidential Races/1932/Virginia.csv");
});
