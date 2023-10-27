"use client";
import { resetPassword } from "@/app/(auth)/auth/services/reset-password";
import CustomInput from "@/components/custom-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useFormik } from "formik";
import React, { useState } from "react";
import { MoonLoader } from "react-spinners";
import * as Yup from "yup";

const EmailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
});

export default function ForgetPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const { handleSubmit, handleChange, handleBlur, values, errors } = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: EmailSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await resetPassword(values.email)
        .then((results) => {
          // TODO: Do something here
        })
        .catch((err) => {
          toast({ variant: "destructive", title: err });
        })
        .finally(() => setIsLoading(false));
    },
  });
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" onSubmit={handleSubmit}>
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
          error={
            errors.email && values.email.length > 0 ? errors.email : undefined
          }
        />

        <div>
          <Button disabled={isLoading} type="submit" className="w-full mt-5">
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
  );
}
