export const createFixedLengthList = <T>(max: number) => {
  const list: T[] = [];

  return {
    add(el: T) {
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
