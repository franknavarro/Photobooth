type ValidationRule = (value: string) => boolean;

export interface Validation {
  rule: ValidationRule;
  error: string;
}

export const negativeError: Validation = {
  rule: (value) => Number(value) < 0,
  error: 'Cannot be a negative number.',
};

export const blankError: Validation = {
  rule: (value) => value === '',
  error: 'Cannot be blank.',
};

export const floatError: Validation = {
  rule: (value) => /\./.test(value),
  error: 'Must be a whole number.',
};

export const getGreaterError = (moreThan: number): Validation => {
  return {
    rule: (value: string) => Number(value) < moreThan,
    error: `Must be a number greater than or equal to ${moreThan}.`,
  };
};

export const getBetweenError = (
  moreThan: number,
  lessThan: number,
): Validation => {
  return {
    rule: (value: string) =>
      Number(value) > lessThan || Number(value) < moreThan,
    error: `Must be a number between ${moreThan} and ${lessThan}.`,
  };
};
