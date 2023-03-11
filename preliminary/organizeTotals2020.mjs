import { stat } from "fs";
import csvUtilities, {
  syncArrayToCsv,
  arrayToCsv,
  convertNumbersInArray,
  csvToArray,
  stripQuotesInArray,
} from "./utilities/csv.mjs";

csvToArray("electionTotals.csv").then((totals) => {
  stripQuotesInArray(totals);
  convertNumbersInArray(totals);

  let colNames = totals[0];
  let states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District Of Columbia",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  let awe = [];
  for (let i = 1; i < totals.length; ++i) {
    if (totals[i][0] == 2020) {
      awe.push(totals[i]);
    }
  }

  let electionTotals2020 = [];
  let seenCounties = [];
  for (let i = 0; i < awe.length; ++i) {
    let countySet = [];
    if (!seenCounties.includes(awe[i][3])) {
      seenCounties.push(awe[i][3]);
      let countyIndices = [];
      for (let j = 0; j < awe.length; ++j) {
        if (awe[j][3] == awe[i][3]) {
          countySet.push(awe[j]);
        }
      }
      electionTotals2020.push(countySet);
    }
  }

  let stateElectionTotals2020 = [];
  for (let i = 0; i < states.length; ++i) {
    let stateResults = [];
    for (let j = 0; j < electionTotals2020.length; ++j) {
      if (normalCapitalize(electionTotals2020[j][0][1], true) == states[i]) {
        stateResults.push(electionTotals2020[j]);
      }
    }
    stateElectionTotals2020.push(stateResults);
  }

  console.log(colNames);

  //important indices in stateElectionTotals2020[0][1][0] are:
  //  -county name is 3
  //  -candidate name is 6
  //  -candidate party is 7
  //  -candidate votes is 8
  //  -total votes is 9

  console.log(stateElectionTotals2020[2][0]);

  for (let i = 0; i < stateElectionTotals2020.length; ++i) {
    for (let j = 0; j < stateElectionTotals2020[i].length; ++j) {
      let alreadySeen = [];
      let newCandidatesTotals = [];
      for (let k = 0; k < stateElectionTotals2020[i][j].length; ++k) {
        if (
          !alreadySeen.includes([
            stateElectionTotals2020[i][j][k][3],
            stateElectionTotals2020[i][j][k][6],
          ])
        ) {
          alreadySeen.push([
            stateElectionTotals2020[i][j][k][3],
            stateElectionTotals2020[i][j][k][6],
          ]);
          let newCandidateTotals = stateElectionTotals2020[i][j][k];
          newCandidateTotals[8] = 0;
          newCandidateTotals[11] = "TOTAL";
          for (let l = 0; l < stateElectionTotals2020[i][j].length; ++l) {
            if (
              [
                stateElectionTotals2020[i][j][k][3],
                stateElectionTotals2020[i][j][k][6],
              ] ==
              [
                stateElectionTotals2020[i][j][l][3],
                stateElectionTotals2020[i][j][l][6],
              ]
            ) {
              newCandidateTotals[8] =
                newCandidateTotals[8] + stateElectionTotals2020[i][j][l][8];
            }
          }
          newCandidatesTotals.push(newCandidateTotals);
        }
      }
      stateElectionTotals2020[i][j] = newCandidatesTotals;
    }
  }

  console.log(stateElectionTotals2020[2][0]);

  // for (let i = 0; i < stateElectionTotals2020.length; ++i) {
  //   for (let j = 0; j < stateElectionTotals2020[i].length; ++j) {
  //     let candidateVotes = [];
  //     for (let k = 0; k < stateElectionTotals2020[i][j].length; ++k) {
  //       candidateVotes.push(stateElectionTotals2020[i][j][k][8]);
  //     }
  //     for (let l = 0; l < stateElectionTotals2020[i][j].length; ++l) {
  //       if (
  //         stateElectionTotals2020[i][j][l][8] == getMaxOfArray(candidateVotes)
  //       ) {
  //         stateElectionTotals2020[i][j] = [
  //           normalCapitalize(stateElectionTotals2020[i][j][l][3], true),
  //           normalCapitalize(stateElectionTotals2020[i][j][l][6], true),
  //           normalCapitalize(stateElectionTotals2020[i][j][l][7], true),
  //           Math.round(
  //             100 *
  //               ((100 * stateElectionTotals2020[i][j][l][8]) /
  //                 stateElectionTotals2020[i][j][l][9])
  //           ) / 100,
  //         ];
  //       }
  //     }
  //   }
  // }

  // let pathYear = 2020;
  // for (let i = 0; i < stateElectionTotals2020.length; ++i) {
  //   let pathState = states[i];
  //   syncArrayToCsv(
  //     stateElectionTotals2020[i],
  //     `../db/Presidential Races/${pathYear}/${pathState}.csv`
  //   );
  // }
});

function normalCapitalize(theStr, isName) {
  if (!isName) {
    return theStr.charAt(0).toUpperCase() + theStr.slice(1).toLowerCase();
  }
  let normalStr = normalCapitalize(theStr.split(" ")[0], false);
  for (let i = 1; i < theStr.split(" ").length; ++i) {
    normalStr = normalStr.concat(
      " " + normalCapitalize(theStr.split(" ")[i], false)
    );
  }
  return normalStr;
}

function getMaxOfArray(array) {
  let aewr = array;
  aewr.sort(function (a, b) {
    return a - b;
  });
  return aewr[aewr.length - 1];
}

// console.log(getMaxOfArray([1, 3, 5, 7, 2, 4, -1, 234, -1234]));
