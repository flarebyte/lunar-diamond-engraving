import {
  EngravingMask, ActionError,
  OnFinishError
} from './api-model.js';


export const createActionError = (
  name: string,
  mask: EngravingMask,
  durationOrderOfMagnitude: number,
  message: string
): ActionError => ({
  txId: mask.txId,
  engraving: mask.name,
  durationMagnitude: durationOrderOfMagnitude,
  action: name,
  metadata: {},
  messages: [message],
});

export const createFinishError = (
  mask: EngravingMask,
  durationOrderOfMagnitude: number,
  message: string
): OnFinishError => ({
  txId: mask.txId,
  engraving: mask.name,
  durationMagnitude: durationOrderOfMagnitude,
  metadata: {},
  messages: [message],
});
