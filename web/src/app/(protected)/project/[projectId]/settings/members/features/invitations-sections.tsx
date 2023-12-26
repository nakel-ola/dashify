"use client";

import { TitleSection } from "@/app/(protected)/account/features/title-section";
import { Trash } from "iconsax-react";
import { RippleCard } from "@/components/ripple-card";
import { useMemo, useState } from "react";
import { MemberDeleteModel } from "./member-delete-model";
import { useProjectStore } from "@/app/(protected)/project/store/project-store";
import { formatDistance } from "date-fns";
import { TableCard } from "./table-card";
import { useQueryClient } from "@tanstack/react-query";
import { deleteInviteMember } from "../../services/delete-invite-member";
import { useToast } from "@/components/ui/use-toast";

export const InvitationsSection = () => {
  const project = useProjectStore((state) => state.project!);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [inviteId, setInviteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteClick = (id: string) => setInviteId(id);

  const invitations = useMemo(
    () => project?.invitations ?? [],
    [project?.invitations]
  );

  const data = invitations.map((invitation) => ({
    id: invitation.id,
    role: invitation.role,
    invitedDate: formatDistance(new Date(invitation.createdAt), new Date(), {
      addSuffix: true,
    }),
    email: invitation.email,
  }));

  const items = [
    ...data.map(({ email, id, invitedDate, role }) => [
      {
        children: <p className="text-black dark:text-white">{email}</p>,
        name: "Email",
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
          <p className="text-black dark:text-white lowercase">{invitedDate}</p>
        ),
        name: "Invited",
        type: "content" as const,
      },
      {
        children: (
          <RippleCard
            Component="button"
            onClick={() => handleDeleteClick(id)}
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
    if (!project?.projectId || !inviteId) return;

    setIsLoading(true);

    deleteInviteMember({
      inviteId,
      projectId: project.projectId,
    })
      .then(async () => {
        await queryClient.invalidateQueries({
          queryKey: ["project", project?.projectId],
        });
        setInviteId(null);

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
        title="Project invitations"
        subtitle="Invitations that have been sent, but not accepted yet. Changed your mind? Pending invitation may be revoked."
        classes={{
          root: "justify-between",
          left: { root: "lg:w-[50%]" },
          right: "w-fit",
        }}
      />

      <TableCard
        head={[
          {
            name: "Email",
          },
          {
            name: "Role",
          },
          {
            name: "Invited",
          },
          {
            name: "",
            className: "text-right !w-[80px]",
          },
        ]}
        data={items}
      />

      <MemberDeleteModel
        open={!!inviteId}
        user={inviteId ? data.find((value) => value.id === inviteId)! : null}
        isInvitation
        onClose={() => setInviteId(null)}
        onDeleteClick={onDeleteClick}
        isLoading={isLoading}
      />
    </div>
  );
};
