import express from "express"
import jwt from "jsonwebtoken"
import {Auth,currentUser} from "@dkpackage/common"


const router = express.Router()

interface userPayload {
     email:string,
     password:string
}

router.get("/api/users/current_user", currentUser,Auth, function(req,res,next){
     return res.status(200).send(req.currentUser)
})

export {router as CurrentuserRouter}