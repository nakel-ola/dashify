/* eslint-disable @next/next/no-img-element */
import PasswordEye from "@/components/PasswordEye";
import { RippleCard } from "@/components/RippleCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import databases from "@/data/databases.json";
import axios from "@/lib/axios";
import { nanoid } from "@/lib/nanoid";
import slugify from "@/lib/slugify ";
import { toBase64 } from "@/lib/toBase64";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { TickCircle } from "iconsax-react";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, Fragment, useState } from "react";
import { MoonLoader } from "react-spinners";
import { DatabaseCard } from "./DatabaseCard";

type CreateCardProps = {
  onClose(): void;
};

export type ImageType = {
  file: File | null;
  url: string | ArrayBuffer;
};

type FormType = {
  name: string;
  database: string | null;
  host: string;
  port?: number;
  databaseName: string;
  username: string;
  password: string;
};

const id = nanoid(5).toLowerCase();
export const CreateCard = (props: CreateCardProps) => {
  const { onClose } = props;

  const router = useRouter();

  const [form, setForm] = useState<FormType>({
    name: "",
    database: null,
    host: "",
    port: undefined,
    databaseName: "",
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [image, setImage] = useState<ImageType>({ file: null, url: "" });

  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["create-project"],
    mutationFn: async (data: any) => {
      const res = await axios.post("/projects", data);
      return res.data;
    },
  });

  const { database, databaseName, host, name, password, username, port } = form;

  const projectId = slugify(name) + "-" + id;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      await mutateAsync({
        projectId,
        name,
        database: database?.toLowerCase(),
        databaseConfig: {
          name: databaseName,
          host,
          port,
          username,
          password,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      router.push(`/project/${projectId}/overview`);
      onClose();
      setIsLoading(false);
    }
  };

  const onContinueClick = () => {
    if (active === 0) setActive(1);
  };

  const onCancelClick = () => {
    if (active === 0) onClose();
    else setActive(0);
  };

  const disableContinue = () => {
    const isSelected = databases.find(
      (d) => d.name.toLowerCase() === database?.toLowerCase()
    );

    if (name.length >= 3 && isSelected) return false;

    return true;
  };

  const disable = () => {
    const mustHavePort = database !== "mongodb" ? port : true;
    if (
      databaseName.length >= 3 &&
      host.length >= 5 &&
      mustHavePort &&
      password.length >= 8 &&
      username.length >= 3
    )
      return false;

    return true;
  };

  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = e.target.files;
      const newUrl = await toBase64(fileList[0]);
      setImage({ url: newUrl, file: fileList[0] });
    }
  };

  return (
    <>
      <div className="">
        <h2 className="font-sans text-4xl text-black dark:text-white font-semibold">
          Create a new dash
        </h2>
        <p className="text-gray-dark dark:text-gray-light">
          Fill in the details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {active === 0 ? (
          <Fragment>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-black dark:text-white font-sans"
              >
                Logo
              </label>

              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                multiple={false}
                className="hidden"
                onChange={(e) => onAvatarChange?.(e)}
              />

              <div className="flex items-center space-x-4 mt-2">
                <Avatar className="h-[60px] w-[60px] p-0">
                  <AvatarImage src={image.url.toString()} alt="" />
                  <AvatarFallback className="p-0">
                    <img
                      src="/default-avatar.svg"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>

                <label
                  htmlFor="image"
                  className="bg-slate-100 dark:bg-neutral-800 rounded-lg px-2 py-2 hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
                >
                  {" "}
                  Change image
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-black dark:text-white font-sans"
              >
                Name
              </label>
              <div className="mt-2">
                <Input
                  className="w-full"
                  name="name"
                  autoComplete="name"
                  placeholder="Name your dash"
                  readOnly={isLoading}
                  value={name}
                  onChange={handleChange}
                  required
                />
              </div>

              {name.length > 0 ? (
                <div className="my-2 p-1 px-2 rounded-full border w-fit">
                  <p>{projectId}</p>
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-black dark:text-white font-sans"
              >
                Database
              </label>

              <div className="mt-2 w-full max-w-lg">
                <DatabaseCard
                  active={database}
                  onChange={(value) => setForm({ ...form, database: value })}
                />
              </div>
            </div>
          </Fragment>
        ) : (
          <DatabaseForm
            databaseName={form.databaseName}
            host={form.host}
            isLoading={isLoading}
            password={form.password}
            username={form.username}
            port={form.port}
            onChange={handleChange}
            database={form.database!}
          />
        )}

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {[0, 1].map((value) => (
              <div
                key={value}
                className={cn(
                  "rounded-lg h-2",
                  active === value
                    ? "w-5  bg-black dark:bg-white"
                    : "w-2 bg-slate-200 dark:bg-neutral-800"
                )}
              ></div>
            ))}
          </div>

          <div className="flex space-x-5">
            <Button
              type="button"
              disabled={isLoading}
              variant="outline"
              onClick={onCancelClick}
              className="border-slate-200 dark:border-neutral-800 text-gray-dark dark:text-gray-light hover:bg-slate-100 hover:dark:bg-neutral-800"
            >
              {active === 0 ? "Cancel" : "Go Back"}
            </Button>

            {active === 0 ? (
              <Button
                type="button"
                disabled={isLoading || disableContinue()}
                onClick={onContinueClick}
                className=""
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || disable()}
                onClick={handleSubmit}
                className=""
              >
                <MoonLoader
                  size={20}
                  color="white"
                  className="mr-2 text-white"
                  loading={isLoading}
                />
                Create Dash
              </Button>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

type DatabaseFormProps = Pick<
  FormType,
  "databaseName" | "host" | "port" | "username" | "password"
> & {
  isLoading: boolean;
  database: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const DatabaseForm = (props: DatabaseFormProps) => {
  const {
    databaseName,
    isLoading,
    host,
    password,
    username,
    port,
    onChange,
    database,
  } = props;

  const [isVisible, setIsVisible] = useState(false);

  const dbImage = databases.find(
    (d) => d.name.toLowerCase() === database.toLowerCase()
  );

  return (
    <Fragment>
      <RippleCard
        className={cn(
          "relative border-[1.5px]  w-full h-[80px] shrink-0 rounded-md flex flex-col justify-center items-center transition-all duration-300 border-indigo-600 "
        )}
      >
        <div className="flex flex-col justify-center items-center relative">
          <img src={dbImage?.url} alt="" className="h-[40px] w-[40px]" />

          <p className="">{dbImage?.name}</p>
        </div>

        <div className="absolute top-0 right-0">
          <TickCircle variant="Bold" className="text-indigo-600" />
        </div>
      </RippleCard>

      <div>
        <label
          htmlFor="databaseName"
          className="block text-sm font-medium leading-6 text-black dark:text-white font-sans"
        >
          Database Name
        </label>
        <div className="mt-2">
          <Input
            className="w-full"
            name="databaseName"
            autoComplete="string"
            placeholder="Enter database name"
            type="text"
            readOnly={isLoading}
            value={databaseName}
            onChange={onChange}
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="host"
          className="block text-sm font-medium leading-6 text-black dark:text-white font-sans"
        >
          Database host
        </label>
        <div className="mt-2">
          <Input
            className="w-full"
            name="host"
            autoComplete="string"
            placeholder="Enter database host"
            type="text"
            readOnly={isLoading}
            value={host}
            onChange={onChange}
            required
          />
        </div>
      </div>

      {database !== "mongodb" ? (
        <div>
          <label
            htmlFor="port"
            className="block text-sm font-medium leading-6 text-black dark:text-white font-sans"
          >
            Database port
          </label>
          <div className="mt-2">
            <Input
              className="w-full"
              name="port"
              autoComplete="string"
              type="number"
              placeholder="Enter database port"
              readOnly={isLoading}
              value={port}
              onChange={onChange}
              required
            />
          </div>
        </div>
      ) : null}

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium leading-6 text-black dark:text-white font-sans"
        >
          Database username
        </label>
        <div className="mt-2">
          <Input
            className="w-full"
            name="username"
            type="text"
            placeholder="Enter database username"
            readOnly={isLoading}
            value={username}
            onChange={onChange}
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-black dark:text-white font-sans"
        >
          Database password
        </label>
        <div className="mt-2">
          <Input
            className="w-full"
            name="password"
            placeholder="Enter database password"
            readOnly={isLoading}
            value={password}
            onChange={onChange}
            type={isVisible ? "text" : "password"}
            required
            endIcon={
              <PasswordEye
                isVisible={isVisible}
                onClick={() => setIsVisible(!isVisible)}
              />
            }
          />
        </div>
      </div>
    </Fragment>
  );
};
