import dayjs from 'dayjs';
import jalaliday from 'jalaliday/dayjs';
dayjs.extend(jalaliday);

/**
 * Returns a date that is a month later than the current date, rounded to 2 PM.
 *
 * @returns {Date} A date that is a month later than the current date.
 */
export const getRoundedAMonthLaterDate = (): Date => {
  let date = new Date(Date.now() + 30);
  date.setHours(14, 0, 0, 0);
  const future = date.setDate(date.getDate() + 30);
  return new Date(future);
};

/**
 * Returns the localized date string in the specified format.
 *
 * @param {string} date - The date string to be formatted.
 * @returns {string} The localized date string.
 */
export const getLocaleDate = (date: string): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Returns the localized time string in the specified format.
 *
 * @param {string} date - The date string to be formatted.
 * @returns {string} The localized time string.
 */
export const getLocaleTime = (date: string): string => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Returns the localized date and time string in the specified format.
 *
 * @param {string} date - The date string to be formatted.
 * @param {string} [separator] - The separator between date and time (optional).
 * @returns {string} The localized date and time string.
 */
export const getLocaleDateAndTime = (
  date: string,
  separator?: string
): string =>
  date
    ? `${getLocaleDate(date)}${
        separator ? ` ${separator}` : ''
      } ${getLocaleTime(date)}`
    : '-';

/**
 * Returns the calendar pick type name based on the provided pick type.
 *
 * @param {string} pickType - The pick type.
 * @returns {string} The calendar pick type name.
 */
export const getCalendarPickTypeName = (pickType: string): string => {
  switch (pickType) {
    case 'dd':
      return 'روز';
    case 'ddd':
      return 'مخفف نام روز';
    case 'dddd':
      return 'نام روز';
    case 'mm':
      return 'ماه';
    case 'mmm':
      return 'مخفف نام ماه';
    case 'mmmm':
      return 'نام ماه';
    case 'yy':
      return 'سال (دو رقم)';
    case 'yyyy':
      return 'سال';
    default:
      return '؟';
  }
};

/**
 * Checks if the date difference with the current date is more than the given time in minutes.
 *
 * @param {string} dateString - The date string to compare.
 * @param {number} time - The time in minutes.
 * @returns {boolean} True if the date difference is more than the given time, false otherwise.
 */
export const isDateStale = (dateString: string, time: number): boolean => {
  const current = dayjs();
  const date = dayjs(dateString);
  return current.diff(date, 'minutes') > time;
};

export function getTimeLeft(targetTime: string) {
  const target = dayjs(targetTime);
  const now = dayjs();
  const diff = target.diff(now);

  if (diff <= 0) return '00:00:00';

  const d = dayjs.duration(diff);
  const hours = String(Math.floor(d.asHours())).padStart(2, '0'); // total hours
  const minutes = String(d.minutes()).padStart(2, '0');
  const seconds = String(d.seconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

export function hoursLeftToTarget(targetTime: string): number {
  const now = dayjs();
  const target = dayjs(targetTime);

  if (target.isBefore(now)) return 0;

  return target.diff(now, 'hour');
}

export function minutesLeftToTarget(targetTime: string): number {
  const now = dayjs();
  const target = dayjs(targetTime);

  if (target.isBefore(now)) return 0;

  return target.diff(now, 'minutes');
}

export const getDate = (date: string, locale: string, format?: string) => {
  return dayjs(date)
    .locale(locale)
    .calendar(locale === 'fa' ? 'jalali' : 'gregory')
    .format(format ? format : locale === 'fa' ? 'D MMM YYYY' : 'MMMM D, YYYY');
};
