import { iconNames } from "@/data/iconNames";
import { convertCamelCaseToWords } from "@/lib/convertCamelCaseToWords";
import { SearchNormal } from "iconsax-react";
import { matchSorter } from "match-sorter";
import React, { useState } from "react";
import { Icons } from "./Icons";

const icons = iconNames
  .map((iconName) => ({
    title: convertCamelCaseToWords(iconName),
    name: iconName,
  }))
  .sort((a, b) => a.title.localeCompare(b.title));

type Props = {
  onIconClick: (name: string) => void;
};
export const IconsListCard = (props: Props) => {
  const { onIconClick } = props;
  const [input, setInput] = useState("");
  let filteredIcons = input
    ? matchSorter(icons, input.replace(/\s+/, "-"), { keys: ["title"] })
    : icons;

  return (
    <div className="">
      <div className="flex items-center bg-project-hover dark:bg-project-hover-dark p-1.5 rounded-md">
        <SearchNormal
          size={20}
          className="text-project-gray-dark dark:text-project-gray-light"
        />
        <input
          type="text"
          className="bg-transparent border-0 outline-0 ml-2 w-full text-project-text-color dark:text-project-text-color-dark"
          placeholder="Search some data"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-5 h-[70vh] overflow-y-scroll">
        {filteredIcons.map(({ name, title }, index) => (
          <div key={index} className="">
            <button
              className="h-[70px] w-[70px] rounded-lg m-1 flex flex-col items-center justify-center hover:scale-105 active:scale-95"
              onClick={() => onIconClick(name)}
            >
              <Icons iconName={name} size={30} variant="Bold" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
