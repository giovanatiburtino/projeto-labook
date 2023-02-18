import { UserDatabase } from "../database/UserDatabase";
import { LoginInputDTO, LoginOutputDTO, SignupInputDTO, SignupOutputDTO } from "../dto/UserDTO";
import { BadRequestError } from "../errors/BaseRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { TokenPayload, UserDB, USER_ROLES } from "../types";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) {}

    public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        const { name, email, password } = input

        if(typeof name !== "string"){
            throw new BadRequestError("Name deve ser string.")
        }

        if(typeof email !== "string"){
            throw new BadRequestError("Email deve ser string.")
        }

        if(typeof password !== "string"){
            throw new BadRequestError("Password deve ser string.")
        }

        const id = this.idGenerator.generate()
        const hashedPassword = await this.hashManager.hash(password)

        const newUser = new User(
            id,
            name,
            email,
            hashedPassword,
            USER_ROLES.NORMAL,
            new Date().toISOString()
        )

        const userDB = newUser.toDBModel()
        
        await this.userDatabase.insert(userDB)

        const payload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }

        const token = this.tokenManager.createToken(payload)

        const output: SignupOutputDTO = {
            token
        }

        return output
    }

    public login = async (input: LoginInputDTO): Promise <LoginOutputDTO> => {
        const { email, password } = input

        if(typeof email !== "string"){
            throw new BadRequestError("Email deve ser string.")
        }

        if(typeof password !== "string"){
            throw new BadRequestError("Password deve ser string.")
        }

        const userDB: UserDB | undefined = await this.userDatabase.findByEmail(email)

       if(!userDB){
        throw new NotFoundError("Email não cadastrado.")
       }

       const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
       )

       const hashedPassword = user.getPassword()

       const isPasswordCorrect = await this.hashManager.compare(password, hashedPassword)

       if(!isPasswordCorrect){
            throw new BadRequestError("'password' incorreto")
       }

       const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
       }

       const token = this.tokenManager.createToken(payload)

       const output: LoginOutputDTO = {
            token
       }

       return output
    }
}