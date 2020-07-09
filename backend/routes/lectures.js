const router = require('express').Router({ mergeParams: true });
let Course = require('../models/course.model');
let Lecture = require('../models/lecture.model');

// COLLECTION routes

// GET /lectures
// GET /courses/:courseId/lectures
router.route('/').get((req, res) => {
    if (req.params.courseId) {
        Lecture.find({ course: req.params.courseId })
            .then(lectures => res.json(lectures))
            .catch(err => res.status(400).json('Error: ' + err));
    } else {
        Lecture.find()
            .then(lectures => res.json(lectures))
            .catch(err => res.status(400).json('Error: ' + err));
    }
});

// DELETE /lectures
router.route('/').delete((req, res) => {
    Lecture.deleteMany({})
        .then(() => res.json('All lectures deleted!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Nested for MASTER USERS

// GET /lectures/:id
router.route('/:id').get((req, res) => {
    Lecture.findById(req.params.id)
        .then(lecture => res.json(lecture))
        .catch(err => res.status(400).json('Error: ' + err));
});

/*
    "title": String,
    "description": String, [optional]
    "date": Date,
    "length": integer
*/
// POST /courses/:courseId/lectures
router.route('/').post((req, res) => {
    console.log(req);
    const title = req.body.title;
    const description = req.body.description;
    Course.findById(req.params.courseId)
        .then(courseFound => {
            if (!courseFound || courseFound == null) {
                res.status(400).json(`Error: Course ${req.params.courseId} not found.`);
                return;
            }
            const course = req.params.courseId;
            const date = req.body.date instanceof Date ? req.body.date : new Date(req.body.date);
            const length = req.body.length;

            const newLecture = new Lecture({
                title,
                description,
                course,
                date,
                length
            });

            newLecture.save()
                .then(lecture => {

                    Course.findById(lecture.course)
                        .then(course => {
                            course.lectures.push(lecture._id);

                            course.save()
                                .then(() => res.json('Lecture added!'))
                                .catch(err => res.status(400).json('Error: ' + err));
                        })
                        .catch(err => res.status(400).json('Error: ' + err));
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));


});

// PUT /lectures/:id
router.route('/:id').put((req, res) => {
    console.log(req);
    Lecture.findById(req.params.id)
        .then(lecture => {
            console.log(lecture);
            if (req.body.title) lecture.title = req.body.title;
            if (req.body.description) lecture.description = req.body.description;

            if (req.body.courseId) {
                res.status(400).json(`Error: Cannot modify course attached. Please delete lecture instead.`);
                return;
            }

            if (req.body.date) {
                const newDate = req.body.date instanceof Date ? req.body.date : new Date(req.body.date);
                if (newDate.getTime() <= new Date().getTime()) {
                    res.status(400).json(`Error: The start date must be further than today's date`);
                    return;
                } else {
                    lecture.date = newDate;
                    lecture.markModified('date');
                }
            }

            if (req.body.length) lecture.length = req.body.length;

            lecture.save()
                .then(() => res.json(`Lecture ${req.params.id} updated!`))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE /lectures/:id
router.route('/:id').delete((req, res) => {
    Lecture.findOneAndDelete({ _id: req.params.id})
        .then(() => {
            Course.updateOne({ lectures: req.params.id }, { $pull: { lectures: req.params.id } }).exec();
            res.json(`Lecture ${req.params.id} deleted!`)
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;