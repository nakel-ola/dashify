import { create } from "zustand";

type ProjectStoreType = {
  project: Projects | null;
  setProject: (value: Projects) => void;
};
export const useProjectStore = create<ProjectStoreType>((set) => ({
  project: null,
  setProject: (value) => set({ project: value }),
}));
