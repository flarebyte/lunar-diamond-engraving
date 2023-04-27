import { describe, test } from 'node:test';
import { createFixtureChisel } from './fixture-helper.js';

describe('chisel-factory.ts', () => {
  test('Check references', () => {
    const builder = createFixtureChisel({ modelId: 'contact' });
    const { used, supported, missing, unused } = builder.checkReferences();
    console.log(`${{ used, supported, missing, unused }}`);
  });
});
