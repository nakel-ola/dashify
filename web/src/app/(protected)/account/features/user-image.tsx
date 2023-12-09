"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toBase64 } from "@/lib/to-base64";
import Image from "next/image";
import { ChangeEvent, Fragment, useState } from "react";

type UserImageProps = {
  onChange: (value: File) => void;
  value: any;
};

export const UserImage = (props: UserImageProps) => {
  const { onChange, value } = props;
  const [url, setUrl] = useState<string | null>(null);

  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = e.target.files;
      onChange(fileList[0]);
      const newUrl = await toBase64(fileList[0]);
      setUrl(newUrl.toString());
    }
  };
  return (
    <Fragment>
      <input
        type="file"
        id="image"
        name="image"
        accept="image/*"
        multiple={false}
        className="hidden"
        onChange={(e) => onAvatarChange?.(e)}
      />
      <div className="flex items-center gap-5">
        <Avatar className="h-[100px] w-[100px] p-0">
          <AvatarImage
            src={url ?? value}
            alt=""
            className="h-full w-full !object-cover"
          />
          <AvatarFallback className="p-0">
            <Image
              src="/default-avatar.svg"
              alt=""
              width={200}
              height={200}
              className="h-full w-full object-cover grayscale dark:grayscale-0 dark:invert"
            />
          </AvatarFallback>
        </Avatar>

        <div className="">
          <label
            htmlFor="image"
            className="bg-slate-100 dark:bg-neutral-800 rounded-lg px-2 py-2 hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
          >
            {" "}
            Change image
          </label>

          <p className="text-sm mt-3">JPG, GIF or PNG. 1MB max.</p>
        </div>
      </div>
    </Fragment>
  );
};
