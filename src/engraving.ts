import { EngravingMask, EngravingChisel } from './api-model.js';
import { getLogger } from './chisel-lookup.js';
import { isFulfilled } from './guards.js';
import { runValidation } from './run-validation.js';
import { runAction } from './run-action.js';
import { runOnFinish } from './run-on-finish.js';
import { runShield } from './run-shield.js';

/** Run the engraving with a mask (input) and a chisel (tooling) */
export const runEngraving = async ({
  mask,
  chisel,
}: {
  mask: EngravingMask;
  chisel: EngravingChisel;
}) => {
  const engraving = chisel.model.engravings[mask.name];
  if (engraving === undefined) {
    throw new Error(`${mask.name} is not available as an engraving (292272)`);
  }
  const logger = getLogger(chisel, engraving.logger);

  const { validation, shield, actions, onFinish } = engraving.phases;

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
      return;
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
      return;
    }
  }

  /** Should we run all of these in parallel */
  const actionPromises = Object.entries(actions).map((actionKeyvalue) =>
    runAction({
      name: actionKeyvalue[0],
      action: actionKeyvalue[1],
      mask,
      chisel,
    })
  );

  const settledActionResults = await Promise.allSettled(actionPromises);
  // const hasRejected = settledActionResults.some(
  //   (res) => res.status === 'rejected'
  // );
  const actionResults = settledActionResults
    .filter(isFulfilled)
    .map((res) => res.value);

  for (const actionResult of actionResults) {
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
  }

  await runOnFinish(onFinish, actionResults, mask, chisel);
};
