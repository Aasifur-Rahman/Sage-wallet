"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const uuid_1 = require("uuid");
const transactionSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    agent: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: Object.values(transaction_interface_1.TRANSACTION_TYPE),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(transaction_interface_1.TRANSACTION_STATUS),
        default: transaction_interface_1.TRANSACTION_STATUS.PENDING,
    },
    balanceAfterTransaction: { type: Number },
    referenceId: {
        type: String,
        default: (0, uuid_1.v4)(), // auto-generate unique referenceId
        unique: true,
        required: true,
    },
}, { timestamps: true, versionKey: false });
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
