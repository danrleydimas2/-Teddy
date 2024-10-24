import {Router} from "express"
import {getUsers} from "../handlers/users.ts"
import {createUser} from "../handlers/users.ts"
import {login} from "../handlers/users.ts"
import {profile} from "../handlers/users.ts"
import { authMiddleware } from "../middlewares/authMiddleware.ts"

const router = Router();
// /api/users
router.get("/",authMiddleware,getUsers);
// /api/users
router.post('/',createUser)
router.get('/login',login)
router.get('/profile',authMiddleware,profile)
export default router;