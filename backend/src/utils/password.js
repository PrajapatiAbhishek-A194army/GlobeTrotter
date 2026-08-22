import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

/**
 * Hash a plain-text password
 */
export const hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS)

/**
 * Compare a plain-text password with a stored hash
 */
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash)
