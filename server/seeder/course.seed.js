var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const seeder = require('mongoose-seed');
const faker = require('faker');
const fs = require('fs');
const _ = require('lodash');
const async = require('async');

require('dotenv').config({ path: '../.env' });

const User = require('../models/user.model');

const uri = process.env.ATLAS_URI;

new Promise((resolve) => {
    mongoose.connect(uri, {
        useUnifiedTopology: true,
        promiseLibrary: require('bluebird')
    });
    async.parallel([
        (callback) => {
            User.find()
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
            let courses = [];
            for (i = 0; i < 500; i++) {
                var masterId = _.sample(results[0])._id;

                courses.push({
                    title: faker.commerce.productName(),
                    description: faker.lorem.paragraph(),
                    master: masterId,
                    courseLength: faker.random.number(24),
                    isLive: false,
                    isArchived: _.sample([true, false]),
                    learners: _.sampleSize(results[0], faker.random.number(100)).filter(user => user._id !== masterId)
                });
            }
            resolve(courses);
        })
    })
    .then((courses) => {
        return new Promise((resolve) => {
            fs.writeFileSync('./seed_files/courses.json', JSON.stringify(courses, null, 4));

            seeder.connect(uri, function () {
                let data = [{
                    'model': 'Course',
                    'documents': courses
                }]
                seeder.loadModels([
                    '../models/course.model'
                ]);
                seeder.clearModels(['Course'], function () {
                    seeder.populateModels(data, function () {
                        seeder.disconnect();
                    });
                });
            });
            resolve(courses);
        });
    })



