import colorize from "./colorizerRewritten.mjs";

colorize(
  "Massachusetts", // strState
  "../db/Presidential Races/2000/Massachusetts.csv", // urlElectionData
  "./BlankMapsBW/MassachusettsCounty.png", // urlBlankMap
  "BlankMapSizes.csv", // urlBlankMapSizes
  "./CountyCoordsbyState/Massachusetts.csv", // urlSeeds
  "./CountyMapsOutline/MassachusettsCountyOutline.png", // urlOverlay
  "./ColoredMaps/Presidential Races/2000/Massachusetts.png", // urlResult
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
