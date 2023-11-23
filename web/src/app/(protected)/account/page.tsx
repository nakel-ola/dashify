import React, { Fragment } from "react";
import { Header } from "../dashboard/features";
import {
  ChangePasswordSection,
  DeleteAccountSection,
  PersonalInfoSection,
  TopSection,
} from "./features";

export default async function Account() {
  return (
    <Fragment>
      <Header scrollY={190} />

      <TopSection />
      <main className="page-max-width px-5 lg:px-10 py-10">
        <PersonalInfoSection />

        <hr className="h-[1px] bg-slate-100 dark:bg-neutral-800 border-0 outline-none my-8" />

        <ChangePasswordSection />

        <hr className="h-[1px] bg-slate-100 dark:bg-neutral-800 border-0 outline-none my-8" />

        <DeleteAccountSection />
      </main>
    </Fragment>
  );
}
