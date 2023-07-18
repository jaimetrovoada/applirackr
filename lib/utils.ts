import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { Application, Stages } from "@/@types";

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

export type LinkFlow = {
  source: Stages;
  target: Stages;
  value: number;
};
export function genStageSankeyData(applications: Application[]) {
  const links: LinkFlow[] = [
    {
      source: "SAVED",
      target: "APPLIED",
      value: applications.filter(
        (application) => application.stage === "APPLIED"
      ).length,
    },
    {
      source: "SAVED",
      target: "MESSESSAGED_RECRUITER",
      value: applications.filter(
        (application) => application.stage === "MESSESSAGED_RECRUITER"
      ).length,
    },
    {
      source: "APPLIED",
      target: "INTERVIEWED",
      value: applications.filter(
        (application) => application.stage === "INTERVIEWED"
      ).length,
    },
    {
      source: "MESSESSAGED_RECRUITER",
      target: "INTERVIEWED",
      value: applications.filter(
        (application) => application.stage === "INTERVIEWED"
      ).length,
    },
    {
      source: "REFFERED",
      target: "INTERVIEWED",
      value: applications.filter(
        (application) => application.stage === "INTERVIEWED"
      ).length,
    },
    {
      source: "INTERVIEWED",
      target: "REJECTED",
      value: applications.filter(
        (application) => application.stage === "REJECTED"
      ).length,
    },
    {
      source: "INTERVIEWED",
      target: "OFFERED",
      value: applications.filter(
        (application) => application.stage === "OFFERED"
      ).length,
    },
  ];

  return links;
}
