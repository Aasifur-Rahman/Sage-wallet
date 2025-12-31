"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_model_1 = require("../wallet/wallet.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = require("http-status-codes");
const transaction_model_1 = require("./transaction.model");
const transaction_interface_1 = require("./transaction.interface");
const QueryBuilder_1 = __importDefault(require("../../utils/QueryBuilder"));
const uuid_1 = require("uuid");
const user_model_1 = require("../user/user.model");
const getTransactionHistory = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "User not authenticated");
    }
    const transactionsQuery = transaction_model_1.Transaction.find({
        $or: [{ sender: userId }, { receiver: userId }],
    })
        .populate("sender", "name email")
        .populate("receiver", "name email");
    const queryBuilder = new QueryBuilder_1.default(transactionsQuery, query);
    const transaction = queryBuilder.filter().sort().fields().paginate();
    const [data, meta] = yield Promise.all([
        transaction.build().exec(),
        transaction.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getAllTransaction = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(transaction_model_1.Transaction.find(), query);
    const transactions = yield queryBuilder.filter().sort().paginate().fields();
    const [data, meta] = yield Promise.all([
        transactions.build(),
        transactions.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const sendMoney = (senderId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const senderWallet = yield wallet_model_1.Wallet.findOne({ user: senderId }).session(session);
        const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiverId }).session(session);
        if (!senderWallet || !receiverWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Sender or Receiver Wallet not found");
        }
        if (senderWallet.status === "blocked") {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Sender wallet is blocked");
        }
        if (senderWallet.balance < amount) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Insufficient balance");
        }
        senderWallet.balance -= amount;
        receiverWallet.balance += amount;
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        yield transaction_model_1.Transaction.create([
            {
                type: transaction_interface_1.TRANSACTION_TYPE.SEND_MONEY,
                amount,
                sender: senderId,
                receiver: receiverId,
                status: transaction_interface_1.TRANSACTION_STATUS.COMPLETED,
                balanceAfterTransaction: senderWallet.balance,
                referenceId: (0, uuid_1.v4)(),
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return {
            senderBalance: senderWallet.balance,
            receiverBalance: receiverWallet.balance,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const agentCashIn = (agentId, userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(agentId);
    console.log(userId, amount);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const userWallet = yield wallet_model_1.Wallet.findOne({
            userId,
        }).session(session);
        if (!userWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User wallet not found");
        }
        if (userWallet.status === "blocked") {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "User wallet is blocked");
        }
        userWallet.balance += amount;
        yield userWallet.save({ session });
        yield transaction_model_1.Transaction.create([
            {
                type: transaction_interface_1.TRANSACTION_TYPE.CASH_IN,
                amount,
                sender: agentId,
                receiver: userId,
                status: transaction_interface_1.TRANSACTION_STATUS.COMPLETED,
                balanceAfterTransaction: userWallet.balance,
                referenceId: (0, uuid_1.v4)(),
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return userWallet;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const agentCashOut = (agentId, userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const userWallet = yield wallet_model_1.Wallet.findOne({
            user: userId,
        }).session(session);
        if (!userWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User wallet not found");
        }
        if (userWallet.status === "blocked") {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "User wallet is blocked");
        }
        if (userWallet.balance < amount) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Insufficient balance");
        }
        userWallet.balance -= amount;
        yield userWallet.save({ session });
        yield transaction_model_1.Transaction.create([
            {
                type: transaction_interface_1.TRANSACTION_TYPE.CASH_OUT,
                amount,
                sender: userId,
                receiver: agentId,
                status: transaction_interface_1.TRANSACTION_STATUS.COMPLETED,
                balanceAfterTransaction: userWallet.balance,
                referenceId: (0, uuid_1.v4)(),
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const approveAgent = (agentId) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield user_model_1.User.findById(agentId);
    if (!agent) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Wallet not found");
    }
    if (agent.agentApproved === true) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Agent is already approved");
    }
    agent.agentApproved = true;
    yield agent.save();
    return agent;
});
const suspendAgent = (agentId) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield user_model_1.User.findById(agentId);
    if (!agent) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Agent not found");
    }
    if (agent.agentApproved === false) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Agent is already suspended");
    }
    agent.agentApproved = false;
    yield agent.save();
    return agent;
});
exports.TransactionService = {
    getTransactionHistory,
    getAllTransaction,
    sendMoney,
    agentCashIn,
    agentCashOut,
    approveAgent,
    suspendAgent,
};
