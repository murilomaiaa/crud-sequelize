import CreateUserDTO from '@modules/users/dtos/CreateUserDTO';
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
}
