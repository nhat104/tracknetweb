import { User } from '../models/index.js';
import * as ResponseJson from '../utils/ResponseJson.js';
import * as CheckValidate from '../validations/check.js';

export const checkIn = async (req, res) => {
  const { value, error } = CheckValidate.checkSchema.validate(req.body);

  if (error) {
    return ResponseJson.error(res, error.details[0].message);
  }
  try {
    const { userId, date } = value;
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return ResponseJson.error(res, 'User not found');
    }

    const data = await user.createCheckIn({ date });
    ResponseJson.success(res, data);
  } catch (err) {
    ResponseJson.error(res, err);
  }
};

export const checkOut = async (req, res) => {
  const { value, error } = CheckValidate.checkSchema.validate(req.body);

  if (error) {
    return ResponseJson.error(res, error.details[0].message);
  }
  try {
    const { userId, date } = value;
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return ResponseJson.error(res, 'User not found');
    }

    const data = await user.createCheckOut({ date });
    ResponseJson.success(res, data);
  } catch (err) {
    ResponseJson.error(res, err);
  }
};
