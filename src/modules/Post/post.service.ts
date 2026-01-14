import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, "id" | "createdAT" | "updatedAt" | "authorId">, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result
}

const getAllPosts = async (payload: {
    search: string | undefined,
    tags: string | []
}) => {
    const allPosts = await prisma.post.findMany({
        where: {
            AND: [
                {
                    OR: [
                        {
                            title: {
                                contains: payload.search as string,
                                mode: "insensitive"
                            }
                        },
                        {
                            content: {
                                contains: payload.search as string,
                                mode: "insensitive"
                            }
                        },
                        {
                            tags: {
                                has: payload.search as string
                            }
                        }
                    ]
                },

                {
                    tags: {
                        hasEvery: payload.tags as string[]
                    }
                }
            ]
        }
    })
    return allPosts
}


export const postService = {
    createPost,
    getAllPosts
}