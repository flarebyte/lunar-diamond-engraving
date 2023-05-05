import { EngravingModel } from './engraving-model.js';
import { Result } from './railway.js';

type ValidationTarget = 'opts' | 'headers' | 'parameters' | 'payload' | 'context'

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
  target: ValidationTarget;
  object: object;
  engravingInput: EngravingMask;
}

export type EngravingLoggerOpts =
  | {
      level: 'info' | 'warn' | 'error';
      engravingInput: EngravingMask;
      metadata: { [key: string]: string };
    }
  | {
      level: 'validation-error' | 'shield-error';
      engravingInput: EngravingMask;
      errors: EngravingValidationError[];
    }
  | {
      level: 'action-error';
      engravingInput: EngravingMask;
      actionErrors: EngravingActionResult[];
    };

export interface BaseResult {
  txId: string;
  engraving: string;
  metadata: { [key: string]: string };
  durationMagnitude: number;
  messages: string[];
}

export interface EngravingValidationError extends BaseResult {
  target: ValidationTarget;
  exitOnFailure: boolean;
}

export interface EngravingValidationSuccess extends BaseResult {
  target: ValidationTarget;
  validated: object
}

export interface EngravingActionResult extends BaseResult {
  action: string;
}

export interface EngravingOnFinishOpts {
  engravingInput: EngravingMask;
  actionResults: Result<EngravingActionResult, EngravingActionResult>[];
}

export interface EngravingOnFinishResult extends BaseResult {}

export type EngravingValidationFunction = (
  value: EngravingValidationOpts
) => Promise<Result<EngravingValidationSuccess, EngravingValidationError>>;

export type EngravingActionFunction = (
  value: EngravingMask
) => Promise<Result<EngravingActionResult, EngravingActionResult>>;

export type EngravingOnFinishFunction = (
  value: EngravingOnFinishOpts
) => Promise<Result<EngravingOnFinishResult, EngravingOnFinishResult>>;

export type EngravingLoggerFunction = (opts: EngravingLoggerOpts) => void;

export interface EngravingChisel {
  model: EngravingModel;
  actionFunctions: { [name: string]: EngravingActionFunction };
  onFinishFunctions: { [name: string]: EngravingOnFinishFunction };
  validationFunctions: { [name: string]: EngravingValidationFunction };
  shieldFunctions: { [name: string]: EngravingValidationFunction };
  loggerFunctions: { [name: string]: EngravingLoggerFunction };
}
