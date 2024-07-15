import express from 'express';
let router = express.Router()

import postRouter from './routes/post.mjs'
router.use(postRouter)

// router.use((req, res, next) => {
//     const token = "valid"
//     if (token === "valid") {
//         next();
//     } else {
//         res.status(401).send({ message: "invalid token" })
//     }
// })

export default router

// get one post
// time