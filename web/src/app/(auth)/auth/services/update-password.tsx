import { formatErrorMessage } from "@/lib/format-error-message";

type Args = {
  password: string;
  email: string;
  token: string;
};
export async function updatePassword(args: Args) {
  const res = await fetch(`${process.env.SERVER_URL}/auth/change-password`, {
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
