"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../Modules/user/user.route");
const auth_route_1 = require("../Modules/auth/auth.route");
const wallet_route_1 = require("../Modules/wallet/wallet.route");
const transaction_route_1 = require("../Modules/transaction/transaction.route");
// import { WalletRoute } from "../Modules/wallet/wallet.route";
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/wallet",
        route: wallet_route_1.WalletRoutes,
    },
    {
        path: "/transactions",
        route: transaction_route_1.TransactionRoute,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
