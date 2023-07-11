import * as z from "zod";

export const STAGES = [
  "SAVED",
  "MESSESSAGED_RECRUITER",
  "REFFERED",
  "APPLIED",
  "FOLLOWED_UP",
  "INTERVIEWED",
  "OFFERED",
  "REJECTED",
] as const;

export const ApplicationValidator = z.object({
  position: z
    .string()
    .min(3, "Title must contain at least 1 character(s)")
    .max(128),
  company: z
    .string()
    .min(3, "Company must contain at least 1 character(s)")
    .max(128),
  stage: z.enum(STAGES).default("SAVED"),
  postingUrl: z.string().url(),
  dateApplied: z.coerce
    .date()
    .max(new Date(), { message: "Date can't be in the future" })
    .optional()
    .nullable(),
});
