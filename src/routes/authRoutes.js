import express from 'express'
import User from '../services/mongodb/models/User'
const router = express.Router()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import isAdmin from '../middlewares/isAdmin'
import { body, validationResult } from 'express-validator'

/*
type : GET
path : /api/v1/auth/users
params : none
isProtected: true (admin)
*/

/*
type : GET
path : /api/v1/auth/verify/:token
params : none
isProtected: true (admin)
*/

router.get('/verify/:token', async (req, res) => {
    try {
        const tokendata = await jwt.verify(req.params.token, process.env.JWT_SECRET)
        return res.json({ 
            success: true,
            data:{
                token:req.params.token,
                user: tokendata
            },
            message:"verified"
         })
    } catch (error) {
        console.log(error.message)
         return res.json({ 
            success: false,
            data:null,
            message:"token expired login again"
         })
    }
})


router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find({})
        res.json({ users })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ users: [] })
    }
})

/*
type : POST
path : /api/v1/auth/signup
params : none
isProtected: false 
*/

router.post('/signup',
    body('firstName').isLength({ min: 5 }),
    body('email').isEmail(),
    body('password').isLength({ min: 2 })
    , async (req, res) => {

        const { errors } = validationResult(req)

        if (errors.length > 0) return res.status(403).json({ errors, message: "Bad request" })

        try {
            const { firstName, lastName = '', email, password } = req.body
            //Use bcrypt to hash password
            const salt = await bcrypt.genSalt(5)
            const hashedPassword = await bcrypt.hash(password, salt)

            const user = new User({ firstName, lastName, email, password: hashedPassword })

            await user.save()

            res.json({ user })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ users: {} })
        }
    })

/*
type : POST
path : /api/v1/auth/login
params : none
isProtected: false 
*/

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body
        //find the user
        const user = await User.findOne({ email })
        if (user) {
            const isVerified = await bcrypt.compare(password, user.password)
            if (isVerified) {
                const { _id, role,email } = user
                const token = jwt.sign({ _id, role }, process.env.JWT_SECRET, { expiresIn: "24h" })
                return res.json({ 
                    success:true,
                    data:{
                        token,user:{email,role}
                    },
                    message:"Login Successful"
                 })
            } else {
                return res.json({ success:false,data:{}, message: "Unauthorised" })
            }
        }
        return res.json({ success:false,data:{}, message: "user doesn't exist" })

    } catch (error) {
        console.log(error.message)
        return res.json({ success:false,data:{}, message: "server error" })

    }
})

/*
type : POST
path : /api/v1/auth/verify/:token
params : none
isProtected: false 
*/

router.post('/verify/:token', async (req, res) => {

    try {
        const { token } = req.params
        const {_id,role} = await jwt.verify(token, process.env.JWT_SECRET);
        //find the user
        const user = await User.findOne({ _id })
        return res.json({ success:false,data:{
            user:{email:user.email,role}
        }, message: "user doesn't exist" })

    } catch (error) {
        console.log(error.message)
        return res.json({ success:false,data:{}, message: "server error" })

    }
})


export default router