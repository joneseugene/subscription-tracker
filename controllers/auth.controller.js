import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
    //Check to ensure everything is ok from db end
    const session = await mongoose.startSession();
    session.startTransaction()

    try {
        //Create new user
        const { firstname, lastname, username, email, password } = req.body;

        //Check if User exists
        const existingUser = await User.findOne({ email })
        if(existingUser){
            const error = new Error('User already exists')
            error.statusCode = 409
            throw error
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUsers = await User.create([{ firstname, lastname, username, email, password: hashedPassword }], { session })
        //Jwt
        const token = jwt.sign(
            { userId: newUsers[0]._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        await session.commitTransaction();
        session.endSession();

        // Remove password from response
        const userResponse = { ...newUsers[0]._doc };
        delete userResponse.password;

        res.status(201).json({
            success: true,
            title: 'SUCCESS',
            message: 'User created successfully',
            data: {
                token,
                user: userResponse 
            }
        });
    } catch (error) {
        //terminate if something goes wrong
        await session.abortTransaction();
        session.endSession();
        next(error);

    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password} = req.body

        const user = await User.findOne( {email})
        if(!user){
            const error = new Error('Invalid Username / Password')
            error.statusCode = 401
            throw error
        }

        //check password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            const error = new Error('Invalid Username / Password')
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({
            success: true,
            message: 'Sign-In successful',
            data: {
                token,
                user
            }
        })
    } catch (error) {
        next(error)
    }
}

export const signOut = async (req, res, next) => {}