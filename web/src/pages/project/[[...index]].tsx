import { TitleAndMetaTags } from "@/components/TitleAndMetaTags";
import {
  OverviewsCard,
  PageCard,
  SettingsCard,
  Sidebar,
} from "@/features/project";
import { useQueries } from "@/hooks/useQueries";
import axios from "@/lib/axios";
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { HashLoader } from "react-spinners";

export default function Projects() {
  const { data: sessionData } = useSession();

  const [{ pageName, projectId }] = useQueries();

  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data } = await axios.get<Projects>(`/projects/${projectId}`);

      return data;
    },
  });

  const user = sessionData?.user;

  if (isLoading || !data)
    return (
      <div className="grid place-items-center mt-10 ">
        <HashLoader size={50} />
      </div>
    );

  const items = data.collections.map((co) => ({
    icon: co.icon,
    name: co.name,
  }));

  const Component = () => {
    if (pageName === "overview")
      return <OverviewsCard onMenuClick={() => setIsOpen(!isOpen)} />;
    if (pageName === "settings")
      return (
        <SettingsCard
          collections={data.collections}
          onMenuClick={() => setIsOpen(!isOpen)}
        />
      );

    if (pageName !== undefined)
      return (
        <PageCard
          collection={data.collections.find((c) => c.name === pageName)!}
          onMenuClick={() => setIsOpen(!isOpen)}
          projectId={projectId}
          database={data.database}
        />
      );
    return null;
  };

  return (
    <Fragment>
      <TitleAndMetaTags
        title={`${capitalizeFirstLetter(pageName)} | Dashify`}
      />

      <div className="grid grid-cols-10 h-screen overflow-hidden page-max-width">
        <Sidebar
          items={items}
          logo={data.logo}
          name={data.name}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <div className="col-span-10 lg:col-span-8">
          <Component />
        </div>
      </div>
    </Fragment>
  );
}
