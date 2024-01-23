"use client";
import { create } from "zustand";

type Row = {
  tableName: string;
  projectId: string;
  field: Fields[];
  values: any;
};

type RowUpdateStoreType = {
  row: Row | null;
  setRow: (args: Row | null) => void;
};

export const useRowUpdateStore = create<RowUpdateStoreType>((set, get) => ({
  row: null,
  setRow: (args) => set({ row: args }),
}));
