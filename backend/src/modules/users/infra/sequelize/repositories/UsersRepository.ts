import CreateUserDTO from '@modules/users/dtos/CreateUserDTO';
import RepositoryFilterUserDTO from '@modules/users/dtos/RepositoryFilterUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '../entities/User';

export default class UsersRepository implements IUsersRepository {
  async create(data: CreateUserDTO): Promise<User> {
    const user = await User.create(data);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await User.findOne({ where: { email } });
    return user || undefined;
  }

  async findAll(): Promise<User[]> {
    return User.findAll();
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await User.findByPk(id);
    return user || undefined;
  }

  async filter({
    birthday,
    city,
    email,
    name,
    state,
  }: RepositoryFilterUserDTO): Promise<User[]> {
    const data: Record<string, unknown> = {};
    if (birthday) data.birthday = birthday;
    if (city) data.city = city;
    if (email) data.email = email;
    if (name) data.name = name;
    if (state) data.state = state;

    return User.findAll({
      where: data,
    });
  }
}
