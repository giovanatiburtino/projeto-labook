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

    public editPost = async (input: any) => {
        const {
            idToEdit,
            newContent,
        } = input

        if(newContent !== undefined){
            if(typeof newContent !== "string"){
                throw new Error ("Name deve ser string")
            }

            if(newContent.length < 2){
                throw new Error ("Content deve possuir pelo um caracter")
            }
        }

        const postDatabase = new PostDatabase()
        const postToEditDB = await postDatabase.findPostsById(idToEdit)

        if(!postToEditDB){
            throw new Error("O post não foi encontrado. Verifique a id.")
        }

        const post = new Post (
            postToEditDB.id,
            postToEditDB.creator_id,
            postToEditDB.content,
            postToEditDB.likes,
            postToEditDB.dislikes,
            postToEditDB.created_at,
            postToEditDB.updated_at
        )

        newContent && post.setContent(newContent)


        const updatedPostDB: CreatePost = {
            id: post.getId(),
            creator_id: post.getCreatorId(),
            content: post.getContent()
        }


        await postDatabase.updatePost(updatedPostDB)

        const output = {
            message: "Post atualizado com sucesso!",
            post: post
        }

        return output
    }
    
    public deletePost = async (input: any) => {
        const { idToDelete } = input 

        const postDatabase = new PostDatabase()
        const postToDeleteDB = await postDatabase.findPostsById(idToDelete)

        if(!postToDeleteDB){
            throw new Error ("Post não encontrado. Verifique a id.")
        }

        await postDatabase.deletePost(postToDeleteDB.id)

        const output = {
            message: "Post deletado com sucesso"
        }

        return output
    }
    
}