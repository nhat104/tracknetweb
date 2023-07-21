import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { Log, User } from './models/index.js';
import { authRoutes, logRoutes, userRoutes } from './routes/index.js';
import sequelize from './utils/database.js';
import swaggerDocs from './utils/swagger.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());

// All route
app.use('/auth', authRoutes);
// app.use(statisticRoutes);
app.use('/users', userRoutes);
app.use('/logs', logRoutes);

// associations
Log.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Log);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(8000);
    swaggerDocs(app, 8000);
  })
  .catch((err) => {
    console.log(err);
  });
