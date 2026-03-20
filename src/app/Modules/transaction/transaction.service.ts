import mongoose, { Types } from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import AppError from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { Transaction } from "./transaction.model";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "./transaction.interface";
import QueryBuilder from "../../utils/QueryBuilder";
import { v4 as uuidv4 } from "uuid";
import { User } from "../user/user.model";

const getTransactionHistory = async (
  userId: string,
  query: Record<string, string>
) => {
  if (!userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const transactionsQuery = Transaction.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender", "name email")
    .populate("receiver", "name email");

  const queryBuilder = new QueryBuilder(transactionsQuery, query);

  const transaction = queryBuilder.filter().sort().fields().paginate();

  const [data, meta] = await Promise.all([
    transaction.build().exec(),
    transaction.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getAllTransaction = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Transaction.find(), query);
  const transactions = await queryBuilder.filter().sort().paginate().fields();

  const [data, meta] = await Promise.all([
    transactions.build(),
    transactions.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const sendMoney = async (
  senderId: string,
  receiverId: string,
  amount: number
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderWallet = await Wallet.findOne({ user: senderId }).session(
      session
    );

    const receiverWallet = await Wallet.findOne({ user: receiverId }).session(
      session
    );

    if (!senderWallet || !receiverWallet) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Sender or Receiver Wallet not found"
      );
    }

    if (senderWallet.status === "blocked") {
      throw new AppError(StatusCodes.FORBIDDEN, "Sender wallet is blocked");
    }

    if (senderWallet.balance < amount) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance");
    }

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    await Transaction.create(
      [
        {
          type: TRANSACTION_TYPE.SEND_MONEY,
          amount,
          sender: senderId,
          receiver: receiverId,
          status: TRANSACTION_STATUS.COMPLETED,
          balanceAfterTransaction: senderWallet.balance,
          referenceId: uuidv4(),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      senderBalance: senderWallet.balance,
      receiverBalance: receiverWallet.balance,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const agentCashIn = async (agentId: string, userId: string, amount: number) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userWallet = await Wallet.findOne({
      user: userId,
    }).session(session);

    if (!userWallet) {
      throw new AppError(StatusCodes.NOT_FOUND, "User wallet not found");
    }

    if (userWallet.status === "blocked") {
      throw new AppError(StatusCodes.FORBIDDEN, "User wallet is blocked");
    }

    userWallet.balance += amount;

    await userWallet.save({ session });

    await Transaction.create(
      [
        {
          type: TRANSACTION_TYPE.CASH_IN,
          amount,
          sender: agentId,
          receiver: userId,
          status: TRANSACTION_STATUS.COMPLETED,
          balanceAfterTransaction: userWallet.balance,
          referenceId: uuidv4(),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return userWallet;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const agentCashOut = async (
  agentId: string,
  userId: string,
  amount: number
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userWallet = await Wallet.findOne({
      user: userId,
    }).session(session);

    if (!userWallet) {
      throw new AppError(StatusCodes.NOT_FOUND, "User wallet not found");
    }

    if (userWallet.status === "blocked") {
      throw new AppError(StatusCodes.FORBIDDEN, "User wallet is blocked");
    }

    if (userWallet.balance < amount) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance");
    }

    userWallet.balance -= amount;
    await userWallet.save({ session });

    await Transaction.create(
      [
        {
          type: TRANSACTION_TYPE.CASH_OUT,
          amount,
          sender: userId,
          receiver: agentId,
          status: TRANSACTION_STATUS.COMPLETED,
          balanceAfterTransaction: userWallet.balance,
          referenceId: uuidv4(),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const approveAgent = async (agentId: string) => {
  const agent = await User.findById(agentId);

  if (!agent) {
    throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
  }

  if (agent.agentApproved === true) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Agent is already approved");
  }

  agent.agentApproved = true;
  await agent.save();

  return agent;
};

const suspendAgent = async (agentId: string) => {
  const agent = await User.findById(agentId);

  if (!agent) {
    throw new AppError(StatusCodes.NOT_FOUND, "Agent not found");
  }

  if (agent.agentApproved === false) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Agent is already suspended");
  }

  agent.agentApproved = false;
  await agent.save();

  return agent;
};

export const TransactionService = {
  getTransactionHistory,
  getAllTransaction,
  sendMoney,
  agentCashIn,
  agentCashOut,
  approveAgent,
  suspendAgent,
};
