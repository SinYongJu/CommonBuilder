interface ICommonBuilder<T> {
  target: T;
}
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

type IBuilder<T> = Builder<T> & {
  [k in keyof NonFunctionProperties<T> as `set${Capitalize<string & k>}`]: (
    value: T[k] | ((setting: T[k]) => T[k])
  ) => IBuilder<T>;
};
export default class Builder<T> implements ICommonBuilder<T> {
  target: T;
  constructor(initial: T) {
    this.target = initial;
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
  build<Fn extends (arg: T) => any>(
    callback?: Fn
  ): ReturnType<Fn> extends any ? T : ReturnType<Fn> {
    if (callback) return callback(this.target);
    return this.target;
  }
  static create<T>(initial: T) {
    return new Builder(initial) as IBuilder<T>;
  }
}

const fn = <T>(arg: T) => 2;

fn(2);
