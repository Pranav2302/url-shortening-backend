import express from 'express';
import dotenv from 'dotenv';
import { connectMongoDb } from './connect.js';
import urlRoute from './routes/urls.js';
import URL from "./models/users.models.js"
import cors from 'cors';
dotenv.config();

const app = express();

connectMongoDb(process.env.MONGODB)
.then(()=>console.log("Connecting to mongoDb"))

const corsOptions = {
    origin: ['https://url-shortening-backend-delta.vercel.app/','http://localhost:3000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  };
  
  app.use(cors(corsOptions))
app.use(express.json())

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