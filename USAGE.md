# Usage

The typical use case for engraving is to persist some domain data (JSON) to
one or many dababases or content stores.

## Example

The code snippet below defines a constant variable called `contactModel` of
type `EngravingModel`. The `contactModel` variable has four properties:
`title`, `webpage`, `url` and `engravings`.

The `title` property is a string that gives a name to the model. The
`webpage` property is a string that contains a URL to a GitHub repository.
The `url` property is a string that contains a URL to a JSON file in the
repository.

The `engravings` property is an object that contains one key-value pair:
`'contact-address'` and its corresponding value. It has four properties:
`title`, `logger`, `phases` and `onFinish`.

The `title` property is a string that gives a name to the engraving process.
The `logger` property is a string that specifies a logger function to use.
The `phases` property is an object that contains three key-value pairs:
`validation`, `shield` and `actions`.

The `validation` phase has three properties: `title`, `keywords` and `check`.
The `title` property is a string that gives a name to the phase. The
`keywords` property is a string that specifies a library to use for
validation. The `check` property is an object that contains five key-value
pairs: `opts`, `headers`, `parameters`, `payload` and `context`. Each value
is a string that specifies a validation function to use.

The `shield` phase has the same structure as the validation phase, but with
different values for the validation functions.

The `actions` phase has two properties: `'store-contact'` and
`'historical-store-contact'`. Each value is an object that describes an
action to perform after validation and shielding. It has two properties:
`title` and `uses`. The `title` property is a string that gives a name to the
action. The `uses` property is a string that specifies a function to use for
storing the contact address.

The `onFinish` property is an object that describes what to do after all the
phases are completed. It has two properties: `title` and `uses`. The `title`
property is a string that gives a name to the final step. The `uses` property
is a string that specifies a function to use for notifying that the record
has changed.

```typescript
const contactModel: EngravingModel = {
  title: "Engraving example",
  webpage: "https://github.com/flarebyte/lunar-diamond-engraving",
  url: "https://raw.githubusercontent.com/flarebyte/lunar-diamond-engraving/main/package.json",
  engravings: {
    "contact-address": {
      title: "Write to address for contact",
      logger: "logger:fake/log",
      phases: {
        validation: {
          title: "Validate contact address",
          keywords: "zod",
          check: {
            opts: "validation:contact/opts",
            headers: "validation:contact/headers",
            parameters: "validation:contact/parameters",
            payload: "validation:contact/payload",
            context: "validation:contact/context",
          },
        },
        shield: {
          title: "Validate contact address",
          keywords: "zod",
          check: {
            opts: "shield:contact/opts",
            headers: "shield:contact/headers",
            parameters: "shield:contact/parameters",
            payload: "shield:contact/payload",
            context: "shield:contact/context",
          },
        },
        actions: {
          "store-contact": {
            title: "Store contact to latest storage",
            keywords: "S3",
            uses: "work:s3/contact-address",
          },
          "historical-store-contact": {
            title: "Store contact to historical storage",
            uses: "work:s3/historical-contact-address",
          },
        },
        onFinish: {
          title: "Notify that the record has changed",
          uses: "finish:sns/contact-ready",
        },
      },
    },
  },
};
```

The code snippet shows how to use the `EngravingChiselBuilder` class to
create engraving functions for the `contactModel` variable that was defined
in the previous snippet. The `EngravingChiselBuilder` class has several
methods that allow adding different types of functions to the engraving
process.

The `parseModel` method takes a model object as an argument and parses its
properties and values. The `addLoggerFunction` method takes a string
identifier and a logger function as arguments and adds them to the engraving
process. The `addValidationFunction` method takes a string identifier and a
validation function as arguments and adds them to the validation phase of the
engraving process. The `addShieldFunction` method takes a string identifier
and a shield function as arguments and adds them to the shield phase of the
engraving process. The `addActionFunction` method takes a string identifier
and an action function as arguments and adds them to the actions phase of the
engraving process. The `addOnFinishFunction` method takes a string identifier
and an on-finish function as arguments and adds them to the on-finish step of
the engraving process.

The code snippet uses these methods to add various functions for storing
contact addresses using S3 (a cloud storage service) and notifying that the
record has changed using SNS (a notification service).

```typescript
const builder = new EngravingChiselBuilder();
builder.parseModel(contactModel);

builder.addLoggerFunction("logger:fake/log", contactLogger);

builder.addValidationFunction("validation:contact/opts", validateContact);
builder.addValidationFunction("validation:contact/headers", validateContact);
builder.addValidationFunction("validation:contact/parameters",
validateContact);
builder.addValidationFunction("validation:contact/payload", validateContact);
builder.addValidationFunction("validation:contact/context", validateContact);

builder.addShieldFunction("shield:contact/opts", validateContact);
builder.addShieldFunction("shield:contact/headers", validateContact);
builder.addShieldFunction("shield:contact/parameters", shieldContactFail);
builder.addShieldFunction("shield:contact/payload", validateContact);
builder.addShieldFunction("shield:contact/context", validateContact);

builder.addActionFunction("work:s3/contact-address", contactWork);
builder.addActionFunction("work:s3/historical-contact-address", contactWork);

builder.addOnFinishFunction("finish:sns/contact-ready", contactFinish);
```

The code snippet shows how to use the `runEngraving` function to execute the
engraving process for a given mask and chisel.

The `mask` variable is an object of type `EngravingMask` that defines the
input data for the engraving process. It has six properties: `name`, `txId`,
`opts`, `headers`, `parameters`, `payload` and `context`.

The `name` property is a string that identifies the name of the engraving
process. Each data domain should have a different name (ex: contact, sale,
house, ...). The `txId` property is a string that identifies the transaction
ID of the engraving process. The `opts` property is an object that contains
some options for the engraving process. The `headers` property is an object
that contains usually the HTTP headers for the engraving process. The
`parameters` property is an object that contains usually the query parameters
for the engraving process. The `payload` property is a JSON object that
contains some payload data for the engraving process. The `context` property
is an object that contains some context data for the engraving process (ex:
current tenant).

The `chisel` variable is an object of type `EngravingChisel` that defines the
functions for the engraving process. It was created by using the
`EngravingChiselBuilder` class and its methods in the previous snippet.

The code snippet uses the `await` keyword to wait for the result of the
`runEngraving` function, which is a promise that resolves to an object of
type `EngravingResult`. The result contains some information about the
outcome of the engraving process, such as status, errors, logs and output.

```typescript
/** Some mask coming usually from some incoming request*/
const mask: EngravingMask = {
  name: 'contact-address',
  txId: 'txId123',
  opts: {//TODO },
  headers: {//TODO},
  parameters: {//TODO},
  payload: {//TODO},
  context: {//TODO},
};

const result = await runEngraving({mask, chisel: builder.build()});
```
