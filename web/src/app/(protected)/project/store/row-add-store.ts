"use client";
import { create } from "zustand";

type Row = {
  tableName: string;
  projectId: string;
  type: "single" | "csv" | "json";
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
