import {
  EngravingMask,
  EngravingChisel,
  ActionError,
  EngravingActionFunctionResult,
  OnFinishError,
  EngravingOnFinishFunctionResult,
} from './api-model.js';
import { ActionModel, SingleEngravingModel } from './engraving-model.js';
import { willFail } from './railway.js';
import { runValidation, runShield } from './run-validation.js';

const getLogger = (
  chisel: EngravingChisel,
  defaultName: string,
  name?: string
) => {
  const func =
    typeof name === 'string' ? chisel.loggerFunctions[name] : undefined;
  if (func !== undefined) {
    return func;
  }
  const defaultFunc = chisel.loggerFunctions[defaultName];
  if (defaultFunc !== undefined) {
    return defaultFunc;
  }
  throw Error(`Neither ${name} not ${defaultName} were available as logger`);
};

const getAlerter = (
  chisel: EngravingChisel,
  defaultName: string,
  name?: string
) => {
  const func =
    typeof name === 'string' ? chisel.alerterFunctions[name] : undefined;
  if (func !== undefined) {
    return func;
  }
  const defaultFunc = chisel.alerterFunctions[defaultName];
  if (defaultFunc !== undefined) {
    return defaultFunc;
  }
  throw Error(`Neither ${name} not ${defaultName} were available as alerter`);
};

const getUses = (chisel: EngravingChisel, name: string) => {
  const func =
    typeof name === 'string' ? chisel.actionFunctions[name] : undefined;
  if (func !== undefined) {
    return func;
  }

  throw Error(`Action uses function ${name} was not available`);
};

const geOnFinishtUses = (chisel: EngravingChisel, name: string) => {
  const func =
    typeof name === 'string' ? chisel.onFinishFunctions[name] : undefined;
  if (func !== undefined) {
    return func;
  }

  throw Error(`OnFinish uses function ${name} was not available`);
};

const isActionError = (value: unknown): value is ActionError => true;

const createActionError = (
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

const createFinishError = (
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

const orderOfMagnitude = (started: number, finished: number): number => {
  const diff = finished - started;
  if (diff <= 0) return 0;
  return `${diff}`.length;
};

const runAction = async (
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

const runOnFinish = async (
  onFinish: SingleEngravingModel['phases']['onFinish'],
  actionResults: EngravingActionFunctionResult[],
  mask: EngravingMask,
  chisel: EngravingChisel
): Promise<EngravingOnFinishFunctionResult> => {
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

const isFulfilled = <T>(
  input: PromiseSettledResult<T>
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';

export const runEngraving = async ({
  mask,
  chisel,
}: {
  mask: EngravingMask;
  chisel: EngravingChisel;
}) => {
  const engraving = chisel.model.engravings[mask.name];
  if (engraving === undefined) {
    throw new Error(`Could not find engraving for ${mask.name}`);
  }
  const { validation, shield, actions, onFinish } = engraving.phases;

  const validationResult = await runValidation(validation, mask, chisel);
  if (!validationResult.isSuccess) {
    const validationLogger = getLogger(
      chisel,
      engraving.logger,
      engraving.phases.validation.logger
    );
    validationLogger({
      engravingInput: mask,
      level: 'validation-error',
      errors: validationResult.errors,
    });
    const validationAlerter = getAlerter(
      chisel,
      engraving.alerter,
      engraving.phases.validation.alerter
    );
    validationAlerter({
      engravingInput: mask,
      level: 'validation-error',
      errors: validationResult.errors,
    });
    return;
  }

  const shieldResult = await runShield(shield, mask, chisel);
  if (!shieldResult.isSuccess) {
    const shieldLogger = getLogger(
      chisel,
      engraving.logger,
      engraving.phases.shield.logger
    );
    shieldLogger({
      engravingInput: mask,
      level: 'shield-error',
      errors: validationResult.errors,
    });
    const shieldAlerter = getAlerter(
      chisel,
      engraving.alerter,
      engraving.phases.shield.alerter
    );
    shieldAlerter({
      engravingInput: mask,
      level: 'shield-error',
      errors: validationResult.errors,
    });
  }

  const actionPromises = Object.entries(actions).map((actionKeyvalue) =>
    runAction(actionKeyvalue[0], actionKeyvalue[1], mask, chisel)
  );

  const settledActionResults = await Promise.allSettled(actionPromises);
  const hasRejected = settledActionResults.some(
    (res) => res.status === 'rejected'
  );
  const actionResults = settledActionResults
    .filter(isFulfilled)
    .map((res) => res.value);

  await runOnFinish(onFinish, actionResults, mask, chisel);
};
