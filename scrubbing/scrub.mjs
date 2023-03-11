const allStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District Of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

function addYears(db, ...years) {
  for (let year of years) {
    db[year] = {};
  }
}



function setUrl(map, url) {
  map[url] = url;
}

function setPxDims(map, width, height) {
  map[pxDims].width = width;
  map[pxDims].height = height;
}

function setCounties(map, county) {
  //to do
}

function makeEmptyMap() {
  return {
    url: undefined,
    pxDims: { width: undefined, height: undefined },
    counties: {},
    worldBoundaries: {},
  };
}

function makeEmptyCandidates() {
  return {};
}

function makeEmptyResults() {
  return {};
}

function addCandidates(candidates, name, party) {
  candidates[name] = party;
}

function addResult(results, county, candidate, percentage) {
  results[county] = { winner: candidate, percentage: percentage };
}

(() => {
  let db = {};
  addYears(db, 1964, 1968, 1972, 1976);
  addStates(db["1964"], "Alabama", "Alaska", "Oklahoma");
  addAllStates(db["1968"]);
  addAllStatesExcept(db["1972"], "Minnesota", "Oregon", "West Virginia");
  console.log(db);
})();
