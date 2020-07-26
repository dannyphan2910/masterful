import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPlay } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import LectureForm from './LectureForm';
import ConfirmModal from '../ConfirmModal';
import API from '../../utils/API';

function Lecture(props) {
    const isMaster = props.user._id === props.course.master._id;
    const isActive = new Date(props.lecture.date) > new Date();
    const enrolled = props.course.learners.map(learner => learner._id).includes(props.user._id);

    const deleteLecture = function () {
        API.deleteLecture(props.lecture._id)
            .then(function (response) {
                // handle success
                const data = response.data;
                 
            })
            .catch(function (error) {
                // handle error
                 
            });
    }

    return (
        <div className="card rounded-0">
            <div className="card-header bg-white d-flex justify-content-between align-items-center" id={"heading" + props.index}>
                <div>
                    <span className={isActive ? "text-success" : "text-danger"}>&#9679;</span>
                    <button className="btn btn-link text-left btn-toggle-lecture" type="button" data-toggle="collapse" data-target={"#collapse" + props.index}>
                        <h5>{props.lecture.title}</h5>
                        <p className="text-muted">Date: {new Date(props.lecture.date).toLocaleString()}</p>
                    </button>
                </div>
                <button className="btn btn-lg border-0">
                    <LectureButton isActive={isActive} isMaster={isMaster} isLive={props.course.isLive} courseId={props.course._id} lectureId={props.lecture._id} enrolled={enrolled} />
                </button>
            </div>

            <div id={"collapse" + props.index} className="collapse" aria-labelledby={"heading" + props.index} data-parent="#lectureAccordion">
                <div className="card-body">
                    {isActive ? <h6 className="text-success">ACTIVE</h6> : <h6 className="text-danger">INACTIVE</h6>}
                    <p className="text-muted">Estimated {props.lecture.length} minutes</p>
                    <p>{props.lecture.description}</p>
                    {isMaster &&
                        <div className="lecture-btns d-flex mt-2">
                            {isActive &&
                                <>
                                    <button className="btn btn-primary btn-edit-lecture mr-3" data-toggle="modal" data-target={`#lectureFormEdit${props.lecture._id}`}>EDIT</button>
                                    <LectureForm course={props.course} lecture={props.lecture} id={`lectureFormEdit${props.lecture._id}`} rerender={props.rerender} />
                                </>
                            }
                            <>
                                <button className="btn btn-primary btn-delete-lecture" data-toggle="modal" data-target={`#lectureFormDelete${props.lecture._id}`}>DELETE</button>
                                <ConfirmModal id={`lectureFormDelete${props.lecture._id}`} title="Confirm Deletion" description={`Are you sure that you want to delete the lecture ${props.lecture.title}? This action cannot be undone.`} handleSubmit={deleteLecture} rerender={props.rerender} />
                            </>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

function LectureButton(props) {
    if (!props.isMaster && !props.enrolled) {
        return (
            <span className="h6 ml-2">NOT ENROLLED</span>
        );
    }
    if (props.isActive) {
        if (props.isMaster) {
            return (
                <div>
                    {!props.isLive && <Link to={`/courses/${props.courseId}/lectures/${props.lectureId}`}><div className="btn btn-lg btn-lecture-icon"><FontAwesomeIcon icon={faVideo} color="white" /> <span className="h6 ml-2">START LECTURE</span></div></Link>}
                    {props.isLive && <div className="btn btn-lg btn-lecture-icon disabled"><FontAwesomeIcon icon={faVideo} /> <span className="h6 ml-2">IN SESSION</span></div>}
                </div>

            )
        } else {
            return (
                <div className="d-flex align-items-center">
                    {props.isLive && <Link to={`/courses/${props.courseId}/lectures/${props.lectureId}`}><div className="btn btn-lg btn-lecture-icon"><FontAwesomeIcon icon={faVideo} color="green" /> <span className="h6 ml-2">JOIN LECTURE</span></div></Link>}
                    {!props.isLive && <div className="btn btn-lg btn-lecture-icon disabled"><FontAwesomeIcon icon={faVideo} /> <span className="h6 ml-2">NOT AVAILABLE</span></div>}
                </div>
            )
        }
    } else {
        return (
            <a href="https://www.youtube.com/watch?v=7X8II6J-6mU" target="_blank">
                <div className="btn btn-lg btn-replay-icon">
                    <FontAwesomeIcon icon={faPlay} /> <span className="h6 ml-2">REPLAY</span>
                </div>
            </a>
        )
    }
}

export default Lecture;