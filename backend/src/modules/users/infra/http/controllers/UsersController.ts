import CreateUserService from '@modules/users/services/CreateUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
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

  public async update(request: Request, response: Response): Promise<Response> {
    const { id, name, email, birthday, city, state } = request.body;

    const updateUser = container.resolve(UpdateUserService);

    await updateUser.execute({ id, name, email, birthday, city, state });

    return response.status(204).json();
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteUser = container.resolve(DeleteUserService);

    await deleteUser.execute(Number(id));

    return response.status(204).json();
  }
}
