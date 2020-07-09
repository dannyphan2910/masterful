const router = require('express').Router({ mergeParams: true });
const lecturesRouter = require('./lectures');
let User = require('../models/user.model');
let Course = require('../models/course.model');

// COLLECTION routes

// GET /courses
// GET /users/:masterId/courses
router.route('/').get((req, res) => {
    if (req.params.masterId) {
        Course.find({ master: req.params.masterId }).populate('master').populate('learners').populate('lectures').sort('title')
            .then(courses => res.json(courses))
            .catch(err => res.status(400).json('Error: ' + err));
    } else {
        Course.find().populate('master').populate('learner').populate('lectures').sort('title')
            .then(courses => res.json(courses))
            .catch(err => res.status(400).json('Error: ' + err));
    }
});

// DELETE /courses
router.route('/').delete((req, res) => {
    Course.deleteMany({})
        .then(() => res.json("All courses deleted!"))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Nested for MASTER USERS

// GET /courses/:id
router.route('/:id').get((req, res) => {
    Course.findById(req.params.id).populate('master').populate('learners').populate('lectures')
        .then(course => res.json(course))
        .catch(err => res.status(400).json('Error: ' + err));
});

/*
    "title": String,
    "description": String, [optional]
    "courseLength": integer, 
    "isLive": boolean, [optional]
    "isArchived": boolean [optional]
    "paymentType": integer,
    "cost": integer [optional]
*/
// POST /users/:masterId/courses
router.route('/').post((req, res) => {
    console.log(req);
    const title = req.body.title;
    const description = req.body.description;
    User.findById(req.params.masterId)
        .then(masterFound => {
            if (!masterFound || masterFound == null) {
                res.status(400).json(`Error: User ${req.params.masterId} not found.`);
            } else {
                const master = req.params.masterId;
                const learners = []
                const courseLength = req.body.courseLength;
                const isLive = req.body.isLive || false;
                const isArchived = req.body.isArchived || false;

                const newCourse = new Course({
                    title,
                    description,
                    master,
                    learners,
                    courseLength,
                    isLive,
                    isArchived
                });

                newCourse.save()
                    .then(() => res.json('Course added!'))
                    .catch(err => res.status(400).json('Error: ' + err));
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// PUT /courses/:id
router.route('/:id').put((req, res) => {
    Course.findById(req.params.id)
        .then(course => {
            if (req.body.title) course.title = req.body.title;
            if (req.body.description) course.description = req.body.description;
            if (req.body.maxAttendance) course.maxAttendance = req.body.maxAttendance;
            if (req.body.courseLength) course.courseLength = req.body.courseLength;
            if (req.body.weekFrequency) course.weekFrequency = req.body.weekFrequency;
            course.isLive = req.body.isLive || false;
            course.isArchived = req.body.isArchived || false;
            
            course.save()
                .then(() => res.json(`Course ${req.params.id} updated!`))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE /courses/:id
router.route('/:id').delete((req, res) => {
    Course.findOneAndDelete({ _id: req.params.id })
        .then(() => res.json(`Course ${req.params.id} deleted!`))
        .catch(err => res.status(400).json('Error: ' + err));
});

// ENROLL - UNENROLL

/*
    "userId": String,
    "courseId": String [optional - should be in route]
*/
// POST /courses/:id/enrollments
router.route('/:id/enrollments').post((req, res) => {
    User.findById(req.body.userId)
        .then(user => {
            Course.findById(req.params.id || req.body.courseId)
                .then(course => {
                    if (course.master.equals(user._id)) {
                        res.status(400).json(`Error: User ${user._id} is teaching Course ${req.params.id}!`);
                        return;
                    }

                    if (course.learners.includes(user._id)) {
                        res.status(400).json(`Error: User ${user._id} already enrolled in Course ${req.params.id}!`);
                        return;
                    }

                    course.learners.push(user._id);

                    course.save()
                        .then(() => res.json(`User ${user._id} added to Course ${req.params.id}!`))
                        .catch(err => res.status(400).json('Error: ' + err));
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/*
    "userId": String,
    "courseId": String [optional - should be in route]
*/
// DELETE /courses/:id/enrollments
router.route('/:id/enrollments').delete((req, res) => {
    User.findById(req.body.userId)
        .then(user => {
            Course.findById(req.params.id || req.body.courseId)
                .then(course => {
                    if (course.master.equals(user._id)) {
                        res.status(400).json(`Error: User ${user._id} is teaching Course ${req.params.id}!`);
                        return;
                    }

                    if (!course.learners.includes(user._id)) {
                        res.status(400).json(`Error: User ${user._id} is not enrolled in Course ${req.params.id}!`);
                        return;
                    }

                    course.learners = course.learners.pull(user._id)

                    course.save()
                        .then(() => res.json(`User ${user._id} removed from Course ${req.params.id}!`))
                        .catch(err => res.status(400).json('Error: ' + err));
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// Nested for LECTURES
router.use('/:courseId/lectures', lecturesRouter);

// Learner Dashboard routes
/*
    "keyword": String
*/
// POST /courses/search
router.route("/search").post((req, res) => {
    Course.find().or([{ title: { $regex: req.body.keyword, $options: "i" } }])
        .then(courses => res.json(courses))
        .catch(err => res.status(400).json('Error: ' + err));
});

/*
    "numCourses": integer [optional]
*/
// POST /users/:masterId/courses/meta
router.route("/meta").post((req, res) => {
    const numCourses = req.body.numCourses || 6

    User.findById(req.params.masterId)
        .then(user => {
            var result = {}

            // In Progress
            Course.find({ learners: user._id }).limit(numCourses).sort('title')
                .then(inProgressCourses => {
                    result["progress"] = inProgressCourses;

                    // Suggested 4 You
                    var titles = inProgressCourses.map(course => course.title).map(title => title.split(" ")).flat(1);
                    var regex = '/'
                    titles.forEach(title => regex += title.toLowerCase() + '|')
                    regex = regex.substring(0, regex.length - 1) + '/'

                    Course.find({ title: { $regex: regex, $options: 'i' }, learners: { $nin: user } }).limit(numCourses).sort('title')
                        .then(suggestedCourses => {
                            result["suggested"] = suggestedCourses;

                            // Streaming Now
                            Course.find({ isLive: true }).limit(numCourses).sort('title')
                                .then(streamingCourses => {
                                    result["streaming"] = streamingCourses;

                                    // Trending Now
                                    Course.aggregate(
                                        [
                                            {
                                                "$project": {
                                                    "title": 1,
                                                    "description": 1,
                                                    "master": 1,
                                                    "learners": 1,
                                                    "lectures": 1,
                                                    "maxAttendance": 1,
                                                    "courseLength": 1,
                                                    "weekFrequency": 1,
                                                    "isLive": 1,
                                                    "learnersCount": { "$size": "$learners" }
                                                }
                                            },
                                            { "$sort": { "learnersCount": -1, "title": 1 } },
                                            { "$limit": numCourses }
                                        ])
                                        .then(trendingCourses => {
                                            result["trending"] = trendingCourses;
                                            res.json(result);
                                        })
                                        .catch(err => res.status(400).json('Error: ' + err));
                                })
                                .catch(err => res.status(400).json('Error: ' + err));

                        })
                        .catch(err => res.status(400).json('Error: ' + err));
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// POST /users/:masterId/courses/progress
router.route("/progress").post((req, res) => {
    User.findById(req.params.masterId)
        .then(user => {
            Course.find({ learners: user._id }).sort('title')
                .then(inProgressCourses => {
                    res.json(inProgressCourses);
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;