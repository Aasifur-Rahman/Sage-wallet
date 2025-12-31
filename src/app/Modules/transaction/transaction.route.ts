import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { transactionZodSchemas } from "./transaction.validation";

const router = Router();

router.get(
  "/me/transactions",
  checkAuth(Role.USER, Role.AGENT),
  TransactionController.getTransactionHistory
);

router.get("/", checkAuth(Role.ADMIN), TransactionController.getAllTransaction);

router.post(
  "/send-money",
  checkAuth(Role.USER),
  validateRequest(transactionZodSchemas.sendMoney),
  TransactionController.sendMoney
);

// Agent routes

router.post(
  "/agent/cash-in",
  checkAuth(Role.AGENT),
  validateRequest(transactionZodSchemas.agentCashIn),
  TransactionController.agentCashIn
);

router.post(
  "/agent/cash-out",
  checkAuth(Role.AGENT),
  validateRequest(transactionZodSchemas.agentCashOut),
  TransactionController.agentCashOut
);

router.patch(
  "/admin/approve",
  checkAuth(Role.ADMIN),
  validateRequest(transactionZodSchemas.approveAgent),
  TransactionController.approvedAgent
);
router.patch(
  "/admin/suspend",
  checkAuth(Role.ADMIN),
  validateRequest(transactionZodSchemas.suspendAgent),
  TransactionController.suspendedAgent
);

export const TransactionRoute = router;
