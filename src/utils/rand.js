/**
 * Generate random number in range
 * @param {number} min
 * @param {number} max
 */
export const rand = (min, max) => Math.random() * (max - min) + min;
