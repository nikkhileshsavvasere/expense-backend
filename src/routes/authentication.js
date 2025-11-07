import { Router } from "express";
import { login, register } from "../controllers/users.js";
const authenticationRoute = Router();

authenticationRoute.post("/login", (req, res) => {
    login(req, res);
});

authenticationRoute.post("/register", (req, res) => {
    register(req, res);
});

export default authenticationRoute;
