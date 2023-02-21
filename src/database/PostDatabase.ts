import { LikeOrDislikeDB, PostDB, PostWithCreatorDB, POST_LIKE } from "../types";
import { BaseDatabase } from "./BaseDatabase";


export class PostDatabase extends BaseDatabase{
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"

    public async getPostsWithCreators(): Promise <PostWithCreatorDB[]>{
        const result: PostWithCreatorDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS).select(
            "posts.id",
            "posts.creator_id",
            "posts.content",
            "posts.likes",
            "posts.dislikes",
            "posts.created_at",
            "posts.updated_at",
            "users.name AS creator_name"
        ).join("users", "posts.creator_id", "=", "users.id")

        return result
    }

    public async findPostsById(id: string): Promise <PostDB | undefined> {
        const result: PostDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS).select().where({id})

        return result[0]
    }

    public async insertPost(newPostDB: PostDB): Promise <void>{
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(newPostDB)
    }


    public async updatePost(idToEdit: string, newPostDB: PostDB): Promise <void>{
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).update(newPostDB).where({id: idToEdit})
    }


    public async deletePost(idToDelete: string): Promise <void>{
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).delete().where({id: idToDelete})
    }

    public async findPostWithCreator(postId: string): Promise <PostWithCreatorDB | undefined>{
        const result: PostWithCreatorDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS).select(
            "posts.id",
            "posts.creator_id",
            "posts.content",
            "posts.likes",
            "posts.dislikes",
            "posts.created_at",
            "posts.updated_at",
            "users.name AS creator_name"
        ).join("users", "posts.creator_id", "=", "users.id").where("posts.id", postId)

        return result[0]
    }

    public async likeOrDislikePost(likeDislike: LikeOrDislikeDB): Promise <void>{
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).insert(likeDislike)
    }

    public async findLikeDislike(likeDislikeToFind: LikeOrDislikeDB): Promise <POST_LIKE | null>{
        const [ likeDislikeDB ]: LikeOrDislikeDB[] = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).select().where({
            user_id: likeDislikeToFind.user_id,
            post_id: likeDislikeToFind.post_id
        })

        if(likeDislikeDB){
            return likeDislikeDB.like === 1 ? POST_LIKE.ALREADY_LIKED : POST_LIKE.ALREADY_DISLIKED
        } else {
            return null
        }
    }

    public async removeLikeDislike(likeDislike: LikeOrDislikeDB): Promise <void>{
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).delete().where({
            user_id: likeDislike.user_id,
            post_id: likeDislike.post_id
        })
    }

    public async updateLikeDislike(likeDislike: LikeOrDislikeDB){
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).update(likeDislike).where({
            user_id: likeDislike.user_id,
            post_id: likeDislike.post_id
        }) 
    }
}
