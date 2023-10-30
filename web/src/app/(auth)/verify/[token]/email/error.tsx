"use client"; // Error components must be Client Components
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import emailSentSuccessfullyAnimation from "@/data/animations/email-sent-successfully.json";
import emailVerificationFailedDark from "@/data/animations/email-verification-failed-dark.json";
import emailVerificationFailedLight from "@/data/animations/email-verification-failed-light.json";
import expiredAnimation from "@/data/animations/expired.json";
import loginAnimation from "@/data/animations/login.json";
import { useNextTheme } from "@/hooks/use-next-theme";
import Lottie from "lottie-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resendEmailVerification } from "./services/resend-email-verification";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};
export default function Error({ error }: Props) {
  const { theme } = useNextTheme();

  const { status, data } = useSession();

  if (status === "unauthenticated") return <LoginCard />;

  if (error.message === "Not Found" && !data?.user.emailVerified)
    return <ExpiredCard />;

  return (
    <div className="flex flex-col items-center justify-center">
      <Lottie
        animationData={
          theme === "light"
            ? emailVerificationFailedLight
            : emailVerificationFailedDark
        }
        loop={true}
        style={{ width: 200, height: 200 }}
      />

      <p className="text-3xl py-2 font-medium">Email Verification Failed</p>

      <p className="text-lg text-neutral-600">
        Email verification failed. Please try again later
      </p>
    </div>
  );
}

const LoginCard = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center">
      <Lottie
        animationData={loginAnimation}
        loop={true}
        style={{ width: 200, height: 200 }}
      />

      <p className="text-3xl py-2 font-medium">Login please</p>

      <p className="text-lg text-neutral-600">
        You need to login to verify your account
      </p>

      <Button className="my-2" onClick={() => router.push("/auth/login")}>
        Login now
      </Button>
    </div>
  );
};

const ExpiredCard = () => {
  const [emailSent, setEmailSent] = useState(false);

  const { toast } = useToast();

  const resendEmail = async () => {
    await resendEmailVerification()
      .then((results) => {
        toast({ variant: "default", title: results.message });
        setEmailSent(true);
      })
      .catch((err) => {
        toast({ variant: "destructive", title: err });
      });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Lottie
        animationData={
          emailSent ? emailSentSuccessfullyAnimation : expiredAnimation
        }
        loop={emailSent}
        style={{ width: 200, height: 200 }}
      />

      <p className="text-3xl py-2 font-medium">
        {emailSent ? "Email Verification sent" : "Link Expired"}
      </p>

      <p className="text-lg text-neutral-600">
        {emailSent
          ? "Check you email inbox for verification link"
          : "Verification link is expired. Please click the button below to request a new link"}
      </p>

      {!emailSent ? (
        <Button className="my-2" onClick={resendEmail}>
          Send Link
        </Button>
      ) : null}
    </div>
  );
};
