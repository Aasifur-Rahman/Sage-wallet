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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const wallet_service_1 = require("./wallet.service");
const http_status_codes_1 = require("http-status-codes");
const getAllWallets = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield wallet_service_1.WalletService.getAllWallets(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "All transactions Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getMyWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("DECODED USER", req.user);
    const user = req.user;
    const wallet = yield wallet_service_1.WalletService.getSingleWallet(user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Wallet fetched successfully",
        data: wallet,
    });
}));
const addMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Decoded user", req.user);
    const user = req.user;
    const { amount } = req.body;
    const result = yield wallet_service_1.WalletService.addMoney(user.userId, amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Money added successfully",
        data: result,
    });
}));
const withdrawMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { amount } = req.body;
    const result = yield wallet_service_1.WalletService.withdrawMoney(user.userId, amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "withdraw money successfully",
        data: result,
    });
}));
const blockWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.body;
    const wallet = yield wallet_service_1.WalletService.blockWallet(walletId);
    wallet.status = "blocked";
    yield wallet.save();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Wallet blocked successfully",
        data: wallet,
    });
}));
const unblockWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.body;
    const wallet = yield wallet_service_1.WalletService.unBlockWallet(walletId);
    wallet.status = "active";
    yield wallet.save();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Wallet unblocked successfully",
        data: wallet,
    });
}));
exports.WalletController = {
    getAllWallets,
    getMyWallet,
    addMoney,
    withdrawMoney,
    blockWallet,
    unblockWallet,
};
