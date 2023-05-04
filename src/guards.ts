import { EngravingActionError } from './api-model.js';

export const isActionError = (value: unknown): value is EngravingActionError => true;
export const isFulfilled = <T>(
  input: PromiseSettledResult<T>
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';
