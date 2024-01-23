import Image from "next/image";
import { Navbar } from "./features";
import { AcceptButton } from "./features/accept-button";
import { fetchProjectByInvitation } from "../../../services/fetch-project-by-invitation";

type Props = {
  params: { projectId: string; token: string };
};

export default async function Verify(props: Props) {
  const {
    params: { projectId, token },
  } = props;

  const project = await fetchProjectByInvitation(projectId);

  return (
    <div>
      <Navbar />

      <div className="flex justify-center">
        <div className="border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-lg my-10 w-[90%] lg:w-[500px] p-10 flex flex-col">
          <p className="text-3xl text-black dark:text-white font-medium text-center">
            Accept invitation?
          </p>

          <p className="text-gray-dark dark:text-gray-light text-center pt-5">
            You are invited to join the project {project.name}
          </p>

          <div className="rounded-md border-[1.5px] border-slate-100 dark:border-neutral-800 flex   cursor-pointer p-2 my-10 gap-5">
            <div className="h-[50px] w-[50px]">
              <Image
                src={project.logo!}
                alt=""
                className=""
                width={100}
                height={100}
              />
            </div>

            <div className="">
              <p className="text-lg font-medium text-black dark:text-white">
                {project?.name}
              </p>
              <p className="text-base text-gray-dark dark:text-gray-light">
                <strong className="font-medium">Last update: </strong>
                {new Date(project?.createdAt!).toDateString()}
              </p>
            </div>
          </div>

          <AcceptButton token={token} projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
