import { Router } from 'express';
import FilteredUsersController from '../controllers/FilteredUserdController';
import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '../middlewares/ensureAuthenticted';

const usersRouter = Router();
const usersController = new UsersController();
const filteredUsersController = new FilteredUsersController();

usersRouter.post('/', usersController.create);
usersRouter.get('/', ensureAuthenticated, filteredUsersController.find);
usersRouter.put('/', ensureAuthenticated, usersController.update);
usersRouter.delete('/:id', ensureAuthenticated, usersController.delete);

export default usersRouter;
