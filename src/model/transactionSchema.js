import { DataTypes } from "sequelize";

const transactionModel = (sequelize) => {
    const Transaction = sequelize.define("Transaction", {
        id: {
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            type: DataTypes.UUID,
        },
        productName: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        price: {
            allowNull: false,
            type: DataTypes.DECIMAL,
        },
        category: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        paymentMode: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "User",
                key: "id",
            },
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    });
    return Transaction;
};

export default transactionModel;
