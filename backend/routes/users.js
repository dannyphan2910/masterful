const router = require('express').Router();
const coursesRouter = require('./courses');
let User = require('../models/user.model');
let Course = require('../models/course.model');
let Lecture = require('../models/lecture.model');

const bcrypt = require('bcrypt');
const saltRounds = 10;

// COLLECTION routes

// GET /users
router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

// POST /users
router.route('/').post((req, res) => {
    console.log(req);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const passwordPlain = req.body.password;
    const password = bcrypt.hashSync(passwordPlain, saltRounds);

    const newUser = new User({
        firstName,
        lastName,
        email,
        password
    });

    newUser.save()
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE /users
router.route('/').delete((req, res) => {
    User.deleteMany({})
        .then(() => {
            Course.deleteMany({}).then(() => console.log('All courses deleted')).catch(err => res.status(400).json('Error: ' + err));
            Lecture.deleteMany({}).then(() => console.log('All lectures deleted')).catch(err => res.status(400).json('Error: ' + err));
            res.json('All users deleted!')
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// SINGLE USER routes

// GET /users/:id
router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

// PUT /users/:id
router.route('/:id').put((req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (req.body.firstName) user.firstName = req.body.firstName;
            if (req.body.lastName) user.lastName = req.body.lastName;
            if (req.body.email) user.email = req.body.email;
            if (req.body.password) {
                const passwordPlain = req.body.password;
                const password = bcrypt.hashSync(passwordPlain, saltRounds);
                user.password = password
            }

            user.save()
                .then(() => res.json(`User ${req.params.id} updated!`))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE /users/:id
router.route('/:id').delete((req, res) => {
    User.findOneAndDelete({_id: req.params.id})
        .then(() => res.json(`User ${req.params.id} deleted!`))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Nested for MASTER USERS
router.use('/:masterId/courses', coursesRouter);

module.exports = router;