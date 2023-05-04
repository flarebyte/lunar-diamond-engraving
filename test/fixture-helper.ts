import { EngravingChiselBuilder } from '../src/chisel-factory.js';
import {
  AsyncEngravingActionFunction,
  AsyncEngravingValidationFunction,
  EngravingLoggerFunction,
  EngravingMask,
  EngravingModel,
  EngravingValidationOpts,
  AsyncEngravingOnFinishFunction,
  EngravingOnFinishOpts,
  EngravingLoggerOpts,
} from '../src/index.mjs';

const contactModel: EngravingModel = {
  title: 'Engraving example',
  webpage: 'https://github.com/flarebyte/lunar-diamond-engraving',
  url: 'https://raw.githubusercontent.com/flarebyte/lunar-diamond-engraving/main/package.json',
  engravings: {
    'contact-address': {
      title: 'Write to address for contact',
      logger: 'logger:fake/log',
      phases: {
        validation: {
          title: 'Validate contact address',
          keywords: 'zod',
          check: {
            opts: 'validation:contact/opts',
            headers: 'validation:contact/headers',
            parameters: 'validation:contact/parameters',
            payload: 'validation:contact/payload',
            context: 'validation:contact/context',
          },
        },
        shield: {
          title: 'Validate contact address',
          keywords: 'zod',
          check: {
            opts: 'shield:contact/opts',
            headers: 'shield:contact/headers',
            parameters: 'shield:contact/parameters',
            payload: 'shield:contact/payload',
            context: 'shield:contact/context',
          },
        },
        actions: {
          'store-contact': {
            title: 'Store contact to latest storage',
            keywords: 'S3',
            uses: 'work:s3/contact-address',
          },
          'historical-store-contact': {
            title: 'Store contact to historical storage',
            uses: 'work:s3/historical-contact-address',
          },
        },
        onFinish: {
          title: 'Notify that the record has changed',
          uses: 'finish:sns/contact-ready',
        },
      },
    },
  },
};

const engravingModelFixtures = {
  contact: contactModel,
};

const validateContact: AsyncEngravingValidationFunction = (
  opts: EngravingValidationOpts
) => {
  return Promise.resolve({ status: 'success', value: opts });
};

const validateContactFail: AsyncEngravingValidationFunction = (
  opts: EngravingValidationOpts
) => {
  return Promise.resolve({
    status: 'failure',
    value: {
      txId: opts.engravingInput.txId,
      engraving: opts.engravingInput.name,
      target: opts.target,
      metadata: { city: 'London' },
      messages: 'Validation fails',
    },
  });
};

const contactLogger: EngravingLoggerFunction = (opts: EngravingLoggerOpts) => {
  return Promise.resolve();
};

const contactWork: AsyncEngravingActionFunction = (mask: EngravingMask) => {
  return Promise.resolve({ status: 'success', value: mask });
};

const contactWorkFail: AsyncEngravingActionFunction = (mask: EngravingMask) => {
  return Promise.resolve({
    status: 'failure',
    error: {
      id: '1666',
      txId: mask.txId,
      engraving: mask.name,
      action: 'contactWorkFail',
      metadata: { account: '98' },
      messages: ['contact work fail'],
    },
  });
};

const contactFinish: AsyncEngravingOnFinishFunction = (
  opts: EngravingOnFinishOpts
) => {
  return Promise.resolve({ status: 'success', value: opts });
};

export const createFixtureChisel = ({ modelId }: { modelId: 'contact' }) => {
  const builder = new EngravingChiselBuilder();
  builder.parseModel(engravingModelFixtures[modelId]);

  builder.addLoggerFunction('logger:fake/log', contactLogger);
  builder.addLoggerFunction('logger:fake/log2', contactLogger);
  
  builder.addValidationFunction('validation:contact/opts', validateContact);
  builder.addValidationFunction('validation:contact/headers', validateContact);
  builder.addValidationFunction(
    'validation:contact/parameters',
    validateContact
  );
  builder.addValidationFunction('validation:contact/payload', validateContact);
  builder.addValidationFunction(
    'validation:contact/payload/fail',
    validateContactFail
  );
  builder.addValidationFunction('validation:contact/context', validateContact);

  builder.addShieldFunction('shield:contact/opts', validateContact);
  builder.addShieldFunction('shield:contact/headers', validateContact);
  builder.addShieldFunction('shield:contact/parameters', validateContact);
  builder.addShieldFunction('shield:contact/payload', validateContact);
  builder.addShieldFunction('shield:contact/context', validateContact);

  builder.addActionFunction('work:s3/contact-address', contactWork);
  builder.addActionFunction('work:s3/contact-address/fail', contactWorkFail);
  builder.addActionFunction('work:s3/historical-contact-address', contactWork);

  builder.addOnFinishFunction('finish:sns/contact-ready', contactFinish);

  return builder;
};
