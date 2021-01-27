import multer from 'multer';
import { Router } from 'express';

import uploadConfig from '@config/upload';
import FilteredUsersController from '../controllers/FilteredUserdController';
import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const usersController = new UsersController();
const filteredUsersController = new FilteredUsersController();
const usersAvatarController = new UserAvatarController();
const upload = multer(uploadConfig);

usersRouter.use(ensureAuthenticated);
usersRouter.post('/', usersController.create);
usersRouter.get('/', filteredUsersController.find);
usersRouter.put('/', usersController.update);
usersRouter.delete('/:id', usersController.delete);
usersRouter.patch(
  '/avatar',
  upload.single('avatar'),
  usersAvatarController.update,
);

export default usersRouter;
