"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middleware/validateRequest");
const wallet_validation_1 = require("./wallet.validation");
const wallet_controller_1 = require("./wallet.controller");
const router = (0, express_1.Router)();
// user
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletController.getAllWallets);
router.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.AGENT), wallet_controller_1.WalletController.getMyWallet);
router.post("/add-money", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.AGENT), (0, validateRequest_1.validateRequest)(wallet_validation_1.walletZodSchema.addMoney), wallet_controller_1.WalletController.addMoney);
router.post("/withdraw", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(wallet_validation_1.walletZodSchema.withdrawMoney), wallet_controller_1.WalletController.withdrawMoney);
// admin route
router.get("/admin/all", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletController.getAllWallets);
router.patch("/admin/block", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(wallet_validation_1.walletZodSchema.blockWallet), wallet_controller_1.WalletController.blockWallet);
router.patch("/admin/unblock", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(wallet_validation_1.walletZodSchema.unblockWallet), wallet_controller_1.WalletController.unblockWallet);
exports.WalletRoutes = router;
