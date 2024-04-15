const express = require('express');
const xss = require("xss");
const bcrypt = require('bcrypt');
const users = require('../models/Users')
const validateUserInput = require('../middlewares/ValidationMiddleware')
const sendEmail = require('../middlewares/EmailSender');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const secretKey = process.env.TOKEN_KEY;
const refreshKey = process.env.REFRESH_KEY;

//create user logic ==============================

async function createUser(req, res) {
    const { first_name, last_name, role, email, user_name, password} = req.body;
    const firstName = xss(first_name);
    const lastName = xss(last_name);
    const realEmail = xss(email);
    const userName = xss(user_name);
    const realPass = xss(password);
    const user_image = req.file ? req.file.path : null;
    const validationErrors = validateUserInput.validateInput(firstName,lastName, realEmail, userName, realPass );
    if (validationErrors.length > 0) {
        return res.status(400).json({ err: validationErrors });
    }

try {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ err: 'Internal server error' });
        } else {
            bcrypt.hash(realPass, salt, async (err, hash) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ err: 'Internal server error' });
            } else {
                const existingUser = await users.findOne({ email: realEmail });
                if (existingUser) {
                    return res.status(400).json({ err: 'Email is already in use, try something else' });
                } else {
                const newUser = await users.create({
                    first_name: firstName,
                    user_image: user_image,
                    last_name: lastName,
                    role: role,
                    email: realEmail,
                    user_name: userName,
                    password: hash,
                });
                
                res.status(201).json(`signed in ${newUser}`)
                sendEmail.sendWelcomeEmailForUser(email, userName, password);
                }
            }
            });
        }
        
    });
    
    } catch (error) {
        return res.status(500).json({ err: 'Internal server error' });
    }
}


// login logic==============================

async function loginUser (req, res){
    try {
        const {user_name, password}= req.body;
        const realName = xss(user_name);
        const realPass = xss(password);
        const checkUser = await users.findOne({user_name: realName})
        if (!checkUser) {
            return res.status(401).json('invalid credentials')
        }else{
            const passwordMatch = await bcrypt.compare(realPass, checkUser.password)
                if (!passwordMatch ) {
                    return res.status(401).json('invalid credentials')
                }else{
                    const token = jwt.sign( {userId: checkUser.id, userRole: checkUser.role, name: checkUser.user_name}, secretKey, {expiresIn: '24h'});
                    const refreshToken = jwt.sign({userId: checkUser.id}, refreshKey, {expiresIn: '720h'});
                    const currentDate = new Date();
                    checkUser.last_login = currentDate;
                    await checkUser.save();
                    return res.status(200).json(
                        {
                            "access_token": token,
                            "token_type": "jwt",
                            "expires_in": "30s",
                            "refresh_token": refreshToken,
                        })
                }    
        }
    } catch (error) {
        res.status(500).json({err:error.message})
    }
    
}

// get user by id ============================================

async function getUsersId (req, res){
    const idd = req.params.id;
    console.log(idd);
    try {
        const userId = await users.findById(idd)
        if (userId) {
            res.status(200).json(userId);
        }else{
            res.status(404).json({"message": "user not found"})
        };
    } catch (error) {
        res.json(error)
    }
    
}


// search for users ================================

async function searchForUsers (req, res){
    const page = req.query.page || 1 ;
    const singlePage = 3 || '';
    const query = req.query.query
    try {
        const user = await users.find({ first_name: { $regex: new RegExp(query, 'i') } }).skip((page - 1) * singlePage).limit(singlePage);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}


// Sort users
async function sortUsers(req, res) {
    const sort = req.query.sort === 'DESC' ? -1 : 1;
    try {
        const usersList = await users.find().sort({ createdAt: sort });
        res.json(usersList);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

// update the users =====================================


async function updateUser(req, res) {
    const userId = req.params.id;
    const { first_name, last_name, user_name, password, email, role, active } = req.body;
    let updateData = { first_name, last_name, user_name, password, email, role, active };
    
    if (req.file) {
        updateData.user_image = req.file.path;
    }
    try {
        const user = await users.findByIdAndUpdate(userId, updateData);
        if (user) {
            res.status(200).json('User updated successfully');
        } else {
            res.status(404).json('No user found with the provided Id');
        }
    } catch (error) {
        res.json(error);
    }
}


// delete usesr ===================================


async function deleteUser(req, res){
    const userId = req.params.id;
    try {
        const user = await users.findByIdAndDelete(userId);
        if (user) {
            res.status(200).json('User deleted successfully');
        }else{
            res.status(404).json("no user found with the provided Id")
        };
    } catch (error) {
        res.json(error)
    }
}


//====================== refreshtokennnnnnnnnnnnnnnnnnnnnnnnnnn


async function refreshTokens(req, res) {
    try {
        const refreshToken = req.headers['authorization'].split('Bearer ')[1];
    
        if (!refreshToken) {
            return res.status(401).json('No refresh token found in the headers');
        }
        const decodedRefreshToken = jwt.verify(refreshToken, refreshKey);
        const checkUser = await users.findById({ _id: decodedRefreshToken.userId });
    
        if (!checkUser) {
            return res.status(401).json('Invalid refresh token');
        }
    
        const token = jwt.sign(
        { userId: checkUser.id, userRole: checkUser.role },
        secretKey,
        { expiresIn: '30s' }
        );
        res.status(200).json({
        access_token: token,
        token_type: 'jwt',
        expires_in: '30s',
        });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
}


//  get all users =============================
async function getAllUsers(req, res) {
    try {
        let AllUsers = await users.find({});
        if (!AllUsers) {
            throw new Error('No Users Found')
        } else {
            res.status(200).json(AllUsers)
        }
    }catch(error){
        res.status(500).json('something happened')
    }
}

//reset passsssssssss================================

async function resetRquist (req, res) {
    const { user_name } = req.body;
    try {
    const user = await users.findOne({ user_name: user_name });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 300000; 
    await user.save();
    sendEmail.sendResetEmail(user.email, resetToken);
    return res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Verify ttoken ================================
async function verifyResetToken (req, res) {
    const { token } = req.params;
    try {
        const user = await users.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });
    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
    return res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Set new Passssssssssssssssssssssss=========================
async function setNewPass (req, res) {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await users.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        const hashedPass = await bcrypt.hash(newPassword, 10);
        user.password = hashedPass;
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = {
    createUser: createUser,
    loginUser: loginUser,
    getUsersId: getUsersId,
    searchForUsers: searchForUsers,
    sortUsers:sortUsers,
    updateUser: updateUser,
    deleteUser: deleteUser,
    refreshTokens:refreshTokens,
    getAllUsers:getAllUsers,
    resetRquist:resetRquist,
    verifyResetToken:verifyResetToken,
    setNewPass:setNewPass
};