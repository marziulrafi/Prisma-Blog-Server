import express, { Router } from 'express';
import { CommentController } from './comment.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = express.Router();


router.post(
    "/",
    auth(UserRole.USER, UserRole.ADMIN),
    CommentController.createComment
)

router.get(
    "/:commentId",
    CommentController.getCommentById
)


export const CommentRouter: Router = router;