const mongoose = require('mongoose');
const Lecture = require('./lecture.model');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Course title is required']
    },
    description: String,
    lectures: [{
        type: Schema.Types.ObjectId,
        ref: 'Lecture'
    }],
    master: {
        required: [true, 'A master is required'],
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    learners: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    courseLength: {
        type: Number, // in months
        required: [true, 'An estimate of the course duration (in months) is required']
    },
    isLive: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

courseSchema.pre('deleteMany', function (next) {
    console.log('Removing all lectures!');
    if (this._conditions.master) {
        return Course.find({ master: this._conditions.master }, '_id')
        .then(ids => Lecture.deleteMany({ course: { $in: ids } }).exec())
    } else {
        return Lecture.deleteMany({}).exec();
    }
});

courseSchema.pre('findOneAndDelete', function (next) {
    console.log('Removing all corresponding lectures!');
    return Lecture.deleteMany({ course: this._conditions._id }).exec();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;