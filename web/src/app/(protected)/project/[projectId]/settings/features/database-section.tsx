"use client";

import databases from "@/data/databases.json";
import { TitleSection } from "@/app/(protected)/account/features/title-section";
import { Fragment, useState } from "react";
import { RippleCard } from "@/components/ripple-card";
import { cn } from "@/lib/utils";
import { TickCircle } from "iconsax-react";
import { useProjectStore } from "../../../store/project-store";
import Image from "next/image";
import CustomInput from "@/components/custom-input";
import { PasswordEye } from "@/components/password-eye";


type Keys = keyof DatabaseConfig;

type Props = {};
export const DatabaseSection = (props: Props) => {
  const { project, setProject } = useProjectStore();

  const config = project?.databaseConfig!;

  const [isVisible, setIsVisible] = useState<Keys[]>([]);

  console.log(project);

  const dbImage = databases.find(
    (d) => d.name.toLowerCase() === project?.database.toLowerCase()
  );

  const updateVisible = (value: Keys) => {
    const arr = [...isVisible];
    const inx = arr.indexOf(value);

    if (inx === -1) setIsVisible([...arr, value]);
    else {
      arr.splice(inx, 1);

      setIsVisible(arr);
    }
  };

  const getValue = (name: Keys) => {
    const inx = isVisible.indexOf(name);

    if (inx !== -1) return config[name];

    return "*******************";
  };

  const handleSubmit = () => {};
  return (
    <Fragment>
      <hr className="h-[1px] bg-slate-100 dark:bg-neutral-800 border-0 outline-none my-8" />
      <TitleSection
        title="Database"
        subtitle="This information are credentials used to connect to your database"
        classes={{ left: { root: "lg:w-[50%]" } }}
      >
        <form onSubmit={handleSubmit} className="space-y-6 w-full lg:w-[100%]">
          <RippleCard
            className={cn(
              "relative border-[1.5px] w-full h-[100px] shrink-0 rounded-md flex flex-col justify-center items-center transition-all duration-300 border-indigo-600 "
            )}
          >
            <div className="flex flex-col justify-center items-center relative">
              <Image
                src={dbImage?.url!}
                alt=""
                width={40}
                height={40}
                className="h-[40px] w-[40px]"
              />
              <p className="">{dbImage?.name}</p>
            </div>

            <div className="absolute top-0 right-0">
              <TickCircle variant="Bold" className="text-indigo-600" />
            </div>
          </RippleCard>

          <CustomInput
            label="Database name"
            name="databaseName"
            type="text"
            disabled
            readOnly
            value={getValue("name")}
            endIcon={
              <PasswordEye
                isVisible={isVisible.indexOf("name") !== -1}
                onClick={() => updateVisible("name")}
              />
            }
          />

          <CustomInput
            label="Database host"
            name="host"
            type="text"
            readOnly
            disabled
            value={getValue("host")}
            endIcon={
              <PasswordEye
                isVisible={isVisible.indexOf("host") !== -1}
                onClick={() => updateVisible("host")}
              />
            }
          />

          {config.dbType !== "mongodb" ? (
            <CustomInput
              label="Database port"
              name="port"
              type="text"
              disabled
              readOnly
              value={getValue("port")}
              endIcon={
                <PasswordEye
                  isVisible={isVisible.indexOf("port") !== -1}
                  onClick={() => updateVisible("port")}
                />
              }
            />
          ) : null}

          <CustomInput
            label="Database username"
            name="username"
            type="text"
            disabled
            readOnly
            value={getValue("username")}
            endIcon={
              <PasswordEye
                isVisible={isVisible.indexOf("username") !== -1}
                onClick={() => updateVisible("username")}
              />
            }
          />
          <CustomInput
            label="Database password"
            name="password"
            type="text"
            disabled
            readOnly
            value={getValue("password")}
            endIcon={
              <PasswordEye
                isVisible={isVisible.indexOf("password") !== -1}
                onClick={() => updateVisible("password")}
              />
            }
          />
        </form>
      </TitleSection>
    </Fragment>
  );
};
