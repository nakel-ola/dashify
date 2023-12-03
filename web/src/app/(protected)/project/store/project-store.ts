import { create } from "zustand";

type ProjectStoreType = {
  project: Projects | null;
  setProject: (value: Projects) => void;
};
export const useProjectStore = create<ProjectStoreType>((set, get) => ({
  project: null,
  setProject: (value) => set({ project: value }),
}));
