import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import dotenv from 'dotenv';
dotenv.config();

// Validate environment variables
if (!process.env.UPSTASH_REDIS_REST_URL) {
  console.error('UPSTASH_REDIS_REST_URL is missing');
  throw new Error('UPSTASH_REDIS_REST_URL is not defined in environment variables');
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.error('UPSTASH_REDIS_REST_TOKEN is missing');
  throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined in environment variables');
}

// Create a new Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

// Configure rate limiter with enhanced logging
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'), // 1 requests per 10 seconds
  analytics: true,
  prefix: '@upstash/ratelimit',
});