import { z } from "zod";

export const createUserZodSchema = z.object({
  name: z
    .string({
      error: () => "Not a string",
    })
    .min(2, { message: "Name to short. Minimum 2 character long" })
    .max(50, { message: "Name too long" }),
  email: z
    .string({
      error: () => "Not a string",
    })
    .email({ message: "Invalid email address format" })
    .min(5, { message: "Email must be at least 5 character long" })
    .max(100, { message: "Email cannot exceed 100 characters" }),
  password: z
    .string({
      error: () => "Not a string",
    })
    .min(8, { message: "8 characters minimum" })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 digit.",
    }),
});
