import {
  EngravingMask,
  EngravingChisel
} from './api-model.js';
import { SingleEngravingModel } from './engraving-model.js';

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
    opts: await validate.opts({
      target: 'opts',
      object: mask.opts,
      engravingInput: mask,
    }),
    headers: await validate.opts({
      target: 'headers',
      object: mask.headers,
      engravingInput: mask,
    }),
    parameters: await validate.opts({
      target: 'parameters',
      object: mask.parameters,
      engravingInput: mask,
    }),
    payload: await validate.opts({
      target: 'payload',
      object: mask.payload,
      engravingInput: mask,
    }),
    context: await validate.opts({
      target: 'context',
      object: mask.context,
      engravingInput: mask,
    }),
  };

  const isSuccess = results.opts.status === 'success' &&
    results.headers.status === 'success' &&
    results.parameters.status === 'success' &&
    results.payload.status === 'success' &&
    results.context.status === 'success';

  const err = {
    opts: results.opts.status === 'failure' ? [results.opts.error] : [],
    headers: results.headers.status === 'failure' ? [results.headers.error] : [],
    parameters: results.parameters.status === 'failure' ? [results.parameters.error] : [],
    payload: results.payload.status === 'failure' ? [results.payload.error] : [],
    context: results.context.status === 'failure' ? [results.context.error] : [],
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
    opts: await shieldfunc.opts({
      target: 'opts',
      object: mask.opts,
      engravingInput: mask,
    }),
    headers: await shieldfunc.opts({
      target: 'headers',
      object: mask.headers,
      engravingInput: mask,
    }),
    parameters: await shieldfunc.opts({
      target: 'parameters',
      object: mask.parameters,
      engravingInput: mask,
    }),
    payload: await shieldfunc.opts({
      target: 'payload',
      object: mask.payload,
      engravingInput: mask,
    }),
    context: await shieldfunc.opts({
      target: 'context',
      object: mask.context,
      engravingInput: mask,
    }),
  };

  const isSuccess = results.opts.status === 'success' &&
    results.headers.status === 'success' &&
    results.parameters.status === 'success' &&
    results.payload.status === 'success' &&
    results.context.status === 'success';
  const err = {
    opts: results.opts.status === 'failure' ? [results.opts.error] : [],
    headers: results.headers.status === 'failure' ? [results.headers.error] : [],
    parameters: results.parameters.status === 'failure' ? [results.parameters.error] : [],
    payload: results.payload.status === 'failure' ? [results.payload.error] : [],
    context: results.context.status === 'failure' ? [results.context.error] : [],
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