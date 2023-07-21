import { DataTypes } from 'sequelize';
import sequelize from '../utils/database.js';

const Log = sequelize.define('log', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  action: DataTypes.STRING,
});

export default Log;
