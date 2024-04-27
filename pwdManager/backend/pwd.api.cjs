const cookieHelper = require('./cookie.helper.cjs');
const express = require('express');
const router = express.Router();
const PwdModel = require("./db/model/pwd.model.cjs");

//api/pwd
router.get('/', async function (req, res) {
    const owner = cookieHelper.cookieDecryptor(req);
    if (!owner) {
        res.status(401);
        return res.send("You need to be logged in to create a Pwd!")
    }
    try {
        const allPwdResponse = await PwdModel.getPwdByOwner(owner);
        return res.send(allPwdResponse);
    } catch (error) {
        res.status(400);
        return res.send("Error inserting Pwd into DB :/");
    }

})
router.get('/:user', async function (req, res) {
    let myuser = req.params.user
    const allPwdResponse = await PwdModel.getPwdByOwner(myuser);
    return res.send(allPwdResponse);
})
router.post('/', async function (req, res) {
    const requestBody = req.body;
    const username = cookieHelper.cookieDecryptor(req);
    if (!username) {
        res.status(401);
        return res.send("You need to be logged in to create a Pwd!")
    }
    // console.log(requestBody.url)
    // console.log(requestBody.pwd)
    if (!requestBody.url || !requestBody.pwd) {
        res.status(401);
        return res.send("Please insert valid url and pwd")
    }
    const newPwd = {
        url: requestBody.url, pwd: requestBody.pwd, owner: username,
    }
    try {
        const response = await PwdModel.insertPwd(newPwd);
        return res.send(response);
    } catch (error) {
        res.status(400);
        return res.send(error);
    }
})
router.put('/:pwdId', async function (req, res) {
    const pwdId = req.params.pwdId;
    const pwdData = req.body;
    const owner = cookieHelper.cookieDecryptor(req);

    if (!owner) {
        res.status(401);
        return res.send("You need to be logged in to create a pwd!")
    }

    if (!pwdData.url || !pwdData.pwd) {
        res.status(400);
        return res.send("You need to include the pwd name and color in your request");
    }
    try {
        const getpwdResponse = await PwdModel.getPwdById(pwdId);
        if (getpwdResponse !== null && getpwdResponse.owner !== owner) {
            res.status(400);
            return res.send("You do not own this pwd!");
        }
        const pwdUpdateResponse = await PwdModel.updatePwd(pwdId, pwdData);
        return res.send('Successfully updated pwd ID ' + pwdId)
    } catch (error) {
        res.status(400);
        return res.send(error);
    }
})
router.delete('/:pwdId', async function (req, res) {
    const pwdId = req.params.pwdId;
    // console.log(pwdId)
    const owner = cookieHelper.cookieDecryptor(req);
    if (!owner) {
        res.status(401);
        return res.send("You need to be logged in !")
    }
    try {
        const deletepwdResponse = await PwdModel.deletePwd(pwdId);
        return res.send(deletepwdResponse);
    } catch (error) {
        res.status(400);
        return res.send(error);
    }
})

module.exports = router;
