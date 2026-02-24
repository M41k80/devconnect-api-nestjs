export interface RequestWithCookies extends Request {
  cookies: {
    token?: string;
  };
}
