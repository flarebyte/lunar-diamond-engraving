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

export type EngravingLoggerOpts =
  | {
      level: 'info' | 'warn' | 'error';
      engravingInput: EngravingMask;
      metadata: { [key: string]: string };
    }
  | {
      level: 'validation-error' | 'shield-error';
      engravingInput: EngravingMask;
      errors: ValidationError[];
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

export interface ValidationError extends BaseResult {
  target: 'opts' | 'headers' | 'parameters' | 'payload' | 'context';
  exitOnFailure: boolean;
}

export interface EngravingActionResult extends BaseResult {
  action: string;
}

export interface EngravingOnFinishOpts {
  engravingInput: EngravingMask;
  actionResults: Result<EngravingActionResult, EngravingActionResult>[];
}

export interface OnFinishResult extends BaseResult {}

export type AsyncEngravingValidationFunction = (
  value: EngravingValidationOpts
) => Promise<Result<EngravingValidationOpts, ValidationError>>;

export type AsyncEngravingActionFunction = (
  value: EngravingMask
) => Promise<Result<EngravingActionResult, EngravingActionResult>>;

export type AsyncEngravingOnFinishFunction = (
  value: EngravingOnFinishOpts
) => Promise<Result<OnFinishResult, OnFinishResult>>;

export type EngravingLoggerFunction = (opts: EngravingLoggerOpts) => void;

export interface EngravingChisel {
  model: EngravingModel;
  actionFunctions: { [name: string]: AsyncEngravingActionFunction };
  onFinishFunctions: { [name: string]: AsyncEngravingOnFinishFunction };
  validationFunctions: { [name: string]: AsyncEngravingValidationFunction };
  shieldFunctions: { [name: string]: AsyncEngravingValidationFunction };
  loggerFunctions: { [name: string]: EngravingLoggerFunction };
}
