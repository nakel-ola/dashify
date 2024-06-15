'use server';

import axios from '@/lib/axios';
import { axiosFormatError } from '@/utils/axios-format-error';

interface Args {
  firstName: string;
  lastName: string;
  email: string;
  provider: 'GOOGLE' | 'APPLE';
  emailVerified: boolean;
  idToken: string;
}

type ReturnType = {
  accessToken: string;
  refreshToken: string;
};

export async function signInProvider(args: Args) {
  const { idToken, ...rest } = args;
  try {
    const url = `${process.env.SERVER_URL}/auth/signin`;

    const { data } = await axios.post<ReturnType>(url, rest);

    return data;
  } catch (error: any) {
    throw new Error(axiosFormatError(error));
  }
}
