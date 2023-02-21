import { PostDatabase } from "../database/PostDatabase"
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostsInputDTO, GetPostsOutputDTO, LikeOrDislikePostInputDTO } from "../dto/UserDTO"
import { BadRequestError } from "../errors/BaseRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Post } from "../models/Post"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { LikeOrDislikeDB, PostDB, PostWithCreatorDB, POST_LIKE, USER_ROLES } from "../types"

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


    public createPost = async (input: CreatePostInputDTO): Promise <void> => {
        const { token, content } = input

          
        if(token === undefined){
            throw new BadRequestError("'Token' ausente")
        }

        const payload = this.tokenManager.getPayload(token)
        
        if(payload === null){
            throw new BadRequestError("Token inválido.")
        }

        if(typeof content !== "string"){
            throw new BadRequestError("Content deve ser string.")
        }

        const id = this.idGenerator.generate()

        const newPost = new Post(
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name
        )
    
        const newPostDB = newPost.toDBModel()

        await this.postDatabase.insertPost(newPostDB)
    }

    public editPost = async (input: EditPostInputDTO) => {
        const { idToEdit, token, content } = input


        if(token === undefined){
            throw new BadRequestError("'Token' ausente")
        }

        const payload = this.tokenManager.getPayload(token)
        
        if(payload === null){
            throw new BadRequestError("Token inválido.")
        }


        if(typeof content !== "string"){
            throw new BadRequestError("Content deve ser string")
        }

        if(content.length < 2){
            throw new BadRequestError("Content deve possuir pelo um caracter")
        }
        


        const postToEditDB: PostDB | undefined = await this.postDatabase.findPostsById(idToEdit)

        if(!postToEditDB){
            throw new NotFoundError("O post não foi encontrado. Verifique a id.")
        }

        if(postToEditDB.creator_id !== payload.id){
            throw new BadRequestError("Somente quem criou a playlist pode edita-la.")
        }
       

        const post = new Post(
            postToEditDB.id,
            postToEditDB.content,
            postToEditDB.likes,
            postToEditDB.dislikes,
            postToEditDB.created_at,
            postToEditDB.updated_at,
            payload.id,
            payload.name
        )

        post.setContent(content)
        post.setUpdatedAt(new Date().toISOString())

        const updatedPostDB = post.toDBModel()

        await this.postDatabase.updatePost(idToEdit, updatedPostDB)
    }
    
    public deletePost = async (input: DeletePostInputDTO): Promise <void> => {
        const { idToDelete, token } = input 


        if(token === undefined){
            throw new BadRequestError("'Token' ausente")
        }

        const payload = this.tokenManager.getPayload(token)
        
        if(payload === null){
            throw new BadRequestError("Token inválido.")
        }


        const postDB: PostDB | undefined = await this.postDatabase.findPostsById(idToDelete)
        

        if(!postDB){
            throw new NotFoundError("O post não foi encontrado. Verifique a id.")
        }

        if(payload.role !== USER_ROLES.ADMIN && postDB.creator_id !== payload.id){
            throw new BadRequestError("Somente quem criou a playlist pode deleta-la.")
        }


        await this.postDatabase.deletePost(idToDelete)
    }


    public likeOrDislikePost = async (input: LikeOrDislikePostInputDTO): Promise <void> => {
        const { idToLikeOrDislike, token, like } = input


        if(token === undefined){
            throw new BadRequestError("'Token' ausente")
        }

        const payload = this.tokenManager.getPayload(token)
        
        if(payload === null){
            throw new BadRequestError("Token inválido.")
        }


        if(typeof like !== "boolean"){
            throw new BadRequestError("Like deve ser boolean.")
        }


        const postWithCreatorDB = await this.postDatabase.findPostWithCreator(idToLikeOrDislike)

        if(!postWithCreatorDB){
            throw new NotFoundError("O post não foi encontrado. Verifique a id.")
        }

        const likeSQLite = like ? 1 : 0 

        const likeDislike: LikeOrDislikeDB = {
            user_id: payload.id,
            post_id: postWithCreatorDB.id,
            like: likeSQLite
        }

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

        const likeDislikeExists = await this.postDatabase.findLikeDislike(likeDislike)

        if(likeDislikeExists === POST_LIKE.ALREADY_LIKED){
            if(like){
                await this.postDatabase.removeLikeDislike(likeDislike)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislike)
                post.removeLike()
                post.addDislike()
            }

        } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED){
            if(like){
                await this.postDatabase.updateLikeDislike(likeDislike)
                post.removeDislike()
                post.addLike()
            } else {
                await this.postDatabase.removeLikeDislike(likeDislike)
                post.removeDislike()
            }

        } else {
            await this.postDatabase.likeOrDislikePost(likeDislike)

            if(like){
                post.addLike()
            } else {
                post.addDislike()
            }

        }

        const updatedPostDB = post.toDBModel()

        await this.postDatabase.updatePost(idToLikeOrDislike, updatedPostDB)
    }
}