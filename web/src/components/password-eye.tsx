import React from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

type Props = {
  isVisible: boolean;
  onClick: () => void;
};

export const PasswordEye = (props: Props) => {
  const { isVisible, onClick } = props;
  return (
    <button
      type="button"
      className="flex items-center justify-center w-[25px] h-[25px]"
      onClick={onClick}
    >
      {isVisible ? (
        <IoEyeOff
          size={25}
          variant="Bold"
          className="text-black dark:text-white text-[20px] px-[2px]"
        />
      ) : (
        <IoEye
          size={25}
          variant="Bold"
          className="text-black dark:text-white text-[20px] px-[2px]"
        />
      )}
    </button>
  );
};
