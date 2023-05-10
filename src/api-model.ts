import {type EngravingModel} from './engraving-model.js';
import {type Result} from './railway.js';

export type EngravingValidationTarget =
  | 'opts'
  | 'headers'
  | 'parameters'
  | 'payload'
  | 'context';

/** The incoming input to write */
export type EngravingMask = {
  /** The name of the engraving (the key in the record) */
  name: string;

  /** A log transactionId that we could pass along (ex: AWS X-RAY) */
  txId: string;

  /** A list of options that we wish to pass to the engraving function */
  opts: Record<string, unknown>;

  /** A list of (usually http) headers that may be relevant */
  headers: Record<string, unknown>;

  /** A list of (usually http query) parameters that we would expect */
  parameters: Record<string, unknown>;

  /** The JSON payload */
  payload: Record<string, unknown>;

  /** An additional context that is usually calculated on the server  */
  context: Record<string, unknown>;
};

/**
 * Options for the validation function
 */
export type EngravingValidationOpts = {
  /** The specific field in EngravingMask we are targetting */
  target: EngravingValidationTarget;

  /** The JSON object */
  object: Record<string, unknown>;

  /**  The input (or mask) for the engraving process. In other words the incoming payload */
  engravingInput: EngravingMask;
};

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
      level: 'validation/success' | 'shield/success';
      engravingInput: EngravingMask;
    }
  | {
      level: 'action/success' | 'action/error';
      engravingInput: EngravingMask;
      actionResult: EngravingActionResult;
    }
  | {
      level: 'action/rejected';
      engravingInput: EngravingMask;
    }
  | {
      level: 'onFinish/success' | 'onFinish/error';
      engravingInput: EngravingMask;
    };

/**
 * Options for the run engraving function
 */
export type RunEngravingOpts = {
  /**  The mask (or input) for the engraving process. In other words the incoming payload */
  mask: EngravingMask;

  /** The tools (chisel) that are used alongside the model */
  chisel: EngravingChisel;
};

export type EngravingMessage = {
  category:
    | 'framework'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'pink';
  message: string;
};

/** Common fields for most results */
type BaseResult = {
  /** A log transactionId that we could pass along (ex: AWS X-RAY) */
  txId: string;

  /** The name of the engraving (the key in the record) */
  engraving: string;

  /** Some custom metadata that we may be relevant */
  metadata: Record<string, string>;

  /** The order of magnitude for the time duration of the function */
  durationMagnitude: number;

  /** A list of log messages */
  messages: EngravingMessage[];
};

/** An error result resulting from a failed validation */
export type EngravingValidationError = {
  /** The specific field in EngravingMask we are targetting */
  target: EngravingValidationTarget;

  /** This flag should be set to true if we want to interrupt the engraving if the validation fails */
  exitOnFailure: boolean;
} & BaseResult;

/** An success result resulting from a successful validation */
export type EngravingValidationSuccess = {
  /** The specific field in EngravingMask we are targetting */
  target: EngravingValidationTarget;

  /** The sanitized input */
  validated: Record<string, unknown>;
} & BaseResult;

/** The result from  action function */
export type EngravingActionResult = {
  /** The name of the action */
  action: string;
} & BaseResult;

/** The options for the onFinish function */
export type EngravingOnFinishOpts = {
  /**  The input (or mask) for the engraving process. In other words the incoming payload */
  engravingInput: EngravingMask;

  /** The results of all the actions */
  actionResults: Array<Result<EngravingActionResult, EngravingActionResult>>;
};

/** The result for the onFinish function */
export type EngravingOnFinishResult = Record<string, unknown> & BaseResult;

/** The result for the run engraving function */
export type RunEngravingResult = {
  /** A log transactionId that we could pass along (ex: AWS X-RAY) */
  txId: string;

  /** The name of the engraving (the key in the record) */
  engraving: string;

  /** A list of log messages */
  messages: EngravingMessage[];
};

/** Type for a validation function */
export type EngravingValidationFunction = (
  value: EngravingValidationOpts
) => Promise<Result<EngravingValidationSuccess, EngravingValidationError>>;

/** Type for an action */
export type EngravingActionFunction = (
  value: EngravingMask
) => Promise<Result<EngravingActionResult, EngravingActionResult>>;

/** Type for an onFinish Function */
export type EngravingOnFinishFunction = (
  value: EngravingOnFinishOpts
) => Promise<Result<EngravingOnFinishResult, EngravingOnFinishResult>>;

/** Type for a logger Function */
export type EngravingLoggerFunction = (options: EngravingLoggerOpts) => void;

/** The companion tools (chisel) that are used alongside the model */
export type EngravingChisel = {
  /** The engraing model */
  model: EngravingModel;

  /** A mapping of actions */
  actionFunctions: Record<string, EngravingActionFunction>;

  /** A mapping of onFinish functions */
  onFinishFunctions: Record<string, EngravingOnFinishFunction>;

  /** A mapping of validation functions */
  validationFunctions: Record<string, EngravingValidationFunction>;

  /** A mapping of shield functions */
  shieldFunctions: Record<string, EngravingValidationFunction>;

  /** A mapping of logger functions */
  loggerFunctions: Record<string, EngravingLoggerFunction>;
};
