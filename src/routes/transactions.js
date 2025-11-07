import { Router } from "express";
import {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
} from "../controllers/transactions.js";
const transactionRoute = Router();

transactionRoute.get("/", (req, res) => {
    getTransactions(req, res);
});

transactionRoute.post("/", (req, res) => {
    addTransaction(req, res);
});

transactionRoute.put("/", (req, res) => {
    updateTransaction(req, res);
});

transactionRoute.delete("/", (req, res) => {
    deleteTransaction(req, res);
});

export default transactionRoute;
