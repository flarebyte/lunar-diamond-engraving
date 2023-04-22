import { z } from 'zod';
import { EngravingModel } from './engraving-model.js';
import { Result } from './railway.js';

interface EngravingInput {
  name: string;
  opts: object;
  headers: object;
  parameters: object;
  payload: object;
  context: object;
}

type schemaId = 'opts' | 'headers' | 'parameters' | 'payload' | 'context';

type EngravingError =
  | {
      id: string;
      engraving: string;
      phase: 'validation';
      schemas: schemaId[];
      metadata: { [key: string]: string };
      messages: string[];
    }
  | {
      id: string;
      engraving: string;
      phase: 'actions';
      action: string;
      metadata: { [key: string]: string };
      messages: string[];
    }
  | {
      id: string;
      engraving: string;
      phase: 'onFinish';
      metadata: { [key: string]: string };
      messages: string[];
    }
  | {
      phase: '_internal';
      metadata: { [key: string]: string };
      messages: string[];
    };

type EngravingFunctionResult = Result<EngravingInput, EngravingError>;

type SyncEngravingFunction = () => EngravingFunctionResult;
type AsyncEngravingFunction = () => Promise<EngravingFunctionResult>;

export interface LunarDiamondEngavingOpts {
  model: EngravingModel;
  functions: { [name: string]: SyncEngravingFunction | AsyncEngravingFunction };
  schemas: { [name: string]: z.AnyZodObject };
}
