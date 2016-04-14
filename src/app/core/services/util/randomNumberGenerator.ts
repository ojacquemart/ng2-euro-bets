const MAX_RNG_VALUE = 6;

export class RandomNumberGenerator {

  generate() {
    return Math.floor(Math.random() * MAX_RNG_VALUE);
  }
}

export const RANDOM_NUMBER_GENERATOR: RandomNumberGenerator = new RandomNumberGenerator();
