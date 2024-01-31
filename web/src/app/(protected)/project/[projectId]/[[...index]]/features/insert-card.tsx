import { Button } from "@/components/ui/button";
import { useQueries } from "../../../hooks/use-queries";
import { useProjectStore } from "../../../store/project-store";
import { useRowAddStore } from "../../../store/row-add-store";
import { Add } from "iconsax-react";

type Props = {};
export const InsertCard = (props: Props) => {
  const { setRow } = useRowAddStore();

  const [{ projectId, pageName }] = useQueries();

  const sortedFields = useProjectStore((store) => store.getFields(pageName));
  return (
    <div className="">
      <Button
        className="rounded-md"
        onClick={() =>
          setRow({
            field: sortedFields,
            tableName: pageName,
            projectId,
          })
        }
      >
        <Add className="mr-2" />
        Insert
      </Button>
    </div>
  );
};
