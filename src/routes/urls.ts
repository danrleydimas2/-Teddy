import {Router} from "express";
import {getUrls, shortenUrl,redirectUrl,list,update, deleteUrl,url} from "../handlers/urls.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts"
import { verifyLogin } from "../middlewares/authMiddleware.ts"
const router = Router();
router.post('/shortenUrl',verifyLogin, shortenUrl)
router.get('/url/:id',authMiddleware,url)
router.get('/urls',authMiddleware, getUrls)
router.get('/:id',verifyLogin, redirectUrl)
router.get('/list/:id',authMiddleware, list)

router.put('/:id',authMiddleware, update)
router.delete('/:id',authMiddleware, deleteUrl)

export default router;