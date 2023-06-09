/* eslint-disable @typescript-eslint/no-floating-promises */
import {describe, test} from 'node:test';
import {strict as assert} from 'node:assert';
import {createFixtureChisel} from './fixture-helper.js';

describe('chisel-factory.ts', () => {
  test('Check references', () => {
    const builder = createFixtureChisel({modelId: 'contact', triggerFail: []});
    const {used, supported, missing, unused} = builder.checkReferences();
    assert.equal(used.length, 14, 'used');
    assert.equal(supported.length, 15, 'supported');
    assert.equal(missing.length, 0, 'missing');
    assert.equal(unused.length, supported.length - used.length, 'unused');
  });
});
