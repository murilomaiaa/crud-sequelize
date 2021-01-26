import CreateUserDTO from '../dtos/CreateUserDTO';
import User from '../infra/sequelize/entities/User';

export default interface IUsersRepository {
  create: (user: CreateUserDTO) => Promise<User>;
  findByEmail: (email: string) => Promise<User | undefined>;
}
