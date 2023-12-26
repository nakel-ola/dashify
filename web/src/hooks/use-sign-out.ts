import { useQueryClient } from "@tanstack/react-query";
import { SignOutParams, signOut as nextSignOut } from "next-auth/react";

export const useSignOut = () => {
  const queryClient = useQueryClient();

  const signOut = async <R extends boolean = true>(
    options: SignOutParams<R> = {}
  ) => {
    await nextSignOut({ redirect: false, ...options });

    await queryClient.invalidateQueries();
  };

  return signOut;
};
