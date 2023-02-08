export enum ROLE_USER{
    ADMIN = "Administrador",
    USER = "Usuário"
}

export interface UserDB{
    id: string,
    name: string,
    email: string,
    password: string,
    role: ROLE_USER,
    created_at: string
}

export interface PostDB{
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}

export interface CreatePost{
    id: string,
    creator_id: string
    content: string
}

export interface LikesAndDislikes{
    user_id: string,
    post_id: string,
    like: number
}