import { randomBytes } from 'crypto';

const generateToken = (): string => {
  const token = randomBytes(32).toString('hex');
  return token;
};

export default generateToken;