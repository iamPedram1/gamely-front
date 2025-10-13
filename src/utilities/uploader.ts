// Custom Types

import { CommonResponseProps, FileProps } from '@/types/api';
import { getCookie } from '@/utilities/cookie';
import { isSucceed } from '@/utilities/request';

export const uploadFile = async (
  files: File[],
  location: string,
  onUploadProgressChange?: (number: number) => void,
  xmlHttpRequest?: XMLHttpRequest
): Promise<CommonResponseProps<FileProps[]>> => {
  try {
    const response = await uploadWithXML(
      Array.isArray(files) ? files : [files],
      location,
      onUploadProgressChange,
      xmlHttpRequest
    );
    return response as CommonResponseProps<FileProps[]>;
  } catch (error) {
    return error as CommonResponseProps<FileProps[]>;
  }
};

export const uploadWithXML = async (
  files: File[],
  location: string,
  onUploadProgressChange?: (number: number) => void,
  xmlHttpRequest?: XMLHttpRequest
): Promise<CommonResponseProps<FileProps[]>> => {
  return new Promise(async (resolve, reject) => {
    const url = `http://localhost:3000/api/v1/upload/${location}/batch`;

    const userToken = getCookie('Token');
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('image', file);
      formData.append('locations', location);
    });

    const req = xmlHttpRequest || new XMLHttpRequest();

    req.addEventListener('load', () => {
      if (isSucceed(req.status)) {
        const response = JSON.parse(req.response) as CommonResponseProps<
          FileProps[]
        >;

        return resolve({
          data: response?.data || null,
          isSuccess: isSucceed(response.statusCode) || false,
          statusCode: response.statusCode || 502,
          message: isSucceed(response.statusCode)
            ? 'آپلود فایل با خطا مواجه شد'
            : '',
          errors: response.errors || [],
        });
      } else {
        const response = JSON.parse(req.response) as CommonResponseProps<
          FileProps[]
        >;

        return reject({
          data: response?.data || null,
          isSuccess: isSucceed(response.statusCode) || false,
          status: response.statusCode || 502,
          message:
            response.errors.length > 0
              ? response.errors?.[0] || 'آپلود فایل با خطا مواجه شد'
              : [],
          errors: response.errors || [],
        });
      }
    });

    req.addEventListener('error', () => reject({ status: req.status }));
    req.onerror = () => reject({ status: req.status });
    if (onUploadProgressChange) {
      req.upload.addEventListener('progress', (progressEvent) => {
        const uploadPercentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        onUploadProgressChange(uploadPercentage);
      });
    }

    req.open('POST', url);
    req.setRequestHeader('X-API-KEY', userToken || '');
    req.send(formData);
  });
};
