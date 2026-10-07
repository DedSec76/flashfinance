import { z } from "zod";

export const summaryMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Enter a month like 2026-09.");
