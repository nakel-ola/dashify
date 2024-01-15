"use client";
import { create } from "zustand";

export type FieldType = Fields & {
  tableName: string;
  projectId: string;
};
type ColumnUpdateStoreType = {
  column: FieldType | null;
  setColumn: (column: FieldType | null) => void;
};

export const useColumnUpdateStore = create<ColumnUpdateStoreType>(
  (set, get) => ({
    column: null,
    setColumn: (value) => set({ column: value }),
  })
);
