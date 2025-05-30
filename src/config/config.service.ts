import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ConfigService {
  get(key: string): string {
    return process.env[key];
  }

  getPort(): number {
    return +this.get('PORT') || 3000;
  }
}
