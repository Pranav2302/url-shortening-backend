import express from 'express';
import dotenv from 'dotenv';
import { connectMongoDb } from './connect.js';
import urlRoute from './routes/urls.js';
import URL from "./models/users.models.js"
dotenv.config();

const app = express();

connectMongoDb(process.env.MONGODB)
.then(()=>console.log("Connecting to mongoDb"))

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Welcome to the URL Shortener API");
});

app.use('/url',urlRoute);

app.get('/:shortid',async (req,res)=>{
    const shortid=req.params.shortid;
    const entry = await URL.findOneAndUpdate(
        {
            short_id : shortid
        },
        {
            $push:{visitedHistory:{timestamp:Date.now()}}
        },
        {new:true}
    )
    if (entry) {
        res.redirect(entry.redirected_url);
    } else {
        res.status(400).send("URL NOT FOUND")
    }
})

app.listen(process.env.PORT,()=>
   console.log(`Server is listening at port ${process.env.PORT}`)
)