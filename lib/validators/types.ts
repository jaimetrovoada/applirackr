import * as z from "zod";
import { ApplicationValidator } from "./schemas";

export type ApplicationRequest = z.infer<typeof ApplicationValidator>;
