import { useState } from "react";
import { refetchCollections } from "../services/refetch-collections";
import { useProjectStore } from "../store/project-store";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useRefetchCollections = () => {
  const { project } = useProjectStore();
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const refetch = async () => {
    if (!project) return;
    setIsLoading(true);

    const projectId = project.projectId;

    await refetchCollections({ projectId })
      .then(async (result) => {
        if (result.ok) {
          toast.success(
            `${
              project.database === "mongodb" ? "Collections" : "Tables"
            } refetched successfully`
          );

          await queryClient.invalidateQueries({
            queryKey: ["project", projectId],
          });
        } else {
          toast.error(result.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  return { isLoading, refetch };
};
