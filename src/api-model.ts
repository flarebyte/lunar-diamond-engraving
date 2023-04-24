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

interface EngravingValidationOpts {
  target: 'opts' | 'headers' | 'parameters' | 'payload' | 'context';
  object: object;
  engravingInput: EngravingInput;
}

interface IdentifierGeneratorOpts {
  metadata: { [key: string]: string };
}
interface ValidationError {
  id: string;
  engraving: string;
  target: 'opts' | 'headers' | 'parameters' | 'payload' | 'context';
  metadata: { [key: string]: string };
  messages: string[];
}

interface ActionError {
  id: string;
  engraving: string;
  action: string;
  metadata: { [key: string]: string };
  messages: string[];
}
interface EngravingOnFinishInput {
  input: EngravingInput;
  actionErrors: ActionError[];
}

interface OnFinishError {
  id: string;
  engraving: string;
  metadata: { [key: string]: string };
  messages: string[];
}

type EngravingValidationFunctionResult = Result<
  EngravingValidationOpts,
  ValidationError
>;
type EngravingActionFunctionResult = Result<EngravingInput, ActionError>;
type EngravingOnFinishFunctionResult = Result<
  EngravingOnFinishInput,
  OnFinishError
>;

type EngravingValidationFunction = (
  value: EngravingValidationOpts
) => EngravingValidationFunctionResult;

type AsyncIdentifierGeneratorFunction = (
  value: IdentifierGeneratorOpts
) => Promise<string>;

type AsyncEngravingActionFunction = (
  value: EngravingInput
) => Promise<EngravingActionFunctionResult>;

type AsyncEngravingOnFinishFunction = (
  value: EngravingOnFinishInput
) => Promise<EngravingOnFinishFunctionResult>;

export interface LunarDiamondEngavingOpts {
  model: EngravingModel;
  actionFunctions: { [name: string]: AsyncEngravingActionFunction };
  onFinishFunctions: { [name: string]: AsyncEngravingOnFinishFunction };
  validationFunctions: { [name: string]: EngravingValidationFunction };
  shieldFunctions: { [name: string]: EngravingValidationFunction };
  idGeneratorFunctions: { [name: string]: AsyncIdentifierGeneratorFunction };
}
