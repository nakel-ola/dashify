"use client";
import { create } from "zustand";
import { ColumnType } from "../[projectId]/create/schema";

type ForeignStoreType = {
  column: (ColumnType & { index: number }) | null;
  setColumn: (column: (ColumnType & { index: number }) | null) => void;
};

export const useForeignStore = create<ForeignStoreType>((set, get) => ({
  column: null,
  setColumn: (value) => set({ column: value }),
}));
