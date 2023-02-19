import { PostDatabase } from "../database/PostDatabase"
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dto/UserDTO"
import { BadRequestError } from "../errors/BaseRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Post } from "../models/Post"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { CreatePost, PostDB, PostWithCreatorDB } from "../types"

export class PostBusiness{
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
    ){}

    public getPosts = async (input: GetPostsInputDTO): Promise <GetPostsOutputDTO> => {
        const { token } = input

        if(token === undefined){
            throw new BadRequestError("'Token' ausente")
        }

        const payload = this.tokenManager.getPayload(token)
        
        if(payload === null){
            throw new BadRequestError("Token inválido.")
        }

        const postsWithCreatorsDB: PostWithCreatorDB[] = await this.postDatabase.getPostsWithCreators()

        const posts = postsWithCreatorsDB.map((postWithCreatorDB) => {
            const post = new Post(
                postWithCreatorDB.id,
                postWithCreatorDB.content,
                postWithCreatorDB.likes,
                postWithCreatorDB.dislikes,
                postWithCreatorDB.created_at,
                postWithCreatorDB.updated_at,
                postWithCreatorDB.creator_id,
                postWithCreatorDB.creator_name 
            )

            return post.toBusinessModel()
        })

        const output: GetPostsOutputDTO = posts
        
        return output
    }


    // public createPost = async (input: any) => {
    //     const { id, creatorId, content } = input

    //     const postDatabase = new PostDatabase()
    //     const postDBExists = await postDatabase.findPostsById(id)
    

    //     if (postDBExists) {
    //         throw new BadRequestError("'id' já existe")
    //     }
    

    //     const newPost = new Post (
    //         id,
    //         creatorId,
    //         content,
    //         0,
    //         0,
    //         new Date().toISOString(),
    //         new Date().toISOString()
    //     )
    
    //     const newPostDB: PostDB = {
    //         id: newPost.getId(),
    //         creator_id: newPost.getCreatorId(),
    //         content: newPost.getContent(),
    //         likes: newPost.getLikes(),
    //         dislikes: newPost.getDislikes(),
    //         created_at: newPost.getCreatedAt(),
    //         updated_at: newPost.getUpdatedAt()
    //     }

    //     await postDatabase.insertPost(newPostDB)

    //     const output = {message: "Cadastro realizado com sucesso!", posts: newPost}

    //     return output
    // }

    // public editPost = async (input: any) => {
    //     const {
    //         idToEdit,
    //         newContent,
    //     } = input

    //     if(newContent !== undefined){
    //         if(typeof newContent !== "string"){
    //             throw new BadRequestError("Name deve ser string")
    //         }

    //         if(newContent.length < 2){
    //             throw new BadRequestError("Content deve possuir pelo um caracter")
    //         }
    //     }

    //     const postDatabase = new PostDatabase()
    //     const postToEditDB = await postDatabase.findPostsById(idToEdit)

    //     if(!postToEditDB){
    //         throw new NotFoundError("O post não foi encontrado. Verifique a id.")
    //     }

    //     const post = new Post (
    //         postToEditDB.id,
    //         postToEditDB.creator_id,
    //         postToEditDB.content,
    //         postToEditDB.likes,
    //         postToEditDB.dislikes,
    //         postToEditDB.created_at,
    //         postToEditDB.updated_at
    //     )

    //     newContent && post.setContent(newContent)


    //     const updatedPostDB: CreatePost = {
    //         id: post.getId(),
    //         creator_id: post.getCreatorId(),
    //         content: post.getContent()
    //     }


    //     await postDatabase.updatePost(updatedPostDB)

    //     const output = {
    //         message: "Post atualizado com sucesso!",
    //         post: post
    //     }

    //     return output
    // }
    
    public deletePost = async (input: any) => {
        const { idToDelete } = input 

        const postDatabase = new PostDatabase()
        const postToDeleteDB = await postDatabase.findPostsById(idToDelete)

        if(!postToDeleteDB){
            throw new NotFoundError("Post não encontrado. Verifique a id.")
        }

        await postDatabase.deletePost(postToDeleteDB.id)

        const output = {
            message: "Post deletado com sucesso"
        }

        return output
    }
    
}