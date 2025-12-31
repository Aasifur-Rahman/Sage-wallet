"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletZodSchema = exports.createWalletZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createWalletZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        userId: zod_1.default.string({ error: () => "User ID is required" }),
        walletId: zod_1.default.string({ error: () => "Wallet ID is required" }),
        amount: zod_1.default
            .number({ error: () => "Amount is required" })
            .nonnegative("Initial amount cannot be negative"),
    }),
});
exports.walletZodSchema = {
    getSingleWallet: zod_1.default.object({
        userId: zod_1.default.string().min(1, "User ID is required"),
    }),
    addMoney: zod_1.default.object({
        amount: zod_1.default
            .number({ error: () => "Amount is required" })
            .positive("Amount must be greater than 0"),
    }),
    withdrawMoney: zod_1.default.object({
        amount: zod_1.default
            .number({
            error: (issue) => {
                if (issue.input === "undefined")
                    return "Amount is required";
                return "Amount must be a number";
            },
        })
            .positive("Amount must be greater than 0"),
    }),
    blockWallet: zod_1.default.object({
        walletId: zod_1.default.string().min(1, "Wallet ID is required"),
    }),
    unblockWallet: zod_1.default.object({
        walletId: zod_1.default.string().min(1, "Wallet ID is required"),
    }),
};
