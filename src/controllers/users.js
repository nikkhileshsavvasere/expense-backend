import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { User } from "../database/dbconnection.js";
import { SALT_ROUNDS } from "../constants/index.js";

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!(username && username.trim() && password && password.trim())) {
        return res.status(404).json({ message: "Please enter proper credentials" });
    }
    try {
        const persistedUser = await User.findOne({
            where: {
                username: username,
            },
        });
        if (persistedUser) {
            bcrypt.compare(password, persistedUser.password, (error, result) => {
                if (result) {
                    const data = {
                        userId: persistedUser.id,
                    };
                    const token = jwt.sign(data, process.env.JWT_SECRET_KEY);
                    return res.status(201).json({
                        token,
                    });
                } else {
                    return res.status(404).json({ message: "username or password doesn't match" });
                }
            });
        } else {
            return res.status(404).json({ message: "User does not exist." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!(username && username.trim() && email && email.trim() && password && password.trim())) {
        return res.status(404).json({ message: "Please enter proper credentials" });
    }
    try {
        const existingUser = await User.findOne({
            where: {
                username: username,
            },
        });
        if (existingUser) {
            return res.status(404).json({ message: "user already exists!" });
        } else {
            bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
                if (error) {
                    return res.status(500).json({ message: "Something went wrong!" });
                }
                const newUser = User.build({
                    id: uuid(),
                    username: username,
                    email: email,
                    password: hash,
                });
                await newUser.save();
                return res.status(201).json({
                    message: "user added successfully!",
                });
            });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { login, register };
