/* eslint-disable @next/next/no-img-element */
import PasswordEye from "@/components/PasswordEye";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="">
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
            Create an account
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Already Dashify?{" "}
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
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-black dark:text-white"
                >
                  First Name
                </label>
                <div className="mt-2">
                  <Input
                    className="w-full"
                    name="firstName"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-black dark:text-white"
                >
                  Last Name
                </label>
                <div className="mt-2">
                  <Input
                    className="w-full"
                    type="text"
                    autoComplete="family-name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

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
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-black dark:text-white"
              >
                Password
              </label>
              <div className="mt-2 w-full">
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
              <Button className="w-full" type="submit">
                Register
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
