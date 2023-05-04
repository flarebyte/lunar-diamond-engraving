import {
  EngravingMask, EngravingActionResult, OnFinishResult,
} from './api-model.js';


export const createActionError = (
  name: string,
  mask: EngravingMask,
  durationOrderOfMagnitude: number,
  message: string
): EngravingActionResult => ({
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
): OnFinishResult => ({
  txId: mask.txId,
  engraving: mask.name,
  durationMagnitude: durationOrderOfMagnitude,
  metadata: {},
  messages: [message],
});