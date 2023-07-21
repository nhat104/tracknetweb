import bcrypt from 'bcryptjs';
import { generateToken } from '../middlewares/is-auth.js';
import { User } from '../models/index.js';
import * as ResponseJson from '../utils/ResponseJson.js';
import * as UserValidate from '../validations/user.js';

export const signup = async (req, res) => {
  const { value, error } = UserValidate.signupSchema.validate(req.body);

  if (error) {
    return ResponseJson.error(res, error.details[0].message, 422);
  }
  const { fullName, username, password, role = 'user' } = value;

  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = await User.create({ fullName, username, password: hashedPw, role });
    const data = {
      user: { id: user.id, username, fullName, role },
    };
    ResponseJson.created(res, data);
  } catch (err) {
    ResponseJson.error(res, err);
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return ResponseJson.unauthorized(res, {
        error: 'Wrong username. Please try again.',
      });
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return ResponseJson.unauthorized(res, {
        error: 'Wrong password. Please try again.',
      });
    }

    const accessToken = generateToken(user, 'access_token_tracknet', '2h');
    const refreshToken = generateToken(user, 'refresh_token_tracknet', '36h');

    const data = {
      user: {
        id: user.id,
        username,
        fullName: user.fullName,
        role: user.role,
        accessToken,
        refreshToken,
      },
    };

    await user.createLog({ action: 'login' });

    ResponseJson.success(res, data);
  } catch (error) {
    ResponseJson.error(res, error);
  }
};
