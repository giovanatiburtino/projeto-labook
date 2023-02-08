import { CreatePost, PostDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";


export class PostDatabase extends BaseDatabase{
    public static TABLE_POST = "posts"

    public async findPosts(){ //método async do index
      
        const postsDB: PostDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POST)
        
        return postsDB
    }

    public async findPostsById(id: string | undefined){
        const [postsDB]: PostDB[] | undefined = await BaseDatabase.connection(PostDatabase.TABLE_POST).where({id})

        return postsDB
    }

    public async insertPost(newPostDB: CreatePost): Promise <void>{
        await BaseDatabase.connection(PostDatabase.TABLE_POST).insert(newPostDB)
    }


    public async updatePost(newPostDB: CreatePost, id: string | undefined): Promise <void>{
        await BaseDatabase.connection(PostDatabase.TABLE_POST).update(newPostDB).where({id})
    }


    public async deletePost(id: string | undefined): Promise <void>{
        await BaseDatabase.connection(PostDatabase.TABLE_POST).delete().where({id})
    }
}
