import {
  EngravingValidationFunction,
  EngravingActionResult,
  EngravingValidationError,
  EngravingValidationSuccess,
  EngravingActionFunction,
  EngravingOnFinishResult,
  EngravingOnFinishFunction,
} from '../src/api-model.js';
import { EngravingChiselBuilder } from '../src/chisel-factory.js';
import {
  EngravingLoggerFunction,
  EngravingMask,
  EngravingModel,
  EngravingValidationOpts,
  EngravingOnFinishOpts,
  EngravingLoggerOpts,
  createMessage,
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

const validateContact: EngravingValidationFunction = (
  opts: EngravingValidationOpts
) => {
  const value: EngravingValidationSuccess = {
    txId: opts.engravingInput.txId,
    engraving: opts.engravingInput.name,
    target: opts.target,
    metadata: { city: 'London' },
    messages: [createMessage('green', 'Validation fails')],
    durationMagnitude: 2,
    validated: opts.object,
  };
  return Promise.resolve({ status: 'success', value });
};

const validateContactFail: EngravingValidationFunction = (
  opts: EngravingValidationOpts
) => {
  const error: EngravingValidationError = {
    txId: opts.engravingInput.txId,
    engraving: opts.engravingInput.name,
    target: opts.target,
    metadata: { city: 'London' },
    messages: [createMessage('green', 'Validation fails')],
    durationMagnitude: 2,
    exitOnFailure: true,
  };
  return Promise.resolve({
    status: 'failure',
    error,
  });
};

const contactLogger: EngravingLoggerFunction = (_opts: EngravingLoggerOpts) => {
  return Promise.resolve();
};

const contactWork: EngravingActionFunction = (mask: EngravingMask) => {
  const value: EngravingActionResult = {
    txId: mask.txId,
    engraving: mask.name,
    action: 'contactWork',
    metadata: { account: '98' },
    messages: [],
    durationMagnitude: 2,
  };
  return Promise.resolve({ status: 'success', value });
};

const contactWorkFail: EngravingActionFunction = (mask: EngravingMask) => {
  const error: EngravingActionResult = {
    txId: mask.txId,
    engraving: mask.name,
    action: 'contactWorkFail',
    metadata: { account: '98' },
    messages: [createMessage('indigo', 'contact work fail')],
    durationMagnitude: 2,
  };
  return Promise.resolve({
    status: 'failure',
    error,
  });
};

const contactFinish: EngravingOnFinishFunction = (
  opts: EngravingOnFinishOpts
) => {
  const value: EngravingOnFinishResult = {
    txId: opts.engravingInput.txId,
    engraving: opts.engravingInput.name,
    metadata: {},
    durationMagnitude: 2,
    messages: [],
  };
  return Promise.resolve({ status: 'success', value });
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
