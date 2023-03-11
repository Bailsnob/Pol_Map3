export class State {
  constructor(name, mapUrl, candidates) {
    this.name = name;
    this.mapUrl = mapUrl;
    this.candidates = {};
    if (candidates) {
      for (let index in candidates) {
        this.candidates[index] = candidates[index];
      }
    }
    this.results = {};
  }

  addCandidate(strCandidate, objCandidate) {
    this.candidates[strCandidate] = objCandidate;
  }

  setMapUrl(mapUrl) {
    this.mapUrl = mapUrl;
  }

  setName(name) {
    this.name = name;
  }
}
