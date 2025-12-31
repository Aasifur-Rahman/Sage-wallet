import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createWalletZodSchema, walletZodSchema } from "./wallet.validation";
import { WalletController } from "./wallet.controller";

const router = Router();

// user

router.get("/", checkAuth(Role.ADMIN), WalletController.getAllWallets);

router.get(
  "/me",
  checkAuth(Role.USER, Role.AGENT),

  WalletController.getMyWallet
);

router.post(
  "/add-money",
  checkAuth(Role.USER, Role.AGENT),
  validateRequest(walletZodSchema.addMoney),
  WalletController.addMoney
);

router.post(
  "/withdraw",
  checkAuth(Role.USER),
  validateRequest(walletZodSchema.withdrawMoney),
  WalletController.withdrawMoney
);

// admin route

router.get("/admin/all", checkAuth(Role.ADMIN), WalletController.getAllWallets);

router.patch(
  "/admin/block",
  checkAuth(Role.ADMIN),
  validateRequest(walletZodSchema.blockWallet),
  WalletController.blockWallet
);

router.patch(
  "/admin/unblock",
  checkAuth(Role.ADMIN),
  validateRequest(walletZodSchema.unblockWallet),
  WalletController.unblockWallet
);

export const WalletRoutes = router;
