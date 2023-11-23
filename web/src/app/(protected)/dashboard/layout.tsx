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
      <Header scrollY={200} />

      <div className="bg-black h-[330px] -mt-[72px] pt-[72px] bg-[size:_75px_75px] bg-[image:_linear-gradient(to_right,_#262626_1px,_transparent_1px),_linear-gradient(to_bottom,_#262626_1px,_transparent_1px)]">
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
