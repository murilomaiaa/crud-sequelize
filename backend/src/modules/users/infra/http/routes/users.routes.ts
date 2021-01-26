import { Router } from 'express';
import FilteredUsersController from '../controllers/FilteredUserdController';
import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();
const filteredUsersController = new FilteredUsersController();

usersRouter.post('/', usersController.create);
usersRouter.get('/', filteredUsersController.find);
usersRouter.put('/', usersController.update);
usersRouter.delete('/:id', usersController.delete);

export default usersRouter;
