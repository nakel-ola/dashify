import { nextAuthOptions } from "@/lib/auth/next-auth-options";
import { getServerSession } from "next-auth";
import React from "react";
import { LoginCard, SuccessCard } from "./features";
import { validateEmail } from "./services/validate-email";

type Props = {
  params: {
    token: string;
  };
};
export default async function Verify(props: Props) {
  const {
    params: { token },
  } = props;
  const session = await getServerSession(nextAuthOptions);

  if (!session) return <LoginCard />;

  await validateEmail(token, session.user.accessToken);

  return <SuccessCard />;
}
