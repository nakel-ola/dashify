"use client";

import { TitleSection } from "@/app/(protected)/account/features/title-section";
import { RippleCard } from "@/components/ripple-card";
import { Button } from "@/components/ui/button";
import { Add, Trash } from "iconsax-react";
import { useMemo, useState } from "react";
import { DeleteModel } from "./delete-model";
import { TokensModel } from "./tokens-model";
import { useProjectStore } from "@/app/(protected)/project/store/project-store";
import { formatDistance } from "date-fns";
import { TableCard } from "../../members/features/table-card";
import { deleteTokenFromProject } from "../../services/delete-token-from-project";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {};
export const TokensSection = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { project } = useProjectStore();

  const queryClient = useQueryClient();

  const tokens = useMemo(() => project?.tokens ?? [], [project?.tokens]);

  const [tokenId, setTokenId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteClick = (id: string) => setTokenId(id);

  const data = tokens.map((token) => ({
    id: token.id,
    name: token.name,
    permission: token.permission,
    createdAt: formatDistance(new Date(token.createdAt), new Date(), {
      addSuffix: true,
    }),
  }));

  const items = [
    ...data.map(({ id, createdAt, name, permission }) => [
      {
        children: (
          <div className="">
            <p className="text-black dark:text-white">{name}</p>
          </div>
        ),
        name: "Name",
        type: "head" as const,
      },
      {
        children: (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-neutral-800 rounded w-fit px-2">
            <p className="uppercase text-black dark:text-white">{permission}</p>
          </div>
        ),
        name: "Permissions",
        type: "content" as const,
      },
      {
        children: (
          <div className="">
            <p className="text-black dark:text-white">{createdAt}</p>
          </div>
        ),
        name: "Created",
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

  const onDeleteClick = () => {
    if (!project?.projectId || !tokenId) return;

    setIsLoading(true);

    deleteTokenFromProject({ tokenId, projectId: project?.projectId })
      .then(async () => {
        setTokenId(null);

        await queryClient.invalidateQueries({
          queryKey: ["project", project?.projectId],
        });

        toast.success("Delete token successfully");
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="">
      <TitleSection
        title="Tokens"
        subtitle="Tokens are used to authenticate apps and scripts to access project data."
        classes={{
          root: "justify-between",
          left: { root: "lg:w-[50%]" },
          right: "w-fit",
        }}
      >
        <Button
          className="flex gap-2 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          <Add />
          Add API token
        </Button>
      </TitleSection>

      <TableCard
        head={[
          {
            name: "Name",
          },
          {
            name: "Permission",
          },
          {
            name: "Created",
          },
          {
            name: "",
            className: "text-right !w-[80px]",
          },
        ]}
        data={items}
      />

      <TokensModel open={isOpen} onClose={() => setIsOpen(false)} />

      <DeleteModel
        open={!!tokenId}
        isToken
        onClose={() => setTokenId(null)}
        onDeleteClick={onDeleteClick}
        isLoading={isLoading}
      />
    </div>
  );
};
