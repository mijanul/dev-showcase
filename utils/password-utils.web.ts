import bcrypt from "bcryptjs";

/**
 * Password hashing utilities for web using bcryptjs
 */

const SALT_ROUNDS = 10;

/**
 * Hash a password with bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  if (!plainPassword || typeof plainPassword !== "string") {
    throw new Error("Plain password must be a non-empty string");
  }

  if (!hashedPassword || typeof hashedPassword !== "string") {
    return false;
  }

  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

export const passwordUtils = {
  hashPassword,
  comparePassword,
};
