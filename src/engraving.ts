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

const runValidation = async (
  validation: SingleEngravingModel['phases']['validation'],
  mask: EngravingMask,
  chisel: EngravingChisel
) => {
  const validate = {
    opts: chisel.validationFunctions[validation.check.opts],
    headers: chisel.validationFunctions[validation.check.headers],
    parameters: chisel.validationFunctions[validation.check.parameters],
    payload: chisel.validationFunctions[validation.check.payload],
    context: chisel.validationFunctions[validation.check.context],
  };

  if (validate.opts === undefined) {
    throw Error(
      `${validation.check.opts} used by ${mask.name} is not a validation function (ops)`
    );
  }
  if (validate.headers === undefined) {
    throw Error(
      `${validation.check.headers} used by ${mask.name} is not a validation function (headers)`
    );
  }
  if (validate.parameters === undefined) {
    throw Error(
      `${validation.check.parameters} used by ${mask.name} is not a validation function (parameters)`
    );
  }
  if (validate.payload === undefined) {
    throw Error(
      `${validation.check.payload} used by ${mask.name} is not a validation function (payload)`
    );
  }
  if (validate.context === undefined) {
    throw Error(
      `${validation.check.context} used by ${mask.name} is not a validation function (context)`
    );
  }

  const results = {
    opts: await validate.opts({
      target: 'opts',
      object: mask.opts,
      engravingInput: mask,
    }),
    headers: await validate.opts({
      target: 'headers',
      object: mask.headers,
      engravingInput: mask,
    }),
    parameters: await validate.opts({
      target: 'parameters',
      object: mask.parameters,
      engravingInput: mask,
    }),
    payload: await validate.opts({
      target: 'payload',
      object: mask.payload,
      engravingInput: mask,
    }),
    context: await validate.opts({
      target: 'context',
      object: mask.context,
      engravingInput: mask,
    }),
  };

  const isSuccess =
    results.opts.status === 'success' &&
    results.headers.status === 'success' &&
    results.parameters.status === 'success' &&
    results.payload.status === 'success' &&
    results.context.status === 'success';

  const err = {
    opts: results.opts.status === 'failure' ? [results.opts.error] : [],
    headers:
      results.headers.status === 'failure' ? [results.headers.error] : [],
    parameters:
      results.parameters.status === 'failure' ? [results.parameters.error] : [],
    payload:
      results.payload.status === 'failure' ? [results.payload.error] : [],
    context:
      results.context.status === 'failure' ? [results.context.error] : [],
  };
  const errors = [
    ...err.opts,
    ...err.headers,
    ...err.parameters,
    ...err.payload,
    ...err.context,
  ];
  return { isSuccess, ...results, errors };
};

const runShield = async (
  shield: SingleEngravingModel['phases']['shield'],
  mask: EngravingMask,
  chisel: EngravingChisel
) => {
  const shieldfunc = {
    opts: chisel.shieldFunctions[shield.check.opts],
    headers: chisel.shieldFunctions[shield.check.headers],
    parameters: chisel.shieldFunctions[shield.check.parameters],
    payload: chisel.shieldFunctions[shield.check.payload],
    context: chisel.shieldFunctions[shield.check.context],
  };

  if (shieldfunc.opts === undefined) {
    throw Error(
      `${shield.check.opts} used by ${mask.name} is not a shield function (ops)`
    );
  }
  if (shieldfunc.headers === undefined) {
    throw Error(
      `${shield.check.headers} used by ${mask.name} is not a shield function (headers)`
    );
  }
  if (shieldfunc.parameters === undefined) {
    throw Error(
      `${shield.check.parameters} used by ${mask.name} is not a shield function (parameters)`
    );
  }
  if (shieldfunc.payload === undefined) {
    throw Error(
      `${shield.check.payload} used by ${mask.name} is not a shield function (payload)`
    );
  }
  if (shieldfunc.context === undefined) {
    throw Error(
      `${shield.check.context} used by ${mask.name} is not a shield function (context)`
    );
  }

  const results = {
    opts: await shieldfunc.opts({
      target: 'opts',
      object: mask.opts,
      engravingInput: mask,
    }),
    headers: await shieldfunc.opts({
      target: 'headers',
      object: mask.headers,
      engravingInput: mask,
    }),
    parameters: await shieldfunc.opts({
      target: 'parameters',
      object: mask.parameters,
      engravingInput: mask,
    }),
    payload: await shieldfunc.opts({
      target: 'payload',
      object: mask.payload,
      engravingInput: mask,
    }),
    context: await shieldfunc.opts({
      target: 'context',
      object: mask.context,
      engravingInput: mask,
    }),
  };

  const isSuccess =
    results.opts.status === 'success' &&
    results.headers.status === 'success' &&
    results.parameters.status === 'success' &&
    results.payload.status === 'success' &&
    results.context.status === 'success';
  const err = {
    opts: results.opts.status === 'failure' ? [results.opts.error] : [],
    headers:
      results.headers.status === 'failure' ? [results.headers.error] : [],
    parameters:
      results.parameters.status === 'failure' ? [results.parameters.error] : [],
    payload:
      results.payload.status === 'failure' ? [results.payload.error] : [],
    context:
      results.context.status === 'failure' ? [results.context.error] : [],
  };
  const errors = [
    ...err.opts,
    ...err.headers,
    ...err.parameters,
    ...err.payload,
    ...err.context,
  ];

  return { isSuccess, ...results, errors };
};

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
