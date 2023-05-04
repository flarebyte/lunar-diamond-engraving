import { EngravingChisel } from './api-model.js';

export const getLogger = (
  chisel: EngravingChisel,
  name: string,
) => {
  const defaultFunc = chisel.loggerFunctions[name];
  if (defaultFunc !== undefined) {
    return defaultFunc;
  }
  throw Error(`${name} is not available as a logger (825309)`);
};

export const getUses = (chisel: EngravingChisel, name: string) => {
  const func = typeof name === 'string' ? chisel.actionFunctions[name] : undefined;
  if (func !== undefined) {
    return func;
  }

  throw Error(`${name} is not available as an action uses (589684)`);
};
export const geOnFinishtUses = (chisel: EngravingChisel, name: string) => {
  const func = typeof name === 'string' ? chisel.onFinishFunctions[name] : undefined;
  if (func !== undefined) {
    return func;
  }

  throw Error(`${name} is not available as a OnFinish uses (848649)`);
};
