import {
  validateEmail,
  validatePasswordMatch,
  validatePasswordStrength,
  validatePhoneNumber,
  validateRequiredField,
} from "../../utils/validation";

describe("validateEmail", () => {
  it("should return true for valid email addresses", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("user.name@domain.co.uk")).toBe(true);
    expect(validateEmail("user+tag@example.com")).toBe(true);
  });

  it("should return false for invalid email addresses", () => {
    expect(validateEmail("")).toBe(false);
    expect(validateEmail("invalid")).toBe(false);
    expect(validateEmail("@example.com")).toBe(false);
    expect(validateEmail("user@")).toBe(false);
    expect(validateEmail("user @example.com")).toBe(false);
  });
});

describe("validatePasswordStrength", () => {
  it("should return weak for empty password", () => {
    const result = validatePasswordStrength("");
    expect(result.label).toBe("Weak");
    expect(result.score).toBe(0);
    expect(result.feedback).toContain("Password is required");
  });

  it("should return weak for short password", () => {
    const result = validatePasswordStrength("abc123");
    expect(result.label).toBe("Weak");
    expect(result.feedback).toContain("At least 8 characters required");
  });

  it("should return fair for password with basic requirements", () => {
    const result = validatePasswordStrength("Password1");
    expect(result.score).toBeGreaterThanOrEqual(2);
  });

  it("should return good/strong for password with all requirements", () => {
    const result = validatePasswordStrength("MyP@ssw0rd123!");
    expect(result.score).toBeGreaterThanOrEqual(3);
  });

  it("should penalize common patterns", () => {
    const weakResult = validatePasswordStrength("password123");
    expect(weakResult.feedback).toContain(
      "Avoid common patterns and repeated characters"
    );
  });

  it("should penalize repeated characters", () => {
    const result = validatePasswordStrength("Passsssword1!");
    expect(result.feedback).toContain(
      "Avoid common patterns and repeated characters"
    );
  });

  it("should give feedback for missing uppercase/lowercase", () => {
    const result = validatePasswordStrength("password123!");
    expect(result.feedback).toContain(
      "Include both uppercase and lowercase letters"
    );
  });

  it("should give feedback for missing numbers", () => {
    const result = validatePasswordStrength("Password!");
    expect(result.feedback).toContain("Include at least one number");
  });

  it("should give feedback for missing special characters", () => {
    const result = validatePasswordStrength("Password123");
    expect(result.feedback).toContain(
      "Include at least one special character (!@#$%^&*)"
    );
  });
});

describe("validatePhoneNumber", () => {
  it("should return true for valid phone numbers", () => {
    expect(validatePhoneNumber("1234567")).toBe(true);
    expect(validatePhoneNumber("123-456-7890")).toBe(true);
    expect(validatePhoneNumber("(123) 456-7890")).toBe(true);
    expect(validatePhoneNumber("+1 234 567 8900")).toBe(true);
  });

  it("should return false for too short numbers", () => {
    expect(validatePhoneNumber("12345")).toBe(false);
    expect(validatePhoneNumber("123")).toBe(false);
  });

  it("should return false for too long numbers", () => {
    expect(validatePhoneNumber("1234567890123456")).toBe(false);
  });

  it("should handle numbers with country codes", () => {
    expect(validatePhoneNumber("+12345678901")).toBe(true);
  });
});

describe("validateRequiredField", () => {
  it("should return true for non-empty strings", () => {
    expect(validateRequiredField("John")).toBe(true);
    expect(validateRequiredField("  test  ")).toBe(true);
  });

  it("should return false for empty or whitespace strings", () => {
    expect(validateRequiredField("")).toBe(false);
    expect(validateRequiredField("   ")).toBe(false);
  });
});

describe("validatePasswordMatch", () => {
  it("should return true when passwords match", () => {
    expect(validatePasswordMatch("password123", "password123")).toBe(true);
    expect(validatePasswordMatch("MyP@ssw0rd!", "MyP@ssw0rd!")).toBe(true);
  });

  it("should return false when passwords don't match", () => {
    expect(validatePasswordMatch("password123", "password456")).toBe(false);
    expect(validatePasswordMatch("Password1", "password1")).toBe(false);
  });

  it("should return false when either password is empty", () => {
    expect(validatePasswordMatch("", "")).toBe(false);
    expect(validatePasswordMatch("password", "")).toBe(false);
    expect(validatePasswordMatch("", "password")).toBe(false);
  });
});
