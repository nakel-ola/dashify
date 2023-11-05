import { getUser } from "@/lib/get-user";
import type { Metadata } from "next";
import { Fragment, type PropsWithChildren } from "react";
import { Header } from "./features";

export const metadata: Metadata = {
  title: "Dashboard | Dashify",
};

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const user = await getUser();
  return (
    <Fragment>
      <Header />

      <div
        className="bg-black h-[280px]"
        style={{
          backgroundSize: "75px 75px",
          backgroundImage:
            "linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)",
        }}
      >
        <div className="px-5 lg:px-10 py-4 pt-10 page-max-width">
          <p className="text-4xl lg:text-5xl font-medium text-white">
            Hello, {user?.lastName} {user?.firstName}
          </p>
          <p className="mt-2 text-base lg:text-lg text-gray-light">
            Select or Create an new Dash
          </p>
        </div>
      </div>
      {children}
    </Fragment>
  );
}
