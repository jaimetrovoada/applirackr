import * as z from "zod";

export const ApplicationValidator = z.object({
  title: z.string().min(1, "Title must contain at least 1 character(s)"),
  company: z.string().min(1, "Company must contain at least 1 character(s)"),
  status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED", "SAVED"]),
  postingUrl: z.string().url(),
  dateApplied: z.coerce.date(),
});
