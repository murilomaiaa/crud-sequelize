import { Request, Response } from 'express';

import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

type Pass = {
  password?: string | undefined;
};

type User = Pass & {
  [key: string]: string;
};

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({ email, password });

    const _user = user.toJSON() as User;

    delete _user.password;

    return response.json({
      user: _user,
      token,
    });
  }
}
