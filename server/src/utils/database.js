import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('tracknet', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  // logging: false,
  define: { timestamps: true },
});

export default sequelize;
