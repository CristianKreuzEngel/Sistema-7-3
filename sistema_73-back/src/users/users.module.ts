import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersProvider } from './entities/user.provider';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...UsersProvider],
  exports: [UsersService],
})
export class UsersModule {}
