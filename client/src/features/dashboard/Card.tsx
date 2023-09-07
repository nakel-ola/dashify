/* eslint-disable @next/next/no-img-element */
import { RippleCard } from "@/components/RippleCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import databases from "@/data/databases.json";
import { useRouter } from "next/router";
import React from "react";

type CardProps = Projects & {};
export const Card = (props: CardProps) => {
  const { id, database, name, users, projectId, logo } = props;

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
        <Avatar className="h-[40px] w-[40px]">
          <AvatarImage src={logo!} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>

        <div className="pl-2">
          <p className="text-black dark:text-white">{name}</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {projectId}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="h-[40px] w-[40px] bg-slate-100 dark:bg-neutral-800 flex items-center justify-center rounded-full">
          <img src={dbImage?.url} alt="" className="h-[80%] w-[80%]" />
        </div>

        <div className="flex items-center -space-x-5">
          {users.map((user, index) => (
            <Avatar
              key={index}
              className="h-[40px] w-[40px] border-2 border-slate-200 dark:border-neutral-800"
            >
              <AvatarImage src={user.photoUrl ?? ""} />
              <AvatarFallback>
                {user.lastName + " " + user.firstName}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </RippleCard>
  );
};
