import { Op } from "sequelize";
import Moment from "moment";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { Transaction } from "../database/dbconnection.js";
import { EXPENSE_TYPES, PAYMENT_TYPES } from "../constants/index.js";

const addTransaction = async (req, res) => {
    const { productName, price, category, paymentMode } = req.body;
    const { token } = req.query;
    if (!productName || !productName.trim() || isNaN(price)) {
        return res.status(404).json({ message: "Please check the parameters provided" });
    }
    if (!EXPENSE_TYPES.includes(category)) {
        return res.status(404).json({ message: `${category} doesn't exist in category plans` });
    }
    if (!PAYMENT_TYPES.includes(paymentMode)) {
        return res.status(404).json({ message: `${paymentMode} doesn't exist in payment plans` });
    }
    const tokenValue = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!tokenValue) {
        return res.status(404).json({ message: "Invalid User!" });
    }
    try {
        const newTransaction = await Transaction.build({
            id: uuid(),
            productName,
            price: float(price),
            category,
            paymentMode,
            userId: tokenValue.userId,
            createdAt: Moment().format(),
        });
        const savedTransaction = await newTransaction.save();
        return res.status(201).json({
            message: "Expense added successfully!",
            id: savedTransaction.id,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getTransactions = async (req, res) => {
    const { token, createdAt } = req.query;
    if (!createdAt || !createdAt.trim()) {
        return res.status(404).json({ message: "Please provide date created" });
    }
    const tokenValue = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!tokenValue) {
        return res.status(404).json({ message: "Invalid User!" });
    }
    try {
        const listTransactions = await Transaction.findAll({
            where: {
                userId: tokenValue.userId,
                createdAt: {
                    [Op.gt]: Moment(createdAt).startOf("day"),
                    [Op.lt]: Moment(createdAt).endOf("day"),
                },
            },
        });
        return res.status(200).json({
            transactions: listTransactions,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateTransaction = async (req, res) => {
    const { id, productName, price, category, paymentMode } = req.body;
    const { token } = req.query;
    if (!(productName && productName.trim() && price) && isNaN(price)) {
        return res.status(404).json({ message: "Please check the parameters provided" });
    }
    if (!EXPENSE_TYPES.includes(category)) {
        return res.status(404).json({ message: `${category} doesn't exist in category plans` });
    }
    if (!PAYMENT_TYPES.includes(paymentMode)) {
        return res.status(404).json({ message: `${paymentMode} doesn't exist in payment plans` });
    }
    const tokenValue = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!tokenValue) {
        return res.status(404).json({ message: "Invalid User!" });
    }
    try {
        const updatedTransaction = await Transaction.update(
            {
                productName,
                price: float(price),
                category,
                paymentMode,
                updatedAt: Moment().format(),
            },
            {
                where: {
                    id,
                },
            }
        );
        return res.status(201).json({
            message: "Expense updated successfully!",
            id: updatedTransaction.id,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteTransaction = async (req, res) => {
    const { id } = req.body;
    const { token } = req.query;
    if (!id || !id.trim()) {
        return res.status(404).json({ message: "Please check the parameters provided" });
    }
    const tokenValue = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!tokenValue) {
        return res.status(404).json({ message: "Invalid User!" });
    }
    try {
        const deletedTransaction = await Transaction.destroy({
            where: {
                id,
            },
        });
        return res.status(201).json({
            message: "Expense deleted successfully!",
            id: deletedTransaction.id,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { addTransaction, updateTransaction, getTransactions, deleteTransaction };
