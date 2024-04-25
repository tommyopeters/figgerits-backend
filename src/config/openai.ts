const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();


export const openai = new OpenAI(process.env.OPENAI_API_KEY);