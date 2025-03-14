import * as argon2 from 'argon2';

const PEPPER = process.env.PASSWORD_HASH_PEPPER;

/**
 * Generates a secure hash for a password using Argon2 with pepper
 * @param password The password to be hashed
 * @returns Promise with the generated hash
 */
export async function generateHash(password: string): Promise<string> {
  try {
    const pepperedPassword = `${password}${PEPPER}`;
    const hash = await argon2.hash(pepperedPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64MB of memory
      timeCost: 3, // 3 iterations
      parallelism: 1, // 1 thread
    });

    return hash;
  } catch (error) {
    console.error(error.message);
    throw new Error(`Error generating password hash`);
  }
}

/**
 * Compares a password with a hash securely using Argon2
 * @param password The password to be verified
 * @param hash The stored hash
 * @returns Promise<boolean> indicating if the password is correct
 */
export async function compareHash(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    const pepperedPassword = `${password}${PEPPER}`;
    return await argon2.verify(hash, pepperedPassword);
  } catch (error) {
    console.error(error.message);
    throw new Error('Error comparing password');
  }
}
