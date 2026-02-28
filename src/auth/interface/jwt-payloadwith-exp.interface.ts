import { JwtPayload } from './jwt-payload.interface';

export interface JwtPayloadWithExp extends JwtPayload {
  exp: number;
}
