import { EngravingChiselBuilder } from '../src/chisel-factory.js';
import { EngravingModel } from '../src/index.mjs';

const contactModel: EngravingModel = {
  title: 'Engraving example',
  webpage: 'https://github.com/flarebyte/lunar-diamond-engraving',
  url: 'https://raw.githubusercontent.com/flarebyte/lunar-diamond-engraving/main/package.json',
  engravings: {
    'contact-address': {
      title: 'Write to address for contact',
      generator: 'generator:fake/uuid',
      logger: 'logger:fake/log',
      alerter: 'alerter:fake/alert',
      phases: {
        validation: {
          title: 'Validate contact address',
          logger: 'logger:fake/log2',
          alerter: 'alerter:fake/alert2',
          check: {
            opts: 'validation:contact:opts',
            headers: 'validation:contact/headers',
            parameters: 'validation:contact/parameter',
            payload: 'validation:contact:payload',
            context: 'validation:contact/context',
          },
        },
        shield: {
          title: 'Validate contact address',
          logger: 'logger:fake/log2',
          alerter: 'alerter:fake/alert2',
          check: {
            opts: 'shield:contact/opts',
            headers: 'shield:contact/headers',
            parameters: 'shield:contact/parameter',
            payload: 'shield:contact/payload',
            context: 'shield:contact/context',
          },
        },
        actions: {
          'store-contact': {
            title: 'Store contact to latest storage',
            uses: 'work:s3/contact-address',
            generator: 'generator:action/uuid',
            logger: 'logger:fake/log2',
            alerter: 'alerter:fake/alert2',
          },
          'historical-store-contact': {
            title: 'Store contact to historical storage',
            uses: 'work:s3/historical-contact-address',
          },
          'audit-journal': {
            title: 'write to audit journal',
            uses: 'work:s3/audit-journal',
          },
          'action-search-record': {
            title: 'write title and description to search database',
            uses: 'work:s3/contact-search',
          },
        },
        onFinish: {
          title: 'Notify that the record has changed',
          uses: 'work:sns/contact-ready',
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
