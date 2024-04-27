const model = require('mongoose').model;
const UserSchema = require('../schema/user.schema.cjs');

const UserModel = model('User', UserSchema);

function insertUser(user) {
    return UserModel.create(user);
}
function getUserByUsername(username) {
    return UserModel.findOne({username: username}).exec();
}
function UpdateReceiverByUser(username, newReceiver) {
    return  UserModel.findOneAndUpdate(
        { username: newReceiver },
        { $set: { receiver: username } },
        { new: true }
    );
}
function UpdateSharedUser(username,newShare){
    return  UserModel.findOneAndUpdate(
        { username: username },
        { $push: { shared: newShare } },
        { new: true }
    );
}
module.exports = {
    insertUser,
    getUserByUsername,
    UpdateReceiverByUser,
    UpdateSharedUser
}
