"use client";
import { create } from "zustand";

type AddColumnStoreType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};
export const useAddColumnStore = create<AddColumnStoreType>((set, get) => ({
  isOpen: false,
  setIsOpen: (value) => set({ isOpen: value }),
}));
