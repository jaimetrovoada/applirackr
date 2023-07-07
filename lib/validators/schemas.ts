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
  position: z.string().min(1, "Title must contain at least 1 character(s)"),
  company: z.string().min(1, "Company must contain at least 1 character(s)"),
  stage: z.enum(STAGES),
  postingUrl: z.string().url(),
  dateApplied: z.coerce.date().optional().nullable(),
});
