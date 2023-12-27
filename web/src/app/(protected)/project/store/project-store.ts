import { create } from "zustand";

type ProjectStoreType = {
  project: Projects | null;
  setProject: (value: Projects) => void;
  getCollection: (name: string) => Collection | undefined;
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
}));
