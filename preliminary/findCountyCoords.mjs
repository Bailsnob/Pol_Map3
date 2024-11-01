import { stat } from "fs";
import csvUtilities, {
  syncArrayToCsv,
  arrayToCsv,
  convertNumbersInArray,
  csvToArray,
  stripQuotesInArray,
} from "./utilities/csv.mjs";
import jsonUtilities, { jsonToObjLiteral } from "./utilities/json.mjs";


getBlankMapSizes().then((sizes) => {
  getStateBoundaries().then((boundaries) => {
    getCountyLatLngs().then((countyLatLngs) => {
      // taking the data for the size of the pictures, the states, and the county coordinates
      for (let i = 1; i < sizes.length; ++i) {
        let sizesData = sizes[i];
        let stateName = sizesData[0];
        let boundariesData = undefined;
        let seedPointArr = [];
        for (let key in boundaries) {
          let boundary = boundaries[key];
          if (boundary.name === stateName) {
            boundariesData = boundary;
            break;
          }
        } // finding the specific boundary for the state in question
        if (!boundariesData) { // failsafe in case the boundary data isn't ready yet
          console.error("No boundary matched " + stateName + ".");
          return;
        }
        for (let j = 1; j < countyLatLngs.length; ++j) {
          if (countyLatLngs[j][1] === stateName) {
            let countyPixelCoords = findSeedPoint(
              0,
              sizesData[1],
              0,
              sizesData[2],
              [countyLatLngs[j][2], countyLatLngs[j][3]],
              boundariesData.max_lat,
              boundariesData.min_lat,
              boundariesData.max_lng,
              boundariesData.min_lng
            ); // dilating the county's latitude longitude coordinates into pixel coordinates
            seedPointArr.push([
              countyLatLngs[j][0],
              countyPixelCoords[0],
              countyPixelCoords[1],
            ]); // adding the pixel coordinates for that county into the seed point array
          }
        }
        syncArrayToCsv( // creating a csv containing every state's county coordinates
          seedPointArr,
          "./CountyCoordsbyState/" + stateName + ".csv"
        );
      }
    });
  });
});

function findSeedPoint(
  minX,
  maxX,
  minY,
  maxY,
  countyLatLng,
  maxLat,
  minLat,
  maxLong,
  minLong
) { 
  // dilating the x and y of the county latitude longitude coordinates into
  // pixel coordinates to maximize accuracy
  return [
    ((countyLatLng[1] - minLong) * (maxX - minX)) / (maxLong - minLong) + minX,
    maxY -
      (((countyLatLng[0] - minLat) * (maxY - minY)) / (maxLat - minLat) + minY),
  ];
}

function getBlankMapSizes() {
  return new Promise((resolve, reject) => {
    csvToArray("BlankMapSizes.csv").then((results) => {
      stripQuotesInArray(results); // taking away any quotes in the csv
      convertNumbersInArray(results); // converting all numbers into ints to be malleable
      resolve(results);
    });
  });
}

function getStateBoundaries() {
  return new Promise((resolve, reject) => {
    let results = jsonToObjLiteral("stateBoundaries.json"); // turning the state boundary latitude longitudes into a malleable object literal
    resolve(results);
  });
}

function getCountyLatLngs() {
  //important rows are 0, 5, 6, 7
  return new Promise((resolve, reject) => {
    csvToArray("uscounties.csv").then((rawData) => {
      for (let row = 0; row < rawData.length; ++row) {
        let oldRow = rawData[row];
        let replacementRow = [oldRow[0], oldRow[5], oldRow[6], oldRow[7]];
        rawData[row] = replacementRow; // taking only important county info
      }
      stripQuotesInArray(rawData); // taking away quotes
      convertNumbersInArray(rawData); // converting all numbers into usable ints
      resolve(rawData);
    });
  });
}