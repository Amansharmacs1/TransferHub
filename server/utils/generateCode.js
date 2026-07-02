/**
 * Generates a random 6-character uppercase alphanumeric code.
 * Excludes confusing characters like 0, O, I, L, 1.
 */
const generateCode = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = generateCode;
