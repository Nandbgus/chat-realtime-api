// utils/generateToken.js
import jwt from 'jsonwebtoken';

export const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Access token cepat expired
  });

  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d', // Refresh token lebih lama
  });

  return { accessToken, refreshToken };
};
