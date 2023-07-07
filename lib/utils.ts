import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { Application, Statistic } from "@/@types";

export function getClasses(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

export function objectToCsv(data: Record<string, unknown>[]) {
  const headers = Object.keys(data[0]);

  const dataArry = data.map((row) => {
    return headers.map((header) => {
      return row[header];
    });
  });
  const rows = dataArry
    .map(
      (row) =>
        row
          .map(String) // convert every value to String
          .map((v) => v.replaceAll('"', '""')) // escape double colons
          .map((v) => `"${v}"`) // quote it
          .join(",") // comma-separated
    )
    .join("\r\n"); // rows starting on new lines
  console.log({ rows });

  return headers.join(",") + "\r\n" + rows;
}

export function generateStageFrequencyTable(applications: Application[]) {
  let statusFrequency = new Map<Application["stage"], number>();
  applications.forEach((application) => {
    if (statusFrequency.has(application.stage)) {
      statusFrequency.set(
        application.stage,
        statusFrequency.get(application.stage)! + 1
      );
    } else {
      statusFrequency.set(application.stage, 1);
    }
  });

  const statusFrequencyArray: Statistic[] = [];
  statusFrequency.forEach((value, key) => {
    statusFrequencyArray.push({
      status: key,
      count: value,
      pct: value / applications.length,
    });
  });

  return statusFrequencyArray;
}
