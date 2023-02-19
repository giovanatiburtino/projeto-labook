import { CreatePost, PostDB, PostWithCreatorDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";


export class PostDatabase extends BaseDatabase{
    public static TABLE_POSTS = "posts"

    public async getPostsWithCreators(){
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
}
