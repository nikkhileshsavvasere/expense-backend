import { Op } from "sequelize";
import Moment from "moment";
import jwt from "jsonwebtoken";
import { Transaction } from "../database/dbconnection.js";

const generateReportData = async (req, res) => {
    const { token } = req.query;
    const { startDate, endDate } = req.body;
    if (!(startDate && endDate)) {
        return res.status(400).json({ message: "Provide start and end date" });
    }
    const tokenValue = jwt.verify(token, process.env.JWT_SECRET_KEY);
    try {
        const monthlyTransactions = await Transaction.findAll({
            where: {
                userId: tokenValue.userId,
                createdAt: {
                    [Op.gt]: Moment(startDate).startOf("day"),
                    [Op.lt]: Moment(endDate).endOf("day"),
                },
            },
        });
        return res.status(200).json({ transactions: monthlyTransactions });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { generateReportData };
