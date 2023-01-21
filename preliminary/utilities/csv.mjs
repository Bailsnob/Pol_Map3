import { readFile, writeFile } from "fs";

//function that reads in a csv and returns it as an array
export function csvToArray(theCsv) {
  return new Promise((resolve, reject) => {
    readFile(theCsv, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      const results = [];
      data = data.split("\n");
      for (let line of data) {
        const row = line.split(",");
        for (let i = 0; i < row.length; ++i) {
          row[i] = row[i].trim();
        }
        results.push(row);
      }
      resolve(results);
    });
  });
}

export function convertNumbersInArray(theArray) {
  for (let row = 0; row < theArray.length; ++row) {
    for (let col = 0; col < theArray[row].length; ++col) {
      let n = Number(theArray[row][col]);
      if (!Number.isNaN(n)) {
        theArray[row][col] = n;
      }
    }
  }
}

export function stripQuotesInArray(theArray) {
  for (let row = 0; row < theArray.length; ++row) {
    let arrayRow = theArray[row];
    for (let col = 0; col < arrayRow.length; ++col) {
      let item = arrayRow[col];
      // console.log(row, col);
      if (
        item.length &&
        ((item[0] === "'" && item[item.length - 1] === "'") ||
          (item[0] === '"' && item[item.length - 1] === '"'))
      ) {
        // theArray[row][col] = 23;
        theArray[row][col] = item.slice(1, item.length - 1);
      }
    }
  }
}

export function arrayToCsv(theArray, fileName) {
  return new Promise((resolve, reject) => {
    let output = "";
    for (let row = 0; row < theArray.length; ++row) {
      let line = theArray[row];
      if (line.length) {
        output += line[0];
      }
      for (let col = 1; col < line.length; ++col) {
        output += ", " + line[col];
      }
      output += "\n";
    }
    writeFile(fileName, output, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

export async function syncArrayToCsv(theArray, fileName){
  await arrayToCsv(theArray, fileName);
}

export default {
  csvToArray,
  stripQuotesInArray,
  convertNumbersInArray,
  arrayToCsv,
};