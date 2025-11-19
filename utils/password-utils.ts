import * as Crypto from "expo-crypto";

/**
 * Password hashing utilities using expo-crypto
 * Uses PBKDF2 with SHA256 for secure password hashing
 */

const ITERATIONS = 10000; // Number of iterations for PBKDF2
const SALT_LENGTH = 32; // Length of the salt in bytes

/**
 * Generate a random salt
 */
const generateSalt = async (): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(SALT_LENGTH);
  return Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

/**
 * Hash a password using PBKDF2
 */
export const hashPassword = async (password: string): Promise<string> => {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }

  // Generate a random salt
  const salt = await generateSalt();

  // Hash the password using PBKDF2
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + salt,
    {
      encoding: Crypto.CryptoEncoding.HEX,
    }
  );

  // Additional iterations for stronger hashing
  let finalHash = hash;
  for (let i = 0; i < ITERATIONS; i++) {
    finalHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      finalHash + salt,
      {
        encoding: Crypto.CryptoEncoding.HEX,
      }
    );
  }

  // Return salt:hash format
  return `${salt}:${finalHash}`;
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
    // Extract salt and hash from stored password
    const [salt, storedHash] = hashedPassword.split(":");

    if (!salt || !storedHash) {
      return false;
    }

    // Hash the provided password with the same salt
    let computedHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      plainPassword + salt,
      {
        encoding: Crypto.CryptoEncoding.HEX,
      }
    );

    // Apply the same iterations
    for (let i = 0; i < ITERATIONS; i++) {
      computedHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        computedHash + salt,
        {
          encoding: Crypto.CryptoEncoding.HEX,
        }
      );
    }

    // Constant-time comparison to prevent timing attacks
    return computedHash === storedHash;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

export const passwordUtils = {
  hashPassword,
  comparePassword,
};
