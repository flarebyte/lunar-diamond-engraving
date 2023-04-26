import { EngravingChiselBuilder } from '../src/chisel-factory.js';

const contactModel = {
  title: 'Engraving example',
  engravings: {
    'contact-address': {
      title: 'Write to address for contact',
      generator: 'id/action/uuid',
      logger: 'logger/action',
      alerter: 'alerter/action',
      phases: {
        validation: {
          kind: 'async',
          title: 'Validate contact address',
          logger: 'logger/validation',
          alerter: 'alerter/validation',
          generator: {
            check: 'id/check/uuid',
            shield: 'id/shield/uuid',
          },
          check: {
            opts: 'zod/contact/opts',
            headers: 'zod/contact/headers',
            parameter: 'zod/contact/parameter',
            payload: 'zod/contact/payload',
            context: 'zod/contact/context',
          },
          shield: {
            opts: 'zod/shield/contact/opts',
            headers: 'zod/shield/contact/headers',
            parameter: 'zod/shield/contact/parameter',
            payload: 'zod/cshield/ontact/payload',
            context: 'zod/shield/contact/context',
          },
        },
        actions: {
          'store-contact': {
            kind: 'async',
            title: 'Store contact to latest storage',
            uses: 's3/contact-address',
            generator: 'id/action/uuid',
            logger: 'logger/action',
            alerter: 'alerter/action',
          },
          'historical-store-contact': {
            kind: 'async',
            title: 'Store contact to historical storage',
            uses: 's3/historical-contact-address',
          },
          'audit-journal': {
            kind: 'async',
            title: 'write to audit journal',
            uses: 's3/audit-journal',
          },
          'action-search-record': {
            kind: 'async',
            title: 'write title and description to search database',
            uses: 's3/contact-search',
          },
        },
        onFinish: {
          kind: 'async',
          title: 'Notify that the record has changed',
          uses: 'sns/contact-ready',
        },
      },
    },
  },
};

const engravingModelFixtures = {
    contact: contactModel
}



export const createFixtureChisel = ({modelId}:{modelId: 'contact' }) => {
  const builder = new EngravingChiselBuilder();
  builder.parseModel(engravingModelFixtures[modelId]);
  return builder;
};
