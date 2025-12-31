"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoute = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("./transaction.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middleware/validateRequest");
const transaction_validation_1 = require("./transaction.validation");
const router = (0, express_1.Router)();
router.get("/me/transactions", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.AGENT), transaction_controller_1.TransactionController.getTransactionHistory);
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), transaction_controller_1.TransactionController.getAllTransaction);
router.post("/send-money", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(transaction_validation_1.transactionZodSchemas.sendMoney), transaction_controller_1.TransactionController.sendMoney);
// Agent routes
router.post("/agent/cash-in", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), (0, validateRequest_1.validateRequest)(transaction_validation_1.transactionZodSchemas.agentCashIn), transaction_controller_1.TransactionController.agentCashIn);
router.post("/agent/cash-out", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), (0, validateRequest_1.validateRequest)(transaction_validation_1.transactionZodSchemas.agentCashOut), transaction_controller_1.TransactionController.agentCashOut);
router.patch("/admin/approve", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(transaction_validation_1.transactionZodSchemas.approveAgent), transaction_controller_1.TransactionController.approvedAgent);
router.patch("/admin/suspend", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(transaction_validation_1.transactionZodSchemas.suspendAgent), transaction_controller_1.TransactionController.suspendedAgent);
exports.TransactionRoute = router;
