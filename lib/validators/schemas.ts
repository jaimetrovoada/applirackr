import * as z from "zod";

export const ApplicationValidator = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED", "SAVED"]),
  postingUrl: z.string().url(),
  dateApplied: z.date(),
});
