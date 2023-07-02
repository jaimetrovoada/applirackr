import * as z from "zod";
import { ApplicationValidator } from "@/lib/validators/schemas";

export type ApplicationRequest = z.infer<typeof ApplicationValidator>;

export type Application = ApplicationRequest & {
  id: string;
  createdAt: Date;
};

export type Statistic = {
  status: Application["status"];
  count: number | undefined;
  pct: number | undefined;
};
