export interface PasswordStrength {
  score: number; // 0-4
  label: "Weak" | "Fair" | "Good" | "Strong" | "Very Strong";
  feedback: string[];
}

export const validatePasswordStrength = (
  password: string
): PasswordStrength => {
  let score = 0;
  const feedback: string[] = [];

  if (!password) {
    return {
      score: 0,
      label: "Weak",
      feedback: ["Password is required"],
    };
  }

  // Length check
  if (password.length >= 8) {
    score++;
  } else {
    feedback.push("At least 8 characters required");
  }

  if (password.length >= 12) {
    score++;
  }

  // Complexity checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push("Include both uppercase and lowercase letters");
  }

  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push("Include at least one number");
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score++;
  } else {
    feedback.push("Include at least one special character (!@#$%^&*)");
  }

  // Common patterns to avoid
  const commonPatterns = [
    /^123/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /(.)\1{2,}/, // Repeated characters
  ];

  const hasCommonPattern = commonPatterns.some((pattern) =>
    pattern.test(password)
  );

  if (hasCommonPattern) {
    score = Math.max(0, score - 1);
    feedback.push("Avoid common patterns and repeated characters");
  }

  // Normalize score to 0-4
  score = Math.min(4, Math.max(0, score));

  let label: PasswordStrength["label"];
  if (score === 0) label = "Weak";
  else if (score === 1) label = "Weak";
  else if (score === 2) label = "Fair";
  else if (score === 3) label = "Good";
  else if (score === 4) label = "Strong";
  else label = "Very Strong";

  return { score, label, feedback };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  // Phone number should be between 7-15 digits
  return cleaned.length >= 7 && cleaned.length <= 15;
};

export const validateRequiredField = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword && password.length > 0;
};
