"use server";

import fs from "fs";
import csv from "csv-parser";

interface CSVObject {
  [key: string]: string;
}

export async function parseCSV(filePath: string): Promise<CSVObject[]> {
  return new Promise((resolve, reject) => {
    const results: CSVObject[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}
