const cookieHelper = require('./cookie.helper.cjs');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('./db/model/user.model.cjs')
const {getUserByUsername} = require("./db/model/user.model.cjs");

// localhost:8000/users/?startOfUsername=h
router.post('/register', async function (request, response) {
    const requestBody = request.body;

    const username = requestBody.username;
    const password = requestBody.password;

    const newUser = {
        username: username,
        password: password
    };

    try {
       await userModel.insertUser(newUser);

        const cookieData = { username: username };

        const token = jwt.sign(cookieData, 'PWD_SECRET', {
            expiresIn: '14d'
        });

        response.cookie('token', token, { httpOnly: true });

        return response.send('User with username ' + username + ' created.')
    } catch (error) {
        response.status(400);
        return response.send('Failed to create user with message ' + error)
    }

});

router.post('/login', async function (request, response) {
    const username = request.body.username;
    const password = request.body.password
    try {
        const getUserResponse = await userModel.getUserByUsername(username);
        if (!getUserResponse) {
            response.status(400);
            return response.send('No user found.')
        }

        if (password !== getUserResponse.password) {
            response.status(400)
            return response.send('Passwords don\'t match.')
        }

        const cookieData = { username: username };

        const token = jwt.sign(cookieData, 'PWD_SECRET', {
            expiresIn: '14d'
        });

        response.cookie('token', token, { httpOnly: true });
        const jsonResponse = {
            msg: 'Logged in!',
            receiver: getUserResponse.receiver
        };
        return response.json(jsonResponse);

    } catch (error) {
        response.status(400);
        const jsonResponse = {
            msg:'Failed to login: ' + error,
            receiver: ''
        };
        return  response.json(jsonResponse);
    }
});

router.get('/loggedIn', async function (request, response) {
    const username = cookieHelper.cookieDecryptor(request);
    if (username) {
        const getUserResponse = await userModel.getUserByUsername(username);
        return response.send({
            msg:'logged in!',
            username: username,
            receiver: getUserResponse.receiver||'',
            shared:getUserResponse.shared
        });
    } else {
        response.status(400);
        return response.send('Not logged in');
    }
})

router.post('/logout', function (request, response) {
    response.clearCookie('token');
    response.status(200)
    return response.send('Logged out');
});
router.get('/share/:shareuser',async function(request,response){
    let newReceiver =request.params.shareuser
    const username = cookieHelper.cookieDecryptor(request);
    if (username) {
        if(username===newReceiver){
            response.status(400);
            return response.send('cannot be the same');
        }else {
            const getUserResponse = await userModel.getUserByUsername(newReceiver);
            if (getUserResponse){
                await userModel.UpdateReceiverByUser(username,newReceiver);
                response.status(200);
                return response.send('success');
            }else{
                response.status(400);
                return response.send('there is no receiver');
            }
        }
    } else {
        response.status(400);
        return response.send('Not logged in');
    }
})
router.post('/shareadd/:shareuser',async function(request,response){
    let newShare =request.params.shareuser
    const username = cookieHelper.cookieDecryptor(request);
    if (username) {
        let me=await userModel.getUserByUsername(username)
        if (me.shared.includes(newShare)) {
            response.status(200);
            return response.send('this user has been added');
        }else{
            await userModel.UpdateSharedUser(username,newShare);
            response.status(200);
            return response.send('success');
        }
    } else {
        response.status(200);
        return response.send('Not logged in');
    }
})

router.get('/sharedel',async function(request,response){
    const username = cookieHelper.cookieDecryptor(request);
    if (username) {
        await userModel.UpdateReceiverByUser('',username);
        response.status(200);
        return response.send('share delete success');
    } else {
        response.status(400);
        return response.send('Not logged in');
    }
})


module.exports = router;
