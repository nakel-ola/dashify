"use server";
import Papa from "papaparse";

interface CSVData {
  results: { [key: string]: string }[];
  header: string[];
}

export async function parseCSV(csvText: string): Promise<CSVData> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data) {
          resolve({
            results: result.data as any[],
            header: result.meta.fields ?? [],
          });
        }
      },
      error: (error: any) => reject(error),
    });
  });
}
