"use client";
import { createAccount } from "@/app/(auth)/auth/services/create-account";
import CustomInput from "@/components/custom-input";
import { PasswordEye } from "@/components/password-eye";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { isObjectValueEmpty } from "@/lib/is-object-value-empty";
import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { MoonLoader } from "react-spinners";
import * as Yup from "yup";

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().min(3).max(50).required("First Name is required"),
  lastName: Yup.string().min(3).max(50).required("Last Name is required"),
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

export default function Register() {
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
      firstName: "",
      lastName: "",
      password: "",
    },
    validationSchema: SignUpSchema,
    validateOnChange: true,
    validateOnMount: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await createAccount(values)
        .then((results) => {
          toast({ variant: "default", title: results.message });
          router.push("/auth/login");
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: err.message ?? "Uh oh! Something went wrong.",
          });
        });
    },
  });
  return (
    <Fragment>
      <Head>
        <title>Register | Dashify</title>
      </Head>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-5">
            <CustomInput
              label="First name"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              readOnly={isSubmitting}
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                errors.firstName && values.firstName.length > 0
                  ? errors.firstName
                  : undefined
              }
            />
            <CustomInput
              label="Last name"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              readOnly={isSubmitting}
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                errors.lastName && values.lastName.length > 0
                  ? errors.lastName
                  : undefined
              }
            />
          </div>

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
              Register
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
