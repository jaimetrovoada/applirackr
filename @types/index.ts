import * as z from "zod";
import { ApplicationValidator } from "@/lib/validators/schemas";

export type ApplicationRequest = z.infer<typeof ApplicationValidator>;
