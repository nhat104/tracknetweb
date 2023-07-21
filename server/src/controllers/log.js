import { Log, User } from '../models/index.js';
import * as ResponseJson from '../utils/ResponseJson.js';

export const getAllLog = async (req, res) => {
  try {
    const users = await Log.findAll({
      include: {
        model: User,
        attributes: ['id', 'fullName', 'role'],
      },
      order: [['createdAt', 'DESC']],
    });
    return ResponseJson.success(res, users);
  } catch (error) {
    return ResponseJson.error(res, error);
  }
};

export const createLog = async (req, res) => {
  const { action } = req.body;
  try {
    const user = await User.findOne({ where: { id: req.jwtDecoded.data.id } });
    const log = await user.createLog({ action });
    return ResponseJson.success(res, log);
  } catch (error) {
    return ResponseJson.error(res, error);
  }
};
