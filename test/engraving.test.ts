import { describe, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { runEngraving } from '../src/engraving.js';
import { createFixtureChisel } from './fixture-helper.js';
import { EngravingMask } from '../src/api-model.js';

const emptyMask: EngravingMask = {
  name: 'contact-address',
  txId: 'txId123',
  opts: {},
  headers: {},
  parameters: {},
  payload: {},
  context: {},
};

describe('engraving.ts', () => {
  test('No test yet', async () => {
    const builder = createFixtureChisel({ modelId: 'contact' });
    const actual = await runEngraving({
      mask: emptyMask,
      chisel: builder.build(),
    });
    assert.notEqual(actual, null);
  });
});
