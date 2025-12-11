"use client";

import { forwardRef, useImperativeHandle } from "react";
import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Keypair } from "@solana/web3.js";
import { PoolForm } from "./pool-form";
import { PositionForm } from "./position-form";
import { poolSniperFormSchema, PoolSniperFormValues } from "./schema";
import { useMockPositionsStore, MockPosition } from "@/store/mockPositionsStore";
import { calculateNumberOfBins } from "@/utils/dlmm";

export interface PoolSniperFormRef {
  submitForm: () => Promise<{
    success: boolean;
    poolAddress?: string;
    positionAddress?: string;
    error?: string;
  }>;
  resetForm: () => void;
}

export const PoolSniperForm = forwardRef<PoolSniperFormRef>((_, ref) => {
  const addPosition = useMockPositionsStore((state) => state.addPosition);

  const methods = useForm<PoolSniperFormValues>({
    resolver: zodResolver(poolSniperFormSchema),
    defaultValues: {
      pool: {
        quoteToken: "SOL",
        baseToken: "",
        baseFee: null,
        binStep: null,
        initialPrice: 0,
      },
      position: {
        presetId: null,
        depositAmount: 1,
        depositOption: "1" as const,
        minPrice: 0,
        maxPrice: 0,
      },
    },
  });

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      // Validate the form
      const isValid = await methods.trigger();
      if (!isValid) {
        return { success: false, error: "Please fill in all required fields" };
      }

      const values = methods.getValues();

      // Check required fields
      if (!values.pool.baseToken) {
        return { success: false, error: "Base token is required" };
      }
      if (!values.pool.binStep) {
        return { success: false, error: "Bin step is required" };
      }
      if (values.pool.initialPrice <= 0) {
        return { success: false, error: "Initial price is required" };
      }
      if (values.position.minPrice <= 0 || values.position.maxPrice <= 0) {
        return { success: false, error: "Price range is required" };
      }

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate random keypairs
      const poolKeypair = Keypair.generate();
      const positionKeypair = Keypair.generate();

      // Calculate number of bins
      const numberOfBins = calculateNumberOfBins(
        values.position.minPrice,
        values.position.maxPrice,
        values.pool.binStep
      );

      // Create mock position
      const mockPosition: MockPosition = {
        id: crypto.randomUUID(),
        poolAddress: poolKeypair.publicKey.toString(),
        positionAddress: positionKeypair.publicKey.toString(),
        baseToken: values.pool.baseToken,
        quoteToken: values.pool.quoteToken,
        minPrice: values.position.minPrice,
        maxPrice: values.position.maxPrice,
        depositAmount: values.position.depositAmount,
        numberOfBins,
        createdAt: new Date(),
      };

      // Add to store
      addPosition(mockPosition);

      // Log the submission data
      console.log("Mock position created:", mockPosition);
      console.log("Form values:", values);

      return {
        success: true,
        poolAddress: mockPosition.poolAddress,
        positionAddress: mockPosition.positionAddress,
      };
    },
    resetForm: () => {
      methods.reset();
    },
  }));

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <PoolForm />
        <PositionForm />
      </Box>
    </FormProvider>
  );
});

PoolSniperForm.displayName = "PoolSniperForm";
