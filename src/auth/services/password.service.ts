import { Injectable } from '@nestjs/common';
import bcryptjs from 'bcryptjs';

@Injectable()
export class PasswordService {
  async hashPassword(password: string) {
    return await bcryptjs.hash(password, 10);
  }
  async comparePassword(password: string, hashPassword: string) {
    return await bcryptjs.compare(password, hashPassword);
  }
}
