"use client";
import { create } from "zustand";
import { generateNumbers } from "../utils/generate-numbers";

type onSelectAllArgs = {
  totalItems: number;
  currentPage: number;
  limit: number;
};
type setSelectedRowArgs = {
  value: number;
  currentPage: number;
  limit: number;
};

type SelectedRowStoreType = {
  selectedRows: number[];
  isSelected: (args: setSelectedRowArgs) => boolean;
  setSelectedRow: (args: setSelectedRowArgs) => void;
  onSelectAll: (args: onSelectAllArgs) => void;
  removeSelected: () => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (value: boolean) => void;
};
export const useSelectedRowStore = create<SelectedRowStoreType>((set, get) => ({
  selectedRows: [],
  isDeleteOpen: false,
  setIsDeleteOpen: (value) => set({ isDeleteOpen: value }),
  isSelected: ({ value, currentPage, limit }) => {
    const currentValue = getCurrentValue(value, currentPage, limit);

    return get().selectedRows.indexOf(currentValue) !== -1;
  },
  setSelectedRow: ({ value, currentPage, limit }) => {
    const currentValue = getCurrentValue(value, currentPage, limit);

    const arr = [...get().selectedRows];

    const inx = arr.indexOf(currentValue);

    if (inx === -1) arr.push(currentValue);
    else arr.splice(inx, 1);

    set({ selectedRows: arr });
  },
  onSelectAll: ({ currentPage, limit, totalItems }) => {
    const selectedRow = get().selectedRows;
    if (totalItems === selectedRow.length) {
      set({ selectedRows: [] });
    } else {
      const startNumber = getCurrentValue(0, currentPage, limit);
      const endNumber = getCurrentValue(totalItems, currentPage, limit) - 1;

      const numbers = generateNumbers(startNumber, endNumber);

      set({ selectedRows: numbers });
    }
  },
  removeSelected: () => set({ selectedRows: [] }),
}));

const getCurrentValue = (value: number, currentPage: number, limit: number) => {
  const startNumber = (currentPage - 1) * Number(limit);

  return startNumber + value;
};
