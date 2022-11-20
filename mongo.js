const mongoose = require('mongoose')
const mongoPath = 'mongodb://tkbot:Osheh8nqmTD3bEd8@trukishairlinesbot-shard-00-00.ofvwd.mongodb.net:27017,trukishairlinesbot-shard-00-01.ofvwd.mongodb.net:27017,trukishairlinesbot-shard-00-02.ofvwd.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ak43nt-shard-0&authSource=admin&retryWrites=true&w=majority'

//Rtor69td3NXA58bg

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
    })
    return mongoose
}