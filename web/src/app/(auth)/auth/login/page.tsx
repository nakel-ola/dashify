"use client";
import CustomInput from "@/components/custom-input";
import { PasswordEye } from "@/components/password-eye";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { isObjectValueEmpty } from "@/lib/is-object-value-empty";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import { MoonLoader } from "react-spinners";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[!@#\$%^&*()_+{}":;<>,.?~\[\]]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

type Props = {
  params: {};
  searchParams: { callbackUrl: string };
};

export default function Login(props: Props) {
  const {
    searchParams: { callbackUrl },
  } = props;

  const [isVisible, setIsVisible] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    isValid,
    isSubmitting,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      await signIn("credentials", { redirect: false, ...values }).then(
        ({ ok, error }: any) => {
          if (ok) {
            toast({ variant: "default", title: "Successfully logged in" });

            router.replace(callbackUrl ?? "/dashboard");
          } else {
            toast({
              variant: "destructive",
              title: error ?? "Uh oh! Something went wrong.",
            });
          }
        }
      );
    },
  });
  return (
    <Fragment>
      <Head>
        <title>Login | Dashify</title>
      </Head>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <CustomInput
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
            readOnly={isSubmitting}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              errors.email && values.email.length > 0 ? errors.email : undefined
            }
          />
          <CustomInput
            label="Password"
            name="password"
            type={isVisible ? "text" : "password"}
            readOnly={isSubmitting}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              errors.password && values.password.length > 0
                ? errors.password
                : undefined
            }
            labelRight={
              <div className="text-sm">
                <Link
                  href={
                    callbackUrl
                      ? `/auth/reset-password?callbackUrl=${callbackUrl}`
                      : "/auth/reset-password"
                  }
                  className="font-semibold text-indigo-600 hover:text-apple-400"
                >
                  Forgot password?
                </Link>
              </div>
            }
            required
            endIcon={
              <PasswordEye
                isVisible={isVisible}
                onClick={() => setIsVisible(!isVisible)}
              />
            }
          />

          <div>
            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
              className="w-full mt-5"
            >
              Sign in
              <MoonLoader
                size={20}
                color="white"
                className="ml-2 text-white"
                loading={isSubmitting}
              />
            </Button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}
