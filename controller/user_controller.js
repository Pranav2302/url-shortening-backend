import { nanoid } from "nanoid";
import URL from "../models/users.models.js";
import { ratelimit } from "../middleware/rateLimit.js";

function isValidUrl(urlstring) {
   const urlpattern = /^(https?:\/\/)[\w.-]+\.[a-z]{2,6}([\/\w .?%&=~-]*)?$/i;
   return urlpattern.test(urlstring);
}


async function handelNewUrl(req, res) {
    // IP detection
    const ip = 
        req.headers['x-forwarded-for'] || 
        req.ip || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress ||
        'unknown';
    
    console.log(`Received request from IP: ${ip}`);

    try {
        // Check rate limit with more comprehensive error handling
        const identifier = ip; // Use IP as the rate limit identifier
        const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

        console.log('Rate Limit Check:', {
            success,
            limit,
            remaining,
            reset
        });

        if (!success) {
            console.warn(`Rate limit exceeded for IP: ${ip}`);
            return res.status(429).json({
                error: "Too many requests. Please try again later.",
                limit: limit,
                remaining: remaining,
                resetIn: reset
            });
        }

        const body = req.body;
        //url taken 
        if (!body.url) {
            return res.status(400).json({ error: "URL is required, please enter!" });
        }
        //url validation
        console.log('Validating URL:',body.url);
        const isValid = isValidUrl(body.url); 

        if(!isValid){
            return res.status(400).json({
                error:"Invalid Url Provided. Please Enter a Valid URL"
            });
        }
        const shortid = nanoid(8);
        await URL.create({
            short_id: shortid,
            redirected_url: body.url,
            visitedHistory: []
        });

        return res.json({ id: shortid });
    } catch (error) {
        console.error('Error in handelNewUrl:', error);
        return res.status(500).json({ 
            error: "Internal server error", 
            details: error.message 
        });
    }
}

async function handleanalytics(req, res) {
    try {
        const shortid = req.params.shortid;
        const result = await URL.findOne({ short_id: shortid });
        
        if (!result) {
            return res.status(404).json({ error: "URL analytics not found" });
        }

        return res.json({
            Totalclicks: result.visitedHistory.length,
            analytics: result.visitedHistory
        });
    } catch (error) {
        console.error('Error in handleanalytics:', error);
        return res.status(500).json({ 
            error: "Internal server error", 
            details: error.message 
        });
    }
}

export { handelNewUrl, handleanalytics };
