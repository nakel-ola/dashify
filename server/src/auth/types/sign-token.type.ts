export type SignTokenType = {
  sub: string;
  email: string;
  emailVerified: boolean;
  secret: string | Buffer;
  expiresIn: string | number;
};
