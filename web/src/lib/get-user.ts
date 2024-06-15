import { fetchUser } from '@/app/services/fetch-user';

export async function getUser() {
  const data = await fetchUser();

  return data.user;
}
