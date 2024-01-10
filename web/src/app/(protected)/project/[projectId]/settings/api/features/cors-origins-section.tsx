"use client";
import { TitleSection } from "@/app/(protected)/account/features/title-section";
import { RippleCard } from "@/components/ripple-card";
import { Button } from "@/components/ui/button";
import { Add, Trash } from "iconsax-react";
import { useMemo, useState } from "react";
import { CorsOriginModel } from "./cors-origin-model";
import { DeleteModel } from "./delete-model";
import { useProjectStore } from "@/app/(protected)/project/store/project-store";
import { formatDistance } from "date-fns";
import { TableCard } from "../../members/features/table-card";
import { cn } from "@/lib/utils";
import { deleteOriginFromProject } from "../../services/delete-origin-from-project";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type Props = {};
export const CorsOriginsSection = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [corsId, setCorsId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { project } = useProjectStore();

  const queryClient = useQueryClient();

  const corsOrigins = useMemo(
    () => project?.corsOrigins ?? [],
    [project?.corsOrigins]
  );

  const handleDeleteClick = (id: string) => setCorsId(id);

  const data = corsOrigins.map((corsOrigin) => ({
    id: corsOrigin.id,
    origin: corsOrigin.origin,
    permission: corsOrigin.permission,
    createdAt: formatDistance(new Date(corsOrigin.createdAt), new Date(), {
      addSuffix: true,
    }),
  }));

  const items = [
    ...data.map(({ id, createdAt, origin, permission }) => [
      {
        children: (
          <div className="">
            <p className="text-black dark:text-white break-all">{origin}</p>
          </div>
        ),
        name: "Origin",
        type: "head" as const,
      },
      {
        children: (
          <div
            className={cn(
              "flex items-center gap-2  rounded w-fit px-2",
              permission === "allow" ? "bg-green-500/30" : "bg-red-500/30"
            )}
          >
            <p className="uppercase text-black dark:text-white">{permission}</p>
          </div>
        ),
        name: "Permission",
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
    if (!project?.projectId || !corsId) return;

    setIsLoading(true);

    deleteOriginFromProject({ corsId, projectId: project?.projectId })
      .then(async () => {
        setCorsId(null);

        await queryClient.invalidateQueries({
          queryKey: ["project", project?.projectId],
        });

        toast.success("Removed origin successfully");
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="">
      <TitleSection
        title="CORS origins"
        subtitle="Hosts that can connect to the project API."
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
          Add CORS origin
        </Button>
      </TitleSection>

      <TableCard
        head={[
          {
            name: "Origin",
          },
          {
            name: "Credentials",
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

      <CorsOriginModel open={isOpen} onClose={() => setIsOpen(false)} />

      <DeleteModel
        open={!!corsId}
        onClose={() => setCorsId(null)}
        onDeleteClick={onDeleteClick}
        isLoading={isLoading}
      />
    </div>
  );
};
