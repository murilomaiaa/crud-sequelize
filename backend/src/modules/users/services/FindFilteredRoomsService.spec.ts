import 'reflect-metadata';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FindFilteredRoomsService from './FindFilteredRoomsService';

let fakeUsersRepository: FakeUsersRepository;
let findFilteredRooms: FindFilteredRoomsService;

const data = {
  name: 'Fulano',
  email: 'fulano@mail.com',
  birthday: new Date(),
  city: 'city',
  state: 'state',
  image: 'image.com',
  password: '123',
};

describe('FindFilteredRooms', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    findFilteredRooms = new FindFilteredRoomsService(fakeUsersRepository);
  });

  it('should be able to find a room with a given id', async () => {
    await fakeUsersRepository.create(data);
    await fakeUsersRepository.create({ ...data, email: 'fulano2@mail.com' });

    const users = await findFilteredRooms.execute(1);

    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('fulano@mail.com');
    expect(users[0].id).toBe(1);
  });

  it("should be able to return an empty array when don't find the user", async () => {
    const users = await findFilteredRooms.execute(1);

    expect(users).toHaveLength(0);
  });

  it('should be able to find rooms with one param', async () => {
    await fakeUsersRepository.create(data);
    await fakeUsersRepository.create({ ...data, email: 'fulano2@mail.com' });
    await fakeUsersRepository.create({ ...data, city: 'other' });

    const users = await findFilteredRooms.execute({
      city: 'city',
    });

    expect(users).toHaveLength(2);
  });

  it('should be able to find rooms with one or more params', async () => {
    await fakeUsersRepository.create(data);
    await fakeUsersRepository.create({ ...data, email: 'fulano2@mail.com' });
    await fakeUsersRepository.create({ ...data, city: 'other' });

    const find1 = await findFilteredRooms.execute({
      city: 'city',
      state: 'state',
    });
    expect(find1).toHaveLength(2);

    const find2 = await findFilteredRooms.execute({
      city: 'city',
      state: 'state',
      email: 'fulano2@mail.com',
    });
    expect(find2).toHaveLength(1);
  });

  it('should find all rooms with zero params', async () => {
    await fakeUsersRepository.create(data);
    await fakeUsersRepository.create({ ...data, email: 'fulano2@mail.com' });
    await fakeUsersRepository.create({ ...data, city: 'other' });

    expect(await findFilteredRooms.execute()).toHaveLength(3);
  });
});
