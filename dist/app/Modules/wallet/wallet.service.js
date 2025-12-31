"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.WalletService = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = require("http-status-codes");
const wallet_model_1 = require("./wallet.model");
const transaction_model_1 = require("../transaction/transaction.model");
const transaction_interface_1 = require("../transaction/transaction.interface");
const uuid_1 = require("uuid");
const QueryBuilder_1 = __importDefault(require("../../utils/QueryBuilder"));
const getAllWallets = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(wallet_model_1.Wallet.find(), query);
    const wallets = yield queryBuilder.filter().sort().paginate().fields();
    const [data, meta] = yield Promise.all([wallets.build(), wallets.getMeta()]);
    return {
        data,
        meta,
    };
});
const getSingleWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({
        user: userId,
    }).populate("user", "name email role phone");
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Wallet not found");
    }
    return wallet;
});
const addMoney = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (!amount || amount <= 0) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid amount");
        }
        const wallet = yield wallet_model_1.Wallet.findOne({
            user: new mongoose_1.Types.ObjectId(userId),
        }).session(session);
        console.log(wallet);
        if (!wallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Wallet not found");
        }
        if (wallet.status === "blocked") {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Wallet is blocked");
        }
        wallet.balance += amount;
        yield wallet.save({ session });
        yield transaction_model_1.Transaction.create([
            {
                user: userId,
                wallet: wallet._id,
                type: transaction_interface_1.TRANSACTION_TYPE.ADD_MONEY,
                amount,
                status: transaction_interface_1.TRANSACTION_STATUS.COMPLETED,
                referenceId: (0, uuid_1.v4)(),
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return {
            balance: wallet.balance,
        };
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Add money failed");
    }
});
const withdrawMoney = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (amount <= 0) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid Amount");
        }
        const wallet = yield wallet_model_1.Wallet.findOne({ user: userId }).session(session);
        if (!wallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Wallet not found");
        }
        if (wallet.status === "blocked") {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Wallet is blocked");
        }
        if (wallet.balance < amount) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Insufficient balance");
        }
        wallet.balance -= amount;
        yield wallet.save({ session });
        yield transaction_model_1.Transaction.create([
            {
                user: userId,
                wallet: wallet._id,
                type: transaction_interface_1.TRANSACTION_TYPE.WITHDRAW,
                amount,
                status: transaction_interface_1.TRANSACTION_STATUS.COMPLETED,
                referenceId: (0, uuid_1.v4)(),
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return {
            message: "Withdrawal successful",
            balance: wallet.balance,
        };
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Withdrawal ${transaction_interface_1.TRANSACTION_STATUS.FAILED}`);
    }
});
// admin services
const blockWallet = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findById(walletId);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Wallet not found");
    }
    if (wallet.status === "blocked") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Wallet already blocked");
    }
    wallet.status = "blocked";
    yield wallet.save();
    return wallet;
});
const unBlockWallet = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findById(walletId);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Wallet not found");
    }
    if (wallet.status === "active") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Wallet is already active");
    }
    wallet.status = "active";
    yield wallet.save();
    return wallet;
});
exports.WalletService = {
    getAllWallets,
    getSingleWallet,
    addMoney,
    withdrawMoney,
    blockWallet,
    unBlockWallet,
};
