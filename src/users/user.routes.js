import { Router } from "express";
import { check } from "express-validator";
import { getUsers } from "./user.controller.js";

const router = Router();

router.get("/", getUsers);

export default router;