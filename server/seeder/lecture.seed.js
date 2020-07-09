var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const seeder = require('mongoose-seed');
const faker = require('faker');
const fs = require('fs');
const _ = require('lodash');
const async = require('async');

require('dotenv').config({ path: '../.env' });

const Course = require('../models/course.model');
const Lecture = require('../models/lecture.model');

const uri = process.env.ATLAS_URI;

new Promise((resolve) => {
    mongoose.connect(uri, {
        useUnifiedTopology: true,
        promiseLibrary: require('bluebird')
    });
    async.parallel([
        (callback) => {
            Course.find()
                .exec((err, user_ids) => {
                    callback(null, user_ids);
                });
        }
    ],
        (err, results) => {
            resolve(results);
            mongoose.connection.close();
        });
})
    .then((results) => {
        return new Promise((resolve) => {
            let lectures = [];

            var currentDate = new Date();
            const courses = results[0];
            courses.forEach(course => {
                for (i = 0; i < faker.random.number(10); i++) {
                    lectures.push({
                        title: faker.commerce.productName(),
                        description: faker.lorem.paragraph(5),
                        course: course,
                        date: faker.date.between(new Date(currentDate.getFullYear(), currentDate.getMonth() - 4, currentDate.getDate() - 2), new Date(currentDate.getFullYear(), currentDate.getMonth() + 4, currentDate.getDate() + 2)),
                        length: faker.random.number(359) + 1
                    })
                }
            })
            resolve(lectures);
        })
    })
    .then((lectures) => {
        return new Promise((resolve) => {
            fs.writeFileSync('./seed_files/lectures.json', JSON.stringify(lectures, null, 4));

            seeder.connect(uri, function () {
                let data = [{
                    'model': 'Lecture',
                    'documents': lectures
                }]
                seeder.loadModels([
                    '../models/lecture.model'
                ]);
                seeder.clearModels(['Lecture'], function () {
                    seeder.populateModels(data, function () {

                        Lecture.find().then(allLectures => {
                            allLectures.map(async (lecture, index) => {
                                await Course.findById(lecture.course)
                                    .then(course => {
                                        course.lectures.push(lecture._id);

                                        course.save((err, result) => {
                                            if (index === lectures.length - 1) {
                                                console.log("done adding lecture!");
                                                seeder.disconnect();
                                            }
                                        })
                                    })
                                    .catch(err => console.log(err));
                            })
                        });
                    });
                });
            });
            resolve(lectures);
        });
    });



