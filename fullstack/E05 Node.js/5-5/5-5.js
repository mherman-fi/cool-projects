const args = process.argv.slice(2);
const RANDOMIZED_NUMBERS_COUNT = parseInt(args[0]);
const MIN_VALUE = parseInt(args[1]);
const MAX_VALUE = parseInt(args[2]);

if (!RANDOMIZED_NUMBERS_COUNT || !MIN_VALUE || !MAX_VALUE) {
  console.log("Usage: 5-5.js RANDOMIZED_NUMBERS_COUNT MIN_VALUE MAX_VALUE");
  return;
}

const randomNumbers = [];
for (let i = 0; i < RANDOMIZED_NUMBERS_COUNT; i++) {
  randomNumbers.push(Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE);
}
console.log(randomNumbers);
