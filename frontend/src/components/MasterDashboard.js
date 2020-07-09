import React, { useContext, useEffect, useState } from 'react';
import API from '../utils/API';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import Nav from './shared/Nav';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    DayView,
    WeekView,
    Appointments,
    Toolbar,
    ViewSwitcher,
    CurrentTimeIndicator,
    AppointmentTooltip
} from '@devexpress/dx-react-scheduler-material-ui';
import Loading from './shared/Loading';
import CourseForm from './course/CourseForm';

function MasterDashboard() {
    const { state } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        API.getMasterCourses(state.user._id)
            .then(function (response) {
                // handle success
                const data = response.data;
                setCourses(data);

                var thisWeekLectures = [];
                data.forEach(course => {
                    const lectures = course.lectures;
                    const weekLectures = lectures.filter(lecture => {
                        const thisDate = new Date(lecture.date);
                        const startOfWeek = moment().startOf('isoWeek').subtract(1, 'd').toDate(); 
                        const endOfWeek = moment().endOf('isoWeek').subtract(1, 'd').toDate();
                        return startOfWeek <= thisDate && thisDate <= endOfWeek;
                    });

                    const reformatted = weekLectures.map(lecture => {
                        const thisDate = new Date(lecture.date);
                        return {
                            title: `${lecture.title} (${course.title})` ,
                            startDate: thisDate,
                            endDate: moment(thisDate).add(lecture.length, 'm').toDate()
                        }
                    });
        
                    thisWeekLectures = thisWeekLectures.concat(reformatted);
                })
                setSchedule(thisWeekLectures);
                setLoading(false);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }, [loading]);

    const rerender = function() {
        setLoading(true);
    }

    const unarchivedCourses = courses.filter(course => !course.isArchived);
    const archivedCourses = courses.filter(course => course.isArchived);

    return (
        <div className="master-dashboard d-flex">
            <Nav toggle="master" />
            <div className="course-info p-5 overflow-auto w-75">
                {!loading &&
                    <>
                        <div className="intro mb-3">
                            <h2 className="font-weight-bold mb-3">Good Day, {state.user.firstName}</h2>
                            <h3>You have {schedule.length} lectures this week.</h3>
                            <h5>Learn more about your Masterful experience?</h5>
                        </div>

                        <Schedule schedule={schedule} />

                        <div className="teaching mt-5">
                            <h1 className="font-weight-bold mb-2">MY COURSES</h1>
                            <button className="btn btn-lg btn-primary btn-add-course" data-toggle="modal" data-target="#courseForm">Teach A Course</button>
                            <CourseForm rerender={rerender} />
                            <div className="live-courses mt-5">
                                <a className="h3" data-toggle="collapse" href="#liveCourses">LIVE COURSES</a>
                                <div id="liveCourses" className="mt-3">
                                    {unarchivedCourses.map(course => <MasterCard course={course} key={course._id} />)}
                                </div>
                            </div>
                            <div className="not-live-courses mt-5">
                                <a className="h3" data-toggle="collapse" href="#notLiveCourses">COMPLETED COURSES</a>
                                <div id="notLiveCourses" className="mt-3">
                                    {archivedCourses.map(course => <MasterCard course={course} key={course._id} />)}
                                </div>
                            </div>
                            
                        </div>
                    </>}
                {loading && <Loading />}
            </div>
        </div>
    );
}

function Schedule(props) {
    const shadePreviousCells = true;
    const shadePreviousAppointments = true;
    const updateInterval = 1000;

    console.log(props.schedule);
    return (
        <div className="shadow-lg">
        <Paper>
            <Scheduler data={props.schedule} height={660}>
                <ViewState
                    defaultCurrentDate={Date.now()}
                    defaultCurrentViewName="Week"
                />

                <DayView startDayHour={8} endDayHour={23} />
                <WeekView startDayHour={8} endDayHour={23} />

                <Toolbar />
                <ViewSwitcher />
                <Appointments />
                <AppointmentTooltip
                    showCloseButton
                />

                <CurrentTimeIndicator
                    shadePreviousCells={shadePreviousCells}
                    shadePreviousAppointments={shadePreviousAppointments}
                    updateInterval={updateInterval}
                />
            </Scheduler>
        </Paper>
        </div>
    );
}

function MasterCard(props) {
    return (
        <div className="master-card card mb-3 shadow-lg">
            <div className="d-flex h-100">
                    <img src={"https://picsum.photos/1000?random=" + props.course._id} alt="course image" />
                    <Link to={'/courses/' + props.course._id}>
                        <div className="card-body h-100 d-flex flex-column justify-content-between">
                            <h4 className="card-title font-weight-bold">{props.course.title}</h4>
                            <p className="card-text">{props.course.description}</p>
                            <p className="card-text"><small className="text-muted">{props.course.learners.length} enrolled</small></p>
                        </div>
                    </Link>
            </div>
        </div>
    );
}

export default MasterDashboard;