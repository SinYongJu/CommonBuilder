import Builder from "./src/Builder";

const log = console.log;
const user = Builder.create({
  name: "",
  age: 0,
})
  .setName(() => "Smith")
  .setAge(20)
  .build();

log(user);

class User {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
const user2 = Builder.create(new User("", 0))
  .setAge(20)
  .setName("shady")
  .build();
log(user2);

const user3 = Builder.create({ name: "", age: -1 })
  .setAge(20)
  .setAge((age) => age + 4)
  .setName("sdasdasdasdsdsd")
  .build((user) => new User(user.name, user.age));

log(user3);

const userBuilder = Builder.create({ name: "", age: -1 });

const john1 = userBuilder.setName("john").build();

const john2 = userBuilder.setName("john").build();

log("john1", john1);
log("john2", john2);
log(john1 === john2);
