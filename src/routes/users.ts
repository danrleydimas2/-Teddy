import {Router} from "express"
import {getUsers} from "../handlers/users.ts"
import {createUser} from "../handlers/users.ts"
import {login} from "../handlers/users.ts"
import {profile} from "../handlers/users.ts"
import { authMiddleware } from "../middlewares/authMiddleware.ts"
// import {uuid} from 'uuidv4'
// import jwt from 'jsonwebtoken'



// const jwt = {
//     secret:'6845c17d298d95aa942127bdad2ceb9b',
//     expiresIn: '1d'
// }
const router = Router();
// /api/users
router.get("/",authMiddleware, getUsers);

// /api/users
router.post('/',createUser)

router.get('/login',login)

router.get('/profile',authMiddleware,profile)
export default router;