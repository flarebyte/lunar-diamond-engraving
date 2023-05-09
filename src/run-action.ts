import {
  EngravingMask,
  EngravingChisel,
  EngravingActionResult,
} from './api-model.js';
import { ActionModel } from './engraving-model.js';
import { getUses } from './chisel-lookup.js';
import { isActionError } from './guards.js';
import { Result, willFail } from './railway.js';
import { orderOfMagnitude } from './utility.js';
import { createActionError } from './create-error.js';

/**
 * Run an action converting any exception to a failure result
 */
export const runAction = async ({
  name,
  action,
  mask,
  chisel,
}: {
  name: string;
  action: ActionModel;
  mask: EngravingMask;
  chisel: EngravingChisel;
}): Promise<Result<EngravingActionResult, EngravingActionResult>> => {
  const started = Date.now();
  try {
    const uses = getUses(chisel, action.uses);

    return await uses(mask);
  } catch (error) {
    const finished = Date.now();
    if (isActionError(error)) {
      return willFail(error);
    }
    if (error instanceof Error) {
      const { message } = error;
      return willFail(
        createActionError({
          name,
          mask,
          durationMagnitude: orderOfMagnitude(started, finished),
          message,
        })
      );
    }

    return willFail(
      createActionError({
        name,
        mask,
        durationMagnitude: orderOfMagnitude(started, finished),
        message: '(542921) action default error',
      })
    );
  }
};
