interface ICommonBuilder<T> {
  target: T;
  build<U>(): T;
  build<U>(fn?: (arg: T) => U): U;
}
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

type IBuilder<T extends {}> = Builder<T> & {
  [k in keyof NonFunctionProperties<T> as `set${Capitalize<string & k>}`]: (
    value: T[k] | ((setting: T[k]) => T[k])
  ) => IBuilder<T>;
};
export default class Builder<T extends {}> implements ICommonBuilder<T> {
  target: T;
  constructor(initial: T) {
    if (initial.constructor.name.toLowerCase() !== "object") {
      this.target = Object.assign(
        Object.create(Object.getPrototypeOf(initial)),
        initial
      );
    } else {
      this.target = Object.assign({}, initial);
    }
    return this.toProxyUnit();
  }
  toProxyUnit() {
    const proxy = new Proxy(this, {
      get(target, p, receiver) {
        if ((p as string).indexOf("set") === 0) {
          let [_, fst, ...etcs] = String(p).split("set");
          fst = fst.charAt(0).toLocaleLowerCase() + fst.slice(1);
          const property = [fst].concat(etcs).join("");
          return <U extends T[keyof T]>(value: U | ((setting: U) => U)) => {
            target["target"][property as keyof T] =
              typeof value === "function"
                ? (value as Function)(target.target[property as keyof T])
                : value;
            return Builder.create(target["target"]);
          };
        }
        return Reflect.get(target, p, receiver);
      },
    });
    return proxy;
  }
  build<U>(): T;
  build<U>(fn?: (arg: T) => U): U;
  build(fn?: (arg: T) => any) {
    if (fn) return fn(this.target);
    return this.target;
  }
  static create<T extends {}>(initial: T) {
    return new Builder(initial) as IBuilder<T>;
  }
}
