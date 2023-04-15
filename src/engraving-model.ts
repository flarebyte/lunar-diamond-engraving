import { z } from 'zod';
import { stringy } from './field-validation.js';
import { formatMessage, type ValidationError } from './format-message.js';
import { type Result, succeed, willFail } from './railway.js';

const describeEnum = (intro: string, objectValue: { [k: string]: string }) => {
  const description = [`${intro} with either:`];
  for (const [name, title] of Object.entries(objectValue)) {
    description.push(`${name}: ${title}`);
  }
  return description.join('\n');
};

const asEnumKeys = (value: {}) => Object.keys(value) as [string, ...string[]];

const functionKindEmum = {
  async:
    'This function returns a Promise and can be used with async/await syntax.',
  sync: 'This function executes synchronously and returns its result immediately.',
};

const actionsSchema = z.object({
  a: z
    .enum(asEnumKeys(functionKindEmum))
    .describe(describeEnum('Kind of the action function', functionKindEmum)),
  title: stringy.title,
  uses: stringy.uses,
});

const phasesSchema = z.object({
  validation: z.object({
    a: z
      .enum(asEnumKeys(functionKindEmum))
      .describe(
        describeEnum('Kind of the validation function', functionKindEmum)
      ),
    title: stringy.title,
    uses: stringy.uses,
  }),
  actions: z.record(stringy.customKey, actionsSchema),
  onFinish: z.object({
    a: z
      .enum(asEnumKeys(functionKindEmum))
      .describe(describeEnum('Kind of the final function', functionKindEmum)),
    title: stringy.title,
    uses: stringy.uses,
  }),
});

const engravingSchema = z.object({
  title: stringy.title,
  phases: phasesSchema,
});

export type Payload = z.infer<typeof schema>;
export const schema = z
  .object({
    title: stringy.title,
    engravings: z.record(stringy.customKey, engravingSchema),
  })
  .describe('Settings for a lunar-diamond-engraving file')
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
