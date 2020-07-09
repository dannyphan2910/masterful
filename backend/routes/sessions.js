const router = require('express').Router();
let User = require('../models/user.model');

const bcrypt = require('bcrypt');

/*
    "email": String,
    "password": String
*/
// POST /sessions
router.route('/').post((req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                res.status(400).json('Error: User not found');
            }
            // Load hash from your password DB
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.json(user);
            } else {
                res.status(400).json('Error: Invalid password');
                return;
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;