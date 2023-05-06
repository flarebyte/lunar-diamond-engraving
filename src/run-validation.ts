import {
  EngravingMask,
  EngravingChisel,
  EngravingValidationSuccess,
  EngravingValidationError,
  EngravingValidationOpts,
  EngravingValidationFunction,
} from './api-model.js';
import { createValidationError } from './create-error.js';
import { SingleEngravingModel } from './engraving-model.js';
import { Result, willFail } from './railway.js';
import { orderOfMagnitude } from './utility.js';

const saferValidate = async (
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
        message: '(175612) validation default error',
        exitOnFailure: true,
      })
    );
  }
};

/** Run validation converting any exception to a failure result */
export const runValidation = async (
  validation: SingleEngravingModel['phases']['validation'],
  mask: EngravingMask,
  chisel: EngravingChisel
) => {
  const validate = {
    opts: chisel.validationFunctions[validation.check.opts],
    headers: chisel.validationFunctions[validation.check.headers],
    parameters: chisel.validationFunctions[validation.check.parameters],
    payload: chisel.validationFunctions[validation.check.payload],
    context: chisel.validationFunctions[validation.check.context],
  };

  if (validate.opts === undefined) {
    throw Error(
      `${validation.check.opts} used by ${mask.name} is not a validation function (ops)`
    );
  }
  if (validate.headers === undefined) {
    throw Error(
      `${validation.check.headers} used by ${mask.name} is not a validation function (headers)`
    );
  }
  if (validate.parameters === undefined) {
    throw Error(
      `${validation.check.parameters} used by ${mask.name} is not a validation function (parameters)`
    );
  }
  if (validate.payload === undefined) {
    throw Error(
      `${validation.check.payload} used by ${mask.name} is not a validation function (payload)`
    );
  }
  if (validate.context === undefined) {
    throw Error(
      `${validation.check.context} used by ${mask.name} is not a validation function (context)`
    );
  }

  const results = {
    opts: await saferValidate(validate.opts, {
      target: 'opts',
      object: mask.opts,
      engravingInput: mask,
    }),
    headers: await saferValidate(validate.headers, {
      target: 'headers',
      object: mask.headers,
      engravingInput: mask,
    }),
    parameters: await saferValidate(validate.parameters, {
      target: 'parameters',
      object: mask.parameters,
      engravingInput: mask,
    }),
    payload: await saferValidate(validate.payload, {
      target: 'payload',
      object: mask.payload,
      engravingInput: mask,
    }),
    context: await saferValidate(validate.context, {
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
  return { isSuccess, ...results, errors };
};
