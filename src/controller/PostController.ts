import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { PostDatabase } from "../database/PostDatabase"
import { GetPostsInputDTO } from "../dto/UserDTO"
import { BaseError } from "../errors/BaseError"

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ){}

    public getPosts = async (req: Request, res: Response) => {
        try {
            const input: GetPostsInputDTO = {
                token: req.headers.authorization
            }
            
            const output = await this.postBusiness.getPosts(input)
            
            res.status(200).send(output)

        } catch (error) {
            console.log(error)

            if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }


    // public createPost = async (req: Request, res: Response) => {
    //     try {
    //         const input = {
    //             id: req.body.id,
    //             creatorId: req.body.creator_id,
    //             content: req.body.content
    //         }

    //         const postBusiness = new PostBusiness()
    //         const output = await postBusiness.createPost(input)

    //         res.status(201).send(output)
            
    //     } catch (error) {
    //         console.log(error)

    //         if(req.statusCode === 200){
    //             res.status(500)
    //         }

    //         if(error instanceof Error){
    //             res.send(error.message)
    //         } else {
    //             res.send("Erro inesperado")
    //         }
    //     }
    // }

    // public editPost = async (req: Request, res: Response) => {
    //     try {
    //         const input = {
    //             idToEdit: req.params.id,
    //             newContent: req.body.content
    //         }

    //         const postBusiness = new PostBusiness()
    //         const output = await postBusiness.editPost(input)

    //         res.status(200).send(output)
            
    //     } catch (error) {
    //         console.log(error)
            
    //         if(req.statusCode === 200){
    //             res.status(500)
    //         }

    //         if(error instanceof Error){
    //             res.send(error.message)
    //         } else {
    //             res.send("Erro inesperado")
    //         }
    //     }
    // }

    // public deletePost = async (req: Request, res: Response) => {
    //     try {
    //         const input = {
    //             idToDelete: req.params.id
    //         }

    //         const postBusiness = new PostBusiness()
    //         const output = await postBusiness.deletePost(input)

    //         res.status(200).send(output)

    //     } catch (error) {
    //         console.log(error)
            
    //         if(req.statusCode === 200){
    //             res.status(500)
    //         }

    //         if(error instanceof Error){
    //             res.send(error.message)
    //         } else {
    //             res.send("Erro inesperado")
    //         } 
    //     }
    // }
}