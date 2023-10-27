import { formatErrorMessage } from "../../../../lib/format-error-message";

interface Args {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function createAccount(args: Args) {
  const res = await fetch(`${process.env.SERVER_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(formatErrorMessage(data.message));

  return data;
}
