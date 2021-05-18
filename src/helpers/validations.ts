type ValidationRule = (value: string) => Promise<boolean> | boolean;

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

export const domainError: Validation = {
  rule: (value) => !/^([a-z0-9]+(-[a-z0-9]+)*)+\.[a-z]{2,}$/.test(value),
  error: "Must be a valid domain. (ie: 'example.com')",
};

export const floatError: Validation = {
  rule: (value) => /\./.test(value),
  error: 'Must be a whole number.',
};

export const usernameError: Validation = {
  rule: (value) => /[^A-Za-z_0-9]/.test(value),
  error: 'Can only contain letters, numbers and "_".',
};

export const passwordCharacterMin: Validation = {
  rule: (value) => value.length < 6,
  error: 'Passwords must have at least 6 characters.',
};

export const passwordsMatchError = 'Passwords do not match.';
export const passwordsMatch = (matcher: string): Validation => ({
  rule: (value: string) => value !== matcher,
  error: passwordsMatchError,
});

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
