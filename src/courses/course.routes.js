import { Router } from "express";
import { check } from "express-validator";
import { deleteCourse, getCourses, saveCourse, updateCourse } from "./course.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRole } from "../middlewares/validate-roles.js";
import { existUserById } from "../helpers/db-validator.js";

const router = Router();

router.get("/", getCourses)

router.post(
    "/",
    [
        validateJWT,
        hasRole("TEACHER_ROLE"),
        check("email", "Not a valid email").isEmail(),
        validateFields
    ],
    saveCourse
);

router.delete(
    "/:id",
    [
        validateJWT,
        hasRole("TEACHER_ROLE"),
        check("id", "Not a valid ID").isMongoId(),
        validateFields
    ],
    deleteCourse
)

router.put(
    "/:id",
    [
        validateJWT,
        check("id", "Not a valid ID").isMongoId(),
        validateFields
    ],
    updateCourse
)

export default router;
