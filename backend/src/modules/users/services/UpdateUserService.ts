import ValidationError from '@shared/errors/ValidationError';
import { inject, injectable } from 'tsyringe';
import UpdateUserDTO from '../dtos/UpdateUserDTO';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {
    //
  }

  public async execute({ id, email, ...rest }: UpdateUserDTO): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new ValidationError('User with the given id not found');
    }

    if (email !== user.email) {
      const emailUser = await this.usersRepository.findByEmail(email);

      if (emailUser) throw new ValidationError('Email already in use');
    }

    Object.assign(user, { ...rest });

    await this.usersRepository.save(user);
  }
}

export default UpdateUserService;
