import { z } from 'zod';
import { stringy } from './field-validation.js';
import { formatMessage, type ValidationError } from './format-message.js';
import { type Result, succeed, willFail } from './railway.js';

const actionsSchema = z.object({
  title: stringy.title,
  keywords: stringy.keywords.optional(),
  logger: stringy.logger.optional(),
  alerter: stringy.alerter.optional(),
  generator: stringy.generator.optional(),
  uses: stringy.uses,
});

const validation = z.object({
  opts: stringy.validationId.describe(
    'Id for validating the options passed to processing'
  ),
  headers: stringy.validationId.describe('Id for validating the HTTP headers'),
  parameters: stringy.validationId.describe(
    'Id for validating the query parameters'
  ),
  payload: stringy.validationId.describe('Id for validating the incoming payload'),
  context: stringy.validationId.describe('iId for validating context'),
});

const shield = z.object({
  opts: stringy.shieldId.describe(
    'Id for validating the options passed to processing'
  ),
  headers: stringy.shieldId.describe('Id for validating the HTTP headers'),
  parameters: stringy.shieldId.describe(
    'Id for validating the query parameters'
  ),
  payload: stringy.shieldId.describe('Id for validating the incoming payload'),
  context: stringy.shieldId.describe('iId for validating context'),
});
const phasesSchema = z
  .object({
    validation: z.object({
      title: stringy.title.describe('What is been validated'),
      keywords: stringy.keywords.optional(),
      check: validation.describe('Main validation that must be satisfied'),
      logger: stringy.logger.optional(),
      alerter: stringy.alerter.optional(),
      generator: stringy.generator.optional(),
    }),
    shield: z.object({
      title: stringy.title.describe('What is been validated'),
      keywords: stringy.keywords.optional(),
      check: shield.describe('Main validation that must be satisfied'),
      logger: stringy.logger.optional(),
      alerter: stringy.alerter.optional(),
      generator: stringy.generator.optional(),
    }),
    actions: z
      .record(stringy.customKey, actionsSchema)
      .describe('A list of actions to run'),
    onFinish: z
      .object({
        title: stringy.title,
        keywords: stringy.keywords.optional(),
        logger: stringy.logger.optional(),
        alerter: stringy.alerter.optional(),
        generator: stringy.generator.optional(),      
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
    logger: stringy.logger,
    alerter: stringy.alerter,
    generator: stringy.generator,
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

export type EngravingModelValidation = Result<
  EngravingModel,
  ValidationError[]
>;

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
