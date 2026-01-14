import { Request, Response } from "express";
import { postService } from "./post.service";
import { error } from "node:console";

const createPost = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                error: "Unauthorized!"
            })
        }
        const result = await postService.createPost(req.body, req.user.id as string)

        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Post creation failed",
            details: e
        })
    }
}


const getAllPosts = async (req: Request, res: Response) => {
    try {

        const { search } = req.query
        const searchString = typeof search === 'string' ? search : undefined

        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

        const result = await postService.getAllPosts({ search })
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Post creation failed",
            details: e
        })
    }
}



export const PostController = {
    createPost,
    getAllPosts
}