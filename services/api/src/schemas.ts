import { z } from "zod";

export const jobQuerySchema = z.object({
  date: z.string().optional(),
  source: z.string().optional(),
  company: z.string().optional(),
  remote: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  limit: z
    .string()
    .transform((value) => Number.parseInt(value, 10))
    .refine((value) => Number.isInteger(value) && value > 0 && value <= 200, {
      message: "limit must be a positive integer up to 200",
    })
    .optional(),
});

export type JobQueryInput = z.infer<typeof jobQuerySchema>;

export const bigTechQuerySchema = z.object({
  category: z.string().optional(),
});

export type BigTechQueryInput = z.infer<typeof bigTechQuerySchema>;
