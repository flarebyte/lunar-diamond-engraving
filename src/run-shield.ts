import {
  EngravingMask,
  EngravingChisel,
  EngravingValidationFunction,
  EngravingValidationOpts,
  EngravingValidationSuccess,
  EngravingValidationError,
} from './api-model.js';
import { createValidationError } from './create-error.js';
import { SingleEngravingModel } from './engraving-model.js';
import { Result, willFail } from './railway.js';
import { orderOfMagnitude } from './utility.js';

const saferShield = async (
  decorated: EngravingValidationFunction,
  value: EngravingValidationOpts
): Promise<Result<EngravingValidationSuccess, EngravingValidationError>> => {
  const started = Date.now();
  try {
    const result = await decorated(value);
    return result;
  } catch (error) {
    const finished = Date.now();
    if (error instanceof Error) {
      const { message } = error;
      return willFail(
        createValidationError({
          target: value.target,
          mask: value.engravingInput,
          durationMagnitude: orderOfMagnitude(started, finished),
          message,
          exitOnFailure: true,
        })
      );
    }

    return willFail(
      createValidationError({
        target: value.target,
        mask: value.engravingInput,
        durationMagnitude: orderOfMagnitude(started, finished),
        message: '(229728) shield default error',
        exitOnFailure: true,
      })
    );
  }
};

/** Run shield converting any exception to a failure result */
export const runShield = async (
  shield: SingleEngravingModel['phases']['shield'],
  mask: EngravingMask,
  chisel: EngravingChisel
) => {
  const shieldfunc = {
    opts: chisel.shieldFunctions[shield.check.opts],
    headers: chisel.shieldFunctions[shield.check.headers],
    parameters: chisel.shieldFunctions[shield.check.parameters],
    payload: chisel.shieldFunctions[shield.check.payload],
    context: chisel.shieldFunctions[shield.check.context],
  };

  if (shieldfunc.opts === undefined) {
    throw Error(
      `${shield.check.opts} used by ${mask.name} is not a shield function (ops)`
    );
  }
  if (shieldfunc.headers === undefined) {
    throw Error(
      `${shield.check.headers} used by ${mask.name} is not a shield function (headers)`
    );
  }
  if (shieldfunc.parameters === undefined) {
    throw Error(
      `${shield.check.parameters} used by ${mask.name} is not a shield function (parameters)`
    );
  }
  if (shieldfunc.payload === undefined) {
    throw Error(
      `${shield.check.payload} used by ${mask.name} is not a shield function (payload)`
    );
  }
  if (shieldfunc.context === undefined) {
    throw Error(
      `${shield.check.context} used by ${mask.name} is not a shield function (context)`
    );
  }

  const results = {
    opts: await saferShield(shieldfunc.opts, {
      target: 'opts',
      object: mask.opts,
      engravingInput: mask,
    }),
    headers: await saferShield(shieldfunc.headers, {
      target: 'headers',
      object: mask.headers,
      engravingInput: mask,
    }),
    parameters: await saferShield(shieldfunc.parameters, {
      target: 'parameters',
      object: mask.parameters,
      engravingInput: mask,
    }),
    payload: await saferShield(shieldfunc.payload, {
      target: 'payload',
      object: mask.payload,
      engravingInput: mask,
    }),
    context: await saferShield(shieldfunc.context, {
      target: 'context',
      object: mask.context,
      engravingInput: mask,
    }),
  };

  const isSuccess =
    results.opts.status === 'success' &&
    results.headers.status === 'success' &&
    results.parameters.status === 'success' &&
    results.payload.status === 'success' &&
    results.context.status === 'success';
  const err = {
    opts: results.opts.status === 'failure' ? [results.opts.error] : [],
    headers:
      results.headers.status === 'failure' ? [results.headers.error] : [],
    parameters:
      results.parameters.status === 'failure' ? [results.parameters.error] : [],
    payload:
      results.payload.status === 'failure' ? [results.payload.error] : [],
    context:
      results.context.status === 'failure' ? [results.context.error] : [],
  };
  const errors = [
    ...err.opts,
    ...err.headers,
    ...err.parameters,
    ...err.payload,
    ...err.context,
  ];

  const exitOnFailure =
    (results.opts.status === 'failure' && results.opts.error.exitOnFailure) ||
    (results.headers.status === 'failure' &&
      results.headers.error.exitOnFailure) ||
    (results.parameters.status === 'failure' &&
      results.parameters.error.exitOnFailure) ||
    (results.payload.status === 'failure' &&
      results.payload.error.exitOnFailure) ||
    (results.context.status === 'failure' &&
      results.context.error.exitOnFailure);

  return { isSuccess, exitOnFailure, ...results, errors };
};
