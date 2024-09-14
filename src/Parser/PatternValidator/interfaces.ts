/**
 * Type, indicating the output of the `PatternValidator`. 
 * * `true`, whenever the input provided is both correct and covered
 * * `null`, whenever the input given is not incorrect, but is not covered by the grammar given either
 * * `[false, number]`, whenever the input is explicitly incorrect (with a number-defined position of table entry that caused this)
*/
export type PatternValidatorOutput = true | null | [false, number]
