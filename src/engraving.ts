import { EngravingMask, EngravingChisel } from './api-model.js';
import { SingleEngravingModel } from './engraving-model.js';

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
    throw Error(`${validation.check.opts} is not a validation function`);
  }
  const optsResult = await validate.opts({
    target: 'opts',
    object: mask.opts,
    engravingInput: mask,
  });
};

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
  await runValidation(validation, mask, chisel);
};
