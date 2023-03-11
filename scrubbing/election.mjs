export class Election {
  constructor(year) {
    this.year = year;
    this.states = {};
  }
  addState(name, state) {
    this.states[name] = state;
  }
  setYear(year) {
    this.year = year;
  }
}
