import { EngravingChiselBuilder } from '../src/chisel-factory.js';
import { EngravingModel } from '../src/index.mjs';

const contactModel: EngravingModel = {
  title: 'Engraving example',
  webpage: 'https://github.com/flarebyte/lunar-diamond-engraving',
  url: 'https://raw.githubusercontent.com/flarebyte/lunar-diamond-engraving/main/package.json',
  engravings: {
    'contact-address': {
      title: 'Write to address for contact',
      generator: 'id/action/uuid',
      logger: 'logger/action',
      alerter: 'alerter/action',
      phases: {
        validation: {
          title: 'Validate contact address',
          logger: 'logger/validation',
          alerter: 'alerter/validation',
          check: {
            opts: 'zod/contact/opts',
            headers: 'zod/contact/headers',
            parameters: 'zod/contact/parameter',
            payload: 'zod/contact/payload',
            context: 'zod/contact/context',
          },
        },
        shield: {
          title: 'Validate contact address',
          logger: 'logger/validation',
          alerter: 'alerter/validation',
          check: {
            opts: 'zod/contact/opts',
            headers: 'zod/contact/headers',
            parameters: 'zod/contact/parameter',
            payload: 'zod/contact/payload',
            context: 'zod/contact/context',
          },
        },
        actions: {
          'store-contact': {
            title: 'Store contact to latest storage',
            uses: 's3/contact-address',
            generator: 'id/action/uuid',
            logger: 'logger/action',
            alerter: 'alerter/action',
          },
          'historical-store-contact': {
            title: 'Store contact to historical storage',
            uses: 's3/historical-contact-address',
          },
          'audit-journal': {
            title: 'write to audit journal',
            uses: 's3/audit-journal',
          },
          'action-search-record': {
            title: 'write title and description to search database',
            uses: 's3/contact-search',
          },
        },
        onFinish: {
          title: 'Notify that the record has changed',
          uses: 'sns/contact-ready',
        },
      },
    },
  },
};

const engravingModelFixtures = {
  contact: contactModel,
};

export const createFixtureChisel = ({ modelId }: { modelId: 'contact' }) => {
  const builder = new EngravingChiselBuilder();
  builder.parseModel(engravingModelFixtures[modelId]);
  return builder;
};
