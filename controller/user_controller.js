import {nanoid} from "nanoid";
import URL from "../models/users.models.js"
async function handelNewUrl(req,res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error:"URL is required, please enter!"}); 
    const shortid = nanoid(8);
    await URL.create({
        short_id : shortid,
        redirected_url : body.url,
        visitedHistory : [] 
    })
    return res.json({id : shortid})

}

async function handleanalytics(req,res){
    const shortid=req.params.shortid;
    const result = await URL.findOne({short_id:shortid});
    console.log(result);
    return res.json({
        Totalclicks:result.visitedHistory.length,
        analytics:result.visitedHistory})
}
export { handelNewUrl,handleanalytics }