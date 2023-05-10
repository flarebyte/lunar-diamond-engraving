import { describe, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { createFixtureChisel } from './fixture-helper.js';
import { EngravingMask, runEngraving } from '../src/index.mjs';

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
  test('Run successful engraving', async () => {
    const builder = createFixtureChisel({
      modelId: 'contact',
      triggerFail: [],
    });
    const actual = await runEngraving({
      mask: emptyMask,
      chisel: builder.build(),
    });
    assert.equal(actual.status, 'success');
  });
  test('Run engraving with fail validation', async () => {
    const builder = createFixtureChisel({
      modelId: 'contact',
      triggerFail: ['validation-payload'],
    });
    const actual = await runEngraving({
      mask: emptyMask,
      chisel: builder.build(),
    });
    assert.equal(actual.status, 'failure');
  });
  test('Run engraving with fail shield', async () => {
    const builder = createFixtureChisel({
      modelId: 'contact',
      triggerFail: ['shield-parameters'],
    });
    const actual = await runEngraving({
      mask: emptyMask,
      chisel: builder.build(),
    });
    assert.equal(actual.status, 'success');
  });

  test('Run engraving with fail shield and exit', async () => {
    const builder = createFixtureChisel({
      modelId: 'contact',
      triggerFail: ['shield-context'],
    });
    const actual = await runEngraving({
      mask: emptyMask,
      chisel: builder.build(),
    });
    assert.equal(actual.status, 'failure');
  });

  test('Run engraving with fail action', async () => {
    const builder = createFixtureChisel({
      modelId: 'contact',
      triggerFail: ['contact-address'],
    });
    const actual = await runEngraving({
      mask: emptyMask,
      chisel: builder.build(),
    });
    assert.equal(actual.status, 'success');
  });

  test('Run engraving with fail onFinish', async () => {
    const builder = createFixtureChisel({
      modelId: 'contact',
      triggerFail: ['on-finish-ready'],
    });
    const actual = await runEngraving({
      mask: emptyMask,
      chisel: builder.build(),
    });
    assert.equal(actual.status, 'failure');
  });
});
