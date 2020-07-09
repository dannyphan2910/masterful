import React from 'react';
import liveIcon from '../../assets/images/live-icon.svg';
import { Link } from 'react-router-dom';

export default function CourseRow(props) {
    return (
        <div className="mb-5">
            <div className="d-flex align-items-center mb-5">
                <h1 className="font-weight-bold mr-5">{props.title}</h1>
                {props.title.split(" ")[0].toLowerCase() === 'streaming' && <img src={liveIcon} alt="LIVE" height="30px" />}
            </div>
            <div className="card-deck course-card-deck pb-4">
                {props.courses.map(course => <CourseCard course={course} key={course._id} />)}
            </div>
        </div>
    );
}

function CourseCard(props) {
    return (
        <div className="card course-card shadow">
            <img src={"https://picsum.photos/350?random=" + props.course._id} alt="course image" className="card-img-top course-card-img-top" />
            <Link to={'/courses/' + props.course._id}>
                <div className="card-body">
                    <h5 className="card-title font-weight-bold">{props.course.title}</h5>
                    <p className="card-text">{(props.course.description || '').substring(0, 125) + "..."}</p>
                    <p className="card-text"><small className="text-muted">{props.course.learners.length} enrolled</small></p>
                </div>
            </Link>
        </div>
    );
}