import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'first name is required'],
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    lastname: {
        type: String,
        required: [true, 'last name is required'],
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    username: {
        type: String,
        required: [true, 'username is required'],
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 5,
        maxLength: 255,
        match: [/\S+@\S+\.\S+/, 'please fill a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;