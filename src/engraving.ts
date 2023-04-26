import { EngravingMask, EngravingChisel } from './api-model.js';

export const runEngraving = async ({
  mask,
  chisel,
}: {
  mask: EngravingMask;
  chisel: EngravingChisel;
}) => {
  const engraving = chisel.model.engravings[mask.name]
  

};
