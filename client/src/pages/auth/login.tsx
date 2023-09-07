/* eslint-disable @next/next/no-img-element */
import PasswordEye from "@/components/PasswordEye";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { MoonLoader } from "react-spinners";

type Props = {};

const Login = (props: Props) => {
  const router = useRouter();

  const { toast } = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    await signIn("login", { redirect: false, ...form })
      .then(({ error, ok }: any) => {
        if (ok) {
          toast({
            duration: 3000,
            variant: "default",
            title: "Successfully logged in",
          });
          router.replace("/dashboard");
        } else {
          toast({
            duration: 3000,
            variant: "destructive",
            title: error ?? "Uh oh! Something went wrong.",
          });
        }
      })
      .finally(() => setIsLoading(false));
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
            Welcome back
          </h2>

          <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
            New to Dashify?{" "}
            <Link
              href="/auth/register"
              className="font-semibold leading-6 text-indigo-600 hover:text-apple-400"
            >
              Create an account
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
                  autoComplete="email"
                  readOnly={isLoading}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-black dark:text-white"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    href="/auth/forget_password"
                    className="font-semibold text-indigo-600 hover:text-apple-400"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2 w-full">
                <Input
                  className="w-full"
                  readOnly={isLoading}
                  name="password"
                  required
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
              <Button disabled={isLoading} className="w-full">
                <MoonLoader
                  size={20}
                  color="white"
                  className="mr-2 text-white"
                  loading={isLoading}
                />
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
