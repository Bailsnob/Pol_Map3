import { writeFile } from "fs";

// saveArrayAsCsv([
//   ["Mike", "31", "5"],
//   ["Joseph", "15", "12"],
//   ["Anna", "54", "23"],
// ]);

saveJsonAsCsv({
  AK: {
    name: "Alaska",
    min_lat: 52.5964,
    max_lat: 71.5232,
    min_lng: -169.9146,
    max_lng: -129.993,
  },
  AL: {
    name: "Alabama",
    min_lat: 30.1463,
    max_lat: 35.0041,
    min_lng: -88.4743,
    max_lng: -84.8927,
  },
  AR: {
    name: "Arkansas",
    min_lat: 33.0075,
    max_lat: 36.4997,
    min_lng: -94.6198,
    max_lng: -89.6594,
  },
  AZ: {
    name: "Arizona",
    min_lat: 31.3325,
    max_lat: 37.0004,
    min_lng: -114.8126,
    max_lng: -109.0475,
  },
});

function saveArrayAsCsv(arr) {
  return new Promise((resolve, reject) => {
    let output = "";
    for (let row = 0; row < arr.length; ++row) {
      let line = arr[row];
      if (line.length) {
        output += '"' + line[0] + '"';
      }
      for (let col = 1; col < line.length; ++col) {
        output += ", " + '"' + line[col] + '"';
      }
      output += "\n";
    }
    writeFile("Banana.csv", output, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

function saveJsonAsCsv(theJson) {
  return new Promise((resolve, reject) => {
    let output = "";
    const keys = Object.keys(theJson);
    let captions;
    if (keys.length) {
      let item = theJson[keys[0]];
      captions = Object.keys(item);

      output += '"id"';
      for (let i = 0; i < captions.length; ++i) {
        output += ", " + '"' + captions[i] + '"';
      }
      output += "\n";
    }
    for (let key of keys) {
      let obj = theJson[key];
      output += '"' + key + '"';
      for (let i = 0; i < captions.length; ++i) {
        output += ", " + '"' + obj[captions[i]] + '"';
      }
      output += "\n";
      //to do:
    }
    writeFile("Banana.csv", output, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}