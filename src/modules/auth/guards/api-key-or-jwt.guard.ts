import { AuthGuard } from '@nestjs/passport';

export class JwtOrApiKeyAuthGuard extends AuthGuard(['apikey', 'jwt']) {}
