import {
  EngravingActionFunction,
  EngravingOnFinishFunction,
  EngravingChisel,
  EngravingLoggerFunction,
  EngravingValidationFunction,
} from './api-model.js';
import { EngravingModel, safeParseBuild } from './engraving-model.js';

interface ReferenceCheck {
  unused: string[];
  used: string[];
  missing: string[];
  supported: string[];
}
const createKeyRefsForValidation = ({
  opts,
  headers,
  parameters,
  payload,
  context,
}: {
  opts: string;
  headers: string;
  parameters: string;
  payload: string;
  context: string;
}): string[] => [opts, headers, parameters, payload, context];
const byUniqueName = (value: string, index: number, self: string[]): boolean =>
  self.findIndex((v) => v === value) === index;

const extractCommons = ({
  logger,
  alerter,
  generator,
}: {
  logger?: string;
  alerter?: string;
  generator?: string;
}): string[] => {
  const hasLogger = logger === undefined ? [] : [logger];
  const hasAlerter = alerter === undefined ? [] : [alerter];
  const hasGenerator = generator === undefined ? [] : [generator];
  return [...hasLogger, ...hasAlerter, ...hasGenerator];
};

/**
 * Builder for Engraving Chisel
 */
export class EngravingChiselBuilder {
  private model?: EngravingModel;
  private actionFunctions: { [name: string]: EngravingActionFunction } =
    {};
  private onFinishFunctions: {
    [name: string]: EngravingOnFinishFunction;
  } = {};
  private validationFunctions: {
    [name: string]: EngravingValidationFunction;
  } = {};
  private shieldFunctions: {
    [name: string]: EngravingValidationFunction;
  } = {};
  private loggerFunctions: { [name: string]: EngravingLoggerFunction } = {};

  public setModel(model: EngravingModel): this {
    this.model = model;
    return this;
  }

  public parseModel(model: object): this {
    const modelResult = safeParseBuild(model);
    if (modelResult.status === 'success') {
      return this.setModel(modelResult.value);
    } else {
      throw new Error(
        'Chisel Factory Model is invalid: ' +
          JSON.stringify(modelResult.error, null, 2)
      );
    }
  }

  public addActionFunction(
    name: string,
    actionFunction: EngravingActionFunction
  ): this {
    this.actionFunctions[name] = actionFunction;
    return this;
  }

  public addOnFinishFunction(
    name: string,
    onFinishFunction: EngravingOnFinishFunction
  ): this {
    this.onFinishFunctions[name] = onFinishFunction;
    return this;
  }

  public addValidationFunction(
    name: string,
    validationFunction: EngravingValidationFunction
  ): this {
    this.validationFunctions[name] = validationFunction;
    return this;
  }

  public addShieldFunction(
    name: string,
    shieldFunction: EngravingValidationFunction
  ): this {
    this.shieldFunctions[name] = shieldFunction;
    return this;
  }

  public addLoggerFunction(
    name: string,
    loggerFunction: EngravingLoggerFunction
  ): this {
    this.loggerFunctions[name] = loggerFunction;
    return this;
  }

  public build(): EngravingChisel {
    if (this.model === undefined) throw new Error('Model is required');
    return {
      model: this.model,
      actionFunctions: this.actionFunctions,
      onFinishFunctions: this.onFinishFunctions,
      validationFunctions: this.validationFunctions,
      shieldFunctions: this.shieldFunctions,
      loggerFunctions: this.loggerFunctions,
    };
  }

  public checkReferences(): ReferenceCheck {
    if (this.model === undefined) throw new Error('Model is required');
    const supported: string[] = [
      ...Object.keys(this.actionFunctions),
      ...Object.keys(this.validationFunctions),
      ...Object.keys(this.shieldFunctions),
      ...Object.keys(this.loggerFunctions),
      ...Object.keys(this.onFinishFunctions),
    ].filter(byUniqueName);

    let unsortedUsed: string[] = [];
    for (const engraving of Object.values(this.model.engravings)) {
      unsortedUsed.push(...extractCommons(engraving));
      unsortedUsed.push(
        ...createKeyRefsForValidation(engraving.phases.validation.check)
      );
      unsortedUsed.push(
        ...createKeyRefsForValidation(engraving.phases.shield.check)
      );

      unsortedUsed.push(
        ...Object.values(engraving.phases.actions).map((action) => action.uses)
      );

      unsortedUsed.push(engraving.phases.onFinish.uses);
    }
    const used = unsortedUsed.filter(byUniqueName).sort();
    const missing = used.filter((u) => !supported.includes(u));
    const unused = supported.filter((s) => !used.includes(s));
    return {
      supported,
      used,
      missing,
      unused,
    };
  }
}
