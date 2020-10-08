const dbPass = 'hEGvdbz1dBftRH1n';
const dbName = 'blocksi';
const jwtSecret = 'FXpLrV9T*2$w!3U#6$r3FB$^0LAg%r!TqHC7tra6LPcEaBK^C'
const jwtExpirationInterval = 15
// mongodb cloud url: https://cloud.mongodb.com/
// mail: mongo@dl4v.com
// pass: 2020"="="
module.exports = {
    env: 'development',
    port: 8000,
    mongo : {
        uri: `mongodb+srv://test:${dbPass}@cluster0.kfl4t.mongodb.net/${dbName}?retryWrites=true&w=majority`,
    },
    jwtSecret,
    jwtExpirationInterval
}