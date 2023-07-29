import { stat } from "fs";
import csvUtilities, {
  syncArrayToCsv,
  arrayToCsv,
  convertNumbersInArray,
  csvToArray,
  stripQuotesInArray,
} from "./utilities/csv.mjs";

let year = "1994";
let state = "Massachusetts";
let start = 2;

csvToArray("csvbad.csv").then((totals) => {
  stripQuotesInArray(totals);
  convertNumbersInArray(totals);
  for (let i = 0; i < totals.length; ++i) {
    let newRow = [totals[i][0]];
    // console.log(totals[i][1], totals[i][3], totals[i][5]);
    if (Math.max(totals[i][start], totals[i][start + 2]/*, totals[i][start + 4]*/) === totals[i][start + 2]) {
      newRow.push("Daniel H Chamberlain");
      newRow.push("Republican");
      newRow.push(totals[i][start + 2]);
    } else if (
      Math.max(totals[i][start], totals[i][start + 2]/*, totals[i][start + 4]*/) === totals[i][start]
    ) {
      newRow.push("Wade Hampton III");
      newRow.push("Democrat");
      newRow.push(totals[i][start]);
    } else {
      newRow.push("James Strom Thurmond");
      newRow.push("Dixiecrat");
      newRow.push(Math.max(totals[i][start], totals[i][start + 2], totals[i][start + 4]/*, totals[i][start + 6]/**/));
    }
    totals[i] = newRow;
  }
  console.log(totals);
  syncArrayToCsv(totals, `../db/Gubernatorial/${year}/${state}.csv`);
});