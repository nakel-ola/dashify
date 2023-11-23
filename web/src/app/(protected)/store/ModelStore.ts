import { create } from "zustand";

type ModelStoreType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};
export const useModelStore = create<ModelStoreType>((set, get) => ({
  isOpen: false,
  setIsOpen: (value) => set({ isOpen: value }),
}));
