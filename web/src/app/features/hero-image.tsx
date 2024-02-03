import Image from "next/image";

export const HeroImage = () => {
  return (
    <div className="mt-10 lg:mt-20 relative p-2 bg-slate-100 dark:bg-neutral-800 max-w-5xl rounded-2xl mx-5">
      <Image
        src="/images/dashify-dark.webp"
        alt="Hero image Dark mode"
        width={1000}
        height={500}
        className="relative transition-opacity rounded-xl hidden dark:block z-10"
      />
      <Image
        src="/images/dashify-light.webp"
        alt="Hero image Light mode"
        width={1000}
        height={500}
        className="relative transition-opacity rounded-xl border-[1.5px]  shadow-md dark:border-gray-700 border-gray-300 dark:hidden"
      />
    </div>
  );
};
