import {pbkdf2Sync,randomBytes} from "crypto"


export class Password {
    
    
    
    static async toHash (password:string){
    //   Creating a unique salt for particular user
     let salt = randomBytes(8).toString("hex")
     let hash = await Promise.resolve(pbkdf2Sync(password,salt,1000,64,"sha512").toString("hex"))

     return `${hash}.${salt}`
    }

    static async comparePassword (storedpassword:string,newPassword:string){
      // let [hashedPassword,salt] = storedpassword.split(".")
      // let newpassword_hash = await Promise.resolve(pbkdf2Sync(newPassword, salt, 1000, 64, "sha512").toString("hex"))
      // console.log(newpassword_hash)
  
      return true
    }
}