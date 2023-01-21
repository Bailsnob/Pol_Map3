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
      //note: sizes produces an error where the quotes are not removed and numbers are not made
      //note: boundaries works fine
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
        }
        if (!boundariesData) {
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
            );
            seedPointArr.push([
              countyLatLngs[j][0],
              countyPixelCoords[0],
              countyPixelCoords[1],
            ]);
          }
        }
        syncArrayToCsv(seedPointArr, "./CountyCoordsbyState/" + stateName + ".csv");
      }
    });
  });
});

//new issue, this function does not account for the negative y principle
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
  return [
    ((countyLatLng[1] - minLong) * (maxX - minX)) / (maxLong - minLong) + minX,
    maxY - (((countyLatLng[0] - minLat) * (maxY - minY)) / (maxLat - minLat) + minY),
  ];
}

function getBlankMapSizes() {
  return new Promise((resolve, reject) => {
    csvToArray("BlankMapSizes.csv").then((results) => {
      stripQuotesInArray(results);
      convertNumbersInArray(results);
      resolve(results);
    });
  });
}

function getStateBoundaries() {
  return new Promise((resolve, reject) => {
    let results = jsonToObjLiteral("stateBoundaries.json");
    resolve(results);
  });
}

function getCountyLatLngs() {
  //important rows ar 0, 5, 6, 7
  return new Promise((resolve, reject) => {
    csvToArray("uscounties.csv").then((rawData) => {
      for (let row = 0; row < rawData.length; ++row) {
        let oldRow = rawData[row];
        let replacementRow = [oldRow[0], oldRow[5], oldRow[6], oldRow[7]];
        rawData[row] = replacementRow;
      }

      stripQuotesInArray(rawData);
      convertNumbersInArray(rawData);
      resolve(rawData);
    });
  });
}

function strip(str) {
  result = str.trim();
  return result.slice(1, result.length - 1);
}
