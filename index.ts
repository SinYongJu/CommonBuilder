import Builder from "./src/Builder";

const user = Builder.create({
  name: "",
  age: 0,
})
  .setName(() => "Smith")
  .setAge(20)
  .build();

console.log(user);

class User {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
const user2 = Builder.create<User>(new User("", 0))
  .setAge(20)
  .setName("sdsdsd")
  .build();
console.log(user2);

const user3 = Builder.create({
  name: "",
  age: -1,
})
  .setAge(20)
  .setAge((age) => age + 4)
  .setName("sdasdasdasdsdsd")
  .build((user) => new User(user.name, user.age));

console.log(user3);
