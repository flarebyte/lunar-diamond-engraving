import {
  type EngravingMask,
  type EngravingChisel,
  type EngravingActionResult,
  type EngravingLoggerFunction,
} from './api-model.js';
import {type ActionModel} from './engraving-model.js';
import {getUses} from './chisel-lookup.js';
import {isActionError} from './guards.js';
import {type Result, willFail} from './railway.js';
import {orderOfMagnitude} from './utility.js';
import {createActionError} from './create-error.js';

/**
 * Run an action converting any exception to a failure result
 */
const runAction = async ({
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
      const {message} = error;
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

export const runActionWithLogger = async ({
  name,
  action,
  mask,
  chisel,
  logger,
}: {
  name: string;
  action: ActionModel;
  mask: EngravingMask;
  chisel: EngravingChisel;
  logger: EngravingLoggerFunction;
}): Promise<Result<EngravingActionResult, EngravingActionResult>> => {
  const actionResult = await runAction({
    name,
    action,
    mask,
    chisel,
  });
  if (actionResult.status === 'success') {
    await logger({
      engravingInput: mask,
      level: 'action/success',
      actionResult: actionResult.value,
    });
  } else {
    await logger({
      engravingInput: mask,
      level: 'action/error',
      actionResult: actionResult.error,
    });
  }

  return actionResult;
};
