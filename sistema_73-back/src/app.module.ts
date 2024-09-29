import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { UsersProviders } from './users/entities/user.provider';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [],
  providers: [...databaseProviders, ...UsersProviders],
})
export class AppModule {}
