import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/sequelize/entities/User';

interface IRequest {
  userId: number;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {
    //
  }

  public async execute({ userId, avatarFileName }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError(
        'You must be authenticated to execute this action',
        401,
      );
    }

    console.log({ image: user.image });
    if (user.image) {
      await this.storageProvider.deleteFile(user.image);
    }

    const fileName = await this.storageProvider.saveFile(avatarFileName);

    user.image = fileName;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
