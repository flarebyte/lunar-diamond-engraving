import {
  EngravingMask,
  EngravingChisel,
  EngravingActionResult,
  EngravingOnFinishResult
} from './api-model.js';
import { SingleEngravingModel } from './engraving-model.js';
import { geOnFinishtUses } from './chisel-lookup.js';
import { isActionError } from './guards.js';
import { Result, willFail } from './railway.js';
import { orderOfMagnitude } from './utility.js';
import { createFinishError } from "./create-error.js";

export const runOnFinish = async (
  onFinish: SingleEngravingModel['phases']['onFinish'],
  actionResults: Result<EngravingActionResult, EngravingActionResult>[],
  mask: EngravingMask,
  chisel: EngravingChisel
): Promise<Result<EngravingOnFinishResult, EngravingOnFinishResult>> => {
  const started = Date.now();
  try {
    const uses = geOnFinishtUses(chisel, onFinish.uses);
    return await uses({ engravingInput: mask, actionResults });
  } catch (error) {
    const finished = Number(Date.now());
    if (isActionError(error)) {
      return willFail(error);
    }
    if (error instanceof Error) {
      return willFail(
        createFinishError(
          mask,
          orderOfMagnitude(started, finished),
          error.message
        )
      );
    }

    return willFail(
      createFinishError(
        mask,
        orderOfMagnitude(started, finished),
        '(936033) onFinish default error'
      )
    );
  }
};
