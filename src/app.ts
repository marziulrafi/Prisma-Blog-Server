import express, { Application } from 'express';
import { PostRouter } from './modules/Post/post.router';
const app: Application = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello!!');
});  


app.use('/posts', PostRouter)


export default app;