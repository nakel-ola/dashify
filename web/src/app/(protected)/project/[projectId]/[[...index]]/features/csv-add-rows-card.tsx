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

type Props = {};
export const CSVAddRowsCard = (props: Props) => {
  const { row, setRow } = useRowAddStore();

  const [upload, setUpload] = useState<UploadType>({
    text: "",
    json: [],
    header: [],
    file: null,
  });

  const handleClose = () => {
    setRow(null);
  };

  const getErrors = () => {
    if (!upload.file || !row) return [];

    let results = [];

    const fieldsName = row.field.map((value) => value.name);

    const notFound = findDifferentValue(fieldsName, upload.header);

    if (notFound.length > 0) {
      const message = `This CSV cannot be imported  into your able due to incompatible headers: \nThe column ${notFound.join(
        ", "
      )} are not present in your table`;
      results.push(message);
    }
    return results;
  };

  const handleSubmit = () => {};
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
              <CsvUploadCard onUploadChange={setUpload} upload={upload} />
            </div>

            {upload.file ? (
              <Fragment>
                <Separator className="my-8 w-full" />
                <PreviewTable
                  items={upload.json}
                  header={upload.header}
                  tableName={row?.tableName!}
                  errors={getErrors()}
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
              disabled={getErrors().length > 0 || upload.json.length === 0}
              onClick={handleSubmit}
              className=""
            >
              Import data
              <MoonLoader
                size={20}
                color="white"
                className="ml-2 text-white"
                loading={false}
              />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
