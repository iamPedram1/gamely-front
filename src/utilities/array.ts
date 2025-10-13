interface GenericStateProps {
  id: string;
  [key: string]: any;
}

/**
 * Finds and deletes an object from the state array.
 *
 * @param {T[]} state - The state array.
 * @param {string} targetId - The ID of the entity to be deleted.
 * @param {(updatedState: T[]) => void} onSuccess - The callback function to be called on successful deletion.
 * @param {(state: T[]) => void} onFailed - The callback function to be called when the object is not found.
 * @returns {T[]} The modified state if object deleted succesfuly, else Returns original state.
 */
export const findAndDelete = <T extends GenericStateProps>(
  state: T[],
  targetId: string,
  onSuccess?: (deletedItem: T) => void,
  onFailed?: (state: T[]) => void
): T[] => {
  const clone = structuredClone(state);
  if (clone.length > 0) {
    const index = findIndexById(clone, targetId);
    if (index > -1) {
      if (onSuccess) onSuccess(clone[index] as T);
      clone.splice(index, 1);
    } else {
      if (onFailed) onFailed(clone);
    }
  }
  return clone;
};

/**
 * Finds and deletes an object from the state array by index.
 *
 * @param {T[]} state - The state array.
 * @param {number} index - The index of the entity to be deleted.
 * @returns {T[]} The modified state if object deleted succesfuly, else Returns original state.
 */
export const findAndDeleteByIndex = (state: any[], index: number): any[] => {
  const clone = structuredClone(state);
  clone.splice(index, 1);
  return clone;
};

/**
 * Finds and update an object from the state array.
 *
 * @param {T[]} state - The state array.
 * @param {string} targetId - The ID of the entity to update.
 * @param {(updatedState: T) => void} onSuccess - The update logic to be called.
 * @param {(state: T[]) => void} onFailed - The callback function to be called when the object is not found.
 * @returns {T[]} The modified state if object founded succesfuly, else Returns original state.
 */
export const findAndUpdateById = <T extends GenericStateProps>(
  state: T[],
  targetId: string,
  onSuccess: (foundedObj: T) => void,
  onFailed?: (state: T[]) => void
): T[] => {
  const clone = structuredClone(state);
  if (clone.length > 0) {
    const index = findIndexById(state, targetId);
    if (index > -1) {
      if (onSuccess) onSuccess(clone[index] as T);
    } else {
      if (onFailed) onFailed(clone);
    }
  }
  return clone;
};

/**
 * Finds and update an object from the state array by index.
 *
 * @param {T[]} state - The state array.
 * @param {number} targetIndex - The Index of the entity to update.
 * @param {(updatedState: T) => void} onSuccess - The update logic to be called.
 * @param {(state: T[]) => void} onFailed - The callback function to be called when the object is not found.
 * @returns {T[]} The modified state if object founded succesfuly, else Returns original state.
 */
export const findAndUpdateByIndex = <T extends GenericStateProps>(
  state: T[],
  targetIndex: number,
  onSuccess: (foundedObj: T) => void,
  onFailed?: (state: T[]) => void
): T[] => {
  const clone = structuredClone(state);
  if (state.length > 0) {
    const item = clone[targetIndex];
    if (item) {
      if (onSuccess) onSuccess(clone[targetIndex] as T);
    } else {
      if (onFailed) onFailed(clone);
    }
  }
  return clone;
};

/**
 * Find and Returns object from the state array.
 *
 * @param {T[]} state - The state array.
 * @param {string} targetId - The ID of the entity to find.
 * @returns {T} The founded object or undefind.
 */
export const findById = <T extends GenericStateProps>(
  state: T[],
  targetId: string
): T | undefined => state[findIndexById(state, targetId)];

/**
 * Find and Returns the index of object in the state array.
 *
 * @param {T[]} state - The state array.
 * @param {string} targetId - The ID of the entity to find.
 * @returns {T} The index if founded, else returns -1 .
 */
export const findIndexById = <T extends GenericStateProps>(
  state: T[],
  targetId: string
): number => {
  const length = (state || []).length;
  for (let index = 0; index < length; index++) {
    if (state[index]?.id === targetId) return index;
  }

  return -1;
};

/**
 * Finds the index of the given target in the given state array.
 *
 * @param {string[]} state The state array to search.
 * @param {string} target The target to search for.
 * @returns {number} The index of the target in the state array, or -1 if the target is not found.
 */
export const findIndex = (state: string[], target: string): number => {
  for (let index = 0; index < state.length; index++) {
    if (state[index] === target) return index;
  }

  return -1;
};
/**
 * Divides an array into multiple smaller arrays with a specified number of items.
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array to divide.
 * @param {number} chunkSize - The number of items in each smaller array.
 * @returns {T[][]} - An array of smaller arrays.
 */
export const divideArray = <T>(arr: T[], chunkSize: number): T[][] => {
  const dividedArray: T[][] = [];
  const length = arr.length;

  for (let i = 0; i < length; i += chunkSize) {
    dividedArray.push(arr.slice(i, i + chunkSize));
  }

  return dividedArray;
};

export const asyncMap = async <T, A>(
  array: T[] = [],
  callbackfn: (value: T, accumulator: A[]) => Promise<void>
) => {
  const length = array?.length || 0;
  const accumulator: any[] = [];
  for (let i = 0; i < length; i++) {
    await callbackfn(array[i] as T, accumulator);
  }
  return accumulator;
};

/**
 * Generates an index map from an array of objects. The index map maps the id of each object to its index in the array.
 *
 * @param array The array of objects to generate the index map for.
 * @returns A record mapping the id of each object to its index in the array.
 */
export const generateIndexMap = (array: GenericStateProps[]): Record<string, number> => {
  const output: Record<string, number> = {};

  array.forEach((item, index) => (output[item.id] = index));

  return output;
};

/**
 * Generates an index map from an array of objects.
 * The index map maps the `id` of each object to the object itself.
 *
 * @param array The array of objects to generate the index map for.
 * @returns A record mapping the `id` of each object to its full object.
 */
export const generateObjectMap = <T>(
  array: Array<{ id: string; data: T }>
): Record<string, { id: string; data: T }> => {
  const output: Record<string, { id: string; data: T }> = {};

  array.forEach((item) => {
    output[item.id] = item;
  });

  return output;
};

export const genArray = (n: number): string[] => {
  const generateId = () => Math.random().toString(36).substring(2, 9);
  return Array.from({ length: n }, generateId);
};
