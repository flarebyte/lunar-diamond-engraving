# Schema for lunar-diamond-engraving

-   baldrick-pest-schema (object): Settings for a lunar-diamond-engraving
    file
-   ◆ title (string): \_
-   ◆ webpage (string): A https link to a webpage
-   ◆ url (string): A https link to the item resource
-   ◆ engravings (object): List of domain for engraving
    -   ◇ title (string): A concise title describing the domain
    -   ◇ url (string): A https link to the item resource
    -   ◇ logger (string): A unique key representing a logger
    -   ◇ alerter (string): A unique key representing an alerter
    -   ◇ generator (string): A unique key representing a generator
    -   ◇ phases (object): The different phases of engraving the domain
        -   ◆ validation (object): \_
            -   ◆ title (string): What is been validated
            -   ◆ check (object): Main validation that must be satisfied
                -   ◆ opts (string): Id for validating the options passed to processing
                -   ◆ headers (string): Id for validating the options passed to processing
                -   ◆ parameters (string): Id for validating the options passed to
                    processing
                -   ◆ payload (string): Id for validating the options passed to processing
                -   ◆ context (string): Id for validating the options passed to processing
            -   ◆ logger (string): A unique key representing a logger
            -   ◆ alerter (string): A unique key representing an alerter
            -   ◆ generator (string): A unique key representing a generator
        -   ◆ shield (object): \_
            -   ◆ title (string): What is been validated
            -   ◆ check (object): Main validation that must be satisfied
                -   ◆ opts (string): Id for validating the options passed to processing
                -   ◆ headers (string): Id for validating the options passed to processing
                -   ◆ parameters (string): Id for validating the options passed to
                    processing
                -   ◆ payload (string): Id for validating the options passed to processing
                -   ◆ context (string): Id for validating the options passed to processing
            -   ◆ logger (string): A unique key representing a logger
            -   ◆ alerter (string): A unique key representing an alerter
            -   ◆ generator (string): A unique key representing a generator
        -   ◆ actions (object): A list of actions to run
            -   ◇ title (string): \_
            -   ◇ logger (string): A unique key representing a logger
            -   ◇ alerter (string): A unique key representing an alerter
            -   ◇ generator (string): A unique key representing a generator
            -   ◇ uses (string): A unique key representing a function
        -   ◆ onFinish (object): The final action that will be called when all
            other actions will have finished
            -   ◆ title (string): \_
            -   ◆ uses (string): A unique key representing a function
