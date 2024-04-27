const Schema = require('mongoose').Schema;

module.exports = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    receiver:{
        type: String,
        default:''
    },
    shared:{
        type:[String],
        default:[]
    },
    created: {
        type: Date,
        default: Date.now
    }
}, { collection : 'UrlUsers' });
