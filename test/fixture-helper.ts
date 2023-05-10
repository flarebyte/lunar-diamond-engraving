import {
  EngravingActionFunction,
  EngravingActionResult,
  EngravingChiselBuilder,
  EngravingLoggerFunction,
  EngravingLoggerOpts,
  EngravingMask,
  EngravingModel,
  EngravingOnFinishFunction,
  EngravingOnFinishOpts,
  EngravingOnFinishResult,
  EngravingValidationError,
  EngravingValidationFunction,
  EngravingValidationOpts,
  EngravingValidationSuccess,
  createEngravingMessage,
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
    messages: [createEngravingMessage('green', 'Validation fails')],
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
    messages: [createEngravingMessage('green', 'Validation fails')],
    durationMagnitude: 2,
    exitOnFailure: true,
  };
  return Promise.resolve({
    status: 'failure',
    error,
  });
};

const shieldContactFail: EngravingValidationFunction = (
  opts: EngravingValidationOpts
) => {
  const error: EngravingValidationError = {
    txId: opts.engravingInput.txId,
    engraving: opts.engravingInput.name,
    target: opts.target,
    metadata: { city: 'London' },
    messages: [createEngravingMessage('green', 'Validation fails')],
    durationMagnitude: 2,
    exitOnFailure: false,
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
    messages: [createEngravingMessage('indigo', 'contact work fail')],
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

const contactFinishfail: EngravingOnFinishFunction = (
  opts: EngravingOnFinishOpts
) => {
  const error: EngravingOnFinishResult = {
    txId: opts.engravingInput.txId,
    engraving: opts.engravingInput.name,
    metadata: {},
    durationMagnitude: 2,
    messages: [],
  };
  return Promise.resolve({ status: 'failure', error });
};

export const createFixtureChisel = ({
  modelId,
  triggerFail,
}: {
  modelId: 'contact';
  triggerFail: (
    | 'validation-payload'
    | 'contact-address'
    | 'shield-parameters'
    | 'shield-context'
    | 'on-finish-ready'
  )[];
}) => {
  const builder = new EngravingChiselBuilder();
  builder.parseModel(engravingModelFixtures[modelId]);

  builder.addLoggerFunction('logger:fake/log', contactLogger);

  builder.addValidationFunction('validation:contact/opts', validateContact);
  builder.addValidationFunction('validation:contact/headers', validateContact);
  builder.addValidationFunction(
    'validation:contact/parameters',
    validateContact
  );
  if (triggerFail.includes('validation-payload')) {
    builder.addValidationFunction(
      'validation:contact/payload',
      validateContactFail
    );
  } else {
    builder.addValidationFunction(
      'validation:contact/payload',
      validateContact
    );
  }
  builder.addValidationFunction(
    'validation:contact/payload/fail',
    validateContactFail
  );
  builder.addValidationFunction('validation:contact/context', validateContact);

  builder.addShieldFunction('shield:contact/opts', validateContact);
  builder.addShieldFunction('shield:contact/headers', validateContact);
  if (triggerFail.includes('shield-parameters')) {
    builder.addShieldFunction('shield:contact/parameters', validateContact);
  } else {
    builder.addShieldFunction('shield:contact/parameters', shieldContactFail);
  }
  builder.addShieldFunction('shield:contact/payload', validateContact);
  if (triggerFail.includes('shield-context')) {
    builder.addShieldFunction('shield:contact/context', validateContactFail);
  } else {
    builder.addShieldFunction('shield:contact/context', validateContact);
  }
  if (triggerFail.includes('contact-address')) {
    builder.addActionFunction('work:s3/contact-address', contactWorkFail);
  } else {
    builder.addActionFunction('work:s3/contact-address', contactWork);
  }

  builder.addActionFunction('work:s3/historical-contact-address', contactWork);
  if (triggerFail.includes('on-finish-ready')) {
    builder.addOnFinishFunction('finish:sns/contact-ready', contactFinishfail);
  } else {
    builder.addOnFinishFunction('finish:sns/contact-ready', contactFinish);
  }

  return builder;
};
