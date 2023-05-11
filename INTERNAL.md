# Internal

> Overview of the code base of lunar-diamond-engraving

This document has been generated automatically by
[baldrick-doc-ts](https://github.com/flarebyte/baldrick-doc-ts)

## Diagram of the dependencies

```mermaid
classDiagram
class `api-model.ts`
class `chisel-factory.ts`{
  - createKeyRefsForValidation()
  - byUniqueName()
  - extractCommons()
}
class `chisel-lookup.ts`{
  +getLogger()
  +getUses()
  +geOnFinishtUses()
}
class `create-error.ts`{
  +createActionError()
  +createFinishError()
  +createValidationError()
}
class `create-message.ts`{
  +createEngravingMessage()
}
class `engraving-model.ts`{
  +safeParseBuild()
  +getSchema()
  +unsafeParse()
}
class `engraving.ts`{
  +runEngraving()
}
class `field-validation.ts`{
  - isSingleLine()
}
class `format-message.ts`{
  +formatMessage()
}
class `guards.ts`{
  +isActionError()
  +isFulfilled()
}
class `railway.ts`{
  +succeed()
  +willFail()
  +withDefault()
  +map1()
  +andThen()
}
class `run-action.ts`{
  - runAction()
  +runActionWithLogger()
}
class `run-on-finish.ts`{
  +runOnFinish()
}
class `run-shield.ts`{
  - saferShield()
  +runShield()
}
class `run-validation.ts`{
  - saferValidate()
  +runValidation()
}
class `utility.ts`{
  +orderOfMagnitude()
}
class `validation-utils.ts`{
  +shouldValidationExitOnFailure()
  +isValidationError()
  +isValidationSuccessful()
}
class `./engraving-model.js`{
  +type SingleEngravingModel()
  +type ActionModel()
  +safeParseBuild()
  +EngravingModel()
  +type EngravingModel()
}
class `./railway.js`{
  +type Result()
  +willFail()
  +succeed()
}
class `./api-model.js`{
  +type EngravingValidationError()
  +type EngravingValidationSuccess()
  +type EngravingValidationFunction()
  +type EngravingValidationOpts()
  +type EngravingChisel()
  +type EngravingMask()
  +type EngravingOnFinishResult()
  +type EngravingActionResult()
  +type EngravingLoggerFunction()
  +type RunEngravingResult()
  +type RunEngravingOpts()
  +type EngravingMessage()
  +type EngravingValidationTarget()
  +type EngravingOnFinishFunction()
  +type EngravingActionFunction()
}
class `./create-message.js`{
  +createEngravingMessage()
}
class `zod`{
  +type z()
  +z()
}
class `./field-validation.js`{
  +stringy()
}
class `./format-message.js`{
  +type ValidationError()
  +formatMessage()
}
class `./chisel-lookup.js`{
  +geOnFinishtUses()
  +getUses()
  +getLogger()
}
class `./guards.js`{
  +isActionError()
  +isFulfilled()
}
class `./run-validation.js`{
  +runValidation()
}
class `./run-action.js`{
  +runActionWithLogger()
}
class `./run-on-finish.js`{
  +runOnFinish()
}
class `./run-shield.js`{
  +runShield()
}
class `./utility.js`{
  +orderOfMagnitude()
}
class `./create-error.js`{
  +createValidationError()
  +createFinishError()
  +createActionError()
}
class `./validation-utils.js`{
  +shouldValidationExitOnFailure()
  +isValidationError()
  +isValidationSuccessful()
}
`api-model.ts`-->`./engraving-model.js`
`api-model.ts`-->`./railway.js`
`chisel-factory.ts`-->`./api-model.js`
`chisel-factory.ts`-->`./engraving-model.js`
`chisel-lookup.ts`-->`./api-model.js`
`create-error.ts`-->`./api-model.js`
`create-error.ts`-->`./create-message.js`
`create-message.ts`-->`./api-model.js`
`engraving-model.ts`-->`zod`
`engraving-model.ts`-->`./field-validation.js`
`engraving-model.ts`-->`./format-message.js`
`engraving-model.ts`-->`./railway.js`
`engraving.ts`-->`./api-model.js`
`engraving.ts`-->`./chisel-lookup.js`
`engraving.ts`-->`./guards.js`
`engraving.ts`-->`./run-validation.js`
`engraving.ts`-->`./run-action.js`
`engraving.ts`-->`./run-on-finish.js`
`engraving.ts`-->`./run-shield.js`
`engraving.ts`-->`./railway.js`
`engraving.ts`-->`./create-message.js`
`field-validation.ts`-->`zod`
`format-message.ts`-->`zod`
`guards.ts`-->`./api-model.js`
`run-action.ts`-->`./api-model.js`
`run-action.ts`-->`./engraving-model.js`
`run-action.ts`-->`./chisel-lookup.js`
`run-action.ts`-->`./guards.js`
`run-action.ts`-->`./railway.js`
`run-action.ts`-->`./utility.js`
`run-action.ts`-->`./create-error.js`
`run-on-finish.ts`-->`./api-model.js`
`run-on-finish.ts`-->`./engraving-model.js`
`run-on-finish.ts`-->`./chisel-lookup.js`
`run-on-finish.ts`-->`./guards.js`
`run-on-finish.ts`-->`./railway.js`
`run-on-finish.ts`-->`./utility.js`
`run-on-finish.ts`-->`./create-error.js`
`run-shield.ts`-->`./api-model.js`
`run-shield.ts`-->`./create-error.js`
`run-shield.ts`-->`./engraving-model.js`
`run-shield.ts`-->`./railway.js`
`run-shield.ts`-->`./utility.js`
`run-shield.ts`-->`./validation-utils.js`
`run-validation.ts`-->`./api-model.js`
`run-validation.ts`-->`./create-error.js`
`run-validation.ts`-->`./engraving-model.js`
`run-validation.ts`-->`./validation-utils.js`
`run-validation.ts`-->`./railway.js`
`run-validation.ts`-->`./utility.js`
`validation-utils.ts`-->`./api-model.js`
`validation-utils.ts`-->`./railway.js`
```
