import { stat } from "fs";
import csvUtilities, {
  syncArrayToCsv,
  arrayToCsv,
  convertNumbersInArray,
  csvToArray,
  stripQuotesInArray,
} from "./utilities/csv.mjs";
import { join } from "path";

export function organizeAKTotals(inputFileName, outputFileName) {
  csvToArray(inputFileName).then((data) => {
    convertNumbersInArray(data);
    let cols = data[0];
    let pctsIndices = [];
    for (let i = 0; i < cols.length; ++i) {
      if (cols[i].includes("TPCT")) pctsIndices.push(i);
    }
    console.log(pctsIndices);

    for (let rowIndex = 1; rowIndex < data.length - 2; ++rowIndex) {
      let oldRow = data[rowIndex];
      let newRow = [oldRow[0]];
      console.log(newRow);
      let pcts = [];
      for (let pctIndex in pctsIndices) {
        pcts.push(oldRow[pctIndex] * 100);
      }
      for (let pctIndex in pctsIndices) {
        if (Math.max(...pcts) === oldRow[pctsIndices[0]]) {
          newRow.push(cols[pctsIndices[0]].substring(4));
          newRow.push("Democrat");
        } else if (Math.max(...pcts) === oldRow[pctsIndices[1]]) {
          newRow.push(cols[pctsIndices[0]].substring(4));
          newRow.push("Republican");
        } else {
          newRow.push(cols[pctIndex].substring(4));
          newRow.push("Independent");
        }
      }
      newRow.push(Math.max(...pcts));
      data[rowIndex] = newRow;
    }
    arrayToCsv(data, outputFileName);
  });
}
