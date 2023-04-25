import {
  AsyncEngravingActionFunction,
  AsyncEngravingOnFinishFunction,
  AsyncIdentifierGeneratorFunction,
  EngravingAlerterFunction,
  EngravingChisel,
  EngravingLoggerFunction,
  EngravingValidationFunction,
} from './api-model.js';
import { EngravingModel, safeParseBuild } from './engraving-model.js';

/**
 * Builder for Engraving Chisel
 */
export class EngravingChiselBuilder {
  private model?: EngravingModel;
  private actionFunctions: { [name: string]: AsyncEngravingActionFunction } =
    {};
  private onFinishFunctions: {
    [name: string]: AsyncEngravingOnFinishFunction;
  } = {};
  private validationFunctions: { [name: string]: EngravingValidationFunction } =
    {};
  private shieldFunctions: { [name: string]: EngravingValidationFunction } = {};
  private idGeneratorFunctions: {
    [name: string]: AsyncIdentifierGeneratorFunction;
  } = {};
  private loggerFunctions: { [name: string]: EngravingLoggerFunction } = {};
  private alerterFunctions: { [name: string]: EngravingAlerterFunction } = {};

  public setModel(model: EngravingModel): this {
    this.model = model;
    return this;
  }

  public parseModel(model: object): this {
    const modelResult = safeParseBuild(model);
    if (modelResult.status === 'success') {
      return this.setModel(modelResult.value);
    } else {
      throw new Error(`${modelResult.error}`);
    }
  }

  public addActionFunction(
    name: string,
    actionFunction: AsyncEngravingActionFunction
  ): this {
    this.actionFunctions[name] = actionFunction;
    return this;
  }

  public addOnFinishFunction(
    name: string,
    onFinishFunction: AsyncEngravingOnFinishFunction
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

  public addIdGeneratorFunction(
    name: string,
    idGeneratorFunction: AsyncIdentifierGeneratorFunction
  ): this {
    this.idGeneratorFunctions[name] = idGeneratorFunction;
    return this;
  }

  public addLoggerFunction(
    name: string,
    loggerFunction: EngravingLoggerFunction
  ): this {
    this.loggerFunctions[name] = loggerFunction;
    return this;
  }

  public addAlerterFunction(
    name: string,
    alerterFunction: EngravingAlerterFunction
  ): this {
    this.alerterFunctions[name] = alerterFunction;
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
      idGeneratorFunctions: this.idGeneratorFunctions,
      loggerFunctions: this.loggerFunctions,
      alerterFunctions: this.alerterFunctions,
    };
  }
}
