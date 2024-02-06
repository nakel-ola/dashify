import { cn } from "@/lib/utils";
import { DocumentText } from "iconsax-react";
import { ChangeEvent, Fragment, useState } from "react";
import { parseCSV } from "../../../services/parseCSV";
import { toast } from "sonner";

export type UploadType = {
  text: string;
  header: string[];
  json: { [key: string]: any }[];
  file: File | null;
};

type Props = {
  onUploadChange(value: UploadType): void;
  upload: UploadType;
};

export const CsvUploadCard = (props: Props) => {
  const { onUploadChange, upload } = props;
  const [isHovering, setIsHovering] = useState(false);

  const { text, file } = upload;

  const handleUpload = async (file: File) => {
    const isImage = ["csv"].find((format) =>
      file.name.toLowerCase().endsWith(format.toLowerCase())
    );

    if (isImage) {
      handleConvert(file);
    } else {
      toast.warning("File not supported. Only csv");
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

          onUploadChange({
            file,
            text: csvText,
            json: csvData.results,
            header: csvData.header,
          });
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
        <div className="flex h-[130px] flex-col items-center justify-center self-stretch border-[1.5px] py-0 rounded-[10px] cursor-pointer overflow-hidden border-slate-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <DocumentText size={25} />
            <p className="text-sm">{file.name}</p>
          </div>

          <button
            onClick={() =>
              onUploadChange({ text: "", json: [], file: null, header: [] })
            }
            className="text-sm mt-3 p-1 px-2.5 text-black dark:text-white bg-slate-200/60 dark:bg-neutral-800 rounded-lg group flex items-center gap-2 disabled:hover:bg-transparent disabled:hover:dark:bg-transparent disabled:opacity-60 hover:scale-105 active:scale-95 transition-all duration-300 border-[1.5px] border-slate-100 dark:border-neutral-800"
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
              "flex h-[130px] flex-col items-center justify-center self-stretch border-[1.5px] py-0 rounded-[10px] border-dashed cursor-pointer overflow-hidden",
              isHovering
                ? "border-indigo-600 bg-indigo-600/10"
                : "border-slate-200 dark:border-neutral-800 bg-transparent"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="51"
              height="50"
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
            <p className="text-brand text-sm not-italic font-medium leading-6">
              Drag and drop, or{" "}
              <span className="text-indigo-600 font-medium">browse</span> your
              files
            </p>
          </div>
        </label>
      )}
    </Fragment>
  );
};
