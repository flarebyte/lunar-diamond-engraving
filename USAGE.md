# Usage

The code snippet below  defines a constant variable called `contactModel` of type `EngravingModel`. The `contactModel` variable has four properties: `title`, `webpage`, `url` and `engravings`.

The `title` property is a string that gives a name to the model. The `webpage` property is a string that contains a URL to a GitHub repository. The `url` property is a string that contains a URL to a JSON file in the repository.

The `engravings` property is an object that contains one key-value pair: `'contact-address'` and its corresponding value. It has four properties: `title`, `logger`, `phases` and `onFinish`.

The `title` property is a string that gives a name to the engraving process. The `logger` property is a string that specifies a logger function to use. The `phases` property is an object that contains three key-value pairs: `validation`, `shield` and `actions`.

The `validation` phase has three properties: `title`, `keywords` and `check`. The `title` property is a string that gives a name to the phase. The `keywords` property is a string that specifies a library to use for validation. The `check` property is an object that contains five key-value pairs: `opts`, `headers`, `parameters`, `payload` and `context`. Each value is a string that specifies a validation function to use.

The `shield` phase has the same structure as the validation phase, but with different values for the validation functions.

The `actions` phase has two properties: `'store-contact'` and `'historical-store-contact'`. Each value is an object that describes an action to perform after validation and shielding. It has two properties: `title` and `uses`. The `title` property is a string that gives a name to the action. The `uses` property is a string that specifies a function to use for storing the contact address.

The `onFinish` property is an object that describes what to do after all the phases are completed. It has two properties: `title` and `uses`. The `title` property is a string that gives a name to the final step. The `uses` property is a string that specifies a function to use for notifying that the record has changed.


```typescript
const contactModel: EngravingModel = {
  title: 'Engraving example',
  webpage: 'https://github.com/flarebyte/lunar-diamond-engraving',
  url: 'https://raw.githubusercontent.com/flarebyte/lunar-diamond-engraving/main/package.json',
  engravings: {
    'contact-address': {
      title: 'Write to address for contact',
      logger: 'logger:fake/log',
      phases: {
        validation: {
          title: 'Validate contact address',
          keywords: 'zod',
          check: {
            opts: 'validation:contact/opts',
            headers: 'validation:contact/headers',
            parameters: 'validation:contact/parameters',
            payload: 'validation:contact/payload',
            context: 'validation:contact/context',
          },
        },
        shield: {
          title: 'Validate contact address',
          keywords: 'zod',
          check: {
            opts: 'shield:contact/opts',
            headers: 'shield:contact/headers',
            parameters: 'shield:contact/parameters',
            payload: 'shield:contact/payload',
            context: 'shield:contact/context',
          },
        },
        actions: {
          'store-contact': {
            title: 'Store contact to latest storage',
            keywords: 'S3',
            uses: 'work:s3/contact-address',
          },
          'historical-store-contact': {
            title: 'Store contact to historical storage',
            uses: 'work:s3/historical-contact-address',
          },
        },
        onFinish: {
          title: 'Notify that the record has changed',
          uses: 'finish:sns/contact-ready',
        },
      },
    },
  },
};
```