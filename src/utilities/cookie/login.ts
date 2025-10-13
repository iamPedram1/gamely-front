import { deleteCookie, getCookie, setCookie } from '@/utilities/cookie';
import { convertPersianDigitsToLatin } from '@/utilities/helperPack';
import dayjs from 'dayjs';

interface CookiesPhoneNumberProps {
  value: string;
  expire: string;
}

export const removePhoneNumbers = () => {
  deleteCookie('phoneNumbers');
};

export const setPhoneNumbers = (phoneNumbers: CookiesPhoneNumberProps[]) => {
  setCookie('phoneNumbers', JSON.stringify(phoneNumbers), {
    sameSite: 'Strict',
    maxAge: 120,
  });
};

export const addPhoneNumber = (phoneNumber: string) => {
  removePhoneNumber(phoneNumber);
  const phoneNumbers = getPhoneNumbers();
  phoneNumbers.push({
    value: convertPersianDigitsToLatin(phoneNumber.trim()),
    expire: dayjs().add(2, 'minute').toISOString(),
  });
  setPhoneNumbers(phoneNumbers);
};

export const removePhoneNumber = (phoneNumber: string) => {
  const phoneNumbers = structuredClone(getPhoneNumbers());
  const index = phoneNumbers.findIndex(
    (number) => number.value.trim() === phoneNumber.trim()
  );
  if (index > -1) {
    phoneNumbers.splice(index, 1);
    setPhoneNumbers(phoneNumbers);
  }
};

export const isCodeSented = (phoneNumber: string) => {
  const pNumber = convertPersianDigitsToLatin(phoneNumber.trim());
  return getPhoneNumbers().findIndex((v) => v.value.trim() === pNumber) > -1;
};

export const getPhoneNumbers = (): CookiesPhoneNumberProps[] => {
  const phoneNumbers = (
    JSON.parse(getCookie('phoneNumbers') || '[]') as CookiesPhoneNumberProps[]
  ).filter((v) => dayjs().isBefore(v.expire));

  phoneNumbers.forEach((pn) => {
    pn.value = convertPersianDigitsToLatin(pn.value);
  });
  setPhoneNumbers(phoneNumbers);
  return phoneNumbers;
};

export const getPhoneNumber = (
  phoneNumber: string
): CookiesPhoneNumberProps | null => {
  const pNumber = convertPersianDigitsToLatin(phoneNumber.trim());
  return getPhoneNumbers().find((ph) => ph.value === pNumber) || null;
};
