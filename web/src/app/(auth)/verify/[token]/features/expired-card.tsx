"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Information, TickCircle } from "iconsax-react";
import { useState } from "react";
import { resendEmailVerification } from "../services/resend-email-verification";
import { useSession } from "next-auth/react";

export const ExpiredCard = () => {
  const session = useSession();
  const [emailSent, setEmailSent] = useState(false);

  const { toast } = useToast();

  const resendEmail = async () => {
    if (!session.data) return;
    await resendEmailVerification(session.data.user.accessToken)
      .then((results) => {
        toast({ variant: "default", title: results.message });
        setEmailSent(true);
      })
      .catch((err) => {
        toast({ variant: "destructive", title: err });
      });
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {emailSent ? (
        <TickCircle className="text-green-500 w-24 h-24" />
      ) : (
        <Information className="text-red-500 w-24 h-24" />
      )}

      <p className="text-black dark:text-white text-center text-[37.279px]  font-bold leading-[128%]">
        {emailSent ? "Email Verification sent" : "Link Expired"}
      </p>

      <p className="text-3xl whitespace-pre-wrap  pt-2 text-black dark:text-white text-center text-[15.977px]  font-[250] leading-[140%]">
        {emailSent
          ? "Check you email inbox for verification link"
          : "Verification link is expired. Please click the button below to request a new link"}
      </p>

      {!emailSent ? (
        <Button className="my-2 mt-14 w-[350px]" onClick={resendEmail}>
          Send Link
        </Button>
      ) : null}
    </div>
  );
};
