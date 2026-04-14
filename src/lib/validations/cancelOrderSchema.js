import * as z from "zod";
import { REASONS } from "../reusable";

export const cancelOrderConfirmationSchema = z.object({
  reason: z.enum(REASONS, {
    errorMap: () => ({
      message: "Please select a reason for canceling the order",
    }),
  }),
  comments: z.string().optional(),
});
