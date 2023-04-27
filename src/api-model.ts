import { EngravingModel } from './engraving-model.js';
import { Result } from './railway.js';

/** The incoming input to write */
export interface EngravingMask {
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
  engravingInput: EngravingMask;
}

export interface LoggerOpts {
  engravingInput: EngravingMask;
  level: 'info' | 'warn' | 'error';
  metadata: { [key: string]: string };
}

export interface AlerterOpts {
  engravingInput: EngravingMask;
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
  input: EngravingMask;
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
type EngravingActionFunctionResult = Result<EngravingMask, ActionError>;
type EngravingOnFinishFunctionResult = Result<
  EngravingOnFinishopts,
  OnFinishError
>;

export type AsyncEngravingValidationFunction = (
  value: EngravingValidationOpts
) => Promise<EngravingValidationFunctionResult>;

export type AsyncIdentifierGeneratorFunction = (
  value: IdentifierGeneratorOpts
) => Promise<string>;

export type AsyncEngravingActionFunction = (
  value: EngravingMask
) => Promise<EngravingActionFunctionResult>;

export type AsyncEngravingOnFinishFunction = (
  value: EngravingOnFinishopts
) => Promise<EngravingOnFinishFunctionResult>;

export type EngravingLoggerFunction = (opts: LoggerOpts) => void;
export type AsyncEngravingAlerterFunction = (opts: AlerterOpts) => Promise<void>;

export interface EngravingChisel {
  model: EngravingModel;
  actionFunctions: { [name: string]: AsyncEngravingActionFunction };
  onFinishFunctions: { [name: string]: AsyncEngravingOnFinishFunction };
  validationFunctions: { [name: string]: AsyncEngravingValidationFunction };
  shieldFunctions: { [name: string]: AsyncEngravingValidationFunction };
  idGeneratorFunctions: { [name: string]: AsyncIdentifierGeneratorFunction };
  loggerFunctions: { [name: string]: EngravingLoggerFunction };
  alerterFunctions: { [name: string]: AsyncEngravingAlerterFunction };
}
