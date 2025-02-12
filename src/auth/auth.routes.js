import { Router } from 'express';
import { register } from './auth.controller.js';
import { registerValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/deleteFileOnError.js';

const router = Router();

router.post(
    '/register',
    registerValidator,
    deleteFileOnError,
    register
);

export default router;