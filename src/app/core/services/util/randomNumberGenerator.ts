const MAX_RNG_VALUE = 6;

export class RandomNumberGenerator {

  generate(bound: number = MAX_RNG_VALUE) {
    return Math.floor(Math.random() * bound);
  }
}

export const RANDOM_NUMBER_GENERATOR: RandomNumberGenerator = new RandomNumberGenerator();
