"use client";
import { RippleCard } from "@/components/ripple-card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import databases from "@/data/databases.json";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type Props = Projects & {};
export const ProjectCard = (props: Props) => {
  const { id, database, name, members, projectId, logo } = props;

  const router = useRouter();

  const dbImage = databases.find(
    (d) => d.name.toLowerCase() === database.toLowerCase()
  );

  return (
    <RippleCard
      onClick={() => router.push(`/project/${projectId}/overview`)}
      className="cursor-pointer border-[1.5px] rounded-lg h-[180px] bg-white dark:bg-dark border-slate-200 dark:border-neutral-800 py-2 px-3 flex flex-col hover:scale-[1.02] active:scale-[0.99]"
    >
      <div className="flex items-center">
        <Avatar className="h-10 w-10" fallback={name.substring(0, 2)}>
          <AvatarImage src={logo!} />
        </Avatar>

        <div className="pl-2">
          <p className="text-black dark:text-white">{name}</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {projectId}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <Image
          src={dbImage?.url!}
          alt=""
          width={40}
          height={40}
          className="h-[40px] w-[40px]"
        />

        <div className="flex items-center -space-x-5">
          {members.map((member, index) => (
            <Avatar
              key={index}
              fallback={member.lastName.charAt(0) + member.firstName.charAt(0)}
              className="h-[40px] w-[40px] border-2 border-slate-200 dark:border-neutral-800"
            >
              <AvatarImage src={member.photoUrl ?? ""} />
            </Avatar>
          ))}
        </div>
      </div>
    </RippleCard>
  );
};
