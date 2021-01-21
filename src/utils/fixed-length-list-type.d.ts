export interface FixedLengthList<T> {
  add(el: T): void;
  list: T[];
}

export type FixedLengthListFactory = <T>(max: number) => FixedLengthList<T>;
