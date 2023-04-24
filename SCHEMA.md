# Schema for lunar-diamond-engraving

-   baldrick-pest-schema (object): Settings for a lunar-diamond-engraving
    file
-   ◆ title (string): \_
-   ◆ webpage (string): A https link to a webpage
-   ◆ url (string): A https link to the item resource
-   ◆ engravings (object): List of domain for engraving
    -   ◇ title (string): A concise title describing the domain
    -   ◇ url (string): A https link to the item resource
    -   ◇ phases (object): The different phases of engraving the domain
        -   ◆ validation (object): \_
            -   ◆ a (string): Kind of the validation function with either: async: This
                function returns a Promise and can be used with async/await syntax.
                sync: This function executes synchronously and returns its result
                immediately.
            -   ◆ title (string): What is been validated
            -   ◆ check (object): Main validation that must be satisfied
                -   ◆ opts (string): Id for validating the options passed to processing
                -   ◆ headers (string): Id for validating the options passed to processing
                -   ◆ parameters (string): Id for validating the options passed to
                    processing
                -   ◆ payload (string): Id for validating the options passed to processing
                -   ◆ context (string): Id for validating the options passed to processing
            -   ◆ shield (object): Secondary validation that may raise alarms
                -   ◆ opts (string): Id for validating the options passed to processing
                -   ◆ headers (string): Id for validating the options passed to processing
                -   ◆ parameters (string): Id for validating the options passed to
                    processing
                -   ◆ payload (string): Id for validating the options passed to processing
                -   ◆ context (string): Id for validating the options passed to processing
        -   ◆ actions (object): A list of actions to run
            -   ◇ a (string): Kind of the action function with either: async: This
                function returns a Promise and can be used with async/await syntax.
                sync: This function executes synchronously and returns its result
                immediately.
            -   ◇ title (string): \_
            -   ◇ uses (string): A unique key representing a function
        -   ◆ onFinish (object): The final action that will be called when all
            other actions will have finished
            -   ◆ a (string): Kind of the final function with either: async: This
                function returns a Promise and can be used with async/await syntax.
                sync: This function executes synchronously and returns its result
                immediately.
            -   ◆ title (string): \_
            -   ◆ uses (string): A unique key representing a function
