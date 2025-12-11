import { z } from "zod";

export const poolFormSchema = z.object({
  quoteToken: z.enum(["SOL", "USDC"]),
  baseToken: z.string().min(1, "Base token is required"),
  baseFee: z.number().nullable(),
  binStep: z.number().nullable(),
  initialPrice: z.number().min(0),
});

export const positionFormSchema = z
  .object({
    presetId: z.number().nullable(),
    depositAmount: z.number().min(0, "Deposit amount must be positive"),
    depositOption: z.enum(["0.5", "1", "5", "CUSTOM"]),
    minPrice: z.number().min(0, "Min price must be positive"),
    maxPrice: z.number().min(0, "Max price must be positive"),
  })
  .refine((data) => data.minPrice <= data.maxPrice, {
    message: "Min price cannot be greater than max price",
    path: ["minPrice"],
  })
  .refine((data) => data.maxPrice >= data.minPrice, {
    message: "Max price cannot be less than min price",
    path: ["maxPrice"],
  });

export const poolSniperFormSchema = z.object({
  pool: poolFormSchema,
  position: positionFormSchema,
});

export type PoolFormValues = z.infer<typeof poolFormSchema>;
export type PositionFormValues = z.infer<typeof positionFormSchema>;
export type PoolSniperFormValues = z.infer<typeof poolSniperFormSchema>;
