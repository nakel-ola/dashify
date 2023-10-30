import { MoonLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <MoonLoader color="#4f46e5" />

      <p className="text-3xl py-5 font-medium">Please wait while we validate</p>
    </div>
  );
}
