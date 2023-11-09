import { CloseCircle } from "iconsax-react";

export const FailedCard = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <CloseCircle className="text-red-500 w-24 h-24" />

      <p className="text-black dark:text-white text-center text-[37.279px]  font-bold leading-[128%]">
        Email Verification Failed
      </p>

      <p className="text-3xl  pt-2 text-black dark:text-white text-center text-[15.977px]  font-[250] leading-[140%]">
        Email verification failed. Please try again later
      </p>
    </div>
  );
};
