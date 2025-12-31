"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionZodSchemas = void 0;
const zod_1 = __importDefault(require("zod"));
exports.transactionZodSchemas = {
    sendMoney: zod_1.default.object({
        receiver: zod_1.default.string().min(1, "Receiver ID is required"),
        amount: zod_1.default
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
    agentCashIn: zod_1.default.object({
        userId: zod_1.default.string().min(1, "User ID is required"),
        amount: zod_1.default
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
    agentCashOut: zod_1.default.object({
        userId: zod_1.default.string().min(1, "User ID is required"),
        amount: zod_1.default
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
    blockWallet: zod_1.default.object({
        params: zod_1.default.object({
            walletId: zod_1.default.string().min(1, "Wallet ID is required"),
        }),
    }),
    unblockWallet: zod_1.default.object({
        params: zod_1.default.object({
            walletId: zod_1.default.string().min(1, "Wallet ID is required"),
        }),
    }),
    approveAgent: zod_1.default.object({
        agentId: zod_1.default.string().min(1, "Agent ID is required"),
    }),
    suspendAgent: zod_1.default.object({
        agentId: zod_1.default.string().min(1, "Agent ID is required"),
    }),
};
