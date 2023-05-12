import {type EngravingActionResult} from './api-model.js';

export const isActionError = (value: unknown): value is EngravingActionResult =>
  typeof (value as EngravingActionResult).action === 'string';

export const isFulfilled = <T>(
  input: PromiseSettledResult<T>
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';
