import { z } from "zod";

export const poolFormSchema = z.object({
  quoteToken: z.enum(["SOL", "USDC"]),
  baseToken: z.string().min(1, "Base token is required"),
  baseFee: z.number().nullable(),
  binStep: z.number().nullable(),
  initialPrice: z.number().min(0),
});

export const positionFormSchema = z.object({
  // Placeholder for position form fields
});

export const poolSniperFormSchema = z.object({
  pool: poolFormSchema,
  position: positionFormSchema,
});

export type PoolFormValues = z.infer<typeof poolFormSchema>;
export type PositionFormValues = z.infer<typeof positionFormSchema>;
export type PoolSniperFormValues = z.infer<typeof poolSniperFormSchema>;
