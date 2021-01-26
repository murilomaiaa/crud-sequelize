import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import CreateUserDTO from '@modules/users/dtos/CreateUserDTO';
import User from '@modules/users/infra/sequelize/entities/User';
import RepositoryFilterUserDTO from '@modules/users/dtos/RepositoryFilterUserDTO';

class UsersRepository implements IUsersRepository {
  private users: User[] = [];

  private nextId = 1;

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async create(userData: CreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: this.nextId }, userData);

    this.users.push(user);

    return user;
  }

  public async findAll(): Promise<User[]> {
    return this.users;
  }

  public async findById(id: number): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async filter({
    birthday,
    city,
    email,
    name,
    state,
  }: RepositoryFilterUserDTO): Promise<User[]> {
    const filter = (user: User) => {
      if (birthday && user.birthday !== birthday) return false;
      if (city && user.city !== city) return false;
      if (email && user.email !== email) return false;
      if (name && user.name !== name) return false;
      if (state && user.state !== state) return false;
      return true;
    };

    return this.users.filter(filter);
  }
}

export default UsersRepository;
