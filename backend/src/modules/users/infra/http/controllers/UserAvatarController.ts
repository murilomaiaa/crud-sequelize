import { Request, Response } from 'express';

import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import IUser from '@modules/users/repositories/IUser';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      userId: request.user.id,
      avatarFileName: request.file.filename,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...jsonUser } = user.toJSON() as IUser;

    return response.json(jsonUser);
  }
}
