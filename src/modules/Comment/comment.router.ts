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

router.get(
    "/author/:authorId",
    CommentController.getCommentsByAuthor
)

router.patch(
    "/:commentId",
    auth(UserRole.USER, UserRole.ADMIN),
    CommentController.updateComment
)


export const CommentRouter: Router = router;