import i18n from '@/i18n';
import {
  array,
  number,
  object,
  string,
  type ZodArray,
  type ZodNumber,
  type ZodOptional,
  type ZodString,
  type ZodType,
  type ZodTypeAny,
  instanceof as instanceof_,
} from 'zod';

/**
 * Get translated validation message
 * @param key - translation key from validation namespace
 * @param params - optional parameters for interpolation
 */
const t = (key: string, params?: Record<string, any>): string => {
  return i18n.t(`validation.${key}`, params) as string;
};

const tf = (fieldKey: string): string => {
  return i18n.t(`fields.${fieldKey}`) as string;
};

/**
 * Generate a reusable string schema with common options
 * @param fieldKey - field key from fields namespace for translation
 * @param min - optional minimum length
 * @param max - optional maximum length
 * @param required - optional flag to mark as required (default true)
 */
export const generateStringSchema = (
  fieldKey: string,
  min?: number,
  max?: number,
  required = true
): ZodString | ZodOptional<ZodString> => {
  const label = tf(fieldKey);

  let schema: ZodString = string({
    required_error: t('required', { field: label }),
    invalid_type_error: t('invalidString', { field: label }),
  });

  if (min)
    schema = schema.min(min, {
      message: t('minLength', { field: label, min }),
    });

  if (max)
    schema = schema.max(max, {
      message: t('maxLength', { field: label, max }),
    });

  return required ? schema : schema.optional();
};

/**
 * Generate a number schema
 */
export const generateNumberSchema = (
  fieldKey: string,
  min?: number,
  max?: number,
  required = true
): ZodNumber | ZodOptional<ZodNumber> => {
  const label = tf(fieldKey);

  let schema: ZodNumber = number({
    required_error: t('required', { field: label }),
    invalid_type_error: t('invalidNumber', { field: label }),
  });

  if (min !== undefined)
    schema = schema.min(min, {
      message: t('minValue', { field: label, min }),
    });

  if (max !== undefined)
    schema = schema.max(max, {
      message: t('maxValue', { field: label, max }),
    });

  return required ? schema : schema.optional();
};

/**
 * Generate a regex-based string schema (like slug)
 */
export const generateRegexStringSchema = (
  fieldKey: string,
  regex: RegExp,
  message?: string
) => {
  const label = tf(fieldKey);

  return string({
    required_error: t('required', { field: label }),
    invalid_type_error: t('invalidString', { field: label }),
  }).regex(regex, message || t('invalidFormat', { field: label }));
};

/**
 * Creates a Zod schema that validates either:
 * - a native File instance (browser), or
 * - an object describing a file (from backend or database)
 *
 * @param fieldKey - field key from fields namespace for translation
 */
export const generateFileSchema = (fieldKey = 'coverImage'): ZodType => {
  const label = tf(fieldKey);

  return instanceof_(File, {
    message: t('uploadFile', { field: label.toLowerCase() }),
  }).or(
    object({
      id: string().optional().nullable(),
      location: string().optional().nullable(),
      filename: string().optional().nullable(),
      size: number().optional().nullable(),
      mimetype: string().optional().nullable(),
      url: string().optional().nullable(),
      createdAt: string().optional().nullable(),
      updatedAt: string().optional().nullable(),
    })
  );
};

/**
 * Generates a reusable array schema with min/max and automatic messages
 *
 * @param fieldKey - field key from fields namespace for translation
 * @param itemSchema - Zod schema for each item in the array (e.g. z.string())
 * @param min - optional minimum number of items
 * @param max - optional maximum number of items
 * @param required - mark as optional or required (default true)
 */
export const generateArraySchema = <T extends ZodTypeAny>(
  fieldKey: string,
  itemSchema: T,
  min?: number,
  max?: number,
  required = true
): ZodArray<T> | ZodOptional<ZodArray<T>> => {
  const label = tf(fieldKey);

  let schema = array(itemSchema, {
    required_error: t('required', { field: label }),
    invalid_type_error: t('invalidArray', { field: label }),
  });

  if (min)
    schema = schema.min(min, {
      message: t('minItems', { field: label, min }),
    });

  if (max)
    schema = schema.max(max, {
      message: t('maxItems', { field: label, max }),
    });

  return required ? schema : schema.optional();
};

/**
 * Creates a generic string array schema with optional validation options.
 */
export const generateStringArraySchema = (
  fieldKey: string,
  options?: {
    min?: number;
    max?: number;
    required?: boolean;
  }
) => {
  const label = tf(fieldKey);

  let schema = array(
    string({
      required_error: t('required', { field: label }),
      invalid_type_error: t('invalidArray', { field: label }),
    })
  );

  if (options?.min !== undefined)
    schema = schema.min(options.min, {
      message: t('minItems', { field: label, min: options.min }),
    });

  if (options?.max !== undefined)
    schema = schema.max(options.max, {
      message: t('maxItems', { field: label, max: options.max }),
    });

  return options?.required ? schema : schema.optional();
};

/**
 * Generate an email schema with translation
 */
export const generateEmailSchema = (required = true) => {
  const label = tf('email');

  const schema = string({
    required_error: t('required', { field: label }),
    invalid_type_error: t('invalidString', { field: label }),
  }).email(t('invalidEmail'));

  return required ? schema : schema.optional();
};

/**
 * Generate a password confirmation schema
 */
export const generatePasswordConfirmSchema = (passwordField = 'password') => {
  return object({
    password: generateStringSchema('password', 8, 255),
    confirmPassword: generateStringSchema('confirmPassword', 8, 255),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('passwordMismatch'),
    path: ['confirmPassword'],
  });
};
