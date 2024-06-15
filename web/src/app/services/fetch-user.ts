'use server';

import axios from '@/lib/axios';
import { axiosFormatError } from '@/utils/axios-format-error';

type AxiosResponse = {
  ok: boolean;
  message?: string;
  user?: UserType;
};
export async function fetchUser(): Promise<AxiosResponse> {
  return axios
    .get<UserType>(`${process.env.SERVER_URL}/users`)
    .then((result) => ({ ok: true, user: result.data }))
    .catch((err) => ({ ok: false, message: axiosFormatError(err) }));
}
