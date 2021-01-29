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

usersRouter.post('/', usersController.create);
usersRouter.get('/', ensureAuthenticated, filteredUsersController.find);
usersRouter.put('/', ensureAuthenticated, usersController.update);
usersRouter.delete('/:id', ensureAuthenticated, usersController.delete);
usersRouter.patch(
  '/:id/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update,
);

export default usersRouter;
