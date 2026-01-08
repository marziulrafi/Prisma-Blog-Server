import express, { Application } from 'express';
import { PostRouter } from './modules/Post/post.router';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';

const app: Application = express();
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Hello!!');
});  


app.use('/posts', PostRouter)


export default app;