// % 1. 'null' indicates non-coverage [that is, the given grammar is not SUFFICIENT],
// % 2. 'true' indicates correctness [in the user-defined sense] and coverage
// % 3. 'false' indicates incorrectness (in the user-defined sense; comes additionally with a number-position);
export type PatternValidatorOutput = true | null | [false, number]
