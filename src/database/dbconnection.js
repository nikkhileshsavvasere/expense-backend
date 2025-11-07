import { Sequelize } from "sequelize";
import transactionModel from "../model/transactionSchema.js";
import userModel from "../model/userSchema.js";

let Transaction = null;
let User = null;
const dbconnect = async (database, dbusername, dbpassword) => {
    const sequelize = new Sequelize(database, dbusername, dbpassword, {
        host: "aws-1-ap-southeast-2.pooler.supabase.com",
        dialect: "postgres",
    });

    try {
        await sequelize.authenticate();
        Transaction = await transactionModel(sequelize);
        User = await userModel(sequelize);
        await sequelize.sync();
    } catch (error) {
        console.log("Error while connecting with db:", error);
    }
};

export { dbconnect, Transaction, User };
