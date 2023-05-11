import {
  type EngravingMask,
  type EngravingChisel,
  type EngravingValidationFunction,
  type EngravingValidationOpts,
  type EngravingValidationSuccess,
  type EngravingValidationError,
} from './api-model.js';
import {createValidationError} from './create-error.js';
import {type SingleEngravingModel} from './engraving-model.js';
import {type Result, willFail} from './railway.js';
import {orderOfMagnitude} from './utility.js';
import {
  isValidationError,
  isValidationSuccessful,
  shouldValidationExitOnFailure,
} from './validation-utils.js';

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
      const {message} = error;
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
    throw new Error(
      `${shield.check.opts} used by ${mask.name} is not a shield function (ops)`
    );
  }

  if (shieldfunc.headers === undefined) {
    throw new Error(
      `${shield.check.headers} used by ${mask.name} is not a shield function (headers)`
    );
  }

  if (shieldfunc.parameters === undefined) {
    throw new Error(
      `${shield.check.parameters} used by ${mask.name} is not a shield function (parameters)`
    );
  }

  if (shieldfunc.payload === undefined) {
    throw new Error(
      `${shield.check.payload} used by ${mask.name} is not a shield function (payload)`
    );
  }

  if (shieldfunc.context === undefined) {
    throw new Error(
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

  const isSuccess = isValidationSuccessful(results);

  const error = isValidationError(results);

  const exitOnFailure = shouldValidationExitOnFailure(results);
  const errors = [
    ...error.opts,
    ...error.headers,
    ...error.parameters,
    ...error.payload,
    ...error.context,
  ];

  return {isSuccess, exitOnFailure, ...results, errors};
};
