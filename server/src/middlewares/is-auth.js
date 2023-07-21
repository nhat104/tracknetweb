import jwt from 'jsonwebtoken';
import { unauthorized } from '../utils/ResponseJson.js';

export const generateToken = (user, secretSignature, tokenLife) => {
  try {
    const token = jwt.sign({ data: user }, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenLife,
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

const isAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = { message: 'Not authenticated.', status: 401 };
    throw error;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, 'access_token_tracknet');
    req.jwtDecoded = decodedToken;
    next();
  } catch (error) {
    unauthorized(res);
  }
};

export default isAuth;
