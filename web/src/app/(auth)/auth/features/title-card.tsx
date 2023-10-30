"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Fragment } from "react";

export const TitleCard = () => {
  const pathname = usePathname();

  const item = items.find((item) => pathname.startsWith(item.id));

  if (!item) return <Fragment />;

  const { subtitle, subtitleLink, title } = item;

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 className="text-center text-4xl font-bold leading-9 tracking-tight text-black dark:text-white">
        {title}
      </h2>

      <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
        {subtitle}{" "}
        {subtitleLink ? (
          <Link
            href={subtitleLink.href}
            className="font-semibold leading-6 text-indigo-600 hover:text-apple-400"
          >
            {subtitleLink.text}
          </Link>
        ) : null}
      </p>
    </div>
  );
};

const items = [
  {
    id: "/auth/login",
    title: "Welcome back",
    subtitle: "New to Dashify?",
    subtitleLink: {
      href: "/auth/register",
      text: "Create an account",
    },
  },
  {
    id: "/auth/register",
    title: "Create an account",
    subtitle: "Already Dashify?",
    subtitleLink: {
      href: "/auth/login",
      text: "Login",
    },
  },
  {
    id: "/auth/forget-password",
    title: "Reset password",
    subtitle: "I know my password?",
    subtitleLink: {
      href: "/auth/login",
      text: "Login",
    },
  },
  {
    id: "/auth/reset-password",
    title: "Reset password",
    subtitle: "I know my password?",
    subtitleLink: {
      href: "/auth/login",
      text: "Login",
    },
  },
  {
    id: "/auth/change-password",
    title: "Change password",
    subtitle: "Enter a new password",
  },
];
