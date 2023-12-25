import { DatabaseSection, DeleteProjectSection, InfoSection } from "./features";

export default async function Settings() {
  return (
    <div className="px-5 lg:px-10 py-10">
      <InfoSection />

      <DatabaseSection />
      <DeleteProjectSection />
    </div>
  );
}
