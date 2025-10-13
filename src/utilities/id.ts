/**
 * Generates a random ObjectId.
 *
 * @returns {string} The random object id.
 */
export const generateObjectId = (): string => {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);

  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16))
      .toLowerCase()
  );
};

/**
 * Generates a random ObjectId.
 *
 * Returns an array with the given length with objectId items in it.
 * @returns {string[]} The array with the given length.
 */
export const genObjectIdArray = (size: number): string[] => {
  let ids: string[] = [];
  for (let i = 0; i <= size; i++) {
    ids[i] = generateObjectId();
  }

  return ids;
};
