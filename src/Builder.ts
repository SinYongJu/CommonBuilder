export default class Builder<T extends {}> {
  initial: T;
  constructor(initial: T) {
    this.initial = initial;
  }
  build() {
    return this.initial;
  }
  static use<T extends {}>(initial: T) {
    return new Builder(initial);
  }
}
