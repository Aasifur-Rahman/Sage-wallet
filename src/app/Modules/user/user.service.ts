import { StatusCodes } from "http-status-codes";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";
import { userSearchableFields } from "./user.constant";
import QueryBuilder from "../../utils/QueryBuilder";
import mongoose from "mongoose";
import { Wallet } from "../wallet/wallet.model";

const createUser = async (payload: Partial<IUser>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, password, role, agentCommissionRate, ...rest } = payload;

    if (role === Role.AGENT && !agentCommissionRate) {
      throw new AppError(400, "Agent commission rate is required");
    }

    const userExist = await User.findOne({ email }).session(session);

    if (userExist) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exist");
    }

    if (!password) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Password is required");
    }

    const hashedPassword = await bcryptjs.hash(
      password as string,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const [user] = await User.create(
      [
        {
          email,
          password: hashedPassword,
          ...rest,
        },
      ],
      { session }
    );

    const [wallet] = await Wallet.create(
      [
        {
          user: user._id,
          balance: Number(envVars.INITIAL_BALANCE),
        },
      ],
      { session }
    );

    user.wallet = wallet._id;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const users = await queryBuilder
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, meta] = await Promise.all([users.build(), users.getMeta()]);

  return {
    data,
    meta,
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
};
