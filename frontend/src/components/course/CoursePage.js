import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, Redirect } from "react-router-dom";
import Nav from '../shared/Nav';
import API from '../../utils/API';
import { AuthContext } from '../../context/auth';
import Loading from '../shared/Loading';
import Lecture from './Lectures';
import ConfirmModal from '../ConfirmModal';
import liveIcon from '../../assets/images/live-icon.svg';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LectureForm from './LectureForm';
import CourseForm from './CourseForm';

function CoursePage() {
    let { id } = useParams();
    const { state } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState({});

    useEffect(() => {
        API.getCourse(id)
            .then(function (response) {
                // handle success
                const data = response.data;
                 
                setCourse(data);
                setLoading(false);
            })
            .catch(function (error) {
                // handle error
                 
            });
    }, [course._id, loading]);

    var liveLectures = undefined;
    var isMaster = undefined;
    var enrolled = undefined;
    var sortedLearners = undefined;
    if (course.lectures) {
        liveLectures = course.lectures.filter(lecture => new Date(lecture.date) > new Date());
        isMaster = state.user._id === course.master._id;
        enrolled = course.learners.map(learner => learner._id).includes(state.user._id);
        sortedLearners = course.learners.sort((a, b) => a.firstName.localeCompare(b.firstName)).filter(learner => learner._id !== state.user._id);
        if (enrolled) {
            sortedLearners.unshift(state.user);
        }
    }

    const archive = function () {
        API.archive(course._id, state.user._id)
            .then(function (response) {
                // handle success
            })
            .catch(function (error) {
                // handle error
                 
            });
    }

    const register = function () {
        API.register(course._id, state.user._id)
            .then(function (response) {
                // handle success
            })
            .catch(function (error) {
                // handle error
                 
            });
    }

    const unregister = function () {
        API.unregister(course._id, state.user._id)
            .then(function (response) {
                // handle success
            })
            .catch(function (error) {
                // handle error
                 
            });
    }

    const deleteCourse = function () {
        API.deleteCourse(course._id)
        .then(function (response) {
            // handle success
        })
        .catch(function (error) {
            // handle error
             
        });
    }

    const rerender = function() {
        setLoading(true);
    }

    return (
        <div className="course-dashboard d-flex">
            <Nav toggle="course" />
            <div className="course-info overflow-auto w-75">
                {!loading &&
                    <>
                        <div className="course-header d-flex">
                            <div className="course-header-info w-100 d-flex flex-column justify-content-between mt-4 mb-2 mx-2">
                                <h1 className="font-weight-bold align-self-center mt-5 course-title">{course.title.toUpperCase()}</h1>
                                <div className="course-actions d-flex justify-content-between align-items-end">
                                    <div className="course-btns d-flex">
                                        <CourseButton isMaster={isMaster} isArchived={course.isArchived} enrolled={enrolled} course={course} archive={archive} register={register} unregister={unregister} rerender={rerender} />
                                        {isMaster && <>
                                            <button className="btn btn-lg btn-warning rounded-0 font-weight-bold" data-toggle="modal" data-target={`#editCourse${course._id}`}>EDIT</button>
                                            <CourseForm id={`editCourse${course._id}`} course={course} rerender={rerender} />
                                        </>}
                                    </div>
                                    <div className="master-info d-flex align-items-end align-self-end">
                                        <div className="text-right master-info-name">
                                            <small>Taught By</small>
                                            <h5>{course.master.firstName + ' ' + course.master.lastName}</h5>
                                        </div>
                                        <img src={"https://picsum.photos/350?random=" + course.master._id} alt="course image" className="profile-pic ml-3" />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <div className="course-container p-5">
                            <div className="course-description overflow-auto">
                                <p className="text-muted">Estimated duration: {course.courseLength} months</p>
                                <p className="text-muted">{liveLectures.length} lectures remaining</p>
                                <h4 className="mt-2">{course.description || 'No description'}</h4>
                            </div>
                            <div className="course-content d-flex mt-5">
                                <div className="course-lectures w-100">
                                    <div className="d-flex justify-content-between align-items-center mb-4 w-100">
                                        <div className="d-flex align-items-center">
                                            <h2 className="font-weight-bold mr-2" style={{color: "#2a9d8f"}}>LECTURES</h2>
                                            {isMaster && <AddLectureButton course={course} rerender={rerender} /> }
                                        </div>
                                        {!course.isArchived && course.isLive && <img src={liveIcon} className="mr-2" alt="LIVE" height="25px" />}
                                        {course.isArchived && <h4 className="text-dark">ARCHIVED</h4>}
                                    </div>
                                    <div className="d-flex w-100">
                                        <div className="accordion w-75" id="lectureAccordion">
                                            {course.lectures.sort((a, b) => new Date(b.date) - new Date(a.date)).map((lecture, index) => <Lecture course={course} lecture={lecture} key={index} index={index} user={state.user} rerender={rerender} />)}
                                        </div>
                                        <div className="course-learners card rounded-0 ml-2">
                                            <div className="card-body mx-0 px-0">
                                                <h4 className="text-center mb-4 font-weight-bolder">ENROLLED LEARNERS</h4>
                                                <div className="list-group">
                                                    {sortedLearners.map((learner, index) => <Learner learner={learner} key={index} index={index} enrolled={enrolled} />)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isMaster && 
                            <>
                            <button className="btn btn-lg w-100 btn-delete-course font-weight-bold" data-toggle="modal" data-target="#delete">DELETE COURSE</button>
                            <ConfirmModal id="delete" title="Confirm Deletion" description={`Are you sure that you want to delete the course ${course.title}? This action cannot be undone.`} handleSubmit={deleteCourse} redirectRoute={'/master'} />
                            </>
                        }
                    </>
                }
                {loading && <Loading />}
            </div>
        </div>

    );
}

function CourseButton(props) {
    if (props.isMaster) {
        if (!props.isArchived) {
            const id = "archive"
            return (
                <>
                    <button className="course-archive-btn btn btn-lg mr-2" data-toggle="modal" data-target={`#${id}`}>ARCHIVE</button>
                    <ConfirmModal id={id} title="Confirm Archive" description={`Are you sure that you want to archive the course ${props.course.title}? This action cannot be undone.`} handleSubmit={props.archive} rerender={props.rerender} />
                </>
            );
        } else {
            return null;
        }
    } else {
        if (!props.enrolled) {
            const id = "register";
            return (
                <>
                    <button className="course-register-btn btn btn-lg" data-toggle="modal" data-target={`#${id}`}>REGISTER</button>
                    <ConfirmModal id={id} title="Confirm Registration" description={`Are you sure that you want to register for the course ${props.course.title}?`} handleSubmit={props.register} rerender={props.rerender} />
                </>
            );
        } else {
            const id = "unregister";
            return (
                <>
                    <button className="course-unregister-btn btn btn-lg" data-toggle="modal" data-target={`#${id}`}>UNREGISTER</button>
                    <ConfirmModal id={id} title="Confirm Unregistration" description={`Are you sure that you want to unregister from the course ${props.course.title}?`} handleSubmit={props.unregister} rerender={props.rerender} />
                </>
            );
        }
    }
}

function AddLectureButton(props) {
    return (
        <>
        <div className="btn" data-toggle="modal" data-target="#lectureForm">
            <FontAwesomeIcon icon={faPlusCircle} size="lg" color="#2a9d8f"/>
        </div>
        <LectureForm course={props.course} rerender={props.rerender} />
        </>
    );
}


function Learner(props) {
    return (
        <Link to={`/users/${props.learner._id}`}>
            <div className={"list-group-item d-flex border-0 rounded-0 align-items-center" + (props.enrolled && props.index === 0 ? " user-myself" : "")}>
                <img src={"https://picsum.photos/350?random=" + props.learner._id} alt="course image" className="profile-pic mr-3" />
                <h5>{props.learner.firstName + ' ' + props.learner.lastName}</h5>
            </div>
        </Link>
    );
}


export default CoursePage;