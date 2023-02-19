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

    public async findPosts(){ //método async do index
      
        const postsDB: PostDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
        
        return postsDB
    }

    public async findPostsById(id: string | undefined){
        const [postsDB]: PostDB[] | undefined = await BaseDatabase.connection(PostDatabase.TABLE_POSTS).where({id})

        return postsDB
    }

    public async insertPost(newPostDB: PostDB): Promise <void>{
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(newPostDB)
    }


    public async updatePost(newPostDB: CreatePost): Promise <void>{
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).update(newPostDB).where({id: newPostDB.id})
    }


    public async deletePost(id: string | undefined): Promise <void>{
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).delete().where({id})
    }
}
