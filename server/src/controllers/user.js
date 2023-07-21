import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import * as ResponseJson from '../utils/ResponseJson.js';
import * as UserValidate from '../validations/user.js';
import sequelize from '../utils/database.js';

export const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({
      // where: { role: 'user' },
      attributes: ['id', 'fullName', 'username', 'role'],
    });
    return ResponseJson.success(res, users);
  } catch (error) {
    return ResponseJson.error(res, error);
  }
};

export const addUser = async (req, res) => {
  const { value, error } = UserValidate.addUser.validate(req.body);
  if (error) return ResponseJson.error(res, error.details[0].message);

  try {
    const { fullName, username, password } = value;
    const checkUser = await User.findOne({ where: { username } });
    if (checkUser) {
      return ResponseJson.error(res, 'Username already exists!', 211);
    }
    const user = await User.create({
      fullName,
      username,
      password,
      role: 'user',
    });
    const adminUser = await User.findByPk(req.jwtDecoded.data.id);
    await adminUser.createLog({ action: `add user with username ${user.toJSON().username}` });
    return ResponseJson.success(res, user);
  } catch (error) {
    return ResponseJson.error(res, error);
  }
};

export const editUser = async (req, res) => {
  try {
    const { userId: id } = req.params;
    const { fullName, username, password } = req.body;
    const hashedPw = await (password ? bcrypt.hash(password, 12) : null);

    const data = await sequelize.query('SELECT * FROM `users` WHERE `id` = :id', {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });
    console.log(data);
    const user = await User.findByPk(id);
    if (!user) return ResponseJson.error(res, 'User not found!');

    const adminUser = await User.findByPk(req.jwtDecoded.data.id);

    await user.update({ fullName, username, password: hashedPw || user.toJSON().password });
    await adminUser.createLog({ action: `edit user with username ${user.toJSON().username}` });

    return ResponseJson.success(res, user);
  } catch (error) {
    return ResponseJson.error(res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId: id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return ResponseJson.error(res, 'User not found!');

    const adminUser = await User.findByPk(req.jwtDecoded.data.id);

    await adminUser.createLog({ action: `delete user with username ${user.toJSON().username}` });
    await user.destroy();
    return ResponseJson.success(res, 'Delete user successfully!');
  } catch (error) {
    return ResponseJson.error(res, error);
  }
};
