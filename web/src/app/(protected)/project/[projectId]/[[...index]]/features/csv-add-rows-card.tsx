import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MoonLoader } from "react-spinners";
import { useRowAddStore } from "../../../store/row-add-store";
import { ChangeEvent, Fragment, useState } from "react";
import { toBase64 } from "@/lib/to-base64";
import { cn } from "@/lib/utils";
import { parseCSV } from "../../../services/parseCSV";
import { DocumentText } from "iconsax-react";

type UploadType = {
  text: string;
  json: { [key: string]: any }[];
  file: File | null;
};
type Props = {};
export const CSVAddRowsCard = (props: Props) => {
  const { row, setRow } = useRowAddStore();

  const [upload, setUpload] = useState<UploadType>({
    text: "",
    json: [],
    file: null,
  });

  const handleClose = () => {
    setRow(null);
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
          <div className="h-[calc(100%-140px)] overflow-y-scroll py-6 px-6">
            <Tabs defaultValue="upload" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload CSV</TabsTrigger>
                <TabsTrigger value="paste">Paste text</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <p className="text-xs mt-5 text-gray-dark dark:text-gray-light">
                  Upload a CSV or TSV file. The first row should be the headers
                  of the table, and your headers should not include any special
                  characters other than hyphens (-) or underscores (-).
                </p>

                <p className="text-xs mt-2 text-gray-dark dark:text-gray-light">
                  Tip: Datetime columns should be formatted as YYYY-MM-DD
                  HH:mm:ss
                </p>

                <div className="mt-5">
                  <UploadCard onUploadChange={setUpload} upload={upload} />
                </div>
              </TabsContent>
              <TabsContent value="paste">
                <p className="text-xs mt-5 text-gray-dark dark:text-gray-light">
                  Copy a table from a spreadsheet program such as Google Sheets
                  or Excel and paste it in the field below. The first row should
                  be the headers of the table, and your headers should not
                  include any special characters other than hyphens (-) or
                  underscores (-).
                </p>

                <p className="text-xs mt-2 text-gray-dark dark:text-gray-light">
                  Tip: Datetime columns should be formatted as YYYY-MM-DD
                  HH:mm:ss
                </p>

                <Textarea rows={8} className="mt-5 bg-slate-100/50" />
              </TabsContent>
            </Tabs>
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
              // disabled={!isValid || isDisabled()}
              // onClick={handleSubmit}
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

type UploadCardProps = {
  onUploadChange(value: UploadType): void;
  upload: UploadType;
};

const UploadCard = (props: UploadCardProps) => {
  const { onUploadChange, upload } = props;
  const [isHovering, setIsHovering] = useState(false);

  const { text, file, json } = upload;

  const handleUpload = async (file: File) => {
    const isImage = ["csv"].find((format) =>
      file.name.toLowerCase().endsWith(format.toLowerCase())
    );

    if (isImage) {
      handleConvert(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);

    const files = e.dataTransfer.files;

    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleConvert = async (file: File) => {
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        if (reader.result) {
          const csvText = reader.result.toString();
          const csvData = await parseCSV(csvText);

          onUploadChange({ file, text: csvText, json: csvData });
        }
      } catch (error) {
        console.error("Error parsing CSV file:", error);
      }
    };

    reader.readAsText(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <Fragment>
      <input
        type="file"
        id="input-file-upload"
        className="hidden"
        multiple={false}
        onChange={handleChange}
      />

      {text && file ? (
        <div className="flex h-[140px] flex-col items-center justify-center self-stretch border-[1.5px] py-0 rounded-[10px] cursor-pointer overflow-hidden border-slate-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <DocumentText size={25} />
            <p className="text-sm">{file.name}</p>
          </div>

          <button
            onClick={() => onUploadChange({ text: "", json: [], file: null })}
            className=" mt-3 p-1 px-2.5 text-black dark:text-white bg-slate-200/60 dark:bg-neutral-800 rounded-lg group flex items-center gap-2 disabled:hover:bg-transparent disabled:hover:dark:bg-transparent disabled:opacity-60 hover:scale-105 active:scale-95 transition-all duration-300 border-[1.5px] border-slate-100 dark:border-neutral-800"
          >
            Remove file
          </button>
        </div>
      ) : (
        <label id="label-file-upload" htmlFor="input-file-upload">
          <div
            onDragOver={handleDragOver}
            onDragLeave={() => setIsHovering(false)}
            onDrop={handleDrop}
            onDragStart={() => {}}
            className={cn(
              "flex h-[180px] flex-col items-center justify-center self-stretch border-[1.5px] py-0 rounded-[10px] border-dashed cursor-pointer overflow-hidden",
              isHovering
                ? "border-indigo-600 bg-indigo-600/10"
                : "border-slate-200 dark:border-neutral-800 bg-transparent"
            )}
          >
            <Fragment>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="71"
                height="70"
                viewBox="0 0 71 70"
                fill="none"
              >
                <path
                  d="M20.9167 29.167V26.2503C20.9167 18.1962 27.4458 11.667 35.5 11.667C43.5542 11.667 50.0833 18.1962 50.0833 26.2503V29.167C56.5267 29.167 61.75 34.3903 61.75 40.8337C61.75 45.152 59.4038 49.0248 55.9167 51.042M20.9167 29.167C14.4733 29.167 9.25 34.3903 9.25 40.8337C9.25 45.152 11.5962 49.0248 15.0833 51.042M20.9167 29.167C22.1792 29.167 23.3948 29.3675 24.5335 29.7385M35.5 35.0003V61.2503M35.5 35.0003L44.25 43.7503M35.5 35.0003L26.75 43.7503"
                  stroke="#8F8F8F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-brand text-base not-italic font-medium leading-6">
                Drag and drop, or{" "}
                <span className="text-indigo-600 font-medium">browse</span> your
                files
              </p>
            </Fragment>
          </div>
        </label>
      )}

      {/* <Textarea
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-5 bg-slate-100"
              /> */}
    </Fragment>
  );
};
