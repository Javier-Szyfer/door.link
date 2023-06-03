require("dotenv").config();

module.exports = {
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    domains: [process.env.BUCKET_URL],
  },
};
