import Image from "next/image";
import Link from "next/link";
import React, { Fragment, PropsWithChildren } from "react";
import { TitleCard } from "./auth/features";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Auth | Dashify",
};

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Fragment>
      <Link href="/">
        <div className="flex items-center cursor-pointer p-5">
          <Image
            src="/logo.png"
            width={32}
            height={32}
            alt="Dashify logo"
            className="h-8 w-auto"
          />
          <p className="text-black dark:text-white text-xl ml-2 font-bold">
            Dashify
          </p>
        </div>
      </Link>

      <main className="min-h-full flex-1 flex-col justify-center px-6 py-4 lg:px-8">
        <TitleCard />
        {children}
      </main>
    </Fragment>
  );
}
