const path = require('path');
const dotEnvSafe = require('dotenv-safe');

// import .env variables
dotEnvSafe.config(({
    path: path.join(__dirname, '..', '..', '.env'),
    sample: path.join(__dirname, '..', '..', '.env.example')
}));

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongo : {
        uri: process.env.MONGO_URI
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
}