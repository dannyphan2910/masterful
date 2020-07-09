const mongoose = require('mongoose');
const Course = require('./course.model');

const Schema = mongoose.Schema;

const lectureSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Lecture title is required'],
        trim: true
    }, 
    description: String,
    course: {
        type: Schema.Types.ObjectId, 
        ref: 'Course',
        required: [true, 'Lecture belongs to a Course']
    },
    date: {
        type: Date,
        required: [true, 'Lecture date is required']
    },
    length: {
        type: Number,
        required: [true, 'Lecture length estimation (in minutes) is required'],
        min: 1,
        max: 360
    }
}, {
    timestamps: true,
});

const Lecture = mongoose.model('Lecture', lectureSchema);

module.exports = Lecture;