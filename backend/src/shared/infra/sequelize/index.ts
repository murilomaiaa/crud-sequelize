import { Options, Sequelize } from 'sequelize';
import dbConfig from '../../../config/database.js';

const connection = new Sequelize(dbConfig as Options);

export default connection;
