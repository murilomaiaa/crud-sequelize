import { parseISO } from 'date-fns';
import FindFilteredRoomsService from '@modules/users/services/FindFilteredRoomsService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class FilteredUsersController {
  public async find(request: Request, response: Response): Promise<Response> {
    const { query } = request;

    const findFilteredUsers = container.resolve(FindFilteredRoomsService);

    let finder;

    if (query.id) {
      finder = Number(query.id);
    } else {
      const { email, name, birthday, city, state } = query;
      const parsedBirthday = birthday ? parseISO(String(birthday)) : undefined;
      finder = {
        email: email ? String(email) : undefined,
        name: name ? String(name) : undefined,
        birthday: birthday ? parsedBirthday : undefined,
        city: city ? String(city) : undefined,
        state: state ? String(state) : undefined,
      };
      console.log(finder);
    }

    const users = await findFilteredUsers.execute(finder);

    const r = users.map(
      ({ id, name, email, birthday, image, city, state }) => ({
        id,
        name,
        email,
        birthday,
        image,
        city,
        state,
      }),
    );

    return response.json(r);
  }
}
