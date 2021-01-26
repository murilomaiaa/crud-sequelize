import { inject, injectable } from 'tsyringe';
import FilterUserDTO from '../dtos/FilterUserDTO';
import User from '../infra/sequelize/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class FindFilteredRoomsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {
    //
  }

  public async execute(data?: FilterUserDTO): Promise<User[]> {
    if (!data) {
      return this.usersRepository.findAll();
    }

    if (typeof data === 'number') {
      const user = await this.usersRepository.findById(data);
      return user ? [user] : ([] as User[]);
    }

    return this.usersRepository.filter(data);
  }
}

export default FindFilteredRoomsService;
