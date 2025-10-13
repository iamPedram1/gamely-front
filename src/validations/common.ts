import {
  array,
  number,
  object,
  string,
  ZodArray,
  ZodNumber,
  ZodOptional,
  ZodString,
  ZodType,
  ZodTypeAny,
  instanceof as instanceof_,
} from 'zod';

/**
 * Generate a reusable string schema with common options
 * @param label - field name to include in messages
 * @param min - optional minimum length
 * @param max - optional maximum length
 * @param required - optional flag to mark as required (default true)
 */
export const generateStringSchema = (
  label: string,
  min?: number,
  max?: number,
  required = true
): ZodString | ZodOptional<ZodString> => {
  let schema: ZodString = string({
    required_error: `${label} is required`,
    invalid_type_error: `${label} must be a string`,
  });

  if (min)
    schema = schema.min(min, {
      message: `${label} must be at least ${min} characters long`,
    });

  if (max)
    schema = schema.max(max, {
      message: `${label} cannot be longer than ${max} characters`,
    });

  return required ? schema : schema.optional();
};

/**
 * Generate a number schema
 */
export const generateNumberSchema = (
  label: string,
  min?: number,
  max?: number,
  required = true
): ZodNumber | ZodOptional<ZodNumber> => {
  let schema: ZodNumber = number({
    required_error: `${label} is required`,
    invalid_type_error: `${label} must be a number`,
  });

  if (min)
    schema = schema.min(min, {
      message: `${label} must be at least ${min}`,
    });

  if (max)
    schema = schema.max(max, {
      message: `${label} must be less than or equal to ${max}`,
    });

  return required ? schema : schema.optional();
};

/**
 * Generate a regex-based string schema (like slug)
 */
export const generateRegexStringSchema = (
  label: string,
  regex: RegExp,
  message?: string
) => {
  return string({
    required_error: `${label} is required`,
    invalid_type_error: `${label} must be a string`,
  }).regex(regex, message || `${label} format is invalid`);
};

/**
 * Creates a Zod schema that validates either:
 * - a native File instance (browser), or
 * - an object describing a file (from backend or database)
 *
 * @param label - used for validation message
 */
export const generateFileSchema = (label = 'File'): ZodType =>
  instanceof_(File, {
    message: `Please upload the ${label.toLowerCase()}`,
  }).or(
    object({
      id: string(),
      location: string(),
      filename: string(),
      size: number(),
      mimetype: string(),
      url: string(),
      createdAt: string(),
      updatedAt: string(),
    })
  );

/**
 * Generates a reusable array schema with min/max and automatic messages
 *
 * @param label - name of the field (used in messages)
 * @param itemSchema - Zod schema for each item in the array (e.g. z.string())
 * @param min - optional minimum number of items
 * @param max - optional maximum number of items
 * @param required - mark as optional or required (default true)
 */
export const generateArraySchema = <T extends ZodTypeAny>(
  label: string,
  itemSchema: T,
  min?: number,
  max?: number,
  required = true
): ZodArray<T> | ZodOptional<ZodArray<T>> => {
  let schema = array(itemSchema, {
    required_error: `${label} is required`,
    invalid_type_error: `${label} must be an array`,
  });

  if (min)
    schema = schema.min(min, {
      message: `${label} must contain at least ${min} item${
        min > 1 ? 's' : ''
      }`,
    });

  if (max)
    schema = schema.max(max, {
      message: `${label} cannot contain more than ${max} item${
        max > 1 ? 's' : ''
      }`,
    });

  return required ? schema : schema.optional();
};

/**
 * Creates a generic string array schema with optional validation options.
 */
export const generateStringArraySchema = (
  label: string,
  options?: {
    min?: number;
    max?: number;
    required?: boolean;
  }
) => {
  let schema = array(
    string({
      required_error: `${label} is required`,
      invalid_type_error: `${label} must be an array`,
    })
  );

  if (options?.min !== undefined)
    schema = schema.min(options.min, {
      message: `${label} must have at least ${options.min} items`,
    });

  if (options?.max !== undefined)
    schema = schema.max(options.max, {
      message: `${label} must have at most ${options.max} items`,
    });

  return options?.required ? schema : schema.optional();
};
