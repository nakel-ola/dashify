/* eslint-disable @next/next/no-img-element */
import PasswordEye from "@/components/PasswordEye";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";

export default function ChangePassword() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
            Change password
          </h2>

          <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Enter a new password
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-black dark:text-white"
              >
                Password
              </label>
              <div className="mt-2">
                <Input
                  className="w-full"
                  name="password"
                  type={isVisible ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  endIcon={
                    <PasswordEye
                      isVisible={isVisible}
                      onClick={() => setIsVisible(!isVisible)}
                    />
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-black dark:text-white"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <Input
                  className="w-full"
                  name="confirmPassword"
                  type={isVisible ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  endIcon={
                    <PasswordEye
                      isVisible={isVisible}
                      onClick={() => setIsVisible(!isVisible)}
                    />
                  }
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
