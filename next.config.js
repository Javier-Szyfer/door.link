require("dotenv").config();

module.exports = {
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  publicRuntimeConfig: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    domains: ["radio-strapi-bucket.s3.sa-east-1.amazonaws.com"],
  },
};
