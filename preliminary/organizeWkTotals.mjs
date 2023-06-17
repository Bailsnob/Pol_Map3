import { stat } from "fs";
import csvUtilities, {
  syncArrayToCsv,
  arrayToCsv,
  convertNumbersInArray,
  csvToArray,
  stripQuotesInArray,
} from "./utilities/csv.mjs";

let year = "1968";
let state = "Washington";
let start = 2;

csvToArray("csvbad.csv").then((totals) => {
  stripQuotesInArray(totals);
  convertNumbersInArray(totals);
  for (let i = 0; i < totals.length; ++i) {
    let newRow = [totals[i][0]];
    // console.log(totals[i][1], totals[i][3], totals[i][5]);
    if (Math.max(totals[i][start], totals[i][start + 2], totals[i][start + 4]) === totals[i][start]) {
      newRow.push("Richard M Nixon");
      newRow.push("Republican");
      newRow.push(totals[i][start]);
    } else if (
      Math.max(totals[i][start], totals[i][start + 2], totals[i][start + 4]) === totals[i][start + 2]
    ) {
      newRow.push("George McGovern");
      newRow.push("Democrat");
      newRow.push(totals[i][start + 2]);
    } else {
      newRow.push("Ross Perot");
      newRow.push("Independent");
      newRow.push(Math.max(totals[i][start], totals[i][start + 2], totals[i][start + 4], totals[i][start + 6]/**/));
    }
    totals[i] = newRow;
  }
  console.log(totals);
  syncArrayToCsv(totals, `../db/Presidential Races/${year}/${state}.csv`);
});
