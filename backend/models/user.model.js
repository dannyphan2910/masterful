const mongoose = require('mongoose');
const Course = require('./course.model');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: [true, 'Email address is taken'],
        required: [true, 'Email address is required'],
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
}, {
    timestamps: true,
});

userSchema.pre('deleteMany', function (next) {
    console.log('Removing all courses and lectures!');
    return Course.deleteMany({}).exec();
});

userSchema.pre('findOneAndDelete', function (next) {
    console.log('Removing all corresponding courses!');
    // delete this user's courses
    Course.deleteMany({ master: this._conditions._id }).exec();

    // unenroll this user from all courses
    Course.updateMany({}, { $pull: { learners: this._conditions._id } }).exec();
    next()
});

const User = mongoose.model('User', userSchema);

module.exports = User;