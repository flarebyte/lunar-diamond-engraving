import { z } from 'zod';
import { stringy } from './field-validation.js';
import { formatMessage, type ValidationError } from './format-message.js';
import { type Result, succeed, willFail } from './railway.js';

  export const schema = z
  .object({
    title: stringy.title,
  })
  .describe('Settings for a baldrick-broth file')
  .strict();

export type BuildModel = z.infer<typeof schema>;

export type BuildModelValidation = Result<BuildModel, ValidationError[]>;

export const safeParseBuild = (content: unknown): BuildModelValidation => {
  const result = schema.safeParse(content);
  if (result.success) {
    return succeed(result.data);
  }

  const {
    error: { issues },
  } = result;
  const errors = issues.map(formatMessage);
  return willFail(errors);
};

export const getSchema = (_name: 'default') => {
  return schema;
};

export const unsafeParse =
  (config: Record<string, string>) => (_content: unknown) => {
    const name = `${config['model']}`.trim();

    return `${name} is not supported (979839)`;
  };
