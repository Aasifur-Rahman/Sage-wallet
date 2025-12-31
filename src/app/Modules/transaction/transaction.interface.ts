import { Types } from "mongoose";

export enum TRANSACTION_TYPE {
  ADD_MONEY = "ADD_MONEY",
  SEND_MONEY = "SEND_MONEY",
  WITHDRAW = "WITHDRAW",
  TRANSFER = "TRANSFER",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
}

export enum TRANSACTION_STATUS {
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  PENDING = "PENDING",
}

export interface ITransaction {
  sender?: Types.ObjectId;
  receiver?: Types.ObjectId;
  agent?: Types.ObjectId;
  amount: number;
  type: TRANSACTION_TYPE;
  status: TRANSACTION_STATUS;
  balanceAfterTransaction?: number;
  referenceId?: string;
}
