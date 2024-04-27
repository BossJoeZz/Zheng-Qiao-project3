const model = require('mongoose').model;

const PwdSchema = require('../schema/pwd.schema.cjs');
const PwdModel = model('Pwd', PwdSchema);
function insertPwd(pwd) {
    return PwdModel.create(pwd);
}
function getPwdByOwner(owner) {
    return PwdModel.find({
        owner: owner,
    }).exec();
}
function deletePwd(id) {
    return PwdModel.deleteOne({ _id: id })
}
function updatePwd(id, pwd) {
    return PwdModel.findOneAndUpdate({ _id: id }, pwd)
}
function getPwdById(id) {
    return PwdModel.findById(id).exec();
}


module.exports = {
    insertPwd,
    getPwdByOwner,
    deletePwd,
    updatePwd,
    getPwdById
}
