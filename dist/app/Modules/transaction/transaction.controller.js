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
exports.TransactionController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const transaction_service_1 = require("./transaction.service");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = require("http-status-codes");
const getTransactionHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Decoded user", req.user);
    const user = req.user;
    if (!user.userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "User ID not found in payload");
    }
    const query = req.query;
    const result = yield transaction_service_1.TransactionService.getTransactionHistory(user.userId, query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Transaction history fetched successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getAllTransaction = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield transaction_service_1.TransactionService.getAllTransaction(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "All transactions Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const sendMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const senderId = user.userId;
    const receiver = req.body.receiver;
    const amount = req.body.amount;
    const result = yield transaction_service_1.TransactionService.sendMoney(senderId, receiver, amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Send money successful",
        data: result,
    });
}));
// agent
const agentCashIn = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = req.user;
    const agentId = agent.userId;
    const { userId, amount } = req.body;
    const result = yield transaction_service_1.TransactionService.agentCashIn(agentId, userId, amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Cash-in successful",
        data: result,
    });
}));
const agentCashOut = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = req.user;
    const agentId = agent.userId;
    const { userId, amount } = req.body;
    const result = yield transaction_service_1.TransactionService.agentCashOut(agentId, userId, amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Cash-out successful",
        data: result,
    });
}));
const approvedAgent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId } = req.body;
    const agent = yield transaction_service_1.TransactionService.approveAgent(agentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Agent approved successfully",
        data: agent,
    });
}));
const suspendedAgent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId } = req.body;
    const agent = yield transaction_service_1.TransactionService.suspendAgent(agentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Agent suspended successfully",
        data: agent,
    });
}));
exports.TransactionController = {
    getTransactionHistory,
    getAllTransaction,
    sendMoney,
    agentCashIn,
    agentCashOut,
    approvedAgent,
    suspendedAgent,
};
