"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MoonLoader } from "react-spinners";

type Props = {
  projectId: string;
  token: string;
};
export const AcceptButton = (props: Props) => {
  const { projectId, token } = props;

  const { toast } = useToast();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);

    await axios
      .post(`/projects/${projectId}/accept-member-invite`, { token })
      .then(async (result) => {
        toast({
          variant: "default",
          title: "Invitation accepted successfully",
        });

        router.replace(`/project/${projectId}/overiew`);
      })
      .catch((err) => {
        toast({ variant: "destructive", title: err.message });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Button
      className="rounded-md"
      size="lg"
      onClick={handleAccept}
      disabled={isLoading}
      type="button"
    >
      Accept invitation
      <MoonLoader
        size={20}
        color="white"
        className="ml-2 text-white"
        loading={isLoading}
      />
    </Button>
  );
};
