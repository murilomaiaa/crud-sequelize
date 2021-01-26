import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ValidationError from '@shared/errors/ValidationError';
import UpdateUserService from './UpdateUserService';

let fakeUsersRepository: FakeUsersRepository;
let updateUser: UpdateUserService;

const data = {
  id: 1,
  name: 'Fulano',
  email: 'fulano@mail.com',
  birthday: '2003-01-23',
  password: '123',
  city: 'city',
  state: 'state',
  image: 'image.com',
};

describe('UpdateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    updateUser = new UpdateUserService(fakeUsersRepository);
  });

  it('should be able to update an user data', async () => {
    const { id } = await fakeUsersRepository.create(data);

    await updateUser.execute({
      ...data,
      city: 'another',
    });

    const user = await fakeUsersRepository.findById(id);

    expect(user?.city).toBe('another');
  });

  it("should not be able to update a user that doesn't exists", async () => {
    expect(updateUser.execute(data)).rejects.toBeInstanceOf(ValidationError);
  });

  it('should throws an error when the email is already used', async () => {
    await fakeUsersRepository.create(data);
    await fakeUsersRepository.create({ ...data, email: 'another@email.com' });

    expect(updateUser.execute({ ...data, id: 2 })).rejects.toBeInstanceOf(
      ValidationError,
    );
  });
});
