import {
  AsyncEngravingActionFunction,
  AsyncEngravingOnFinishFunction,
  AsyncIdentifierGeneratorFunction,
  AsyncEngravingAlerterFunction,
  EngravingChisel,
  EngravingLoggerFunction,
  AsyncEngravingValidationFunction,
} from './api-model.js';
import { EngravingModel, safeParseBuild } from './engraving-model.js';

type RefCategory =
  | 'action'
  | 'onFinish'
  | 'validation'
  | 'shield'
  | 'id-generator'
  | 'logger'
  | 'alerter';

interface KeyReference {
  name: string;
  category: RefCategory;
}

interface ReferenceCheck {
  unused: KeyReference[];
  used: KeyReference[];
  missing: KeyReference[];
  supported: KeyReference[];
}

const createKeyReferenceList = (
  mapping: { [name: string]: any },
  category: RefCategory
): KeyReference[] => Object.keys(mapping).map((name) => ({ name, category }));

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
}): KeyReference[] => [
  { name: `${opts}`, category: 'validation' },
  { name: `${headers}`, category: 'validation' },
  { name: `${parameters}`, category: 'validation' },
  { name: `${payload}`, category: 'validation' },
  { name: `${context}`, category: 'validation' },
];

const byUniqueNameAndCategory = (
  value: KeyReference,
  index: number,
  self: KeyReference[]
): boolean =>
  self.findIndex(
    (v) => v.name === value.name && v.category === value.category
  ) === index;

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
  private validationFunctions: { [name: string]: AsyncEngravingValidationFunction } =
    {};
  private shieldFunctions: { [name: string]: AsyncEngravingValidationFunction } = {};
  private idGeneratorFunctions: {
    [name: string]: AsyncIdentifierGeneratorFunction;
  } = {};
  private loggerFunctions: { [name: string]: EngravingLoggerFunction } = {};
  private alerterFunctions: { [name: string]: AsyncEngravingAlerterFunction } = {};

  public setModel(model: EngravingModel): this {
    this.model = model;
    return this;
  }

  public parseModel(model: object): this {
    const modelResult = safeParseBuild(model);
    if (modelResult.status === 'success') {
      return this.setModel(modelResult.value);
    } else {
      throw new Error('Chisel Factory Model is invalid: '+JSON.stringify(modelResult.error, null, 2));
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
    validationFunction: AsyncEngravingValidationFunction
  ): this {
    this.validationFunctions[name] = validationFunction;
    return this;
  }

  public addShieldFunction(
    name: string,
    shieldFunction: AsyncEngravingValidationFunction
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
    alerterFunction: AsyncEngravingAlerterFunction
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

  public checkReferences(): ReferenceCheck {
    if (this.model === undefined) throw new Error('Model is required');
    const supported: KeyReference[] = [
      ...createKeyReferenceList(this.actionFunctions, 'action'),
      ...createKeyReferenceList(this.onFinishFunctions, 'onFinish'),
      ...createKeyReferenceList(this.validationFunctions, 'validation'),
      ...createKeyReferenceList(this.shieldFunctions, 'shield'),
      ...createKeyReferenceList(this.idGeneratorFunctions, 'id-generator'),
      ...createKeyReferenceList(this.loggerFunctions, 'logger'),
      ...createKeyReferenceList(this.alerterFunctions, 'alerter'),
    ].filter(byUniqueNameAndCategory);

    let unsortedUsed: KeyReference[] = [];
    for (const engraving of Object.values(this.model.engravings)) {
      unsortedUsed.push(
        ...createKeyRefsForValidation(engraving.phases.validation.check)
      );
      unsortedUsed.push(
        ...createKeyRefsForValidation(engraving.phases.validation.check)
      );

      unsortedUsed.push(
        ...Object.values(engraving.phases.actions).map(
          (action) =>
            ({
              name: action.uses,
              category: 'action',
            } as KeyReference)
        )
      );
    }
    const used = unsortedUsed.filter(byUniqueNameAndCategory);
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
