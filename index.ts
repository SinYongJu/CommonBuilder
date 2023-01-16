import Builder from "./src/Builder";

const result = Builder.use({
  name: "luka",
  age: 29,
}).build();

console.log("hello world");
console.log(result);
