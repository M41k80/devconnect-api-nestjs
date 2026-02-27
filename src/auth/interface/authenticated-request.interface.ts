import { Request } from 'express';
import { JwtPayload } from '../interface/jwt-payload.interface';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
