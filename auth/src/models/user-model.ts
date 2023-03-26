import mongoose from "mongoose";
import { Password } from "../service/password";
const {Schema} = mongoose


// This interface describe the properties of create the User

interface UserAttr {
    email:string
    password:string
}

// This interface describe the properties of user Model
interface UserModel extends mongoose.Model<UserDoc>{
   buildUser(attr:UserAttr):UserDoc
}


interface UserDoc extends mongoose.Document{
    email:string
    password:string
}



const userSchema  = new Schema({
   email:{
       type:String,
       required:true 
   },
   password:{
      type: String,
      required:true
   }
},{
    toJSON:{
       versionKey:false,
       transform(doc, ret, options) {
           ret.id = ret._id
           delete ret._id
           delete ret.password
       },
    }
})


// We overwrite the  mongoose model 

userSchema.pre("save", async  function(done){
   if(this.isModified("password")){
     let newPassword = await Password.toHash(this.get("password"))
     this.set("password",newPassword)
     done()
   }
})

userSchema.statics.buildUser= (attr:UserAttr)=>{
    return new User(attr)
}


// model accept two generic 
// 1, UserDoc -> return single user based on first parameter
// 2  UserModel -> return whole model based on second parameter

const User  = mongoose.model<UserDoc, UserModel>('User',userSchema)
 

export {User}

// method 1

// const buildUser =(attr:UserAttr)=>{
//    return new User(attr)
// }

