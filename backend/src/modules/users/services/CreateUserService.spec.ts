import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

const data = {
  email: 'mu@rilo.com',
  name: 'Murilo',
  password: '123456',
  birthday: '2000-01-01',
  city: 'São Paulo',
  state: 'SP',
  image: 'image.com',
};

describe('CreateUsers', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute(data);

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Murilo');
  });

  it('should not be able to create a user with a already existent email ', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute(data);

    await expect(createUser.execute(data)).rejects.toBeInstanceOf(AppError);
  });
});
