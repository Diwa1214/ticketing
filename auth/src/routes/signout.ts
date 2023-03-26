import express from "express"

const router = express.Router()

router.get("/api/users/logout",function(req,res){
    req.session =null
    return res.status(200).send({})
})

export {router as SignoutRouter}