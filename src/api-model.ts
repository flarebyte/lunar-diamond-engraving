import { z } from 'zod';
import { EngravingModel } from './engraving-model.js';
import { Result } from './railway.js';

type EngravingFunctionResult = Result<string, string>;

type SyncEngravingFunction = () => EngravingFunctionResult;
type AsyncEngravingFunction = () => Promise<EngravingFunctionResult>;

export interface LunarDiamondEngavingOpts {
  model: EngravingModel;
  functions: { [name: string]: SyncEngravingFunction | AsyncEngravingFunction };
  schemas: { [name: string]: z.AnyZodObject};
}
