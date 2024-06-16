'use server';

import axios from '@/lib/axios';
import { axiosFormatError } from '@/utils/axios-format-error';

type Message = {
  message: string;
};

export async function connectToDB(projectId: string) {
  const url = `/projects/${projectId}/connect-to-db`;

  return axios
    .get<Message>(url)
    .then(() => {
      return { ok: true, message: 'Connected successfully' };
    })
    .catch((err) => {
      return { ok: false, message: axiosFormatError(err) };
    });
}
