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
  let electionTotals2000 = [];
  let electionTotals2004 = [];
  let electionTotals2008 = [];
  let electionTotals2012 = [];
  let electionTotals2016 = [];
  let electionTotals2020 = [];
  let colNames = electionTotals[0];

  //2000 election goes by 4, all others go by 3
  for (let i = 1; i < electionTotals.length; i++) {
    let year = electionTotals[i][0];
    let county = electionTotals[i][3];
    if (
      year == electionTotals[i - 1][0] &&
      county == electionTotals[i - 1][3]
    ) {
      continue;
    }
    if (year == 2000) {
      electionTotals2000.push([
        electionTotals[i],
        electionTotals[i + 1],
        electionTotals[i + 2],
        electionTotals[i + 3],
      ]);
    }
    if (year == 2004) {
      electionTotals2004.push([
        electionTotals[i],
        electionTotals[i + 1],
        electionTotals[i + 2],
      ]);
    }
    if (year == 2008) {
      electionTotals2008.push([
        electionTotals[i],
        electionTotals[i + 1],
        electionTotals[i + 2],
      ]);
    }
    if (year == 2012) {
      electionTotals2012.push([
        electionTotals[i],
        electionTotals[i + 1],
        electionTotals[i + 2],
      ]);
    }
    if (year == 2016) {
      electionTotals2016.push([
        electionTotals[i],
        electionTotals[i + 1],
        electionTotals[i + 2],
      ]);
    }
    if (year == 2020) {
      electionTotals2020.push([
        electionTotals[i],
        electionTotals[i + 1],
        electionTotals[i + 2],
      ]);
    }
  }

  let stateElectionTotals2000 = [];

  for (let i = 0; i < states.length; ++i) {
    let stateResults = [];
    for (let j = 0; j < electionTotals2000.length; ++j) {
      if (normalCapitalize(electionTotals2000[j][0][1], true) == states[i]) {
        stateResults.push(electionTotals2000[j]);
      }
    }
    stateElectionTotals2000.push(stateResults);
  }

  let stateElectionTotals2004 = [];

  for (let i = 0; i < states.length; ++i) {
    let stateResults = [];
    for (let j = 0; j < electionTotals2004.length; ++j) {
      if (normalCapitalize(electionTotals2004[j][0][1], true) == states[i]) {
        stateResults.push(electionTotals2004[j]);
      }
    }
    stateElectionTotals2004.push(stateResults);
  }

  let stateElectionTotals2008 = [];

  for (let i = 0; i < states.length; ++i) {
    let stateResults = [];
    for (let j = 0; j < electionTotals2008.length; ++j) {
      if (normalCapitalize(electionTotals2008[j][0][1], true) == states[i]) {
        stateResults.push(electionTotals2008[j]);
      }
    }
    stateElectionTotals2008.push(stateResults);
  }

  let stateElectionTotals2012 = [];

  for (let i = 0; i < states.length; ++i) {
    let stateResults = [];
    for (let j = 0; j < electionTotals2012.length; ++j) {
      if (normalCapitalize(electionTotals2012[j][0][1], true) == states[i]) {
        stateResults.push(electionTotals2012[j]);
      }
    }
    stateElectionTotals2012.push(stateResults);
  }

  let stateElectionTotals2016 = [];

  for (let i = 0; i < states.length; ++i) {
    let stateResults = [];
    for (let j = 0; j < electionTotals2016.length; ++j) {
      if (normalCapitalize(electionTotals2016[j][0][1], true) == states[i]) {
        stateResults.push(electionTotals2016[j]);
      }
    }
    stateElectionTotals2016.push(stateResults);
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

  // console.log(colNames)
  // console.log(stateElectionTotals2004[0][0]);
  //stateElectionTotals2000[0] gives the result for Alabama in 2000
  //stateElectionTotals2000[0][0] gives "Alabama"
  //stateElectionTotals2000[0][1] gives arr of the 4 candidates' results in Autaga
  //stateElectionTotals2000[0][1][0] gives an the results for Al Gore in Autaga
  //stateElectionTotals2000[0][1][0][8] gives the # votes Al Gore got in Autaga
  //important indices in stateElectionTotals2000[0][1][0] are:
  //  -county name is 3
  //  -candidate name is 6
  //  -candidate party is 7
  //  -candidate votes is 8
  //  -total votes is 9

  for (let i = 0; i < stateElectionTotals2000.length; ++i) {
    for (let j = 0; j < stateElectionTotals2000[i].length; ++j) {
      let results1 = stateElectionTotals2000[i][j][0];
      let results2 = stateElectionTotals2000[i][j][1];
      let results3 = stateElectionTotals2000[i][j][2];
      let results4 = stateElectionTotals2000[i][j][3];
      let newRow = [normalCapitalize(results1[3], true)];
      let maxVotes = Math.max(
        results1[8],
        results2[8],
        results3[8],
        results4[8]
      );

      if (results1[8] == maxVotes) {
        newRow.push(normalCapitalize(results1[6], true));
        newRow.push(normalCapitalize(results1[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results1[9])) / 100);
      }
      if (results2[8] == maxVotes) {
        newRow.push(normalCapitalize(results2[6], true));
        newRow.push(normalCapitalize(results2[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results2[9])) / 100);
      }
      if (results3[8] == maxVotes) {
        newRow.push(normalCapitalize(results3[6], true));
        newRow.push(normalCapitalize(results3[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results3[9])) / 100);
      }
      if (results4[8] == maxVotes) {
        newRow.push(normalCapitalize(results4[6], true));
        newRow.push(normalCapitalize(results4[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results4[9])) / 100);
      }
      stateElectionTotals2000[i][j] = newRow;
    }
  }

  for (let i = 0; i < stateElectionTotals2004.length; ++i) {
    for (let j = 0; j < stateElectionTotals2004[i].length; ++j) {
      let results1 = stateElectionTotals2004[i][j][0];
      let results2 = stateElectionTotals2004[i][j][1];
      let results3 = stateElectionTotals2004[i][j][2];
      let newRow = [normalCapitalize(results1[3], true)];
      let maxVotes = Math.max(results1[8], results2[8], results3[8]);

      if (results1[8] == maxVotes) {
        newRow.push(normalCapitalize(results1[6], true));
        newRow.push(normalCapitalize(results1[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results1[9])) / 100);
      }
      if (results2[8] == maxVotes) {
        newRow.push(normalCapitalize(results2[6], true));
        newRow.push(normalCapitalize(results2[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results2[9])) / 100);
      }
      if (results3[8] == maxVotes) {
        newRow.push(normalCapitalize(results3[6], true));
        newRow.push(normalCapitalize(results3[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results3[9])) / 100);
      }
      stateElectionTotals2004[i][j] = newRow;
    }
  }

  for (let i = 0; i < stateElectionTotals2008.length; ++i) {
    for (let j = 0; j < stateElectionTotals2008[i].length; ++j) {
      let results1 = stateElectionTotals2008[i][j][0];
      let results2 = stateElectionTotals2008[i][j][1];
      let results3 = stateElectionTotals2008[i][j][2];
      let newRow = [normalCapitalize(results1[3], true)];
      let maxVotes = Math.max(results1[8], results2[8], results3[8]);

      if (results1[8] == maxVotes) {
        newRow.push(normalCapitalize(results1[6], true));
        newRow.push(normalCapitalize(results1[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results1[9])) / 100);
      }
      if (results2[8] == maxVotes) {
        newRow.push(normalCapitalize(results2[6], true));
        newRow.push(normalCapitalize(results2[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results2[9])) / 100);
      }
      if (results3[8] == maxVotes) {
        newRow.push(normalCapitalize(results3[6], true));
        newRow.push(normalCapitalize(results3[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results3[9])) / 100);
      }
      stateElectionTotals2008[i][j] = newRow;
    }
  }

  for (let i = 0; i < stateElectionTotals2012.length; ++i) {
    for (let j = 0; j < stateElectionTotals2012[i].length; ++j) {
      let results1 = stateElectionTotals2012[i][j][0];
      let results2 = stateElectionTotals2012[i][j][1];
      let results3 = stateElectionTotals2012[i][j][2];
      let newRow = [normalCapitalize(results1[3], true)];
      let maxVotes = Math.max(results1[8], results2[8], results3[8]);

      if (results1[8] == maxVotes) {
        newRow.push(normalCapitalize(results1[6], true));
        newRow.push(normalCapitalize(results1[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results1[9])) / 100);
      }
      if (results2[8] == maxVotes) {
        newRow.push(normalCapitalize(results2[6], true));
        newRow.push(normalCapitalize(results2[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results2[9])) / 100);
      }
      if (results3[8] == maxVotes) {
        newRow.push(normalCapitalize(results3[6], true));
        newRow.push(normalCapitalize(results3[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results3[9])) / 100);
      }
      stateElectionTotals2012[i][j] = newRow;
    }
  }

  for (let i = 0; i < stateElectionTotals2016.length; ++i) {
    for (let j = 0; j < stateElectionTotals2016[i].length; ++j) {
      let results1 = stateElectionTotals2016[i][j][0];
      let results2 = stateElectionTotals2016[i][j][1];
      let results3 = stateElectionTotals2016[i][j][2];
      let newRow = [normalCapitalize(results1[3], true)];
      let maxVotes = Math.max(results1[8], results2[8], results3[8]);

      if (results1[8] == maxVotes) {
        newRow.push(normalCapitalize(results1[6], true));
        newRow.push(normalCapitalize(results1[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results1[9])) / 100);
      }
      if (results2[8] == maxVotes) {
        newRow.push(normalCapitalize(results2[6], true));
        newRow.push(normalCapitalize(results2[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results2[9])) / 100);
      }
      if (results3[8] == maxVotes) {
        newRow.push(normalCapitalize(results3[6], true));
        newRow.push(normalCapitalize(results3[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results3[9])) / 100);
      }
      stateElectionTotals2016[i][j] = newRow;
    }
  }

  for (let i = 0; i < stateElectionTotals2020.length; ++i) {
    for (let j = 0; j < stateElectionTotals2020[i].length; ++j) {
      let results1 = stateElectionTotals2020[i][j][0];
      let results2 = stateElectionTotals2020[i][j][1];
      let results3 = stateElectionTotals2020[i][j][2];
      let newRow = [normalCapitalize(results1[3], true)];
      let maxVotes = Math.max(results1[8], results2[8], results3[8]);

      if (results1[8] == maxVotes) {
        newRow.push(normalCapitalize(results1[6], true));
        newRow.push(normalCapitalize(results1[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results1[9])) / 100);
      }
      if (results2[8] == maxVotes) {
        newRow.push(normalCapitalize(results2[6], true));
        newRow.push(normalCapitalize(results2[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results2[9])) / 100);
      }
      if (results3[8] == maxVotes) {
        newRow.push(normalCapitalize(results3[6], true));
        newRow.push(normalCapitalize(results3[7], false));
        newRow.push(Math.round(100 * ((100 * maxVotes) / results3[9])) / 100);
      }
      stateElectionTotals2020[i][j] = newRow;
    }
  }

  let pathYear = 2000;
  for (let i = 0; i < stateElectionTotals2000.length; ++i) {
    let pathState = states[i].replace(/ /g, "");
    syncArrayToCsv(
      stateElectionTotals2000[i],
      `../db/Presidential Races/${pathYear}/${pathState}.csv`
    );
  }
  pathYear = 2004;
  for (let i = 0; i < stateElectionTotals2004.length; ++i) {
    let pathState = states[i];
    syncArrayToCsv(
      stateElectionTotals2004[i],
      `../db/Presidential Races/${pathYear}/${pathState}.csv`
    );
  }
  pathYear = 2008;
  for (let i = 0; i < stateElectionTotals2008.length; ++i) {
    let pathState = states[i];
    syncArrayToCsv(
      stateElectionTotals2008[i],
      `../db/Presidential Races/${pathYear}/${pathState}.csv`
    );
  }
  pathYear = 2012;
  for (let i = 0; i < stateElectionTotals2012.length; ++i) {
    let pathState = states[i];
    syncArrayToCsv(
      stateElectionTotals2012[i],
      `../db/Presidential Races/${pathYear}/${pathState}.csv`
    );
  }
  pathYear = 2016;
  for (let i = 0; i < stateElectionTotals2016.length; ++i) {
    let pathState = states[i];
    syncArrayToCsv(
      stateElectionTotals2016[i],
      `../db/Presidential Races/${pathYear}/${pathState}.csv`
    );
  }
  pathYear = 2020;
  for (let i = 0; i < stateElectionTotals2020.length; ++i) {
    let pathState = states[i];
    syncArrayToCsv(
      stateElectionTotals2020[i],
      `../db/Presidential Races/${pathYear}/${pathState}.csv`
    );
  }
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

// console.log(normalCapitalize("ALABAMA", false));
