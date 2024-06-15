import {
  convertNumbersInArray,
  csvToArray,
  stripQuotesInArray,
} from "./utilities/csv.mjs";
import canvas from "canvas";
import fs from "fs";

const MAP_BG_COLOR = "white";

/*******************************************************************************
 * Colors a county map according to a state's election results.
 ******************************************************************************/
export default async function colorize(
  strState,
  urlElectionData,
  urlBlankMap,
  urlBlankMapSizes,
  urlSeeds,
  urlOverlay,
  urlResult
) {
  /* Load all resources. */
  const { electionData, blankMap, width, height, seeds, overlay } = await load(
    strState,
    urlElectionData,
    urlBlankMap,
    urlBlankMapSizes,
    urlSeeds,
    urlOverlay,
    urlResult
  );

  /* Get a canvas and its context with blank map. */
  const { can, con } = prepareContext(width, height, blankMap);

  /* Color all regions. Side effect => context is updated. */
  colorRegions(electionData, seeds, width, height, con);

  /* Save the result. Side effect => creates (or overwrites) urlResult file. */
  saveResult(overlay, width, height, can, con, urlResult);
}

/*******************************************************************************
 * Colors a region on the blank map.
 ******************************************************************************/
function colorRegion(seedPointX, seedPointY, width, height, con, color) {
  const isDrawn = [];
  for (let row = 0; row < height; ++row) {
    let dataRow = [];
    for (let col = 0; col < width; ++col) {
      dataRow.push(false);
    }
    isDrawn.push(dataRow);
  }
  seedPointX = Math.round(seedPointX);
  seedPointY = Math.round(seedPointY);
  let imgData = con.getImageData(0, 0, width, height).data;
  let frontier = [{ x: seedPointX, y: seedPointY }];
  con.fillStyle = color;
  con.fillRect(seedPointX, seedPointY, 1, 1);
  while (frontier.length) {
    let newFrontier = [];
    for (let point of frontier) {
      for (let dy = -1; dy < 2; ++dy) {
        let y = point.y + dy;
        if (y < 0 || y >= height) {
          continue;
        }
        for (let dx = -1; dx < 2; ++dx) {
          if (dx === 0 && dy === 0) {
            continue;
          }
          if (dx * dy !== 0) {
            continue;
          }
          let x = point.x + dx;
          if (x < 0 || x >= width) {
            continue;
          }
          if (isDrawn[y][x]) {
            continue;
          }
          let rgba = getRGBA(x, y, imgData, width);
          if (rgba.r === 0 && rgba.g === 0 && rgba.b === 0) {
            con.fillRect(x, y, 1, 1);
          }
          if (rgba.r !== 255 || rgba.g !== 255 || rgba.b !== 255) {
            continue;
          }
          con.fillRect(x, y, 1, 1);
          newFrontier.push({ x: x, y: y });
          isDrawn[y][x] = true;
        }
      }
    }
    frontier = newFrontier;
  }
}

/*******************************************************************************
 * Colors all regions on the blank map.
 ******************************************************************************/
function colorRegions(electionData, seeds, width, height, con) {
  for (let i = 0; i < seeds.length; ++i) {
    for (let j = 0; j < electionData.length; ++j) {
      if (electionData[j][0] === seeds[i][0]) {
        colorRegion(
          seeds[i][1],
          seeds[i][2],
          width,
          height,
          con,
          getCorrectColor(electionData[j][2], electionData[j][3])
        );
        // console.log(getCorrectColor(totals[j][2], totals[j][3]));
      }
    }
  }
}

/*******************************************************************************
 * Takes a party and percentage and outputs the corresponding rgb.
 ******************************************************************************/
function getCorrectColor(party, percentage) {
  if (party === "Republican") {
    if (90 < percentage) {
      return "rgb(128, 0, 0)";
    } else if (80 < percentage && percentage <= 90) {
      return "rgb(170, 0, 0)";
    } else if (70 < percentage && percentage <= 80) {
      return "rgb(212, 0, 0)";
    } else if (60 < percentage && percentage <= 70) {
      return "rgb(204, 47, 74)";
    } else if (50 < percentage && percentage <= 60) {
      return "rgb(226, 127, 144)";
    } else if (40 < percentage && percentage <= 50) {
      return "rgb(255, 178, 178)";
    } else if (30 < percentage && percentage <= 40) {
      return "rgb(255, 204, 208)";
    } else {
      return "rgb(255, 255, 0)";
    }
  } else if (party === "Democrat") {
    if (90 < percentage) {
      return "rgb(0, 43, 132)";
    } else if (80 < percentage && percentage <= 90) {
      return "rgb(6, 69, 180)";
    } else if (70 < percentage && percentage <= 80) {
      return "rgb(22, 102, 203)";
    } else if (60 < percentage && percentage <= 70) {
      return "rgb(67, 137, 227)";
    } else if (50 < percentage && percentage <= 60) {
      return "rgb(134, 182, 242)";
    } else if (40 < percentage && percentage <= 50) {
      return "rgb(185, 215, 255)";
    } else if (30 < percentage && percentage <= 40) {
      return "rgb(211, 231, 255)";
    } else {
      return "rgb(255, 255, 0)";
    }
  }
  return "rgb(0, 0, 0)";
}

/*******************************************************************************
 * Gets the rgba value of a pixel in the image.
 ******************************************************************************/
function getRGBA(x, y, imgData, width) {
  let i = (x + y * width) * 4;
  return {
    r: imgData[i],
    g: imgData[i + 1],
    b: imgData[i + 2],
    a: imgData[i + 3],
  };
}

/*******************************************************************************
 * Gets dimensions of blank map.
 ******************************************************************************/
function getDimensions(strState, blankMapSizes) {
  let stateIndex = 0;
  while (
    stateIndex < blankMapSizes.length &&
    blankMapSizes[stateIndex][0] !== strState
  ) {
    stateIndex++;
  }
  const width = blankMapSizes[stateIndex][1];
  const height = blankMapSizes[stateIndex][2];
  return { width, height };
}

//then chaining has utility but there is an alternative

/*******************************************************************************
 * Loads resources for colorizer.
 ******************************************************************************/
async function load( //async returns new promise for us
  strState,
  urlElectionData,
  urlBlankMap,
  urlBlankMapSizes,
  urlSeeds,
  urlOverlay,
  urlResult
) {
  /* Load election data. */
  const electionData = await csvToArray(urlElectionData);
  convertNumbersInArray(electionData);

  /* Load blank map. */
  const blankMap = await canvas.loadImage(urlBlankMap);

  /* Load blank map sizes. */
  const blankMapSizes = await csvToArray(urlBlankMapSizes);
  stripQuotesInArray(blankMapSizes);
  convertNumbersInArray(blankMapSizes);
  const { width, height } = getDimensions(strState, blankMapSizes);

  /* Load seeds. */
  const seeds = await csvToArray(urlSeeds);
  convertNumbersInArray(seeds);

  /* Load overlay. */
  const overlay = await canvas.loadImage(urlOverlay);

  return { electionData, blankMap, width, height, seeds, overlay };
}

/*******************************************************************************
 * Prepares the context and canvas.
 ******************************************************************************/
function prepareContext(width, height, blankMap) {
  const can = canvas.createCanvas(width, height);
  const con = can.getContext("2d");
  con.fillStyle = MAP_BG_COLOR;
  con.fillRect(0, 0, width, height);
  con.drawImage(blankMap, 0, 0, width, height);
  return { can, con };
}

/*******************************************************************************
 * Creates a new file or overwrites an existing one.
 ******************************************************************************/
function saveResult(overlay, width, height, can, con, urlResult) {
  con.drawImage(overlay, 0, 0, width, height);
  fs.writeFileSync(urlResult, can.toBuffer("image/png"));
}
