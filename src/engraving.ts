import {
  EngravingMask,
  EngravingChisel,
} from './api-model.js';
import { getLogger, getAlerter } from './chisel-lookup.js';
import { isFulfilled } from './guards.js';
import { runValidation, runShield } from './run-validation.js';
import { runAction } from './run-action.js';
import { runOnFinish } from './run-on-finish.js';

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
