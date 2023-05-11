import {type RunEngravingOpts, type RunEngravingResult} from './api-model.js';
import {getLogger} from './chisel-lookup.js';
import {isFulfilled} from './guards.js';
import {runValidation} from './run-validation.js';
import {runActionWithLogger} from './run-action.js';
import {runOnFinish} from './run-on-finish.js';
import {runShield} from './run-shield.js';
import {type Result} from './railway.js';
import {createEngravingMessage} from './create-message.js';

/** Run the engraving with a mask (input) and a chisel (tooling) */
export const runEngraving = async ({
  mask,
  chisel,
}: RunEngravingOpts): Promise<
  Result<RunEngravingResult, RunEngravingResult>
> => {
  const engraving = chisel.model.engravings[mask.name];
  if (engraving === undefined) {
    throw new Error(`${mask.name} is not available as an engraving (292272)`);
  }

  const defaultEngravingResult: RunEngravingResult = {
    txId: mask.txId,
    engraving: mask.name,
    messages: [],
  };
  const logger = getLogger(chisel, engraving.logger);

  const {validation, shield, actions, onFinish} = engraving.phases;

  const validationResult = await runValidation(validation, mask, chisel);
  if (validationResult.isSuccess) {
    await logger({
      engravingInput: mask,
      level: 'validation/success',
    });
  } else {
    await logger({
      engravingInput: mask,
      level: 'validation/error',
      errors: validationResult.errors,
    });
    if (validationResult.exitOnFailure) {
      return {
        status: 'failure',
        error: {
          ...defaultEngravingResult,
          messages: [createEngravingMessage('framework', 'Validation failed')],
        },
      };
    }
  }

  const shieldResult = await runShield(shield, mask, chisel);
  if (shieldResult.isSuccess) {
    await logger({
      engravingInput: mask,
      level: 'shield/success',
    });
  } else {
    await logger({
      engravingInput: mask,
      level: 'shield/error',
      errors: validationResult.errors,
    });
    if (shieldResult.exitOnFailure) {
      return {
        status: 'failure',
        error: {
          ...defaultEngravingResult,
          messages: [createEngravingMessage('framework', 'Shield failed')],
        },
      };
    }
  }

  /** Should we run all of these in parallel */
  const actionPromises = Object.entries(actions).map(async (actionKeyvalue) =>
    runActionWithLogger({
      name: actionKeyvalue[0],
      action: actionKeyvalue[1],
      mask,
      chisel,
      logger,
    })
  );

  const settledActionResults = await Promise.allSettled(actionPromises);
  const hasSomeRejectedAction = settledActionResults.some(
    (res) => res.status === 'rejected'
  );

  if (hasSomeRejectedAction) {
    await logger({
      engravingInput: mask,
      level: 'action/rejected',
    });
  }

  const actionResults = settledActionResults
    .filter(isFulfilled)
    .map((res) => res.value);

  const onFinishResult = await runOnFinish(
    onFinish,
    actionResults,
    mask,
    chisel
  );
  if (onFinishResult.status === 'success') {
    await logger({
      engravingInput: mask,
      level: 'onFinish/success',
    });
    return {
      status: 'success',
      value: {...defaultEngravingResult},
    };
  }

  await logger({
    engravingInput: mask,
    level: 'onFinish/error',
  });
  return {
    status: 'failure',
    error: {
      ...defaultEngravingResult,
      messages: [
        createEngravingMessage('framework', 'At least one action has failed'),
      ],
    },
  };
};
