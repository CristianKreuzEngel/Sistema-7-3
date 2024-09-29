import { User } from './user.entity';

export const UsersProvider = {
  provide: 'User_Repository',
  useValue: User,
};
