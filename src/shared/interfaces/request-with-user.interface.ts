import { Request } from 'express';

interface User {
  id: number;
  email: string | '';
  apiKey: string | '';
}
interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
