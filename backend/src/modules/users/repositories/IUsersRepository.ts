import CreateUserDTO from '../dtos/CreateUserDTO';
import RepositoryFilterUserDTO from '../dtos/RepositoryFilterUserDTO';
import User from '../infra/sequelize/entities/User';

export default interface IUsersRepository {
  create: (user: CreateUserDTO) => Promise<User>;
  findByEmail: (email: string) => Promise<User | undefined>;
  findAll: () => Promise<User[]>;
  findById: (id: number) => Promise<User | undefined>;
  filter: (data: RepositoryFilterUserDTO) => Promise<User[]>;
  save: (user: User) => Promise<void>;
  delete: (user: User) => Promise<void>;
}
