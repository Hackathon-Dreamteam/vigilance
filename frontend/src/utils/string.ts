export const toTitleCase = (str: string) => {
  return str.replace(/[^\s]+/g, word => {
    return word.replace(/^./, first => {
      return first.toUpperCase();
    });
  });
};
