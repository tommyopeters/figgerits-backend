const Replicate = require('replicate');
export const replicate = new Replicate({
    // get your token from https://replicate.com/account
    auth: process.env.REPLICATE_API_TOKEN, // defaults to process.env.REPLICATE_API_TOKEN
  });

