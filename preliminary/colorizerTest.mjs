import fs, { stat } from "fs";
import csvUtilities, {
  syncArrayToCsv,
  arrayToCsv,
  convertNumbersInArray,
  csvToArray,
  stripQuotesInArray,
} from "./utilities/csv.mjs";
import canvas from "canvas";

//notes on which seedpoint csvs work:
//  - Alaska is garbage
//  - Arkansas picture has weird black splotch in the top left corner
//  - Colorado and Hawaii maps have counties added recently
//  - Washington is messed up for some reason

//if state has space:
//  - no space
//  - no space
//  - space
//  - space
//  - no space

//black and whitifying:
//  - go to image --> mode --> indexed mode --> use black and white 1 bit pallette

let state = "Alabama";
let year = "2016";

csvToArray(`../db/Presidential Races/${year}/${state}.csv`).then((totals) => {
  convertNumbersInArray(totals);
  // console.log(totals);
  canvas.loadImage(`./BlankMapsBW/${state.replace(' ', '')}County.png`).then((img) => {
    csvToArray("BlankMapSizes.csv").then((sizes) => {
      stripQuotesInArray(sizes);
      convertNumbersInArray(sizes);
      let stateIndex;
      for (let i = 0; i < sizes.length; ++i) {
        if (sizes[i][0] === state) {
          stateIndex = i;
        }
      }

      const can = canvas.createCanvas(
        sizes[stateIndex][1],
        sizes[stateIndex][2]
      );
      const con = can.getContext("2d");
      con.fillStyle = "white";
      con.fillRect(0, 0, sizes[stateIndex][1], sizes[stateIndex][2]);
      con.drawImage(img, 0, 0, sizes[stateIndex][1], sizes[stateIndex][2]);

      csvToArray(`./CountyCoordsbyState/${state}.csv`).then(
        (seedPoints) => {
          convertNumbersInArray(seedPoints);
          con.fillStyle = "red";
          for (let i = 0; i < seedPoints.length; ++i) {
            let countyRow;
            for (let j = 0; j < totals.length; ++j) {
              // try {
              //   seedPoints[j][0].toLowerCase();
              // }
              // catch {
              //   console.log(j, totals[j], totals[j][0]);
              // }
              if (totals[j][0].toLowerCase() === seedPoints[i][0].toLowerCase()) {
                // console.log("match found");cls
                colorRegion(
                  seedPoints[i][1],
                  seedPoints[i][2],
                  sizes[stateIndex][1],
                  sizes[stateIndex][2],
                  con,
                  getCorrectColor(totals[j][2], totals[j][3])
                );
                // console.log(getCorrectColor(totals[j][2], totals[j][3]));
              }
            }

            // con.fillRect(seedPoints[i][1] - 1, seedPoints[i][2] - 1, 2, 2);
          }
          canvas
            .loadImage(`./CountyMapsOutline/${state.replace(' ', '')}CountyOutline.png`)
            .then((img) => {
              con.drawImage(
                img,
                0,
                0,
                sizes[stateIndex][1],
                sizes[stateIndex][2]
              );
              fs.writeFileSync(
                `./ColoredMaps/Presidential Races/${year}/${state.replace(' ', '')}.png`,
                can.toBuffer("image/png")
              );
            });
        }
      );
    });
  });
});

function colorRegion(seedPointX, seedPointY, width, height, context, color) {
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
  let imgData = context.getImageData(0, 0, width, height).data;
  let frontier = [{ x: seedPointX, y: seedPointY }];
  context.fillStyle = color;
  context.fillRect(seedPointX, seedPointY, 1, 1);
  while (frontier.length) {
    let newFrontier = [];
    // console.log(frontier.length);
    for (let point of frontier) {
      // console.log("apple");
      for (let dy = -1; dy < 2; ++dy) {
        // console.log("banana");
        let y = point.y + dy;
        if (y < 0 || y >= height) continue;
        for (let dx = -1; dx < 2; ++dx) {
          // console.log("orange");
          if (dx === 0 && dy === 0) continue;
          if (dx * dy !== 0) continue;
          let x = point.x + dx;
          // console.log(x, y);
          try {
            if (x < 0 || x >= width) continue;
            // console.log("***");
            // console.log(x, y, width, height);
            if (isDrawn[y][x]) continue;
            let rgba = getRGBA(x, y, imgData, width);
            if (rgba.r === 0 && rgba.g === 0 && rgba.b === 0) {
              // console.log(x, y);
              context.fillRect(x, y, 1, 1);
            }
            if (rgba.r !== 255 || rgba.g !== 255 || rgba.b !== 255) continue;
            // console.log(x, y);
            context.fillRect(x, y, 1, 1);
            newFrontier.push({ x: x, y: y });
            isDrawn[y][x] = true;
          } catch (msg) {
            console.log("**************************");
            console.log(msg);
            console.log(x, y, width, height);
            console.log("=========================");
          }
        }
      }
    }
    frontier = newFrontier;
  }
}

function drawOverlay(context, width, height, fileName) {}

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
      return "rgb(165, 176, 255)";
    } else if (30 < percentage && percentage <= 40) {
      return "rgb(211, 231, 255)";
    } else {
      return "rgb(255, 255, 0)";
    }
  }
  return "rgb(0, 0, 0)";
}

function getRandomColor() {
  const R = Math.floor(256 * Math.random());
  const G = Math.floor(256 * Math.random());
  const B = Math.floor(256 * Math.random());
  return `rgb(${R},${G},${B})`;
}

function getRGBA(x, y, imgData, width) {
  let i = (x + y * width) * 4;
  return {
    r: imgData[i],
    g: imgData[i + 1],
    b: imgData[i + 2],
    a: imgData[i + 3],
  };
}