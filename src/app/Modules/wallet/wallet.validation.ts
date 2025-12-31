import z from "zod";

export const createWalletZodSchema = z.object({
  body: z.object({
    userId: z.string({ error: () => "User ID is required" }),
    walletId: z.string({ error: () => "Wallet ID is required" }),
    amount: z
      .number({ error: () => "Amount is required" })
      .nonnegative("Initial amount cannot be negative"),
  }),
});

export const walletZodSchema = {
  getSingleWallet: z.object({
    userId: z.string().min(1, "User ID is required"),
  }),

  addMoney: z.object({
    amount: z
      .number({ error: () => "Amount is required" })
      .positive("Amount must be greater than 0"),
  }),

  withdrawMoney: z.object({
    amount: z
      .number({
        error: (issue) => {
          if (issue.input === "undefined") return "Amount is required";
          return "Amount must be a number";
        },
      })
      .positive("Amount must be greater than 0"),
  }),

  blockWallet: z.object({
    walletId: z.string().min(1, "Wallet ID is required"),
  }),

  unblockWallet: z.object({
    walletId: z.string().min(1, "Wallet ID is required"),
  }),
};
