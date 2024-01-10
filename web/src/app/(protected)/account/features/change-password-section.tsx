"use client";
import { useFormik } from "formik";
import { TitleSection } from "./title-section";
import * as Yup from "yup";
import CustomInput from "@/components/custom-input";
import { useState } from "react";
import { PasswordEye } from "@/components/password-eye";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { updatePassword } from "../services/update-password";
import { toast } from "sonner";

const Schema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[!@#\$%^&*()_+{}":;<>,.?~\[\]]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  newPassword: Yup.string()
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
    .oneOf([Yup.ref("newPassword"), undefined], "New Passwords must match")
    .required("Confirm Password is required"),
});

type FormType = Yup.InferType<typeof Schema>;

type Props = {};
export const ChangePasswordSection = (props: Props) => {
  const [isVisible, setIsVisible] = useState<
    ("currentPassword" | "newPassword" | "confirmPassword")[]
  >([]);

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    isValid,
    isSubmitting,
    resetForm,
  } = useFormik<FormType>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Schema,
    validateOnChange: true,
    validateOnMount: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
        .then(() => {
          resetForm();
          toast.success("Password updated successfully");
        })
        .catch((err) => {
          toast.error(err.message);
        });
    },
  });

  const isCurrentVisible = isVisible.indexOf("currentPassword") !== -1;
  const isNewVisible = isVisible.indexOf("newPassword") !== -1;
  const isConfirmVisible = isVisible.indexOf("confirmPassword") !== -1;

  const updateIsVisible = (value: (typeof isVisible)[0]) => {
    let arr = [...isVisible];

    const inx = arr.indexOf(value);
    if (inx === -1) arr.push(value);
    else arr.splice(inx, 1);

    setIsVisible(arr);
  };
  return (
    <TitleSection
      title="Change password"
      subtitle="Update your password associated with your account."
    >
      <form onSubmit={handleSubmit} className="space-y-6 w-full lg:w-[80%]">
        <CustomInput
          label="Current password"
          name="currentPassword"
          type={isCurrentVisible ? "text" : "password"}
          required
          readOnly={isSubmitting}
          value={values.currentPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            errors.currentPassword && values.currentPassword.length > 0
              ? errors.currentPassword
              : undefined
          }
          endIcon={
            <PasswordEye
              isVisible={isCurrentVisible}
              onClick={() => updateIsVisible("currentPassword")}
            />
          }
        />
        <CustomInput
          label="New password"
          name="newPassword"
          type={isNewVisible ? "text" : "password"}
          required
          readOnly={isSubmitting}
          value={values.newPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            errors.newPassword && values.newPassword.length > 0
              ? errors.newPassword
              : undefined
          }
          endIcon={
            <PasswordEye
              isVisible={isNewVisible}
              onClick={() => updateIsVisible("newPassword")}
            />
          }
        />
        <CustomInput
          label="Confirm password"
          name="confirmPassword"
          type={isConfirmVisible ? "text" : "password"}
          required
          readOnly={isSubmitting}
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            errors.confirmPassword && values.confirmPassword.length > 0
              ? errors.confirmPassword
              : undefined
          }
          endIcon={
            <PasswordEye
              isVisible={isConfirmVisible}
              onClick={() => updateIsVisible("confirmPassword")}
            />
          }
        />

        <div className="flex">
          <Button
            disabled={!isValid || isSubmitting}
            type="submit"
            className="w-fit mt-5 ml-auto"
          >
            Update
            <MoonLoader
              size={20}
              color="white"
              className="ml-2 text-white"
              loading={isSubmitting}
            />
          </Button>
        </div>
      </form>
    </TitleSection>
  );
};
