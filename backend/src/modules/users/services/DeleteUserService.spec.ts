import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ValidationError from '@shared/errors/ValidationError';
import DeleteUserService from './DeleteUserService';

let fakeUsersRepository: FakeUsersRepository;
let deleteUser: DeleteUserService;

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

describe('DeleteUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    deleteUser = new DeleteUserService(fakeUsersRepository);
  });

  it('should be able to delete an user', async () => {
    const { id } = await fakeUsersRepository.create(data);
    await fakeUsersRepository.create({
      ...data,
      email: 'another',
    });

    await deleteUser.execute(id);

    const user = await fakeUsersRepository.findById(id);
    const users = await fakeUsersRepository.findAll();

    expect(user).toBeUndefined();
    expect(users.length).toBe(1);
    expect(users[0].email).toBe('another');
  });

  it("should not be able to update a user that doesn't exists", async () => {
    expect(deleteUser.execute(1)).rejects.toBeInstanceOf(ValidationError);
  });
});
