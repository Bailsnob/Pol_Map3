import { organizeAKTotals } from "./organizeAKTotals.mjs";

let year = 1960;
organizeAKTotals(
  `./AKTotals/alaska${year}.csv`,
  `../db/Presidential Races/${year}/Alaska.csv`
);
