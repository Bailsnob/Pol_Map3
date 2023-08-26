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

// let state = "Virginia";
let years = [
  // "1856",
  // "1876",
  // "1924",
  // "1928",
  // "1932",
  // "1936",
  // "1940",
  // "1944",
  // "1948",
  // "1952",
  // "1956",
  // "1960",
  // "1964",
  // "1968",
  // "1970",
  // "1972", // problems below for VA
  // "1976",
  // "1980",
  // "1984",
  // "1986",
  // "1988",
  // "1990",
  // "1992",
  // "1994",
  // "1996",
  // "2000",
  // "2002",
  // "2004",
  "2005",
  // "2006",
  // "2007",
  // "2008",
  // "2009",
  // "2010",
  // "2011",
  // "2012",
  // "2013",
  // "2014",
  // "2015",
  // "2016",
  // "2017",
  // "2018",
  // "2019",
  // "2020",
  // "2021",
  // "2022"
];

const mode = "Gubernatorial";

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
  // "Hawaii",
  // "Idaho",
  // "Illinois",
  // "Indiana",
  // "Iowa",
  // "Kansas",
  // "Kentucky",
  // "Louisiana",
  // "Maine",
  // "Maryland",
  // "Massachusetts",
  // "Michigan",
  // "Minnesota",
  // "Mississippi",
  // "Missouri",
  // "Montana",
  // "Nebraska",
  // "Nevada",
  // "New Hampshire",
  // "New Jersey",
  // "New Mexico",
  // "New York",
  // "North Carolina",
  // "North Dakota",
  // "Ohio",
  // "Oklahoma",
  // "Oregon",
  // "Pennsylvania",
  // "Rhode Island",
  // "South Carolina",
  // "South Dakota",
  // "Tennessee",
  // "Texas",
  // "Utah",
  // "Vermont",
  "Virginia",
  // "Washington",
  // "West Virginia",
  // "Wisconsin",
  // "Wyoming",
];

// for (let year = 2020; year > 1923; year -= 4) {
for (let year of years) {
  for (let state of states) {
    csvToArray(`../db/${mode}/${year}/${state}.csv`).then(
      (totals) => {
        convertNumbersInArray(totals);
        // console.log(totals);
        canvas
          .loadImage(`./BlankMapsBW/${state.replace(" ", "")}County.png`)
          .then((img) => {
            csvToArray("./data/BlankMapSizes.csv").then((sizes) => {
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
              con.drawImage(
                img,
                0,
                0,
                sizes[stateIndex][1],
                sizes[stateIndex][2]
              );

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
                      if (
                        totals[j][0] /*.toLowerCase()*/ ===
                        seedPoints[i][0] /*.toLowerCase()*/
                      ) {
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
                    .loadImage(
                      `./CountyMapsOutline/${state.replace(
                        " ",
                        ""
                      )}CountyOutline.png`
                    )
                    .then((img) => {
                      con.drawImage(
                        img,
                        0,
                        0,
                        sizes[stateIndex][1],
                        sizes[stateIndex][2]
                      );
                      fs.writeFileSync(
                        `./ColoredMaps/${mode}/${year}/${state}.png`,
                        can.toBuffer("image/png")
                      );
                    });
                }
              );
            });
          });
      }
    );
  }
}

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
    } else if (20 < percentage && percentage <= 30) {
      return "rgb(255, 223, 225)";
    } else {
      return "rgb(255, 255, 0)";
    }
  } else if (party === "Democrat" || party === "Democratic") {
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
    } else if (20 < percentage && percentage <= 30) {
      return "rgb(225, 239, 255)";
    } else {
      return "rgb(255, 255, 0)";
    }
  } else if (party === "Dixiecrat") {
    if (90 < percentage) {
      return "rgb(170, 68, 0)";
    } else if (80 < percentage && percentage <= 90) {
      return "rgb(212, 85, 0)";
    } else if (70 < percentage && percentage <= 80) {
      return "rgb(255, 102, 0)";
    } else if (60 < percentage && percentage <= 70) {
      return "rgb(255, 127, 42)";
    } else if (50 < percentage && percentage <= 60) {
      return "rgb(255, 153, 85)";
    } else if (40 < percentage && percentage <= 50) {
      return "rgb(255, 179, 128)";
    } else if (30 < percentage && percentage <= 40) {
      return "rgb(255, 204, 170)";
    } else {
      return "rgb(255, 255, 0)";
    }
  } else if (party === "Independent") {
    if (90 < percentage) {
      return "rgb(65, 65, 65)";
    } else if (80 < percentage && percentage <= 90) {
      return "rgb(90, 90, 90)";
    } else if (70 < percentage && percentage <= 80) {
      return "rgb(115, 115, 115)";
    } else if (60 < percentage && percentage <= 70) {
      return "rgb(150, 150, 150)";
    } else if (50 < percentage && percentage <= 60) {
      return "rgb(189, 189, 189)";
    } else if (40 < percentage && percentage <= 50) {
      return "rgb(217, 217, 217)";
    } else if (30 < percentage && percentage <= 40) {
      return "rgb(230, 230, 230)";
    } else if (20 < percentage && percentage <= 30) {
      return "rgb(243, 243, 243)";
    } else {
      return "rgb(255, 255, 0)";
    }
  } else if (party === "Libertarian" || party === "Connecticut for Lieberman" || party === "A Connecticut Party") {
    if (90 < percentage) {
      return "rgb(165, 129, 0)";
    } else if (80 < percentage && percentage <= 90) {
      return "rgb(185, 138, 53)";
    } else if (70 < percentage && percentage <= 80) {
      return "rgb(206, 155, 30)";
    } else if (60 < percentage && percentage <= 70) {
      return "rgb(222, 176, 42)";
    } else if (50 < percentage && percentage <= 60) {
      return "rgb(241, 201, 42)";
    } else {
      return "rgb(255, 255, 0)";
    }
  } else if (party === "Progressive" || party === "Populist") {
    if (90 < percentage) {
      return "rgb(22, 80, 22)";
    } else if (80 < percentage && percentage <= 90) {
      return "rgb(33, 120, 33)";
    } else if (70 < percentage && percentage <= 80) {
      return "rgb(48, 166, 48)";
    } else if (60 < percentage && percentage <= 70) {
      return "rgb(142, 210, 96)";
    } else if (50 < percentage && percentage <= 60) {
      return "rgb(170, 223, 135)";
    } else if (40 < percentage && percentage <= 50) {
      return "rgb(198, 233, 175)";
    } else if (30 < percentage && percentage <= 40) {
      return "rgb(198, 254, 175)";
    } else if (20 < percentage && percentage <= 30) {
      return "rgb(221, 255, 210)";
    } else {
      return "rgb(255, 255, 0)";
    }
  } else if (party === "Socialist") {
    if (30 < percentage && percentage <= 40) {
      return "rgb(254, 219, 193)";
    } else if (20 < percentage && percentage <= 30) {
      return "rgb(255, 232, 217)";
    } else {
      return "rgb(255, 255, 0)";
    }
  } else if (party === "Reform" || party === "Constitution") {
    if (90 < percentage) {
      return "rgb(45, 25, 52)";
    } else if (80 < percentage && percentage <= 90) {
      return "rgb(103, 30, 255)";
    } else if (70 < percentage && percentage <= 80) {
      return "rgb(128, 50, 255)";
    } else if (60 < percentage && percentage <= 70) {
      return "rgb(153, 85, 255)";
    } else if (50 < percentage && percentage <= 60) {
      return "rgb(179, 128, 255)";
    } else if (40 < percentage && percentage <= 50) {
      return "rgb(204, 170, 255)";
    } else if (30 < percentage && percentage <= 40) {
      return "rgb(230, 205, 255)";
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
