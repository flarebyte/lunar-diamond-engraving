import { EngravingModel } from './engraving-model.js';
import { Result } from './railway.js';

type ValidationTarget =
  | 'opts'
  | 'headers'
  | 'parameters'
  | 'payload'
  | 'context';

/** The incoming input to write */
export interface EngravingMask {
  /** the name of the engraving (the key in the record) */
  name: string;

  /** A log transactionId that we could pass along (ex: AWS X-RAY) */
  txId: string;

  /** A list of options that we wish to pass to the engraving function */
  opts: object;

  /** A list of (usually http) headers that may be relevant*/
  headers: object;

  /** A list of (usually http query) parameters that we would expect*/
  parameters: object;

  /** The JSON payload*/
  payload: object;

  /** An additional context that is usually calculated on the server  */
  context: object;
}

/**
 * Options for the validation function
 */
export interface EngravingValidationOpts {
  /** The specific field in EngravingMask we are targetting*/
  target: ValidationTarget;

  /** The JSON object */
  object: object;

  /**  The input (or mask) for the engraving process. In other words the incoming payload*/
  engravingInput: EngravingMask;
}

/**
 * Options for the logger function.
 * This is tighly coupled to the different phases of the engraving
 */
export type EngravingLoggerOpts =
  | {
      level: 'validation/error' | 'shield/error';
      engravingInput: EngravingMask;
      errors: EngravingValidationError[];
    }
  | {
      level: 'action/error';
      engravingInput: EngravingMask;
      actionErrors: EngravingActionResult[];
    };

/** Common fields for most results */
interface BaseResult {
  /** A log transactionId that we could pass along (ex: AWS X-RAY) */
  txId: string;

  /** the name of the engraving (the key in the record) */
  engraving: string;

  /** Some custom metadata that we may be relevant */
  metadata: { [key: string]: string };

  /** The order of magnitude for the time duration of the function */
  durationMagnitude: number;

  /** A list of log messages */
  messages: string[];
}

/** An error result resulting from a failed validation */
export interface EngravingValidationError extends BaseResult {
  /** The specific field in EngravingMask we are targetting*/
  target: ValidationTarget;

  /** This flag should be set to true if we want to interrupt the engraving if the validation fails */
  exitOnFailure: boolean;
}

/** An success result resulting from a successful validation */
export interface EngravingValidationSuccess extends BaseResult {
  /** The specific field in EngravingMask we are targetting*/
  target: ValidationTarget;

  /** The sanitized input */
  validated: object;
}

/** The result from  action function*/
export interface EngravingActionResult extends BaseResult {
  /** The name of the action */
  action: string;
}

/** The options for the onFinish function */
export interface EngravingOnFinishOpts {
  /**  The input (or mask) for the engraving process. In other words the incoming payload*/
  engravingInput: EngravingMask;

  /** The results of all the actions */
  actionResults: Result<EngravingActionResult, EngravingActionResult>[];
}

/** The result for the onFinish function*/
export interface EngravingOnFinishResult extends BaseResult {}

/** Type for a validation function */
export type EngravingValidationFunction = (
  value: EngravingValidationOpts
) => Promise<Result<EngravingValidationSuccess, EngravingValidationError>>;

/** Type for an action*/
export type EngravingActionFunction = (
  value: EngravingMask
) => Promise<Result<EngravingActionResult, EngravingActionResult>>;

/** Type for an onFinish Function */
export type EngravingOnFinishFunction = (
  value: EngravingOnFinishOpts
) => Promise<Result<EngravingOnFinishResult, EngravingOnFinishResult>>;

/** Type for a logger Function */
export type EngravingLoggerFunction = (opts: EngravingLoggerOpts) => void;

/** The companion tools (chisel) that are used alongside the model */
export interface EngravingChisel {
  /** The engraing model */
  model: EngravingModel;

  /** A mapping of actions */
  actionFunctions: { [name: string]: EngravingActionFunction };

  /** A mapping of onFinish functions */
  onFinishFunctions: { [name: string]: EngravingOnFinishFunction };

  /** A mapping of validation functions */
  validationFunctions: { [name: string]: EngravingValidationFunction };

  /** A mapping of shield functions */
  shieldFunctions: { [name: string]: EngravingValidationFunction };

  /** A mapping of logger functions */
  loggerFunctions: { [name: string]: EngravingLoggerFunction };
}
