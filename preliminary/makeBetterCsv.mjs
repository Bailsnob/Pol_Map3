import { stat } from "fs";
import csvUtilities, {
  syncArrayToCsv,
  arrayToCsv,
  convertNumbersInArray,
  csvToArray,
  stripQuotesInArray,
} from "./utilities/csv.mjs";

csvToArray("electionTotals.csv").then((electionTotals) => {
  stripQuotesInArray(electionTotals);
  convertNumbersInArray(electionTotals);
  for (let i = 0; i < electionTotals.length; ++i){
    let oldRow = electionTotals[i];
    let newRow = []
  }
})