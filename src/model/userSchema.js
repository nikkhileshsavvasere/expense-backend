import { DataTypes } from "sequelize";

const userModel = (sequelize) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                type: DataTypes.UUID,
            },
            username: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING,
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            email: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING,
            },
            isVerified: {
                allowNull: false,
                defaultValue: false,
                type: DataTypes.BOOLEAN,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        },
        {
            // disable the modification of table names; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: true,
        }
    );
    return User;
};

export default userModel;
