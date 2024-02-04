"use server";
import Papa from "papaparse";

interface CSVData {
  [key: string]: string;
}

export async function parseCSV(csvText: string): Promise<CSVData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data) {
          resolve(result.data as any);
        }
      },
      error: (error: any) => reject(error),
    });
  });
}
