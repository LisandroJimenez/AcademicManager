import { body } from "express-validator";
import { validateFields } from "./validate-fields.js";
import { existEmail, existRole } from "../helpers/db-validator.js";

export const registerValidator = [
    body("name", "The name is required").not().isEmpty(),
    body("surname", "The surname is required").not().isEmpty(),
    body("email", "You must enter a valid email").isEmail(),
    body("email").custom(existEmail),
    body('role').custom(existRole),
    body("password", "Password must be at least 8 characters").isLength({ min: 8}),
    validateFields
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Enter a valid email address"),
    body("username").optional().isString().withMessage("Enter a valid username"),
    body("password", "Password must be at least 8 characters").isLength({min: 8}),
    validateFields
]