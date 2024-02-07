import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MoonLoader } from "react-spinners";
import { useRowAddStore } from "../../../store/row-add-store";
import { Fragment, useState } from "react";
import { PreviewTable } from "./preview-table";
import { Separator } from "@/components/ui/separator";
import { CsvUploadCard, type UploadType } from "./csv-upload-card";
import { findDifferentValue } from "../utils/find-different-value";
import { addNewDocuments } from "../../../services/add-new-documents";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { arrangeValues } from "../../../utils/arrange-values";
import { useRefetchCollections } from "../../../hooks/use-refetch-collections";

type Props = {
  queryKey: any[];
  isMongodb: boolean;
};
export const CSVAddRowsCard = (props: Props) => {
  const { queryKey, isMongodb } = props;
  const { row, setRow } = useRowAddStore();

  const [isLoading, setIsLoading] = useState(false);

  const [upload, setUpload] = useState<UploadType>({
    text: "",
    json: [],
    header: [],
    file: null,
  });

  const { refetch } = useRefetchCollections();

  const queryClient = useQueryClient();

  const handleClose = () => {
    if (isLoading) return;
    setRow(null);
    setUpload({
      text: "",
      json: [],
      header: [],
      file: null,
    });
  };

  const updateSelected = (index: number) => {
    let header = [...upload.header];

    header[index].selected = !header[index].selected;

    setUpload({
      ...upload,
      header,
    });
  };

  const getErrors = () => {
    if (!upload.file || !row) return [];

    let results = [];

    const fieldsName = row.field.map((value) => value.name);

    if (isMongodb) return [];

    const notFound = findDifferentValue(
      fieldsName,
      upload.header.map((h) => h.name)
    );

    if (notFound.length > 0) {
      const message = `This CSV cannot be imported  into your able due to incompatible headers: \nThe column ${notFound.join(
        ", "
      )} are not present in your table`;
      results.push(message);
    }
    return results;
  };

  const handleSubmit = () => {
    if (!row || !upload.file) return;
    setIsLoading(true);

    const fieldNames = upload.header
      .map(({ name, selected }) => (selected ? name : null))
      .filter((value) => value !== null) as string[];

    const arrangedItems = arrangeValues(upload.json, fieldNames);

    const values = arrangedItems.map((arrangedItem) =>
      Object.values(arrangedItem)
    );

    addNewDocuments({
      projectId: row.projectId,
      collectionName: row.tableName,
      fieldNames,
      values,
    })
      .then(async () => {
        toast.success(`Rows added successfully`);
        if (row?.field.length === 0 || isMongodb) await refetch();
        await queryClient.invalidateQueries({ queryKey });

        handleClose();
      })
      .catch((err: any) => {
        toast.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Sheet open={row?.type === "csv"} onOpenChange={() => handleClose()}>
      <SheetContent className="sm:!w-[700px] sm:max-w-md !p-0">
        <SheetHeader className="p-6 border-b-[1.5px] border-slate-100 dark:border-neutral-800">
          <SheetTitle>
            Add data to
            <span className="bg-slate-100 dark:bg-neutral-800 rounded-md px-2.5 py-1.5 ml-2">
              {row?.tableName}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="h-full">
          <div className="h-[calc(100%-140px)] overflow-y-scroll py-6">
            <div className="px-6 pr-3">
              <p className="text-xs mt-5 text-gray-dark dark:text-gray-light">
                Upload a CSV file. The first row should be the headers of the
                table, and your headers should not include any special
                characters other than hyphens (-) or underscores (-).
              </p>

              <p className="text-xs mt-2 text-gray-dark dark:text-gray-light">
                Tip: Datetime columns should be formatted as YYYY-MM-DD HH:mm:ss
              </p>
            </div>

            <div className="mt-5 px-6 pr-3">
              <CsvUploadCard
                onUploadChange={setUpload}
                upload={upload}
                disabled={isLoading}
              />
            </div>

            {upload.file ? (
              <Fragment>
                <Separator className="my-8 w-full" />
                <PreviewTable
                  items={upload.json}
                  header={upload.header}
                  tableName={row?.tableName!}
                  errors={getErrors()}
                  updateSelected={updateSelected}
                />
              </Fragment>
            ) : null}
          </div>

          <div className="p-6 py-3 border-t-[1.5px] border-slate-100 dark:border-neutral-800 space-x-6 flex">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-slate-200 dark:border-neutral-800 text-gray-dark dark:text-gray-light hover:bg-slate-100 hover:dark:bg-neutral-800 ml-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                getErrors().length > 0 || upload.json.length === 0 || isLoading
              }
              onClick={handleSubmit}
              className=""
            >
              Import data
              <MoonLoader
                size={20}
                color="white"
                className="ml-2 text-white"
                loading={isLoading}
              />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
