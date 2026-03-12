export const PASSWORD_RULE_MESSAGE =
    'Password must be at least 8 characters and include a letter, a number, and a symbol (!@#$%^&*)';

export const PASSWORD_REGEX =
    /^(?=.*[!@#$%^&*])(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
