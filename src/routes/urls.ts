import {Router} from "express";
import {getUrls} from "../handlers/urls.ts";
const router = Router();

router.get('/', getUrls)

export default router;