import Image from "next/image";

export const DatabaseSection = () => {
  return (
    <div className="page-max-width flex flex-col lg:flex-row items-center justify-center lg:justify-between px-5 lg:px-10 pb-20 max-w-5xl">
      <div className="mb-10 lg:mb-0">
        <h2 className="text-5xl font-bold tracking-tight text-black dark:text-white text-center lg:text-start">
          Connect with several database
        </h2>
        <p className="text-center lg:text-start text-black dark:text-white">
          Seamlessly bridge the gap between multiple databases, streamlining
          your data management process and allowing you to harness insights from
          diverse sources effortlessly.
        </p>
      </div>

      <div className="relative">
        <div className="relative h-[350px] w-[350px] border border-neutral-300 rounded-full grid place-items-center">
          <div className="h-[70%] w-[70%] rounded-full border border-neutral-300 grid place-items-center">
            <div className="h-[60%] w-[60%] rounded-full border border-neutral-300  grid place-items-center">
              <Image
                src="/logo.png"
                width={80}
                height={80}
                alt="Dashify logo"
                className="h-20 w-auto"
              />
            </div>
          </div>
        </div>

        <div className="absolute top-14 bg-white h-[50px] w-[50px] rounded-full grid place-items-center shadow-lg">
          <Image
            src="/logos/CockroachDB.svg"
            alt="CockroachDB logo"
            width={50}
            height={50}
            className="w-[80%] h-[80%] object-contain"
          />
        </div>

        <div className="absolute top-52 left-12 bg-white  h-[50px] w-[50px] rounded-full grid place-items-center shadow-lg">
          <Image
            src="/logos/icons8-mongodb.svg"
            alt="CockroachDB logo"
            width={50}
            height={50}
            className="w-[80%] h-[80%] object-contain"
          />
        </div>

        <div className="absolute -bottom-4 left-36 bg-white  h-[50px] w-[50px] rounded-full grid place-items-center shadow-lg">
          <Image
            src="/logos/icons8-mysql.svg"
            alt="CockroachDB logo"
            width={50}
            height={50}
            className="w-[80%] h-[80%] object-contain"
          />
        </div>

        <div className="absolute bottom-32 right-8 bg-white  h-[50px] w-[50px] rounded-full grid place-items-center shadow-lg">
          <Image
            src="/logos/icons8-postgres.svg"
            alt="postgres logo"
            width={50}
            height={50}
            className="w-[80%] h-[80%] object-contain"
          />
        </div>
      </div>
    </div>
  );
};
