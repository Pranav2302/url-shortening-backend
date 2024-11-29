import { ratelimit } from './rateLimit.js';

export const rateLimitMiddleware = async (req, res, next) => {
    const ip = 
        req.headers['x-forwarded-for'] || 
        req.ip || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress ||
        'unknown';
        console.log(req.ip,req.headers)
    try {
        const { success, limit, remaining, reset } = await ratelimit.limit(ip);
        console.log(limit,remaining);
        if (!success) {
            return res.status(429).json({
                error: "Too many requests",
                limit,
                remaining,
                resetIn: reset
            });
        }

        next();
    } catch (error) {
        console.error('Rate limit middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};