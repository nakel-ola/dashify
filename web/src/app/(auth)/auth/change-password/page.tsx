"use client";
import CustomInput from "@/components/custom-input";
import { PasswordEye } from "@/components/password-eye";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import React, { useState } from "react";
import { MoonLoader } from "react-spinners";
import * as Yup from "yup";

const ChangePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[!@#\$%^&*()_+{}":;<>,.?~\[\]]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .min(8, "Confirm Password must be at least 8 characters long")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[A-Z]/,
      "Confirm Password must contain at least one uppercase letter"
    )
    .matches(
      /[!@#\$%^&*()_+{}":;<>,.?~\[\]]/,
      "Confirm Password must contain at least one special character"
    )
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});
export default function ChangePassword() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, handleChange, handleBlur, values, errors } = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: ChangePasswordSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <CustomInput
          label="Password"
          name="password"
          type={isVisible ? "text" : "password"}
          readOnly={isLoading}
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
        <CustomInput
          label="Confirm password"
          name="confirmPassword"
          type={isVisible ? "text" : "password"}
          readOnly={isLoading}
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            errors.confirmPassword && values.confirmPassword.length > 0
              ? errors.confirmPassword
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
