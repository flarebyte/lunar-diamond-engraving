import { AsyncEngravingActionFunction, AsyncEngravingOnFinishFunction, AsyncIdentifierGeneratorFunction, EngravingAlerterFunction, EngravingChisel, EngravingLoggerFunction, EngravingValidationFunction } from "./api-model.js";
import { EngravingModel } from "./engraving-model.js";


export class EngravingChiselBuilder {
    private _model!: EngravingModel;
    private _actionFunctions!: { [name: string]: AsyncEngravingActionFunction };
    private _onFinishFunctions!: { [name: string]: AsyncEngravingOnFinishFunction };
    private _validationFunctions!: { [name: string]: EngravingValidationFunction };
    private _shieldFunctions!: { [name: string]: EngravingValidationFunction };
    private _idGeneratorFunctions!: { [name: string]: AsyncIdentifierGeneratorFunction };
    private _loggerFunctions!: { [name: string]: EngravingLoggerFunction };
    private _alerterFunctions!: { [name: string]: EngravingAlerterFunction };
  
    public setModel(model: EngravingModel): this {
      this._model = model;
      return this;
    }
  
    public setActionFunctions(actionFunctions: {
      [name: string]: AsyncEngravingActionFunction;
    }): this {
      this._actionFunctions = actionFunctions;
      return this;
    }
  
    public setOnFinishFunctions(onFinishFunctions: {
      [name: string]: AsyncEngravingOnFinishFunction;
    }): this {
      this._onFinishFunctions = onFinishFunctions;
      return this;
    }
  
    public setValidationFunctions(validationFunctions: {
      [name: string]: EngravingValidationFunction;
    }): this {
      this._validationFunctions = validationFunctions;
      return this;
    }
  
    public setShieldFunctions(shieldFunctions: {
      [name: string]: EngravingValidationFunction;
    }): this {
      this._shieldFunctions = shieldFunctions;
      return this;
    }
  
    public setIdGeneratorFunctions(idGeneratorFunctions: {
      [name: string]: AsyncIdentifierGeneratorFunction;
    }): this {
      this._idGeneratorFunctions = idGeneratorFunctions;
      return this;
    }
  
    public setLoggerFunctions(loggerFunctions: {
      [name: string]: EngravingLoggerFunction;
    }): this {
      this._loggerFunctions = loggerFunctions;
      return this;
    }
  
    public setAlerterFunctions(alerterFunctions: {
      [name: string]: EngravingAlerterFunction;
    }): this {
      this._alerterFunctions = alerterFunctions;
      return this;
    }
  
    public build(): EngravingChisel {
      if (!this._model) throw new Error("Model is required");
      if (!this._actionFunctions) throw new Error("Action functions are required");
      if (!this._onFinishFunctions) throw new Error("On finish functions are required");
      if (!this._validationFunctions) throw new Error("Validation functions are required");
      if (!this._shieldFunctions) throw new Error("Shield functions are required");
      if (!this._idGeneratorFunctions) throw new Error("ID generator functions are required");
      if (!this._loggerFunctions) throw new Error("Logger functions are required");
      if (!this._alerterFunctions) throw new Error("Alerter functions are required");
  
      return {
        model: this._model,
        actionFunctions: this._actionFunctions,
        onFinishFunctions: this._onFinishFunctions,
        validationFunctions: this._validationFunctions,
        shieldFunctions: this._shieldFunctions,
        idGeneratorFunctions: this._idGeneratorFunctions,
        loggerFunctions: this._loggerFunctions,
        alerterFunctions: this._alerterFunctions,
      };
    }
  }