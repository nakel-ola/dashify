import { nextAuthOptions } from "@/lib/auth/next-auth-options";
import { formatErrorMessage } from "@/lib/format-error-message";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { SuccessCard } from "./features";

async function validateEmail(token: string) {
  const session = await getServerSession(nextAuthOptions);

  const accessToken = session?.user.accessToken;

  if (!accessToken) throw new Error("Please login");

  const res = await fetch(`${process.env.SERVER_URL}/auth/validate-email`, {
    method: "POST",
    body: JSON.stringify({ token }),
    headers: {
      "Content-type": "application/json",
      "x-access-token": `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (res.status === 404) throw Error("Not Found");

  if (!res.ok) throw new Error(formatErrorMessage(data.message));

  session.user.emailVerified = true;

  return data;
}

type Props = {
  params: {
    token: string;
  };
};

export const metadata: Metadata = {
  title: "Verify Email | Dashify",
};
export default async function EmailVerification({ params: { token } }: Props) {
  await validateEmail(token);
  return <SuccessCard />;
}
