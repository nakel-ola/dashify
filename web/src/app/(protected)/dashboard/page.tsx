import { ProjectsList } from "./features";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchProjects } from "./services/fetch-projects";

type Props = {
  searchParams: {
    page?: string;
  };
};

const limit = 10;

export default async function Dashboard(props: Props) {
  const {
    searchParams: { page = "1" },
  } = props;

  const offset = limit * (Number(page) - 1);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects({ offset, limit }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectsList page={Number(page)} offset={offset} limit={limit} />;
    </HydrationBoundary>
  );
}
