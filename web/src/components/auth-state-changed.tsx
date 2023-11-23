"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, PropsWithChildren, useCallback, useEffect } from "react";
import auth from "@/data/auth.json";

export const AuthStateChanged = ({ children }: PropsWithChildren) => {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = useCallback(() => {
    if (status === "loading") return;

    const isProtectedRoute = auth.protectedRoutes.some((path) =>
      pathname.startsWith(path)
    );
    const isUnauthenticatedRoutes = auth.unauthenticatedRoutes.some((path) =>
      pathname.startsWith(path)
    );

    if (status === "unauthenticated" && isProtectedRoute) {
      router.replace("/auth/login");
    }

    if (status === "authenticated" && isUnauthenticatedRoutes) {
      router.replace("/");
    }
  }, [pathname, router, status]);

  useEffect(() => {
    handleChange();
  }, [handleChange]);
  return <Fragment>{children}</Fragment>;
};
