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

        res.status(201).json({
            success: true,
            title: 'SUCCESS',
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0]
            }
        })
    } catch (error) {
        //terminate is something goes wrong
        await session.abortTransaction();
        session.endSession();
        next(error);

    }
}

export const signIn = async (req, res, next) => {}

export const signOut = async (req, res, next) => {}