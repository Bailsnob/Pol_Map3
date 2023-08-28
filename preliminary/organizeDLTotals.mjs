import { readFileSync } from 'fs';
import { arrayToCsv, convertNumbersInArray } from "./utilities/csv.mjs";

const year = "1996";
const state = "Texas";
const mode = "Senatorial";

try {
  let data = readFileSync('csvbad.csv', 'utf8');
  let dName = "Victor Morales";
  let rName = "Phil Gramm";
  let iName = "Angus King";
  let lastNames = [
    dName.split(' ')[dName.split(' ').length - 1],
    rName.split(' ')[rName.split(' ').length - 1],
    // "Suddith",
    "Other",
  ];
  let fullNames = [dName, rName, iName];
  let other = "Independent";
  for (let name of lastNames) {
    data = replaceAll(data, name + "\t", "");
  }

  data = data.replace(/\r/g, "");
  data = data.replace(/\t/g, ",");
  data = data.replace(/\n /g, "");
  data = data.replace(/%/g, "");
  data = data.split("\n\n\n");
  for (let i = 0; i < data.length; ++i) {
    data[i] = data[i].replace(/\n/g, "").split(",");
    data[i].pop();
  }
  convertNumbersInArray(data);
  
  for (let rowNum = 0; rowNum < data.length; ++rowNum) {
    let row = data[rowNum];
    let newRow = [row[0]];
    let nums = [];
    for (let i = 1; i < row.length; ++i) {
      nums.push(row[i]);
    }
    if (Math.max(...nums) === row[1]) {
      newRow.push(fullNames[0]);
      newRow.push("Democrat");
    }
    else if (Math.max(...nums) === row[2]) {
      newRow.push(fullNames[1]);
      newRow.push("Republican");
    }
    else {
      newRow.push(fullNames[2]);
      newRow.push(other);
    }
    newRow.push(Math.max(...nums));
    data[rowNum] = newRow;
  }

  // console.log(data);

  arrayToCsv(data, `../db/${mode}/${year}/${state}.csv`);
  // writeFileSync("a.csv", data);
  // console.log(data);
} catch (err) {
  console.error(err);
}

function replaceAll(str, replacee, replacement) {
  let strCopy = str;
  while (strCopy.includes(replacee)) {
    strCopy = strCopy.replace(replacee, replacement);
  }
  return strCopy;
}