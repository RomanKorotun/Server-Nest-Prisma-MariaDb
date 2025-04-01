import { Injectable } from '@nestjs/common';
import { ICustomRequest } from '../../common/interfaces/auth.interface';

@Injectable()
export class CurrentService {
  current(req: ICustomRequest) {
    const { username, email } = req.user!;
    return { username, email };
  }
}
