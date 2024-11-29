import express from "express"
import {handelNewUrl,handleanalytics} from "../controller/user_controller.js"
import { rateLimitMiddleware } from '../middleware/rateLimitMiddleware.js';
const router = express.Router();

router.post('/',rateLimitMiddleware,handelNewUrl)

router.get('/analytics/:shortid',handleanalytics)
export default router;