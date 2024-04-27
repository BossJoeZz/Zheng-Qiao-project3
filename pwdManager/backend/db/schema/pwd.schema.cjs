const Schema = require('mongoose').Schema;

module.exports = new Schema({
    url:{
        type:String,
        required :true,
    },
    pwd:{
        type:String,
        required :true,
    },
    owner: {
        type:String,
        required :true,
    },
    created: {
        type: Date,
        default: Date.now
    }
}, { collection : 'UrlPwds' });
