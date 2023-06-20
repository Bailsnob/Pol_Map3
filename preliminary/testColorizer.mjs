import colorize from "./colorizerRewritten.mjs";

const year = 2020;
const states = [
  // "Alabama",
  // // "Alaska",
  // "Arizona",
  // "Arkansas",
  // "California",
  // // "Colorado",
  // "Connecticut",
  // "Delaware",
  // // "District Of Columbia",
  // "Florida",
  // "Georgia",
  // // "Hawaii",
  // "Idaho",
  // "Illinois",
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
  // "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

// for (let state of states) {
//   colorize(
//     state, // strState
//     `../db/Presidential Races/${year}/${state}.csv`, // urlElectionData
//     `./BlankMapsBW/${state.replace(" ", "")}County.png`, // urlBlankMap
//     `./data/BlankMapSizes.csv`, // urlBlankMapSizes
//     `./CountyCoordsbyState/${state}.csv`, // urlSeeds
//     `./CountyMapsOutline/${state.replace(" ", "")}CountyOutline.png`, // urlOverlay
//     `./ColoredMaps/Presidential Races/${year}/${state}.png`, // urlResult
//   ).then(() => console.log(`FINISHED COLORING: ${state}`));
// }

colorize(
  "Indiana", // strState
  "../db/Presidential Races/2020/Indiana.csv", // urlElectionData
  "./BlankMapsBW/IndianaCounty.png", // urlBlankMap
  "./data/BlankMapSizes.csv", // urlBlankMapSizes
  "./CountyCoordsbyState/Indiana.csv", // urlSeeds
  "./CountyMapsOutline/IndianaCountyOutline.png", // urlOverlay
  "./ColoredMaps/Presidential Races/2020/Indiana.png", // urlResult
).then(() => console.log("FINISHED COLORING"));

// colorize(
//   "Kansas", // strState
//   "../db/Presidential Races/2000/Kansas.csv", // urlElectionData
//   "./BlankMapsBW/KansasCounty.png", // urlBlankMap
//   "BlankMapSizes.csv", // urlBlankMapSizes
//   "./CountyCoordsbyState/Kansas.csv", // urlSeeds
//   "./CountyMapsOutline/KansasCountyOutline.png", // urlOverlay
//   "./ColoredMaps/Presidential Races/2000/Kansas.png", // urlResult
// ).then(() => console.log("FINISHED COLORING"));