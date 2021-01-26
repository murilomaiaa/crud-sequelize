import { DataTypes, Model, Optional } from 'sequelize';
import connection from '@shared/infra/sequelize';

// These are all the attributes in the User model
type UserAttributes = {
  id: number;
  email: string;
  password: string;
  name: string;
  birthday: Date;
  city: string;
  state: string;
  image: string;
};

// Some attributes are optional in `User.build` and `User.create` calls
type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;

  public email!: string;

  public password!: string;

  public name!: string;

  public birthday!: Date;

  public city!: string;

  public state!: string;

  public image!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birthday: DataTypes.DATE,
    image: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
  },
  {
    sequelize: connection,
    tableName: 'users',
  },
);

export default User;
