import z from "zod";

export const transactionZodSchemas = {
  sendMoney: z.object({
    receiver: z.string().min(1, "Receiver ID is required"),
    amount: z
      .number({
        error: (issue) => {
          if (issue.input === "undefined") {
            return "Amount is required";
          }
          return "Amount must be a number";
        },
      })
      .positive("Amount must be greater than 0"),
  }),

  agentCashIn: z.object({
    userId: z.string().min(1, "User ID is required"),
    amount: z
      .number({
        error: (issue) => {
          if (issue.input === "undefined") {
            return "Amount is required";
          }
          return "Amount must be a number";
        },
      })
      .positive("Amount must be greater than 0"),
  }),

  agentCashOut: z.object({
    userId: z.string().min(1, "User ID is required"),
    amount: z
      .number({
        error: (issue) => {
          if (issue.input === "undefined") {
            return "Amount is required";
          }
          return "Amount must be a number";
        },
      })
      .positive("Amount must be greater than 0"),
  }),

  blockWallet: z.object({
    params: z.object({
      walletId: z.string().min(1, "Wallet ID is required"),
    }),
  }),

  unblockWallet: z.object({
    params: z.object({
      walletId: z.string().min(1, "Wallet ID is required"),
    }),
  }),

  approveAgent: z.object({
    agentId: z.string().min(1, "Agent ID is required"),
  }),

  suspendAgent: z.object({
    agentId: z.string().min(1, "Agent ID is required"),
  }),
};
