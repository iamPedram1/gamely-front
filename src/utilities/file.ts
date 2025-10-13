/**
 * Retrieves the file extension from the provided URL.
 * @param {string} url - The URL to extract the file extension from.
 * @returns {string} The file extension.
 */
export const getFileExtension = (url: string): string => {
  const lastDotIndex = url.lastIndexOf('.');
  return url.slice(lastDotIndex);
};

/**
 * Retrieves the file extension title based on the provided extension.
 * @param {string} ext - The file extension.
 * @returns {string} The file extension title.
 */
export const getFileExtensionTitle = (ext: string): string => {
  if (['.ppt', 'ppt', '.pptx', 'pptx'].includes(ext)) return 'پاورپوینت';
  if (['.doc', 'doc', '.docx', 'docx'].includes(ext)) return 'ورد';
  if (['.xls', 'xls', '.xlsx', 'xlsx', '.csv', 'csv'].includes(ext))
    return 'اکسل';
  if (['.pdf', 'pdf'].includes(ext)) return 'پی‌دی‌اف';
  return 'فایل';
};

export const fileToObjectUrl = (files: File[]) => {
  const newFiles: string[] = [];
  files.forEach((file) => {
    const objectURL = URL.createObjectURL(file);
    newFiles.push(`${objectURL}%--Sep--%${file.name}%--Sep--%${file.type}`); // %--Sep--% is the Seperator between URL and name and Type.
    // We Have A Function that converts this to file(objectUrlToFile).
  });
  return newFiles;
};

/**
 * Converts a custom object URL to a file. only works on urls seperated by '%--Sep--%'
 * @param {string} objectUrl - The object URL to convert.
 * @returns {Promise<File>} A promise that resolves to the converted file.
 * @example
 * const objectUrl = URL.createObjectURL(file as File);
 * const customUrl = `${objectUrl}%--Sep--%${file.name}%--Sep--%${file.type}`;
 * objectUrlToFile(customUrl);
 * // Returns a Promise that resolves to the converted file.
 *
 */
export const objectUrlToFile = async (objectUrl: string): Promise<File> => {
  try {
    const [url, name, type] = objectUrl.split('%--Sep--%');
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], name, { type });
    return file;
  } catch (error) {
    throw error;
  }
};

/**
 * Checks if the given URL is a original File object URL.
 * @param {any} url - The URL to check.
 * @returns {boolean} True if the URL is a File object URL, false otherwise.
 */
export const isOriginalFileObjectURL = (url: any): boolean =>
  typeof url === 'string' &&
  url.startsWith('blob:') &&
  !url.includes('%--Sep--%');

/**
 * Checks if the given URL is a custom File object URL created by 'fileToObjectUrl' function..
 * @param {any} url - The URL to check.
 * @returns {boolean} True if the URL is a File object URL, false otherwise.
 */
export const isCustomFileObjectURL = (url: any): boolean =>
  typeof url === 'string' &&
  url.startsWith('blob:') &&
  url.includes('%--Sep--%');

/**
 * Checks if the given object is a File.
 * @param {any} file - The object to check.
 * @returns {boolean} - True if the object is a File, false otherwise.
 */
export const isFile = (file: any): boolean =>
  typeof document !== 'undefined' && file instanceof File;

/**
 * Checks if the given object has 'id' and 'data' properties.
 * @param {any} file - The object to check.
 * @returns {boolean} - True if the object has 'id' and 'data' properties, false otherwise.
 */
export const isFileProps = (file: any): boolean => {
  if (typeof file !== 'object') return false;
  if ('id' in file && 'data' in file) return true;
  else return false;
};

/**
 * Checks if the given string is a FileProps link string.
 * @param {any} file - The object to check.
 * @returns {boolean} - True if the given string is a FileProps link string, false otherwise.
 */
export const isFilePropsLink = (file: any): boolean => {
  if (typeof file === 'string' && file.length > 0 && file.includes('/storage'))
    return true;
  return false;
};
