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

const phasesSchema = z
  .object({
    validation: z.object({
      a: z
        .enum(asEnumKeys(functionKindEmum))
        .describe(
          describeEnum('Kind of the validation function', functionKindEmum)
        ),
      title: stringy.title.describe('What is been validated'),
      uses: stringy.uses,
    }),
    actions: z
      .record(stringy.customKey, actionsSchema)
      .describe('A list of actions to run'),
    onFinish: z
      .object({
        a: z
          .enum(asEnumKeys(functionKindEmum))
          .describe(
            describeEnum('Kind of the final function', functionKindEmum)
          ),
        title: stringy.title,
        uses: stringy.uses,
      })
      .describe(
        'The final action that will be called when all other actions will have finished'
      ),
  })
  .describe('Describe a phase of engraving for a specific domain');

const engravingSchema = z
  .object({
    title: stringy.title.describe('A concise title describing the domain'),
    url: stringy.url.optional(),
    phases: phasesSchema.describe(
      'The different phases of engraving the domain'
    ),
  })
  .describe('Domain for engraving (ex: student)')
  .strict();

export type Payload = z.infer<typeof schema>;
export const schema = z
  .object({
    title: stringy.title,
    webpage: stringy.webpage,
    url: stringy.url.optional(),
    engravings: z
      .record(stringy.customKey, engravingSchema)
      .describe('List of domain for engraving'),
  })
  .describe('Settings for a lunar-diamond-engraving file')
  .strict();

export type EngravingModel = z.infer<typeof schema>;

export type EngravingModelValidation = Result<EngravingModel, ValidationError[]>;

export const safeParseBuild = (content: unknown): EngravingModelValidation => {
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
