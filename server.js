import express from "express";
import { dbconnect } from "./src/database/dbconnection.js";
import cors from "cors";
import dotenv from "dotenv";
import authenticationRoute from "./src/routes/authentication.js";
import transactionRoute from "./src/routes/transactions.js";
import reportRoute from "./src/routes/reports.js";
const PORT = 3000;

const app = express();
const origin = "postgresql://postgres:Nutun@17@db.lnkaoweojmpzeljoecoc.supabase.co:5432/postgres";
dbconnect("postgres", "postgres", "Nutun@17");

app.use(express.json());
dotenv.config();
app.use(
    cors({
        credentials: true,
        origin: origin,
    })
);

const checkAuth = (req, res, next) => {
    const { token } = req.query;
    if (!token) {
        next({ message: "Invalid token!", status: 404 });
    }
    next();
};

app.use("/users", authenticationRoute);
app.use("/transactions", checkAuth, transactionRoute);
app.use("/reports", checkAuth, reportRoute);

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next();
    }
    res.status(error.status || 500).json({
        statusCode: error.status,
        message: error.message || "unknown error occured",
    });
});

app.listen(PORT, () => {
    console.log("Server is running ");
});

export default app;
