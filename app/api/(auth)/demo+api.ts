import { DUMMY_USERS } from '../data';

export async function GET() {
  return Response.json(DUMMY_USERS.slice(1));
}
