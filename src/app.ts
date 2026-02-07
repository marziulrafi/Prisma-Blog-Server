import express, { Application } from 'express';
import { PostRouter } from './modules/Post/post.router';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors'
import errorHandler from './middleware/GlobalErrorHandler';
import { CommentRouter } from './modules/Comment/comment.router';

const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());


app.use('/posts', PostRouter)
app.use('/comments', CommentRouter)

app.get('/', (req, res) => {
    res.send('Hello!!');
});

app.use(errorHandler)

export default app;