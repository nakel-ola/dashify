import { create } from "zustand";

type ModalStoreType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};
export const useModalStore = create<ModalStoreType>((set, get) => ({
  isOpen: false,
  setIsOpen: (value) => set({ isOpen: value }),
}));
