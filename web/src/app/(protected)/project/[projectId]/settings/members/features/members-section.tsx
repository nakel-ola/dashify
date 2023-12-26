"use client";

import { TitleSection } from "@/app/(protected)/account/features/title-section";
import { Button } from "@/components/ui/button";
import { Add, Trash } from "iconsax-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { RippleCard } from "@/components/ripple-card";
import { InvitationModel } from "./invitation-model";
import { useMemo, useState } from "react";
import { MemberDeleteModel } from "./member-delete-model";
import { useProjectStore } from "@/app/(protected)/project/store/project-store";
import { formatDistance } from "date-fns";
import { TableCard } from "./table-card";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { deleteMember } from "../../services/delete-member";

type Props = {};
export const MembersSection = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { project } = useProjectStore();

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const members = useMemo(() => project?.members ?? [], [project?.members]);

  const [memberId, setMemberId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteClick = (id: string) => setMemberId(id);

  const data = members.map((member) => ({
    uid: member.uid,
    role: member.role,
    joined: formatDistance(new Date(member.createdAt), new Date(), {
      addSuffix: true,
    }),
    email: member.email,
    photoUrl: member.photoUrl,
    name: member.lastName + " " + member.firstName,
  }));

  const items = [
    ...data.map(({ uid, name, photoUrl, email, role, joined }) => [
      {
        children: (
          <div className="flex items-center gap-2">
            <Avatar fallback={name} className="h-[35px] w-[35px]">
              <AvatarImage src={photoUrl} />
            </Avatar>

            <div className="">
              <p className="capitalize text-black dark:text-white">{name}</p>
              <p className="text-gray-dark dark:text-gray-light">{email}</p>
            </div>
          </div>
        ),
        name: "Name",
        type: "head" as const,
      },
      {
        children: (
          <p className="text-black dark:text-white capitalize">{role}</p>
        ),
        name: "Role",
        type: "content" as const,
      },
      {
        children: (
          <p className="text-black dark:text-white lowercase">{joined}</p>
        ),
        name: "Joined",
        type: "content" as const,
      },
      {
        children: (
          <RippleCard
            Component="button"
            onClick={() => handleDeleteClick(uid)}
            className="w-[35px] h-[35px] text-black dark:text-white bg-slate-100/50 dark:bg-slate-100/10 flex items-center justify-center transition-transform rounded-full"
          >
            <Trash className="text-red-500" variant="Bold" size={20} />
          </RippleCard>
        ),
        className: "text-right !w-[80px]",
        type: "content" as const,
      },
    ]),
  ];

  const onDeleteClick = async () => {
    if (!project?.projectId || !memberId) return;

    setIsLoading(true);

    deleteMember({
      memberId,
      projectId: project.projectId,
    })
      .then(async () => {
        await queryClient.invalidateQueries({
          queryKey: ["project", project?.projectId],
        });
        setMemberId(null);

        toast({
          variant: "default",
          title: "Revoke invite successfully",
        });
      })
      .catch((err) => {
        toast({ variant: "destructive", title: err.message });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div>
      <TitleSection
        title="Project members"
        subtitle="Project members can be given access to data in the project. Assign access levels for each member below."
        classes={{
          root: "justify-between",
          left: { root: "lg:w-[50%]" },
          right: "w-fit",
        }}
      >
        <div className="flex flex-col lg:items-end">
          <Button
            className="flex gap-2 rounded-md"
            onClick={() => setIsOpen(true)}
          >
            <Add />
            Invite project members
          </Button>

          <p className="lg:text-end mt-5  text-lg">
            {" "}
            <strong>{members.length}</strong> members
          </p>
        </div>
      </TitleSection>

      <TableCard
        head={[
          {
            name: "Name",
          },
          {
            name: "Role",
          },
          {
            name: "Joined",
          },
          {
            name: "",
            className: "text-right !w-[80px]",
          },
        ]}
        data={items}
      />

      <InvitationModel open={isOpen} onClose={() => setIsOpen(false)} />

      <MemberDeleteModel
        open={!!memberId}
        user={memberId ? data.find((value) => value.uid === memberId)! : null}
        onClose={() => setMemberId(null)}
        onDeleteClick={onDeleteClick}
        isInvitation={false}
        isLoading={isLoading}
      />
    </div>
  );
};
