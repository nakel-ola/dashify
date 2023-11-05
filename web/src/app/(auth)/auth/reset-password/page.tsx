"use client";
import CustomInput from "@/components/custom-input";
import { PasswordEye } from "@/components/password-eye";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { isObjectValueEmpty } from "@/lib/is-object-value-empty";
import { useFormik } from "formik";
import { Metadata } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import PinInput from "react-pin-input";
import { MoonLoader } from "react-spinners";
import * as Yup from "yup";
import { resetPassword } from "../services/reset-password";
import { updatePassword } from "../services/update-password";

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
  token: Yup.string(),
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

const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export default function ResetPassword() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const { toast } = useToast();

  const router = useRouter();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    setFieldValue,
  } = useFormik({
    initialValues: {
      email: "",
      token: "",
      password: "",
    },
    validationSchema: ResetPasswordSchema,
    validateOnChange: true,
    validateOnMount: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await updatePassword(values)
        .then(() => {
          toast({
            variant: "default",
            title: "Password change successfully, redirecting...",
          });
          router.push("/auth/login");
        })
        .catch((err) => {
          toast({ variant: "destructive", title: err.message });
        })
        .finally(() => setIsLoading(false));
    },
  });

  const sendCode = async () => {
    setIsCodeLoading(true);
    await resetPassword(values.email)
      .then((results) => {
        setCodeSent(true);
        toast({ title: "Validation code sent" });
      })
      .catch((err) => {
        toast({ variant: "destructive", title: err.message });
      })
      .finally(() => setIsCodeLoading(false));
  };
  return (
    <Fragment>
      <Head>
        <title>Reset Password | Dashify</title>
      </Head>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <CustomInput
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              readOnly={isLoading}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full"
              classes={{ inputRoot: "w-full", input: "w-full", root: "w-full" }}
              error={
                errors.email && values.email.length > 0
                  ? errors.email
                  : undefined
              }
            />

            {!codeSent && (
              <Button
                type="button"
                disabled={!values.email.match(mailformat)}
                className="mt-8 shrink-0 rounded-md h-10"
                onClick={sendCode}
              >
                {isCodeLoading ? (
                  <MoonLoader size={15} color="#ffffff" className="mr-2" />
                ) : null}
                Send code
              </Button>
            )}
          </div>

          <div className="">
            <label className="block text-base font-semibold leading-6 text-black dark:text-white">
              Reset password code
            </label>
            <PinInput
              length={6}
              initialValue=""
              secret
              secretDelay={100}
              disabled={!codeSent}
              onChange={(value) => setFieldValue("token", value)}
              type="numeric"
              inputMode="number"
              onComplete={(value, index) => {}}
              regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
            />
          </div>

          <CustomInput
            label="Password"
            name="password"
            type={isVisible ? "text" : "password"}
            readOnly={isLoading || !codeSent}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              errors.password && values.password.length > 0
                ? errors.password
                : undefined
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
              disabled={!isObjectValueEmpty(errors) || isLoading}
              type="submit"
              className="w-full mt-5"
            >
              <MoonLoader
                size={20}
                color="white"
                className="mr-2 text-white"
                loading={isLoading}
              />
              Submit
            </Button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}
