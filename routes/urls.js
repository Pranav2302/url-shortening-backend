import express from "express"
import {handelNewUrl,handleanalytics} from "../controller/user_controller.js"
const router = express.Router();

router.post('/',handelNewUrl)

router.get('/analytics/:shortid',handleanalytics)
export default router;