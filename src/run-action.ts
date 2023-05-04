import {
  EngravingMask,
  EngravingChisel, EngravingActionFunctionResult
} from './api-model.js';
import { ActionModel } from './engraving-model.js';
import { getUses } from './chisel-lookup.js';
import { isActionError } from './guards.js';
import { willFail } from './railway.js';
import { orderOfMagnitude } from './utility.js';
import { createActionError } from "./create-error.js";

export const runAction = async (
  name: string,
  action: ActionModel,
  mask: EngravingMask,
  chisel: EngravingChisel
): Promise<EngravingActionFunctionResult> => {
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
      return willFail(
        createActionError(
          name,
          mask,
          orderOfMagnitude(started, finished),
          error.message
        )
      );
    }

    return willFail(
      createActionError(
        name,
        mask,
        orderOfMagnitude(started, finished),
        '(542921) action default error'
      )
    );
  }
};
