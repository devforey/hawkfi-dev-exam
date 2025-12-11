"use client";

import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PoolForm } from "./pool-form";
import { PositionForm } from "./position-form";
import { poolSniperFormSchema, PoolSniperFormValues } from "./schema";

export const PoolSniperForm = () => {
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
      position: {},
    },
  });

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
};
