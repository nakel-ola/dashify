import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, {
  Fragment,
  PropsWithChildren,
  useCallback,
  useEffect,
} from "react";

import constant from "@/lib/constant";

type Props = {};

export const AuthContext = (props: PropsWithChildren<Props>) => {
  const { status } = useSession();
  const router = useRouter();

  const handleAuthChange = useCallback(() => {
    if (status === "loading") return;

    const isUnauthenticatedPath = constant.unauthenticatedPath.find((path) =>
      path.includes(router.pathname)
    );

    const isNeutralPath = constant.neutralPath.find((path) =>
      path.includes(router.pathname)
    );

    if (isNeutralPath) return;

    if (status === "unauthenticated" && !isUnauthenticatedPath)
      router.replace("/");

    if (status === "authenticated" && isUnauthenticatedPath)
      router.replace("/dashboard");
  }, [router, status]);

  useEffect(() => {
    handleAuthChange();
  }, [handleAuthChange]);
  return <Fragment />;
};
