import colorize from "./colorizerRewritten.mjs";

colorize(
  "Arizona", // strState
  "../db/Presidential Races/1932/Arizona.csv", // urlElectionData
  "./BlankMapsBW/ArizonaCounty.png", // urlBlankMap
  "BlankMapSizes.csv", // urlBlankMapSizes
  "./CountyCoordsbyState/Arizona.csv", // urlSeeds
  "./CountyMapsOutline/ArizonaCountyOutline.png", // urlOverlay
  "./ColoredMaps/Presidential Races/1932/Arizona.png", // urlResult
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
