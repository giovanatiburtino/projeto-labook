import { PostDatabase } from "../database/PostDatabase"
import { Post } from "../models/Post"
import { CreatePost, PostDB } from "../types"

export class PostBusiness{
    public getPosts = async () => {
        const postDatabase = new PostDatabase()
        const postsDB: PostDB[] = await postDatabase.findPosts()

        const posts = postsDB.map((postDB) => new Post(
            postDB.id,
            postDB.creator_id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at
        ))

        return ({posts: posts})
    }


    public createPost = async (input: any) => {
        const { id, creatorId, content } = input

        const postDatabase = new PostDatabase()
        const postDBExists = await postDatabase.findPostsById(id)
    

        if (postDBExists) {
            throw new Error("'id' já existe")
        }
    

        const newPost = new Post (
            id,
            creatorId,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString()
        )
    
        const newPostDB: PostDB = {
            id: newPost.getId(),
            creator_id: newPost.getCreatorId(),
            content: newPost.getContent(),
            likes: newPost.getLikes(),
            dislikes: newPost.getDislikes(),
            created_at: newPost.getCreatedAt(),
            updated_at: newPost.getUpdatedAt()
        }

        await postDatabase.insertPost(newPostDB)

        const output = {message: "Cadastro realizado com sucesso!", posts: newPost}

        return output
    }
}