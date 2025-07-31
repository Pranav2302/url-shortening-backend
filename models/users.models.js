import mongoose from "mongoose";

const User_schema=new mongoose.Schema({
    short_id:{
        type:String,
        required:true,
        unique:true
    },
    redirected_url:{
        type:String,
        required:true
    },
    visitedHistory:[{timestamp:{type:Number}}]
},{timestamps:true})

const URL = mongoose.model("url",User_schema);

export default URL;