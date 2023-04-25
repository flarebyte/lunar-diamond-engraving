import { EngravingModel } from './engraving-model.js';
import { Result } from './railway.js';

/** The incoming input to write */
export interface EngravingInput {
  name: string;
  txId: string;
  opts: object;
  headers: object;
  parameters: object;
  payload: object;
  context: object;
}

export interface EngravingValidationOpts {
  target: 'opts' | 'headers' | 'parameters' | 'payload' | 'context';
  object: object;
  engravingInput: EngravingInput;
}

export interface LoggerOpts {
  engravingInput: EngravingInput;
  level: 'info' | 'warn' | 'error';
  metadata: { [key: string]: string };
}

export interface AlerterOpts {
  engravingInput: EngravingInput;
  metadata: { [key: string]: string };
}

export interface IdentifierGeneratorOpts {
  metadata: { [key: string]: string };
}

export interface ValidationError {
  id: string;
  txId: string;
  engraving: string;
  target: 'opts' | 'headers' | 'parameters' | 'payload' | 'context';
  metadata: { [key: string]: string };
  messages: string[];
}

export interface ActionError {
  id: string;
  txId: string;
  engraving: string;
  action: string;
  metadata: { [key: string]: string };
  messages: string[];
}

export interface EngravingOnFinishopts {
  input: EngravingInput;
  actionErrors: ActionError[];
}

export interface OnFinishError {
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
  EngravingOnFinishopts,
  OnFinishError
>;

export type EngravingValidationFunction = (
  value: EngravingValidationOpts
) => EngravingValidationFunctionResult;

export type AsyncIdentifierGeneratorFunction = (
  value: IdentifierGeneratorOpts
) => Promise<string>;

export type AsyncEngravingActionFunction = (
  value: EngravingInput
) => Promise<EngravingActionFunctionResult>;

export type AsyncEngravingOnFinishFunction = (
  value: EngravingOnFinishopts
) => Promise<EngravingOnFinishFunctionResult>;

export type EngravingLoggerFunction = (opts: LoggerOpts) => void;
export type EngravingAlerterFunction = (opts: AlerterOpts) => void;

export interface LunarDiamondEngavingOpts {
  model: EngravingModel;
  actionFunctions: { [name: string]: AsyncEngravingActionFunction };
  onFinishFunctions: { [name: string]: AsyncEngravingOnFinishFunction };
  validationFunctions: { [name: string]: EngravingValidationFunction };
  shieldFunctions: { [name: string]: EngravingValidationFunction };
  idGeneratorFunctions: { [name: string]: AsyncIdentifierGeneratorFunction };
  loggerFunctions: { [name: string]: EngravingLoggerFunction };
  alerterFunctions: { [name: string]: EngravingAlerterFunction };
}
