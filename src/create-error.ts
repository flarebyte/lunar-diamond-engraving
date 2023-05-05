import {
  EngravingMask,
  EngravingActionResult,
  EngravingOnFinishResult,
} from './api-model.js';

export const createActionError = ({
  name,
  mask,
  durationMagnitude,
  message,
}: {
  name: string;
  mask: EngravingMask;
  durationMagnitude: number;
  message: string;
}): EngravingActionResult => ({
  txId: mask.txId,
  engraving: mask.name,
  durationMagnitude,
  action: name,
  metadata: {},
  messages: [message],
});

export const createFinishError = ({
  mask,
  message,
  durationMagnitude,
}: {
  mask: EngravingMask;
  durationMagnitude: number;
  message: string;
}): EngravingOnFinishResult => ({
  txId: mask.txId,
  engraving: mask.name,
  durationMagnitude,
  metadata: {},
  messages: [message],
});
