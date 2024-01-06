import { create } from "zustand";

type ProjectStoreType = {
  project: Projects | null;
  setProject: (value: Projects) => void;
  getCollection: (name: string) => Collection | undefined;
  getField: (name: string, sort?: boolean) => Fields[] | undefined;
};
export const useProjectStore = create<ProjectStoreType>((set, get) => ({
  project: null,
  setProject: (value) => set({ project: value }),
  getCollection: (name: string) => {
    const project = get().project;

    if (!project) return;

    const collection = project.collections.find((c) => c.name === name);

    return collection;
  },
  getField: (name, sort = true) => {
    const collection = get().getCollection(name);

    const sortedFields =
      collection?.fields.sort((a, b) => a.name.localeCompare(b.name)) ?? [];

    return sort ? sortedFields : collection?.fields ?? [];
  },
}));
