import CreateUserService from '@modules/users/services/CreateUserService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const createUser = container.resolve(CreateUserService);

    const { id, email, name, image } = await createUser.execute(body);

    const r = {
      id,
      email,
      name,
      image,
    };

    return response.json(r);
  }
}
