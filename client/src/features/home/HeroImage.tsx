/* eslint-disable @next/next/no-img-element */


export const HeroImage = () => {
  return (
    <div className="mt-10 lg:mt-20 relative p-2 bg-slate-100 dark:bg-neutral-800 max-w-5xl rounded-2xl mx-5">
      <img
        className="relative transition-opacity rounded-xl hidden dark:block z-10"
        src="/images/dark-project-app-screenshot.png"
        alt="Hero image"
      />
      <img
        className="relative transition-opacity rounded-xl border-[1.5px]  shadow-md dark:border-gray-700 border-gray-300 dark:hidden"
        src="/images/project-app-screenshot.png"
        alt="Hero image"
      />
    </div>
  );
};
