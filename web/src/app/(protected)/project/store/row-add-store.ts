"use client";
import { create } from "zustand";

type Row = {
  tableName: string;
  projectId: string;
  field: Fields[];
};

type RowAddStoreType = {
  row: Row | null;
  setRow: (args: Row | null) => void;
};

export const useRowAddStore = create<RowAddStoreType>((set, get) => ({
  row: null,
  setRow: (args) => set({ row: args }),
}));
