/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { FormEvent, useState } from "react";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <div>
      <Link href="/">
        <div className="flex items-center cursor-pointer p-5">
          <img className="h-8 w-auto" src="/logo.png" alt="Your Company" />
          <p className="text-black dark:text-white text-xl ml-2 font-bold">
            Dashify
          </p>
        </div>
      </Link>

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-4 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-4xl font-bold leading-9 tracking-tight text-black dark:text-white">
            Reset password
          </h2>

          <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
            I know my password?{" "}
            <Link
              href="/auth/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-apple-400"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-black dark:text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <Input
                  className="w-full"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button className="w-full" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
