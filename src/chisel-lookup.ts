import { EngravingChisel } from './api-model.js';

export const getLogger = (
  chisel: EngravingChisel,
  defaultName: string,
  name?: string
) => {
  const func = typeof name === 'string' ? chisel.loggerFunctions[name] : undefined;
  if (func !== undefined) {
    return func;
  }
  const defaultFunc = chisel.loggerFunctions[defaultName];
  if (defaultFunc !== undefined) {
    return defaultFunc;
  }
  throw Error(`Neither ${name} not ${defaultName} were available as logger`);
};
export const getAlerter = (
  chisel: EngravingChisel,
  defaultName: string,
  name?: string
) => {
  const func = typeof name === 'string' ? chisel.alerterFunctions[name] : undefined;
  if (func !== undefined) {
    return func;
  }
  const defaultFunc = chisel.alerterFunctions[defaultName];
  if (defaultFunc !== undefined) {
    return defaultFunc;
  }
  throw Error(`Neither ${name} not ${defaultName} were available as alerter`);
};
export const getUses = (chisel: EngravingChisel, name: string) => {
  const func = typeof name === 'string' ? chisel.actionFunctions[name] : undefined;
  if (func !== undefined) {
    return func;
  }

  throw Error(`Action uses function ${name} was not available`);
};
export const geOnFinishtUses = (chisel: EngravingChisel, name: string) => {
  const func = typeof name === 'string' ? chisel.onFinishFunctions[name] : undefined;
  if (func !== undefined) {
    return func;
  }

  throw Error(`OnFinish uses function ${name} was not available`);
};
