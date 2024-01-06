import { create } from "zustand";

type CollectionModalStoreType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};
export const useCollectionModalStore = create<CollectionModalStoreType>((set, get) => ({
  isOpen: false,
  setIsOpen: (value) => set({ isOpen: value }),
}));
