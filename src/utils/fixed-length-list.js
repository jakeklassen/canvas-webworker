/**
 * @template T
 * @param {number} max
 * @returns {import('./fixed-length-list-type').FixedLengthList<T>}
 */
export const createFixedLengthList = (max) => {
  /**
   * @type {T[]}
   */
  const list = [];

  return {
    /**
     *
     * @param {T} el
     */
    add(el) {
      list.unshift(el);

      while (list.length > max) {
        list.pop();
      }
    },

    get list() {
      return list;
    },
  };
};
