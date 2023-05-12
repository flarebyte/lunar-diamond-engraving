import {
  type EngravingValidationSuccess,
  type EngravingValidationError,
} from './api-model.js';
import {type Result} from './railway.js';

export function shouldValidationExitOnFailure(results: {
  opts: Result<EngravingValidationSuccess, EngravingValidationError>;
  headers: Result<EngravingValidationSuccess, EngravingValidationError>;
  parameters: Result<EngravingValidationSuccess, EngravingValidationError>;
  payload: Result<EngravingValidationSuccess, EngravingValidationError>;
  context: Result<EngravingValidationSuccess, EngravingValidationError>;
}) {
  return (
    (results.opts.status === 'failure' && results.opts.error.exitOnFailure) ||
    (results.headers.status === 'failure' &&
      results.headers.error.exitOnFailure) ||
    (results.parameters.status === 'failure' &&
      results.parameters.error.exitOnFailure) ||
    (results.payload.status === 'failure' &&
      results.payload.error.exitOnFailure) ||
    (results.context.status === 'failure' &&
      results.context.error.exitOnFailure)
  );
}

export function isValidationError(results: {
  opts: Result<EngravingValidationSuccess, EngravingValidationError>;
  headers: Result<EngravingValidationSuccess, EngravingValidationError>;
  parameters: Result<EngravingValidationSuccess, EngravingValidationError>;
  payload: Result<EngravingValidationSuccess, EngravingValidationError>;
  context: Result<EngravingValidationSuccess, EngravingValidationError>;
}) {
  return {
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
}

export function isValidationSuccessful(results: {
  opts: Result<EngravingValidationSuccess, EngravingValidationError>;
  headers: Result<EngravingValidationSuccess, EngravingValidationError>;
  parameters: Result<EngravingValidationSuccess, EngravingValidationError>;
  payload: Result<EngravingValidationSuccess, EngravingValidationError>;
  context: Result<EngravingValidationSuccess, EngravingValidationError>;
}) {
  return (
    results.opts.status === 'success' &&
    results.headers.status === 'success' &&
    results.parameters.status === 'success' &&
    results.payload.status === 'success' &&
    results.context.status === 'success'
  );
}
